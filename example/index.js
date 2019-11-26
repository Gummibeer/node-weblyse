const watchtower = require('../src/index');

process.chdir(__dirname);

watchtower([
    'https://github.com',
], './report')
    .finally(() => {
       process.exit(0);
    });
