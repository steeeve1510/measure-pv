
module.exports = { getData };

async function getData(device) {
    const timestamp = new Date();
    const power = await getPower(device);
    const voltage = await getVoltage(device);
    const current = await getCurrent(device);
    return { timestamp, power, voltage, current };
}

async function getVoltage(device) {
    const voltage = await device.get({ dps: 20 });
    return voltage / 10;
}

async function getCurrent(device) {
    return await device.get({ dps: 18 });
}

async function getPower(device) {
    const power = await device.get({ dps: 19 });
    return power / 10;
}
