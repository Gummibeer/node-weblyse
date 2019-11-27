const lighthouse = require('lighthouse');

module.exports = async function () {
    for (const url of URLS) {
        // lighthouse can not run in parallel
        const { lhr } = await lighthouse(url, CHROME.opts, null);
        DATA[url].lighthouse = lhr;
        console.log('lighthouse: ' + url);
    }
};
