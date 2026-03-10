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

    // DOM Elements
    const container = document.getElementById('posts-container');
    const loadingEl = document.getElementById('loading');
    const endMessageEl = document.getElementById('end-message');
    const totalPostsEl = document.getElementById('total-posts');

    /**
     * Initialize the blog
     */
    async function init() {
        try {
            const response = await fetch('posts.json');
            if (!response.ok) {
                throw new Error('Failed to load posts');
            }
            allPosts = await response.json();
            totalPostsEl.textContent = allPosts.length;
            
            // Load initial posts
            loadMorePosts();
            
            // Set up infinite scroll
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

    /**
     * Load more posts
     */
    function loadMorePosts() {
        if (isLoading || !hasMorePosts) return;
        
        isLoading = true;
        loadingEl.classList.remove('hidden');
        
        // Simulate a small delay for smooth UX
        setTimeout(() => {
            const start = displayedCount;
            const end = Math.min(start + POSTS_PER_PAGE, allPosts.length);
            const postsToLoad = allPosts.slice(start, end);
            
            postsToLoad.forEach((post, index) => {
                const postEl = createPostElement(post, start + index);
                container.appendChild(postEl);
            });
            
            displayedCount = end;
            
            // Check if we have more posts
            if (displayedCount >= allPosts.length) {
                hasMorePosts = false;
                loadingEl.style.display = 'none';
                endMessageEl.style.display = 'block';
            }
            
            isLoading = false;
        }, 300);
    }

    /**
     * Create a post element
     */
    function createPostElement(post, index) {
        const article = document.createElement('article');
        article.className = 'post-card';
        article.style.animationDelay = `${(index % POSTS_PER_PAGE) * 0.1}s`;
        
        const title = escapeHtml(post.title);
        const content = post.content || '<p>No content available.</p>';
        
        article.innerHTML = `
            <header class="post-header">
                <h2 class="post-title">
                    ${post.url ? `<a href="${escapeHtml(post.url)}" target="_blank" rel="noopener">${title}</a>` : title}
                </h2>
                <time class="post-date" datetime="${escapeHtml(post.date)}">${escapeHtml(post.formatted_date)}</time>
            </header>
            <div class="post-content">
                ${content}
            </div>
            ${post.url ? `
                <div class="original-link">
                    <a href="${escapeHtml(post.url)}" target="_blank" rel="noopener">View original post →</a>
                </div>
            ` : ''}
        `;
        
        return article;
    }

    /**
     * Escape HTML special characters
     */
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Set up infinite scroll
     */
    function setupInfiniteScroll() {
        // Use Intersection Observer if available
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
            // Fallback to scroll event
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

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
