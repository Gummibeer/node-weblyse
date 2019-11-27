/**
 * @typedef {Object} SecurityheadersConfig
 * @property {boolean} [followRedirects=true]
 * @property {boolean} [hide=false]
 */

/**
 * @param {boolean|SecurityheadersConfig} config
 * @returns {SecurityheadersConfig}
 */
module.exports = function (config) {
    return Object.assign(
        {},
        {
            followRedirects: true,
            hide: false,
        },
        config,
    );
};
