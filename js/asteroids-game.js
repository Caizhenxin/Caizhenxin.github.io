// 网页纸飞机射击游戏
(function () {
    'use strict';

    var STATE_IDLE = 0;
    var STATE_ACTIVE = 1;
    var gameState = STATE_IDLE;

    var canvas, ctx;
    var keys = {};
    var bullets = [];
    var particles = [];
    var destroyedElements = [];
    var score = 0;
    var hudEl;

    var ship = {
        x: 0,
        y: 0,
        angle: -Math.PI / 2,
        speed: 5,
        size: 16,
        thrust: 0
    };

    var BULLET_SPEED = 10;
    var BULLET_LIFETIME = 80;
    var SHOOT_COOLDOWN = 8;
    var shootTimer = 0;
    var PARTICLE_COUNT = 20;
    var PARTICLE_LIFETIME = 30;

    var DESTROYABLE_TAGS = [
        'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'A', 'LI', 'TD', 'TH',
        'SPAN', 'DIV', 'BUTTON', 'IMG', 'BLOCKQUOTE', 'CODE', 'PRE',
        'STRONG', 'EM', 'LABEL', 'FIGCAPTION', 'FIGURE',
        'B', 'I', 'U', 'SMALL', 'CITE', 'MARK', 'DEL', 'INS', 'Q',
        'ABBR', 'TIME', 'KBD', 'SAMP', 'VAR', 'DT', 'DD', 'SUP', 'SUB',
        'SUMMARY', 'DETAILS', 'LEGEND', 'CAPTION', 'ADDRESS', 'DFN',
        'RUBY', 'RT', 'RP', 'BDI', 'BDO', 'WBR'
    ];

    var destroyableElementsCache = [];
    var cacheFrameCounter = 0;
    var CACHE_REFRESH_INTERVAL = 10;

    function isDestroyableElement(el) {
        if (el === canvas || el === hudEl) return false;
        if (el.closest('#asteroids-hud')) return false;
        if (el.classList.contains('asteroids-particle')) return false;
        if (el.classList.contains('asteroids-element-destroyed')) return false;
        if (DESTROYABLE_TAGS.indexOf(el.tagName) === -1) return false;
        return true;
    }

    function refreshDestroyableElementsCache() {
        destroyableElementsCache = [];
        var all = document.querySelectorAll('body *');
        for (var i = 0; i < all.length; i++) {
            var el = all[i];
            if (!isDestroyableElement(el)) continue;

            var rect = el.getBoundingClientRect();
            if (rect.width < 2 || rect.height < 2) continue;
            if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
            if (rect.right < 0 || rect.left > window.innerWidth) continue;

            destroyableElementsCache.push({ el: el, area: rect.width * rect.height });
        }

        destroyableElementsCache.sort(function (a, b) { return a.area - b.area; });
    }

    function segmentHitsRect(x1, y1, x2, y2, rect) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var steps = Math.max(1, Math.ceil(dist / 3));
        for (var s = 0; s <= steps; s++) {
            var t = s / steps;
            var px = x1 + dx * t;
            var py = y1 + dy * t;
            if (px >= rect.left && px <= rect.right && py >= rect.top && py <= rect.bottom) {
                return true;
            }
        }
        return false;
    }

    function createCanvas() {
        canvas = document.createElement('canvas');
        canvas.id = 'asteroids-game-canvas';
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        resizeCanvas();
    }

    function createHUD() {
        hudEl = document.createElement('div');
        hudEl.id = 'asteroids-hud';
        hudEl.innerHTML =
            '<div class="asteroids-hud-inner">' +
            '<div class="asteroids-hud-left">' +
            '<div class="asteroids-hud-score-label">击毁数</div>' +
            '<div class="asteroids-hud-score" id="asteroids-score">0</div>' +
            '</div>' +
            '<div class="asteroids-hud-controls">' +
            '<span class="key">W A S D</span> 或 <span class="key">↑ ← ↓ →</span> 移动<br>' +
            '<span class="key">SPACE</span> 发射子弹 &nbsp; <span class="key">G</span> 开关游戏' +
            '</div>' +
            '</div>';
        document.body.appendChild(hudEl);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function initShip() {
        ship.x = window.innerWidth / 2;
        ship.y = window.innerHeight / 2;
        ship.angle = -Math.PI / 2;
        ship.thrust = 0;
    }

    function spawnParticles(x, y, color) {
        for (var i = 0; i < PARTICLE_COUNT; i++) {
            var angle = Math.random() * Math.PI * 2;
            var speed = 2 + Math.random() * 6;
            var el = document.createElement('div');
            el.className = 'asteroids-particle';
            el.style.left = x + 'px';
            el.style.top = y + 'px';
            el.style.width = (2 + Math.random() * 5) + 'px';
            el.style.height = (2 + Math.random() * 5) + 'px';
            el.style.background = color || '#ffcc00';
            el.style.boxShadow = '0 0 6px ' + (color || '#ffcc00');
            document.body.appendChild(el);

            particles.push({
                el: el,
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: PARTICLE_LIFETIME
            });
        }
    }

    function updateParticles() {
        for (var i = particles.length - 1; i >= 0; i--) {
            var p = particles[i];
            p.life--;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2;
            p.el.style.left = p.x + 'px';
            p.el.style.top = p.y + 'px';
            p.el.style.opacity = Math.max(0, p.life / PARTICLE_LIFETIME);

            if (p.life <= 0) {
                p.el.remove();
                particles.splice(i, 1);
            }
        }
    }

    function getDestroyableElements() {
        return destroyableElementsCache;
    }

    function destroyElement(el, hitX, hitY) {
        if (el.classList.contains('asteroids-element-destroyed')) return;

        el.classList.add('asteroids-element-destroyed');

        var colors = ['#ff6b6b', '#ffcc00', '#ff8c00', '#ff4757', '#ff6348', '#e74c3c'];
        var color = colors[Math.floor(Math.random() * colors.length)];
        spawnParticles(hitX, hitY, color);

        score++;
        var scoreEl = document.getElementById('asteroids-score');
        if (scoreEl) {
            scoreEl.textContent = score;
            scoreEl.style.transform = 'scale(1.3)';
            setTimeout(function () { scoreEl.style.transform = 'scale(1)'; }, 150);
        }

        destroyedElements.push(el);

        for (var i = destroyableElementsCache.length - 1; i >= 0; i--) {
            if (destroyableElementsCache[i].el === el) {
                destroyableElementsCache.splice(i, 1);
            }
        }

        setTimeout(function () {
            if (el.parentNode) {
                el.style.visibility = 'hidden';
                el.style.height = '0';
                el.style.margin = '0';
                el.style.padding = '0';
                el.style.overflow = 'hidden';
            }
        }, 500);
    }

    function checkBulletElementCollision(bullet) {
        var elements = getDestroyableElements();
        for (var i = 0; i < elements.length; i++) {
            var item = elements[i];
            if (item.el.classList.contains('asteroids-element-destroyed')) continue;

            var rect = item.el.getBoundingClientRect();
            if (rect.width < 2 || rect.height < 2) continue;

            if (segmentHitsRect(bullet.prevX, bullet.prevY, bullet.x, bullet.y, rect)) {
                var centerX = rect.left + rect.width / 2;
                var centerY = rect.top + rect.height / 2;
                destroyElement(item.el, centerX, centerY);
                return true;
            }
        }
        return false;
    }

    function shoot() {
        var bulletX = ship.x + Math.cos(ship.angle) * (ship.size + 6);
        var bulletY = ship.y + Math.sin(ship.angle) * (ship.size + 6);
        bullets.push({
            x: bulletX,
            y: bulletY,
            prevX: bulletX,
            prevY: bulletY,
            vx: Math.cos(ship.angle) * BULLET_SPEED,
            vy: Math.sin(ship.angle) * BULLET_SPEED,
            life: BULLET_LIFETIME
        });
    }

    function updateBullets() {
        for (var i = bullets.length - 1; i >= 0; i--) {
            var b = bullets[i];
            b.prevX = b.x;
            b.prevY = b.y;
            b.x += b.vx;
            b.y += b.vy;
            b.life--;

            if (
                b.x < -20 || b.x > canvas.width + 20 ||
                b.y < -20 || b.y > canvas.height + 20 ||
                b.life <= 0
            ) {
                bullets.splice(i, 1);
                continue;
            }

            if (checkBulletElementCollision(b)) {
                bullets.splice(i, 1);
            }
        }
    }

    function updateShip() {
        var moving = false;

        if (keys['KeyW'] || keys['ArrowUp']) {
            ship.y -= ship.speed;
            ship.angle = -Math.PI / 2;
            moving = true;
        }
        if (keys['KeyS'] || keys['ArrowDown']) {
            ship.y += ship.speed;
            ship.angle = Math.PI / 2;
            moving = true;
        }
        if (keys['KeyA'] || keys['ArrowLeft']) {
            ship.x -= ship.speed;
            if (!(keys['KeyW'] || keys['ArrowUp'] || keys['KeyS'] || keys['ArrowDown'])) {
                ship.angle = Math.PI;
            } else {
                ship.angle = Math.PI + (keys['KeyW'] || keys['ArrowUp'] ? -0.5 : 0.5);
            }
            moving = true;
        }
        if (keys['KeyD'] || keys['ArrowRight']) {
            ship.x += ship.speed;
            if (!(keys['KeyW'] || keys['ArrowUp'] || keys['KeyS'] || keys['ArrowDown'])) {
                ship.angle = 0;
            } else {
                ship.angle = (keys['KeyW'] || keys['ArrowUp'] ? -0.5 : 0.5);
            }
            moving = true;
        }

        ship.thrust = moving ? 1 : Math.max(0, ship.thrust - 0.05);

        ship.x = Math.max(ship.size, Math.min(canvas.width - ship.size, ship.x));
        ship.y = Math.max(ship.size, Math.min(canvas.height - ship.size, ship.y));

        if (keys['Space'] && shootTimer <= 0) {
            shoot();
            shootTimer = SHOOT_COOLDOWN;
        }
        if (shootTimer > 0) {
            shootTimer--;
        }
    }

    function drawShip() {
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(ship.angle);

        ctx.beginPath();
        ctx.moveTo(ship.size, 0);
        ctx.lineTo(-ship.size * 0.7, -ship.size * 0.55);
        ctx.lineTo(-ship.size * 0.5, 0);
        ctx.lineTo(-ship.size * 0.7, ship.size * 0.55);
        ctx.closePath();
        ctx.fillStyle = '#00ffcc';
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-ship.size * 0.5, -ship.size * 0.2);
        ctx.lineTo(-ship.size * 0.1, 0);
        ctx.lineTo(-ship.size * 0.5, ship.size * 0.2);
        ctx.closePath();
        ctx.fillStyle = '#008866';
        ctx.fill();

        if (ship.thrust > 0.3) {
            var flicker = Math.random() * 6;
            ctx.beginPath();
            ctx.moveTo(-ship.size * 0.65, -ship.size * 0.25);
            ctx.lineTo(-ship.size * 0.65 - 4 - flicker, 0);
            ctx.lineTo(-ship.size * 0.65, ship.size * 0.25);
            ctx.closePath();
            ctx.fillStyle = 'rgba(255, 180, 50, ' + ship.thrust + ')';
            ctx.fill();
        }

        ctx.restore();
    }

    function drawBullets() {
        for (var i = 0; i < bullets.length; i++) {
            var b = bullets[i];
            ctx.beginPath();
            ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#ffcc00';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ff8800';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function drawCrosshair() {
        var cx = ship.x + Math.cos(ship.angle) * (ship.size + BULLET_LIFETIME * BULLET_SPEED / 2);
        var cy = ship.y + Math.sin(ship.angle) * (ship.size + BULLET_LIFETIME * BULLET_SPEED / 2);

        cx = Math.max(10, Math.min(canvas.width - 10, cx));
        cy = Math.max(10, Math.min(canvas.height - 10, cy));

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);

        ctx.beginPath();
        ctx.moveTo(ship.x, ship.y);
        ctx.lineTo(cx, cy);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    function gameLoop() {
        if (gameState !== STATE_ACTIVE) {
            requestAnimationFrame(gameLoop);
            return;
        }

        if (cacheFrameCounter <= 0) {
            refreshDestroyableElementsCache();
            cacheFrameCounter = CACHE_REFRESH_INTERVAL;
        }
        cacheFrameCounter--;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        updateShip();
        updateBullets();
        updateParticles();
        drawCrosshair();
        drawBullets();
        drawShip();

        requestAnimationFrame(gameLoop);
    }

    function activateGame() {
        gameState = STATE_ACTIVE;
        hudEl.classList.add('visible');
        if (ship.x === 0 && ship.y === 0) {
            initShip();
        }
        var scoreEl = document.getElementById('asteroids-score');
        if (scoreEl) scoreEl.textContent = score;
    }

    function deactivateGame() {
        gameState = STATE_IDLE;
        hudEl.classList.remove('visible');
        keys = {};
        bullets = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    window.addEventListener('keydown', function (e) {
        if (e.code === 'KeyG') {
            e.preventDefault();
            if (gameState === STATE_IDLE) {
                activateGame();
            } else {
                deactivateGame();
            }
            return;
        }

        if (gameState !== STATE_ACTIVE) return;

        if (
            e.code === 'Space' ||
            e.code === 'ArrowUp' || e.code === 'ArrowDown' ||
            e.code === 'ArrowLeft' || e.code === 'ArrowRight' ||
            e.code === 'KeyW' || e.code === 'KeyA' ||
            e.code === 'KeyS' || e.code === 'KeyD'
        ) {
            e.preventDefault();
        }

        keys[e.code] = true;
    });

    window.addEventListener('keyup', function (e) {
        keys[e.code] = false;

        if (
            e.code === 'Space' ||
            e.code === 'ArrowUp' || e.code === 'ArrowDown' ||
            e.code === 'ArrowLeft' || e.code === 'ArrowRight' ||
            e.code === 'KeyW' || e.code === 'KeyA' ||
            e.code === 'KeyS' || e.code === 'KeyD'
        ) {
            e.preventDefault();
        }
    });

    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('scroll', function () {
        if (gameState === STATE_ACTIVE) {
            cacheFrameCounter = 0;
        }
    }, { passive: true });

    function init() {
        createCanvas();
        createHUD();
        initShip();
        gameLoop();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
