const puppeteer = require('puppeteer');
const slugify = require('slugify');
const path = require('path');
const fs = require('fs-extra');

module.exports = function (browser, devices) {
    devices = devices !== undefined ? devices : [
        puppeteer.devices['iPhone 7'],
        puppeteer.devices['Pixel 2'],
        {
            'name': 'MacBook Pro',
            'userAgent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
            'viewport': {
                'width': 1680, // 2880
                'height': 1050, // 1800
                'deviceScaleFactor': 1.71428571429,
                'isMobile': false,
                'hasTouch': false,
                'isLandscape': true,
            }
        },
        {
            'name': 'Display 1920x1080',
            'userAgent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
            'viewport': {
                'width': 1920,
                'height': 1080,
                'deviceScaleFactor': 1,
                'isMobile': false,
                'hasTouch': false,
                'isLandscape': true,
            }
        },
    ];

    return Promise.all(
        URLS.map(url => {
            DATA[url]['screenshots'] = {};

            return Promise.all(
                devices.map(device => {
                    const filepath = path.resolve(BASE_PATH, 'screenshots', (new URL(url)).hostname, slugify(device.name) + '.jpg');
                    fs.ensureDirSync(path.dirname(filepath));

                    return browser.newPage()
                        .then(page => {
                            return page.emulate(device)
                                .then(() => {
                                    return page.goto(url, {waitUntil: 'networkidle0'})
                                        .then(() => {
                                            DATA[url]['screenshots'][device.name] = filepath;

                                            return page.screenshot({
                                                type: 'jpeg',
                                                path: filepath,
                                                fullPage: false,
                                            })
                                                .then(() => {
                                                    return page.close();
                                                });
                                        });
                                });
                        });
                })
            ).finally(() => {
                console.log('screenshots: ' + url);
            });
        })
    );
};