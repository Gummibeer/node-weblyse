const axios = require('axios');

module.exports = function ({ followRedirects, hide }) {
    return Promise.all(
        URLS.map(url => {
            return axios.get(url)
                .then(response => {
                    DATA[url].securityheaders = {
                        'x-frame-options': ['SAMEORIGIN', 'DENY'].includes(response.headers['x-frame-options']),
                        'x-xss-protection': response.headers['x-xss-protection'] === '1; mode=block',
                        'content-security-policy': response.headers['content-security-policy'] !== undefined,
                        'x-content-type-options': response.headers['x-content-type-options'] === 'nosniff',
                    };
                    console.log('securityheaders: ' + url);
                });
        }),
    );
};
