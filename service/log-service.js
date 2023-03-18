
module.exports = {log};

async function log(now, data) {
    console.log(
        now.toISOString(), '-',
        'Power:', data.power + 'W',
        'Voltage:', data.voltage + 'V',
        'Current:', data.current + 'mA'
    );
}
