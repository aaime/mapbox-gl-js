import {test} from '../util/test';
import browser from './util/browser';
import {Origin} from 'selenium-webdriver';

test("dragging", async t => {
    const {driver} = browser;

    await t.test("drag to the left", async t => {
        const canvas = await browser.getMapCanvas();

        // Perform drag action, wait a bit the end to avoid the momentum mode.
        await driver
            .actions()
            .move(canvas)
            .press()
            .move({x: 100, y: 0, origin: Origin.POINTER})
            .pause(200)
            .release()
            .perform();

        const center = await driver.executeScript(() => map.getCenter());
        t.almostEqual(center.lng, -77.03085, 0.0001);
        t.almostEqual(center.lat, 38.888, 0.0000001);
    });
});
