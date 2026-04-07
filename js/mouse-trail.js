// 鼠标彩虹渐变拖尾特效
(function() {
    'use strict';

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var points = [];
    var maxPoints = 30;
    var hue = 0;

    canvas.id = 'rainbow-trail';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '99999';
    canvas.style.pointerEvents = 'none';

    document.body.appendChild(canvas);

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', function(e) {
        points.push({
            x: e.clientX,
            y: e.clientY,
            hue: hue,
            life: 1.0
        });

        if (points.length > maxPoints) {
            points.shift();
        }

        hue = (hue + 3) % 360;
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            var size = (i / points.length) * 6 + 2;
            p.life -= 0.03;

            if (p.life <= 0) {
                points.splice(i, 1);
                i--;
                continue;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fillStyle = 'hsla(' + p.hue + ', 100%, 65%, ' + p.life + ')';
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'hsla(' + p.hue + ', 100%, 65%, ' + p.life + ')';
            ctx.fill();
        }

        ctx.shadowBlur = 0;
        requestAnimationFrame(animate);
    }

    animate();
})();