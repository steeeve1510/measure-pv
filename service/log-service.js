
module.exports = {log};

async function log(data) {
    console.log(
        data.date.toISOString(), '-',
        'Power:', data.power + 'W,',
        'Voltage:', data.voltage + 'V,',
        'Current:', data.current + 'mA'
    );
}
