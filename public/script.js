/**
 * Infinite Scroll Blog
 * Loads posts from JSON and implements infinite scrolling
 */

(function() {
    'use strict';

    // Configuration
    const POSTS_PER_PAGE = 5;
    const SCROLL_THRESHOLD = 200;

    // State
    let allPosts = [];
    let displayedCount = 0;
    let isLoading = false;
    let hasMorePosts = true;
    const machineTranslationCache = new Map();

    // DOM Elements
    const container = document.getElementById('posts-container');
    const loadingEl = document.getElementById('loading');
    const endMessageEl = document.getElementById('end-message');
    const totalPostsEl = document.getElementById('total-posts');

    async function init() {
        try {
            const response = await fetch('posts.json');
            if (!response.ok) {
                throw new Error('Failed to load posts');
            }
            allPosts = await response.json();
            totalPostsEl.textContent = allPosts.length;
            loadMorePosts();
            setupInfiniteScroll();
        } catch (error) {
            console.error('Error loading posts:', error);
            container.innerHTML = `
                <div class="post-card">
                    <p>Error loading posts. Please refresh the page to try again.</p>
                </div>
            `;
            loadingEl.style.display = 'none';
        }
    }

    function loadMorePosts() {
        if (isLoading || !hasMorePosts) return;

        isLoading = true;
        loadingEl.classList.remove('hidden');

        setTimeout(() => {
            const start = displayedCount;
            const end = Math.min(start + POSTS_PER_PAGE, allPosts.length);
            const postsToLoad = allPosts.slice(start, end);

            postsToLoad.forEach((post, index) => {
                const postEl = createPostElement(post, start + index);
                container.appendChild(postEl);
            });

            displayedCount = end;

            if (displayedCount >= allPosts.length) {
                hasMorePosts = false;
                loadingEl.style.display = 'none';
                endMessageEl.style.display = 'block';
            }

            isLoading = false;
        }, 300);
    }

    function createPostElement(post, index) {
        const article = document.createElement('article');
        article.className = 'post-card';
        article.style.animationDelay = `${(index % POSTS_PER_PAGE) * 0.1}s`;

        const canAutoTranslate = containsHindiText(post.title + ' ' + stripHtml(post.content || ''));
        const title = escapeHtml(post.title);
        const englishContent = post.content || '<p>No content available.</p>';

        let contentMarkup = `<div class="post-content">${englishContent}</div>`;

        const hasPreTranslatedEnglish = Boolean(post.english_title || post.english_content);

        if (canAutoTranslate || hasPreTranslatedEnglish) {
            const hindiContent = post.content || '<p>कोई सामग्री उपलब्ध नहीं है।</p>';
            contentMarkup = `
                <div class="translation-panels" data-show-english="false" data-auto-translate="${String(canAutoTranslate)}" data-has-pretranslated="${String(hasPreTranslatedEnglish)}" data-slug="${escapeHtml(post.slug)}">
                    <div class="translation-panel is-active" data-language="hi">
                        <div class="post-content" lang="hi">${hindiContent}</div>
                    </div>
                    <div class="translation-panel" data-language="en">
                        <div class="post-content" lang="en"><p>${hasPreTranslatedEnglish ? 'Click below to read the saved English translation.' : 'Click the button below to translate this post to English.'}</p></div>
                    </div>
                </div>
                <button class="flip-toggle" type="button" aria-pressed="false">Read in English</button>
            `;
        }

        article.innerHTML = `
            <header class="post-header">
                <h2 class="post-title">
                    ${post.url ? `<a href="${escapeHtml(post.url)}" target="_blank" rel="noopener">${title}</a>` : title}
                </h2>
                <time class="post-date" datetime="${escapeHtml(post.date)}">${escapeHtml(post.formatted_date)}</time>
            </header>
            ${contentMarkup}
            ${post.url ? `
                <div class="original-link">
                    <a href="${escapeHtml(post.url)}" target="_blank" rel="noopener">View original post →</a>
                </div>
            ` : ''}
        `;

        const flipButton = article.querySelector('.flip-toggle');
        if (flipButton) {
            flipButton.addEventListener('click', async () => {
                const panels = article.querySelector('.translation-panels');
                const showingEnglish = panels.dataset.showEnglish === 'true';

                if (!showingEnglish && panels.dataset.autoTranslate === 'true') {
                    const translated = await ensureEnglishTranslation(panels, post);
                    if (!translated) {
                        return;
                    }
                }

                const nextState = !showingEnglish;
                panels.dataset.showEnglish = String(nextState);
                setActiveLanguage(panels, nextState ? 'en' : 'hi');
                flipButton.textContent = nextState ? 'हिंदी में पढ़ें' : 'Read in English';
                flipButton.setAttribute('aria-pressed', String(nextState));
            });
        }

        return article;
    }


    async function ensureEnglishTranslation(panels, post) {
        const slug = panels.dataset.slug;
        const englishPanel = panels.querySelector('[data-language="en"]');
        const button = panels.parentElement.querySelector('.flip-toggle');
        const hasPreTranslated = panels.dataset.hasPretranslated === 'true';

        if (machineTranslationCache.has(slug)) {
            englishPanel.innerHTML = machineTranslationCache.get(slug);
            return true;
        }

        if (hasPreTranslated) {
            const englishMarkup = buildEnglishMarkup(post.english_title, post.english_content);
            machineTranslationCache.set(slug, englishMarkup);
            englishPanel.innerHTML = englishMarkup;
            return true;
        }

        button.disabled = true;
        button.textContent = 'Translating...';

        try {
            const translatedTitle = await translateText(post.title);
            const translatedParagraphs = await translateHtmlToParagraphs(post.content || '');
            const englishMarkup = buildEnglishMarkup(translatedTitle || 'English Translation', translatedParagraphs);

            machineTranslationCache.set(slug, englishMarkup);
            englishPanel.innerHTML = englishMarkup;
            return true;
        } catch (error) {
            console.error('Translation failed:', error);
            englishPanel.innerHTML = '<div class="post-content" lang="en"><p>Translation is unavailable right now. Please try again in a moment.</p></div>';
            return false;
        } finally {
            button.disabled = false;
            button.textContent = 'Read in English';
        }
    }

    function buildEnglishMarkup(title, contentHtml) {
        return `
            <h3 class="translation-heading">${escapeHtml(title || 'English Translation')}</h3>
            <div class="post-content" lang="en">${contentHtml || '<p>No content available.</p>'}</div>
        `;
    }

    function setActiveLanguage(panels, language) {
        const hindiPanel = panels.querySelector('[data-language="hi"]');
        const englishPanel = panels.querySelector('[data-language="en"]');
        hindiPanel.classList.toggle('is-active', language === 'hi');
        englishPanel.classList.toggle('is-active', language === 'en');
    }

    function containsHindiText(text) {
        return /[ऀ-ॿ]/.test(text || '');
    }

    function stripHtml(html) {
        const div = document.createElement('div');
        div.innerHTML = html || '';
        return div.textContent || div.innerText || '';
    }

    async function translateHtmlToParagraphs(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(`<div>${html || ''}</div>`, 'text/html');
        const paragraphNodes = doc.querySelectorAll('p');
        const paragraphTexts = paragraphNodes.length
            ? Array.from(paragraphNodes).map((node) => node.textContent.trim()).filter(Boolean)
            : stripHtml(html).split('\n').map(line => line.trim()).filter(Boolean);

        if (!paragraphTexts.length) {
            return '<p>No content available.</p>';
        }

        const translated = [];
        for (const paragraph of paragraphTexts) {
            translated.push(await translateText(paragraph));
        }

        return translated.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');
    }

    async function translateText(text) {
        if (!text || !text.trim()) {
            return '';
        }

        const endpoint = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=hi|en`;
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error('Translation service unavailable');
        }

        const data = await response.json();
        const translatedText = data?.responseData?.translatedText;
        if (!translatedText) {
            throw new Error('No translation returned');
        }

        return translatedText;
    }


    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function setupInfiniteScroll() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !isLoading && hasMorePosts) {
                        loadMorePosts();
                    }
                });
            }, {
                rootMargin: `0px 0px ${SCROLL_THRESHOLD}px 0px`
            });

            observer.observe(loadingEl);
        } else {
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    if (isLoading || !hasMorePosts) return;

                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const windowHeight = window.innerHeight;
                    const documentHeight = document.documentElement.scrollHeight;

                    if (scrollTop + windowHeight >= documentHeight - SCROLL_THRESHOLD) {
                        loadMorePosts();
                    }
                }, 100);
            }, { passive: true });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
