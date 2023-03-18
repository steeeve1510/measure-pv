
const fs = require('fs')

module.exports = {getConfig, getGoogleConfig};

function getConfig() {
    let rawConfig = fs.readFileSync('config.json');
    return JSON.parse(rawConfig);
}

function getGoogleConfig() {
    let rawConfig = fs.readFileSync('google-config.json');
    return JSON.parse(rawConfig);
}
