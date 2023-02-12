
const TuyAPI = require('tuyapi');
const measure = require('./measure')
const CronJob = require('cron').CronJob;
const fs = require('fs');

const config = getConfig();
const device = new TuyAPI({
    id: config.id,
    key: config.key
});

var job = new CronJob(
	'*/5 * * * * *',
	async () => await measure.process(device)
);

(async () => {
    await device.find();
    await device.connect();

    job.start();
})();

function getConfig() {
    let rawConfig = fs.readFileSync('config.json');
    return JSON.parse(rawConfig);
}
