const axios = require('axios');

module.exports = function ({ maxAge }) {
    maxAge = maxAge !== undefined ? maxAge : 24;

    return Promise.all(
        URLS.map(url => {
            return new Promise(function (resolve, reject) {
                let interval;

                const check = async function () {
                    const { data } = await axios('https://api.ssllabs.com/api/v2/analyze?fromCache=on&all=done&maxAge=' + maxAge + '&publish=off&host=' + url).catch(error => error.response);

                    if (
                        typeof data === 'object' &&
                        data.status !== undefined &&
                        data.status === 'READY' &&
                        data.endpoints !== undefined
                    ) {
                        if (interval !== undefined) {
                            clearInterval(interval);
                        }

                        DATA[url].ssllabs = data;
                        console.log('ssllabs: ' + url);

                        resolve();

                        return true;
                    }

                    return false;
                };

                check().then(successful => {
                    if (!successful) {
                        interval = setInterval(check, 1000 * 10);
                    }
                });
            });
        }),
    );
};
