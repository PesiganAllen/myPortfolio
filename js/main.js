document.addEventListener('DOMContentLoaded', () => {
    // ── Navbar scroll shadow ───────────────────────────────────
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    });

    // ── Mobile hamburger ───────────────────────────────────────
    const hamburger = document.getElementById('nav-hamburger');
    const navLinks  = document.getElementById('nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => navLinks.classList.remove('open'));
        });
    }

    // ── Scroll reveal ──────────────────────────────────────────
    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObs.observe(el));

    // ── Project data ───────────────────────────────────────────
    // gallery: array of { type: 'video'|'image', src, poster? }
    const projects = {
        rag: {
            title: 'RAG Chatbot System',
            subtitle: 'n8n + Qdrant + Telegram · Sofi AI · 2026',
            tags: ['RAG', 'AI Automation', 'n8n'],
            stack: ['n8n', 'Qdrant', 'OpenAI', 'Telegram Bot API', 'Vector Embeddings', 'Supabase'],
            gallery: [
                { type: 'video', src: 'assets/n8n.mp4', poster: 'canva/6.jpg' },
                { type: 'image', src: 'canva/6.jpg' },
                { type: 'image', src: 'canva/7.jpg' },
            ],
            desc: 'A RAG-powered customer service system built at Sofi AI that reduced response time from 2 hours to under 5 minutes, handling 50+ customer queries daily. The system ingests documents, stores vector embeddings in Qdrant, and surfaces relevant answers through a Telegram bot interface.',
            features: [
                'Document ingestion pipeline that indexes files from Google Drive into a Qdrant vector collection',
                'Conversational AI agent powered by OpenAI with persistent multi-turn chat context via Postgres memory',
                'Telegram bot front-end delivering real-time, semantically accurate answers',
                'Reduced average response time from 2 hours to under 5 minutes',
            ]
        },
        chatsdk: {
            title: 'RAG Knowledge Base Search',
            subtitle: 'ChatSDK + Qdrant + Telegram · Sofi AI · 2026',
            tags: ['RAG', 'ChatSDK', 'AI'],
            stack: ['ChatSDK', 'Qdrant', 'Python', 'Telegram Bot API'],
            gallery: [
                { type: 'image', src: 'canva/8.jpg' },
                { type: 'image', src: 'canva/9.jpg' },
            ],
            desc: 'An iteration on the RAG system that replaced n8n with ChatSDK as the retrieval layer. The migration achieved significantly faster response times and gave finer programmatic control over how queries are resolved against the Qdrant vector knowledge base.',
            features: [
                'Directly accessed an existing Qdrant vector collection as a knowledge base via ChatSDK',
                'Significantly faster retrieval and response times compared to the n8n-based predecessor',
                'Telegram bot interface for end-user conversations',
                'Intelligent query routing against the vector store for accurate, context-aware answers',
            ]
        },
        sweptie: {
            title: 'Sweptie',
            subtitle: 'Screenshot Organizer App · Flutter · 2026',
            tags: ['Mobile App', 'Flutter', 'On-device AI'],
            stack: ['Flutter', 'Dart', 'Google ML Kit', 'SQLite', 'Firebase'],
            gallery: [
                { type: 'video', src: 'assets/sweptie.mp4' },
            ],
            desc: 'A privacy-first Android app that automatically scans your photo gallery, extracts text from screenshots via on-device OCR (Google ML Kit), and classifies them into smart categories — all without an internet connection.',
            features: [
                'On-device OCR using Google ML Kit — no data leaves the device',
                'Keyword scoring classification engine: Receipts, QR Codes, Code, Contacts, Notes',
                'Full-text search across all OCR-extracted screenshot content',
                'Cleanup suggestions flagging old or unclassified screenshots',
                'Keep / Delete management with optional gallery deletion (Android 10+ system dialog)',
                'Android 14 permission model support (full / partial / denied)',
            ]
        },
        facultrk: {
            title: 'Facul-Track',
            subtitle: 'AI-Driven Biometric Access Control · 2025',
            tags: ['AI / ML', 'Android', 'IoT'],
            stack: ['Android Studio', 'FaceNet TFLite', 'Firebase', 'ESP32', 'BLE'],
            gallery: [
                { type: 'video', src: 'assets/faceRecogFinal.mp4', poster: 'canva/11.jpg' },
                { type: 'image', src: 'canva/10.jpg' },
                { type: 'image', src: 'canva/11.jpg' },
                { type: 'image', src: 'canva/12.jpg' },
                { type: 'image', src: 'canva/13.jpg' },
            ],
            desc: 'An intelligent lab access control system that uses deep-learning facial recognition to verify faculty identity in real time. The device cross-references live recognition results with class schedules and triggers an ESP32-controlled solenoid lock via BLE.',
            features: [
                'On-device face recognition using FaceNet TensorFlow Lite model',
                'Schedule-aware access: cross-references recognized identity with Firebase class data',
                'ESP32 hardware integration — BLE-triggered solenoid lock actuation',
                'Firebase Realtime Database sync for attendance and access logs',
                'Android Studio front-end with a dedicated admin dashboard',
            ]
        },
    };

    // ── Modal state ────────────────────────────────────────────
    const overlay   = document.getElementById('project-modal-overlay');
    const modalBody = document.getElementById('project-modal-body');
    const closeBtn  = document.getElementById('project-modal-close');

    let currentGallery = [];
    let currentIndex   = 0;

    function renderMedia(item) {
        if (item.type === 'video') {
            return `<video controls playsinline poster="${item.poster || ''}">
                        <source src="${item.src}" type="video/mp4">
                    </video>`;
        }
        return `<img src="${item.src}" alt="Project screenshot">`;
    }

    function updateGallery() {
        const mediaWrap = document.getElementById('modal-media-wrap');
        if (!mediaWrap) return;
        mediaWrap.innerHTML = renderMedia(currentGallery[currentIndex]);

        const counter = document.getElementById('gallery-counter');
        if (counter) counter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;

        const prev = document.getElementById('gallery-prev');
        const next = document.getElementById('gallery-next');
        if (prev) prev.disabled = currentIndex === 0;
        if (next) next.disabled = currentIndex === currentGallery.length - 1;
    }

    function buildModal(key) {
        const p = projects[key];
        if (!p) return;

        currentGallery = p.gallery || [];
        currentIndex   = 0;

        const tagsHtml     = p.tags.map(t => `<span class="project-type-tag">${t}</span>`).join('');
        const featuresHtml = p.features.map(f => `<li>${f}</li>`).join('');
        const stackHtml    = p.stack.map(s => `<span class="stack-chip">${s}</span>`).join('');

        const hasMultiple  = currentGallery.length > 1;
        const galleryNav   = hasMultiple ? `
            <div class="gallery-nav">
                <button id="gallery-prev" class="gallery-btn" aria-label="Previous">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <span id="gallery-counter">1 / ${currentGallery.length}</span>
                <button id="gallery-next" class="gallery-btn" aria-label="Next">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
            </div>` : '';

        modalBody.innerHTML = `
            <div class="project-modal-media" id="modal-media-wrap">
                ${renderMedia(currentGallery[0])}
            </div>
            ${galleryNav}
            <div class="project-modal-body">
                <div class="project-modal-tags">${tagsHtml}</div>
                <h2 class="project-modal-title">${p.title}</h2>
                <p class="project-modal-subtitle">${p.subtitle}</p>
                <p class="project-modal-desc">${p.desc}</p>
                <div class="project-modal-features">
                    <h4>Key Features</h4>
                    <ul>${featuresHtml}</ul>
                </div>
                <div class="modal-stack-section">
                    <h4>Tech Stack</h4>
                    <div class="modal-stack-chips">${stackHtml}</div>
                </div>
            </div>`;

        if (hasMultiple) {
            document.getElementById('gallery-prev').addEventListener('click', () => {
                if (currentIndex > 0) { currentIndex--; updateGallery(); }
            });
            document.getElementById('gallery-next').addEventListener('click', () => {
                if (currentIndex < currentGallery.length - 1) { currentIndex++; updateGallery(); }
            });
            // update disabled state on first render
            document.getElementById('gallery-prev').disabled = true;
        }
    }

    // ── Card video click-to-play ───────────────────────────────
    document.querySelectorAll('.project-card-media').forEach(media => {
        const vid = media.querySelector('video');
        if (!vid) return;
        media.addEventListener('click', (e) => {
            if (e.target.closest('[data-project]')) return;
            if (vid.paused) {
                vid.play();
                media.classList.add('playing');
            } else {
                vid.pause();
                media.classList.remove('playing');
            }
        });
    });

    document.querySelectorAll('[data-project]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const key = btn.dataset.project;
            buildModal(key);
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        const vid = overlay.querySelector('video');
        if (vid) vid.pause();
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight' && overlay.classList.contains('open')) {
            if (currentIndex < currentGallery.length - 1) { currentIndex++; updateGallery(); }
        }
        if (e.key === 'ArrowLeft' && overlay.classList.contains('open')) {
            if (currentIndex > 0) { currentIndex--; updateGallery(); }
        }
    });
});
