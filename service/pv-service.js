
const deviceService = require('./device-service');
const storeService = require('./store-service');
const logService = require('./log-service');
const cache = require('./cache');

module.exports = {measure};

async function measure(device) {
    const data = await deviceService.getData(device);
    const previousData = cache.get();
    logService.log(data);
    await storeService.store(data);
    cache.set(data);
}
