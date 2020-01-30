import tap from 'tap';

import webdriver from 'selenium-webdriver';
const {Builder, By} = webdriver;

import chrome from 'selenium-webdriver/chrome';
import firefox from 'selenium-webdriver/firefox';
import safari from 'selenium-webdriver/safari';

const defaultViewportSize = {width: 800, height: 600};

const chromeOptions = new chrome.Options().windowSize(defaultViewportSize);
const firefoxOptions = new firefox.Options().windowSize(defaultViewportSize);
const safariOptions = new safari.Options();

import doubleClick from './doubleclick';
import mouseWheel from './mousewheel';

const browser = {
    driver: null,
    basePath: `file://${process.cwd()}`,
    setViewportSize,
    getMapCanvas,
    doubleClick,
    mouseWheel
};

export default browser;

// Resizes the window so that the viewport has the specified size.
async function setViewportSize(size) {
    const windowSize = await browser.driver.executeScript(size => {
        /* eslint-disable no-undef */
        return {
            width: outerWidth - innerWidth + size.width,
            height: outerHeight - innerHeight + size.height
        };
    }, size);
    (await browser.driver.manage().window()).setRect(windowSize);
}

async function getMapCanvas(url, eventType) {
    await browser.driver.get(url || `${browser.basePath}/test/browser/fixtures/index.html`);

    // Wait until the map has loaded.
    await browser.driver.executeAsyncScript((eventType, callback) => {
        /* eslint-disable no-undef */
        map.once(eventType || "load", () => callback());
    }, eventType);

    return browser.driver.findElement(By.className('mapboxgl-canvas'));
}

tap.test("start browser", async t => {
    browser.driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(chromeOptions)
        .setFirefoxOptions(firefoxOptions)
        .setSafariOptions(safariOptions)
        .build();

    const capabilities = await browser.driver.getCapabilities();
    t.ok(true, `platform: ${capabilities.getPlatform()}`);
    t.ok(true, `browser: ${capabilities.getBrowserName()}`);
    t.ok(true, `version: ${capabilities.getBrowserVersion()}`);

    await setViewportSize(defaultViewportSize);
});

tap.tearDown(async () => {
    await browser.driver.quit();
});
