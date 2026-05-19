(function () {
    'use strict';

    function Vector(x, y) {
        if (typeof x === 'object') {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x || 0;
            this.y = y || 0;
        }
    }

    Vector.prototype = {
        cp: function () { return new Vector(this.x, this.y); },
        mul: function (f) { this.x *= f; this.y *= f; return this; },
        mulNew: function (f) { return new Vector(this.x * f, this.y * f); },
        add: function (v) { this.x += v.x; this.y += v.y; return this; },
        addNew: function (v) { return new Vector(this.x + v.x, this.y + v.y); },
        sub: function (v) { this.x -= v.x; this.y -= v.y; return this; },
        subNew: function (v) { return new Vector(this.x - v.x, this.y - v.y); },
        rotate: function (angle) {
            var x = this.x, y = this.y;
            this.x = x * Math.cos(angle) - Math.sin(angle) * y;
            this.y = x * Math.sin(angle) + Math.cos(angle) * y;
            return this;
        },
        rotateNew: function (angle) { return this.cp().rotate(angle); },
        setAngle: function (angle) {
            var l = this.len();
            this.x = Math.cos(angle) * l;
            this.y = Math.sin(angle) * l;
            return this;
        },
        setAngleNew: function (angle) { return this.cp().setAngle(angle); },
        setLength: function (len) {
            var l = this.len();
            if (l) this.mul(len / l);
            else this.x = this.y = len;
            return this;
        },
        setLengthNew: function (len) { return this.cp().setLength(len); },
        normalize: function () {
            var l = this.len();
            this.x /= l;
            this.y /= l;
            return this;
        },
        normalizeNew: function () { return this.cp().normalize(); },
        angle: function () { return Math.atan2(this.y, this.x); },
        len: function () {
            var l = Math.sqrt(this.x * this.x + this.y * this.y);
            if (l < 0.005 && l > -0.005) return 0;
            return l;
        },
        is: function (v) {
            return typeof v === 'object' && this.x === v.x && this.y === v.y;
        }
    };

    function Asteroids(color) {
        if (!window.ASTEROIDS) window.ASTEROIDS = { enemiesKilled: 0 };

        var that = this;
        this.shipColor = color || '#ffffff';
        var w = window.innerWidth;
        var h = window.innerHeight;

        var playerWidth = 20;
        var playerHeight = 30;
        var playerVerts = [
            [-1 * playerHeight / 2, -1 * playerWidth / 2],
            [-1 * playerHeight / 2, playerWidth / 2],
            [playerHeight / 2, 0]
        ];

        var ignoredTypes = [
            'HTML', 'HEAD', 'BODY', 'SCRIPT', 'TITLE', 'META', 'STYLE', 'LINK',
            'SHAPE', 'LINE', 'GROUP', 'IMAGE', 'STROKE', 'FILL', 'SKEW', 'PATH', 'TEXTPATH'
        ];
        var hiddenTypes = ['BR', 'HR'];

        var acc = 300;
        var maxSpeed = 600;
        var rotSpeed = 360;
        var bulletSpeed = 700;
        var particleSpeed = 400;
        var timeBetweenFire = 150;
        var timeBetweenBlink = 250;
        var bulletRadius = 2;
        var maxParticles = 40;
        var maxBullets = 20;

        this.flame = { r: [], y: [] };

        this.toggleBlinkStyle = function () {
            if (this.updated.blink.isActive) {
                removeClass(document.body, 'ASTEROIDSBLINK');
            } else {
                addClass(document.body, 'ASTEROIDSBLINK');
            }
            this.updated.blink.isActive = !this.updated.blink.isActive;
        };

        addStylesheet('.ASTEROIDSBLINK .ASTEROIDSYEAHENEMY', 'outline: 2px dotted red;');

        this.pos = new Vector(100, 100);
        this.lastPos = false;
        this.vel = new Vector(0, 0);
        this.dir = new Vector(0, 1);
        this.keysPressed = {};
        this.firedAt = 0;
        this.updated = {
            enemies: false,
            flame: Date.now(),
            blink: { time: 0, isActive: false }
        };
        this.scrollPos = new Vector(0, 0);
        this.bullets = [];
        this.enemies = [];
        this.dying = [];
        this.totalEnemies = 0;
        this.particles = [];

        function updateEnemyIndex() {
            for (var i = 0; i < that.enemies.length; i++) {
                removeClass(that.enemies[i], 'ASTEROIDSYEAHENEMY');
            }
            var all = document.body.getElementsByTagName('*');
            that.enemies = [];
            for (var i = 0; i < all.length; i++) {
                var el = all[i];
                if (indexOf(ignoredTypes, el.tagName.toUpperCase()) !== -1) continue;
                if (el.prefix === 'g_vml_') continue;
                if (!hasOnlyTextualChildren(el)) continue;
                if (el.className === 'ASTEROIDSYEAH') continue;
                if (el.offsetHeight <= 0) continue;

                el.aSize = size(el);
                that.enemies.push(el);
                addClass(el, 'ASTEROIDSYEAHENEMY');
                if (!el.aAdded) {
                    el.aAdded = true;
                    that.totalEnemies++;
                }
            }
        }

        updateEnemyIndex();

        var createFlames;
        (function () {
            var rWidth = playerWidth;
            var rIncrease = playerWidth * 0.1;
            var yWidth = playerWidth * 0.6;
            var yIncrease = yWidth * 0.2;
            var halfR = rWidth / 2;
            var halfY = yWidth / 2;
            var halfPH = playerHeight / 2;

            createFlames = function () {
                that.flame.r = [[-1 * halfPH, -1 * halfR]];
                that.flame.y = [[-1 * halfPH, -1 * halfY]];
                for (var x = 0; x < rWidth; x += rIncrease) {
                    that.flame.r.push([-random(2, 7) - halfPH, x - halfR]);
                }
                that.flame.r.push([-1 * halfPH, halfR]);
                for (var x = 0; x < yWidth; x += yIncrease) {
                    that.flame.y.push([-random(2, 7) - halfPH, x - halfY]);
                }
                that.flame.y.push([-1 * halfPH, halfY]);
            };
        })();

        createFlames();

        function radians(deg) { return deg * 0.0174532925; }
        function random(from, to) { return Math.floor(Math.random() * (to + 1) + from); }

        function code(name) {
            var table = { up: 38, down: 40, left: 37, right: 39, esc: 27 };
            if (table[name]) return table[name];
            return name.charCodeAt(0);
        }

        function boundsCheck(vec) {
            if (vec.x > w) vec.x = 0;
            else if (vec.x < 0) vec.x = w;
            if (vec.y > h) vec.y = 0;
            else if (vec.y < 0) vec.y = h;
        }

        function size(element) {
            var el = element;
            var left = 0;
            var top = 0;
            do {
                left += el.offsetLeft || 0;
                top += el.offsetTop || 0;
                el = el.offsetParent;
            } while (el);
            return {
                x: left, y: top,
                width: element.offsetWidth || 10,
                height: element.offsetHeight || 10
            };
        }

        function applyVisibility(vis) {
            that.gameContainer.style.visibility = vis;
        }

        function getElementFromPoint(x, y) {
            applyVisibility('hidden');
            var element = document.elementFromPoint(x, y);
            if (!element) {
                applyVisibility('visible');
                return false;
            }
            if (element.nodeType === 3) element = element.parentNode;
            applyVisibility('visible');
            return element;
        }

        function addParticles(startPos) {
            var time = Date.now();
            for (var i = 0; i < maxParticles; i++) {
                that.particles.push({
                    dir: (new Vector(Math.random() * 20 - 10, Math.random() * 20 - 10)).normalize(),
                    pos: startPos.cp(),
                    cameAlive: time
                });
            }
        }

        function setScore() {
            that.scoreEl.textContent = window.ASTEROIDS.enemiesKilled * 10;
        }

        function hasOnlyTextualChildren(element) {
            if (element.offsetLeft < -100 && element.offsetWidth > 0 && element.offsetHeight > 0) return false;
            if (indexOf(hiddenTypes, element.tagName) !== -1) return true;
            if (element.offsetWidth === 0 && element.offsetHeight === 0) return false;
            for (var i = 0; i < element.childNodes.length; i++) {
                var child = element.childNodes[i];
                if (indexOf(hiddenTypes, child.tagName) === -1 && child.childNodes.length !== 0) return false;
            }
            return true;
        }

        function indexOf(arr, item, from) {
            if (arr.indexOf) return arr.indexOf(item, from);
            var len = arr.length;
            var start = (from < 0) ? Math.max(0, len + from) : (from || 0);
            for (var i = start; i < len; i++) {
                if (arr[i] === item) return i;
            }
            return -1;
        }

        function addClass(element, className) {
            if (element.className.indexOf(className) === -1) {
                element.className = (element.className + ' ' + className).replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '');
            }
        }

        function removeClass(element, className) {
            element.className = element.className.replace(new RegExp('(^|\\s)' + className + '(?:\\s|$)', 'g'), ' ').replace(/\s+/g, ' ').trim();
        }

        function addStylesheet(selector, rules) {
            var sheet = document.createElement('style');
            sheet.type = 'text/css';
            sheet.id = 'ASTEROIDSYEAHSTYLES';
            sheet.textContent = selector + '{' + rules + '}';
            document.getElementsByTagName('head')[0].appendChild(sheet);
        }

        function removeStylesheet(name) {
            var sheet = document.getElementById(name);
            if (sheet) sheet.parentNode.removeChild(sheet);
        }

        this.gameContainer = document.createElement('div');
        this.gameContainer.className = 'ASTEROIDSYEAH';
        document.body.appendChild(this.gameContainer);

        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('width', w);
        this.canvas.setAttribute('height', h);
        this.canvas.className = 'ASTEROIDSYEAH';
        this.canvas.style.cssText = 'position:fixed;top:0;left:0;z-index:10000;pointer-events:none;';

        if (!this.canvas.getContext) {
            alert('This program does not yet support your browser.');
        }

        this.canvas.addEventListener('mousedown', function (e) {
            var msg = document.createElement('span');
            msg.style.cssText = 'position:absolute;border:1px solid #999;background:white;color:black;padding:4px 8px;border-radius:4px;';
            msg.textContent = 'Press Esc to quit';
            document.body.appendChild(msg);
            var x = e.pageX || (e.clientX + document.documentElement.scrollLeft);
            var y = e.pageY || (e.clientY + document.documentElement.scrollTop);
            msg.style.left = (x - msg.offsetWidth / 2) + 'px';
            msg.style.top = (y - msg.offsetHeight / 2) + 'px';
            setTimeout(function () {
                if (msg.parentNode) msg.parentNode.removeChild(msg);
            }, 1000);
        });

        var eventResize = function () {
            that.canvas.style.display = 'none';
            w = window.innerWidth;
            h = window.innerHeight;
            that.canvas.setAttribute('width', w);
            that.canvas.setAttribute('height', h);
            that.canvas.style.display = 'block';
        };

        window.addEventListener('resize', eventResize);
        this.gameContainer.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = 'black';
        this.ctx.strokeStyle = 'black';

        if (!document.getElementById('ASTEROIDS-NAVIGATION')) {
            this.navigation = document.createElement('div');
            this.navigation.id = 'ASTEROIDS-NAVIGATION';
            this.navigation.className = 'ASTEROIDSYEAH';
            this.navigation.style.cssText = 'font-family:Arial,sans-serif;position:fixed;z-index:10001;bottom:10px;right:10px;text-align:right;';
            this.navigation.innerHTML =
                '<span style="color:#aaa;font-size:12px;">';
            this.gameContainer.appendChild(this.navigation);

            this.scoreEl = document.createElement('span');
            this.scoreEl.id = 'ASTEROIDS-POINTS';
            this.scoreEl.style.cssText = 'font:bold 28pt Arial,sans-serif;color:#00ff88;text-shadow:0 0 10px rgba(0,255,136,0.5);';
            this.scoreEl.className = 'ASTEROIDSYEAH';
            this.navigation.appendChild(this.scoreEl);

            var helpSpan = document.createElement('span');
            helpSpan.style.cssText = 'color:#aaa;font-size:12px;margin-left:10px;';
            helpSpan.textContent = '(Esc 退出 · B 高亮目标)';
            this.navigation.appendChild(helpSpan);
        } else {
            this.navigation = document.getElementById('ASTEROIDS-NAVIGATION');
            this.scoreEl = document.getElementById('ASTEROIDS-POINTS');
        }

        setScore();

        addClass(document.body, 'ASTEROIDSYEAH');

        var eventKeydown = function (event) {
            that.keysPressed[event.keyCode] = true;
            if (event.keyCode === code(' ')) that.firedAt = 1;
            if (indexOf([code('up'), code('down'), code('right'), code('left'), code(' '), code('B'),
                code('W'), code('A'), code('S'), code('D')], event.keyCode) !== -1) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        var eventKeyup = function (event) {
            that.keysPressed[event.keyCode] = false;
            if (indexOf([code('up'), code('down'), code('right'), code('left'), code(' '), code('B'),
                code('W'), code('A'), code('S'), code('D')], event.keyCode) !== -1) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        document.addEventListener('keydown', eventKeydown);
        document.addEventListener('keyup', eventKeyup);

        this.ctx.drawLine = function (xFrom, yFrom, xTo, yTo) {
            this.beginPath();
            this.moveTo(xFrom, yFrom);
            this.lineTo(xTo, yTo);
            this.lineTo(xTo + 1, yTo + 1);
            this.closePath();
            this.fill();
        };

        this.ctx.tracePoly = function (verts) {
            this.beginPath();
            this.moveTo(verts[0][0], verts[0][1]);
            for (var i = 1; i < verts.length; i++) {
                this.lineTo(verts[i][0], verts[i][1]);
            }
            this.closePath();
        };

        this.ctx.drawPlayer = function () {
            this.save();
            this.translate(that.pos.x, that.pos.y);
            this.rotate(that.dir.angle());
            this.tracePoly(playerVerts);
            this.fillStyle = that.shipColor;
            this.fill();
            this.tracePoly(playerVerts);
            this.strokeStyle = that.shipColor;
            this.stroke();
            this.restore();
        };

        var PI_SQ = Math.PI * 2;

        this.ctx.drawBullets = function (bullets) {
            this.fillStyle = '#ffcc00';
            this.shadowBlur = 6;
            this.shadowColor = '#ff8800';
            for (var i = 0; i < bullets.length; i++) {
                this.beginPath();
                this.arc(bullets[i].pos.x, bullets[i].pos.y, bulletRadius, 0, PI_SQ);
                this.closePath();
                this.fill();
            }
            this.shadowBlur = 0;
        };

        var randomParticleColor = function () {
            return ['#ff6b6b', '#ffcc00', '#ff8c00', '#ff4757', '#e74c3c'][random(0, 4)];
        };

        this.ctx.drawParticles = function (particles) {
            for (var i = 0; i < particles.length; i++) {
                this.fillStyle = randomParticleColor();
                this.drawLine(
                    particles[i].pos.x, particles[i].pos.y,
                    particles[i].pos.x - particles[i].dir.x * 10,
                    particles[i].pos.y - particles[i].dir.y * 10
                );
            }
        };

        this.ctx.drawFlames = function (flame) {
            this.save();
            this.translate(that.pos.x, that.pos.y);
            this.rotate(that.dir.angle());
            this.strokeStyle = '#ff4444';
            this.tracePoly(flame.r);
            this.stroke();
            this.strokeStyle = '#ffcc00';
            this.tracePoly(flame.y);
            this.stroke();
            this.restore();
        };

        addParticles(this.pos);

        var lastUpdate = performance.now();
        var animFrameId;

        this.update = function (timestamp) {
            var tDelta = (timestamp - lastUpdate) / 1000;
            lastUpdate = timestamp;
            if (tDelta > 0.1) tDelta = 0.1;

            var drawFlame = false;

            if (timestamp - this.updated.flame > 50) {
                createFlames();
                this.updated.flame = timestamp;
            }

            this.scrollPos.x = window.pageXOffset || document.documentElement.scrollLeft;
            this.scrollPos.y = window.pageYOffset || document.documentElement.scrollTop;

            if (this.keysPressed[code('up')] || this.keysPressed[code('W')]) {
                this.vel.add(this.dir.mulNew(acc * tDelta));
                drawFlame = true;
            } else {
                this.vel.mul(0.96);
            }

            if (this.keysPressed[code('left')] || this.keysPressed[code('A')]) {
                this.dir.rotate(radians(rotSpeed * tDelta * -1));
            }
            if (this.keysPressed[code('right')] || this.keysPressed[code('D')]) {
                this.dir.rotate(radians(rotSpeed * tDelta));
            }

            if (this.keysPressed[code(' ')] && timestamp - this.firedAt > timeBetweenFire) {
                this.bullets.unshift({
                    dir: this.dir.cp(),
                    pos: this.pos.cp(),
                    startVel: this.vel.cp(),
                    cameAlive: timestamp
                });
                this.firedAt = timestamp;
                if (this.bullets.length > maxBullets) this.bullets.pop();
            }

            if (this.keysPressed[code('B')]) {
                if (!this.updated.enemies) {
                    updateEnemyIndex();
                    this.updated.enemies = true;
                }
                this.updated.blink.time += tDelta * 1000;
                if (this.updated.blink.time > timeBetweenBlink) {
                    this.toggleBlinkStyle();
                    this.updated.blink.time = 0;
                }
            } else {
                this.updated.enemies = false;
            }

            if (this.keysPressed[code('esc')]) {
                destroy.call(this);
                return;
            }

            if (this.vel.len() > maxSpeed) {
                this.vel.setLength(maxSpeed);
            }

            this.pos.add(this.vel.mulNew(tDelta));

            if (this.pos.x > w) {
                window.scrollTo(this.scrollPos.x + 50, this.scrollPos.y);
                this.pos.x = 0;
            } else if (this.pos.x < 0) {
                window.scrollTo(this.scrollPos.x - 50, this.scrollPos.y);
                this.pos.x = w;
            }
            if (this.pos.y > h) {
                window.scrollTo(this.scrollPos.x, this.scrollPos.y + h * 0.75);
                this.pos.y = 0;
            } else if (this.pos.y < 0) {
                window.scrollTo(this.scrollPos.x, this.scrollPos.y - h * 0.75);
                this.pos.y = h;
            }

            for (var i = this.bullets.length - 1; i >= 0; i--) {
                if (timestamp - this.bullets[i].cameAlive > 2000) {
                    this.bullets.splice(i, 1);
                    continue;
                }
                var bv = this.bullets[i].dir.setLengthNew(bulletSpeed * tDelta).add(this.bullets[i].startVel.mulNew(tDelta));
                this.bullets[i].pos.add(bv);
                boundsCheck(this.bullets[i].pos);

                var hitEl = getElementFromPoint(this.bullets[i].pos.x, this.bullets[i].pos.y);
                if (hitEl && hitEl.tagName &&
                    indexOf(ignoredTypes, hitEl.tagName.toUpperCase()) === -1 &&
                    hasOnlyTextualChildren(hitEl) &&
                    hitEl.className !== 'ASTEROIDSYEAH') {
                    addParticles(this.bullets[i].pos);
                    this.dying.push(hitEl);
                    this.bullets.splice(i, 1);
                }
            }

            if (this.dying.length) {
                for (var j = this.dying.length - 1; j >= 0; j--) {
                    try {
                        if (this.dying[j].parentNode) {
                            window.ASTEROIDS.enemiesKilled++;
                            this.dying[j].parentNode.removeChild(this.dying[j]);
                        }
                    } catch (e) {}
                }
                setScore();
                this.dying = [];
            }

            for (var k = this.particles.length - 1; k >= 0; k--) {
                this.particles[k].pos.add(this.particles[k].dir.mulNew(particleSpeed * tDelta * Math.random()));
                if (timestamp - this.particles[k].cameAlive > 1000) {
                    this.particles.splice(k, 1);
                }
            }

            var needsRedraw = this.bullets.length !== 0 ||
                this.particles.length !== 0 ||
                !this.pos.is(this.lastPos) ||
                this.vel.len() > 0;

            if (needsRedraw) {
                this.ctx.clearRect(0, 0, w, h);
                this.ctx.drawPlayer();
                if (drawFlame) this.ctx.drawFlames(that.flame);
                if (this.bullets.length) this.ctx.drawBullets(this.bullets);
                if (this.particles.length) this.ctx.drawParticles(this.particles);
            }

            this.lastPos = this.pos.cp();
            animFrameId = requestAnimationFrame(boundUpdate);
        };

        var boundUpdate = function (ts) { that.update(ts); };
        animFrameId = requestAnimationFrame(boundUpdate);

        var isRunning = true;

        function destroy() {
            document.removeEventListener('keydown', eventKeydown);
            document.removeEventListener('keyup', eventKeyup);
            window.removeEventListener('resize', eventResize);
            isRunning = false;
            cancelAnimationFrame(animFrameId);
            removeStylesheet('ASTEROIDSYEAHSTYLES');
            removeClass(document.body, 'ASTEROIDSYEAH');
            removeClass(document.body, 'ASTEROIDSBLINK');
            if (that.gameContainer.parentNode) {
                that.gameContainer.parentNode.removeChild(that.gameContainer);
            }
        }

        this.destroy = destroy;
    }

    var SHIP_COLORS = [
        { name: '皓月白', value: '#ffffff' },
        { name: '霓虹青', value: '#00ffff' },
        { name: '翠绿',   value: '#00ff88' },
        { name: '琥珀金', value: '#ffcc00' },
        { name: '洋红',   value: '#ff00ff' },
        { name: '赤焰红', value: '#ff4444' }
    ];

    var DEBUG = true;

    function log() {
        if (!DEBUG) return;
        var args = Array.prototype.slice.call(arguments);
        args.unshift('[Asteroids]');
        if (console && typeof console.log === 'function') {
            console.log.apply(console, args);
        }
    }

    function logErr() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('[Asteroids]');
        if (console && typeof console.error === 'function') {
            console.error.apply(console, args);
        }
    }

    function drawAirplaneIcon(canvas, color, size) {
        var ctx = canvas.getContext('2d');
        if (!ctx) {
            logErr('drawAirplaneIcon: cannot get 2d context');
            return;
        }
        size = size || 40;
        canvas.width = size * 2;
        canvas.height = size * 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var cx = canvas.width / 2;
        var cy = canvas.height / 2;
        var s = size * 0.7;

        ctx.save();
        ctx.translate(cx, cy);

        var noseX = s;
        var noseY = 0;
        var tailX = -s * 0.55;
        var topY = -s * 0.5;
        var botY = s * 0.5;

        ctx.beginPath();
        ctx.moveTo(noseX, noseY);
        ctx.lineTo(tailX, topY);
        ctx.lineTo(tailX, 0);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.45)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(noseX, noseY);
        ctx.lineTo(tailX, botY);
        ctx.lineTo(tailX, 0);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.65;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'rgba(255,255,255,0.45)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.restore();
    }

    var spawnedPlanes = [];
    var isExpanded = false;
    var hoverTimeout = null;
    var btnWrapper = null;
    var btnHub = null;

    function computeOrbitPositions(count, radius) {
        var positions = [];
        var totalAngle = Math.PI * 0.75;
        var startAngle = Math.PI * 1.125;
        for (var i = 0; i < count; i++) {
            var angle = startAngle + totalAngle * i / (count - 1);
            positions.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius
            });
        }
        return positions;
    }

    function expandPlanes() {
        if (isExpanded) return;
        isExpanded = true;
        log('expandPlanes: fanning out colored airplanes');

        var wrapperRect = btnWrapper.getBoundingClientRect();
        var radius = Math.min(wrapperRect.width, wrapperRect.height) * 0.42;
        var positions = computeOrbitPositions(SHIP_COLORS.length, radius);

        for (var i = 0; i < spawnedPlanes.length; i++) {
            var p = positions[i];
            var baseT = 'translate(' + p.x + 'px, ' + p.y + 'px)';
            spawnedPlanes[i].baseTranslate = baseT;
            spawnedPlanes[i].el.style.opacity = '1';
            spawnedPlanes[i].el.style.transform = baseT + ' scale(1)';
            spawnedPlanes[i].el.classList.add('visible');
        }
    }

    function collapsePlanes() {
        if (!isExpanded) return;
        isExpanded = false;
        log('collapsePlanes: retracting');

        for (var i = 0; i < spawnedPlanes.length; i++) {
            spawnedPlanes[i].el.style.opacity = '0';
            spawnedPlanes[i].el.style.transform = 'scale(0.3)';
            spawnedPlanes[i].el.classList.remove('visible');
        }
    }

    function handleHubEnter() {
        log('hub enter');
        clearHoverTimeout();
        expandPlanes();
    }

    function handleHubLeave() {
        log('hub leave');
        scheduleCollapseIfNoChild();
    }

    function handlePlaneEnter(idx) {
        spawnedPlanes[idx].isHovered = true;
        var baseT = spawnedPlanes[idx].baseTranslate;
        if (baseT) {
            spawnedPlanes[idx].el.style.transform = baseT + ' scale(1.25)';
        }
        spawnedPlanes[idx].el.classList.add('hovered');
        clearHoverTimeout();
    }

    function handlePlaneLeave(idx) {
        spawnedPlanes[idx].isHovered = false;
        var baseT = spawnedPlanes[idx].baseTranslate;
        if (baseT) {
            spawnedPlanes[idx].el.style.transform = baseT + ' scale(1)';
        }
        spawnedPlanes[idx].el.classList.remove('hovered');
        scheduleCollapseIfNoChild();
    }

    function clearHoverTimeout() {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            hoverTimeout = null;
        }
    }

    function scheduleCollapseIfNoChild() {
        hoverTimeout = setTimeout(function () {
            for (var i = 0; i < spawnedPlanes.length; i++) {
                if (spawnedPlanes[i].isHovered) return;
            }
            collapsePlanes();
        }, 200);
    }

    function handlePlaneClick(idx) {
        var colorInfo = SHIP_COLORS[idx];
        log('plane clicked: ' + colorInfo.name + ' (' + colorInfo.value + ')');
        collapsePlanes();
        launchGame(colorInfo.value);
    }

    function launchGame(color) {
        log('launchGame: color=' + color);
        if (!color) {
            logErr('launchGame: color is null/undefined');
            return;
        }
        try {
            window.ASTEROIDSPLAYERS = window.ASTEROIDSPLAYERS || [];
            var player = new Asteroids(color);
            window.ASTEROIDSPLAYERS.push(player);
            log('launchGame: OK, total=' + window.ASTEROIDSPLAYERS.length);
            if (btnWrapper) {
                btnWrapper.style.display = 'none';
            }
        } catch (e) {
            logErr('launchGame: error', e);
            if (btnWrapper) {
                btnWrapper.style.display = '';
            }
        }
    }

    function buildButton() {
        log('buildButton');
        try {
            btnWrapper = document.createElement('div');
            btnWrapper.className = 'asteroids-btn-wrapper';

            var stage = document.createElement('div');
            stage.className = 'asteroids-btn-stage';

            var pulse = document.createElement('div');
            pulse.className = 'asteroids-btn-pulse';
            stage.appendChild(pulse);

            spawnedPlanes = [];
            for (var i = 0; i < SHIP_COLORS.length; i++) {
                var spawnEl = document.createElement('div');
                spawnEl.className = 'asteroids-spawn-plane';
                spawnEl.setAttribute('aria-label', SHIP_COLORS[i].name);
                spawnEl.setAttribute('role', 'button');

                var c = document.createElement('canvas');
                c.width = 80;
                c.height = 80;
                drawAirplaneIcon(c, SHIP_COLORS[i].value, 22);
                spawnEl.appendChild(c);

                var label = document.createElement('span');
                label.className = 'asteroids-spawn-plane-label';
                label.textContent = SHIP_COLORS[i].name;
                spawnEl.appendChild(label);

                stage.appendChild(spawnEl);
                spawnedPlanes.push({ el: spawnEl, isHovered: false });
            }

            btnHub = document.createElement('div');
            btnHub.className = 'asteroids-btn-hub';
            btnHub.setAttribute('aria-label', '悬停选择飞船颜色');
            btnHub.setAttribute('role', 'button');

            var hubCanvas = document.createElement('canvas');
            hubCanvas.width = 120;
            hubCanvas.height = 120;
            drawAirplaneIcon(hubCanvas, '#ffffff', 36);
            btnHub.appendChild(hubCanvas);

            stage.appendChild(btnHub);
            btnWrapper.appendChild(stage);
            document.body.appendChild(btnWrapper);

            bindButtonEvents();
            log('buildButton: done');

        } catch (e) {
            logErr('buildButton: error', e);
        }
    }

    function bindButtonEvents() {
        btnHub.addEventListener('mouseenter', handleHubEnter);
        btnHub.addEventListener('mouseleave', handleHubLeave);

        for (var i = 0; i < spawnedPlanes.length; i++) {
            (function (idx) {
                spawnedPlanes[idx].el.addEventListener('mouseenter', function () {
                    handlePlaneEnter(idx);
                });
                spawnedPlanes[idx].el.addEventListener('mouseleave', function () {
                    handlePlaneLeave(idx);
                });
                spawnedPlanes[idx].el.addEventListener('click', function (e) {
                    e.stopPropagation();
                    handlePlaneClick(idx);
                });
            })(i);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildButton);
        log('waiting DOMContentLoaded');
    } else {
        buildButton();
    }

    window.ASTEROIDSPLAYERS = window.ASTEROIDSPLAYERS || [];
})();
