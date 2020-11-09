import GPIO, {Mode} from "../GPIO";

type Params = {
    pinNumber: number;
    mode: Mode,
    isOpen: boolean,
    name?: string,
    NO?: boolean,
    LOW_LEVEL_RELAY?: boolean,
};

export class Circuit {
    private readonly pinNumber: number;
    private readonly lowLevelRelay: boolean;
    private readonly NOServe: boolean;
    protected isOpen: boolean;
    public changing: boolean;
    public name: string;
    constructor(params: Params) {
        const {pinNumber, isOpen, name, mode, NO, LOW_LEVEL_RELAY} = params;
        this.pinNumber = pinNumber;
        this.isOpen = isOpen;
        this.name = name || '<unnamed>';
        this.lowLevelRelay = LOW_LEVEL_RELAY;
        this.NOServe = NO;
        //Инициализируем пин
        GPIO.initialPin(pinNumber);
        GPIO.setPinMode(pinNumber, mode);
        //Если надо его сразу включить
        if (isOpen) {
            //Если серва нормально открытая, т.е. нам надо НЕ открывать реле
            if (this.NOServe) {
                LOW_LEVEL_RELAY ? GPIO.on(pinNumber): GPIO.off(pinNumber);
            } else {
                //Нормально закрытая серва, чтобы открыть, надо открыть реле
                LOW_LEVEL_RELAY ? GPIO.off(pinNumber): GPIO.on(pinNumber);
            }
            this.isOpen = true;
        } else {
            //Надо выключить контур.
            // Если он нормально открыт, то надо открыть реле
            if (this.NOServe) {
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
        if (this.NOServe) {
            this.lowLevelRelay ? GPIO.on(this.pinNumber): GPIO.off(this.pinNumber);
        } else {
            //Нормально закрытая серва, чтобы ее открыть, надо открыть реле
            this.lowLevelRelay ? GPIO.off(this.pinNumber): GPIO.on(this.pinNumber);
        }
        this.isOpen = true;
        this.changing = true;
        setTimeout(() => {
            this.changing = false;
        }, 3000)
    }

    off() {
        // Если он нормально открыт, то надо открыть реле
        if (this.NOServe) {
            this.lowLevelRelay ? GPIO.off(this.pinNumber): GPIO.on(this.pinNumber);
        } else {
            //Если серва нормально закрытая, то чтобы закрыть контур, надо НЕ открывать реле
            this.lowLevelRelay ? GPIO.on(this.pinNumber): GPIO.off(this.pinNumber);
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
