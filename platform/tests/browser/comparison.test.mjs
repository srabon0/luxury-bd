import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const code = fs.readFileSync(new URL('../../public/assets/compare.js', import.meta.url), 'utf8');
class Element {
    constructor(dataset = {}) { this.dataset = dataset; this.children = []; this.handlers = {}; this.attributes = {}; this.hidden = true; this.textContent = ''; }
    addEventListener(name, handler) { this.handlers[name] = handler; }
    setAttribute(key, value) { this.attributes[key] = value; }
    append(...children) { this.children.push(...children); }
    replaceChildren() { this.children = []; }
    click() { this.handlers.click(); }
    focus() { this.focused = true; }
}
function setup(saved = '[]', blocked = false) {
    const buttons = Array.from({ length: 4 }, (_, i) => new Element({ compareSlug: `product-${i}`, compareName: `Product ${i}` }));
    const tray = new Element(), count = new Element(), list = new Element(), clear = new Element(), link = new Element(), status = new Element();
    tray.querySelector = selector => ({ '[data-compare-count]': count, '[data-compare-items]': list, '[data-compare-clear]': clear })[selector];
    let stored = saved;
    const document = {
        body: { classList: { toggle() {} } },
        querySelector: selector => ({ '.compare-tray': tray, '[data-compare-status]': status, '[data-compare-link]': link })[selector],
        querySelectorAll: selector => selector === '[data-compare-slug]' ? buttons : [link],
        createElement: () => new Element(),
    };
    vm.runInNewContext(code, { document, URL, location: { origin: 'https://example.test' }, localStorage: { getItem() { if (blocked) throw Error('Denied'); return stored; }, setItem(key, value) { if (blocked) throw Error('Denied'); stored = value; } } });
    return { buttons, tray, count, list, clear, link, status, saved: () => stored };
}
test('selection caps at three, persists and creates a shareable comparison URL', () => {
    const app = setup();
    app.buttons.forEach(button => button.click());
    assert.equal(app.list.children.length, 3);
    assert.match(app.status.textContent, /up to three/);
    assert.deepEqual(JSON.parse(app.saved()).map(item => item.slug), ['product-0', 'product-1', 'product-2']);
    const url = new URL(app.link.href, 'https://example.test');
    assert.deepEqual(url.searchParams.getAll('products[]'), ['product-0', 'product-1', 'product-2']);
    app.list.children[0].children[1].click();
    assert.equal(app.buttons[0].attributes['aria-pressed'], 'false');
    app.buttons[3].click(); assert.equal(app.list.children.length, 3);
    app.clear.click(); assert.equal(app.tray.hidden, true); assert.equal(app.link.focused, true);
});
test('blocked or malformed storage does not prevent comparison', () => {
    for (const app of [setup('not JSON'), setup('[]', true)]) {
        app.buttons[0].click(); assert.equal(app.list.children.length, 1); assert.equal(app.tray.hidden, false);
    }
});
test('restored selection rejects invalid slugs and duplicate products and treats names as text', () => {
    const app = setup(JSON.stringify([{ slug: 'bad<script>', name: 'Bad' }, { slug: 'product-0', name: '<img onerror=alert(1)>' }, { slug: 'product-0', name: 'Duplicate' }]));
    assert.equal(app.list.children.length, 1);
    assert.equal(app.list.children[0].children[0].textContent, '<img onerror=alert(1)>');
    assert.equal(app.buttons[0].attributes['aria-pressed'], 'true');
});
