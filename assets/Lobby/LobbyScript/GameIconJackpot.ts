// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Configs from "../../Loading/src/Configs";
import NumberUpdater from "./NumberUpdater";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameIconJackpot extends cc.Component {

    @property([cc.Label])
    arrayLabel: cc.Label[] = [];

    @property([cc.Integer])
        initJackpots: number[] = [
        500000,
        10000000,
        50000000
    ];

    public arrayUpdater: NumberUpdater[] = [];


    onLoad() {
        if (this.arrayLabel.length > 0) {
            this.arrayLabel.forEach((label: cc.Label, i) => {
                let updater = label.node.addComponent(NumberUpdater);
                updater.setNumber(this.initJackpots[i], 1);
                this.arrayUpdater.push(updater);
            });
        }
    }

    updateJackpot(t) {
        let array = this.initJackpots; //todo gan lai gia tri jackpot vao
        // let array = jackpotSlotBenley;
        let isLogin = Configs.Login.IsLogin;
        if(!isLogin){
            this.initJackpots.forEach((value, i) => {
                let index = i;
                if (array[index] > value * 1.5) {
                    array[index] = value;
                }
                let delta = value / 250 * (Math.random() * 2 + 1);
                array[index] += Math.floor(delta);
            });
        }

        let len = this.arrayUpdater.length;
        if (len > 0 && array.length >= len) {
            this.arrayUpdater.forEach((updater, i) => {
                let index = i;
                if (array[index] > 0) {
                    updater.setNumber(array[index], t);
                }
            });
        }
    }

    onEnable() {
        // this.schedule(() => {
        //     this.updateJackpot(1.5)
        // }, 3, cc.macro.REPEAT_FOREVER, 0);
    }

    onDisable() {
        this.unscheduleAllCallbacks();
    }
}
