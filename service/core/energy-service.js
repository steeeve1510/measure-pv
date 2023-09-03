
module.exports = {calculate};

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

    const durationInSeconds = getDurationInSeconds(previousData, data);

    const energyLRAM = previousPower * durationInSeconds;
    const energyRRAM = currentPower * durationInSeconds;
    const energyMRAM = averagePower * durationInSeconds;
    return {energyLRAM, energyRRAM, energyMRAM};
}

function getDurationInSeconds(previousData, data) {
    const previousTimestamp = previousData.timestamp;
    const currentTimestamp = data.timestamp;
    return (currentTimestamp.getTime() - previousTimestamp.getTime()) / 1000;
}