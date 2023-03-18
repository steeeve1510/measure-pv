const { GoogleSpreadsheet } = require('google-spreadsheet');
const configService = require('./config-service');

module.exports = {store};

async function store(now, data) {
    const year = now.getFullYear() + '';
    const config = configService.getConfig();
    const googleConfig = configService.getGoogleConfig();
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
        console.log('creating new sheet: ' + sheetTitle);
        sheet = await doc.addSheet({ title: sheetTitle });
    }

    console.log('storing data...');
    await sheet.setHeaderRow(['Timestamp', 'Power in W', 'Voltage in V', 'Current in mA']);
    await sheet.addRow({
        "Timestamp": now.toISOString(),
        "Power in W": data.power,
        "Voltage in V": data.voltage,
        "Current in mA": data.current
    });
    console.log('data stored');
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
