const puppeteer = require('puppeteer');
const axios = require('axios');

module.exports = function (promises) {
    return axios(`http://localhost:${CHROME.opts.port}/json/version`)
        .then(response => response.data.webSocketDebuggerUrl)
        .then(webSocketDebuggerUrl => {
            return puppeteer.connect({
                browserWSEndpoint: webSocketDebuggerUrl,
                headless: true,
            })
                .then(browser => {
                    return Promise.all(promises(browser))
                        .finally(() => {
                            return browser.disconnect();
                        });
                });
        });
};
