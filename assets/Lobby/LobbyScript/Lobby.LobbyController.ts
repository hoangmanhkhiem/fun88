import Http from "../../Loading/src/Http";
import Configs from "../../Loading/src/Configs";

import PopupGiftCode from "./Lobby.PopupGiftCode";
import cmd from "./Lobby.Cmd";
import TabsListGame from "./Lobby.TabsListGame";
import PopupUpdateNickname from "./PopupUpdateNickname";
import PopupTransaction from "./Lobby.PopupTransaction";
import GameLiveController from "./GameLive/GameLiveController";
import PopupSecurity from "./Lobby.PopupSecurity";
import PopupDiemDanh from "./UIPopupDiemDanh";
import PopupMail from "./UIPopupMail";

import VersionConfig from "../../Loading/src/VersionConfig";
import PopupDaiLy from "./Lobby.PopupDaiLy";
import Popupnaprut from "./Lobby.Popupnaprut";
import { Tophudata } from './Lobby.ItemTopHu';
import TopHu from "./Lobby.TopHu";
import BundleControl from "../../Loading/src/BundleControl";
import LogEvent from "../../Loading/src/LogEvent/LogEvent";
import { Global } from "../../Loading/src/Global";
import PopupRegister from "./PopupRegister";
import PopupForgetPassword from "./Lobby.PopupForgetPassword";
import PopupTaiApp from "./Lobby.PopupTaiApp";
import PopupProfile from "./Lobby.PopupProfile";
import LobbyShop from "./Payment/LobbyShop";
import PopupCashout from "./Lobby.PopupCashout";
import PopupLogin from "./PopupLogin";
import App from "./Script/common/App";
import BroadcastReceiver from "./Script/common/BroadcastReceiver";
import AudioManager from "./Script/common/Common.AudioManager";
import SPUtils from "./Script/common/SPUtils";
import Tween from "./Script/common/Tween";
import Utils from "./Script/common/Utils";
import MiniGameNetworkClient from "./Script/networks/MiniGameNetworkClient";
//import MiniGameNetworkClient2 from "./Script/networks/MiniGameNetworkClient2";
import InPacket from "./Script/networks/Network.InPacket";
import SamNetworkClient from "./Script/networks/SamNetworkClient";
import MauBinhNetworkClient from "../../MauBinh/MauBinhScript/MauBinh.NetworkClient";
import SlotNetworkClient from "./Script/networks/SlotNetworkClient";
import TienLenNetworkClient from "./Script/networks/TienLenNetworkClient";
import facebookSdk from "./Script/Service/FaceBook/Facebook";
import TienLenConstant from "./TienLenScript/TienLen.Room";
import SamConstant from "./SamScript/Sam.Room";
import BannerList from "./Lobby.BannerList";
//import ShootFishNetworkClient from "./Script/networks/ShootFishNetworkClient";
import NetworkClient from "./Script/networks/Network.NetworkClient";
import TaiXiuSTNetworkClient from "./Script/networks/TaiXiuSieuToc.NetworkClient";
import PopupEvent from "./PopupEvent";
import PopupEventTT from "./PopupEventTT";
import PopupTopHu from "./Lobby.PopupTopHu";
import { PopupRefund } from "./Lobby.PopupRefund";
import PopupDaily from "./Lobby.PopupDiemDanh";
import PopupDiemDanh1 from "./Lobby.PopupDiemDanh";
import BoxLixi from "./Lobby.BoxLixi";
import PopupKiemTien from "./Lobby.PopupKiemTien";
const { ccclass, property } = cc._decorator;
var _this = null;
@ccclass("Lobby.LobbyController.PanelMenu")
export class PanelMenu {
    @property(cc.Node)
    node: cc.Node = null;
    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Toggle)
    toggleMusic: cc.Toggle = null;
    @property(cc.Toggle)
    toggleSound: cc.Toggle = null;

    private animate = false;
    start() {
        App.instance.isShowNotifyJackpot = true;
        this.toggleMusic.node.on("toggle", () => {
            SPUtils.setMusicVolumn(this.toggleMusic.isChecked ? 1 : 0);
            BroadcastReceiver.send(BroadcastReceiver.ON_AUDIO_CHANGED);
        });
        this.toggleSound.node.on("toggle", () => {
            SPUtils.setSoundVolumn(this.toggleSound.isChecked ? 1 : 0);
            BroadcastReceiver.send(BroadcastReceiver.ON_AUDIO_CHANGED);
        });

        this.toggleMusic.isChecked = SPUtils.getMusicVolumn() > 0;
        this.toggleSound.isChecked = SPUtils.getSoundVolumn() > 0;
        this.node.active = false;
        // App.instance.setUpNode();
    }


    show() {
        if (this.animate) return;
        this.animate = true;
        this.node.stopAllActions();
        this.node.active = true;
        cc.tween(this.bg).set({ scale: 0.8, opacity: 150 }).to(0.3, { scale: 1.0, opacity: 255 }, { easing: cc.easing.backOut }).call(() => {
            this.animate = false;
        }).start();
    }

    hide() {
        this.node.stopAllActions();
        cc.tween(this.bg).to(0.3, { scale: 0.8, opacity: 150 }, { easing: cc.easing.backIn }).call(() => {
            this.node.parent.active = false;
            this.animate = false;
        }).start();
    }
    dismiss() {
        if (this.animate) return;
        this.animate = true;
        cc.tween(this.bg).to(0.3, { scale: 0.8, opacity: 150 }, { easing: cc.easing.backIn }).call(() => {
            this.node.parent.active = false;
            this.animate = false;
        }).start();
    }

    toggle() {
        if (this.node.active) {
            this.dismiss();
        } else {
            this.show();
        }
    }
}

namespace Lobby {
    @ccclass
    export class LobbyController extends cc.Component {
        @property(cc.Node)
        nodeTop: cc.Node = null;
        @property(cc.Node)
        nodeBot: cc.Node = null;
        @property(cc.Node)
        nodeCenter: cc.Node = null;
        @property(cc.Label)
        txtMail: cc.Label = null;
        @property(cc.Label)
        txtMailz: cc.Label = null;
        @property(cc.Node)
        panelNotLogin: cc.Node = null;
        @property(cc.Node)
        panelCSKH: cc.Node = null;
        @property(cc.Node)
        bottomBarLeft: cc.Node = null;
        @property(cc.Node)
        bottomBarRight: cc.Node = null;
        @property(cc.Layout)
        layoutBtnLeft: cc.Layout = null;
        @property(cc.Layout)
        layoutLbLeft: cc.Layout = null;
        @property(cc.Layout)
        layoutBtnRight: cc.Layout = null;
        @property(cc.Layout)
        layoutLbRight: cc.Layout = null;

        @property(GameLiveController)
        gameLiveController: GameLiveController = null;
        @property(cc.Node)
        panelLogined: cc.Node = null;
        @property(PanelMenu)
        panelMenu: PanelMenu = null;

        @property(cc.Sprite)
        sprAvatar: cc.Sprite = null;
        @property(cc.Label)
        lblNickname: cc.Label = null;
        @property(cc.Label)
        lblVipPoint: cc.Label = null;
        @property(cc.Slider)
        sliderVipPoint: cc.Slider = null;
        @property(cc.Label)
        lblVipPointName: cc.Label = null;
        @property(cc.Sprite)
        spriteProgressVipPoint: cc.Sprite = null;
        @property(cc.Label)
        lblCoin: cc.Label = null;

        @property(cc.RichText)
        txtNotifyMarquee: cc.RichText = null;
        @property(cc.Node)
        bgNotify: cc.Node = null;

        @property(cc.Node)
        btnLoginFb: cc.Node = null;
        @property(cc.Node)
        buttonjb: cc.Node = null;
        @property(BoxLixi)
        boxLixi: BoxLixi = null;
        @property(cc.Node)
        buttonTaiApp: cc.Node = null;


        @property(TabsListGame)
        tabsListGame: TabsListGame = null;
        @property(BannerList)

        bannerList: BannerList = null;
        popupGiftCode: PopupGiftCode = null;
        popupUpdateNickname: PopupUpdateNickname = null;
        popupTransaction: PopupTransaction = null;
        popupTopHu: PopupTopHu = null;
        popupSecurity: PopupSecurity = null;
        popupKiemTien: PopupKiemTien = null;
        popupDiemDanh1: PopupDiemDanh1 = null;
        popupRefund: PopupRefund = null;
        popupEvent: PopupEvent = null;
        popupEventTT: PopupEventTT = null;
        popupMail: PopupMail = null;
        popupDiemDanh: PopupDiemDanh = null;
        popupDaily: PopupDaiLy = null;
        Popupnaprut: Popupnaprut = null;
        popupRegister: PopupRegister = null;
        poupLogin: PopupLogin = null;
        popupForgetPassword: PopupForgetPassword = null;
        popupTaiApp: PopupTaiApp = null;
        popupProfile: PopupProfile = null;
        popupShop: LobbyShop = null;
        popupCashout: PopupCashout = null;

        @property({ type: cc.AudioClip })
        clipBgm: cc.AudioClip = null;
        listData100: Array<Tophudata> = new Array<Tophudata>();
        listData1000: Array<Tophudata> = new Array<Tophudata>();
        listData10000: Array<Tophudata> = new Array<Tophudata>();
        private static notifyMarquee = "";
        dataAlertMini: any = {}
        fakeJPInv = null;

        @property(cc.Label)
        lblTai: cc.Label = null;
        @property(cc.Label)
        lblXiu: cc.Label = null;
        @property(cc.Label)
        lblTaiMd5: cc.Label = null;
        @property(cc.Label)
        lblXiuMd5: cc.Label = null;
        @property(cc.Label)
        lblTopHu: cc.Label = null;
        @property(cc.Node)
        nodeXacNhanSdt: cc.Node = null;

        onLoad() {
            Global.LobbyController = this;
            if (BundleControl.serverVersion.hasOwnProperty('FbConfig')) {
                this.btnLoginFb.active = BundleControl.serverVersion['FbConfig'].isShowBtnFb;
            }
            this.nodeCenter.active = false;
            this.nodeTop.y = cc.winSize.height / 2 + this.nodeTop.height / 2;
            this.nodeBot.y = -cc.winSize.height / 2 - this.nodeBot.height;
            if (this.isUseSDK()) {
                // this.initPluginFirebase();
                this.initPluginFacebook()
            };



            this.buttonjb.x = cc.winSize.width / 2 - 50;
            this.buttonjb.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
                this.buttonClicked = true;
                this.buttonMoved = cc.Vec2.ZERO;
            }, this);

