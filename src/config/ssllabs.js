/**
 * @typedef {Object} SsllabsConfig
 * @property {int} [maxAge=24]
 */

/**
 * @param {boolean|SsllabsConfig} config
 * @returns {SsllabsConfig}
 */
module.exports = function (config) {
    return Object.assign(
        {},
        {
            maxAge: 24,
        },
        config
    );
};