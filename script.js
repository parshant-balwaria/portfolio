(function () {
    'use strict';

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Nav ---
    var nav = document.getElementById('nav');
    var navToggle = document.getElementById('navToggle');
    var mobileMenu = document.getElementById('mobileMenu');

    window.addEventListener('scroll', function () {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // --- Scroll Reveal ---
    if (!reducedMotion) {
        var revObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { e.target.classList.add('revealed'); revObs.unobserve(e.target); }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
        document.querySelectorAll('[data-reveal]').forEach(function (el) { revObs.observe(el); });
    } else {
        document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('revealed'); });
    }

    // --- Counter Animation ---
    var cntObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            var el = e.target;
            var target = parseFloat(el.dataset.count);
            var isFloat = target % 1 !== 0;
            var dur = 1400;
            var start = performance.now();
            function tick(now) {
                var t = Math.min((now - start) / dur, 1);
                var ease = 1 - Math.pow(1 - t, 3);
                el.textContent = isFloat ? (target * ease).toFixed(1) : Math.round(target * ease);
                if (t < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
            cntObs.unobserve(el);
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(function (el) { cntObs.observe(el); });

    // --- Typing Effect ---
    var tEl = document.getElementById('terminalText');
    if (tEl && !reducedMotion) {
        var phrases = [
            'GIS Software Engineer',
            'Full-Stack Developer',
            'Spatial Data Engineer',
            'QGIS Plugin Builder',
            'Cloud GIS Architect'
        ];
        var pi = 0, ci = 0, deleting = false;
        function typeLoop() {
            var cur = phrases[pi];
            if (deleting) {
                tEl.textContent = cur.substring(0, --ci);
                if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(typeLoop, 350); return; }
                setTimeout(typeLoop, 35);
            } else {
                tEl.textContent = cur.substring(0, ++ci);
                if (ci === cur.length) { deleting = true; setTimeout(typeLoop, 2400); return; }
                setTimeout(typeLoop, 75 + Math.random() * 35);
            }
        }
        setTimeout(typeLoop, 700);
    } else if (tEl) {
        tEl.textContent = 'GIS Software Engineer';
    }

    // --- 3D Globe ---
    var gc = document.getElementById('globeCanvas');
    if (!gc) return;
    var ctx = gc.getContext('2d');
    var SIZE = 600;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    gc.width = SIZE * dpr;
    gc.height = SIZE * dpr;
    ctx.scale(dpr, dpr);

    var rot = { x: 0.35, y: -1.3 };
    var vel = { x: 0, y: 0 };
    var dragging = false;
    var lastP = { x: 0, y: 0 };
    var autoRot = 0.002;
    var N = 2800;
    var pts = [];
    var landMask = null;

    var phi = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < N; i++) {
        var yy = 1 - (i / (N - 1)) * 2;
        var rad = Math.sqrt(1 - yy * yy);
        var th = phi * i;
        var px = Math.cos(th) * rad;
        var pz = Math.sin(th) * rad;
        pts.push({
            x: px, y: yy, z: pz,
            lat: Math.asin(yy) * 180 / Math.PI,
            lng: Math.atan2(pz, px) * 180 / Math.PI
        });
    }

    function decodeArcs(topo) {
        var s = topo.transform.scale, t = topo.transform.translate;
        return topo.arcs.map(function (arc) {
            var x = 0, y = 0;
            return arc.map(function (d) { x += d[0]; y += d[1]; return [x * s[0] + t[0], y * s[1] + t[1]]; });
        });
    }

    function buildMask(topo) {
        var mc = document.createElement('canvas');
        var W = 720, H = 360;
        mc.width = W; mc.height = H;
        var mx = mc.getContext('2d');
        var arcs = decodeArcs(topo);
        var geo = topo.objects.land.geometries[0];
        mx.fillStyle = '#fff';
        geo.arcs.forEach(function (poly) {
            poly.forEach(function (ring) {
                mx.beginPath();
                var first = true;
                ring.forEach(function (ai) {
                    var coords = ai >= 0 ? arcs[ai] : arcs[~ai].slice().reverse();
                    for (var j = 0; j < coords.length; j++) {
                        var sx = ((coords[j][0] + 180) / 360) * W;
                        var sy = ((90 - coords[j][1]) / 180) * H;
                        if (first) { mx.moveTo(sx, sy); first = false; } else mx.lineTo(sx, sy);
                    }
                });
                mx.closePath(); mx.fill();
            });
        });
        return mx.getImageData(0, 0, W, H);
    }

    function checkLand(lat, lng) {
        if (!landMask) return fallbackLand(lat, lng);
        var mx = Math.floor(((lng + 180) / 360) * 720);
        var my = Math.floor(((90 - lat) / 180) * 360);
        mx = Math.max(0, Math.min(719, mx));
        my = Math.max(0, Math.min(359, my));
        return landMask.data[(my * 720 + mx) * 4] > 128;
    }

    function fallbackLand(lat, lng) {
        var r = [[15,72,-170,-50],[-56,15,-82,-34],[35,72,-25,45],[-35,37,-18,52],[0,78,25,180],[-48,-10,112,155]];
        for (var i = 0; i < r.length; i++) if (lat >= r[i][0] && lat <= r[i][1] && lng >= r[i][2] && lng <= r[i][3]) return true;
        return false;
    }

    function isIndia(lat, lng) { return lat >= 6 && lat <= 37 && lng >= 68 && lng <= 98; }

    fetch('land-110m.json').then(function (r) { return r.json(); })
        .then(function (t) { landMask = buildMask(t); })
        .catch(function () {});

    function render() {
        var w = SIZE, cx = w / 2, cy = w / 2, r = w * 0.42;
        ctx.clearRect(0, 0, w, w);

        // Halo
        var g = ctx.createRadialGradient(cx, cy, r * 0.88, cx, cy, r * 1.12);
        g.addColorStop(0, 'rgba(6,182,212,0.05)');
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(cx, cy, r * 1.12, 0, Math.PI * 2); ctx.fill();

        // Ring
        ctx.strokeStyle = 'rgba(6,182,212,0.06)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();

        var cosY = Math.cos(rot.y), sinY = Math.sin(rot.y);
        var cosX = Math.cos(rot.x), sinX = Math.sin(rot.x);

        for (var i = 0; i < pts.length; i++) {
            var p = pts[i];
            var x1 = p.x * cosY - p.z * sinY;
            var z1 = p.x * sinY + p.z * cosY;
            var y1 = p.y * cosX - z1 * sinX;
            var z2 = p.y * sinX + z1 * cosX;
            if (z2 < -0.05) continue;

            var sx = cx + x1 * r;
            var sy = cy - y1 * r;
            var d = (z2 + 1) / 2;
            var india = isIndia(p.lat, p.lng);
            var land = checkLand(p.lat, p.lng);

            var ds, a;
            if (india) {
                ds = 1.8 + d * 0.5;
                a = 0.5 + d * 0.5;
                ctx.fillStyle = 'rgba(6,182,212,' + a + ')';
            } else if (land) {
                ds = 1.1 + d * 0.4;
                a = 0.18 + d * 0.45;
                ctx.fillStyle = 'rgba(148,163,184,' + a + ')';
            } else {
                ds = 0.5 + d * 0.25;
                a = 0.03 + d * 0.06;
                ctx.fillStyle = 'rgba(71,85,105,' + a + ')';
            }

            ctx.beginPath(); ctx.arc(sx, sy, ds, 0, Math.PI * 2); ctx.fill();
        }

        // New Delhi pin
        var dlat = 28.6139, dlng = 77.209;
        var dp = (90 - dlat) * Math.PI / 180, dt = dlng * Math.PI / 180;
        var dx = Math.sin(dp) * Math.cos(dt), dy = Math.cos(dp), dz = Math.sin(dp) * Math.sin(dt);
        var dx1 = dx * cosY - dz * sinY, dz1 = dx * sinY + dz * cosY;
        var dy1 = dy * cosX - dz1 * sinX, dz2 = dy * sinX + dz1 * cosX;

        if (dz2 > 0) {
            var dsx = cx + dx1 * r, dsy = cy - dy1 * r;
            var pulse = Math.sin(performance.now() / 600) * 0.5 + 0.5;
            ctx.beginPath(); ctx.arc(dsx, dsy, 7 + pulse * 5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(6,182,212,' + (0.07 * (1 - pulse)) + ')'; ctx.fill();
            ctx.beginPath(); ctx.arc(dsx, dsy, 3.5 + pulse * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(6,182,212,' + (0.18 * (1 - pulse * 0.4)) + ')'; ctx.fill();
            ctx.beginPath(); ctx.arc(dsx, dsy, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#06b6d4'; ctx.fill();
        }
    }

    function animate() {
        if (!dragging) {
            rot.y += autoRot + vel.y;
            rot.x += vel.x;
            vel.x *= 0.94; vel.y *= 0.94;
            rot.x = Math.max(-1.2, Math.min(1.2, rot.x));
        }
        render();
        requestAnimationFrame(animate);
    }
    if (!reducedMotion) animate(); else render();

    function getP(e) { return e.touches ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY }; }
    function onDown(e) { dragging = true; lastP = getP(e); vel = { x: 0, y: 0 }; }
    function onMove(e) {
        if (!dragging) return;
        var p = getP(e);
        var dx = p.x - lastP.x, dy = p.y - lastP.y;
        rot.y += dx * 0.005; rot.x -= dy * 0.005;
        rot.x = Math.max(-1.2, Math.min(1.2, rot.x));
        vel = { x: -dy * 0.003, y: dx * 0.003 };
        lastP = p;
        if (!reducedMotion) render();
    }
    function onUp() { dragging = false; }

    gc.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    gc.addEventListener('touchstart', function (e) { e.preventDefault(); onDown(e); }, { passive: false });
    gc.addEventListener('touchmove', function (e) { e.preventDefault(); onMove(e); }, { passive: false });
    gc.addEventListener('touchend', onUp);

    // --- Smooth scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var t = document.querySelector(this.getAttribute('href'));
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' }); }
        });
    });
})();
