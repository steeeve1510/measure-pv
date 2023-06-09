
const deviceService = require('./device-service');
const storeService = require('./store-service');
const logService = require('./log-service');

module.exports = {measure};

async function measure(device) {
    console.log();
    const now = new Date();
    const data = await deviceService.getData(device);
    logService.log(now, data);
    await storeService.store(now, data);
}
