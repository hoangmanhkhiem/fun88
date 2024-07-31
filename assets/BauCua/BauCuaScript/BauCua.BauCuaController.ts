import Configs from "../../Loading/src/Configs";
import MiniGame from "../../Lobby/LobbyScript/MiniGame";
import App from "../../Lobby/LobbyScript/Script/common/App";
import BroadcastReceiver from "../../Lobby/LobbyScript/Script/common/BroadcastReceiver";
import ScrollViewControl from "../../Lobby/LobbyScript/Script/common/ScrollViewControl";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import MiniGameNetworkClient from "../../Lobby/LobbyScript/Script/networks/MiniGameNetworkClient";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import ButtonPayBet from "./BauCua.ButtonPayBet";
import cmd from "./BauCua.Cmd";
import PopupHistory from "./BauCua.PopupHistory";
import PopupHonors from "./BauCua.PopupHonors";

var TW = cc.tween;
const { ccclass, property } = cc._decorator;

@ccclass("BauCua.ButtonBet")
export class ButtonBet {
    @property(cc.Button)
    button: cc.Button = null;
    @property(cc.SpriteFrame)
    sfNormal: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sfActive: cc.SpriteFrame = null;

    @property(sp.Skeleton)
    border_chip: sp.Skeleton = null;
    _isActive = false;

    setActive(isActive: boolean) {
        this._isActive = isActive;
        // this.button.getComponent(cc.Sprite).spriteFrame = isActive ? this.sfActive : this.sfNormal;
        this.button.interactable = !isActive;

        // this.button.getComponentInChildren(cc.Sprite).node.active = isActive;
        if (isActive)
            this.border_chip.node.x = this.button.node.x;
    }
}

@ccclass
export default class BauCuaController extends MiniGame {

    static instance: BauCuaController = null;
    static lastBeted = null;

    @property([cc.SpriteFrame])
    public sprSmallDices: cc.SpriteFrame[] = [];
    @property([cc.ScrollView])
    public scrollChip: cc.ScrollView[] = [];
    @property([cc.SpriteFrame])
    public sprResultDices: cc.SpriteFrame[] = [];
    @property(cc.Label)
    public lblSession: cc.Label = null;
    @property(cc.Label)
    public lblTime: cc.Label = null;
    @property(cc.Label)
    public lblToast: cc.Label = null;
    @property(cc.Label)
    public lblWinCoin: cc.Label = null;
    @property([ButtonBet])
    public buttonBets: ButtonBet[] = [];
    @property([ButtonPayBet])
    public btnPayBets: ButtonPayBet[] = [];
    @property(cc.Node)
    public nodeSoiCau: cc.Node = null;
    @property(cc.Node)
    public nodeHistories: cc.Node = null;
    @property(cc.Node)
    public itemHistoryTemplate: cc.Node = null;
    @property(cc.Button)
    public btnConfirm: cc.Button = null;
    @property(cc.Button)
    public btnCancel: cc.Button = null;
    @property(cc.Button)
    public btnReBet: cc.Button = null;
    @property([cc.Label])
    public lblsSoiCau: cc.Label[] = [];
    @property([cc.Node])
    public popups: cc.Node[] = [];
    @property(cc.Node)
    public popupContainer: cc.Node = null;

    @property(ScrollViewControl)
    public scrHistory: ScrollViewControl = null;

    @property(cc.Node)
    public bowl: cc.Node = null;


