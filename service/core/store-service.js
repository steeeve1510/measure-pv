const { GoogleSpreadsheet } = require('google-spreadsheet');
const configService = require('../config-service');

module.exports = {store};

async function store(data) {
    const year = data.timestamp.getFullYear() + '';
    const config = configService.getConfig();
    const googleConfig = configService.getGoogleConfig();
    const doc = new GoogleSpreadsheet(config.spreadsheet[year]);

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
        "Timestamp": data.timestamp.toISOString(),
        "Power in W": data.power,
        "Voltage in V": data.voltage,
        "Current in mA": data.current,
        'Energy in Wm (LRAM)': data.energyLRAM,
        'Energy in Wm (RRAM)': data.energyRRAM,
        'Energy in Wm (MRAM)': data.energyMRAM
    });
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
