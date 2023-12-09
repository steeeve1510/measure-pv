
module.exports = { calculate };

function calculate(previousData, data) {
    if (!previousData) {
        return {
            energyLRAM: 0,
            energyRRAM: 0,
            energyMRAM: 0
        };
    }

    const previousPower = previousData.power;
    const currentPower = data.power;
    const averagePower = (previousPower + currentPower) / 2;

    const duration = getDurationInMinutes(previousData, data);

    const energyLRAM = previousPower * duration;
    const energyRRAM = currentPower * duration;
    const energyMRAM = averagePower * duration;
    return { energyLRAM, energyRRAM, energyMRAM };
}

function getDurationInMinutes(previousData, data) {
    const previousTimestamp = previousData.timestamp;
    const currentTimestamp = data.timestamp;
    return (currentTimestamp.getTime() - previousTimestamp.getTime()) / 1000 / 60;
}