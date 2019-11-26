const watchtower = require('../src/index');

process.chdir(__dirname);

watchtower(
    [
        'https://github.com',
    ],
    './report.json' // if you don't need a file just omit this argument
)
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
