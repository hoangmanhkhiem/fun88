import Configs from "../../Loading/src/Configs";
import { Global } from "../../Loading/src/Global";
import MiniGame from "../../Lobby/LobbyScript/MiniGame";
import App from "../../Lobby/LobbyScript/Script/common/App";
import BroadcastReceiver from "../../Lobby/LobbyScript/Script/common/BroadcastReceiver";
import Tween from "../../Lobby/LobbyScript/Script/common/Tween";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import TaiXiuSTNetworkClient from "../../Lobby/LobbyScript/Script/networks/TaiXiuSieuToc.NetworkClient";
import cmd from "./TaiXiuSieuToc.Cmd";
import PopupDetailHistory from "./TaiXiuST.PopupDetailHistory";
import TaiXiuSTPopupHistory from "./TaiXiuST.PopupHistory";
import TaiXiuSTPopupHonors from "./TaiXiuST.PopupHonors";
import TaiXiuSTPopupSoiCau from "./TaiXiuST.PopupSoiCau";
import BundleControl from "../../Loading/src/BundleControl";
const { ccclass, property } = cc._decorator;
var TW = cc.tween;
var STATE_GAME = {
    BET: 1,
    SHAKE: 2,
    RESULT: 3,
    PREPARE_RESULT: 4
}
var ANIM_STATE = {
    DRAGON_NORMAL: "animation_dragon_only",
    DRAGON_X2SPEED: "animation_dragon_only_x2speed",
    TABLE_NODRAGON: "animation_table_nodragon",
    TABLE_DRAGON: "animation_table_dragon",
}
@ccclass
export default class TaiXiuSieuTocController extends MiniGame {


    static instance: TaiXiuSieuTocController = null;
    @property(cc.Node)
    scrollChat: cc.Node = null;
    @property(cc.Node)
    chatNhanh: cc.Node = null;
    @property(cc.Node)
    contentChatNhanh: cc.Node = null;

    @property(cc.Label)
    lbTotalTai: cc.Label = null;

    @property(cc.Label)
    lbTotalXiu: cc.Label = null;

    @property(cc.Label)
    lbTotalBetTai: cc.Label = null;

    @property(cc.Label)
    lbTotalBetXiu: cc.Label = null;

    @property(cc.Label)
    lbBetXiu: cc.Label = null;

    @property(cc.Label)
    lbBetTai: cc.Label = null;

    @property(cc.Label)
    lbTimeCountDown: cc.Label = null;

    @property(cc.Label)
    lbSession: cc.Label = null;

    @property(cc.Label)
    lbTotalUserTai: cc.Label = null;

    @property(cc.Label)
    lbTotalUserXiu: cc.Label = null;

    @property(cc.Label)
    lbWin: cc.Label = null;

    @property(cc.Label)
    lbScore: cc.Label = null;

    @property([cc.Font])
    listFont: cc.Font[] = [];

    @property(cc.Node)
    nodeBtnBet: cc.Node = null;

    @property(cc.Node)
    nodeChat: cc.Node = null;

    @property(cc.Node)
    nodeTxtTai: cc.Node = null;

    @property(cc.Node)
    nodeTxtXiu: cc.Node = null;

    @property(cc.Node)
    sprBtnBetXiu: cc.Node = null;

    @property(cc.Node)
    sprBtnBetTai: cc.Node = null;

    @property(cc.Node)
    bgGame: cc.Node = null;

    @property(cc.Node)
    alertToast: cc.Node = null;

    @property(cc.Node)
    nodeHistoryShort: cc.Node = null;

    @property(cc.Node)
    popupContainer: cc.Node = null;

    @property(cc.Node)
    bg_Score: cc.Node = null;

    @property(cc.Node)
    bgLight: cc.Node = null;

    @property(cc.Node)
    nodeBat: cc.Node = null;

    @property(cc.Node)
    bgLighting: cc.Node = null;

    @property(cc.Node)
    bgTime: cc.Node = null;

    @property(cc.EditBox)
    edbChat: cc.EditBox = null;

    @property(cc.ScrollView)
    scrChat: cc.ScrollView = null;

    @property(sp.Skeleton)
    dice1: sp.Skeleton = null;
    @property(sp.Skeleton)
    dice2: sp.Skeleton = null;
    @property(sp.Skeleton)
    dice3: sp.Skeleton = null;
    @property(sp.Skeleton)
    dragon: sp.Skeleton = null;
    @property(sp.Skeleton)
    table: sp.Skeleton = null;

    @property([cc.SpriteFrame])
    sprDots: cc.SpriteFrame[] = [];


    timeInBg = 0;
    currentGate = -1;
    totalBet = 0;
    currentBet = 0;
    result = [];
    totalResult = 0;
    session = 0;
    stateGame = 0;
    isConnected = false;
    listChatHistory = [];
    listTimer = [];
    historySession = [];
    historySoiCau = [];
    historyShort = [];
    popups = [];
    gameSubscribeId = "";
    currentBtnBet = null;
    timeConfirmBet = 1;
    lastBetAmount = 0;
    private popupHonor: TaiXiuSTPopupHonors = null;
    private popupHistory: TaiXiuSTPopupHistory = null;
    private popupGuide = null;
    private popupSoiCau: TaiXiuSTPopupSoiCau = null;
    private popupDetailSession: PopupDetailHistory = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        super.onLoad();
        // this.bgGame.on(cc.Node.EventType.TOUCH_MOVE, (touch) => {
        //     this.node.position = this.node.position.add(touch.getDelta());
        // })
        this.nodeChat.x = cc.winSize.width;
        this.nodeChat.active = false;

