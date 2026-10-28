import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const code = fs.readFileSync(new URL('../../public/assets/home.js', import.meta.url), 'utf8');
function setup({ reduced = false, saveData = false } = {}) {
    const handlers = {}, frames = [], idle = [];
    const source = { dataset: { src: '/assets/hero.mp4' } };
    const video = { paused: true, plays: 0, loads: 0, querySelector: () => source,
        addEventListener: (event, handler) => { handlers[event] = handler; },
        load() { this.loads++; }, play() { this.plays++; this.paused = false; handlers.play(); return Promise.resolve(); }, pause() { this.paused = true; handlers.pause(); } };
    const button = { setAttribute() {}, addEventListener: (event, handler) => { handlers.click = handler; } };
    let observe;
    vm.runInNewContext(code, { document: { hidden: false, querySelector: selector => selector === '.hero video' ? video : button, addEventListener() {} },
        matchMedia: () => ({ matches: reduced, addEventListener() {} }), navigator: { connection: { saveData } },
        window: { IntersectionObserver: true, requestIdleCallback: true },
        IntersectionObserver: class { constructor(callback) { observe = callback; } observe() {} },
        requestAnimationFrame: callback => frames.push(callback), requestIdleCallback: callback => idle.push(callback) });
    return { video, source, click: () => handlers.click(), visible: value => observe([{ isIntersecting: value }]), flush: () => { while (frames.length) frames.shift()(); while (idle.length) idle.shift()(); } };
}
test('video waits for page paint and idle even when the visibility observer fires early', () => {
    const app = setup(); app.visible(true); assert.equal(app.video.loads, 0);
    app.flush(); assert.equal(app.video.loads, 1); assert.equal(app.source.src, '/assets/hero.mp4');
    app.visible(false); assert.equal(app.video.paused, true);
    app.visible(true); assert.equal(app.video.paused, false); assert.equal(app.video.loads, 1);
    app.click(); app.visible(false); app.visible(true); assert.equal(app.video.paused, true);
});
test('reduced motion and data saver keep the poster until the visitor explicitly plays', () => {
    for (const options of [{ reduced: true }, { saveData: true }]) {
        const app = setup(options); app.flush(); app.visible(true); assert.equal(app.video.loads, 0);
        app.click(); assert.equal(app.video.loads, 1); assert.equal(app.video.paused, false);
    }
});
