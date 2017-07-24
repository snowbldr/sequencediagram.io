/*

This file contains so called end-to-end tests.
These are tests that use use the application as a user would, i.e. it
should depend on as few implementation details as possible.
That way, the tests require minimal refactorings when the app itself is
refactored and even re-architectured.

We want the tests in the separate files to have access to all the helper functions
defined here without verbose exporting. That's why we put helper functions in
the global object

*/



// Set to true if you want to have time to observe what the tests
// are doing
const SLOW_DOWN_FOR_HUMAN_OBSERVATION = 0

// Default to headless testing when running in Continous Integration environments
const HEADLESS = !!process.env.CI

if (SLOW_DOWN_FOR_HUMAN_OBSERVATION) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
} else {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
}
let { Builder, By, until, Key, promise } = require('selenium-webdriver');
let { Options } = require('selenium-webdriver/chrome');
let devUtils = require('../devUtils');

global.Key = Key;

let options = new Options();
if (HEADLESS) {
    options.addArguments('headless', 'disable-gpu');
}
global.driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

global.SPromise = promise.Promise;

afterAll(() => {
    driver.quit();
});

// Helper functions

global.sleep = function(seconds) {
    driver.sleep(seconds * 1000);
}

function transitionsDisabled() {
    return devUtils.devMode;
}

global.sleepIfTransitionsEnabled = function(seconds) {
    if (transitionsDisabled()) {
        // The UI reacts immediately to input, no need to sleep
    } else {
        sleep(seconds);
    }
}

global.waitForCssTransitions = function() {
    if (!transitionsDisabled()) {
        sleep(0.3);
    }
}

global.sleepIfHumanObserver = function(seconds) {
    if (!SLOW_DOWN_FOR_HUMAN_OBSERVATION) {
        return;
    }

    sleep(seconds);
}

global.reversePromise = function(promise) {
    return new SPromise((resolve, reject) => {
        promise.then(reject).catch(resolve);
    });
}

global.byText = function(text) {
    return By.xpath("//*[contains(text(),'" + text + "')]");
}

global.waitForElement = function(text) {
    const locator = byText(text);
    return driver.wait(until.elementLocated(locator), 2000);
}

global.findElementByText = function(text) {
    const locator = byText(text);
    waitForElement(text);
    return driver.findElement(locator);
}

function dragAndDrop(elementText, offset) {
    driver.actions().mouseDown(findElementByText(elementText)).perform();
    const steps = 20;
    let i = steps;
    while (i > 0) {
        i--;
        // Steps must be ints, otherwise WebDriver pukes
        const offsetStep = {
            x: Math.ceil(offset.x / steps),
            y: Math.ceil(offset.y / steps),
        };
        driver.actions().mouseMove(offsetStep).perform();
        sleepIfHumanObserver(0.7 / steps);
    }
    driver.actions().mouseUp().perform();
    sleepIfHumanObserver(0.7);
}

global.click = function(elementText) {
    clickElement(findElementByText(elementText));
}

global.clickElement = function(element) {
    driver.actions()
    .click(element)
    .perform();
    waitForCssTransitions();
}

global.typeAndConfirmm = function(typedText) {
    type(typedText);
    driver.actions()
    .sendKeys(Key.RETURN)
    .perform();
}

global.type = function(typedText) {
    driver.actions()
    .sendKeys(typedText)
    .perform();
}

global.clickAndType = function(elementText, typedText) {
    click(elementText);
    typeAndConfirmm(typedText);
    waitForCssTransitions();
}

global.assertFragment = function(expected) {
    sleepIfHumanObserver(0.7);
    return new SPromise((resolve, reject) => {
        driver.getCurrentUrl().then(url => {
            const fragment = url.substring(url.indexOf('#') + 1);
            if (fragment === expected) {
                resolve();
            } else {
                const msg = 'expected: ' + expected + ' got: ' + fragment;
                reject(msg);
            }
        }).catch(e => console.log(e));
    });
}

global.urlParsing = function(url, expected) {
    return () => {
        goTo(url);
        return assertFragment(expected ? expected : url);
    }
}

global.goTo = function(startState) {
    driver.get('http://localhost:3000/#' + startState);
    /* We use 0.3 second CSS transitions, so make sure those have
     * settled before we move on.
     */
    waitForCssTransitions();
    return startState;
}


global.move = function(startState, grabbedText, toMove, expectedEndState) {
    return () => {
        goTo(startState);
        dragAndDrop(grabbedText, toMove);
        return assertFragment(expectedEndState);
    };
}

global.clickLifelineForObjectWithText = function(objectText) {
    driver.actions().mouseMove(findElementByText(objectText), { x: 30, y: 100 }).click().perform();
    waitForCssTransitions();
    sleepIfHumanObserver(0.7);
}

global.clickAddObject = function() {
    click('Add object');
    waitForCssTransitions();
    sleepIfHumanObserver(0.7);
}

global.addMessage = function(start, end) {
    clickLifelineForObjectWithText(start);
    clickLifelineForObjectWithText(end);
    sleepIfHumanObserver(0.7);
}

global.flip = function(key) {
    // Low prio todo: Stop depending on the implementation detail that messages have
    // flip buttons with certain IDs without complicating testing code too much
    driver.actions().click(driver.findElement(By.id('flip-' + key))).perform();
    sleepIfHumanObserver(0.7);
}

global.removeComponentWithKey = function(key) {
    // Low prio todo: Stop depending on the implementation detail that components have
    // remove buttons with certain IDs without complicating testing code too much
    driver.actions().click(driver.findElement(By.id('remove-' + key))).perform();
    waitForCssTransitions();
}


require('./move-object');
require('./add-object');
require('./remove-object');
require('./misc-object');

require('./move-message');
require('./add-message');
require('./remove-message');
require('./change-message-appearance');

require('./misc');
require('./undo-redo');
require('./serialize-and-deserialize');

// TODO: Click an empty area
// TODO: Click and drag on empty area
// TODO: Double-click on empty area
// TODO: drag and drop remove button shall not select text
// TODO: test devMode === false
// TODO: test that when there is a pending message, the controls for other messages is removed (to not be in the way)