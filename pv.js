const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require('fs');

module.exports = {measure};

async function measure(device) {
    const now = new Date();
    const data = await getData(device);
    await store(now, data);
    log(now, data);
}

async function getData(device) {
    const power = await getPower(device);
    const voltage = await getVoltage(device);
    const current = await getCurrent(device);
    return {power, voltage, current};
}

async function store(now, data) {
    const year = now.getFullYear() + '';
    const config = getConfig();
    const googleConfig = getGoogleConfig();
    const doc = new GoogleSpreadsheet(config.spreadsheet[year]);

    console.log('connecting to spreadsheet (' + year + ')...');
    await doc.useServiceAccountAuth({
        client_email: googleConfig.client_email,
        private_key: googleConfig.private_key,
    });
    console.log('connected to spreadsheet');

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

function getConfig() {
    let rawConfig = fs.readFileSync('config.json');
    return JSON.parse(rawConfig);
}

function getGoogleConfig() {
    let rawConfig = fs.readFileSync('google-config.json');
    return JSON.parse(rawConfig);
}
