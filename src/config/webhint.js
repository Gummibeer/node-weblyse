/**
 * @typedef {Object} WebhintConfig
 */

/**
 * @param {boolean|WebhintConfig} config
 * @returns {WebhintConfig}
 */
module.exports = function (config) {
    return Object.assign(
        {},
        {
            extends: ['web-recommended'],
            formatters: [],
            connector: {
                name: 'puppeteer',
                options: {
                    headless: true,
                    waitUntil: 'networkidle0',
                    puppeteerOptions: CHROME.opts,
                }
            },
        },
        config
    );
};