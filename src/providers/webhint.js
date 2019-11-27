const {Analyzer} = require('hint');

module.exports = function (config) {
    const webhint = Analyzer.create(config);

    return new Promise(function (resolve, reject) {
        webhint.analyze(URLS)
            .then(results => {
                results.forEach(result => {
                    DATA[result.url]['webhint'] = result;
                    console.log('webhint: ' + result.url);
                });

                webhint.close();
                resolve();
            })
            .catch(reject);
    });
};