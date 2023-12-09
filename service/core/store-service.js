const { GoogleSpreadsheet } = require('google-spreadsheet');
const configService = require('../config-service');

module.exports = { store };

async function store(data) {

    const documentTitle = getDocumentTitle(data.timestamp)
    const config = configService.getConfig();
    const doc = new GoogleSpreadsheet(config.spreadsheet[documentTitle]);

    const googleConfig = configService.getGoogleConfig();
    await doc.useServiceAccountAuth({
        client_email: googleConfig.client_email,
        private_key: googleConfig.private_key,
    });

    await doc.loadInfo();
    const sheetTitle = getSheetTitle(data.timestamp);
    var sheet = doc.sheetsByTitle[sheetTitle];
    if (sheet == null) {
        sheet = await doc.addSheet({ title: sheetTitle });
    }

    await sheet.setHeaderRow([
        'Timestamp',
        'Power in W',
        'Voltage in V',
        'Current in mA',
        'Energy in Wm (LRAM)',
        'Energy in Wm (RRAM)',
        'Energy in Wm (MRAM)'
    ]);
    await sheet.addRow({
        "Timestamp": data.timestamp.toLocaleString('de-DE', { timeZone: 'Europe/Vienna' }),
        "Power in W": data.power,
        "Voltage in V": data.voltage,
        "Current in mA": data.current,
        'Energy in Wm (LRAM)': data.energyLRAM,
        'Energy in Wm (RRAM)': data.energyRRAM,
        'Energy in Wm (MRAM)': data.energyMRAM
    });
}

function getDocumentTitle(timestamp) {
    const year = timestamp.getFullYear();
    if (year <= 2023) {
        return year + ''
    }

    const weekOfTheYear = getWeekOfTheYear(timestamp)
    const number = Math.ceil(weekOfTheYear / 10)
    if (number > 5) {
        return year + '_' + 5
    }
    return year + '_' + number
}

function getSheetTitle(timestamp) {
    const weekOfTheYear = getWeekOfTheYear(timestamp)
    if (weekOfTheYear < 10) {
        return '0' + weekOfTheYear.toString();
    }
    return weekOfTheYear.toString();
}

function getWeekOfTheYear(timestamp) {
    const startDate = new Date(timestamp.getFullYear(), 0, 1);
    const days = Math.floor((timestamp - startDate) /
        (24 * 60 * 60 * 1000));
    return Math.ceil(days / 7);
}
