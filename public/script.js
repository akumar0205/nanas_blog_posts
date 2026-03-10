/**
 * Infinite Scroll Blog
 * Loads posts from JSON and implements infinite scrolling
 */

(function() {
    'use strict';

    // Configuration
    const POSTS_PER_PAGE = 5;
    const SCROLL_THRESHOLD = 200;

    const HINDI_TRANSLATIONS = {
        '2017-10-07-meditation-my-experiences': {
            title: 'ध्यान: मेरे अनुभव',
            content: [
                'मैंने blogger.com पर “Meditation: My Experiences” शीर्षक से अपने लेख प्रकाशित किए हैं, “मेरे अनुभव मेरी कविताएँ” ब्लॉग पर।',
                'फेसबुक पर आग्रह होने पर 17 जून से 30 सितम्बर तक अलग-अलग तिथियों पर ऐसे सोलह लेख साझा किए।',
                'मैंने उसमें केवल एक सरल विधि बताई है, जिसे रोज़मर्रा के जीवन में अपनाया जा सकता है।',
                'इसके लिए प्रतिदिन लगभग तीस मिनट चाहिए। मैं स्वयं इसका अभ्यास करता हूँ।',
                'इससे व्यक्ति सहज ही “संतुलित मन” की अवस्था की ओर बढ़ता है और अधिकतर तनावमुक्त व प्रसन्न रह सकता है।'
            ]
        },
        '2017-09-30-meditation-my-experience': {
            title: 'ध्यान: मेरा अनुभव',
            content: [
                'ध्यान में एकाग्रता के माध्यम से हम धीरे-धीरे उस अवस्था तक पहुँचते हैं, जहाँ बाहरी शोर, भीतरी विचार, स्मृतियों की छवियाँ और ब्रह्मांडीय रंग-रूप का आकर्षण भी शांत होने लगता है।',
                'वे कभी-कभी दिखते तो हैं, पर हम उनमें बहते नहीं।',
                'तब मन में संतुलन आता है। जीवन में तनाव बहुत कम रह जाता है।',
                'दैनिक निर्णय अधिक सही होते हैं और जीवन की दिशा स्पष्ट होती जाती है।',
                'यह जीवन का एक अनमोल उपहार है।'
            ]
        },
        '2017-09-23-meditation-my-experiences': {
            title: 'ध्यान: मेरे अनुभव',
            content: [
                '“आत्म-ज्योति” एक ऊर्जा है—वही सृष्टि के अस्तित्व का मूल है और अनेक रंगों व रूपों में उपस्थित है।',
                'ध्यान की एकाग्रता में हम इन रंगों और रूपों की झलक अनुभव करते हैं।',
                'एकाग्रता गहरी होने पर धरती के मटमैले रंग से आकाशी नीलिमा तक की यात्रा भीतर दिखाई देती है।',
                'यह ऊर्जा पृथ्वी में मटमैली, जल में क्रिस्टल-सफेद, अग्नि में लाल/स्वर्णिम, वायु में हरित और आकाश में नीली अनुभूति के रूप में देखी जा सकती है।',
                'जब हम हृदय-धड़कन पर केंद्रित रहकर इन अनुभवों में नहीं बहते, तो वे धीरे-धीरे शांत हो जाते हैं और भीतर एक रिक्तता बचती है।',
                'यह रिक्तता काली पट्टी जैसी है, जिस पर अनावश्यक विचारों, छवियों और स्मृतियों का बोझ धुल जाता है।',
                'तब मन हमारे नियंत्रण में आता है, और यही संतुलित मन की अवस्था है।'
            ]
        },
        '2017-09-17-meditation-my-experiences': {
            title: 'ध्यान: मेरे अनुभव',
            content: [
                'जैसे-जैसे ध्यान का अभ्यास बढ़ता है, एकाग्रता गहरी होती जाती है।',
                'हम बाहरी उत्तेजनाओं, अपने विचारों और स्मृतियों की छवियों से कम प्रभावित होने लगते हैं।',
                'बीते जीवन के दृश्य—प्रकृति, फूल, पौधे, पूर्वज—कभी-कभी सामने आते हैं।',
                'पर यदि हम हृदय-धड़कन पर टिके रहें और केवल साक्षी बनें, तो वे धीरे-धीरे धुंधले पड़ जाते हैं।',
                'बाहरी शोर, भीतरी विचार और छवियाँ उपस्थित रहती हैं, पर हम उनमें बहते नहीं।',
                'यहीं से मन “संतुलन” या “समत्व” की स्थिति में प्रवेश करता है।'
            ]
        },
        '2017-09-09-meditation-my-experiences': {
            title: 'ध्यान: मेरे अनुभव',
            content: [
                'विधि वही है—आराम से बैठना, आँखें बंद करना और हृदय-धड़कन पर ध्यान टिकाना।',
                'एकाग्रता बढ़ने पर हम शोर, आवाज़ और बातचीत के बीच भी शांत रहना सीखते हैं।',
                'इसके बाद विचारों की बाढ़ आती है—कुछ हास्यास्पद, कुछ निरर्थक, कुछ उपयोगी, कुछ अनुपयोगी।',
                'अभ्यास के शुरुआती समय में हम उनसे बहक जाते हैं, पर जागरूकता लौटते ही फिर धड़कन पर लौटना चाहिए।',
                'निरंतर अभ्यास से विचारों का दबाव घटता है और हम उनके दास नहीं रहते।',
                'विचार आवश्यक हैं; वही योजना, प्राथमिकता और उद्देश्य देते हैं।',
                'मूल बात उन्हें दबाना नहीं, बल्कि जागरूक रहकर सार्थक विचार चुनना है।'
            ]
        },
        '2017-09-02-meditation-my-experiences': {
            title: 'ध्यान: मेरे अनुभव',
            content: [
                'जब शरीर को ढीला छोड़ना सीख लें, तब मन को शिथिल करने का अभ्यास करें।',
                'पाँच मिनट आराम से बैठें, आँखें बंद करें और हृदय-धड़कन का अनुभव करें।',
                'अभ्यास से एकाग्रता की विधि स्पष्ट होने लगती है।',
                'एकाग्रता के दौरान शोर, बात-चीत, ध्वनियाँ सुनाई दे सकती हैं, पर धड़कन पर ध्यान होने से वे विचलित नहीं करतीं।',
                'बाद में धड़कन स्पष्ट सुनाई न दे, तब भी भीतर शांति बनी रह सकती है।',
                'ऐसा व्यक्ति जीवन में प्रशंसा, अपमान या कठोर व्यवहार को समझते हुए भी भीतर से कम विचलित होता है और उचित प्रतिक्रिया देता है।'
            ]
        },
        '2017-08-26-meditation-my-experiences': {
            title: 'ध्यान: मेरे अनुभव',
            content: [
                'संतुलित मन के लिए दो बातें आवश्यक हैं—(1) शरीर का विश्राम, (2) मन का विश्राम।',
                'स्वस्थ मन के लिए स्वस्थ शरीर चाहिए; इसके लिए सही दिनचर्या, अच्छी आदतें और नशामुक्त जीवन सहायक हैं।',
                'सबसे बड़ा दोष है अपने शरीर को अनावश्यक कष्ट देना। परिस्थिति के अनुसार स्वयं को सहज रखें।',
                'सुबह खाली पेट शांत वातावरण सर्वोत्तम समय है, हालांकि भोजन के ढाई घंटे बाद भी अभ्यास किया जा सकता है।',
                'बैठने की मुद्रा वही रखें जिसमें आप सबसे अधिक सहज हों—कुर्सी, स्टूल, सोफ़ा या ज़मीन।',
                'धीरे-धीरे शरीर को ढीला छोड़ने की कला विकसित होती है।',
                'यदि सोने से पहले भी यही विश्राम-अभ्यास करें, तो नींद शांत आती है और सुबह तरोताज़गी मिलती है।'
            ]
        },
        '2017-08-19-meditation-my-experiences': {
            title: 'ध्यान: मेरे अनुभव',
            content: [
                '“संतुलित मन” क्या है? ऐसा मन जो शरीर और मन के विश्राम से हल्का और प्रसन्न अनुभव करता है।',
                'ध्यान एक आंतरिक यात्रा है, जिसमें विचारों, स्मृतियों, रंगों, छवियों और अनेक अनुभूतियों का सामना होता है।',
                'अभ्यास और एकाग्रता के साथ हम उन्हें पकड़े बिना आगे बढ़ना सीखते हैं।',
                'समय के साथ वे क्षीण पड़ते जाते हैं।',
                'निरंतर, बिना टूटे अभ्यास से संतुलित मन की अवस्था मिलती है, जिसमें जीवन अधिक शांत और आनंदपूर्ण बनता है।'
            ]
        },
        '2017-08-12-meditation-my-experiences': {
            title: 'ध्यान: मेरे अनुभव',
            content: [
                'हम दो महत्वपूर्ण बातों को समझते हैं—संतुलित मन और ब्रह्मांडीय बुद्धि।',
                'संतुलित मन से लिए गए निर्णय प्रायः सकारात्मक होते हैं और ब्रह्मांडीय व्यवस्था से सामंजस्य रखते हैं।',
                'हमें ऐसा मन विकसित करना सीखना चाहिए जो शांत, स्थिर और जीवन के उतार-चढ़ाव से अप्रभावित रहे।',
                'ध्यान का उद्देश्य यही है—ऐसा संतुलित मन, जिससे हम सही निर्णय लेकर जीवन जी सकें।'
            ]
        },
        '2017-08-05-meditation-my-experiences': {
            title: 'ध्यान: मेरे अनुभव',
            content: [
                'सफलता-विफलता, सुख-दुख—ये जीवन के स्वाभाविक हिस्से हैं; इन्हें पूरी तरह टाला नहीं जा सकता।',
                'हमें अपनी सकारात्मक कल्पना, इच्छाओं और विचारों के साथ जीना सीखना चाहिए।',
                'यही हमें भीतर से ऊर्ध्वगामी बनाता है और भविष्य के आध्यात्मिक आनंद की दिशा देता है।',
                'थोड़ा-बहुत मानसिक विचलन सामान्य है, लेकिन इतना विचलन कि सही निर्णय ही धुँधले पड़ जाएँ—यह उचित नहीं।',
                'हमें परिस्थिति के अनुसार अपना श्रेष्ठ कर्म करना चाहिए, परिणाम से चिपके बिना।',
                'जीवन का मार्गदर्शक यही होना चाहिए।'
            ]
        },
        '2017-07-30-meditation-my-experiences': {
            title: 'ध्यान: मेरे अनुभव',
            content: [
                'हिंदू दर्शन में इसे मस्तिष्क की सूक्ष्मतम ऊर्जा कहा गया है; हिंदी में इसे “मन” कहते हैं।',
                'कल्पना, इच्छा और विचार इसकी शक्तियाँ हैं; यही हमारी इंद्रियों और व्यवहार को दिशा देती हैं।',
                'कहा जाता है कि जब इसकी गहराई सक्रिय होती है, तो हम कहते हैं—“दिल से बोल रहा हूँ” या “दिल से कर रहा हूँ”।',
                'ध्यान (एकाग्रता) के अभ्यास से इन शक्तियों पर नियंत्रण बनता है।',
                'धीरे-धीरे यह स्वभाव बन जाता है और हम इच्छाओं-विचारों के दास नहीं, उनके स्वामी बनते हैं।'
            ]
        },
        '2017-07-22-meditation-my-experiences': {
            title: 'ध्यान: मेरे अनुभव',
            content: [
                'कोई भी असफलता पसंद नहीं करता; वह मानो निजी शोक जैसा लगती है।',
                'हर कार्य में प्रयास, क्षमता, साधन, उनका समन्वय और अंत में भाग्य की भूमिका होती है।',
                'प्रयास और क्षमता पर कुछ हद तक हमारा नियंत्रण होता है, पर सभी साधनों का निष्कलंक समन्वय हमेशा हमारे हाथ में नहीं होता।',
                'भाग्य एक व्यापक शक्ति की तरह काम करता है, जो परिणाम बदल भी सकता है।',
                'जब हम केवल आंशिक रूप से जिम्मेदार होते हुए भी सबकुछ अपने सिर ले लेते हैं, तो सुख-दुख और तनाव में झूलते रहते हैं।',
                'इसलिए असफलता का विश्लेषण करें, कमी पहचानें, उसे सुधारें और नई रणनीति बनाएँ।'
            ]
        },
        '2017-07-15-meditation-my-experiences': {
            title: 'ध्यान: मेरे अनुभव',
            content: [
                'हम ब्रह्मांड का ही अंश हैं; दिव्य चेतना हमारे दैनिक निर्णयों में सूक्ष्म मार्गदर्शन देती है।',
                'हर जीव का अपना स्वभाव, क्षमता, साधन और परिस्थिति होती है।',
                'निर्णय इन्हीं सबको ध्यान में रखकर लेने होते हैं।',
                'परिणाम अनुकूल भी हो सकते हैं और प्रतिकूल भी; कई बार परिस्थितियाँ हमारी अपेक्षा से अलग मुड़ जाती हैं।',
                'तब मन कभी प्रसन्न, कभी चिंतित, कभी तनावग्रस्त होता है।',
                'जीवन इन्हीं झूलों के बीच चलता है; ध्यान हमें संतुलन की ओर लौटना सिखाता है।'
            ]
        },
        '2017-07-08-meditation-my-experiences': {
            title: 'ध्यान: मेरे अनुभव',
            content: [
                'दिव्य चेतना अमूर्त और पूरी तरह बोधगम्य न सही, पर उसकी अभिव्यक्ति जगत में दिखाई देती है।',
                'वह महान व्यक्तित्वों के रूप में प्रकट होती है—जैसे आइंस्टीन, जॉर्ज बर्नार्ड शॉ, डॉ. राधाकृष्णन, लाल बहादुर शास्त्री, ए.पी.जे. अब्दुल कलाम, भगत सिंह और अनगिनत वीर।',
                'ऐसे लोग अपने जीवन और कर्म से हमें दिशा देते हैं।',
                'यही शुभ प्रवृत्तियों से सृष्टि के क्रम को आगे बढ़ाते हैं और अशुभ तत्वों का क्षय भी करते हैं।'
            ]
        },
        '2017-07-01-meditation-my-exerience': {
            title: 'ध्यान: मेरे अनुभव',
            content: [
                'कृष्ण मेरे आदर्श क्यों हैं? कथा है कि एक बार नारद जी कृष्णधाम पहुँचे और श्रीकृष्ण को गहरे ध्यान में पाया।',
                'नेत्र खुलने पर नारद ने पूछा—सभी तो आपका ध्यान करते हैं, आप किसका ध्यान करते हैं?',
                'कृष्ण ने उत्तर दिया—मैं उस अवर्णनीय, अचिंत्य, अतुलनीय, अति-सूक्ष्म दिव्य चेतना का ध्यान करता हूँ।',
                'शायद वे उन विरले व्यक्तियों में थे जिन्होंने स्पष्ट कहा कि वे किस पर ध्यान करते हैं।',
                'उन्हें उस अमूर्त और अगम सत्ता से संवाद करना आता था।'
            ]
        },
        '2017-06-24-medation-my-exeriences': {
            title: 'ध्यान: मेरे अनुभव',
            content: [
                'हमें प्रेरणा कभी अपने प्रयास से मिलती है, कभी आदर्शों से—जैसे राम, हनुमान, कृष्ण—और कभी महापुरुषों की वाणी से।',
                'मैंने अपनी प्रेरणा श्रीकृष्ण से पाई।',
                'मैं कई वर्षों से ध्यान का अभ्यास कर रहा हूँ—कभी सफलता, कभी चूक, पर अभ्यास निरंतर रहा।',
                'इससे मुझे कुछ अनुभव और कुछ अंतर्दृष्टि मिली है।',
                'जितना मैंने समझा है, उतना ही मैं यहाँ विनम्रता से साझा कर रहा हूँ।'
            ]
        },
        '2017-06-17-my-experiences-in-meditation': {
            title: 'ध्यान में मेरे अनुभव',
            content: [
                'कुछ मित्रों के आग्रह पर मैं ध्यान के अपने अनुभव साझा कर रहा हूँ।',
                'इनका किसी धर्म-विशेष से संबंध नहीं है।',
                'मैं हर रविवार ये अनुभव फेसबुक पर साझा करूँगा, और इन्हें मेरे ब्लॉग “मेरे अनुभव मेरी कविता” पर भी पढ़ा जा सकेगा।'
            ]
        }
    };

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

        const manualTranslation = HINDI_TRANSLATIONS[post.slug];
        const hasManualTranslation = Boolean(manualTranslation);
        const canAutoTranslate = !hasManualTranslation && containsHindiText(post.title + ' ' + stripHtml(post.content || ''));
        const title = escapeHtml(hasManualTranslation ? manualTranslation.title : post.title);
        const englishTitle = escapeHtml(post.title);
        const englishContent = post.content || '<p>No content available.</p>';

        let contentMarkup = `<div class="post-content">${englishContent}</div>`;

        if (hasManualTranslation || canAutoTranslate) {
            const hindiContent = hasManualTranslation ? createHindiContent(manualTranslation.content) : (post.content || '<p>कोई सामग्री उपलब्ध नहीं है।</p>');
            const englishPanel = hasManualTranslation
                ? `<h3 class="translation-heading">${englishTitle}</h3><div class="post-content" lang="en">${englishContent}</div>`
                : '<div class="post-content" lang="en"><p>Click the button below to translate this post to English.</p></div>';

            contentMarkup = `
                <div class="translation-panels" data-show-english="false" data-auto-translate="${String(canAutoTranslate)}" data-slug="${escapeHtml(post.slug)}" data-original-title="${escapeHtml(post.title)}" data-original-content="${escapeHtml(post.content || '')}">
                    <div class="translation-panel is-active" data-language="hi">
                        <div class="post-content" lang="hi">${hindiContent}</div>
                    </div>
                    <div class="translation-panel" data-language="en">
                        ${englishPanel}
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
                    const translated = await ensureEnglishTranslation(panels);
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


    async function ensureEnglishTranslation(panels) {
        const slug = panels.dataset.slug;
        const englishPanel = panels.querySelector('[data-language="en"]');
        const button = panels.parentElement.querySelector('.flip-toggle');

        if (machineTranslationCache.has(slug)) {
            englishPanel.innerHTML = machineTranslationCache.get(slug);
            return true;
        }

        const originalTitle = panels.dataset.originalTitle || '';
        const originalContent = panels.dataset.originalContent || '';

        button.disabled = true;
        button.textContent = 'Translating...';

        try {
            const translatedTitle = await translateText(originalTitle);
            const translatedParagraphs = await translateHtmlToParagraphs(originalContent);
            const englishMarkup = `
                <h3 class="translation-heading">${escapeHtml(translatedTitle || 'English Translation')}</h3>
                <div class="post-content" lang="en">${translatedParagraphs}</div>
            `;

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

    function createHindiContent(paragraphs) {
        return paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('');
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
