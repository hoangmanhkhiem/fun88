import Configs from "../../../Loading/src/Configs";
import BroadcastReceiver from "../../../Lobby/LobbyScript/Script/common/BroadcastReceiver";
import Tween from "../../../Lobby/LobbyScript/Script/common/Tween";
import Utils from "../../../Lobby/LobbyScript/Script/common/Utils";
import InPacket from "../../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import TX2NetworkClient from "../../../Lobby/LobbyScript/Script/networks/TX2NetworkClient";
import TaiXiuDoubleController from "../src/TaiXiuDouble.Controller";
import cmd from "./TaiXiuMini2.Cmd";
import PanelChat from "./TaiXiuMini2.PanelChat";

import PopupDetailHistory from "./TaiXiuMini2.PopupDetailHistory";


const { ccclass, property } = cc._decorator;

enum BetDoor {
    None, Tai, Xiu
}

@ccclass
export default class TaiXiuMini2Controller extends cc.Component {

    static instance: TaiXiuMini2Controller = null;

    @property(cc.Node)
    gamePlay: cc.Node = null;
    @property([cc.SpriteFrame])
    sprDices: Array<cc.SpriteFrame> = new Array<cc.SpriteFrame>();
    @property(cc.SpriteFrame)
    sprFrameTai: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sprFrameXiu: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sprFrameBtnNan: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sprFrameBtnNan2: cc.SpriteFrame = null;
    @property(cc.Label)
    lblSession: cc.Label = null;
    @property(cc.Label)
    lblRemainTime: cc.Label = null;
    @property(cc.Label)
    lblRemainTime2: cc.Label = null;
    @property(cc.Label)
    lblScore: cc.Label = null;
    @property(cc.Label)
    lblUserTai: cc.Label = null;
    @property(cc.Label)
    lblUserXiu: cc.Label = null;
    @property(cc.Label)
    lblTotalBetTai: cc.Label = null;
    @property(cc.Label)
    lblTotalBetXiu: cc.Label = null;
    @property(cc.Label)
    lblBetTai: cc.Label = null;
    @property(cc.Label)
    lblBetXiu: cc.Label = null;
    @property(cc.Label)
    lblBetedTai: cc.Label = null;
    @property(cc.Label)
    lblBetedXiu: cc.Label = null;
    @property(cc.Sprite)
    dice1: cc.Sprite = null;
    @property(cc.Sprite)
    dice2: cc.Sprite = null;
    @property(cc.Sprite)
    dice3: cc.Sprite = null;
    @property(cc.Node)
    diceAnim: cc.Node = null;
    @property(cc.Node)
    bowl: cc.Node = null;
    @property(cc.Node)
    tai: cc.Node = null;
    @property(cc.Node)
    xiu: cc.Node = null;
    @property(cc.Node)
    btnHistories: cc.Node = null;
    @property(cc.Node)
    nodePanelChat: cc.Node = null;
    @property(cc.Node)
    layoutBet: cc.Node = null;
    @property(cc.Node)
    layoutBet1: cc.Node = null;
    @property(cc.Node)
    layoutBet2: cc.Node = null;
    @property([cc.Button])
    buttonsBet1: Array<cc.Button> = new Array<cc.Button>();
    @property([cc.Button])
    buttonsBet2: Array<cc.Button> = new Array<cc.Button>();
    @property(cc.Label)
    lblToast: cc.Label = null;
    @property(cc.Label)
    lblWinCash: cc.Label = null;
    @property(cc.Node)
    btnNan: cc.Node = null;
    
    @property(PopupDetailHistory)
    popupDetailHistory: PopupDetailHistory = null;
    
    @property([cc.Node])
    public popups: cc.Node[] = [];

    private isBetting = false;
    private remainTime = 0;
    private canBet = true;
    private betedTai = 0;
    private betedXiu = 0;
    private referenceId = 0;
    private betingValue = -1;
    private betingDoor = BetDoor.None;
    private isOpenBowl = false;
    private lastWinCash = 0;
    private lastScore = 0;
    private isNan = false;
    histories = [];
    private isCanChat = true;
    private panelChat: PanelChat = null;
    private readonly maxBetValue = 999999999;
    private listBets = [1000, 5000, 10000, 50000, 100000, 500000, 1000000, 10000000];
    private readonly bowlStartPos = cc.v2(0, -15);

