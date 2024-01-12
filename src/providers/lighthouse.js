const spawnSync = require('child_process').spawnSync;
const lighthouseCli = require.resolve('lighthouse/cli');

module.exports = async function () {
    return Promise.all(
        URLS.map(url => {
            return new Promise(function (resolve, reject) {
                const { status, stdout } = spawnSync(
                    process.execPath, [
                        lighthouseCli,
                        url,
                        '--output=json',
                        '--chromeFlags=--headless',
                        '--disable-full-page-screenshot',
                        '--only-categories=performance,accessibility,best-practices,seo'
                    ]);

                if (status !== 0) {
                    console.log('Lighthouse failed for ' + url + ', skipping run...');
                    resolve();
                    return;
                }

                DATA[url].lighthouse = JSON.parse(stdout.toString());
                console.log('lighthouse: ' + url);
                resolve();
            });
        }),
    );
};
