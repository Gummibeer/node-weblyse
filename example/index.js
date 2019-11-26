const watchtower = require('../src/index');

process.chdir(__dirname);

watchtower([
    'https://gummibeer.de',
    'https://astrotomic.info',
    'https://janine-pantzek.de',
    'https://moinhund.hamburg',
    'https://studiopolster.de',
], './report')
    .finally(() => {
       process.exit(0);
    });
