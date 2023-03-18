
const TuyAPI = require('tuyapi');
const CronJob = require('cron').CronJob;
const fs = require('fs');
const pv = require('./pv')

const config = getConfig();
const device = new TuyAPI({
    id: config.id,
    key: config.key
});

var job = new CronJob(
	config.cron,
	async () => await pv.measure(device)
);

(async () => {
    console.log('connecting to ammeter...');
    await device.find();
    await device.connect();
    console.log('connected to ammeter');

    console.log('starting cron-job...')
    job.start();
})();

function getConfig() {
    let rawConfig = fs.readFileSync('config.json');
    return JSON.parse(rawConfig);
}
