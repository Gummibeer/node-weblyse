const securityheaders = require('node-securityheaders.io');

module.exports = function ({followRedirects, hide}) {
    return Promise.all(
        URLS.map(url => {
            return securityheaders(url, followRedirects, hide)
                .then(result => {
                    DATA[url]['securityheaders'] = result;
                    console.log('securityheaders: ' + url);
                });
        })
    );
};