    onLoad() {
        TaiXiuMini2Controller.instance = this;
    }

    start() {
        BroadcastReceiver.register(BroadcastReceiver.USER_LOGOUT, () => {
            if (!this.node.active) return;
            this.dismiss();
        }, this);

        TX2NetworkClient.getInstance().addOnClose(() => {
            if (!this.node.active) return;
            this.dismiss();
        }, this);

        TX2NetworkClient.getInstance().addListener((data: Uint8Array) => {
            if (!this.node.active) return;
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.GAME_INFO: {
                    let res = new cmd.ReceiveGameInfo(data);
                    this.stopWin();
                    this.bowl.active = false;
                    if (res.bettingState) {
                        this.isBetting = true;
                        this.dice1.node.active = false;
                        this.dice2.node.active = false;
                        this.dice3.node.active = false;
                        this.lblRemainTime.node.active = true;
                        this.lblRemainTime.string = res.remainTime < 10 ? "0" + res.remainTime : "" + res.remainTime;
                        this.lblRemainTime2.node.parent.active = false;
                        this.lblScore.node.parent.active = false;
                    } else {
                        this.lastScore = res.dice1 + res.dice2 + res.dice3;
                        this.isBetting = false;
                        this.dice1.node.active = true;
                        this.dice1.spriteFrame = this.sprDices[res.dice1];
                        this.dice2.node.active = true;
                        this.dice2.spriteFrame = this.sprDices[res.dice2];
                        this.dice3.node.active = true;
                        this.dice3.spriteFrame = this.sprDices[res.dice3];
                        this.lblRemainTime.node.active = false;
                        this.lblRemainTime2.node.parent.active = true;
                        this.lblRemainTime2.string = "00:" + (res.remainTime < 10 ? "0" + res.remainTime : "" + res.remainTime);
                        this.showResult();
                    }
                    this.diceAnim.active = false;
                    Tween.numberTo(this.lblTotalBetTai, res.potTai, 0.3);
                    Tween.numberTo(this.lblTotalBetXiu, res.potXiu, 0.3);
                    this.betedTai = res.betTai;
                    this.lblBetedTai.string = Utils.formatNumber(this.betedTai);
                    this.betedXiu = res.betXiu;
                    this.lblBetedXiu.string = Utils.formatNumber(this.betedXiu);
                    this.referenceId = res.referenceId;
                    this.lblSession.string = "#" + res.referenceId;
                    this.remainTime = res.remainTime;
                    break;
                }
                case cmd.Code.UPDATE_TIME: {
                    let res = new cmd.ReceiveUpdateTime(data);
                    if (res.bettingState) {
                        this.isBetting = true;
                        this.lblRemainTime.node.active = true;
                        this.lblRemainTime.string = res.remainTime < 10 ? "0" + res.remainTime : "" + res.remainTime;
                        this.lblRemainTime2.node.parent.active = false;
                        this.lblScore.node.parent.active = false;
                    } else {
                        this.isBetting = false;
                        this.lblRemainTime.node.active = false;
                        this.lblRemainTime2.node.parent.active = true;
                        this.lblRemainTime2.string = "00:" + (res.remainTime < 10 ? "0" + res.remainTime : "" + res.remainTime);
                        this.layoutBet.active = false;
                        this.lblBetTai.string = "ĐẶT";
                        this.lblBetXiu.string = "ĐẶT";
                        if (res.remainTime < 15 && this.isNan && !this.isOpenBowl) {
                            this.bowl.active = false;
                            this.showResult();
                            this.showWinCash();
                            this.isOpenBowl = true;
                        }
                    }
                    Tween.numberTo(this.lblTotalBetTai, res.potTai, 0.3);
                    Tween.numberTo(this.lblTotalBetXiu, res.potXiu, 0.3);
                    this.lblUserTai.string = "(" + Utils.formatNumber(res.numBetTai) + ")";
                    this.lblUserXiu.string = "(" + Utils.formatNumber(res.numBetXiu) + ")";
                    break;
                }
                case cmd.Code.DICES_RESULT: {
                    let res = new cmd.ReceiveDicesResult(data);
                    this.lastScore = res.dice1 + res.dice2 + res.dice3;
                    this.lblRemainTime.node.active = false;
                    this.dice1.spriteFrame = this.sprDices[res.dice1];
                    this.dice2.spriteFrame = this.sprDices[res.dice2];
                    this.dice3.spriteFrame = this.sprDices[res.dice3];

                    this.diceAnim.active = true;
                    this.diceAnim.getComponent(cc.Animation).play("shake");
                    this.scheduleOnce(() => {
                        this.diceAnim.active = false;
                        this.dice1.node.active = true;
                        this.dice2.node.active = true;
                        this.dice3.node.active = true;

                        if (!this.isNan) {
                            this.showResult();
                        } else {
                            this.bowl.setPosition(this.bowlStartPos);
                            this.bowl.active = true;
                        }
                    }, 0.95);

                    if (this.histories.length >= 100) {
                        this.histories.slice(0, 1);
                    }
                    this.histories.push({
                        "session": this.referenceId,
                        "dices": [
                            res.dice1,
                            res.dice2,
                            res.dice3
                        ]
                    });
                    break;
                }
                case cmd.Code.RESULT: {
                    let res = new cmd.ReceiveResult(data);
                    // cc.log(res);
                    Configs.Login.Coin = res.currentMoney;
                    this.lastWinCash = res.totalMoney;
                    if (!this.bowl.active) {
                        if (res.totalMoney > 0) this.showWinCash();
                    }
                    break;
                }
                case cmd.Code.NEW_GAME: {
                    let res = new cmd.ReceiveNewGame(data);
                    this.diceAnim.active = false;
                    this.dice1.node.active = false;
                    this.dice2.node.active = false;
                    this.dice3.node.active = false;
                    this.lblTotalBetTai.string = "0";
                    this.lblTotalBetXiu.string = "0";
                    this.lblBetedTai.string = "0";
                    this.lblBetedXiu.string = "0";
                    this.lblUserTai.string = "(0)";
                    this.lblUserXiu.string = "(0)";
                    this.referenceId = res.referenceId;
                    this.lblSession.string = "#" + res.referenceId;
                    this.betingValue = -1;
                    this.betingDoor = BetDoor.None;
                    this.betedTai = 0;
                    this.betedXiu = 0;
                    this.isOpenBowl = false;
                    this.lastWinCash = 0;
                    this.stopWin();
                    break;
                }
                case cmd.Code.HISTORIES: {
                    let res = new cmd.ReceiveHistories(data);
                    var his = res.data.split(",");
                    for (var i = 0; i < his.length; i++) {
                        this.histories.push({
                            "session": this.referenceId - his.length / 3 + parseInt("" + ((i + 1) / 3)) + (this.isBetting ? 0 : 1),
                            "dices": [
                                parseInt(his[i]),
                                parseInt(his[++i]),
                                parseInt(his[++i])
                            ]
                        });
                    }
                    this.updateBtnHistories();
                    break;
                }
                case cmd.Code.LOG_CHAT: {
                    let res = new cmd.ReceiveLogChat(data);
                    // cc.log(res);
                    var msgs = JSON.parse(res.message);
                    for (var i = 0; i < msgs.length; i++) {
                        this.panelChat.addMessage(msgs[i]["u"], msgs[i]["m"]);
                    }
                    this.panelChat.scrollToBottom();
                    break;
                }
                case cmd.Code.SEND_CHAT: {
                    let res = new cmd.ReceiveSendChat(data);
                    switch (res.error) {
                        case 0:
                            this.panelChat.addMessage(res.nickname, res.message);
                            break;
                        case 2:
                            this.showToast("Bạn không có quyền Chat!");
                            break;
                        case 3:
                            this.showToast("Tạm thời bạn bị cấm Chat!");
                            break;
                        case 4:
                            this.showToast("Nội dung chat quá dài.");
                            break;
                        default:
                            this.showToast("Bạn không thể chat vào lúc này.");
                            break;
                    }
                    // cc.log(res);
                    break;
                }
                case cmd.Code.BET: {
                    let res = new cmd.ReceiveBet(data);
                    switch (res.result) {
                        case 0:
                            switch (this.betingDoor) {
                                case BetDoor.Tai:
                                    this.betedTai += this.betingValue;
                                    this.lblBetedTai.string = Utils.formatNumber(this.betedTai);
                                    break;
                                case BetDoor.Xiu:
                                    this.betedXiu += this.betingValue;
                                    this.lblBetedXiu.string = Utils.formatNumber(this.betedXiu);
                                    break;
                            }
                            Configs.Login.Coin = res.currentMoney;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

                            this.betingValue = -1;
                            this.showToast("Đặt cược thành công.");
                            break;
                        case 2:
                            this.betingValue = -1;
                            this.showToast("Hết thời gian cược.");
                            break;
                        case 3:
                            this.betingValue = -1;
                            this.showToast("Số dư không đủ vui lòng nạp thêm.");
                            break;
                        case 4:
                            this.betingValue = -1;
                            this.showToast("Số tiền cược không hợp lệ.");
                            break;
                        default:
                            this.betingValue = -1;
                            this.showToast("Đặt cược không thành công.");
                            break;
                    }
                    break;
                }
                default:
                    // cc.log(inpacket.getCmdId());
                    break;
            }
        }, this);
        for (let i = 0; i < this.buttonsBet1.length; i++) {
            let btn = this.buttonsBet1[i];
            let value = this.listBets[i];
            let strValue = value + "";
            if (value >= 1000000) {
                strValue = (value / 1000000) + "M";
            } else if (value >= 1000) {
                strValue = (value / 1000) + "K";
            }
            btn.getComponentInChildren(cc.Label).string = strValue;
            btn.node.on("click", () => {
                if (this.betingDoor === BetDoor.None) return;
                let lblBet = this.betingDoor === BetDoor.Tai ? this.lblBetTai : this.lblBetXiu;
                let number = Utils.stringToInt(lblBet.string) + value;
                if (number > this.maxBetValue) number = this.maxBetValue;
                lblBet.string = Utils.formatNumber(number);
            });
        }
        for (let i = 0; i < this.buttonsBet2.length; i++) {
            let btn = this.buttonsBet2[i];
            let value = btn.getComponentInChildren(cc.Label).string;
            btn.node.on("click", () => {
                if (this.betingDoor === BetDoor.None) return;
                let lblBet = this.betingDoor === BetDoor.Tai ? this.lblBetTai : this.lblBetXiu;
                let number = Utils.stringToInt(lblBet.string + value);
                if (number > this.maxBetValue) number = this.maxBetValue;
                lblBet.string = Utils.formatNumber(number);
            });
        }

