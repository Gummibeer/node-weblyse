const puppeteer = require('puppeteer');

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
                    return browser.newPage()
                        .then(page => {
                            return page.emulate(device)
                                .then(() => {
                                    return page.goto(url, {waitUntil: 'networkidle0'})
                                        .then(() => {
                                            return page.screenshot({
                                                type: 'jpeg',
                                                encoding: 'base64',
                                                fullPage: false,
                                            })
                                                .then(screenshot => {
                                                    DATA[url]['screenshots'][device.name] = 'data:image/jpeg;base64,'+screenshot;
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