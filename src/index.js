const chromeLauncher = require('chrome-launcher');
const path = require('path');
const fs = require('fs');

/**
 * @param {string[]} urls
 * @param {string} [reportFilePath]
 * @returns {Promise}
 */
module.exports = function (urls, reportFilePath) {
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
            .then(() => {
                if (reportFilePath !== undefined) {
                    reportFilePath = path.resolve(process.cwd(), reportFilePath);
                    fs.mkdirSync(path.dirname(reportFilePath), {recursive: true});
                    fs.writeFileSync(reportFilePath, JSON.stringify(DATA, null, 4));
                }
            })
            .catch(reject)
            .finally(() => {
                return CHROME.instance.kill().then(() => {
                    resolve(DATA);
                }).catch(reject);
            });
    });
};
