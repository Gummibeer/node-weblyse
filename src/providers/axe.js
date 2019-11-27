const { AxePuppeteer } = require('axe-puppeteer');

module.exports = function (browser) {
    return Promise.all(
        URLS.map(url => {
            return browser.newPage()
                .then(page => {
                    return page.setBypassCSP(true)
                        .then(() => {
                            return page.goto(url, { waitUntil: 'networkidle0' })
                                .then(() => {
                                    return new AxePuppeteer(page).analyze()
                                        .then(result => {
                                            DATA[url].axe = result;
                                            return page.close();
                                        })
                                        .finally(() => {
                                            console.log('axe: ' + url);
                                        });
                                });
                        });
                });
        }),
    );
};
