// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NumberUpdater extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Integer)
    public step = 0.01;
    @property(cc.Integer)
    private _currentNumber: number = 0;
    public get currentNumber() {
        return this._currentNumber;
    }

    public set currentNumber(value: number) {
        this._currentNumber = value;
        this.updateLabel();
    }

    public preprocessingMoney (money1:number | string) : string {
        money1 = parseInt(money1 + '');
        let money = Math.abs(money1) + '';
        let string = this.preprocessingString(money);
        if (money1 < 0) {
            string = "-" + string;
        }
        return string;
    }

    public preprocessingString (money: string) {
        if (money.length < 4) {
            return money + "";
        }
        let string = "";
        let count = 1;
        for (let i = 0; i < money.length; i++) {
            string = money[money.length - 1 - i] + string;
            if (count % 3 === 0 && count !== money.length) {
                string = "." + string;
            }
            count++;
        }
        return string;
    }

    /***
     * @type function(str: string)=> string
     */
    private _formatFunc = this.preprocessingMoney;
    set formatFunc(formatFunc: (str: string) => string) {
        this._formatFunc = formatFunc;
    }

    protected onLoad(): void {
        this.formatFunc = this.preprocessingString;
    }

    protected start(): void {
        if (!this.label) {
            this.label = this.getComponent(cc.Label);
        }
        // this.setNumber(20, 0.25);
    }

    public setNumber(number: number, time: number, stepTime?: number) {
        if (time) {
            this.unscheduleAllCallbacks();
            if (this.currentNumber === number) {
                return;
            }
            if (stepTime) {
                this.step = stepTime;
            }
            let interval = this.step;
            let repeat = Math.floor(time / this.step);
            if (this.currentNumber > number) {
                this.currentNumber = 0;
            }
            let distNumber = Math.ceil((number - this.currentNumber) / repeat);
            if (distNumber <= 0) {
                distNumber = 1;
            }
            this.schedule(function () {
                this.currentNumber += distNumber;
                if (this.currentNumber > number) {
                    this.currentNumber = number;
                    this.unscheduleAllCallbacks();
                }
            }.bind(this), interval, repeat, 0);
        } else {
            this.currentNumber = number;
        }
    }

    updateLabel() {
        if (cc.isValid(this.label)) {
            if (this._formatFunc) {
                this.label.string = '' + this._formatFunc(this.currentNumber + '');
            } else {
                this.label.string = '' + this.currentNumber;
            }
        } else {
        //    cc.warn('this.label is not valid or null or undefined');
        }
    }

    protected onDestroy(): void {
        this.unscheduleAllCallbacks();
    }
}
