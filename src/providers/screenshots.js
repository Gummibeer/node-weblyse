module.exports = function (browser, { devices }) {
    return Promise.all(
        URLS.map(url => {
            DATA[url].screenshots = {};

            return Promise.all(
                devices.map(device => {
                    return browser.newPage()
                        .then(page => {
                            return page.emulate(device)
                                .then(() => {
                                    return page.goto(url, { waitUntil: 'networkidle0' })
                                        .then(() => {
                                            return page.screenshot({
                                                type: 'jpeg',
                                                encoding: 'base64',
                                                fullPage: false,
                                            })
                                                .then(screenshot => {
                                                    DATA[url].screenshots[device.name] = 'data:image/jpeg;base64,' + screenshot;
                                                    return page.close();
                                                });
                                        });
                                });
                        });
                }),
            ).finally(() => {
                console.log('screenshots: ' + url);
            });
        }),
    );
};
