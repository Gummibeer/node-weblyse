const lighthouse = require('lighthouse');

module.exports = function () {
    return new Promise(async function(resolve, reject) {
        for (let url of URLS) {
            // lighthouse can not run in parallel
            await lighthouse(url, CHROME.opts, null)
                .then(result => {
                    DATA[url]['lighthouse'] = result.lhr;
                    console.log('lighthouse: ' + url);
                })
                .catch(reject);
        }
        resolve();
    });
};