
module.exports = { log };

async function log(data) {
    console.log(
        data.timestamp.toLocaleString('de-DE', { timeZone: 'Europe/Vienna' }), '-',
        'Power:', data.power + 'W,',
        'Voltage:', data.voltage + 'V,',
        'Current:', data.current + 'mA,',
        'Energy (LRAM): ', data.energyLRAM + 'Wm,',
        'Energy (RRAM): ', data.energyRRAM + 'Wm,',
        'Energy (MRAM): ', data.energyMRAM + 'Wm',
    );
}
