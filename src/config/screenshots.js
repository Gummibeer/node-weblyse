const puppeteer = require('puppeteer');

/**
 * @typedef {Object} ScreenshotsConfig
 * @property {Object[]} [devices]
 */

/**
 * @param {boolean|ScreenshotsConfig} config
 * @returns {ScreenshotsConfig}
 */
module.exports = function (config) {
    return Object.assign(
        {},
        {
            devices: [
                puppeteer.devices['iPhone 7'],
                puppeteer.devices['Pixel 2'],
                {
                    name: 'MacBook Pro',
                    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
                    viewport: {
                        width: 1680, // 2880
                        height: 1050, // 1800
                        deviceScaleFactor: 1.71428571429,
                        isMobile: false,
                        hasTouch: false,
                        isLandscape: true,
                    },
                },
                {
                    name: 'Display 1920x1080',
                    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
                    viewport: {
                        width: 1920,
                        height: 1080,
                        deviceScaleFactor: 1,
                        isMobile: false,
                        hasTouch: false,
                        isLandscape: true,
                    },
                },
            ],
        },
        config,
    );
};
