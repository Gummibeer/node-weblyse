const chromeLauncher = require('chrome-launcher');
const path = require('path');
const fs = require('fs-extra');

/**
 * @param {string[]} urls
 * @param {string} basePath
 * @returns {Promise}
 */
module.exports = function (urls, basePath) {
    global.BASE_PATH = path.resolve(process.cwd(), basePath);
    global.URLS = urls.map(url => (new URL(url)).toString());
    global.DATA = {};
    URLS.forEach(url => DATA[url] = {});

    global.CHROME = {
        opts: {
            chromeFlags: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--headless',
            ],
            output: 'json',
            logLevel: 'error',
        },
        instance: undefined,
    };

    return new Promise(function (resolve, reject) {
        chromeLauncher.launch(CHROME.opts)
            .then(chrome => {
                CHROME.opts.port = chrome.port;
                CHROME.instance = chrome;

                return Promise.all([
                    require('./providers/ssllabs')(),
                    require('./providers/securityheaders')(true, true),
                    require('./libs/browser')(function (browser) {
                        return [
                            require('./providers/screenshots')(browser),
                        ];
                    }),
                    require('./providers/webhint')(),
                    require('./providers/lighthouse')(),
                ]);
            })
            .catch(reject)
            .finally(() => {
                const filepath = path.resolve(BASE_PATH, 'data.json');
                fs.ensureFileSync(filepath);
                fs.writeJsonSync(filepath, DATA, {spaces: 4});

                return CHROME.instance.kill().then(() => {
                    resolve(DATA);
                }).catch(reject);
            });
    });
};
