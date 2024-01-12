const weblyse = require('../src/index');

process.chdir(__dirname);

weblyse({
    urls: [
        'https://github.com',
    ],
    reportFilePath: './report.json', // if you don't need a file just omit this key
})
    .then(data => {
        // do whatever you want with the data Object
        // * assertions in your CI
        // * render a template
        // * post to monitoring service
        // ...
    })
    .finally(() => {
        // that's needed to end your node process
        process.exit(0);
    });
