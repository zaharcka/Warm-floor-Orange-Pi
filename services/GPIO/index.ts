const fs = require("fs");

export type PinType = number;
export type Mode = 'out' | 'in';

const on = (pin:PinType) => {
    fs.writeFileSync(`/sys/class/gpio/gpio${pin}/value`, '1');
}

const off = (pin:PinType) => {
    fs.writeFileSync(`/sys/class/gpio/gpio${pin}/value`, '0');
}

const initialPin = (pin:PinType) => {
    fs.writeFileSync(`/sys/class/gpio/export`, String(pin));
}

export const release = (pin:PinType) => {
    fs.writeFileSync(`/sys/class/gpio/unexport`, String(pin));
}

export const isPinInitial = (pin:PinType):Boolean => {
    return fs.existsSync(`/sys/class/gpio/gpio${pin}/value`);
}

const setPinMode = (pin:PinType, mode: Mode) => {
    fs.writeFileSync(`/sys/class/gpio/gpio${pin}/direction`, mode);
};

export default {
    on,
    off,
    initialPin,
    release,
    isPinInitial,
    setPinMode,
}