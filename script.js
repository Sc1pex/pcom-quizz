document.addEventListener('DOMContentLoaded', () => {
    const chapterList = document.getElementById('chapter-list');
    const welcomeView = document.getElementById('welcome-view');
    const readerView = document.getElementById('reader-view');
    const searchView = document.getElementById('search-view');
    const readerTitle = document.getElementById('reader-title');
    const readerBody = document.getElementById('reader-body');
    const themeToggle = document.getElementById('theme-toggle');
    const toggleSidebarBtn = document.getElementById('toggle-sidebar');
    const searchBtn = document.getElementById('search-btn');
    const sidebar = document.getElementById('sidebar');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    
    // UI Improvements elements
    const progressBar = document.getElementById('reading-progress');
    const readTimeEl = document.getElementById('read-time');
    const markReadBtn = document.getElementById('mark-read-btn');
    const prevBtn = document.getElementById('prev-chapter-btn');
    const nextBtn = document.getElementById('next-chapter-btn');
    
    // Quizz Elements
    const quizzBtn = document.getElementById('quizz-btn');
    const quizzView = document.getElementById('quizz-view');
    const quizzTitle = document.getElementById('quizz-title');
    const quizzProgress = document.getElementById('quizz-progress');
    const quizzQuestion = document.getElementById('quizz-question');
    const quizzOptions = document.getElementById('quizz-options');
    const quizzFeedback = document.getElementById('quizz-feedback');
    const quizzExplanation = document.getElementById('quizz-explanation');
    const quizzGotoChapter = document.getElementById('quizz-goto-chapter');
    const quizzNextBtn = document.getElementById('quizz-next-btn');

    // Search elements
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    let currentIndex = -1;
    let currentActiveButton = null;

    // Load read chapters from localStorage
    let readChapters = JSON.parse(localStorage.getItem('readChapters') || '[]');

    // Initialize Theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            moonIcon.classList.remove('hidden');
            sunIcon.classList.add('hidden');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
        }
    });

    // Sidebar Toggle
    toggleSidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // Search Toggle
    searchBtn.addEventListener('click', () => {
        welcomeView.classList.add('hidden');
        readerView.classList.add('hidden');
        searchView.classList.remove('hidden');
        
        setTimeout(() => {
            welcomeView.classList.remove('active');
            readerView.classList.remove('active');
            searchView.classList.add('active');
            searchInput.focus();
            
            // Auto-collapse sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.add('collapsed');
            }
        }, 50);
    });

    // Reading Progress Bar
    const mainContent = document.getElementById('main-content');
    mainContent.addEventListener('scroll', () => {
        if (currentIndex === -1 || readerView.classList.contains('hidden')) return;
        const scrollHeight = mainContent.scrollHeight - mainContent.clientHeight;
        if (scrollHeight > 0) {
            const progress = (mainContent.scrollTop / scrollHeight) * 100;
            progressBar.style.width = `${progress}%`;
        } else {
            progressBar.style.width = '100%';
        }
    });

    // Mark as read functionality
    markReadBtn.addEventListener('click', () => {
        if (currentIndex === -1) return;
        const btnText = markReadBtn.querySelector('.btn-text');

        if (!readChapters.includes(currentIndex)) {
            readChapters.push(currentIndex);
            localStorage.setItem('readChapters', JSON.stringify(readChapters));
            currentActiveButton.classList.add('read');
            btnText.textContent = 'Citit (Click pt a anula)';
            markReadBtn.classList.add('active');
        } else {
            readChapters = readChapters.filter(id => id !== currentIndex);
            localStorage.setItem('readChapters', JSON.stringify(readChapters));
            currentActiveButton.classList.remove('read');
            btnText.textContent = 'Marchează ca citit';
            markReadBtn.classList.remove('active');
        }
    });

    // TTS Functionality
    const ttsBtn = document.getElementById('tts-btn');
    const ttsAudio = document.getElementById('tts-audio');
    const ttsMenu = document.getElementById('tts-floating-menu');
    const ttsCloseBtn = document.getElementById('tts-close-btn');
    const ttsVoice = document.getElementById('tts-voice');
    const ttsSpeed = document.getElementById('tts-speed');
    const ttsPlayPauseBtn = document.getElementById('tts-play-pause-btn');
    const ttsIconPlay = document.getElementById('tts-icon-play');
    const ttsIconPause = document.getElementById('tts-icon-pause');
    const ttsProgress = document.getElementById('tts-progress');
    const ttsCurrentTime = document.getElementById('tts-current-time');
    const ttsDuration = document.getElementById('tts-duration');
    const ttsLoading = document.getElementById('tts-loading');

    let currentTtsText = '';
    let currentAudioUrl = null;

    function formatTime(sec) {
        if (!sec || isNaN(sec)) return '0:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function setTtsPlaying(playing) {
        if (playing) {
            ttsIconPlay.classList.add('hidden');
            ttsIconPause.classList.remove('hidden');
        } else {
            ttsIconPlay.classList.remove('hidden');
            ttsIconPause.classList.add('hidden');
        }
    }

    async function fetchAndPlayTTS() {
        if (!currentTtsText) return;
        const voice = ttsVoice.value;
        const speed = parseFloat(ttsSpeed.value);

        ttsPlayPauseBtn.disabled = true;
        ttsLoading.classList.remove('hidden');
        setTtsPlaying(false);

        try {
            const res = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: currentTtsText, voice: voice })
            });
            if (!res.ok) throw new Error('API responded with ' + res.status);

            const blob = await res.blob();
            if (currentAudioUrl) URL.revokeObjectURL(currentAudioUrl);
            currentAudioUrl = URL.createObjectURL(blob);

            ttsAudio.src = currentAudioUrl;
            ttsAudio.playbackRate = speed;
            await ttsAudio.play();
            setTtsPlaying(true);
        } catch (err) {
            console.error(err);
            alert('Eroare la generarea audio. Asigură-te că serverul rulează și ai conexiune la internet.');
        } finally {
            ttsPlayPauseBtn.disabled = false;
            ttsLoading.classList.add('hidden');
        }
    }

    if (ttsBtn && ttsAudio && ttsMenu) {
        // Open panel and start playback
        ttsBtn.addEventListener('click', () => {
            const textToRead = readerBody.innerText.trim();
            if (!textToRead) return;
            currentTtsText = textToRead.replace(/\n\s*\n/g, '\n').substring(0, 20000);
            ttsMenu.classList.remove('hidden');
            fetchAndPlayTTS();
        });

        // Play / Pause toggle
        ttsPlayPauseBtn.addEventListener('click', () => {
            if (ttsAudio.paused || ttsAudio.ended) {
                if (!ttsAudio.src || ttsAudio.ended) {
                    fetchAndPlayTTS();
                } else {
                    ttsAudio.play();
                    setTtsPlaying(true);
                }
            } else {
                ttsAudio.pause();
                setTtsPlaying(false);
            }
        });

        // Close
        ttsCloseBtn.addEventListener('click', () => {
            ttsAudio.pause();
            setTtsPlaying(false);
            ttsMenu.classList.add('hidden');
        });

        // Seek bar – update as audio plays
        ttsAudio.addEventListener('timeupdate', () => {
            if (ttsAudio.duration) {
                ttsProgress.value = (ttsAudio.currentTime / ttsAudio.duration) * 100;
                ttsCurrentTime.textContent = formatTime(ttsAudio.currentTime);
            }
        });

        // Seek bar – jump to position
        ttsProgress.addEventListener('input', () => {
            if (ttsAudio.duration) {
                ttsAudio.currentTime = (ttsProgress.value / 100) * ttsAudio.duration;
            }
        });

        // Show total duration once metadata loads
        ttsAudio.addEventListener('loadedmetadata', () => {
            ttsDuration.textContent = formatTime(ttsAudio.duration);
        });

        // Reset icon when finished
        ttsAudio.addEventListener('ended', () => {
            setTtsPlaying(false);
            ttsProgress.value = 0;
            ttsCurrentTime.textContent = '0:00';
        });

        // Speed change (no re-fetch needed, just apply live)
        ttsSpeed.addEventListener('change', () => {
            ttsAudio.playbackRate = parseFloat(ttsSpeed.value);
        });

        // Voice change – re-generate with new voice
        ttsVoice.addEventListener('change', () => {
            fetchAndPlayTTS();
        });

        // Draggable panel
        let isDragging = false;
        let startX, startY, startLeft, startBottom;

        const dragHandle = document.getElementById('tts-drag-handle');

        dragHandle.addEventListener('mousedown', (e) => {
            // Don't drag if clicking the close button
            if (e.target === ttsCloseBtn) return;
            isDragging = true;
            const rect = ttsMenu.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            startLeft = rect.left;
            startBottom = window.innerHeight - rect.bottom;
            ttsMenu.style.right = 'auto';
            ttsMenu.style.bottom = 'auto';
            ttsMenu.style.left = startLeft + 'px';
            ttsMenu.style.top = rect.top + 'px';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            ttsMenu.style.left = (startLeft + dx) + 'px';
            ttsMenu.style.top = (parseFloat(ttsMenu.style.top) + dy) + 'px';
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseFloat(ttsMenu.style.left);
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    // Navigation buttons
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            const prevButton = chapterList.children[currentIndex - 1];
            loadChapter(currentIndex - 1, prevButton);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < chaptersData.length - 1) {
            const nextButton = chapterList.children[currentIndex + 1];
            loadChapter(currentIndex + 1, nextButton);
        }
    });

    // Search Logic
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        searchResults.innerHTML = '';
        
        if (query.length < 3) {
            return;
        }

        const results = [];
        chaptersData.forEach((chapter, index) => {
            const textContent = chapter.html.replace(/<[^>]*>?/gm, ''); // strip html tags
            const lowerText = textContent.toLowerCase();
            
            const matchIndex = lowerText.indexOf(query);
            if (matchIndex !== -1 || chapter.title.toLowerCase().includes(query)) {
                // Generate a snippet
                let snippet = '';
                if (matchIndex !== -1) {
                    const start = Math.max(0, matchIndex - 60);
                    const end = Math.min(textContent.length, matchIndex + query.length + 60);
                    snippet = textContent.substring(start, end);
                    // highlight
                    const regex = new RegExp(`(${query})`, 'gi');
                    snippet = snippet.replace(regex, '<span class="highlight">$1</span>');
                    snippet = `...${snippet}...`;
                }
                
                results.push({
                    index: index,
                    title: chapter.title,
                    snippet: snippet
                });
            }
        });

        if (results.length === 0) {
            searchResults.innerHTML = '<p style="color: var(--text-secondary);">Nu au fost găsite rezultate.</p>';
            return;
        }

        results.forEach(res => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            div.innerHTML = `
                <div class="search-result-title">${res.title}</div>
                <div class="search-result-preview">${res.snippet}</div>
            `;
            div.addEventListener('click', () => {
                // find the correct button
                const btn = chapterList.children[res.index];
                loadChapter(res.index, btn);
            });
            searchResults.appendChild(div);
        });
    });

    // Load Chapter
    function loadChapter(index, button = null) {
        if (!button && chapterList.children[index]) {
            button = chapterList.children[index];
        }
        
        if (currentActiveButton) {
            currentActiveButton.classList.remove('active');
        }
        if (button) {
            button.classList.add('active');
            currentActiveButton = button;
        }
        currentIndex = index;

        const chapter = chaptersData[index];
        
        // Update nav buttons
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === chaptersData.length - 1;
        
        // Update Read Status
        const btnText = markReadBtn.querySelector('.btn-text');
        if (readChapters.includes(index)) {
            btnText.textContent = 'Citit (Click pt a anula)';
            markReadBtn.classList.add('active');
        } else {
            btnText.textContent = 'Marchează ca citit';
            markReadBtn.classList.remove('active');
        }

        // Hide views for transition
        welcomeView.classList.remove('active');
        welcomeView.classList.add('hidden');
        searchView.classList.remove('active');
        searchView.classList.add('hidden');
        quizzView.classList.remove('active');
        quizzView.classList.add('hidden');
        readerView.classList.remove('active');
        readerView.classList.remove('hidden');
        progressBar.style.width = '0%';
        
        // Auto-collapse sidebar on mobile after selecting a chapter
        if (window.innerWidth <= 768) {
            sidebar.classList.add('collapsed');
        }
        
        // Reset TTS
        if (ttsAudio) {
            ttsAudio.pause();
            ttsAudio.classList.add('hidden');
        }
        
        setTimeout(() => {
            welcomeView.classList.add('hidden');
            searchView.classList.add('hidden');
            readerView.classList.remove('hidden');
            
            readerTitle.textContent = chapter.title;
            readerBody.innerHTML = chapter.html;
            
            // Estimate reading time
            const words = chapter.html.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
            const minutes = Math.max(1, Math.ceil(words / 200));
            readTimeEl.innerHTML = `Timp estimat: <strong>${minutes} min</strong>`;
            
            // Scroll to top
            mainContent.scrollTop = 0;
            
            // Show new content
            setTimeout(() => {
                readerView.classList.add('active');
            }, 50);
        }, 300);
    }

    // Render Sidebar
    if (typeof chaptersData !== 'undefined' && chaptersData.length > 0) {
        chaptersData.forEach((chapter, index) => {
            const btn = document.createElement('button');
            btn.className = 'chapter-item';
            
            const spanText = document.createElement('span');
            spanText.textContent = chapter.title;
            
            const statusInd = document.createElement('div');
            statusInd.className = 'status-indicator';
            
            btn.appendChild(spanText);
            btn.appendChild(statusInd);
            
            if (readChapters.includes(index)) {
                btn.classList.add('read');
            }
            btn.addEventListener('click', () => loadChapter(index, btn));
            chapterList.appendChild(btn);
        });
    } else {
        chapterList.innerHTML = '<p style="padding: 16px; color: var(--text-secondary);">Nu s-au găsit capitole.</p>';
    }

    // --- Quizz Logic ---
    const quizzPrevBtn = document.getElementById('quizz-prev-btn');
    const quizzOverview = document.getElementById('quizz-overview');
    
    let currentQuizzIndex = 0;
    let combinedQuizzes = [];
    let quizzAnswers = {}; // Store answers state: { 0: 'correct', 1: 'wrong' }
    
    async function initQuizzes() {
        let customQuizzes = [];
        let fetchedFromBackend = false;
        try {
            const res = await fetch('/api/quizzes');
            if (res.ok) {
                customQuizzes = await res.json();
                fetchedFromBackend = true;
            } else throw new Error("API failed");
        } catch (e) {
            console.warn("Backend API not found, falling back to localStorage.");
            try {
                customQuizzes = JSON.parse(localStorage.getItem('customQuizzes')) || [];
            } catch (err) { console.error(err); }
        }
        
        const defaultQuizzes = typeof quizzes !== 'undefined' ? quizzes : [];
        if (fetchedFromBackend && customQuizzes.length > 0) {
            combinedQuizzes = customQuizzes;
        } else {
            combinedQuizzes = [...defaultQuizzes, ...customQuizzes];
        }
        
        renderQuizzOverview();
    }
    
    function renderQuizzOverview() {
        if (!quizzOverview) return;
        quizzOverview.innerHTML = '';
        combinedQuizzes.forEach((_, idx) => {
            const btn = document.createElement('button');
            btn.className = 'overview-btn';
            btn.textContent = idx + 1;
            if (quizzAnswers[idx] === 'correct') btn.classList.add('answered-correct');
            else if (quizzAnswers[idx] === 'wrong') btn.classList.add('answered-wrong');
            
            btn.onclick = () => {
                currentQuizzIndex = idx;
                loadQuizzQuestion();
                const overviewModal = document.getElementById('overview-modal');
                if (overviewModal) overviewModal.classList.add('hidden');
            };
            quizzOverview.appendChild(btn);
        });
    }
    
    function updateQuizzOverviewActive() {
        if (!quizzOverview) return;
        const btns = quizzOverview.querySelectorAll('.overview-btn');
        btns.forEach((btn, idx) => {
            if (idx === currentQuizzIndex) btn.classList.add('active');
            else btn.classList.remove('active');
        });
    }
    
    function loadQuizzQuestion() {
        if (combinedQuizzes.length === 0) {
            initQuizzes();
        }
        if (combinedQuizzes.length === 0) return;
        
        const q = combinedQuizzes[currentQuizzIndex];
        quizzProgress.textContent = `Întrebarea ${currentQuizzIndex + 1}/${combinedQuizzes.length}`;
        quizzQuestion.textContent = q.question;
        quizzOptions.innerHTML = '';
        quizzFeedback.classList.add('hidden');
        quizzNextBtn.classList.add('hidden');
        if (quizzPrevBtn) {
            quizzPrevBtn.classList.remove('hidden');
            if (currentQuizzIndex === 0) quizzPrevBtn.style.opacity = '0.5';
            else quizzPrevBtn.style.opacity = '1';
        }
        
        updateQuizzOverviewActive();
        
        q.options.forEach((optText, index) => {
            const btn = document.createElement('button');
            btn.className = 'quizz-option';
            btn.textContent = optText;
            btn.addEventListener('click', () => handleQuizzAnswer(index, btn, q));
            quizzOptions.appendChild(btn);
        });
    }

    function handleQuizzAnswer(selectedIndex, btn, q) {
        const allOptions = quizzOptions.querySelectorAll('.quizz-option');
        allOptions.forEach(opt => opt.disabled = true); // Disable all
        
        if (selectedIndex === q.correctIndex) {
            btn.classList.add('correct');
            quizzAnswers[currentQuizzIndex] = 'correct';
        } else {
            btn.classList.add('wrong');
            allOptions[q.correctIndex].classList.add('correct');
            quizzAnswers[currentQuizzIndex] = 'wrong';
        }
        renderQuizzOverview(); // Update colors in grid
        updateQuizzOverviewActive(); // Maintain active state
        
        quizzExplanation.innerHTML = `<strong>Explicație:</strong> ${q.explanation || 'Nicio explicație suplimentară.'}`;
        quizzFeedback.classList.remove('hidden');
        
        // Setup "Recitește" button
        if (typeof q.chapterRef !== 'undefined') {
            quizzGotoChapter.style.display = 'inline-flex';
            quizzGotoChapter.onclick = () => {
                quizzView.classList.remove('active');
                quizzView.classList.add('hidden');
                readerView.classList.remove('hidden');
                loadChapter(q.chapterRef);
                
                // Highlight logic
                if (q.searchKeyword) {
                    setTimeout(() => {
                        const regex = new RegExp(`(${q.searchKeyword})`, 'gi');
                        readerBody.innerHTML = readerBody.innerHTML.replace(regex, '<mark class="highlight">$1</mark>');
                        const firstHighlight = readerBody.querySelector('.highlight');
                        if (firstHighlight) {
                            firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }, 400); // wait for chapter transition (300ms) to complete
                }
            };
        } else {
            quizzGotoChapter.style.display = 'none';
        }
        
        if (currentQuizzIndex < combinedQuizzes.length - 1) {
            quizzNextBtn.classList.remove('hidden');
            quizzNextBtn.textContent = "Următoarea Întrebare";
        } else {
            quizzNextBtn.classList.remove('hidden');
            quizzNextBtn.textContent = "Reîncepe Quizz-ul";
        }
    }

    if (quizzPrevBtn) {
        quizzPrevBtn.addEventListener('click', () => {
            if (currentQuizzIndex > 0) {
                currentQuizzIndex--;
                loadQuizzQuestion();
            }
        });
    }

    quizzNextBtn.addEventListener('click', () => {
        if (currentQuizzIndex < combinedQuizzes.length - 1) {
            currentQuizzIndex++;
        } else {
            currentQuizzIndex = 0; // Restart
        }
        loadQuizzQuestion();
    });

    searchBtn.addEventListener('click', () => {
        welcomeView.classList.remove('active');
        welcomeView.classList.add('hidden');
        readerView.classList.remove('active');
        readerView.classList.add('hidden');
        quizzView.classList.remove('active');
        quizzView.classList.add('hidden');
        
        searchView.classList.remove('hidden');
        searchView.classList.add('active');
        searchInput.focus();
    });

    quizzBtn.addEventListener('click', async () => {
        readerView.classList.remove('active');
        readerView.classList.add('hidden');
        welcomeView.classList.remove('active');
        welcomeView.classList.add('hidden');
        searchView.classList.remove('active');
        searchView.classList.add('hidden');
        
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
        }
        
        quizzView.classList.remove('hidden');
        quizzView.classList.add('active');
        await initQuizzes();
        loadQuizzQuestion();
    });

    // --- Custom Quizz Modal Logic ---
    const addQuizzBtn = document.getElementById('add-quizz-btn');
    const addQuizzModal = document.getElementById('add-quizz-modal');
    const saveCustomQuizzBtn = document.getElementById('save-custom-quizz-btn');
    const closeQuizzModalBtn = document.querySelector('.close-modal'); // This targets the first close-modal, which might be add-quizz-modal's. We should use specific IDs if possible, but let's handle the new one specifically.
    
    const openOverviewBtn = document.getElementById('open-overview-btn');
    const overviewModal = document.getElementById('overview-modal');
    const closeOverviewModalBtn = document.getElementById('close-overview-modal');

    if (openOverviewBtn && overviewModal) {
        openOverviewBtn.addEventListener('click', () => {
            overviewModal.classList.remove('hidden');
            // Scroll the active button into view within the modal
            setTimeout(() => {
                const activeBtn = overviewModal.querySelector('.overview-btn.active');
                if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 50);
        });
    }

    if (closeOverviewModalBtn && overviewModal) {
        closeOverviewModalBtn.addEventListener('click', () => {
            overviewModal.classList.add('hidden');
        });
    }

    if (addQuizzBtn) {
        addQuizzBtn.addEventListener('click', () => {
            addQuizzModal.classList.remove('hidden');
        });
    }

    if (closeQuizzModalBtn) {
        closeQuizzModalBtn.addEventListener('click', () => {
            addQuizzModal.classList.add('hidden');
        });
    }

    if (saveCustomQuizzBtn) {
        saveCustomQuizzBtn.addEventListener('click', async () => {
            const qText = document.getElementById('custom-q-text').value.trim();
            const opt0 = document.getElementById('opt-0').value.trim();
            const opt1 = document.getElementById('opt-1').value.trim();
            const opt2 = document.getElementById('opt-2').value.trim();
            const opt3 = document.getElementById('opt-3').value.trim();
            const expl = document.getElementById('custom-q-expl').value.trim();
            
            const correctOptRadio = document.querySelector('input[name="correct-opt"]:checked');
            
            if (!qText || !opt0 || !opt1 || !opt2 || !opt3) {
                alert("Te rog completează întrebarea și toate cele 4 opțiuni.");
                return;
            }

            const newQ = {
                question: qText,
                options: [opt0, opt1, opt2, opt3],
                correctIndex: parseInt(correctOptRadio.value),
                explanation: expl || "Nicio explicație furnizată pentru această întrebare personalizată."
            };

            try {
                const res = await fetch('/api/quizzes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newQ)
                });
                if (!res.ok) throw new Error("API Post failed");
            } catch (e) {
                let customQuizzes = JSON.parse(localStorage.getItem('customQuizzes')) || [];
                customQuizzes.push(newQ);
                localStorage.setItem('customQuizzes', JSON.stringify(customQuizzes));
            }
            
            // Reload
            await initQuizzes();
            currentQuizzIndex = combinedQuizzes.length - 1; // Jump to the newly added question
            loadQuizzQuestion();
            
            // Close modal and clear inputs
            addQuizzModal.classList.add('hidden');
            document.getElementById('custom-q-text').value = '';
            document.getElementById('opt-0').value = '';
            document.getElementById('opt-1').value = '';
            document.getElementById('opt-2').value = '';
            document.getElementById('opt-3').value = '';
            document.getElementById('custom-q-expl').value = '';
            alert("Întrebarea a fost salvată!");
        });
    }

    const importJsonBtn = document.getElementById('import-json-btn');
    const importJsonFile = document.getElementById('import-json-file');

    if (importJsonBtn && importJsonFile) {
        importJsonBtn.addEventListener('click', () => {
            const file = importJsonFile.files[0];
            if (!file) {
                alert("Te rog selectează un fișier JSON mai întâi.");
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);
                    if (!Array.isArray(importedData)) {
                        alert("Eroare: Fișierul JSON trebuie să conțină un array (o listă) de întrebări.");
                        return;
                    }
                    
                    // Basic validation
                    const validQuestions = importedData.filter(q => 
                        q.question && 
                        Array.isArray(q.options) && 
                        q.options.length >= 2 && 
                        typeof q.correctIndex === 'number'
                    );

                    if (validQuestions.length === 0) {
                        alert("Nu au fost găsite întrebări valide în formatul corect.");
                        return;
                    }

                    (async () => {
                        try {
                            const res = await fetch('/api/quizzes', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(validQuestions)
                            });
                            if (!res.ok) throw new Error("API Post failed");
                        } catch (e) {
                            let customQuizzes = JSON.parse(localStorage.getItem('customQuizzes')) || [];
                            customQuizzes = [...customQuizzes, ...validQuestions];
                            localStorage.setItem('customQuizzes', JSON.stringify(customQuizzes));
                        }
                        
                        await initQuizzes();
                        currentQuizzIndex = combinedQuizzes.length - validQuestions.length; // Jump to first imported
                        loadQuizzQuestion();
                        
                        addQuizzModal.classList.add('hidden');
                        importJsonFile.value = '';
                        alert(`Au fost importate cu succes ${validQuestions.length} întrebări!`);
                    })();
                } catch (err) {
                    console.error(err);
                    alert("Eroare la parsarea fișierului JSON. Asigură-te că formatul este corect.");
                }
            };
            reader.readAsText(file);
        });
    }

});
