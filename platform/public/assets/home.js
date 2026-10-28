(() => {
    const video = document.querySelector('.hero video');
    const button = document.querySelector('.video-toggle');
    if (!video || !button) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = true;
    let wanted = !motion.matches && !navigator.connection?.saveData;
    let loaded = false;
    const label = () => {
        button.textContent = video.paused ? 'Play video' : 'Pause video';
        button.setAttribute('aria-label', video.paused ? 'Play homepage video' : 'Pause homepage video');
    };
    const play = () => {
        if (!visible || document.hidden || !wanted) return;
        if (!loaded) { const source = video.querySelector('source'); source.src = source.dataset.src; video.load(); loaded = true; }
        video.play().catch(() => { wanted = false; label(); });
    };
    button.addEventListener('click', () => { wanted = video.paused; if (wanted) play(); else video.pause(); });
    video.addEventListener('play', label); video.addEventListener('pause', label);
    document.addEventListener('visibilitychange', () => document.hidden ? video.pause() : play());
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) play(); else video.pause(); }, { threshold: 0.1 }).observe(video);
    motion.addEventListener('change', () => { if (motion.matches) { wanted = false; video.pause(); } });
    // Let the poster and page content paint before downloading the video.
    requestAnimationFrame(() => requestAnimationFrame(() => {
        if ('requestIdleCallback' in window) requestIdleCallback(play, { timeout: 1800 }); else setTimeout(play, 300);
    }));
    label();
})();
