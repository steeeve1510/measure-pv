
module.exports = {log};

async function log(now, data) {
    console.log(now.toISOString());
    console.log('Power:', data.power, 'W');
    console.log('Voltage:', data.voltage, 'V');
    console.log('Current:', data.current, 'mA');
    console.log();
}
