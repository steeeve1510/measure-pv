
module.exports = {measure};

async function measure(device, doc) {
    const timestamp = getCurrentTimestamp();
    const data = await getData(device);
    await store(timestamp, data, doc);
    log(timestamp, data);
}

function getCurrentTimestamp() {
    var d = new Date();
    return d.toISOString();
}

async function getData(device) {
    const power = await getPower(device);
    const voltage = await getVoltage(device);
    const current = await getCurrent(device);
    return {power, voltage, current};
}

async function store(timestamp, data, doc) {
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['06'];
    await sheet.setHeaderRow(['Timestamp', 'Power in W', 'Voltage in V', 'Current in mA']);
    await sheet.addRow({
        "Timestamp": timestamp,
        "Power in W": data.power,
        "Voltage in V": data.voltage,
        "Current in mA": data.current
    });
}

async function log(timestamp, data) {
    console.log(timestamp);
    console.log('Power:', data.power, 'W');
    console.log('Voltage:', data.voltage, 'V');
    console.log('Current:', data.current, 'mA');
    console.log();
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

function getWeekOfTheYear() {
    var currentDate = new Date();
    var startDate = new Date(currentDate.getFullYear(), 0, 1);
    var days = Math.floor((currentDate - startDate) /
        (24 * 60 * 60 * 1000));
    return Math.ceil(days / 7);
}
