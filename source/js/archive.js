document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    initSearch();
    initCategoryFilter();
    initYearNavigation();
    initViewSwitch();
    initBackToTop();
    initCardHover();
});

let particlesInitialized = false;

function initParticles() {
    if (particlesInitialized) return;
    
    const container = document.getElementById('particles-container');
    if (!container) return;

    const particleCount = 60;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${12 + Math.random() * 10}s`;
        particle.style.width = `${2 + Math.random() * 4}px`;
        particle.style.height = particle.style.width;
        particle.style.opacity = `${0.2 + Math.random() * 0.4}`;
        container.appendChild(particle);
    }
    
    particlesInitialized = true;
}

function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear');
    const postCards = document.querySelectorAll('.post-card');
    const yearGroups = document.querySelectorAll('.year-group');

    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length > 0) {
            searchClear.style.display = 'block';
        } else {
            searchClear.style.display = 'none';
        }

        let hasVisibleCards = false;

        postCards.forEach(card => {
            const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const excerpt = card.querySelector('.card-excerpt')?.textContent.toLowerCase() || '';
            const tags = card.querySelector('.card-tags')?.textContent.toLowerCase() || '';

            if (title.includes(query) || excerpt.includes(query) || tags.includes(query)) {
                card.classList.remove('hidden');
                hasVisibleCards = true;
            } else {
                card.classList.add('hidden');
            }
        });

        yearGroups.forEach(group => {
            const visibleCards = group.querySelectorAll('.post-card:not(.hidden)');
            if (visibleCards.length > 0) {
                group.style.display = 'block';
            } else {
                group.style.display = 'none';
            }
        });

        const archiveContent = document.querySelector('.archive-content');
        if (!hasVisibleCards) {
            if (!archiveContent.querySelector('.empty-state')) {
                const emptyState = document.createElement('div');
                emptyState.className = 'empty-state';
                emptyState.innerHTML = `
                    <div class="empty-icon"><i class="fas fa-search"></i></div>
                    <div class="empty-text">没有找到匹配的文章</div>
                `;
                archiveContent.appendChild(emptyState);
            }
        } else {
            const existingEmptyState = archiveContent.querySelector('.empty-state');
            if (existingEmptyState) {
                existingEmptyState.remove();
            }
        }
    });

    searchClear.addEventListener('click', function() {
        searchInput.value = '';
        searchClear.style.display = 'none';
        
        postCards.forEach(card => card.classList.remove('hidden'));
        yearGroups.forEach(group => group.style.display = 'block');
        
        const emptyState = document.querySelector('.empty-state');
        if (emptyState) emptyState.remove();
    });
}

function initCategoryFilter() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const postCards = document.querySelectorAll('.post-card');
    const yearGroups = document.querySelectorAll('.year-group');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;

            if (filter === 'all') {
                postCards.forEach(card => card.classList.remove('hidden'));
                yearGroups.forEach(group => group.style.display = 'block');
            } else {
                const categoryName = filter.replace('category-', '');
                let hasVisibleCards = false;

                postCards.forEach(card => {
                    const cardCategory = card.dataset.category || '';
                    if (cardCategory === categoryName) {
                        card.classList.remove('hidden');
                        hasVisibleCards = true;
                    } else {
                        card.classList.add('hidden');
                    }
                });

                yearGroups.forEach(group => {
                    const visibleCards = group.querySelectorAll('.post-card:not(.hidden)');
                    if (visibleCards.length > 0) {
                        group.style.display = 'block';
                    } else {
                        group.style.display = 'none';
                    }
                });

                const archiveContent = document.querySelector('.archive-content');
                if (!hasVisibleCards) {
                    if (!archiveContent.querySelector('.empty-state')) {
                        const emptyState = document.createElement('div');
                        emptyState.className = 'empty-state';
                        emptyState.innerHTML = `
                            <div class="empty-icon"><i class="fas fa-folder"></i></div>
                            <div class="empty-text">该分类下暂无文章</div>
                        `;
                        archiveContent.appendChild(emptyState);
                    }
                } else {
                    const existingEmptyState = archiveContent.querySelector('.empty-state');
                    if (existingEmptyState) {
                        existingEmptyState.remove();
                    }
                }
            }
        });
    });
}

function initYearNavigation() {
    const yearDots = document.querySelectorAll('.year-dot');
    const yearGroups = document.querySelectorAll('.year-group');
    let lastActiveYear = null;

    yearDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const year = this.dataset.year;
            if (year === lastActiveYear) return;
            
            yearDots.forEach(d => d.classList.remove('active'));
            this.classList.add('active');
            lastActiveYear = year;

            const targetGroup = document.querySelector(`.year-group[data-year="${year}"]`);

            if (targetGroup) {
                targetGroup.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    yearGroups.forEach(group => {
        const year = group.dataset.year;
        const correspondingDot = document.querySelector(`.year-dot[data-year="${year}"]`);
        
        if (correspondingDot) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && year !== lastActiveYear) {
                        yearDots.forEach(d => d.classList.remove('active'));
                        correspondingDot.classList.add('active');
                        lastActiveYear = year;
                    }
                });
            }, { threshold: 0.3, rootMargin: '-50px' });

            observer.observe(group);
        }
    });
}

function initViewSwitch() {
    const timelineBtn = document.getElementById('view-timeline');
    const gridBtn = document.getElementById('view-grid');
    const archiveContent = document.querySelector('.archive-content');

    if (!timelineBtn || !gridBtn || !archiveContent) return;

    timelineBtn.addEventListener('click', function() {
        timelineBtn.classList.add('active');
        gridBtn.classList.remove('active');
        archiveContent.classList.remove('grid-view');
        archiveContent.classList.add('timeline-view');
        localStorage.setItem('archiveView', 'timeline');
    });

    gridBtn.addEventListener('click', function() {
        gridBtn.classList.add('active');
        timelineBtn.classList.remove('active');
        archiveContent.classList.remove('timeline-view');
        archiveContent.classList.add('grid-view');
        localStorage.setItem('archiveView', 'grid');
    });

    const savedView = localStorage.getItem('archiveView') || 'timeline';
    if (savedView === 'grid') {
        gridBtn.click();
    }
}

function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');

    if (!backToTopBtn) return;

    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                if (window.scrollY > 300) {
                    backToTopBtn.style.display = 'flex';
                } else {
                    backToTopBtn.style.display = 'none';
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initCardHover() {
    const cards = document.querySelectorAll('.post-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('search-input');
        if (searchInput && document.activeElement === searchInput) {
            searchInput.value = '';
            searchInput.blur();
            document.getElementById('search-clear')?.click();
        }
    }
});