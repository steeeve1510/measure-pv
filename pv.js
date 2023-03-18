
module.exports = {measure};

async function measure(device, doc) {
    const now = new Date();
    const data = await getData(device);
    await store(now, data, doc);
    log(now, data);
}

async function getData(device) {
    const power = await getPower(device);
    const voltage = await getVoltage(device);
    const current = await getCurrent(device);
    return {power, voltage, current};
}

async function store(now, data, doc) {
    await doc.loadInfo();
    const sheetTitle = getSheetTitle(now);
    var sheet = doc.sheetsByTitle[sheetTitle];
    if (sheet == null) {
        sheet = await doc.addSheet({ title: sheetTitle });
    }
    await sheet.setHeaderRow(['Timestamp', 'Power in W', 'Voltage in V', 'Current in mA']);
    await sheet.addRow({
        "Timestamp": toTimestamp(now),
        "Power in W": data.power,
        "Voltage in V": data.voltage,
        "Current in mA": data.current
    });
}

async function log(now, data) {
    console.log(toTimestamp(now));
    console.log('Power:', data.power, 'W');
    console.log('Voltage:', data.voltage, 'V');
    console.log('Current:', data.current, 'mA');
    console.log();
}

function toTimestamp(date) {
    return date.toISOString();
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

function getSheetTitle(now) {
    const startDate = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now - startDate) /
        (24 * 60 * 60 * 1000));
    const weekOfTheYear = Math.ceil(days / 7);
    if (weekOfTheYear < 10) {
        return '0' + weekOfTheYear.toString();
    }
    return weekOfTheYear.toString();;
}