            this.buttonjb.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
                this.buttonMoved = this.buttonMoved.add(event.getDelta());
                if (this.buttonClicked) {
                    if (Math.abs(this.buttonMoved.x) > 30 || Math.abs(this.buttonMoved.y) > 30) {
                        let pos = this.buttonjb.position;
                        pos.x += this.buttonMoved.x;
                        pos.y += this.buttonMoved.y;
                        this.buttonjb.position = pos;
                        this.buttonClicked = false;
                    }
                } else {
                    let pos = this.buttonjb.position;
                    pos.x += event.getDeltaX();
                    pos.y += event.getDeltaY();
                    this.buttonjb.position = pos;
											   
                }
					
												 
										   
										   
											 
			 
            }, this);

            this.buttonjb.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
                if (this.buttonClicked) {
                    this.actTopHu();
                }
                let posX = this.buttonjb.x > 0 ? cc.winSize.width / 2 - 60 : -cc.winSize.width / 2 + 60;
                cc.tween(this.buttonjb).to(0.3, { x: posX }, { easing: cc.easing.sineOut }).start();
            }, this);





        }
        start() {
            _this = this;
            let tileScreen = cc.winSize.width / 1280;
            this.bottomBarLeft.width = this.bottomBarLeft.width * tileScreen
            this.bottomBarRight.width = this.bottomBarRight.width * tileScreen
            setTimeout(() => {
                LogEvent.getInstance().sendEventOpenApp();
            }, 1000);
            this.lblCoin.node.parent.active = true;
            if (cc.sys.isBrowser) {
                if (window.localStorage.getItem('u') != null && window.localStorage.getItem('at') != null) {
                    var data = {};
                    data['u'] = window.localStorage.getItem('u');
                    data['at'] = window.localStorage.getItem('at');
                    App.instance.TYPE_LOGIN = "NORMAL";
                    App.instance.USER_NAME = window.localStorage.getItem('un');
                    App.instance.PASS_WORD = window.localStorage.getItem('pw');
                    this.actLoginToken(data);
                }
                else if (window.localStorage.getItem('un') != null && window.localStorage.getItem('pw') != null) {
                    //    this.atcPopupUpdateNickName(window.localStorage.getItem('un'), window.localStorage.getItem('pw'));
                    App.instance.TYPE_LOGIN = "NORMAL";
                    App.instance.USER_NAME = window.localStorage.getItem('un');
                    App.instance.PASS_WORD = window.localStorage.getItem('pw');
                }
                else if (window.localStorage.getItem('at_fb')! + null) {
                    Configs.Login.AccessTokenFB = window.localStorage.getItem('at_fb');
                    Configs.Login.FacebookID = window.localStorage.getItem('fb_id');
                    App.instance.TYPE_LOGIN = "FACEBOOK";
                    App.instance.FB_ID = window.localStorage.getItem('fb_id');
                    App.instance.AT_FB = window.localStorage.getItem('at_fb');
                    this.loginFB();
                }
                else if (cc.sys.localStorage.getItem("user_name") != "null" && cc.sys.localStorage.getItem("IsAutoLogin") == 1) {
                    //login

                    if (Configs.Login.IsLogin == false) {
                        this.actLogin(cc.sys.localStorage.getItem("user_name"), cc.sys.localStorage.getItem("pass_word"));
                        App.instance.TYPE_LOGIN = "NORMAL";
                        App.instance.USER_NAME = cc.sys.localStorage.getItem("user_name");
                        App.instance.PASS_WORD = cc.sys.localStorage.getItem("pass_word");
                    }
                }
            }
            else {
                if (cc.sys.localStorage.getItem("user_name") != "null" && cc.sys.localStorage.getItem("IsAuto") == 1) {
                    //login
                    if (Configs.Login.IsLogin == false) {
                        this.actLogin(cc.sys.localStorage.getItem("user_name"), cc.sys.localStorage.getItem("pass_word"));
                        App.instance.TYPE_LOGIN = "NORMAL";
                        App.instance.USER_NAME = cc.sys.localStorage.getItem("user_name");
                        App.instance.PASS_WORD = cc.sys.localStorage.getItem("pass_word");
                    }
                }

                if (cc.sys.isNative) {
                    this.buttonTaiApp.active = false;
                }
            }
            this.panelMenu.start();
            BroadcastReceiver.register(BroadcastReceiver.UPDATE_NICKNAME_SUCCESS, (data) => {
            }, this);

            BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
                Tween.numberTo(this.lblCoin, Configs.Login.Coin, 0.3);
            }, this);
            BroadcastReceiver.register(BroadcastReceiver.ON_UPDATE_MAIL, () => {
                this.updateMail();
            }, this);
            BroadcastReceiver.register(BroadcastReceiver.USER_INFO_UPDATED, () => {
                this.lblNickname.string = Configs.Login.Nickname;
                this.sprAvatar.spriteFrame = App.instance.getAvatarSpriteFrame(Configs.Login.Avatar);
                this.lblVipPoint.string = "VP: " + Utils.formatNumber(Configs.Login.VipPoint) + "/" + Utils.formatNumber(Configs.Login.getVipPointNextLevel());
                this.sliderVipPoint.progress = Math.min(Configs.Login.VipPoint / Configs.Login.getVipPointNextLevel(), 1);
                this.spriteProgressVipPoint.fillRange = this.sliderVipPoint.progress;
                this.lblVipPointName.string = Configs.Login.getVipPointName();
                this.panelNotLogin.active = false;
                this.panelLogined.active = true;
                this.updateMail();
                MiniGameNetworkClient.getInstance().sendCheck(new cmd.ReqGetSecurityInfo());
                //MiniGameNetworkClient2.getInstance().sendCheck(new cmd.ReqGetSecurityInfo());
                Tween.numberTo(this.lblCoin, Configs.Login.Coin, 0.3);

                MiniGameNetworkClient.getInstance().sendCheck(new cmd.SendScribe());
                MiniGameNetworkClient.getInstance().sendCheck(new cmd.SendScribeTxMd5());
            }, this);

            BroadcastReceiver.register(BroadcastReceiver.USER_LOGOUT, (data) => {
                Configs.Login.clear();
                this.panelNotLogin.active = true;
                this.panelLogined.active = false;
                MiniGameNetworkClient.getInstance().close();
                //MiniGameNetworkClient2.getInstance().close();
                SlotNetworkClient.getInstance().close();
                TienLenNetworkClient.getInstance().close();
                //      ShootFishNetworkClient.getInstance().close();
                // App.instance.buttonMiniGame.hidden();
            }, this);
            if (!Configs.Login.IsLogin) {
                // if (SPUtils.getUserAccessTokenFB().length > 0) {
                //     this.actLoginFB()
                // }
                // else if (this.edbUsername.string.length > 0 && this.edbPassword.string.length > 0) {
                //     this.actLogin();
                // }
                this.panelNotLogin.active = true;
                this.panelLogined.active = false;
                App.instance.buttonMiniGame.hidden();

                //fake jackpot
                var j100 = Utils.randomRangeInt(5000, 7000) * 100;
                var j1000 = Utils.randomRangeInt(5000, 7000) * 1000;
                var j10000 = Utils.randomRangeInt(5000, 7000) * 10000;
                // //
                this.tabsListGame.updateItemJackpots("audition", j100, false, j1000, false, j10000, false);//tay du
                this.tabsListGame.updateItemJackpots("captain", j100, false, j1000, false, j10000, false);
                this.tabsListGame.updateItemJackpots("spartans", j100, false, j1000, false, j10000, false);//than tai
                this.tabsListGame.updateItemJackpots("tamhung", j100, false, j1000, false, j10000, false);//chim dien
                this.tabsListGame.updateItemJackpots("aztec", j100, false, j1000, false, j10000, false);
                this.tabsListGame.updateItemJackpots("zeus", j100, false, j1000, false, j10000, false);
                this.tabsListGame.updateItemJackpots("thethao", j100, false, j1000, false, j10000, false);
                this.tabsListGame.updateItemJackpots("shootfish", j100, false, j1000, false, j10000, false);
                this.tabsListGame.updateItemJackpots("chiemtinh", j100, false, j1000, false, j10000, false);
                this.tabsListGame.updateItemJackpots("galaxy", j100, false, j1000, false, j10000, false);
                this.tabsListGame.updateItemJackpots("minipoker", j100, false, j1000, false, j10000, false);

                this.createListdata(j100, j1000, j10000)
                //    this.topHu.ShowData(this.listData100, this.listData1000, this.listData10000);
            } else {
                this.panelNotLogin.active = false;
                this.panelLogined.active = true;
                BroadcastReceiver.send(BroadcastReceiver.USER_INFO_UPDATED);
                SlotNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeHallSlot());
                MiniGameNetworkClient.getInstance().sendCheck(new cmd.ReqGetMoneyUse());
            }
            console.log("start")
            Configs.App.getServerConfig();
            MiniGameNetworkClient.getInstance().addOnClose(() => {
                ////Utils.Log("on close minigame");
            }, this);
            this.startEff();
        }
        startEff() {
            cc.tween(this.nodeTop)
                .set({ y: cc.winSize.height / 2, opacity: 150 })
                .to(0.3, { y: cc.winSize.height / 2 - this.nodeTop.height / 2, opacity: 255 }, { easing: cc.easing.sineIn })
                .call(() => {
                    this.nodeCenter.active = true;
                    this.nodeTop.getComponent(cc.Widget).isAlignTop = true;
                    this.setupListener();
                    this.layoutBtnLeft.spacingX = 50 * (cc.winSize.width / 1280);
                    this.layoutLbLeft.spacingX = 50 * (cc.winSize.width / 1280);

                    this.layoutLbRight.spacingX = 50 * (cc.winSize.width / 1280);
                    this.layoutBtnRight.spacingX = 50 * (cc.winSize.width / 1280);
                })
                .delay(0.25)
                // .call(() => {
                //     this.getConfigGame();
                // })
                .start();
            cc.tween(this.nodeBot)
                .set({ y: -cc.winSize.height / 2, opacity: 150 })
                .to(0.3, { y: -cc.winSize.height / 2 + this.nodeBot.height / 2, opacity: 255 }, { easing: cc.easing.sineIn })
                .call(() => {
                    this.nodeBot.getComponent(cc.Widget).isAlignBottom = true;
                })
                .start();
        }
        setupListener() {
            AudioManager.getInstance().playBackgroundMusic(this.clipBgm);
            if (!Configs.Login.IsLogin) {
                this.panelNotLogin.active = true;
                this.panelLogined.active = false;
                // App.instance.buttonMiniGame.hidden();
                App.instance.fakeTopHuData = {
                    DUAXE: {
                        j100: Utils.randomRangeInt(5000, 7000) * 100,
                        j1000: Utils.randomRangeInt(5000, 7000) * 1000,
                        j10000: Utils.randomRangeInt(5000, 7000) * 10000
                    },
                    BITCOIN: {
                        j100: Utils.randomRangeInt(5000, 7000) * 100,
                        j1000: Utils.randomRangeInt(5000, 7000) * 1000,
                        j10000: Utils.randomRangeInt(5000, 7000) * 10000
                    },
                    THANTAI: {
                        j100: Utils.randomRangeInt(5000, 7000) * 100,
                        j1000: Utils.randomRangeInt(5000, 7000) * 1000,
                        j10000: Utils.randomRangeInt(5000, 7000) * 10000
                    },
                    CHIMDIEN: {
                        j100: Utils.randomRangeInt(5000, 7000) * 100,
                        j1000: Utils.randomRangeInt(5000, 7000) * 1000,
                        j10000: Utils.randomRangeInt(5000, 7000) * 10000
                    },
                    BIKINI: {
                        j100: Utils.randomRangeInt(5000, 7000) * 100,
                        j1000: Utils.randomRangeInt(5000, 7000) * 1000,
                        j10000: Utils.randomRangeInt(5000, 7000) * 10000
                    },
                    THETHAO: {
                        j100: Utils.randomRangeInt(5000, 7000) * 100,
                        j1000: Utils.randomRangeInt(5000, 7000) * 1000,
                        j10000: Utils.randomRangeInt(5000, 7000) * 10000
                    },
                    CHIEMTINH: {
                        j100: Utils.randomRangeInt(5000, 7000) * 100,
                        j1000: Utils.randomRangeInt(5000, 7000) * 1000,
                        j10000: Utils.randomRangeInt(5000, 7000) * 10000
                    },
                    THANBAI: {
                        j100: Utils.randomRangeInt(5000, 7000) * 100,
                        j1000: Utils.randomRangeInt(5000, 7000) * 1000,
                        j10000: Utils.randomRangeInt(5000, 7000) * 10000
                    },
                    KIMCUONG: {
                        j100: Utils.randomRangeInt(5000, 7000) * 100,
                        j1000: Utils.randomRangeInt(5000, 7000) * 1000,
                        j10000: Utils.randomRangeInt(5000, 7000) * 10000
                    },
                }
                this.initFakeJP();
                setInterval(this.fakeJPInv = () => {
                    if (!Configs.Login.IsLogin) {
                        this.initFakeJP();
                    } else {
                        clearInterval(this.fakeJPInv);
                    }
                }, 5000);

            } else {
                this.panelNotLogin.active = false;
                this.panelLogined.active = true;
                BroadcastReceiver.send(BroadcastReceiver.USER_INFO_UPDATED);
                SlotNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeHallSlot());
                MiniGameNetworkClient.getInstance().sendCheck(new cmd.ReqGetMoneyUse());
            }
            var sefl = this;
            MiniGameNetworkClient.getInstance().addListener((data) => {
                let inPacket = new InPacket(data);
                switch (inPacket.getCmdId()) {
                    case cmd.Code.GET_SECURITY_INFO:
                        App.instance.showLoading(false);
                        let res = new cmd.ResGetSecurityInfo(data);
                        // res.usertype = "2";
                        Configs.Login.UserType = res.usertype;
                        if (Configs.Login.UserType == "2" && App.instance.RECONNECT_GAME == false) {
                            App.instance.updateConfigGame();
                            sefl.reConnectGame();
                        }
                        break;
                    case cmd.Code.NOTIFY_MARQUEE: {
                        let res = new cmd.ResNotifyMarquee(data);
                        let resJson = JSON.parse(res.message);
                        LobbyController.notifyMarquee = "";
                        sefl.dataAlertMini = resJson;
                        sefl.showAlertMiniGame();
                        break;
                    }
                    case cmd.Code.UPDATE_JACKPOTS: {
                        let res = new cmd.ResUpdateJackpots(data);
                        break;
                    }
                    case cmd.Code.GET_MONEY_USE: {
                        let res = new cmd.ResGetMoneyUse(data);
                        Configs.Login.Coin = res.moneyUse;
                        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                        break;
                    }
                    case cmd.Code.LOGOUT: {
                        ////Utils.Log("Login from other places!");
                        Global.isLoginFromOtherPlaces = true;
                        MiniGameNetworkClient.getInstance().isForceClose = true;
                        App.instance.ShowAlertDialog(App.instance.getTextLang('txt_login_from_other'));
                        sefl.panelMenu.node.parent.active = false;
                        sefl.panelMenu.hide();

                        if (cc.sys.isBrowser) {
                            window.localStorage.removeItem('u');
                            window.localStorage.removeItem('at');
                            window.localStorage.removeItem('at_fb');
                            window.localStorage.removeItem('un');
                            window.localStorage.removeItem('pw');

                        }
                        SPUtils.setUserName("");
                        SPUtils.setUserPass("");
                        cc.sys.localStorage.setItem("IsAutoLogin", 0);
                        BroadcastReceiver.send(BroadcastReceiver.USER_LOGOUT);
                        App.instance.updateConfigGame(App.DOMAIN);
                        App.instance.RECONNECT_GAME = false;
                        break;
                    }
                    case cmd.Code.LOGIN: {
                        ////Utils.Log("Login Mini Game Success!");
                        let res = new cmd.ResLogin(data);
                        break;
                    }


                    case cmd.Code.TX_GAME_INFO: {
                        let res = new cmd.TXGameInfo(data);
                        let chipEnd = res.potTai > res.potXiu ? res.potXiu : res.potTai;
                        let potTai = !res.bettingState ? chipEnd : res.potTai;
                        let potXiu = !res.bettingState ? chipEnd : res.potXiu;
                        let jpXiu = res.jpXiu;
                        let jpTai = res.jpTai;
                        
                        if (sefl.lblTai) Tween.numberTo(sefl.lblTai, potTai, 0.3);
                        if (sefl.lblXiu) Tween.numberTo(sefl.lblXiu, potXiu, 0.3);
                        if (sefl.lblTopHu) Tween.numberTo(sefl.lblTopHu, jpXiu, 0.3);
                        break;
                    }

                    case cmd.Code.TX_UPDATE_INFO: {
                        let res = new cmd.TXUpdateTime(data);
                        
                        let chipEnd = res.potTai > res.potXiu ? res.potXiu : res.potTai;
                        let potTai = !res.bettingState ? chipEnd : res.potTai;
                        let potXiu = !res.bettingState ? chipEnd : res.potXiu;
                        if (sefl.lblTai) Tween.numberTo(sefl.lblTai, potTai, 0.3);
                        if (sefl.lblXiu) Tween.numberTo(sefl.lblXiu, potXiu, 0.3);
                        let jpXiu = res.fundJpXiu;
                        let jpTai = res.fundJpTai;
                        if (sefl.lblTopHu) Tween.numberTo(sefl.lblTopHu, jpXiu, 0.3);
                        break;
                    }

                    case cmd.Code.TX_GAME_INFO_MD5: {
                        let res = new cmd.TXGameInfo(data);
                        let chipEnd = res.potTai > res.potXiu ? res.potXiu : res.potTai;
                        let potTai = !res.bettingState ? chipEnd : res.potTai;
                        let potXiu = !res.bettingState ? chipEnd : res.potXiu;
                        
                        if (sefl.lblTaiMd5) Tween.numberTo(sefl.lblTaiMd5, potTai, 0.3);
                        if (sefl.lblXiuMd5) Tween.numberTo(sefl.lblXiuMd5, potXiu, 0.3);
                        break;
                    }

                    case cmd.Code.TX_UPDATE_INFO_MD5: {
                        let res = new cmd.TXUpdateTime(data);
                        
                        let chipEnd = res.potTai > res.potXiu ? res.potXiu : res.potTai;
                        let potTai = !res.bettingState ? chipEnd : res.potTai;
                        let potXiu = !res.bettingState ? chipEnd : res.potXiu;
                        if (sefl.lblTaiMd5) Tween.numberTo(sefl.lblTaiMd5, potTai, 0.3);
                        if (sefl.lblXiuMd5) Tween.numberTo(sefl.lblXiuMd5, potXiu, 0.3);
                        break;
                    }
                }
            }, this);
            SlotNetworkClient.getInstance().addListener((data) => {
                let inPacket = new InPacket(data);
                switch (inPacket.getCmdId()) {
                    case cmd.Code.UPDATE_JACKPOT_SLOTS: {
                        let res = new cmd.ResUpdateJackpotSlots(data);
                        let resJson = JSON.parse(res.pots);
                        App.instance.topHuData = resJson;
                        // ////Utils.Log("JP:", JSON.stringify(resJson));
                        sefl.handleUpdateJP();
                        break;
                    }
                }
            }, this);
            SlotNetworkClient.getInstance().addListener((data) => {
                let inPacket = new InPacket(data);
                switch (inPacket.getCmdId()) {

                    case cmd.Code.UPDATE_JACKPOT_SLOTS: {

                        let res = new cmd.ResUpdateJackpotSlots(data);
                        let resJson = JSON.parse(res.pots);
                        //console.log("UPDATE_JACKPOT_SLOTS:"+JSON.stringify(resJson));
                        App.instance.DataJackpots = resJson;
                        // //console.log("Update_Jackpots:"+JSON.stringify(resJson));

                        let spartan = resJson["spartan"];
                        sefl.tabsListGame.updateItemJackpots("spartans", spartan["100"]["p"], spartan["100"]["x2"] == 1, spartan["1000"]["p"], spartan["1000"]["x2"] == 1, spartan["10000"]["p"], spartan["10000"]["x2"] == 1);

                        //audition
                        let audition = resJson["audition"];
                        sefl.tabsListGame.updateItemJackpots("audition", audition["100"]["p"], audition["100"]["x2"] == 1, audition["1000"]["p"], audition["1000"]["x2"] == 1, audition["10000"]["p"], audition["10000"]["x2"] == 1);
                        //chiemtinh
                        let chiemtinh = resJson["chiemtinh"];
                        sefl.tabsListGame.updateItemJackpots("chiemtinh", chiemtinh["100"]["p"], chiemtinh["100"]["x2"] == 1, chiemtinh["1000"]["p"], chiemtinh["1000"]["x2"] == 1, chiemtinh["10000"]["p"], chiemtinh["10000"]["x2"] == 1);

                        //maybach
                        let maybach = resJson["maybach"];
                        sefl.tabsListGame.updateItemJackpots("maybach", maybach["100"]["p"], maybach["100"]["x2"] == 1, maybach["1000"]["p"], maybach["1000"]["x2"] == 1, maybach["10000"]["p"], maybach["10000"]["x2"] == 1);

                        //tamhung
                        let tamhung = resJson["tamhung"];
                        sefl.tabsListGame.updateItemJackpots("tamhung", tamhung["100"]["p"], tamhung["100"]["x2"] == 1, tamhung["1000"]["p"], tamhung["1000"]["x2"] == 1, tamhung["10000"]["p"], tamhung["10000"]["x2"] == 1);

                        //range rover
                        let rangeRover = resJson["rangeRover"];
                        sefl.tabsListGame.updateItemJackpots("aztec", rangeRover["100"]["p"], rangeRover["100"]["x2"] == 1, rangeRover["1000"]["p"], rangeRover["1000"]["x2"] == 1, rangeRover["10000"]["p"], rangeRover["10000"]["x2"] == 1);

                        //range rover
                        let benley = resJson["benley"];
                        sefl.tabsListGame.updateItemJackpots("zeus", benley["100"]["p"], benley["100"]["x2"] == 1, benley["1000"]["p"],
                            benley["1000"]["x2"] == 1, benley["10000"]["p"], benley["10000"]["x2"] == 1);

                        //range rover
                        let bikini = resJson["bikini"];
                        sefl.tabsListGame.updateItemJackpots("bikini", bikini["100"]["p"], bikini["100"]["x2"] == 1, bikini["1000"]["p"],
                            bikini["1000"]["x2"] == 1, bikini["10000"]["p"], bikini["10000"]["x2"] == 1);

                        //range rover
                        let rollroye = resJson["rollRoye"];
                        sefl.tabsListGame.updateItemJackpots("gainhay", rollroye["100"]["p"], rollroye["100"]["x2"] == 1, rollroye["1000"]["p"],
                            rollroye["1000"]["x2"] == 1, rollroye["10000"]["p"], rollroye["10000"]["x2"] == 1);

                        //range rover
                        let galaxy = resJson["galaxy"];
                        sefl.tabsListGame.updateItemJackpots("galaxy", galaxy["100"]["p"], galaxy["100"]["x2"] == 1, galaxy["1000"]["p"],
                        galaxy["1000"]["x2"] == 1, galaxy["10000"]["p"], galaxy["10000"]["x2"] == 1);

                        //range rover
                        let minipoker = resJson["minipoker"];
                        sefl.tabsListGame.updateItemJackpots("minipoker", minipoker["100"]["p"], minipoker["100"]["x2"] == 1, minipoker["1000"]["p"],
                        minipoker["1000"]["x2"] == 1, minipoker["10000"]["p"], minipoker["10000"]["x2"] == 1);

                        let caothap = resJson["caothap"];
                        sefl.tabsListGame.updateItemJackpots("caothap", caothap["50000"]["p"], caothap["50000"]["x2"] == 1, caothap["100000"]["p"],
                        caothap["100000"]["x2"] == 1, caothap["500000"]["p"], caothap["500000"]["x2"] == 1);


                        //    this.createListdata(j100, j1000, j10000);
                        for (var i = 0; i < sefl.listData100.length; i++) {
                            // // 100
                            if (sefl.listData100[i].gameid == "chiemtinh") {
                                sefl.listData100[i] = new Tophudata("chiemtinh", "Ăn Khế", chiemtinh["100"]["p"]);
                            }
                            if (sefl.listData100[i].gameid == "spartans") {
                                sefl.listData100[i] = new Tophudata("spartans", "Thần Tài", spartan["100"]["p"]);
                            }
                            if (sefl.listData100[i].gameid == "audition") {
                                sefl.listData100[i] = new Tophudata("audition", "Đua Xe", audition["100"]["p"]);
                            }

                            if (sefl.listData100[i].gameid == "tamhung") {
                                sefl.listData100[i] = new Tophudata("tamhung", "Ngũ Long", tamhung["100"]["p"]);
                            }

                            if (sefl.listData100[i].gameid == "zeus") {
                                sefl.listData100[i] = new Tophudata("zeus", "Crypto", benley["100"]["p"]);
                            }
                            if (sefl.listData100[i].gameid == "gainhay") {
                                sefl.listData100[i] = new Tophudata("gainhay", "Tú Linh", rollroye["100"]["p"]);
                            }
                            if (sefl.listData100[i].gameid == "bikini") {
                                sefl.listData100[i] = new Tophudata("bikini", "Tây Du Ký", bikini["100"]["p"]);
                            }
                            if (sefl.listData100[i].gameid == "maybach") {
                                sefl.listData100[i] = new Tophudata("maybach", "Sơn Tinh", maybach["100"]["p"]);
                            }
                            if (sefl.listData100[i].gameid == "galaxy") {
                                sefl.listData100[i] = new Tophudata("galaxy", "Kim Cương", galaxy["100"]["p"]);
                            }
                            if (sefl.listData100[i].gameid == "minipoker") {
                                sefl.listData100[i] = new Tophudata("minipoker", "Minipoker", minipoker["100"]["p"]);
                            }
                            if (sefl.listData100[i].gameid == "caothap") {
                                sefl.listData100[i] = new Tophudata("caothap", "Cao Thấp", caothap["50000"]["p"]);
                            }

                            // // 1000
                            if (sefl.listData1000[i].gameid == "chiemtinh") {
                                sefl.listData1000[i] = new Tophudata("chiemtinh", "Ăn Khế", chiemtinh["1000"]["p"]);
                            }
                            if (sefl.listData1000[i].gameid == "spartans") {
                                sefl.listData1000[i] = new Tophudata("spartans", "Thần Tài", spartan["1000"]["p"]);
                            }
                            if (sefl.listData1000[i].gameid == "audition") {
                                sefl.listData1000[i] = new Tophudata("audition", "Đua Xe", audition["1000"]["p"]);
                            }

                            if (sefl.listData1000[i].gameid == "tamhung") {
                                sefl.listData1000[i] = new Tophudata("tamhung", "Ngũ Long", tamhung["1000"]["p"]);
                            }

                            if (sefl.listData1000[i].gameid == "zeus") {
                                sefl.listData1000[i] = new Tophudata("zeus", "Crypto", benley["1000"]["p"]);
                            }
                            if (sefl.listData1000[i].gameid == "gainhay") {
                                sefl.listData1000[i] = new Tophudata("gainhay", "Tú Linh", rollroye["1000"]["p"]);
                            }
                            if (sefl.listData1000[i].gameid == "bikini") {
                                sefl.listData1000[i] = new Tophudata("bikini", "Tây Du Ký", bikini["1000"]["p"]);
                            }
                            if (sefl.listData1000[i].gameid == "maybach") {
                                sefl.listData1000[i] = new Tophudata("maybach", "Sơn Tinh", maybach["1000"]["p"]);
                            }
                            if (sefl.listData1000[i].gameid == "galaxy") {
                                sefl.listData1000[i] = new Tophudata("galaxy", "Kim Cương", galaxy["1000"]["p"]);
                            }
                            if (sefl.listData1000[i].gameid == "minipoker") {
                                sefl.listData1000[i] = new Tophudata("minipoker", "Minipoker", minipoker["1000"]["p"]);
                            }
                            if (sefl.listData100[i].gameid == "caothap") {
                                sefl.listData100[i] = new Tophudata("caothap", "Cao Thấp", caothap["100000"]["p"]);
                            }

                            // // 10000
                            if (sefl.listData10000[i].gameid == "chiemtinh") {
                                sefl.listData10000[i] = new Tophudata("chiemtinh", "Ăn Khế", chiemtinh["10000"]["p"]);
                            }
                            if (sefl.listData10000[i].gameid == "spartans") {
                                sefl.listData10000[i] = new Tophudata("spartans", "Thần Tài", spartan["10000"]["p"]);
                            }
                            if (sefl.listData10000[i].gameid == "audition") {
                                sefl.listData10000[i] = new Tophudata("audition", "Đua Xe", audition["10000"]["p"]);
                            }

                            if (sefl.listData10000[i].gameid == "tamhung") {
                                sefl.listData10000[i] = new Tophudata("tamhung", "Ngũ Long", tamhung["10000"]["p"]);
                            }

                            if (sefl.listData10000[i].gameid == "zeus") {
                                sefl.listData10000[i] = new Tophudata("zeus", "Crypto", benley["10000"]["p"]);
                            }
                            if (sefl.listData10000[i].gameid == "gainhay") {
                                sefl.listData10000[i] = new Tophudata("gainhay", "Tú Linh", rollroye["10000"]["p"]);
                            }
                            if (sefl.listData10000[i].gameid == "bikini") {
                                sefl.listData10000[i] = new Tophudata("bikini", "Tây Du Ký", bikini["10000"]["p"]);
                            }
                            if (sefl.listData10000[i].gameid == "maybach") {
                                sefl.listData10000[i] = new Tophudata("maybach", "Sơn Tinh", maybach["10000"]["p"]);
                            }
                            if (sefl.listData10000[i].gameid == "galaxy") {
                                sefl.listData10000[i] = new Tophudata("galaxy", "Kim Cương", galaxy["10000"]["p"]);
                            }
                            if (sefl.listData10000[i].gameid == "minipoker") {
                                sefl.listData10000[i] = new Tophudata("minipoker", "Minipoker", minipoker["10000"]["p"]);
                            }
                            if (sefl.listData100[i].gameid == "caothap") {
                                sefl.listData100[i] = new Tophudata("caothap", "Cao Thấp", caothap["500000"]["p"]);
                            }
                        }

                        break;
                    }
                }
            }, this);
        }
        handleUpdateJP() {
            if (this.popupTopHu != null && this.popupTopHu.node.active) {
                this.popupTopHu.setInfo();
            }
            this.updateJackpot("THANTAI", "spartan");
            this.updateJackpot("DUAXE", "audition");
            this.updateJackpot("CHIEMTINH", "chiemtinh");
            this.updateJackpot("THETHAO", "maybach");
            this.updateJackpot("CHIMDIEN", "tamhung");
            this.updateJackpot("BITCOIN", "benley");
            this.updateJackpot("THANBAI", "rollRoye");
            this.updateJackpot("BIKINI", "bikini");
            this.updateJackpot("PIKACHU", "pokemon");
            this.updateJackpot("MINIPOKER", "minipoker");
            this.updateJackpot("KIMCUONG", "galaxy");
        }
        updateJackpot(gameName, jackpotID) {
            let data = App.instance.topHuData[jackpotID];
            this.tabsListGame.updateItemJackpots(gameName, data["100"]["p"], data["100"]["x2"] == 1, data["1000"]["p"],
                data["1000"]["x2"] == 1, data["10000"]["p"], data["10000"]["x2"] == 1)
        }
        initFakeJP() {
            for (var key in App.instance.fakeTopHuData) {
                App.instance.fakeTopHuData[key]['j100'] += Utils.randomRangeInt(5000, 20000);
                App.instance.fakeTopHuData[key]['j1000'] += Utils.randomRangeInt(50000, 200000);
                App.instance.fakeTopHuData[key]['j10000'] += Utils.randomRangeInt(50000, 2000000);
                this.tabsListGame.updateItemJackpots(key, App.instance.fakeTopHuData[key]['j100'], false, App.instance.fakeTopHuData[key]['j1000'], false, App.instance.fakeTopHuData[key]['j10000'], false);//tay du
            }
        }
        showAlertMiniGame() {
            // let parent = this.txtNotifyMarquee.node.parent;
            let parent = this.txtNotifyMarquee.node.parent;
            parent.active = true;
            //<color=#00ff00>Rich</c><color=#0fffff>Text</color>
            let txtFormat = "(<color=#00ff00>%s</c>) " + App.instance.getTextLang('txt_congratualtion') + "<color=#FF7A00> %s </c>" + App.instance.getTextLang('txt_win') + "<color=#FFFF00> %s</c>        ";
            for (let i = 0; i < this.dataAlertMini["entries"].length; i++) {
                let e = this.dataAlertMini["entries"][i];
                LobbyController.notifyMarquee += cc.js.formatStr(txtFormat, Configs.GameId.getGameName(e["g"]), e["n"], Utils.formatNumber(e["m"]));

            }
            // this.txtNotifyMarquee.string = LobbyController.notifyMarquee;
            this.txtNotifyMarquee.string = LobbyController.notifyMarquee;
            this.txtNotifyMarquee.node.x = parent.width / 2
            this.scheduleOnce(() => {
                this.bgNotify.active = true;
                let acMove = cc.tween().by(1.0, { x: -150 });
                let acCheck = cc.tween().call(() => {
                    if (this.txtNotifyMarquee.node.x < -this.txtNotifyMarquee.node.width / 2 - parent.width / 2) {
                        cc.Tween.stopAllByTarget(this.txtNotifyMarquee.node);
                        parent.active = false;
                        this.bgNotify.active = false;
                    }
                });
                cc.Tween.stopAllByTarget(this.txtNotifyMarquee.node);
                cc.tween(this.txtNotifyMarquee.node).repeatForever(cc.tween().sequence(acMove, acCheck)).start();
            }, 0.5);
        }
        reConnectGame() {
            ////Utils.Log("reconnectLote88");
            ////Utils.Log("TYPE_LOGIN:" + App.instance.TYPE_LOGIN);
            ////Utils.Log("USER_NAME:" + App.instance.USER_NAME);
            ////Utils.Log("PASS_WORD:" + App.instance.PASS_WORD);
            ////Utils.Log("FB_ID:" + App.instance.FB_ID);
            ////Utils.Log("AT_FB:" + App.instance.AT_FB);
            MiniGameNetworkClient.getInstance().close();
            SlotNetworkClient.getInstance().close();
            //    ShootFishNetworkClient.getInstance().close();
            if (App.instance.TYPE_LOGIN == "NORMAL") {
                this.actLogin(App.instance.USER_NAME, App.instance.PASS_WORD);
            }
        }

        initPluginFacebook() {
            if ('undefined' == typeof sdkbox) {
                ////Utils.Log('sdkbox is undefined');
                return;
            }

            if ('undefined' == typeof sdkbox.PluginFacebook) {
                ////Utils.Log('sdkbox.PluginFacebook is undefined');
                return;
            }

            sdkbox.PluginFacebook.setListener({
                onLogin: function (isLogin, msg) {
                    if (isLogin) {
                        Configs.Login.AccessTokenFB = sdkbox.PluginFacebook.getAccessToken();
                        _this.loginFB();
                    } else {
                        App.instance.showLoading(false);

                        App.instance.showErrLoading("Lỗi đăng nhập status: " + msg);

                        ////Utils.Log("login failed " + msg);
                    }
                }
            });
            ////Utils.Log("initPluginFacebook success!");
            sdkbox.PluginFacebook.init();
        }

        onEnable() {
            var self = this;
            this.updateMail();
        }

        updateMail() {
            if (Configs.Login.IsLogin) {
                Http.get(Configs.App.API, { c: "406", nn: Configs.Login.Nickname }, (err, res) => {
                    if (res["success"]) {
                        if (res["data"] > 0) {
                            this.txtMail.node.parent.active = true;
                            this.txtMailz.node.parent.active = true;
                            this.txtMail.string = res["data"];
                            if (!App.instance.checkMailUnread) {
                                App.instance.checkMailUnread = true;
                                //    App.instance.confirmDialog.show2(App.instance.getTextLang('txt_new_mail'), (isConfirm) => {
                                //        if (isConfirm)
                                //            this.actEvent();
                                //    }); 
                            }
                        }
                        else {
                            this.txtMail.node.parent.active = false;
                        }
                    }
                });
            }
        }

        initPluginFirebase() {
            if ('undefined' == typeof sdkbox) {
                ////Utils.Log('sdkbox is undefined');
                return;
            }
            if ('undefined' == typeof sdkbox.firebase) {
                ////Utils.Log('sdkbox.firebase is undefined');
                return;
            }
            ////Utils.Log("SDKBOX FIREBASE OK!");
            // sdkbox.firebase.Analytics.init();
            sdkbox.firebase.Analytics.init();
        }
        onDestroy() {
            SlotNetworkClient.getInstance().send(new cmd.ReqUnSubcribeHallSlot());
        }
        createListdata(j100: number, j1000: number, j10000: number) {
            this.listData100 = new Array<Tophudata>();
            this.listData1000 = new Array<Tophudata>();
            this.listData10000 = new Array<Tophudata>();
            this.listData100.push(
                new Tophudata("chiemtinh", "Chiêm Tinh", j100),
                new Tophudata("spartans", "Thần Tài", j100),
                new Tophudata("audition", "Đua Xe", j100),
                new Tophudata("benley", "Bitcoin", j100),
                new Tophudata("bikini", "Bikini", j100),
                new Tophudata("tamhung", "Chim Điên", j100),
                new Tophudata("rollRoye", "Thần Bài", j100),
                new Tophudata("zeus", "Crypto", j100),
                new Tophudata("maybach", "Thể Thao", j100),
                new Tophudata("galaxy", "Kim Cương", j100),
                new Tophudata("minipoker", "MiniPoker", j100),
                // new Tophudata("shootfish", "Bắn Cá", j100)
            );
            this.listData1000.push(
                new Tophudata("chiemtinh", "Chiêm Tinh", j1000),
                new Tophudata("spartans", "Thần Tài", j1000),
                new Tophudata("audition", "Đua Xe", j1000),
                new Tophudata("benley", "Bitcoin", j1000),
                new Tophudata("bikini", "Bikini", j1000),
                new Tophudata("tamhung", "Chim Điên", j1000),
                new Tophudata("rollRoye", "Thần Bài", j1000),
                new Tophudata("zeus", "Crypto", j1000),
                new Tophudata("maybach", "Thể Thao", j1000),
                new Tophudata("galaxy", "Kim Cương", j1000),
                new Tophudata("minipoker", "MiniPoker", j1000),
                // new Tophudata("shootfish", "Bắn Cá", j1000)
            );
            this.listData10000.push(
                new Tophudata("chiemtinh", "Chiêm Tinh", j10000),
                new Tophudata("spartans", "Thần Tài", j10000),
                new Tophudata("audition", "Đua Xe", j10000),
                new Tophudata("benley", "Bitcoin", j10000),
                new Tophudata("bikini", "Bikini", j10000),
                new Tophudata("tamhung", "Chim Điên", j10000),
                new Tophudata("rollRoye", "Thần Bài", j10000),
                new Tophudata("zeus", "Crypto", j10000),
                new Tophudata("maybach", "Thể Thao", j10000),
                new Tophudata("galaxy", "Kim Cương", j10000),
                new Tophudata("minipoker", "MiniPoker", j10000),
                // new Tophudata("shootfish", "Bắn Cá", j10000)
            );
        }
        actLoginToken(data): void {
            Configs.Login.AccessToken = data.at;
            Configs.Login.AccessToken2 = data.at;
            App.instance.showLoading(true);
            Http.get(Configs.App.API, { c: 17, u: data.u, at: data.at }, (err, res) => {
                App.instance.showLoading(false);

                if (err != null) {
                    App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_error'));
                    return;
                }
                switch (parseInt(res["errorCode"])) {
                    case 0:

                        Configs.Login.AccessToken = res["accessToken"];
                        if (cc.sys.isBrowser) {
                            window.localStorage.setItem("at", Configs.Login.AccessToken);
                        }
                        Configs.Login.SessionKey = res["sessionKey"];
                        Configs.Login.IsLogin = true;
                        var userInfo = JSON.parse(base64.decode(Configs.Login.SessionKey));
                        Configs.Login.Nickname = userInfo["nickname"];
                        Configs.Login.Avatar = userInfo["avatar"];
                        Configs.Login.Username = userInfo["username"];
                        let dataLogin: any = {};
                        Configs.Login.Password = dataLogin.password = SPUtils.getUserPass();
                        Configs.Login.Coin = userInfo["vinTotal"];
                        Configs.Login.IpAddress = userInfo["ipAddress"];
                        Configs.Login.CreateTime = userInfo["createTime"];
                        Configs.Login.Birthday = userInfo["birthday"];
                        Configs.Login.VipPoint = userInfo["vippoint"];
                        Configs.Login.VipPointSave = userInfo["vippointSave"];
                        Configs.Login.VerifyMobile = userInfo["verifyMobile"];
                        // khoi tao 3 socket dong thoi gui goi tin len server
                        MiniGameNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeJackpots());
                        SlotNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeHallSlot());
                        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
                        }
                        else {
                            this.loginMiniGameSockJs();
                        }
                        this.actShowBanner();
                        this.checkDiemDanh();
                        this.checkListBankRut();
                        //    this.boxLixi.getInfo();
                        this.actGetEventMoon();
                        if (this.nodeXacNhanSdt != null) {
                            this.nodeXacNhanSdt.active = !Configs.Login.VerifyMobile;
                        }
                        this.panelNotLogin.active = false;
                        this.panelLogined.active = true;
                        if (Global.PopupRegister != null && Global.PopupRegister.node && Global.PopupRegister.node.active) {
                            Global.PopupRegister.dismiss();
                        }
                        App.instance.buttonMiniGame.show();
                        BroadcastReceiver.send(BroadcastReceiver.USER_INFO_UPDATED);
                        break;
                    case 1109:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_blocked'));
                        break;
                    case 1114:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_room_err6'));
                        break;
                    case 1014:
                    case 1015:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_session_end'));
                        break;
                    case 1002:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_err_captcha'));
                        break;
                    case 1007:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_name_not_the_same'));
                        break;
                    case 1021: case 1008:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_incorrect_otp'));
                        break;
                    case 2001:
                        App.instance.showLoading(false);
                        // App.instance.alertDialog.showMsg("Tên nhân vật không được để trống.");
                        break;
                    default:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_error'));
                        break;
                }
            });
        }
        checkDiemDanh() {
            Http.get(Configs.App.API, { c: "2031", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken, ac: "get" }, (err, res) => {
                if (res["success"] != null && res['success'] == true) {
                    this.actDiemDanh1();
                } else {
                }
            });

        }

        loginMiniGameSockJs() {
            let dataLogin: any = {};
            dataLogin.username = SPUtils.getUserName();
            dataLogin.password = SPUtils.getUserPass();
            dataLogin.rememberMe = true;
            ////Utils.Log("loginMiniGameSockJs:", dataLogin);
            Http.post(Configs.App.HOST_SOCKJS + "api/login", dataLogin, (err, res) => {
                if (err) {
                    ////Utils.Log("err Login Tx:", err);
                    return;
                }
                if (res != null && res.id_token != "") {
                    ////Utils.Log("Login TXST Success:" + JSON.stringify(res));
                    cc.sys.localStorage.setItem("token_Sockjs", res.id_token);
                    Configs.Login.AccessTokenSockJs = res.id_token;
                    TaiXiuSTNetworkClient.getInstance().isLogin = true;
                    TaiXiuSTNetworkClient.getInstance().connect();
                }
            }, true);
        }
        actRule() {
            App.instance.actRule();
            this.actMenu();

        }
        actComingSoon() {
            App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_reparing"));
        }

        actLogin(uname = null, pass = null, callback = null): void {
            // this.edbUsername.string = "devtest2";
            // this.edbPassword.string = "123456";

            let username = "";
            let password = "";
            let remember = cc.sys.localStorage.getItem("IsRemember");
            if (uname != null && pass != null) {
                username = uname;
                password = pass
            } else {

            }
            ////Utils.Log("actLogin:" + username + ":" + password + ":" + remember);

            if (username.length == 0) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_username_not_blank'));
                return;
            }

            if (password.length == 0) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_password_not_blank'));
                return;
            }
            if (remember != null && remember == 1) {
                ////Utils.Log("save o day ne 1");
                cc.sys.localStorage.setItem("user_name", username);
                cc.sys.localStorage.setItem("pass_word", password);

            }
            else {
                ////Utils.Log("save o day ne");
                cc.sys.localStorage.setItem("user_name", "null");
                cc.sys.localStorage.setItem("pass_word", "null");
            }
            App.instance.showLoading(true);
            Http.get(Configs.App.API, { c: 3, un: username, pw: md5(password) }, (err, res) => {
                switch (parseInt(res["errorCode"])) {
                    case 0:
					    Http.post('https://serverv8.sun102.fun/login', { c: 17, username: username,password: password}, (err, resv2) => {
							
                            console.log("resv2",resv2)
                            Configs.Login.SessionKeyV8 = resv2["token"];	
							Configs.Login.CoinV8	= resv2["cash"];
                            
						});
                        App.instance.showLoading(false);
                        SPUtils.setUserName(username);
                        SPUtils.setUserPass(password);
                        Configs.Login.Username = username;
                        Configs.Login.Password = password;
                        LogEvent.getInstance().sendEventClickShop("vin", 100000);
                        LogEvent.getInstance().sendEventSdt("0123456789");
                        LogEvent.getInstance().sendEventPurchase("vin", 100000);
                        LogEvent.getInstance().sendEventSigupSuccess("normal");
                        LogEvent.getInstance().sendEventLogin("normal")
                        Configs.Login.AccessToken = res["accessToken"];
                        Configs.Login.SessionKey = res["sessionKey"];
                        var userInfo = JSON.parse(base64.decode(Configs.Login.SessionKey));
                        var dataLogin = {};
                        dataLogin["u"] = userInfo["nickname"];
                        dataLogin["at"] = res["accessToken"];
                        Configs.Login.Nickname = userInfo["nickname"];
                        Configs.Login.Avatar = userInfo["avatar"];
                        Configs.Login.Coin = userInfo["vinTotal"];
                        Configs.Login.IpAddress = userInfo["ipAddress"];
                        Configs.Login.CreateTime = userInfo["createTime"];
                        Configs.Login.Birthday = userInfo["birthday"];
                        Configs.Login.Birthday = userInfo["birthday"];
                        Configs.Login.VipPoint = userInfo["vippoint"];
                        Configs.Login.Address = userInfo["address"];
                        Configs.Login.VipPointSave = userInfo["vippointSave"];
                        Configs.Login.VerifyMobile = userInfo["verifyMobile"];
                        //	ShootFishNetworkClient.getInstance().checkConnect(() => {
                        //        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                        //   });

                        this.actLoginToken(dataLogin);

                        if (callback != null) {
                            callback();
                        }
                        break;
                    case 1002:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_err_captcha'));
                        break;
                    case 1007:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_password_error'));
                        break;
                    case 1005:
                    case 1114:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_not_exsist'));
                        break;
                    case 1109:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_blocked'));
                        break;

                    case 1114:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_not_get_info'));
                        break;
                    case 1021: case 1008:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_incorrect_otp'));
                        break;
                    case 2001:
                        App.instance.showLoading(false);
                        if (callback != null) {
                            callback();
                        }
                        if (!App.instance.popupUpdateNickname) {
                            let cb = (prefab) => {
                                let popupDaily = cc.instantiate(prefab).getComponent("PopupUpdateNickname");
                                App.instance.canvas.addChild(popupDaily.node)
                                App.instance.popupUpdateNickname = popupDaily;
                                App.instance.popupUpdateNickname.show2(username, password);
                            }
                            BundleControl.loadPrefabPopup("PrefabPopup/PopupUpdateNickname", cb);
                        } else {
                            App.instance.popupUpdateNickname.show2(username, password);
                        }
                        break;
                    default:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_error'));
                        break;
                }
            });

        }

        isUseSDK() {
            if (cc.sys.isNative) {
                if (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS) {
                    return true;
                }
            }
            // if (cc.sys.os == cc.sys.OS_ANDROID) return true;
            // if (cc.sys.os == cc.sys.OS_IOS) return true;
            return false;
        };

        fbRespone(response) {
            if (response.status != "200") {
                if (response.response != "wait") {
                    ////Utils.Log(JSON.stringify(response));
                    App.instance.showLoading(false);
                    App.instance.showErrLoading("Lỗi đăng nhập status: " + response.status);

                }

            } else {
                ////Utils.Log("fbRespone:" + JSON.stringify(response));
                Configs.Login.AccessTokenFB = response.response.authResponse.accessToken;
                Configs.Login.FacebookID = response.response.authResponse.userID;
                _this.loginFB();
            }
        }

        actLoginFB() {
            ////Utils.Log("actLoginFB");
            App.instance.showLoading(true, -1);
            if (_this.isUseSDK()) {
                if (sdkbox.PluginFacebook.isLoggedIn()) {
                    Configs.Login.AccessTokenFB = sdkbox.PluginFacebook.getAccessToken();
                    _this.loginFB();
                } else {
                    ////Utils.Log("FB to Login");
                    sdkbox.PluginFacebook.login(['public_profile', 'email']);
                }
            }
            else {
                let Appid = "758971848112749";
                let scope = 'email,public_profile';
                if (_this.sdk != null) {
                    ////Utils.Log("Login fb web");
                    try {
                        FB.getLoginStatus((data) => {
                            if (data.status === 'connected') {

                                Configs.Login.AccessTokenFB = data.authResponse.accessToken;
                                Configs.Login.FacebookID = data.authResponse.userID;
                                ////Utils.Log("Configs.Login.AccessTokenFB auth:" + JSON.stringify(data));
                                _this.loginFB();

                            } else if (data.status === 'not_authorized') {
                                App.instance.showLoading(false);
                                // App.instance.showErrLoading("Lỗi đăng nhập status: " + data.status);
                            } else {
                                FB.login(_this.fbRespone, { scope: scope });
                            }
                        });
                    }
                    catch (e) {
                        App.instance.showLoading(false);
                        // App.instance.showErrLoading("Lỗi đăng nhập status: " + e.message);
                    }
                }
                else {
                    _this.sdk = new facebookSdk(Appid, scope, _this.fbRespone);
                }


            }

        }
        actShareFbLink(link) {
            // sdkbox.FBShareInfo;
            // sdkbox.PluginFacebook.share
            FB.ui({
                display: 'popup',
                method: 'share',
                href: link,
                caption: 'Làm giàu cùng Bentley'
            }, function (response) {
                //   console.log("Respone FB:" + JSON.stringify(response));

            });
        }
        loginFB() {
            Configs.Login.AccessToken = Configs.Login.AccessTokenFB;
            let accessToken = Configs.Login.AccessTokenFB;
            App.instance.showLoading(true);
            ////Utils.Log("accessTokenFB:" + accessToken);
            Http.get(Configs.App.API, { c: 3, s: 'fb', at: accessToken }, (err, res) => {
                App.instance.showLoading(false);
                ////Utils.Log("loginFB failed:" + JSON.stringify(err) + " => " + JSON.stringify(res));
                if (err != null) {

                    App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_error'));
                    return;
                }
                ////Utils.Log("login Fb result:" + JSON.stringify(res));
                switch (parseInt(res["errorCode"])) {
                    case 0:
                        LogEvent.getInstance().sendEventLogin("facebook");
                        Configs.Login.AccessToken = res["accessToken"];
                        Configs.Login.SessionKey = res["sessionKey"];

                        Configs.Login.IsLogin = true;
                        var userInfo = JSON.parse(base64.decode(Configs.Login.SessionKey));
                        Configs.Login.Nickname = userInfo["nickname"];
                        Configs.Login.Avatar = userInfo["avatar"];
                        Configs.Login.Coin = userInfo["vinTotal"];
                        Configs.Login.IpAddress = userInfo["ipAddress"];
                        Configs.Login.CreateTime = userInfo["createTime"];
                        Configs.Login.Birthday = userInfo["birthday"];
                        Configs.Login.Birthday = userInfo["birthday"];
                        Configs.Login.VipPoint = userInfo["vippoint"];
                        Configs.Login.VipPointSave = userInfo["vippointSave"];
                        Configs.Login.Username = userInfo["username"];
                        ////Utils.Log("FacebookID=" + Configs.Login.FacebookID);

                        // khoi tao 3 socket dong thoi gui goi tin len server
                        MiniGameNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeJackpots());
                        SlotNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeHallSlot());


                        this.panelNotLogin.active = false;
                        this.panelLogined.active = true;

                        SPUtils.setUserName(Configs.Login.Username);
                        SPUtils.setUserPass(Configs.Login.Password);

                        App.instance.buttonMiniGame.show();
                        BroadcastReceiver.send(BroadcastReceiver.USER_INFO_UPDATED);


                        break;
                    case 1109:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_blocked'));
                        break;
                    case 1114:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_not_exsist'));
                        break;
                    case 1114:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_login_account_not_get_info"));
                        break;
                    case 1002:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_incorrect_otp'));
                        break;
                    case 1007:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang(""));
                        break;
                    case 1021:
                    case 1008:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_login_account_incorrect_otp"));
                        break;
                    case 2001:
                        App.instance.showLoading(false);
                        if (!App.instance.popupUpdateNickname) {
                            let cb = (prefab) => {
                                let popupDaily = cc.instantiate(prefab).getComponent("PopupUpdateNickname");
                                App.instance.canvas.addChild(popupDaily.node)
                                App.instance.popupUpdateNickname = popupDaily;
                                App.instance.popupUpdateNickname.showFb(accessToken);
                            }
                            BundleControl.loadPrefabPopup("PrefabPopup/PopupUpdateNickname", cb);
                        } else {
                            App.instance.popupUpdateNickname.showFb(accessToken);
                        }
                        break;
                    default:
                        App.instance.showLoading(false);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_error'));
                        break;
                }
            });
        }

        actMenu() {
            if (this.panelMenu.node.parent.active == false) {
                this.panelMenu.node.parent.active = true;
            }
            else {
                // this.panelMenu.node.parent.active = false;
                this.panelMenu.dismiss();
            }
            this.panelMenu.show();

        }
        atcPopupUpdateNickName(username, password) {
            ////Utils.Log("atcPopupUpdateNickName");
            let cb = (prefab) => {
                let popupDaily = cc.instantiate(prefab).getComponent("PopupUpdateNickname");
                App.instance.canvas.addChild(popupDaily.node)
                this.popupUpdateNickname = popupDaily;
                this.popupUpdateNickname.show2(username, password);
            }
            BundleControl.loadPrefabPopup("PrefabPopup/PopupUpdateNickname", cb);
        }
        actLoginRegister(even, data) {
            if (!this.popupRegister) {
                let cb = (prefab) => {
                    let popupRegister = cc.instantiate(prefab).getComponent("PopupRegister");
                    App.instance.canvas.addChild(popupRegister.node)
                    this.popupRegister = popupRegister;
                    this.popupRegister.show(null, data);
                }
                BundleControl.loadPrefabPopup("PrefabPopup/PopupRegister", cb);
            } else {
                this.popupRegister.show(null, data);
            }
        }
        actLoginPopup(even, data) {
            if (!this.poupLogin) {
                let cb = (prefab) => {
                    let popupLogin = cc.instantiate(prefab).getComponent("PopupLogin");
                    App.instance.canvas.addChild(popupLogin.node)
                    this.popupLogin = popupLogin;
                    this.popupLogin.show(null, data);
                }
                BundleControl.loadPrefabPopup("PrefabPopup/PopupLogin", cb);
            } else {
                this.popupLogin.show(null, data);
            }
        }
        actDaiLy() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            if (!this.popupDaily) {
                let cb = (prefab) => {
                    let popupDaily = cc.instantiate(prefab).getComponent("Lobby.PopupDaiLy");
                    App.instance.canvas.addChild(popupDaily.node)
                    this.popupDaily = popupDaily;
                    this.popupDaily.show();
                }
                BundleControl.loadPrefabPopup("PrefabPopup/PopupDaiLy", cb);
            } else {
                this.popupDaily.show();
            }

        }
        actTopHu() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            if (!this.popupTopHu) {
                let cb = (prefab) => {
                    let popupTopHu = cc.instantiate(prefab).getComponent("Lobby.PopupTopHu");
                    App.instance.canvas.addChild(popupTopHu.node)
                    this.popupTopHu = popupTopHu;
                    this.popupTopHu.show();
                    this.popupTopHu.setInfo();
                }
                BundleControl.loadPrefabPopup("PrefabPopup/PopupTopHu", cb);
            } else {
                this.popupTopHu.show();
                this.popupTopHu.setInfo();
            }
        }
        actTransaction() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            if (!this.popupTransaction) {
                let cb = (prefab) => {
                    let popupDaily = cc.instantiate(prefab).getComponent("Lobby.PopupTransaction");
                    App.instance.canvas.addChild(popupDaily.node)
                    this.popupTransaction = popupDaily;
                    this.popupTransaction.show();
                }
                BundleControl.loadPrefabPopup("PrefabPopup/PopupTransaction", cb);
            } else {
                this.popupTransaction.show();
            }
        }
        actForgetPassword() {
            if (!this.popupForgetPassword) {
                let cb = (prefab) => {
                    let popupForgetPassword = cc.instantiate(prefab).getComponent("Lobby.PopupForgetPassword");
                    App.instance.canvas.addChild(popupForgetPassword.node)
                    this.popupForgetPassword = popupForgetPassword;
                    this.popupForgetPassword.show();
                }
                BundleControl.loadPrefabPopup("PrefabPopup/PopupForgetPassword", cb);
            } else {
                this.popupForgetPassword.show();
            }
        }
        actTaiApp() {
            if (!this.popupTaiApp) {
                let cb = (prefab) => {
                    let popupTaiApp = cc.instantiate(prefab).getComponent("Lobby.PopupTaiApp");
                    App.instance.canvas.addChild(popupTaiApp.node)
                    this.popupTaiApp = popupTaiApp;
                    this.popupTaiApp.show();
                }
                BundleControl.loadPrefabPopup("PrefabPopup/PopupTaiApp", cb);
            } else {
                this.popupTaiApp.show();
            }
        }
        actnaprut() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            if (!this.Popupnaprut) {
                let cb = (prefab) => {
                    let popupnaprut = cc.instantiate(prefab).getComponent("Lobby.Popupnaprut");
                    App.instance.canvas.addChild(popupnaprut.node)
                    this.Popupnaprut = popupnaprut;
                    this.Popupnaprut.show();
                }
                BundleControl.loadPrefabPopup("PrefabPopup/Popupnap-rut-doi", cb);
            } else {
                this.Popupnaprut.show();
            }
        }
        actGiftCode() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            if (!this.popupGiftCode) {
                let cb = (prefab) => {
                    let popupGiftCode = cc.instantiate(prefab).getComponent("Lobby.PopupGiftCode");
                    popupGiftCode.node.parent = App.instance.node;
                    // App.instance.canvas.addChild(popupGiftCode.node)
                    ////Utils.Log("parent giftcode:" + popupGiftCode.node.parent.name + ":" + App.instance.node.name);
                    this.popupGiftCode = popupGiftCode;
                    this.popupGiftCode.show();
                }
                BundleControl.loadPrefabPopup("PrefabPopup/PopupGiftCode", cb);
            } else {
                this.popupGiftCode.show();
            }
        }
        actPromotion() {
            //cmd=2015&nn=brightc&at=dfasfrfsefs9f9sfsdfdsds
            Http.get(Configs.App.API, { "c": 2015, "nn": Configs.Login.Nickname, "at": Configs.Login.AccessToken }, (err, res) => {
                ////Utils.Log("Xác nhan khuyen mai data:", res);
                if (err) {
                    App.instance.ShowAlertDialog(App.instance.getTextLang("txt_error"));
                    return;
                } else {
                    let msg = res.message;
                    App.instance.ShowAlertDialog(msg);
                    if (res.success) {
                        Configs.Login.Coin = parseInt(res.data);
                        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                    }
                }
            });
        }


        actRefund() {
            if (!this.popupRefund) {
                let cb = (prefab) => {
                    let popupRefund = cc.instantiate(prefab).getComponent("Lobby.PopupRefund");
                    App.instance.canvas.addChild(popupRefund.node);
                    this.popupRefund = popupRefund;
                    this.popupRefund.show();
                }
                BundleControl.loadPrefabPopup("PrefabPopup/PopupRefund", cb);
            } else {
                this.popupRefund.show();
            }

        }
        actSecurity() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            if (!this.popupSecurity) {
                let cb = (prefab) => {
                    let popupSecurity = cc.instantiate(prefab).getComponent("Lobby.PopupSecurity");
                    App.instance.canvas.addChild(popupSecurity.node);
                    this.popupSecurity = popupSecurity;
                    this.popupSecurity.show();
                }
                BundleControl.loadPrefabPopup("PrefabPopup/PopupSecurity", cb);
            } else {
                this.popupSecurity.show();
            }

        }

        actDiemDanh1() {
            if (!this.popupDiemDanh1) {
                let cb = (prefab) => {
                    let popupDiemDanh = cc.instantiate(prefab).getComponent("Lobby.PopupDiemDanh");					
                    App.instance.canvas.addChild(popupDiemDanh.node);
                    this.popupDiemDanh1 = popupDiemDanh;
                    this.popupDiemDanh1.show();
                }
                BundleControl.loadPrefabPopup("PrefabPopup/PopupDiemDanh1", cb);
            } else {
                this.popupDiemDanh1.show();
            }
        }
        actShowBanner() {
            let cb = (prefab) => {
                let popupBanner = cc.instantiate(prefab).getComponent("Dialog");
                App.instance.canvas.addChild(popupBanner.node);
                popupBanner.show();
                popupBanner.node.zIndex = cc.macro.MAX_ZINDEX;
            }
            //BundleControl.loadPrefabPopup("PrefabPopup/PopupKiemTien", cb); 
			BundleControl.loadPrefabPopup("PrefabPopup/PopupBanner", cb);
        }
        actVQMM() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
        }

        actInstall() {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_function_in_development'));
        }

        actEvent() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            if (!this.popupMail) {
                ////Utils.Log("Chua có prefab popup Security");
                let cb = (prefab) => {
                    let popupMail = cc.instantiate(prefab).getComponent("UIPopupMail");
                    App.instance.canvas.addChild(popupMail.node);
                    this.popupMail = popupMail;
                    this.popupMail.show();
                }
                BundleControl.loadPrefabPopup("PrefabPopup/UIPopupMail", cb);
            } else {
                this.popupMail.show();
            }
        }



        actDownload() {
            cc.sys.openURL(Configs.App.LINK_DOWNLOAD);
        }

        actFanpage() {
            cc.sys.openURL(Configs.App.getLinkFanpage());
        }
        actGroup() {
            cc.sys.openURL(Configs.App.LINK_GROUP);
        }

        actTelegram() {
            App.instance.openTelegram(Configs.App.getLinkTelegramGroup());
        }

        actAppOTP() {
            App.instance.openTelegram();
        }

        private isShowCSKH = false;
        actCSKH() {
            var self = this;
            if (self.isShowCSKH == false) {
                self.panelCSKH.scaleX = 0;
                self.panelCSKH.opacity = 0;
                self.panelCSKH.parent.active = true;
                self.isShowCSKH = true;
                cc.Tween.stopAllByTarget(self.panelCSKH);
                cc.tween(self.panelCSKH)
                    .to(0.3, { scaleX: 1, opacity: 255 }, { easing: "backOut" })
                    .start();

            }
            else {
                self.isShowCSKH = false;
                cc.Tween.stopAllByTarget(self.panelCSKH);
                cc.tween(self.panelCSKH)
                    .to(0.3, { scaleX: 0, opacity: 0 }, { easing: "backIn" })
                    .call(() => {
                        self.panelCSKH.parent.active = false;
                    })
                    .start();
            }
        }


        actKhuyenMai() {
            App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_function_in_development"));
        }

        actDiemDanh() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            if (!this.popupDiemDanh) {
                let cb = (prefab) => {
                    let popupDiemDanh = cc.instantiate(prefab).getComponent("UIPopupDiemDanh");
                    App.instance.canvas.addChild(popupDiemDanh.node);
                    this.popupDiemDanh = popupDiemDanh;
                    this.popupDiemDanh.show();
                }
                BundleControl.loadPrefabPopup("PrefabPopup/UIPopupDiemDanh", cb);
            } else {
                this.popupDiemDanh.show();
            }
        }
        actOpenFB() {
            cc.sys.openURL("/app/");
            // App.instance.openWebView("https://www.facebook.com/gaming/lote88com");
        }

        actOpenMessager() {
            cc.sys.openURL("/chat/");
            // App.instance.openWebView("https://www.facebook.com/lote88com/inbox/");
        }
        actOpenZalo() {
            cc.sys.openURL("/chat/");
        }
        actOpenLive() {
            App.instance.openWebView("/chat/");
        }

        actOpenHotLine() {
            if (cc.sys.isNative) {
                cc.sys.openURL("tel: 0933.265.966");
            }
            else {
                App.instance.alertDialog.showMsg("Hotline : 0933.265.966");
            }
        }
        
        actGameTaiXiuMd5() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            MiniGameNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openMiniGameTaiXiuMD5("TaiXiuMD5", "TaiXiuMD5");
            });

        }

        actSupportOnline() {
            // cc.sys.openURL(Configs.App.LINK_SUPPORT);
            if (!cc.sys.isNative) {
                var url = "/chat/";
                cc.sys.openURL(url);
                //Tawk_API.toggle();
            }
            else {
                App.instance.openTelegram(Configs.App.getLinkTelegramGroup());
            }
            //App.instance.openTelegram();
        }


        actBack() {
            App.instance.confirmDialog.show3(App.instance.getTextLang("txt_ask_logout"), "ĐĂNG XUẤT", (isConfirm) => {
                if (isConfirm) {
                    App.instance.checkMailUnread = false;
                    this.panelMenu.node.parent.active = false;
                    this.panelMenu.hide();

                    if (cc.sys.isBrowser) {
                        window.localStorage.removeItem('u');
                        window.localStorage.removeItem('at');
                        window.localStorage.removeItem('at_fb');
                        window.localStorage.removeItem('un');
                        window.localStorage.removeItem('pw');

                    }
                    SPUtils.setUserName("");
                    SPUtils.setUserPass("");
                    cc.sys.localStorage.setItem("IsAutoLogin", 0);
                    BroadcastReceiver.send(BroadcastReceiver.USER_LOGOUT);
                    App.instance.updateConfigGame(App.DOMAIN);
                    App.instance.RECONNECT_GAME = false;
                }
            });
        }
        public actSwitchCoin() {
            if (this.lblCoin.node.parent.active) {
                this.lblCoin.node.parent.active = false;
            } else {
                this.lblCoin.node.parent.active = true;
            }
        }

        actGameTaiXiu() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            MiniGameNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openMiniGameTaiXiuDouble("TaiXiuDouble", "TaiXiuDouble");
            });

        }
        actGameTaiXiuSieuToc() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_coming_soon'));
                return;
            }
            if (Configs.Login.AccessTokenSockJs == "" || cc.sys.localStorage.getItem("token_Sockjs") == null) {
                TaiXiuSTNetworkClient.getInstance().isOpenGame = true;
                this.loginMiniGameSockJs();
                return;
            }
            TaiXiuSTNetworkClient.getInstance().checkConnect(() => {
                App.instance.openMiniGameTaiXiuSieuToc("TaiXiuSieuToc", "TaiXiuSieuToc");
            })

        }
        actGetEventMoon() {
            Http.get(Configs.App.API, { "c": 20, "nn": Configs.Login.Nickname, "at": Configs.Login.AccessToken }, (err, res) => {
                //////Utils.Log("Check event Trung thu:", res);
                if (err) {
                    return;
                } else {
                    if (res.success && res.lstMoonEvents.length > 0) {
                        this.actShowPopupEventMoon(res);
                    }
                }
            });
        }
        actShowPopupEventMoon(data) {
            if (!this.popupEventTT) {
                let cb = (prefab) => {
                    this.popupEventTT = cc.instantiate(prefab).getComponent("PopupEventTT");
                    this.popupEventTT.node.parent = App.instance.node;
                    this.popupEventTT.showpPopup(data);
                    ////Utils.Log("Parent Event:" + this.popupEventTT.node.parent.name);
                }
                //BundleControl.loadPrefabPopup("PrefabPopup/PopupEventTT", cb);
            } else {
                this.popupEventTT.showpPopup(data);
            }
        }
        actGameBauCua() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            MiniGameNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openMiniGameBauCua("BauCua", "BauCua");
            });

        }

        actGameCaoThap() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            MiniGameNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openMiniGameCaoThap("CaoThap", "CaoThap");
            });
        }

        actGameSlot3x3() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            MiniGameNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openMiniGameSlot3x3("Slot3x3", "Slot3x3");
            });

        }

        actGameSlot3x3Gem() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            MiniGameNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openMiniGameSlot3x3Gem("Slot3x3Gem", "Slot3x3Gem");
            });

        }

        actGameMiniPoker() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            MiniGameNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openMiniGameMiniPoker("MiniPoker", "MiniPoker");
            });

        }

        actGameTaLa() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_coming_soon'));
        }

        actGoToSlot1() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            App.instance.removeAllWebView();
            App.instance.showErrLoading(App.instance.getTextLang('txt_loading'));
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openGame("Slot1", "Slot1");
            });
        }

        actGoToSlot2() {

            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            App.instance.removeAllWebView();
            App.instance.showErrLoading(App.instance.getTextLang('txt_loading'));
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openGame("Slot2", "Slot2");
            });
        }

        actGoToSlot3() {
            ////Utils.Log("Go to slot3");
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            App.instance.removeAllWebView();
            App.instance.showErrLoading(App.instance.getTextLang('txt_loading'));
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openGame("Slot3", "Slot3");
            });
        }

        actGoToSlot4() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            App.instance.removeAllWebView();
            App.instance.showErrLoading(App.instance.getTextLang('txt_loading'));
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openGame("Slot4", "Slot4");
            });
        }

        actGoToSlot5() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            App.instance.removeAllWebView();
            App.instance.showErrLoading(App.instance.getTextLang('txt_loading'));
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openGame("Slot5", "Slot5");
            });
        }


        actGoToSlot6() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            App.instance.removeAllWebView();
            App.instance.showErrLoading(App.instance.getTextLang('txt_loading'));
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openGame("Slot6", "Slot6");
            });
        }

        actGoToSlot7() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            App.instance.removeAllWebView();
            App.instance.showErrLoading(App.instance.getTextLang('txt_loading'));
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openGame("Slot7", "Slot7");
            });
        }

        actGoToSlot8() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            App.instance.removeAllWebView();
            App.instance.showErrLoading(App.instance.getTextLang('txt_loading'));
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openGame("Slot8", "Slot8");
            });
        }

        actGoToSlot10() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            // cc.director.loadScene("TestScene");
            App.instance.showErrLoading(App.instance.getTextLang('txt_loading'));
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openGame("Slot10", "Slot10");
            });
        }
        actGoToSlot11() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            App.instance.removeAllWebView();
            App.instance.showErrLoading(App.instance.getTextLang('txt_loading'));
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openGame("Slot11Bikini", "Slot11Bikini");
            });
        }
        actDev() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            App.instance.actPopupGameTransfer("SEX", 10000);
            return;
        }
		actDev1() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_coming_soon'));
            return;
        }
        checkListBankRut() {
            if (Configs.Login.ListBankRut == null) {
                App.instance.showLoading(true);
                var data = {};
                data["c"] = 2008;
                data["nn"] = Configs.Login.Nickname;
                data["pn"] = 1;
                data["l"] = 10;
                Http.get(Configs.App.API, data, (err, res) => {
                    App.instance.showLoading(false);
                    var list = JSON.parse(res.data).data;
                    Configs.Login.ListBankRut = list;
                });
            }
        }

        actGoToShootFish() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            App.instance.openGame("ShootFish", "ShootFish");
        }
        actGoToOanTuTi() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            App.instance.openGame("OanTuTi", "OanTuTi");
        }

        actGotoLoto() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            App.instance.removeAllWebView();
            App.instance.openGame("Loto", "Loto");
            // App.instance.loadSceneInSubpackage("Loto", "Loto");
        }

        actGoToXocDia() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            App.instance.isShowNotifyJackpot = false;
            App.instance.removeAllWebView();
            // App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_coming_soon'));
            // return;
            App.instance.openGame("XocDia", "XocDia");
        }

        actAddCoin() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            if (!this.popupShop) {
                let cb = (prefab) => {
                    let popupShop = cc.instantiate(prefab).getComponent("LobbyShop");
                    App.instance.canvas.addChild(popupShop.node)
                    this.popupShop = popupShop;
                    this.popupShop.show();
                }
                BundleControl.loadPrefabPopup("PrefabPopup/PopupShop", cb);
            } else {
                this.popupShop.show();
            }

        }
        actCashout() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }

            if (Configs.Login.ListBankRut.length == 0) {
                if (!this.popupProfile) {
                    let cb = (prefab) => {
                        let popupProfile = cc.instantiate(prefab).getComponent("Lobby.PopupProfile");
                        App.instance.canvas.addChild(popupProfile.node);
                        this.popupProfile = popupProfile;
                        this.popupProfile.showTabBank();
                    }
                    BundleControl.loadPrefabPopup("PrefabPopup/PopupProfile", cb);
                } else {
                    this.popupProfile.showTabBank();
                }

            }
            else {
                if (!this.popupCashout) {
                    let cb = (prefab) => {
                        let popupCashout = cc.instantiate(prefab).getComponent("Lobby.PopupCashout");
                        App.instance.canvas.addChild(popupCashout.node)
                        this.popupCashout = popupCashout;
                        this.popupCashout.show();
                    }
                    BundleControl.loadPrefabPopup("PrefabPopup/PopupCashout", cb);
                } else {
                    this.popupCashout.show();
                }

            }

        }
        onBtnShowProfile() {
            this.actProfile(0);
        }
        actProfile(tabIndex = 0) {
            if (!this.popupProfile) {
                let cb = (prefab) => {
                    let popupProfile = cc.instantiate(prefab).getComponent("Lobby.PopupProfile");
                    App.instance.canvas.addChild(popupProfile.node);
                    this.popupProfile = popupProfile;

                    this.popupProfile.show(tabIndex);
                }
                BundleControl.loadPrefabPopup("PrefabPopup/PopupProfile", cb);
            } else {
                this.popupProfile.show(tabIndex);
            }
        }
        accExchange() {
            ////Utils.Log("act Add accExchange");
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            this.actAddCoin();
        }

        actGoToTLMN() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            // App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_coming_soon'));
            // return;
            App.instance.removeAllWebView();

            App.instance.showErrLoading(App.instance.getTextLang('txt_loading'));
            TienLenNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                TienLenConstant.IS_SOLO = false;
                App.instance.isShowNotifyJackpot = false;
                App.instance.openGame("TienLen", "TienLen");
                // App.instance.loadSceneInSubpackage("TienLen", "TienLen");
            });
        }

        actGameTLMNSolo() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            // App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_coming_soon'));
            // return;
            App.instance.removeAllWebView();
            App.instance.showErrLoading(App.instance.getTextLang('txt_loading'));
            TienLenNetworkClient.getInstance().checkConnect(() => {
                TienLenConstant.IS_SOLO = true;
                App.instance.showLoading(false);
                App.instance.isShowNotifyJackpot = false;
                App.instance.openGame("TienLen", "TienLen");
                // App.instance.loadSceneInSubpackage("TienLen", "TienLen");
            });
        }

        actGoToSam() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            // App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_coming_soon'));
            // return;
            App.instance.removeAllWebView();
            App.instance.showErrLoading(App.instance.getTextLang('txt_loading'));
            SamNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.isShowNotifyJackpot = false;
                App.instance.openGame("Sam", "Sam");
            });
        }
        actGoToMauBinh() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            // App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_coming_soon'));
            // return;
            App.instance.removeAllWebView();
            App.instance.showErrLoading(App.instance.getTextLang('txt_loading'));
            App.instance.openGame("MauBinh", "MauBinh");
        }

        actGoToBaCay() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            App.instance.removeAllWebView();
            App.instance.isShowNotifyJackpot = false;
            App.instance.openGame("BaCay", "BaCay");
        }
        actGoToLieng() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            App.instance.removeAllWebView();
            App.instance.isShowNotifyJackpot = false;
            App.instance.openGame("Lieng", "Lieng");
        }

        actGoToPoker() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            //   App.instance.removeAllWebView();
            //   App.instance.isShowNotifyJackpot = false;
            //   App.instance.isShowNotifyJackpot = false;
            App.instance.openGame("Poker", "Poker");
        }

        actGoToBaiCao() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            // App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_coming_soon'));
            // return;
            App.instance.openGame("BaiCao", "BaiCao");
        }
        actKiemTien() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
            if (!this.popupKiemTien) {
                let cb = (prefab) => {
                    let popupSecurity = cc.instantiate(prefab).getComponent("Lobby.PopupKiemTien");
                    App.instance.canvas.addChild(popupSecurity.node);
                    this.popupKiemTien = popupSecurity;
                    this.popupKiemTien.show();
                }
                BundleControl.loadPrefabPopup("PrefabPopup/PopupKiemTien", cb);
            } else {
                this.popupKiemTien.show();
            }

        }


        actGoToGame3Rd() {
            if (!Configs.Login.IsLogin) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
                return;
            }
        }

        actLoginCMD() {
            App.instance.actLoginCMD();
        }

        actLoginIBC() {
            App.instance.actLoginIBC();
        }
        actLoginSBO() {
            App.instance.actLoginSBO();
        }

        actLoginWM() {
            App.instance.actLoginWM();
        }

        actLoginAG() {
            App.instance.actLoginAG();
        }
        actLoginEbet() {
            App.instance.actLoginEbet();
        }
        actLoginShootFish() {
            App.instance.actLoginShootFish();
        }

        showGameLive() {
            if (!this.gameLiveController) {
                let cb = (prefab) => {
                    let gameLiveController = cc.instantiate(prefab).getComponent("GameLiveController");
                    App.instance.canvas.addChild(gameLiveController.node)
                    this.gameLiveController = gameLiveController;
                    this.gameLiveController.show();
                }
                BundleControl.loadPrefabPopup("PrefabPopup/GameLive", cb);
            } else {
                this.gameLiveController.show();
            }


        }
        updateSizeListGame(isHaveBanner) {
            this.bannerList.node.active = isHaveBanner;
            this.tabsListGame.updateSize(isHaveBanner);
        }
        //    getConfigGame() {
        //        Http.get(Configs.App.API, { c: "2037", nn: Configs.Login.Nickname, "pl": "web" }, (err, res) => {
        //            if (res != null) {
        //            //    cc.log(res);
        //                if (res['success']) {
        //                    this.tabsListGame.initListGameConfig(res);
        //                    App.instance.VERSION_CONFIG = res['version'];
        //                } else {
        //               //     this.tabsListGame.loadListGame();
        //                }
        //                // this.checkAppVersion();
        //            }
        //        });
        //    }
        checkAppVersion() {
            if (typeof Configs.App.VERSION_APP != "undefined") {
                let versionApp = parseInt(Configs.App.VERSION_APP.replace(/[.]/g, ''));
                let versionConfig = parseInt(App.instance.VERSION_CONFIG.replace(/[.]/g, ''));
                if (versionApp < versionConfig) {
                    let url = "https://sun102.fun/"
                    if (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS) {
                        App.instance.showConfirmDialog("Đã có phiển bản mới.\nVui lòng cập nhật ứng dụng để có trải nghiệm tốt nhất!", () => {
                            cc.sys.openURL(url);
                        }, false)
                    }

                }
            }
        }
    }

}
export default Lobby.LobbyController;

