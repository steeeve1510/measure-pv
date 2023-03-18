
const deviceService = require('./device-service');
const storeService = require('./store-service');
const logService = require('./log-service');

module.exports = {measure};

async function measure(device) {
    const now = new Date();
    const data = await deviceService.getData(device);
    await storeService.store(now, data);
    logService.log(now, data);
}
