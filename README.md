# node.js Weblyse

A node.js library to analyse any website with multiple tools and get a report JSON.

## Install

```bash
# npm
npm install node-weblyse

# yarn
yarn add node-weblyse
```

## Usage

```js
const weblyse = require('node-weblyse');

// the report file path is resolved using process.cwd()
// to enforce that it's relative to this file you can do
process.chdir(__dirname);

weblyse({
    urls: [
        // add as much URLs as you want
        // the report will contain all of them
        'https://github.com',
    ],
    // if you don't need a file just omit the reportFilePath key
    reportFilePath: './report.json', 
    // you con configure the single providers
    // enable/disable them via a simple boolean
    // or use an object for configuration values
    providers: {
        ssllabs: true,
        securityheaders: true,
        webhint: true,
        screenshots: true,
        lighthouse: true,
        axe: true,
    },
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
```

You can find an [example report.json](https://github.com/Gummibeer/node-weblyse/blob/master/example/report.json) in the GitHub repository.
