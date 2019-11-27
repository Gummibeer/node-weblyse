const chromeLauncher = require('chrome-launcher');
const path = require('path');
const fs = require('fs');

/**
 * @typedef {Object} WeblyseConfig
 * @property {string[]} urls
 * @property {string} [reportFilePath]
 * @property {ProvidersConfig} [providers]
 */

/**
 * @typedef {Object} ProvidersConfig
 * @property {boolean|SsllabsConfig} [ssllabs=true]
 * @property {boolean|SecurityheadersConfig} [securityheaders=true]
 * @property {boolean|WebhintConfig} [webhint=true]
 * @property {boolean|ScreenshotsConfig} [screenshots=true]
 * @property {boolean} [lighthouse=true]
 * @property {boolean} [axe=true]
 */

/**
 * @param {WeblyseConfig} config
 * @returns {Promise}
 */
module.exports = function (config) {
    global.URLS = config.urls.map(url => (new URL(url)).toString());
    global.DATA = {};
    URLS.forEach(url => {
        DATA[url] = {};
    });

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

                const providers = [];

                if (config.providers === undefined) {
                    config.providers = {};
                }

                if (config.providers.ssllabs === undefined) {
                    config.providers.ssllabs = true;
                }
                if (config.providers.ssllabs) {
                    providers.push(require('./providers/ssllabs')(require('./config/ssllabs')(config.providers.ssllabs)));
                }

                if (config.providers.securityheaders === undefined) {
                    config.providers.securityheaders = true;
                }
                if (config.providers.securityheaders) {
                    providers.push(require('./providers/securityheaders')(require('./config/securityheaders')(config.providers.securityheaders)));
                }

                if (config.providers.webhint === undefined) {
                    config.providers.webhint = true;
                }
                if (config.providers.webhint) {
                    providers.push(require('./providers/webhint')(require('./config/webhint')(config.providers.webhint)));
                }

                if (config.providers.lighthouse === undefined) {
                    config.providers.lighthouse = true;
                }
                if (config.providers.lighthouse) {
                    providers.push(require('./providers/lighthouse')());
                }

                if (config.providers.screenshots === undefined) {
                    config.providers.screenshots = true;
                }
                if (config.providers.axe === undefined) {
                    config.providers.axe = true;
                }

                if (config.providers.screenshots || config.providers.axe) {
                    providers.push(
                        require('./libs/browser')(function (browser) {
                            const browserProviders = [];

                            if (config.providers.screenshots) {
                                browserProviders.push(require('./providers/screenshots')(browser, require('./config/screenshots')(config.providers.screenshots)));
                            }

                            if (config.providers.axe) {
                                browserProviders.push(require('./providers/axe')(browser));
                            }

                            return browserProviders;
                        }),
                    );
                }

                return Promise.all(providers);
            })
            .then(() => {
                if (config.reportFilePath) {
                    const reportFilePath = path.resolve(process.cwd(), config.reportFilePath);
                    fs.mkdirSync(path.dirname(reportFilePath), { recursive: true });
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