        this.bowl.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            var pos = this.bowl.position;
            pos.x += event.getDeltaX();
            pos.y += event.getDeltaY();
            this.bowl.position = pos;

            let distance = Utils.v2Distance(new cc.Vec2(pos.x,pos.y), this.bowlStartPos);
            // cc.log(distance);
            if (Math.abs(distance) > 100) {
                this.bowl.active = false;
                this.isOpenBowl = true;
                this.showResult();
                this.showWinCash();
            }
        }, this);
    }

    show() {
        this.layoutBet.active = false;
        this.lblToast.node.parent.active = false;
        this.lblWinCash.node.active = false;
        this.layoutBet.active = false;
        this.diceAnim.active = false;
        this.bowl.active = false;
        this.dice1.node.active = false;
        this.dice2.node.active = false;
        this.dice3.node.active = false;
        TX2NetworkClient.getInstance().send(new cmd.SendScribe());
        this.showChat();
    }

    showChat() {
        this.panelChat = this.nodePanelChat.getComponent(PanelChat);
        this.panelChat.show(true);
    }

    dismiss() {
        for (let i = 0; i < this.popups.length; i++) {
            this.popups[i].active = false;
        }
        if(this.panelChat != null) this.panelChat.show(false);
        TX2NetworkClient.getInstance().send(new cmd.SendUnScribe());
    }

    actClose() {
        TaiXiuDoubleController.instance.dismiss();
    }

    actChat() {
        this.panelChat.show(!this.panelChat.node.active);
    }

    actBetTai() {
        if (!this.isBetting) {
            this.showToast("Chưa đến thời gian đặt cược.");
            return;
        }
        if (this.betingValue >= 0) {
            this.showToast("Bạn thao tác quá nhanh.");
            return;
        }
        if (this.betedXiu > 0) {
            this.showToast("Bạn không thể đặt 2 cửa.");
            return;
        }
        this.betingDoor = BetDoor.Tai;
        this.lblBetTai.string = "0";
        this.lblBetXiu.string = "ĐẶT";
        this.layoutBet.active = true;
        this.layoutBet1.active = true;
        this.layoutBet2.active = false;
    }

    actBetXiu() {
        if (!this.isBetting) {
            this.showToast("Chưa đến thời gian đặt cược.");
            return;
        }
        if (this.betingValue >= 0) {
            this.showToast("Bạn thao tác quá nhanh.");
            return;
        }
        if (this.betedTai > 0) {
            this.showToast("Bạn không thể đặt 2 cửa.");
            return;
        }
        this.betingDoor = BetDoor.Xiu;
        this.lblBetXiu.string = "0";
        this.lblBetTai.string = "ĐẶT";
        this.layoutBet.active = true;
        this.layoutBet1.active = true;
        this.layoutBet2.active = false;
    }

    actOtherNumber() {
        this.layoutBet1.active = false;
        this.layoutBet2.active = true;
    }

    actAgree() {
        if (this.betingValue >= 0 || !this.canBet) {
            this.showToast("Bạn thao tác quá nhanh.");
            return;
        }
        if (this.betingDoor === BetDoor.None) return;
        var lblBet = this.betingDoor === BetDoor.Tai ? this.lblBetTai : this.lblBetXiu;
        this.betingValue = Utils.stringToInt(lblBet.string);
        this.betingDoor = this.betingDoor;
        TX2NetworkClient.getInstance().send(new cmd.SendBet(this.referenceId, this.betingValue, this.betingDoor == BetDoor.Tai ? 1 : 0, this.remainTime));
        lblBet.string = "0";

        this.canBet = false;
        this.scheduleOnce(function () {
            this.canBet = true;
        }, 1);
    }

    actCancel() {
        this.lblBetXiu.string = "ĐẶT";
        this.lblBetTai.string = "ĐẶT";
        this.betingDoor = BetDoor.None;
        this.layoutBet.active = false;
    }

    actBtnGapDoi() {
        //  cc.log("actBtnGapDoi:"+Configs.Login.Coin+":"+this.betingDoor);
        if (this.betingDoor === BetDoor.None) return;
        let lblBet = this.betingDoor === BetDoor.Tai ? this.lblBetTai : this.lblBetXiu;
       
        let number = Utils.stringToInt(lblBet.string) + Configs.Login.Coin;
        if (number > this.maxBetValue) number = this.maxBetValue;
        lblBet.string = Utils.formatNumber(number);

    }

    actBtnDelete() {
        if (this.betingDoor === BetDoor.None) return;
        var lblBet = this.betingDoor === BetDoor.Tai ? this.lblBetTai : this.lblBetXiu;
        var number = "" + Utils.stringToInt(lblBet.string);
        number = number.substring(0, number.length - 1);
        number = Utils.formatNumber(Utils.stringToInt(number));
        lblBet.string = number;
    }

    actBtn000() {
        if (this.betingDoor === BetDoor.None) return;
        var lblBet = this.betingDoor === BetDoor.Tai ? this.lblBetTai : this.lblBetXiu;
        var number = Utils.stringToInt(lblBet.string + "000");
        if (number > this.maxBetValue) number = this.maxBetValue;
        lblBet.string = Utils.formatNumber(number);
    }

    actNan() {
        this.isNan = !this.isNan;
        this.btnNan.getComponent(cc.Sprite).spriteFrame = this.isNan ? this.sprFrameBtnNan2 : this.sprFrameBtnNan;
    }

    private showResult() {
        this.lblScore.node.parent.active = true;
        this.lblScore.string = "" + this.lastScore;
        if (this.lastScore >= 11) {
            this.tai.runAction(cc.repeatForever(cc.spawn(
                cc.sequence(cc.scaleTo(0.3, 1.3), cc.scaleTo(0.3, 1)),
                cc.sequence(cc.tintTo(0.3, 255, 255, 0), cc.tintTo(0.3, 255, 255, 255))
            )));
        } else {
            this.xiu.runAction(cc.repeatForever(cc.spawn(
                cc.sequence(cc.scaleTo(0.3, 1.3), cc.scaleTo(0.3, 1)),
                cc.sequence(cc.tintTo(0.3, 255, 255, 0), cc.tintTo(0.3, 255, 255, 255))
            )));
        }
        this.updateBtnHistories();
    }

    private stopWin() {
        this.tai.stopAllActions();
        this.tai.runAction(cc.spawn(cc.scaleTo(0.3, 1), cc.tintTo(0.3, 255, 255, 255)));

        this.xiu.stopAllActions();
        this.xiu.runAction(cc.spawn(cc.scaleTo(0.3, 1), cc.tintTo(0.3, 255, 255, 255)));
    }

    private showToast(message: string) {
        this.lblToast.string = message;
        let parent = this.lblToast.node.parent;
        parent.stopAllActions();
        parent.active = true;
        parent.opacity = 0;
        parent.runAction(cc.sequence(cc.fadeIn(0.1), cc.delayTime(2), cc.fadeOut(0.2), cc.callFunc(() => {
            parent.active = false;
        })));
    }

    private showWinCash() {
        if (this.lastWinCash <= 0) return;
        this.lblWinCash.node.stopAllActions();
        this.lblWinCash.node.active = true;
        this.lblWinCash.node.scale = 0;
        this.lblWinCash.node.setPosition(cc.Vec2.ZERO);
        Tween.numberTo(this.lblWinCash, this.lastWinCash, 0.5, (n) => { return "+" + n });
        this.lblWinCash.node.runAction(cc.sequence(
            cc.scaleTo(0.5, 1),
            cc.delayTime(2),
            cc.moveBy(1, cc.v2(0, 60)),
            cc.callFunc(() => {
                this.lblWinCash.node.active = false;
            })
        ));
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
    }

    updateBtnHistories() {
        let histories = this.histories.slice();
        if (histories.length > this.btnHistories.childrenCount) {
            histories.splice(0, histories.length - this.btnHistories.childrenCount);
        }
        let idx = histories.length - 1;
        for (var i = this.btnHistories.childrenCount - 1; i >= 0; i--) {
            if (idx >= 0) {
                let _idx = idx;
                var score = histories[idx]["dices"][0] + histories[idx]["dices"][1] + histories[idx]["dices"][2];
                this.btnHistories.children[i].getComponent(cc.Sprite).spriteFrame = score >= 11 ? this.sprFrameTai : this.sprFrameXiu;
                this.btnHistories.children[i].off("click");
                this.btnHistories.children[i].on("click", (e, b) => {
                    this.popupDetailHistory.showDetail(histories[_idx]["session"]);
                    //  cc.log(this.histories[_idx]);
                });
                this.btnHistories.children[i].active = true;
            } else {
                this.btnHistories.children[i].active = false;
            }
            idx--;
        }
    }

    sendChat(message: string) {
        let _this = this;
        if (!_this.isCanChat) {
            this.showToast("Bạn thao tác quá nhanh.");
            return;
        }
        _this.isCanChat = false;
        this.scheduleOnce(function () {
            _this.isCanChat = true;
        }, 1);
        var req = new cmd.SendChat(unescape(encodeURIComponent(message)));
        TX2NetworkClient.getInstance().send(req);
    }
}