        TaiXiuSieuTocController.instance = this;
        TaiXiuSTNetworkClient.TaiXiuSieuTocController = this;
        TW(this.bgLighting).repeatForever(TW().sequence(TW().to(0.5, { opacity: 0 }), TW().to(0.5, { opacity: 255 }))).start();
        this.nodeBtnBet.active = false;

        var self = this;
        for(var i=0;i<this.contentChatNhanh.childrenCount;i++){
            let node = this.contentChatNhanh.children[i];
            node.on('click',function(){
                self.onClickSendChatNhanh(node.children[0].getComponent(cc.Label).string);
                self.scrollChat.active = true;
                self.chatNhanh.active = false;
            })
        }

    }

    toggleChatNhanh(){
        if(this.chatNhanh.active == false){
            this.chatNhanh.active = true;
            this.scrollChat.active = false;
        }
        else{
            this.chatNhanh.active = false;
            this.scrollChat.active = true;
        }
    }


    onEnable() {
        this.resetView();
        this.stateGame = 0;
        if (this.isConnected) {
            TaiXiuSTNetworkClient.getInstance().getChatHistory();
        }
    }
    start() {
        this.setupTimeRunInBg();
        // this.loginGame();
        if (TaiXiuSTNetworkClient.getInstance().isConnected == false) {
            TaiXiuSTNetworkClient.getInstance().connect();
        }
        TaiXiuSTNetworkClient.getInstance().addListener((data: Object) => {
            if (this.node.active == false) {
                return;
            }
            if (this.isConnected == false) {
                this.isConnected = true;
                TaiXiuSTNetworkClient.getInstance().subscribe(cmd.API.USER);
                TaiXiuSTNetworkClient.getInstance().subscribe(cmd.API.DISCONNECT);
                setTimeout(() => {
                    TaiXiuSTNetworkClient.getInstance().getChatHistory();
                }, 500);
                TaiXiuSTNetworkClient.getInstance().getHistorySession();
            }
            let res = JSON.parse(data['body']);
          
            switch (res['cmd']) {
                case cmd.Code.CMD_50S: {//time cuoc,time nay chay tu 47->33
                    this.session = res.id;
                    if (this.lbTimeCountDown.node.active == false) {
                        this.lbTimeCountDown.node.active = true;
                        this.lbSession.string = "#" + this.session;
                        this.nodeBat.active = true;
                        this.nodeBat.y = 9;
                    }
                    let timeCd = res.cd;
                    let totalBetTai = res.at;
                    let totalBetXiu = res.ax;
                    this.result = [];
                    Tween.numberTo(this.lbTotalTai, totalBetTai, 0.3);
                    Tween.numberTo(this.lbTotalXiu, totalBetXiu, 0.3)
                    this.lbTimeCountDown.string = (timeCd - 33) >= 10 ? (timeCd - 33).toString() : "0" + (timeCd - 33);
                    this.lbTotalUserTai.string = res.ut;
                    this.lbTotalUserXiu.string = res.ux;
                    if (this.stateGame == 0 || this.stateGame == STATE_GAME.RESULT) {
                        //  cc.log("chay vao day!");
                        this.lbTimeCountDown.node.scale = 1.0;
                        this.lbTimeCountDown.node.setPosition(cc.v2(-2.7, 47));
                        if (timeCd - 33 <= 5) {
                            this.dragon.node.active = true;
                            this.dragon.setAnimation(0, ANIM_STATE.DRAGON_X2SPEED, true);
                            this.lbTimeCountDown.node.color = new cc.Color().fromHEX("#FF6A6A");
                        } else {
                            this.dragon.node.active = false;
                            this.table.setAnimation(0, ANIM_STATE.TABLE_DRAGON, true);
                            this.lbTimeCountDown.node.color = cc.Color.WHITE;
                        }
                    }
                    if (timeCd == 47) {
                        this.showToast(App.instance.getTextLang('txt_bet_invite'));
                    }
                    if (timeCd == 33) {
                        this.showToast(App.instance.getTextLang('txt_taixiu_finish'));
                    }
                    if (timeCd == 38) {
                        this.dragon.node.active = true;
                        this.dragon.setAnimation(0, ANIM_STATE.DRAGON_X2SPEED, true);
                        this.table.setAnimation(0, ANIM_STATE.TABLE_NODRAGON, true);
                    }
                    if (timeCd < 36) {
                        this.stateGame = STATE_GAME.PREPARE_RESULT;
                        if (this.lbTimeCountDown.node.scale != 1) {
                            cc.Tween.stopAllByTarget(this.lbTimeCountDown.node)
                            this.lbTimeCountDown.node.scale = 1.0;
                            this.lbTimeCountDown.node.setPosition(cc.v2(-2.745, 47));
                        }
                    } else {
                        this.stateGame = STATE_GAME.BET;
                    }
                    if (timeCd < 39) {
                        this.lbTimeCountDown.node.color = new cc.Color().fromHEX("#FF6A6A");
                    } else {
                        this.lbTimeCountDown.node.color = cc.Color.WHITE;
                    }
                    this.dice1.node.active = false;
                    this.dice2.node.active = false;
                    this.dice3.node.active = false;
                    break;
                }
                case cmd.Code.CMD_51S: { //time xem ket quả,tra ve 1 lan trong 1 phien
                    this.dragon.node.active = false;
                    this.table.setAnimation(0, ANIM_STATE.TABLE_NODRAGON, true);
                    this.session = res.id;
                    this.lbSession.string = "#" + this.session;
                    let timeCd = res.cd;
                    this.lbTimeCountDown.string = timeCd;
                    this.result = res.rs;
                    this.historyShort.unshift(res.rs);
                    this.historySoiCau.unshift({ session: this.session, dices: res.rs })
                    this.loadListHistoryShort();
                    this.totalResult = this.result[0] + this.result[1] + this.result[2];
                    this.showResultWin(true);
                    if (this.stateGame == STATE_GAME.BET || this.stateGame == 0) {
                        this.stateGame = STATE_GAME.RESULT;
                    }

                    this.bgTime.active = true;
                    cc.Tween.stopAllByTarget(this.lbTimeCountDown.node);
                    TW(this.lbTimeCountDown.node).to(0.5, { scale: 0.25, x: this.bgTime.x, y: this.bgTime.y + 8 }, { easing: cc.easing.sineIn }).start();
                    TW(this.lbTimeCountDown.node).tag(1);
                    break;
                }
                case cmd.Code.CMD_14S: { // (cd <=5-----time xem kq,cd<=23---time tung xuc xac)
                    this.session = res.id;
                    this.lbSession.string = "#" + this.session;
                    if (res.cd == 23) {
                        this.shakeDice();
                    }
                    this.result = res.rs;
                    this.totalResult = this.result[0] + this.result[1] + this.result[2];
                    if (res.cd <= 5) {
                        this.lbTimeCountDown.node.color = new cc.Color().fromHEX("#FF6A6A")
                        this.bgTime.active = true;
                        this.lbTimeCountDown.node.active = true;
                        this.lbTimeCountDown.node.scale = 0.25;
                        this.lbTimeCountDown.node.setPosition(cc.v2(this.bgTime.x, this.bgTime.y + 8));
                        this.lbTimeCountDown.string = "0" + res.cd;
                        this.stateGame = STATE_GAME.RESULT;
                        this.setDice();
                        this.dragon.node.active = false;
                        this.table.setAnimation(0, ANIM_STATE.TABLE_NODRAGON, true);
                        this.nodeBat.active = false;
                    }
                    if (res.cd == 0) {
                        this.resetView();
                    }
                    this.lbTotalUserTai.string = Utils.formatNumber(res.ut);
                    this.lbTotalUserXiu.string = Utils.formatNumber(res.ux);
                    this.lbTotalTai.string = Utils.formatNumber(res.at);
                    this.lbTotalXiu.string = Utils.formatNumber(res.ax);
                    break;
                }
                case cmd.Code.CMD_BET: {
                    //  cc.log("CMD_BET:");
                    if (res.data != null && res.status == 0) {
                        this.showToast(App.instance.getTextLang('txt_bet_success'));
                        this.lastBetAmount = res.data.betamount;
                        this.totalBet += res.data.betamount;
                        this.currentBet = 0;
                        if (this.currentGate == 1) {
                            Tween.numberTo(this.lbTotalBetTai, this.totalBet, 0.3);
                        } else {
                            Tween.numberTo(this.lbTotalBetXiu, this.totalBet, 0.3);
                        }
                        this.sprBtnBetTai.active = true;
                        this.sprBtnBetXiu.active = true;
                        this.lbBetTai.node.active = false;
                        this.lbBetXiu.node.active = false;
                        Configs.Login.Coin -= res.data.betamount;
                        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                    } else {
                        this.showToast(App.instance.getTextLang('txt_bet_error2'));
                    }

                    break;
                }
                case cmd.Code.CMD_CHAT_ALL: {
                    if (res.data.length > 0) {
                        this.listChatHistory = res.data;
                        if (this.listChatHistory.length > 15) {
                            this.listChatHistory.splice(0, 15);
                        }
                        this.initListChat();
                    }
                    break;
                }
                case cmd.Code.CMD_CHAT: {
                    this.listChatHistory.push(res);
                    if (this.listChatHistory.length > 15) {
                        this.listChatHistory.splice(0, 1);
                    }
                    this.addChat(res.u, res.m, this.listChatHistory.length - 1);
                    break;
                }
                case cmd.Code.CMD_HISTORY: {
                    //  cc.log("CMD_HISTORY:");
                    if (res.data.length > 0) {
                        this.historySession = res.data;
                        this.historySession.forEach((item) => {
                            if (item.result != null) {
                                this.historyShort.push(item.result);
                                let data: any = {};
                                data.session = item.id;
                                data.dices = JSON.parse(item.result);
                                this.historySoiCau.push(data);
                            } else {
                                //  cc.log("Null Result:", item);
                            }
                        });
                        this.loadListHistoryShort();
                    }
                    break;
                }
                case cmd.Code.CMD_TXRECORD_HISTORY: {
                    //  cc.log("CMD_TXRECORD_HISTORY:");
                    break;
                }
                case cmd.Code.CMD_REFUND_USER: {
                    //  cc.log("CMD_REFUND_USER:");
                    break;
                }
                case cmd.Code.CMD_WIN_USER: {
                    //  cc.log("CMD_WIN_USER :");
                    let amount = res.amount;
                    this.lbWin.string = "+" + Utils.formatNumber(amount);
                    Configs.Login.Coin += amount;
                    BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                    this.lbWin.node.active = true;
                    TW(this.lbWin.node).set({ y: 300, scale: 3, opacity: 0, angle: -720 }).to(1.0, { y: 25, scale: 1.0, opacity: 255, angle: 0 }, { easing: cc.easing.sineIn }).delay(1.5).call(() => {
                        this.lbWin.node.active = false;
                    }).start();
                    break;
                }
                case cmd.Code.CMD_THONGKE_PHIEN: {
                    //  cc.log("CMD_THONGKE_PHIEN:");
                    //  cc.log("TXST:", JSON.stringify(res));
                    break;
                }
                case cmd.Code.CMD_USER_BET: {
                    //  cc.log("CMD_USER_BET:");
                    break;
                }
                case cmd.Code.CMD_TOP_HONOR: {
                    //  cc.log("CMD_TOP_HONOR:");
                    if (this.popupHonor != null && this.popupHonor.node.active) {
                        if (res.status == 0 && res.data != null)
                            this.popupHonor.initData(res.data);
                    }
                    App.instance.showLoading(false);
                    break;
                }
                case cmd.Code.CMD_DIS_TX: {
                    //  cc.log("CMD_DIS_TXST");
                    this.dismiss();
                    break;
                }
            }
        }, this);
        BroadcastReceiver.register(BroadcastReceiver.USER_LOGOUT, () => {
            if (!this.node.active) return;
            this.dismiss();
        }, this);

    }
    setupTimeRunInBg() {
        cc.game.on(cc.game.EVENT_HIDE, () => {
            this.timeInBg = cc.sys.now()
        })

        cc.game.on(cc.game.EVENT_SHOW, () => {
            let timeNow = cc.sys.now()
            let timeHide = this.timeInBg;
            cc.director.getActionManager().update((timeNow - timeHide) / 1000);
            cc.Tween.stopAllByTag(1);
            if ((timeNow - timeHide) / 1000 > 15) {
                this.dismiss();
            }
        })

    };

    show() {
        if (this.node.active) {
            this.reOrder();
            return;
        }
        App.instance.showBgMiniGame("TaiXiuSieuToc");
        super.show();
    }
    dismiss() {
        super.dismiss();
        this.showNodeChat(false);
    }
    onDestroy() {
        //  cc.log("Destroy TXST");
    }
    resetView() {
        //  cc.log("reset view");
        this.showResultWin(false);
        this.bgLight.active = false;
        this.nodeBat.active = false;
        this.nodeBat.scale = 1;
        this.lbTimeCountDown.node.active = false;
        // this.nodeBtnBet.active = false;
        this.dragon.node.active = false;
        this.table.setAnimation(0, ANIM_STATE.TABLE_NODRAGON, true);
        this.lbTotalBetXiu.string =
            this.lbTotalBetTai.string =
            this.lbTotalBetXiu.string =
            this.lbTotalXiu.string =
            this.lbTotalTai.string =
            this.lbTotalUserTai.string =
            this.lbTotalUserXiu.string =
            this.lbBetTai.string =
            this.lbBetXiu.string = "0";
        this.sprBtnBetTai.active = true;
        this.sprBtnBetXiu.active = true;
        this.lbBetTai.node.active = false;
        this.lbBetXiu.node.active = false;
        this.lbScore.node.active = false;
        this.bg_Score.active = false;
        this.sprBtnBetTai.parent.getChildByName("boxBet").active = false;
        this.sprBtnBetXiu.parent.getChildByName("boxBet").active = false;
        this.totalBet = 0;
        this.currentGate = -1;
        this.nodeTxtTai.scale = 1.0;
        this.nodeTxtXiu.scale = 1.0;
        this.nodeTxtTai.angle = 0;
        this.nodeTxtXiu.angle = 0;
        this.lastBetAmount = 0;
        this.result = [];
        this.lbTimeCountDown.node.color = cc.Color.WHITE;
        this.lbTimeCountDown.node.scale = 1;
        this.lbTimeCountDown.node.active = false;
        this.lbTimeCountDown.node.setPosition(cc.v2(-2.745, 47));
        this.bgTime.active = false;
        if (this.currentBtnBet != null) {
            this.currentBtnBet.color = cc.Color.WHITE;
        }
        cc.Tween.stopAllByTag(1);
    }

    shakeDice() {
        this.dice1.node.active = this.dice2.node.active = this.dice3.node.active = true;

        this.dice1.setAnimation(0, this.getAnimationDiceStart(Utils.randomRangeInt(1, 6)), false);
        this.dice2.setAnimation(0, this.getAnimationDiceStart(Utils.randomRangeInt(1, 6)), false);
        this.dice3.setAnimation(0, this.getAnimationDiceStart(Utils.randomRangeInt(1, 6)), false);
        // this.listTimer.push(timeOut1, timeOut2, timeOut3);
        cc.Tween.stopAllByTarget(this.dice1.node);
        cc.Tween.stopAllByTarget(this.dice2.node);
        cc.Tween.stopAllByTarget(this.dice3.node);
        TW(this.dice1.node).delay(1.5).to(0.5, { opacity: 0 }, { easing: cc.easing.sineIn }).start();
        TW(this.dice2.node).delay(1.5).to(0.5, { opacity: 0 }, { easing: cc.easing.sineIn }).start();
        TW(this.dice3.node).delay(1.5).to(0.5, { opacity: 0 }, { easing: cc.easing.sineIn }).start();

        this.nodeBat.y = 150;
        this.nodeBat.opacity = 0;
        cc.Tween.stopAllByTarget(this.nodeBat);
        this.nodeBat.active = true;
        TW(this.nodeBat).delay(1.5)
            .to(0.75, { y: 9, opacity: 255, scale: 1.0 }, { easing: cc.easing.sineOut })
            .call(() => {
                this.table.setAnimation(0, ANIM_STATE.TABLE_DRAGON, true);
            })
            .start();

        TW(this.nodeBat).tag(1);
        TW(this.dice3.node).tag(1);
        TW(this.dice2.node).tag(1);
        TW(this.dice1.node).tag(1);
    }
    setDice() {
        if (!this.dice1.node.active || this.dice1.node.opacity != 255) {
            cc.Tween.stopAllByTarget(this.nodeBat);
            TW(this.nodeBat).to(0.5, { y: 100, opacity: 0, scale: 1.2 }, { easing: cc.easing.sineOut }).start();
            TW(this.dice1.node).to(0.5, { opacity: 255 }, { easing: cc.easing.sineOut }).start();
            TW(this.dice2.node).to(0.5, { opacity: 255 }, { easing: cc.easing.sineOut }).start();
            TW(this.dice3.node).to(0.5, { opacity: 255 }, { easing: cc.easing.sineOut }).start();
            TW(this.dice1.node).tag(1);
            TW(this.dice3.node).tag(1);
            TW(this.dice2.node).tag(1);
            this.dice1.node.active = this.dice2.node.active = this.dice3.node.active = true;
            this.dice1.setAnimation(0, this.getAnimationDiceEnd(this.result[0]), false);
            this.dice2.setAnimation(0, this.getAnimationDiceEnd(this.result[1]), false);
            this.dice3.setAnimation(0, this.getAnimationDiceEnd(this.result[2]), false);
        }
    }
    getAnimationDiceEnd(dice) {
        var anim = "";
        if (dice == 1) anim = "#1 END_F1";
        else if (dice == 2) anim = "#1 END_F2";
        else if (dice == 3) anim = "#1 END_F3";
        else if (dice == 4) anim = "#1 END_F4";
        else if (dice == 5) anim = "#1 END_F5";
        else if (dice == 6) anim = "#1 END_F6";
        return anim;
    }
    getAnimationDiceStart(dice) {
        var anim = "";
        let listPrefix = ["#1", "#2", "#3"];
        let ranPre = listPrefix[0];
        if (dice == 1) anim = ranPre + " WHITE_F1";
        else if (dice == 2) anim = ranPre + " WHITE_F2";
        else if (dice == 3) anim = ranPre + " WHITE_F3";
        else if (dice == 4) anim = ranPre + " WHITE_F4";
        else if (dice == 5) anim = ranPre + " WHITE_F5";
        else if (dice == 6) anim = ranPre + " WHITE_F6";
        return anim;
    }
    onClick() {
        this.loginGame();
    }
    loginGame() {

    }
    subcribeWS() {
        TaiXiuSTNetworkClient.getInstance().connect();
    }
    onClickHonor() {
        if (this.popupHonor == null) {
            cc.assetManager.getBundle("TaiXiuSieuToc").load("Prefabs/PopupHonors", cc.Prefab, function (finish, total, item) {

            }, (err1, prefab: cc.Prefab) => {
                this.popupHonor = cc.instantiate(prefab).getComponent("TaiXiuST.PopupHonors");
                this.popupHonor.node.parent = this.popupContainer;
                this.popupHonor.node.active = true;
                this.popupHonor.show();
                this.popups.push(this.popupHonor.node);
            })
        } else {
            this.popupHonor.show();
        }
    }
    onClickHistory() {
        if (this.popupHistory == null) {
            cc.assetManager.getBundle("TaiXiuSieuToc").load("Prefabs/PopupHistory", cc.Prefab, function (finish, total, item) {

            }, (err1, prefab: cc.Prefab) => {
                this.popupHistory = cc.instantiate(prefab).getComponent("TaiXiuST.PopupHistory");
                this.popupHistory.node.parent = this.popupContainer;
                this.popupHistory.node.active = true;
                this.popupHistory.show();
                this.popups.push(this.popupHistory.node);
            })
        } else {
            this.popupHistory.show();
        }
    }
    onClickHistorySession() {

        if (this.popupDetailSession == null) {
            cc.assetManager.getBundle("TaiXiuSieuToc").load("Prefabs/PopupDetailHistory", cc.Prefab, function (finish, total, item) {

            }, (err1, prefab: cc.Prefab) => {
                this.popupDetailSession = cc.instantiate(prefab).getComponent("TaiXiuST.PopupDetailHistory");
                this.popupDetailSession.node.parent = this.popupContainer;
                this.popupDetailSession.showDetail(this.session - 1);
                this.popups.push(this.popupDetailSession.node);
                App.instance.showLoading(false);
            })
        } else {
            this.popupDetailSession.showDetail(this.session - 1);
        }

    }
    onClickSoiCau() {
        if (this.popupSoiCau == null) {
            cc.assetManager.getBundle("TaiXiuSieuToc").load("Prefabs/PopupSoiCau", cc.Prefab, function (finish, total, item) {
            }, (err1, prefab: cc.Prefab) => {
                this.popupSoiCau = cc.instantiate(prefab).getComponent("TaiXiuST.PopupSoiCau");
                this.popupSoiCau.node.parent = this.popupContainer;
                this.popupSoiCau.show();
                this.popups.push(this.popupSoiCau.node);
                App.instance.showLoading(false);
            })
        } else {
            this.popupSoiCau.show();
        }

    }
    onClickGuide() {
        if (this.popupGuide == null) {
            cc.assetManager.getBundle("TaiXiuSieuToc").load("Prefabs/PopupGuide", cc.Prefab, function (finish, total, item) {

            }, (err1, prefab: cc.Prefab) => {
                this.popupGuide = cc.instantiate(prefab).getComponent("Dialog");
                this.popupGuide.node.parent = this.popupContainer;
                this.popupGuide.show();
                this.popups.push(this.popupGuide.node);
                App.instance.showLoading(false);
            })
        }
        else {
            this.popupGuide.show();
        }
    }
    public reOrder() {
        super.reOrder();
    }


    onClickClose() {
        this.dismiss();
        App.instance.hideGameMini("TaiXiuSieuToc");
    }
    onClickChat() {
        App.instance.showBgMiniGame("TaiXiuSieuToc");
        this.showNodeChat(!this.nodeChat.active);
    }
    onClickSendChat() {
        App.instance.showBgMiniGame("TaiXiuSieuToc");
        let data: any = {}
        data.u = Configs.Login.Nickname;
        data.m = this.edbChat.string.trim();
        this.edbChat.string = "";
        TaiXiuSTNetworkClient.getInstance().sendChat(data);
    }

    onClickSendChatNhanh(msg) {
        App.instance.showBgMiniGame("TaiXiuSieuToc");
        let data: any = {}
        data.u = Configs.Login.Nickname;
        data.m =    msg;
        TaiXiuSTNetworkClient.getInstance().sendChat(data);
    }
    onClickBet(even, data) {
        App.instance.showBgMiniGame("TaiXiuSieuToc");
        if(this.currentGate<0){
            this.showToast(App.instance.getTextLang('txt_taixiu_choose_gate'));
            return;
        }
        if (Configs.Login.Coin < parseInt(data)) {
            this.showToast(App.instance.getTextLang('txt_not_enough'));
            return;
        }
        if (this.stateGame == STATE_GAME.BET) {
            let amount = parseInt(data);
            this.currentBet += amount;
            if (this.currentGate == 1) {
                this.lbBetTai.node.active = true;
                this.sprBtnBetTai.active = false;
                Tween.numberTo(this.lbBetTai, this.currentBet, 0.3);
            } else if (this.currentGate == 2) {
                this.lbBetXiu.node.active = true;
                this.sprBtnBetXiu.active = false;
                Tween.numberTo(this.lbBetXiu, this.currentBet, 0.3);
            }
            if (this.currentBtnBet != null) {
                this.currentBtnBet.color = cc.Color.WHITE;
            }
            this.currentBtnBet = even.target;
            this.currentBtnBet.color = new cc.Color().fromHEX("#FFE000");
            TW(this.currentBtnBet).to(0.1, { scale: 1.2 }).to(0.1, { scale: 1.0 }).start();
        } else if (this.stateGame == STATE_GAME.PREPARE_RESULT) {
            this.showToast(App.instance.getTextLang('txt_bet_error8'));
        } else {
            this.showToast(App.instance.getTextLang('txt_bet_error3'));
        }

    }
    onClickAllIn() {
        App.instance.showBgMiniGame("TaiXiuSieuToc");
        if (Configs.Login.Coin < 1000) {
            this.showToast(App.instance.getTextLang('txt_bet_error7'));
            return;
        }
        // let dataBet: any = {};
        // dataBet.taixiuId = this.session;
        // dataBet.loginname = Configs.Login.Nickname;
        // dataBet.betamount = Configs.Login.Coin;
        // dataBet.typed = this.currentGate;
        // let betFrom = 0;
        // if (cc.sys.isNative) {
        //     betFrom = cc.sys.os == cc.sys.OS_ANDROID ? 2 : 1;
        // }
        // dataBet.betfrom = betFrom;
        // TaiXiuSTNetworkClient.getInstance().sendBet(dataBet)
        this.onClickBet(null, Configs.Login.Coin);
    }
    onClickConfirmBet() {
        App.instance.showBgMiniGame("TaiXiuSieuToc");
        if (this.timeConfirmBet == 0) {
            let msg = App.instance.getTextLang("txt_notify_fast_action");
            this.showToast(msg);
            return;
        }
        //  cc.log("last bet amount==" + this.lastBetAmount);
        if (this.currentGate < 0) {
            this.showToast(App.instance.getTextLang('txt_taixiu_choose_gate'));
            return;
        }
        if (this.currentBet <= 0 && this.lastBetAmount <= 0) {
            this.showToast(App.instance.getTextLang('txt_bet_error9'));
            return;
        }
        if (this.stateGame == STATE_GAME.PREPARE_RESULT) {
            this.showToast(App.instance.getTextLang('txt_bet_error8'));
            return;
        }
        if (!TaiXiuSTNetworkClient.getInstance().checkSubChannel(this.gameSubscribeId)) {
            TaiXiuSTNetworkClient.getInstance().subscribe(cmd.API.USER);
            this.showToast(App.instance.getTextLang('txt_bet_error2'));
            return;
        }
        this.timeConfirmBet = 0;
        this.scheduleOnce(() => {
            this.timeConfirmBet = 1;
        }, 1.0)
        let dataBet: any = {};
        dataBet.taixiuId = this.session;
        dataBet.loginname = Configs.Login.Nickname;
        dataBet.betamount = this.currentBet;
        //  cc.log("last bet amount==" + this.lastBetAmount);
        if (this.currentBet == 0 && this.lastBetAmount > 0) {
            dataBet.betamount = this.lastBetAmount;
        }
        dataBet.typed = this.currentGate;
        let betFrom = 0;
        if (cc.sys.isNative) {
            betFrom = cc.sys.os == cc.sys.OS_ANDROID ? 2 : 1;
        }
        dataBet.betfrom = betFrom;
        TaiXiuSTNetworkClient.getInstance().sendBet(dataBet)
    }
    getHistorySession() {
        TaiXiuSTNetworkClient.getInstance().getHistorySession()
    }
    onClickCancelBet() {
        App.instance.showBgMiniGame("TaiXiuSieuToc");
        // this.showNodeBtnBet(false);
        this.sprBtnBetTai.active = true;
        this.sprBtnBetXiu.active = true;
        this.lbBetXiu.node.active = false;
        this.lbBetTai.node.active = false;
        this.currentBet = 0;
    }
    setTimeCountDown(data) {

    }
    onClickChooseGate(even, data) {
        App.instance.showBgMiniGame("TaiXiuSieuToc");
        if (this.currentGate != -1 && this.totalBet) {
            if ((data == "TAI" && this.currentGate == 2) || (data == "XIU" && this.currentGate == 1)) {
                this.showToast(App.instance.getTextLang('txt_taixiu_chat_error4'));
                return;
            }
        }
        if (this.stateGame == STATE_GAME.RESULT) {
            this.showToast(App.instance.getTextLang('txt_bet_error3'));
            return;
        } else if (this.stateGame == STATE_GAME.PREPARE_RESULT) {
            this.showToast(App.instance.getTextLang('txt_bet_error8'));
            return;
        }
        switch (data) {
            case "TAI":
                this.currentGate = 1;
                this.currentBet = 0;
                this.lbBetTai.string = "0";
                this.lbBetXiu.node.active = false;
                this.lbBetTai.node.active = true;
                this.sprBtnBetTai.parent.getChildByName("boxBet").active = true;
                this.sprBtnBetXiu.parent.getChildByName("boxBet").active = false;
                this.sprBtnBetTai.active = false;
                this.sprBtnBetXiu.active = true;
                break;
            case "XIU":
                this.currentGate = 2;
                this.currentBet = 0;
                this.lbBetXiu.string = "0";
                this.lbBetTai.node.active = false;
                this.lbBetXiu.node.active = true;
                this.sprBtnBetTai.active = true;
                this.sprBtnBetXiu.active = false;
                this.sprBtnBetTai.parent.getChildByName("boxBet").active = false;
                this.sprBtnBetXiu.parent.getChildByName("boxBet").active = true;
                break;
        }
        this.showNodeBtnBet(true);
    }
    showNodeBtnBet(state) {
        if (this.nodeBtnBet.active == false && state) {
            this.nodeBtnBet.active = true;
            for (let i = 0; i < 8; i++) {
                let btnBet = this.nodeBtnBet.children[i];
                let timeDelay = 0.05 * i;
                btnBet.scale = 0;
                cc.tween(btnBet).sequence(cc.tween().delay(timeDelay), cc.tween().to(0.1, { scale: 1.0 }, { easing: cc.easing.backOut })).start();
                // btnBet.runAction(cc.sequence(cc.delayTime(timeDelay), cc.scaleTo(0.1, 1)));
            }
        } else if (!state) {
            this.nodeBtnBet.active = false;
        }
    }
    showNodeChat(state) {
        if (state) {
            this.nodeChat.active = true;
            TW(this.nodeChat).set({ x: cc.winSize.width, opacity: 0 }).to(0.3, { x: 558.03, opacity: 255 }, { easing: cc.easing.sineOut }).start();
        } else {
            TW(this.nodeChat).to(0.3, { x: cc.winSize.width, opacity: 0 }, { easing: cc.easing.sineIn }).call(() => {
                this.nodeChat.active = false;
            }).start();
        }

    }
    showResultWin(state) {
        if (state) {
            let acScale1 = TW().to(0.25, { scale: 1.2 });
            let acRotate1 = TW().to(0.125, { angle: 10 });
            let acRotate2 = TW().to(0.125, { angle: 0 });
            let acRotate3 = TW().to(0.125, { angle: -10 });
            let acRotate4 = TW().to(0.125, { angle: 0 });
            let acScale2 = TW().to(0.25, { scale: 1.0 });
            let acSeqRo1 = TW().sequence(acRotate1, acRotate2, acRotate3, acRotate4, acScale2);
            this.lbScore.string = this.totalResult.toString();
            this.lbScore.node.active = true;
            this.bg_Score.active = true;
            this.bgLight.active = true;
            if (this.totalResult > 10) {
                TW(this.nodeTxtTai).repeat(5, TW().sequence(TW().delay(0.5), TW().parallel(acScale1, acSeqRo1))).start();
                this.bgLight.x = this.nodeTxtTai.x;
            } else {
                this.bgLight.x = this.nodeTxtXiu.x;
                TW(this.nodeTxtXiu).repeat(5, TW().sequence(TW().delay(0.5), TW().parallel(acScale1, acSeqRo1))).start();
            }

        } else {
            cc.Tween.stopAllByTarget(this.nodeTxtTai);
            cc.Tween.stopAllByTarget(this.nodeTxtXiu);
            this.nodeTxtTai.scale = 1.0;
            this.nodeTxtXiu.scale = 1.0;
        }

    }
    loadListHistoryShort() {
        let dataHis = this.historyShort.slice(0, 18).reverse();
        for (let i = 0; i < dataHis.length; i++) {
            let item = this.nodeHistoryShort.children[i];
            if (!item) {
                item = cc.instantiate(this.nodeHistoryShort.children[0]);
                this.nodeHistoryShort.addChild(item);
            }
            let data = typeof dataHis[i] == "string" ? JSON.parse(dataHis[i]) : dataHis[i];
            let result = data[0] + data[1] + data[2];
            item.getComponent(cc.Sprite).spriteFrame = result > 10 ? this.sprDots[0] : this.sprDots[1];
            if (result > 10) {
                item.setContentSize(cc.size(23, 23));
            } else {
                item.setContentSize(cc.size(26, 26));
            }
            item.active = true;
            item.y = 0;
            TW(item).set({ scale: 0 }).delay(0.01 * i).to(0.3, { scale: 1.0 }, { easing: cc.easing.backOut })
                .call(() => {
                    if (this.nodeHistoryShort.children.indexOf(item) == 17) {
                        TW(item)
                            .repeatForever(TW()
                                .sequence(TW()
                                    .to(0.5, { y: 10 }), TW().to(0.5, { y: 0 })))
                            .start();
                    }
                })
                .start();

        }
    }
    showToast(msg) {
        this.alertToast.getComponentInChildren(cc.Label).string = msg;
        this.alertToast.active = true;
        cc.Tween.stopAllByTarget(this.alertToast);
        // TW(this.alertToast).set({ y: -25 }).to(1.5, { y: 25 }).call(() => {
        //     this.alertToast.active = false;
        // }).start();
        TW(this.alertToast).set({ x: -300, opacity: 0 })
            .to(0.3, { x: 0, opacity: 255 }, { easing: cc.easing.sineOut })
            .delay(1.4)
            .to(0.3, { x: 300, opacity: 0 }, { easing: cc.easing.backIn }).call(() => {
                this.alertToast.active = false;
            }).start();
        TW(this.alertToast).tag(1);

    }
    initListChat() {
        this.scrChat.content.on(cc.Node.EventType.CHILD_ADDED, () => {
            // if (this.scrChat.content.y > 0) {
            //     this.scrChat.scrollToBottom(0.3);
            // }
            this.onScrollChatEvent();
        });
        if (this.scrChat.content.childrenCount == 1) {
            for (let i = 1; i < 15; i++) {
                this.scrChat.content.addChild(cc.instantiate(this.scrChat.content.children[0]));
            }
        }
        for (let i = 0; i < this.listChatHistory.length; i++) {
            let data = this.listChatHistory[i];
            this.addChat(data.u, data.m, i);
        }
        this.showNodeChat(true);

    }
    reloadListChat() {

    }
	actTransaction() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            if (!this.popupTransaction) {
                let cb = (prefab) => {
                    let popupDaily = cc.instantiate(prefab).getComponent("Lobby.PopupTransaction");
                    App.instance.node.addChild(popupDaily.node)
                    this.popupTransaction = popupDaily;
                    this.popupTransaction.show();
                }
                BundleControl.loadPrefabPopup("PrefabPopup/PopupTransaction", cb);
            } else {
                this.popupTransaction.show();
            }
        }
    addChat(u, m, index) {
        let item = this.scrChat.content.children[index];
        if (!item) {
            item = cc.instantiate(this.scrChat.content.children[0]);
            this.scrChat.content.addChild(item);
        }
        item.active = true;
        item.opacity = 255;
        let name = u;
        if (name.length > 10)
            name = name.substring(0, 7) + "..";
        m = m.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '');
        item.getComponent(cc.Label).string = name + " : " + m;
        item.children[0].getComponent(cc.Label).string = name + " : ";
        // this.onScrollChatEvent();
        if (this.scrChat.content.childrenCount >= 15) {
            this.scrChat.content.children[0].destroy();
        }
    }
    onScrollChatEvent() {
        for (let i = 0; i < this.scrChat.content.childrenCount; i++) {
            let item = this.scrChat.content.children[i];
            let view = this.scrChat.node.getChildByName("view");
            let posWorld = this.scrChat.content.convertToWorldSpaceAR(item.getPosition());
            let posInView = view.convertToNodeSpaceAR(posWorld);
            if (posInView.y > view.height + item.height * 2 || posInView.y < -item.height) {
                item.opacity = 0;
            } else {
                item.opacity = 255;
            }
        }
    }
    // update (dt) {}
}
