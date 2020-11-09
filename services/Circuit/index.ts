import GPIO, {Mode} from "../GPIO";

require('localenv');

const NO = process.env.NO_SERVOVALVE;
const LOW_LEVEL_RELAY = process.env.LOW_LEVEL_RELAY;

export class Circuit {
    private readonly pinNumber: number;
    protected isOpen: boolean;
    public changing: boolean;
    constructor(pinNumber: number, mode: Mode, isOpen: boolean) {
        this.pinNumber = pinNumber;
        this.isOpen = isOpen;
        //Инициализируем пин
        GPIO.initialPin(pinNumber);
        GPIO.setPinMode(pinNumber, mode);
        //Если надо его сразу включить
        if (isOpen) {
            //Если серва нормально открытая, т.е. нам надо НЕ открывать реле
            if (NO) {
                LOW_LEVEL_RELAY ? GPIO.on(pinNumber): GPIO.off(pinNumber);
            } else {
                //Нормально закрытая серва, чтобы открыть, надо открыть реле
                LOW_LEVEL_RELAY ? GPIO.off(pinNumber): GPIO.on(pinNumber);
            }
            this.isOpen = true;
        } else {
            //Надо выключить контур.
            // Если он нормально открыт, то надо открыть реле
            if (NO) {
                LOW_LEVEL_RELAY ? GPIO.off(pinNumber): GPIO.on(pinNumber);
            } else {
                //Если серва нормально закрытая, то чтобы закрыть контур, надо НЕ открывать реле
                LOW_LEVEL_RELAY ? GPIO.on(pinNumber): GPIO.off(pinNumber);
            }
            this.isOpen = false;
        }
        this.changing = true;
        setTimeout(() => {
            this.changing = false;
        }, 3000)
    }
    on() {
        //Если серва нормально открытая, т.е. нам надо НЕ открывать реле
        if (NO) {
            LOW_LEVEL_RELAY ? GPIO.on(this.pinNumber): GPIO.off(this.pinNumber);
        } else {
            //Нормально закрытая серва, чтобы ее открыть, надо открыть реле
            LOW_LEVEL_RELAY ? GPIO.off(this.pinNumber): GPIO.on(this.pinNumber);
        }
        this.isOpen = true;
        this.changing = true;
        setTimeout(() => {
            this.changing = false;
        }, 3000)
    }

    off() {
        // Если он нормально открыт, то надо открыть реле
        if (NO) {
            LOW_LEVEL_RELAY ? GPIO.off(this.pinNumber): GPIO.on(this.pinNumber);
        } else {
            //Если серва нормально закрытая, то чтобы закрыть контур, надо НЕ открывать реле
            LOW_LEVEL_RELAY ? GPIO.on(this.pinNumber): GPIO.off(this.pinNumber);
        }
        this.isOpen = false;
        this.changing = true;
        setTimeout(() => {
            this.changing = false;
        }, 3000)
    }

    getPin() {
        return this.pinNumber
    }

    getValue() {
        return this.isOpen
    }

    release() {
        GPIO.release(this.pinNumber)
    }
}
