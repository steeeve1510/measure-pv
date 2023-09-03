const { GoogleSpreadsheet } = require('google-spreadsheet');
const configService = require('./config-service');

module.exports = {store};

async function store(data) {
    const year = data.date.getFullYear() + '';
    const config = configService.getConfig();
    const googleConfig = configService.getGoogleConfig();
    const doc = new GoogleSpreadsheet(config.spreadsheet[year]);

    // console.debug('connecting to spreadsheet (' + year + ')...');
    await doc.useServiceAccountAuth({
        client_email: googleConfig.client_email,
        private_key: googleConfig.private_key,
    });
    // console.debug('connected to spreadsheet');

    await doc.loadInfo();
    const sheetTitle = getSheetTitle(data.date);
    var sheet = doc.sheetsByTitle[sheetTitle];
    if (sheet == null) {
        // console.debug('creating new sheet: ' + sheetTitle);
        sheet = await doc.addSheet({ title: sheetTitle });
    }

    // console.debug('storing data...');
    await sheet.setHeaderRow(['Timestamp', 'Power in W', 'Voltage in V', 'Current in mA']);
    await sheet.addRow({
        "Timestamp": data.date.toISOString(),
        "Power in W": data.power,
        "Voltage in V": data.voltage,
        "Current in mA": data.current
    });
    // console.debug('data stored');
}

function getSheetTitle(timestamp) {
    const startDate = new Date(timestamp.getFullYear(), 0, 1);
    const days = Math.floor((timestamp - startDate) /
        (24 * 60 * 60 * 1000));
    const weekOfTheYear = Math.ceil(days / 7);
    if (weekOfTheYear < 10) {
        return '0' + weekOfTheYear.toString();
    }
    return weekOfTheYear.toString();;
}