    private readonly listBet = [1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000];
    private roomId = 0;
    private betIdx = 0;
    private isBetting = false;
    private historiesData = [];
    private beted = [0, 0, 0, 0, 0, 0];
    private betting = [0, 0, 0, 0, 0, 0];
    private inited = false;
    private sprResultDice: cc.Node = null;
    private percentScroll = 0;
    private timeBet;
    private popupHonor: PopupHonors = null;
    private popupHistory: PopupHistory = null;
    private popupGuide = null;
    public baucuaBundle = null;
    onLoad() {
        super.onLoad();
        this.sprResultDice = this.bowl.getChildByName("sprResult");
    }
    start() {
        this.timeBet = Date.now();
        BauCuaController.instance = this;
        this.percentScroll = 0;
        this.scrollChip.scrollToPercentHorizontal(this.percentScroll, 0.1);
        this.itemHistoryTemplate.active = false;

        for (let i = 0; i < this.buttonBets.length; i++) {
            var btn = this.buttonBets[i];
            // btn.setActive(i == this.betIdx);
            btn.button.node.on("click", () => {
                this.betIdx = i;
                App.instance.showBgMiniGame("BauCua");
                for (let j = 0; j < this.buttonBets.length; j++) {
                    //  cc.log("this:" + this.betIdx + ":" + j);
                    this.buttonBets[j].setActive(j == this.betIdx);
                }
            });
        }

        for (let i = 0; i < this.btnPayBets.length; i++) {
            this.btnPayBets[i].node.on("click", () => {
                App.instance.showBgMiniGame("BauCua");
                this.actConfirm(i);
            });
        }

        BroadcastReceiver.register(BroadcastReceiver.USER_LOGOUT, () => {
            if (!this.node.active) return;
            this.dismiss();
        }, this);

        MiniGameNetworkClient.getInstance().addOnClose(() => {
            if (!this.node.active) return;
            this.dismiss();
        }, this);

        MiniGameNetworkClient.getInstance().addListener((data) => {
            if (!this.node.active) return;
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.INFO: {
                    this.inited = true;

                    let res = new cmd.ReceiveInfo(data);
                    this.isBetting = res.bettingState;
                    this.lblSession.string = "#" + res.referenceId;
                    this.lblTime.string = this.longToTime(res.remainTime);


                    let totalBets = res.potData.split(",");
                    let beted = res.betData.split(",");
                    for (let i = 0; i < this.btnPayBets.length; i++) {
                        let btnPayBet = this.btnPayBets[i];
                        btnPayBet.lblTotal.string = this.moneyToK(parseInt(totalBets[i]));
                        btnPayBet.lblBeted.string = this.moneyToK(parseInt(beted[i]));
                        btnPayBet.overlay.active = true;
                        btnPayBet.button.interactable = this.isBetting;
                        btnPayBet.lblFactor.node.active = false;
                        this.beted[i] = parseInt(beted[i]);
                    }

                    if (!this.isBetting) {
                        this.btnPayBets[res.dice1].overlay.active = false;
                        this.btnPayBets[res.dice2].overlay.active = false;
                        this.btnPayBets[res.dice3].overlay.active = false;

                        if (res.xValue > 1) {
                            this.btnPayBets[res.xPot].lblFactor.node.active = true;
                            this.btnPayBets[res.xPot].lblFactor.string = "x" + res.xValue;
                        }
                    }

                    if (res.lichSuPhien != "") {
                        let histories = res.lichSuPhien.split(",");
                        for (let i = 0; i < histories.length; i++) {
                            this.historiesData.push([parseInt(histories[i]), parseInt(histories[++i]), parseInt(histories[++i])])
                            ++i;
                            ++i;
                        }
                        this.loadHistory(this.historiesData);
                        this.caculatorSoiCau();
                    }
                    break;
                }
                case cmd.Code.START_NEW_GAME: {
                    let res = new cmd.ReceiveNewGame(data);
                    this.actStartNewGame();
                    //  cc.log("BAU CUA START_NEW_GAME:");
                    this.lblSession.string = "#" + res.referenceId;
                    for (let i = 0; i < this.btnPayBets.length; i++) {
                        let btnPayBet = this.btnPayBets[i];
                        btnPayBet.lblBeted.string = "0";
                        btnPayBet.lblBeted.node.color = cc.Color.WHITE;
                        btnPayBet.lblTotal.string = "0";
                        btnPayBet.overlay.active = false;
                        btnPayBet.button.interactable = true;
                        btnPayBet.lblFactor.node.active = false;
                    }
                    this.beted = [0, 0, 0, 0, 0, 0];
                    this.betting = [0, 0, 0, 0, 0, 0];
                    this.btnConfirm.interactable = true;
                    this.btnCancel.interactable = true;
                    this.btnReBet.interactable = true;
                    break;
                }
                case cmd.Code.UPDATE: {
                    let res = new cmd.ReceiveUpdate(data);
                    this.lblTime.string = this.longToTime(res.remainTime);

                    this.isBetting = res.bettingState == 1;
                    let totalBets = res.potData.split(",");
                    for (let i = 0; i < this.btnPayBets.length; i++) {
                        let btnPayBet = this.btnPayBets[i];
                        btnPayBet.lblTotal.string = this.moneyToK(parseInt(totalBets[i]));
                        if (this.isBetting) {
                            btnPayBet.overlay.active = false;
                            btnPayBet.lblFactor.node.active = false;
                        } else {
                            btnPayBet.button.interactable = false;
                            btnPayBet.lblBeted.string = this.moneyToK(this.beted[i]);
                            btnPayBet.lblBeted.node.color = cc.Color.WHITE;
                        }
                    }
                    break;
                }
                case cmd.Code.RESULT: {
                    let res = new cmd.ReceiveResult(data);
                    //  cc.log("BAU CUA RESULT:", res);
                    this.atcShowResult(res);
                    break;
                }
                case cmd.Code.PRIZE: {
                    let res = new cmd.ReceivePrize(data);
                    //  cc.log("BAU CUA PRIZE:");
                    //show win coin
                    Configs.Login.Coin = res.currentMoney;
                    BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                    this.lblWinCoin.node.stopAllActions();
                    this.lblWinCoin.node.setPosition(-26, -16);
                    this.lblWinCoin.node.opacity = 0;
                    this.lblWinCoin.string = "+" + Utils.formatNumber(res.prize);
                    this.lblWinCoin.node.active = true;
                    this.lblWinCoin.node.runAction(cc.sequence(
                        cc.spawn(cc.fadeIn(0.2), cc.moveBy(2, cc.v2(0, 100))),
                        cc.fadeOut(0.15),
                        cc.callFunc(() => {
                            this.lblWinCoin.node.active = false;
                        })
                    ));
                    break;
                }
                case cmd.Code.BET: {
                    let res = new cmd.ReceiveBet(data);
                    //  cc.log("============BAU CUA BET===============" + res.result);
                    switch (res.result) {
                        case 100:
                            this.showToast(App.instance.getTextLang('txt_bet_error2'));
                            break;
                        case 101:
                            this.showToast(App.instance.getTextLang('txt_bet_error3'));
                            break;
                        case 102:
                            this.showToast(App.instance.getTextLang('txt_not_enough'));
                            break;
                        case 103:
                            this.showToast("Chỉ được cược tối đa 1000.000.");
                            this.btnConfirm.interactable = true;
                            this.btnCancel.interactable = true;
                            this.btnReBet.interactable = true;
                            break;
                    }
                    if (res.result != 1) {
                        break;
                    }
                    Configs.Login.Coin = res.currentMoney;
                    BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                    for (let i = 0; i < this.btnPayBets.length; i++) {
                        this.beted[i] += this.betting[i];
                        this.betting[i] = 0;

                        let btnPayBet = this.btnPayBets[i];
                        btnPayBet.lblBeted.string = this.moneyToK(this.beted[i]);
                        btnPayBet.lblBeted.node.color = cc.Color.WHITE;
                    }
                    BauCuaController.lastBeted = this.beted;
                    this.showToast(App.instance.getTextLang('txt_bet_success'));
                    this.btnConfirm.interactable = true;
                    this.btnCancel.interactable = true;
                    this.btnReBet.interactable = true;
                    break;
                }
            }
        }, this);
    }

    onBtnScrollLeft() {
        this.percentScroll -= 0.3;
        if (this.percentScroll <= 0) this.percentScroll = 0;

        this.scrollChip.scrollToPercentHorizontal(this.percentScroll, 0.1);
    }

    onBtnScrollRight() {
        this.percentScroll += 0.3;
        if (this.percentScroll >= 1) this.percentScroll = 1;
        this.scrollChip.scrollToPercentHorizontal(this.percentScroll, 0.1);
    }

    private spin(arrDice) {
        for (let i = 0; i < this.btnPayBets.length; i++) {
            let btnPayBet = this.btnPayBets[i];
            btnPayBet.overlay.active = false;
        }
        for (let i = 0; i < arrDice.length; i++) {
            let btnPayBet = this.btnPayBets[arrDice[i]];
            btnPayBet.overlay.active = true;
            TW(btnPayBet.overlay).then(cc.blink(2.0, 10)).start();
        }

    }

    private longToTime(time: number): string {
        let m = parseInt((time / 60).toString());
        let s = time % 60;
        // return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
        return (s < 10 ? "0" : "") + s;
    }

    private moneyToK(money: number): string {
        if (money < 100000) {
            return Utils.formatNumber(money);
        }
        // money = parseInt((money / 1000).toString());
        return Utils.formatMoney(money);
    }

    private addHistory(dices: Array<number>) {
        // if (this.itemHistoryTemplate.parent.childrenCount > 50) {
        //     this.itemHistoryTemplate.parent.children[1].removeFromParent();
        //     this.historiesData.splice(0, 1);
        // }
        this.historiesData.push(dices);
        // let item = cc.instantiate(this.itemHistoryTemplate);
        // item.parent = this.itemHistoryTemplate.parent;
        // item.active = true;
        // item.getChildByName("dice1").getComponent(cc.Sprite).spriteFrame = this.sprSmallDices[dices[0]];
        // item.getChildByName("dice2").getComponent(cc.Sprite).spriteFrame = this.sprSmallDices[dices[1]];
        // item.getChildByName("dice3").getComponent(cc.Sprite).spriteFrame = this.sprSmallDices[dices[2]];
    }
    private loadHistory(historyData) {
        let listData = historyData.slice();
        listData.reverse();
        let updateCb = (item, dices) => {
            item.active = true;
            item.getChildByName("dice1").getComponent(cc.Sprite).spriteFrame = this.sprSmallDices[dices[0]];
            item.getChildByName("dice2").getComponent(cc.Sprite).spriteFrame = this.sprSmallDices[dices[1]];
            item.getChildByName("dice3").getComponent(cc.Sprite).spriteFrame = this.sprSmallDices[dices[2]];
        }
        this.scrHistory.setDataList(updateCb, listData);
    }
    private caculatorSoiCau() {
        let counts = [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < this.historiesData.length; i++) {
            let dices = this.historiesData[i];
            for (let j = 0; j < 3; j++) {
                counts[dices[j]]++;
            }
        }
        for (let i = 0; i < this.lblsSoiCau.length; i++) {
            this.lblsSoiCau[i].string = counts[i].toString();
        }
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

    actSoiCau() {
        this.nodeHistories.active = !this.nodeHistories.active;
        this.nodeSoiCau.active = !this.nodeHistories.active;
    }

    actCancel() {
        if (!this.inited) return;
        for (let i = 0; i < this.btnPayBets.length; i++) {
            let btnPayBet = this.btnPayBets[i];
            btnPayBet.lblBeted.node.color = cc.Color.WHITE;
            btnPayBet.lblBeted.string = this.moneyToK(this.beted[i]);
            this.betting[i] = 0;
        }
    }

    actConfirm(index) {
        if (!this.inited) return;
        if (!this.isBetting) {
            this.showToast(App.instance.getTextLang('txt_bet_error3'));
            return;
        }
        if (Configs.Login.Coin < this.listBet[this.betIdx]) {
            this.showToast(App.instance.getTextLang('txt_not_enough'));
            return;
        }
        if (Date.now() - this.timeBet < 1000) {
            this.showToast(App.instance.getTextLang('txt_notify_fast_action'));
            return;
        }

        this.betting[index] += this.listBet[this.betIdx];
        let total = 0;
        for (let i = 0; i < this.betting.length; i++) {
            total += this.betting[i];
        }
        if (total <= 0) {
            this.showToast(App.instance.getTextLang('txt_bet_error4'));
            return;
        }
        this.btnPayBets[index].lblBeted.string = this.moneyToK(this.betting[index] + this.beted[index]);

        this.timeBet = Date.now();
        MiniGameNetworkClient.getInstance().send(new cmd.SendBet(this.betting.toString()));
        this.btnConfirm.interactable = false;
        this.btnCancel.interactable = false;
        this.btnReBet.interactable = false;
    }



    actReBet() {
        if (!this.inited) return;
        if (!this.isBetting) {
            this.showToast(App.instance.getTextLang('txt_bet_error3'));
            return;
        }
        if (BauCuaController.lastBeted == null) {
            this.showToast(App.instance.getTextLang('txt_bet_error5'));
            return;
        }
        let totalBeted = 0;
        for (let i = 0; i < this.beted.length; i++) {
            totalBeted += this.beted[i];
        }
        if (totalBeted > 0) {
            this.showToast(App.instance.getTextLang('txt_bet_error6'));
            return;
        }
        this.betting = BauCuaController.lastBeted;
        MiniGameNetworkClient.getInstance().send(new cmd.SendBet(BauCuaController.lastBeted.toString()));
        this.btnConfirm.interactable = false;
        this.btnCancel.interactable = false;
        this.btnReBet.interactable = false;
    }

    show() {
        if (this.node.active) {
            this.reOrder();
            return;
        }
        super.show();
        App.instance.showBgMiniGame("BauCua");
        this.inited = false;
        this.lblToast.node.parent.active = false;
        this.lblWinCoin.node.active = false;
        this.betIdx = 0;
        this.betting = [0, 0, 0, 0, 0, 0];
        this.beted = [0, 0, 0, 0, 0, 0];
        this.historiesData = [];

        this.nodeHistories.active = true;
        this.nodeSoiCau.active = !this.nodeHistories.active;
        this.nodeHistories.getComponent(cc.ScrollView).scrollToTop(0);

        for (let i = 0; i < this.buttonBets.length; i++) {
            this.buttonBets[i].setActive(i == this.betIdx);
        }
        for (let i = 0; i < this.btnPayBets.length; i++) {
            let btnPayBet = this.btnPayBets[i];
            btnPayBet.lblBeted.string = "0";
            btnPayBet.lblBeted.node.color = cc.Color.WHITE;
            btnPayBet.lblTotal.string = "0";
            btnPayBet.lblFactor.node.active = false;
            btnPayBet.overlay.active = true;
            btnPayBet.button.interactable = false;
        }

        MiniGameNetworkClient.getInstance().send(new cmd.SendScribe(this.roomId));
    }

    dismiss() {
        super.dismiss();
        for (let i = 0; i < this.popups.length; i++) {
            this.popups[i].active = false;
        }

        App.instance.hideGameMini("BauCua");
        // for (let i = 1; i < this.itemHistoryTemplate.parent.childrenCount; i++) {
        //     this.itemHistoryTemplate.parent.children[i].destroy();
        // }
        MiniGameNetworkClient.getInstance().send(new cmd.SendUnScribe(this.roomId));
    }
    _onShowed() {
        super._onShowed;

    }

    public reOrder() {
        super.reOrder();
    }

    atcShowResult(res) {
        this.sprResultDice.children[0].getComponent(cc.Sprite).spriteFrame = this.sprResultDices[res.dice1];
        this.sprResultDice.children[1].getComponent(cc.Sprite).spriteFrame = this.sprResultDices[res.dice2];
        this.sprResultDice.children[2].getComponent(cc.Sprite).spriteFrame = this.sprResultDices[res.dice3];
        let bowlOn = this.bowl.getChildByName("bowl");
        cc.Tween.stopAllByTarget(bowlOn);
        TW(bowlOn).to(0.7, { y: bowlOn.y + 50, opacity: 150, scale: 1.1 }, { easing: cc.easing.sineIn })
            .call(() => {
                this.historiesData.push([res.dice1, res.dice2, res.dice3]);
                this.loadHistory(this.historiesData);
                this.caculatorSoiCau();
                if (res.xValue > 1) {
                    this.btnPayBets[res.xPot].lblFactor.node.active = true;
                    this.btnPayBets[res.xPot].lblFactor.string = "x" + res.xValue;
                }
                this.spin([res.dice1, res.dice2, res.dice3]);
                bowlOn.active = false;
            }).start();
    }
    actStartNewGame() {

        let bowlOn = this.bowl.getChildByName("bowl");
        bowlOn.active = true;
        TW(bowlOn).set({ opacity: 255, y: 0, scale: 1 }).start();
        let initPos = this.bowl.getPosition();
        let acShake = TW().to(0.1, { x: initPos.x - 20, scale: 1.1 }).to(0.1, { x: initPos.x }).to(0.1, { x: initPos.x + 20 }).to(0.1, { x: initPos.x, scale: 1.0 });
        cc.Tween.stopAllByTarget(this.bowl);
        TW(this.bowl).repeat(5, acShake).call(() => {
            this.showToast(App.instance.getTextLang('txt_bet_invite'));
        }).start();
    }
    actPopupHonors() {
        App.instance.showBgMiniGame("BauCua");
        if (this.popupHonor == null) {
            this.baucuaBundle.load("res/Prefabs/PopupHonors", cc.Prefab, function (finish, total, item) {

            }, (err1, prefab) => {
                this.popupHonor = cc.instantiate(prefab).getComponent("BauCua.PopupHonors");
                this.popupHonor.node.parent = this.popupContainer;
                this.popupHonor.node.active = true;
                this.popupHonor.show();
                this.popups.push(this.popupHonor.node);
            })
        } else {
            this.popupHonor.show();
        }
    }
    actPopupHistory() {
        App.instance.showBgMiniGame("BauCua");
        if (this.popupHistory == null) {
            this.baucuaBundle.load("res/Prefabs/PopupHistory", cc.Prefab, function (finish, total, item) {

            }, (err1, prefab) => {
                this.popupHistory = cc.instantiate(prefab).getComponent("BauCua.PopupHistory");
                this.popupHistory.node.parent = this.popupContainer;
                this.popupHistory.node.active = true;
                this.popupHistory.show();
                this.popups.push(this.popupHistory.node);
            })
        } else {
            this.popupHistory.show();
        }
    }
    actPopupGuide() {
        App.instance.showBgMiniGame("BauCua");
        if (this.popupGuide == null) {
            this.baucuaBundle.load("res/Prefabs/PopupGuide", cc.Prefab, function (finish, total, item) {

            }, (err1, prefab) => {
                this.popupGuide = cc.instantiate(prefab).getComponent("Dialog");
                this.popupGuide.node.parent = this.popupContainer;
                this.popupGuide.node.active = true;
                this.popupGuide.show();
                this.popups.push(this.popupGuide.node);
            })
        } else {
            this.popupGuide.show();
        }
    }
}
