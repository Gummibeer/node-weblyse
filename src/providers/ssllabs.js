const axios = require('axios');

module.exports = function (maxAge) {
    maxAge = maxAge !== undefined ? maxAge : 24;

    return Promise.all(
        URLS.map(url => {
            return new Promise(async function (resolve, reject) {
                let interval;

                const check = async function () {
                    let {data} = await axios('https://api.ssllabs.com/api/v2/analyze?fromCache=on&all=done&maxAge='+maxAge+'&publish=off&host=' + url).catch(reject);

                    if (
                        data.status === 'READY'
                        && data.endpoints !== undefined
                    ) {
                        if (interval !== undefined) {
                            clearInterval(interval);
                        }

                        DATA[url]['ssllabs'] = data;
                        console.log('ssllabs: ' + url);

                        resolve();

                        return true;
                    }

                    return false;
                };

                let successful = await check();
                if (!successful) {
                    interval = setInterval(check, 1000 * 10);
                }
            });
        })
    );
};