
async function process(device) {
    const voltage = await getVoltage(device);
    const current = await getCurrent(device);
    const power = await getPower(device);

    console.log(getCurrentTimestamp());
    console.log('Voltage:', voltage, 'V');
    console.log('Current:', current, 'mA');
    console.log('Power:', power, 'W');
    console.log();
}

function getCurrentTimestamp() {
    var d = new Date();
    return d.toISOString();
}

async function getVoltage(device) {
    const voltage = await device.get({dps: 20});
    return voltage / 10;
}

async function getCurrent(device) {
    return await device.get({dps: 18});
}

async function getPower(device) {
    const power = await device.get({dps: 19});
    return power / 10;
}

module.exports = {process};
