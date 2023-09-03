
const deviceService = require('./core/device-service');
const storeService = require('./core/store-service');
const logService = require('./core/log-service');
const cache = require('./utll/cache');
const energyService = require('./core/energy-service');

module.exports = {measure};

async function measure(device) {
    const previousData = cache.get();
    const data = await deviceService.getData(device);

    const energy = energyService.calculate(previousData, data);
    const dataWithEnergy = {
        ...data,
        ...energy
    }

    logService.log(dataWithEnergy);
    await storeService.store(dataWithEnergy);
    
    cache.set(dataWithEnergy);
}
