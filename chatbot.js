/* =========================================================
   Scripted portfolio assistant
   Runs fully in the browser: matches keywords to prepared
   answers. No API, no data leaves the page.
   ========================================================= */
(() => {
    const EMAIL = 'ilaraib.096@gmail.com';
    const WHATSAPP = 'https://wa.me/923058713066';
    const LINKEDIN = 'https://www.linkedin.com/in/laraib-ishtiaq/';
    const MEDIUM = 'https://medium.com/@ilaraib.096';

    const mail = `<a href="mailto:${EMAIL}">${EMAIL}</a>`;

    /* ---------- Answers ---------- */
    const ANSWERS = {
        greeting: {
            text: `Hi, I'm Laraib 👋 Ask me about my services, the industries I've worked in, my published apps, or my AI work. What would you like to know?`,
            chips: ['services', 'domains', 'apps', 'ai'],
        },
        services: {
            text: `Here's what I can help with:
                <ul>
                    <li><b>Flutter apps</b>: one codebase for iOS and Android, plus web or desktop if needed.</li>
                    <li><b>Native Android</b>: Kotlin and Jetpack Compose.</li>
                    <li><b>Publishing</b>: getting your app onto Google Play and the App Store and keeping it maintained.</li>
                    <li><b>AI integration</b>: RAG, AI agents and chatbots inside apps or internal tools.</li>
                </ul>
                Have a project in mind? Email me at ${mail}.`,
            chips: ['domains', 'apps', 'contact'],
        },
        domains: {
            text: `I've built apps for quite a few different industries:
                <ul>
                    <li><b>Interpreting &amp; language services</b>: the Tolkdanmark app for interpreters and customers.</li>
                    <li><b>Transport &amp; ride booking</b>: the DanTaxi booking app.</li>
                    <li><b>Robotics &amp; land surveying</b>: a tablet app that controls outdoor survey robots.</li>
                    <li><b>Retail</b>: an app for shops renting shelf space to vendors.</li>
                    <li><b>Customer feedback</b>: a Flutter app for collecting feedback.</li>
                    <li><b>HR &amp; internal tools</b>: an AI agent that turns plain-English requests into employee management API calls.</li>
                    <li><b>Recruitment</b>: a job portal (my university project).</li>
                </ul>
                Most of my client work is for companies in Denmark.`,
            chips: ['apps', 'services', 'contact'],
        },
        apps: {
            text: `Two of my apps are live on both stores:
                <ul>
                    <li><b>Tolkdanmark</b>: interpreters view, accept or bid on assignments.
                        <a href="https://play.google.com/store/apps/details?id=com.tolkdanmark.live" target="_blank" rel="noopener">Google Play</a> ·
                        <a href="https://apps.apple.com/us/app/tolkdanmark-ny/id6753168510" target="_blank" rel="noopener">App Store</a></li>
                    <li><b>DanTaxi</b>: taxi booking in Denmark.
                        <a href="https://play.google.com/store/apps/details?id=dk.dantaxi.app" target="_blank" rel="noopener">Google Play</a> ·
                        <a href="https://apps.apple.com/us/app/dantaxi-taxi-booking/id1456754381" target="_blank" rel="noopener">App Store</a></li>
                </ul>`,
            chips: ['domains', 'skills', 'contact'],
        },
        ai: {
            text: `Since mid-2026 I've been building AI systems alongside my mobile work:
                <ul>
                    <li><b>Enterprise HR AI Assistant</b>: an AI assistant in production inside an internal employee management platform. It answers HR policy questions with sources and handles employees' own requests through read and write agents that confirm before changing anything.</li>
                    <li><b>Agentic RAG with web search</b>: a LangGraph agent that picks between policy documents in pgvector and Tavily web search.</li>
                    <li><b>Document Q&amp;A app</b>: upload a PDF and ask questions about it, built with LangChain, Gradio and pgvector.</li>
                    <li><b>Local vs cloud RAG</b>: Qwen3 on Ollama compared with Azure OpenAI, using ChromaDB.</li>
                </ul>
                I also write about it on <a href="${MEDIUM}" target="_blank" rel="noopener">Medium</a> and have certificates in Generative AI, RAG and AI Engineering.`,
            chips: ['services', 'contact'],
            action: { label: 'See AI section', href: '#ai' },
        },
        skills: {
            text: `My main tools:
                <ul>
                    <li><b>Mobile</b>: Flutter, Dart, Kotlin, Jetpack Compose, Kotlin Multiplatform, Java</li>
                    <li><b>Backend &amp; data</b>: REST APIs, Ktor, Bluetooth, Google Maps</li>
                    <li><b>AI</b>: RAG, AI agents, LangChain, LangGraph, Azure OpenAI, FAISS, pgvector, ChromaDB, Ollama, RAGAS</li>
                </ul>`,
            chips: ['services', 'experience'],
        },
        experience: {
            text: `I have 5+ years of mobile development experience. I currently work at <b>TEO International</b> in Islamabad, building apps for clients in Denmark.`,
            chips: ['domains', 'apps', 'contact'],
        },
        pricing: {
            text: `It depends on the project: scope, platforms and timeline. The best way to get an estimate is to email me a short description at ${mail}.`,
            chips: ['services', 'contact'],
        },
        location: {
            text: `I'm based in Islamabad, Pakistan (PKT, UTC+5) and already work remotely with clients in Denmark.`,
            chips: ['contact', 'services'],
        },
        contact: {
            text: `Email is the best way to reach me: ${mail}.<br>
                You can also message me on <a href="${WHATSAPP}" target="_blank" rel="noopener">WhatsApp</a> or connect on <a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a>.`,
            chips: ['services', 'domains'],
        },
        thanks: {
            text: `You're welcome! Anything else you'd like to know?`,
            chips: ['services', 'domains', 'contact'],
        },
        fallback: {
            text: `Sorry, I'm a simple assistant and didn't catch that. Try one of the options below, or email me directly at ${mail}.`,
            chips: ['services', 'domains', 'apps', 'contact'],
        },
    };

    /* ---------- Quick-reply chips ---------- */
    const CHIPS = {
        services: 'What services do you offer?',
        domains: 'Which industries have you worked in?',
        apps: 'Published apps',
        ai: 'AI work',
        skills: 'Tech stack',
        experience: 'Experience',
        contact: 'How can I reach you?',
    };

    /* ---------- Intent matching ---------- */
    // Order = priority when two intents score the same
    const INTENTS = [
        ['pricing', /\b(price|pricing|cost|rates?|budget|charge|quote|how much|fee)/],
        ['contact', /\b(contact|email|e-mail|mail|reach|whatsapp|hire|hiring|available|availability|call|meet|linkedin|talk|message)/],
        ['apps', /\b(app ?store|play ?store|google play|published|live apps?|tolk|dantaxi|taxi|download)/],
        ['domains', /\b(domains?|industr|sectors?|fields?|niche|worked (on|in|with)|clients?|businesses|type of (projects|work))/],
        ['services', /\b(services?|offer|provide|help (me|us|with)|what can you|do you do|build for)/],
        ['ai', /\b(ai|a\.i\.|rag|agents?|agentic|llm|langchain|langgraph|chatbots?|gpt|machine learning|ml|articles?|medium|blog|certificat)/],
        ['skills', /\b(tech|stack|skills?|languages?|flutter|kotlin|android|ios|compose|dart|frameworks?|tools?)/],
        ['experience', /\b(years?|experience|how long|background|company|teo|job|currently|work at)/],
        ['location', /\b(where|based|location|time ?zone|remote|pakistan|islamabad)/],
        ['greeting', /\b(hi|hello|hey|salam|assalam|good (morning|evening|afternoon))\b/],
        ['thanks', /\b(thanks?|thank you|thx|great|cool|awesome|nice)\b/],
    ];

    const matchIntent = (input) => {
        const text = input.toLowerCase();
        let best = 'fallback', bestScore = 0;
        INTENTS.forEach(([name, re]) => {
            const hits = (text.match(new RegExp(re.source, 'g')) || []).length;
            if (hits > bestScore) { best = name; bestScore = hits; }
        });
        return best;
    };

    /* ---------- UI ---------- */
    const root = document.createElement('div');
    root.className = 'chat';
    root.innerHTML = `
        <button class="chat-launcher" aria-label="Open chat assistant" aria-expanded="false" aria-controls="chat-panel">
            <i class="fa-solid fa-comment-dots chat-icon-open" aria-hidden="true"></i>
            <i class="fa-solid fa-xmark chat-icon-close" aria-hidden="true"></i>
            <span class="chat-launcher-label">Ask me</span>
        </button>
        <section class="chat-panel" id="chat-panel" role="dialog" aria-label="Chat assistant" hidden>
            <header class="chat-header">
                <img src="LaraibIshtiaq.jpeg" alt="" class="chat-avatar">
                <div>
                    <strong>Ask Laraib</strong>
                    <span>Automated quick answers</span>
                </div>
                <button class="chat-close" aria-label="Close chat"><i class="fa-solid fa-xmark"></i></button>
            </header>
            <div class="chat-log" aria-live="polite"></div>
            <div class="chat-chips"></div>
            <form class="chat-form" autocomplete="off">
                <input type="text" class="chat-input" placeholder="Ask about services, industries…" aria-label="Your question" maxlength="200">
                <button type="submit" class="chat-send" aria-label="Send"><i class="fa-solid fa-arrow-up"></i></button>
            </form>
        </section>`;
    document.body.appendChild(root);

    const launcher = root.querySelector('.chat-launcher');
    const panel = root.querySelector('.chat-panel');
    const log = root.querySelector('.chat-log');
    const chipsBox = root.querySelector('.chat-chips');
    const form = root.querySelector('.chat-form');
    const input = root.querySelector('.chat-input');
    let started = false;
    let busy = false;

    const scrollDown = () => { log.scrollTop = log.scrollHeight; };

    const addUser = (text) => {
        const el = document.createElement('div');
        el.className = 'msg msg-user';
        el.textContent = text;
        log.appendChild(el);
        scrollDown();
    };

    const renderChips = (keys) => {
        chipsBox.innerHTML = '';
        keys.forEach(k => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'chip';
            b.textContent = CHIPS[k];
            b.addEventListener('click', () => ask(CHIPS[k], k));
            chipsBox.appendChild(b);
        });
    };

    const addBot = (key) => {
        const a = ANSWERS[key];
        const typing = document.createElement('div');
        typing.className = 'msg msg-bot typing';
        typing.innerHTML = '<span></span><span></span><span></span>';
        log.appendChild(typing);
        scrollDown();
        busy = true;
        chipsBox.innerHTML = '';

        setTimeout(() => {
            typing.remove();
            const el = document.createElement('div');
            el.className = 'msg msg-bot';
            el.innerHTML = a.text;
            if (a.action) {
                const link = document.createElement('a');
                link.href = a.action.href;
                link.className = 'msg-action';
                link.textContent = a.action.label + ' →';
                link.addEventListener('click', () => toggle(false));
                el.appendChild(link);
            }
            log.appendChild(el);
            renderChips(a.chips);
            scrollDown();
            busy = false;
        }, 550);
    };

    const ask = (text, forcedKey) => {
        if (busy || !text.trim()) return;
        addUser(text.trim());
        addBot(forcedKey || matchIntent(text));
    };

    const toggle = (open) => {
        const isOpen = open ?? panel.hidden;
        panel.hidden = !isOpen;
        root.classList.toggle('open', isOpen);
        launcher.setAttribute('aria-expanded', String(isOpen));
        if (isOpen) {
            if (!started) {
                started = true;
                addBot('greeting');
            }
            setTimeout(() => input.focus({ preventScroll: true }), 50);
        }
    };

    launcher.addEventListener('click', () => toggle());
    root.querySelector('.chat-close').addEventListener('click', () => { toggle(false); launcher.focus(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !panel.hidden) { toggle(false); launcher.focus(); }
    });
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value;
        input.value = '';
        ask(text);
    });
})();
