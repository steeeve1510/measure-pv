
const TuyAPI = require('tuyapi');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const CronJob = require('cron').CronJob;
const fs = require('fs');

const pv = require('./pv')

const config = getConfig();
const device = new TuyAPI({
    id: config.id,
    key: config.key
});

const googleConfig = getGoogleConfig();
const doc = new GoogleSpreadsheet(config.spreadsheet);

var job = new CronJob(
	'*/' + config.retryInterval + ' * * * * *',
	async () => await pv.measure(device, doc)
);

(async () => {
    await doc.useServiceAccountAuth({
        client_email: googleConfig.client_email,
        private_key: googleConfig.private_key,
    });

    await device.find();
    await device.connect();

    job.start();
})();

function getConfig() {
    let rawConfig = fs.readFileSync('config.json');
    return JSON.parse(rawConfig);
}

function getGoogleConfig() {
    let rawConfig = fs.readFileSync('google-config.json');
    return JSON.parse(rawConfig);
}
