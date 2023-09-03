
module.exports = {log};

async function log(data) {
    console.log(
        data.timestamp.toISOString(), '-',
        'Power:', data.power + 'W,',
        'Voltage:', data.voltage + 'V,',
        'Current:', data.current + 'mA,',
        'Energy (LRAM): ', data.energyLRAM + 'Ws,',
        'Energy (RRAM): ', data.energyRRAM + 'Ws,',
        'Energy (MRAM): ', data.energyMRAM + 'Ws',
    );
}
