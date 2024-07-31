// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Configs from "../../Loading/src/Configs";
import Http from "../../Loading/src/Http";
import App from "./Script/common/App";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoxLixi extends cc.Component {

    @property(cc.Label)
    lbTime: cc.Label = null;
    isMove = false;
    distance: number = 0;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    //    this.node.on(cc.Node.EventType.TOUCH_MOVE, (touch) => {
    //        this.node.setPosition(this.node.getPosition().add(touch.getDelta()));
    //        this.distance += Math.abs(touch.getDelta().x) + Math.abs(touch.getDelta().y);
    //        if (this.distance >= 70) {
    //            this.isMove = true;
    //        }
    //    });
        this.node.on(cc.Node.EventType.TOUCH_END, (touch) => {
            if (!this.isMove) {
                App.instance.actShowPopupRuleLixi();
            }
            this.isMove = false;
        });
    }

    start() {
        if (App.instance.timeLixi > 0) {
            this.setCountDown();
        } else if (App.instance.timeLixi == 0) {
            this.lbTime.string = "Đang diễn ra";
        }
    }
    getInfo() {
        Http.get(Configs.App.API, { "c": 2036, "nn": Configs.Login.Nickname, "at": Configs.Login.AccessToken, "ac": "time" }, (err, res) => {
            if (err) {
                return;
            } else {
                //  cc.log(res);
                if (res['data'] != null) {
                    App.instance.timeLixi = res['data']['countTime'];
                    this.setCountDown();
                } else if (res['success']) {// dang trong time su kien
                    this.lbTime.string = "Đang diễn ra";
                    if (res["errorCode"] == "0") {
                        App.instance.actGetEventLixi();
                    } else {
                        App.instance.ShowAlertDialog(res['message']);
                    }

                }
            }
        });
    }
    setCountDown() {
        if (App.instance.timeLixi > 0) {
            this.schedule(() => {
                let timeRemainSec = App.instance.timeLixi;
                if (timeRemainSec > 3600) {
                    let hour = Math.floor(timeRemainSec / 3600) > 9 ? Math.floor(timeRemainSec / 3600) : "0" + Math.floor(timeRemainSec / 3600);
                    let minutes = Math.floor((timeRemainSec % 3600) / 60) > 9 ? Math.floor((timeRemainSec % 3600) / 60) : "0" + Math.floor((timeRemainSec % 3600) / 60);
                    let seccond = Math.floor((timeRemainSec % 3600) % 60) > 9 ? Math.floor((timeRemainSec % 3600) % 60) : "0" + Math.floor((timeRemainSec % 3600) % 60);
                    this.lbTime.string = cc.js.formatStr("%s:%s:%s", hour, minutes, seccond);
                } else if (timeRemainSec > 60) {
                    let minutes = Math.floor((timeRemainSec % 3600) / 60) > 9 ? Math.floor((timeRemainSec % 3600) / 60) : "0" + Math.floor((timeRemainSec % 3600) / 60);
                    let seccond = Math.floor((timeRemainSec % 3600) % 60) > 9 ? Math.floor((timeRemainSec % 3600) % 60) : "0" + Math.floor((timeRemainSec % 3600) % 60);
                    this.lbTime.string = cc.js.formatStr("%s:%s", minutes, seccond);
                } else if (timeRemainSec == 0) {
                    this.unscheduleAllCallbacks();
                    // this.getInfo();
                    App.instance.actGetEventLixi();
                }
                App.instance.timeLixi--;
            }, 1.0, cc.macro.REPEAT_FOREVER, 0.1);
        } else if (App.instance.timeLixi == 0) {
            this.unscheduleAllCallbacks();
            App.instance.actGetEventLixi();

        }

    }

    // update (dt) {}
}
