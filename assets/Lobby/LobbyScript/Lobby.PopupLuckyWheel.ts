import Configs from "../../Loading/src/Configs";
import cmd from "./Lobby.Cmd";
import App from "./Script/common/App";
import BroadcastReceiver from "./Script/common/BroadcastReceiver";
import Dialog from "./Script/common/Dialog";
import MiniGameNetworkClient from "./Script/networks/MiniGameNetworkClient";
import InPacket from "./Script/networks/Network.InPacket";


const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupLuckyWheel extends Dialog {
    @property(cc.Node)
    wheel1: cc.Node = null;
    @property(cc.Node)
    wheel3: cc.Node = null;
    @property(cc.Label)
    lblCount: cc.Label = null;
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.Button)
    btnSpin: cc.Button = null;

    private spinCount = 0;

    start() {
        MiniGameNetworkClient.getInstance().addListener((data) => {
            if (!this.node.active) return;

            let inPacket = new InPacket(data);
            switch (inPacket.getCmdId()) {
                case cmd.Code.SPIN_LUCKY_WHEEL: {
                    let res = new cmd.ResSpinLuckyWheel(data);
                    //  //Utils.Log(res);

                    if (res.error != 0) {
                        switch (res.error) {
                            case 1:
                                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_check_connect'));
                                break;
                            case 2:
                                App.instance.alertDialog.showMsg("Bạn đã hết lượt quay.");
                                break;
                            case 3:
                                App.instance.alertDialog.showMsg("Mỗi ngày chỉ được quay tối đa 2 lần!");
                                break;
                        }
                        this.btnSpin.interactable = true;
                        this.btnClose.interactable = true;
                        break;
                    }
                    this.spinCount -= 1;
                    this.lblCount.string = this.spinCount.toString();

                    Configs.Login.LuckyWheel = res.remainCount;
                    Configs.Login.Coin = res.currentMoneyVin;

                    let msg = "Chúc mừng bạn đã nhận được\n";
                    let rotateToIdx1 = 3;
                    switch (res.prizeSlot) {
                        case "KhoBau1":
                            rotateToIdx1 = 2;
                            msg += "1 lượt quay Range Rover";
                            break;
                        case "KhoBau2":
                            rotateToIdx1 = 6;
                            msg += "2 lượt quay Range Rover";
                            break;
                        case "KhoBau3":
                            rotateToIdx1 = 11;
                            msg += "3 lượt quay Range Rover";
                            break;
                        case "NuDiepVien1":
                            rotateToIdx1 = 0;
                            msg += "1 lượt quay MayBach";
                            break;
                        case "NuDiepVien2":
                            rotateToIdx1 = 10;
                            msg += "2 lượt quay MayBach";
                            break;
                        case "NuDiepVien3":
                            rotateToIdx1 = 4;
                            msg += "3 lượt quay MayBach";
                            break;
                        case "SieuAnhHung1":
                            rotateToIdx1 = 5;
                            msg += "1 lượt quay Bentley";
                            break;
                        case "SieuAnhHung2":
                            rotateToIdx1 = 1;
                            msg += "1 lượt quay Bentley";
                            break;
                        case "SieuAnhHung3":
                            rotateToIdx1 = 8;
                            msg += "1 lượt quay Bentley";
                            break;
                        case "more":
                            rotateToIdx1 = 9;
                            msg += "thêm 1 lượt quay";
                            break;
                    }

                    if (rotateToIdx1 != 3) msg += "và ";

                    let rotateToIdx3 = 1;
                    switch (res.prizeVin) {
                        case "1000":
                            rotateToIdx3 = 7;
                            msg += "1.000 Xu";
                            break;
                        case "2000":
                            rotateToIdx3 = 5;
                            msg += "2.000 Xu";
                            break;
                        case "5000":
                            rotateToIdx3 = 3;
                            msg += "5.000 Xu";
                            break;
                        case "10000":
                            rotateToIdx3 = 6;
                            msg += "10.000 Xu";
                            break;
                        case "20000":
                            rotateToIdx3 = 2;
                            msg += "20.000 Xu";
                            break;
                        case "50000":
                            rotateToIdx3 = 4;
                            msg += "50.000 Xu";
                            break;
                        case "100000":
                            rotateToIdx3 = 0;
                            msg += "100.000 Xu";
                            break;
                        default:
                            break;
                    }
                    msg += ".";
                    if (rotateToIdx3 == 1 && rotateToIdx1 == 3) {
                        msg = "Chúc bạn may mắn lần sau.";
                    }

                    this.wheel1.stopAllActions();
                    this.wheel3.stopAllActions();
                    this.wheel1.angle = 0;
                    this.wheel3.angle = 0;
                    this.wheel1.runAction(cc.rotateTo(3, -(360 * 4 + (360 - 360 / 12 * rotateToIdx1) - 360 / 12 / 2)).easing(cc.easeSineInOut()));
                    this.wheel3.runAction(cc.sequence(
                        cc.delayTime(0.25),
                        cc.rotateTo(4, 360 * 4 + 360 / 8 * rotateToIdx3 + 360 / 8 / 2).easing(cc.easeSineInOut()),
                        cc.callFunc(() => {
                            this.btnSpin.interactable = true;
                            this.btnClose.interactable = true;
                            this.spinCount = Configs.Login.LuckyWheel;
                            this.lblCount.string = this.spinCount.toString();
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            App.instance.alertDialog.showMsg(msg);
                        })
                    ));
                    break;
                }
            }
        }, this);
    }

    show() {
        super.show();
        this.wheel1.angle = 0;
        this.wheel3.angle = 0;
        this.spinCount = Configs.Login.LuckyWheel;
        this.lblCount.string = this.spinCount.toString();
    }

    dismiss() {
        super.dismiss();
    }

    actSpin() {
        this.btnSpin.interactable = false;
        this.btnClose.interactable = false;
        MiniGameNetworkClient.getInstance().send(new cmd.ReqSpinLuckyWheel());
    }
}
