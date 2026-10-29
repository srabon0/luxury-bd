(() => {
    const storageKey = 'luxurry-comparison-v1';
    const slugPattern = /^[A-Za-z0-9_-]+$/;
    const tray = document.querySelector('.compare-tray');
    if (!tray) return;
    const status = document.querySelector('[data-compare-status]');
    const comparisonPage = document.querySelector('.comparison-page');
    let selected = [];
    try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (Array.isArray(saved)) selected = saved.filter(item => item && typeof item.slug === 'string' && item.slug.length <= 180 && slugPattern.test(item.slug) && typeof item.name === 'string').filter((item, index, all) => all.findIndex(other => other.slug === item.slug) === index).slice(0, 3);
    } catch { /* Browsing and comparison still work without storage access. */ }
    let announcementTimer;
    const announce = message => {
        status.textContent = message;
        if (typeof setTimeout === 'function') {
            clearTimeout(announcementTimer);
            announcementTimer = setTimeout(() => { status.textContent = ''; }, 4000);
        }
    };
    const persist = () => { try { localStorage.setItem(storageKey, JSON.stringify(selected)); } catch {} };
    // The server-validated shared URL owns this page's selection.
    if (comparisonPage) {
        selected = Array.from(document.querySelectorAll('[data-compare-slug]')).map(button => ({ slug: button.dataset.compareSlug, name: button.dataset.compareName }));
        persist();
    }
    const render = () => {
        const url = new URL('/compare', location.origin);
        selected.forEach(item => url.searchParams.append('products[]', item.slug));
        document.querySelectorAll('[data-compare-open], [data-compare-link]').forEach(link => { link.href = url.pathname + url.search; });
        tray.hidden = Boolean(comparisonPage) || selected.length === 0;
        document.body.classList.toggle('has-comparison', !comparisonPage && selected.length > 0);
        tray.querySelector('[data-compare-count]').textContent = `${selected.length} of 3 selected`;
        const list = tray.querySelector('[data-compare-items]');
        list.replaceChildren();
        selected.forEach(item => {
            const li = document.createElement('li');
            const label = document.createElement('span'); label.textContent = item.name;
            const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = '×'; remove.setAttribute('aria-label', `Remove ${item.name} from comparison`);
            remove.addEventListener('click', () => { selected = selected.filter(other => other.slug !== item.slug); persist(); render(); announce(`${item.name} removed from comparison.`); });
            li.append(label, remove); list.append(li);
        });
        document.querySelectorAll('[data-compare-slug]').forEach(button => {
            button.hidden = false;
            const active = selected.some(item => item.slug === button.dataset.compareSlug);
            button.setAttribute('aria-pressed', String(active));
            button.textContent = active ? 'Remove from comparison' : 'Add to comparison';
        });
    };
    document.querySelectorAll('[data-compare-slug]').forEach(button => button.addEventListener('click', () => {
        const slug = button.dataset.compareSlug;
        const name = button.dataset.compareName;
        if (selected.some(item => item.slug === slug)) { selected = selected.filter(item => item.slug !== slug); announce(`${name} removed from comparison.`); }
        else if (selected.length === 3) { announce('You can compare up to three products. Remove one to add another.'); return; }
        else { selected.push({ slug, name }); announce(`${name} added to comparison.`); }
        persist(); render();
        if (comparisonPage) {
            const url = new URL('/compare', location.origin);
            selected.forEach(item => url.searchParams.append('products[]', item.slug));
            location.assign(url.pathname + url.search);
        }
    }));
    tray.querySelector('[data-compare-clear]').addEventListener('click', () => { selected = []; persist(); render(); announce('Comparison selection cleared.'); document.querySelector('[data-compare-link]')?.focus(); });
    render();
})();
