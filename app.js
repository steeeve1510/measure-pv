
const TuyAPI = require('tuyapi');
const CronJob = require('cron').CronJob;
const configService = require('./service/config-service')
const pvService = require('./service/pv-service')

const config = configService.getConfig();
const device = new TuyAPI({
    id: config.id,
    key: config.key
});

var job = new CronJob(
	config.cron,
	async () => await pvService.measure(device),
    null,
    false,
    'Europe/Vienna'
);

(async () => {
    console.log('connecting to ammeter...');
    await device.find();
    await device.connect();
    console.log('connected to ammeter');

    console.log('starting cron-job (' + config.cron + ')...')
    job.start();
})();

