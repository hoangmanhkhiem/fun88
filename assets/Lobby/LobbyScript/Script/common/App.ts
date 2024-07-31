
import BundleControl from "../../../../Loading/src/BundleControl";
import Configs from "../../../../Loading/src/Configs";
import Http from "../../../../Loading/src/Http";
import ButtonMiniGame from "../../ButtonMiniGame";
import PopupChangeAvatar from "../../Lobby.PopupChangeAvatar";
import PopupChangePassword from "../../Lobby.PopupChangePassword";
import MiniGame from "../../MiniGame";
import PopupUpdateNickname from "../../PopupUpdateNickname";
import InPacket from "../networks/Network.InPacket";
import SlotNetworkClient from "../networks/SlotNetworkClient";
import AlertDialog from "./AlertDialog";
import BroadcastReceiver from "./BroadcastReceiver";
import ConfirmDialog from "./ConfirmDialog";
import SPUtils from "./SPUtils";
import UINotifyJackpot from "./UINotifyJackpot";
import cmd from "../../Lobby.Cmd";
import UIPopupRule from "../../UIPopupRule";
import GameLiveController from "../../GameLive/GameLiveController";
import Utils from "./Utils";
import PopupGameTransfer from "../../Lobby.PopupGameTransfer";
import TaiXiuSTNetworkClient from "../networks/TaiXiuSieuToc.NetworkClient";
import { Global } from "../../../../Loading/src/Global";
import LanguageLanguageManager from "./Language.LanguageManager";
import PopupGameSBO from "../../Lobby.PopupGameSBO";
import PopupEvent from "../../PopupEvent";
import PopupWebView from "../../PopupWebView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class App extends cc.Component {
    @property(cc.AudioClip)
    clipCoin: cc.AudioClip = null;
    @property(cc.Prefab)
    prefabCoin: cc.Prefab = null;
    @property(cc.Node)
    nodeCoin: cc.Node = null;

    @property(cc.Prefab)
    bgMiniPrefab: cc.Prefab = null;
    @property(GameLiveController)
    gameLiveController: GameLiveController = null;
    @property(UINotifyJackpot)
    uiNotifyJackpot: UINotifyJackpot = null;
    @property(cc.Prefab)
    public taiXiuDoublePrefab: cc.Prefab = null;
    @property(cc.Prefab)
    public miniPokerPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    public caoThapPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    public bauCuaPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    public slot3x3Prefab: cc.Prefab = null;
    @property(cc.Prefab)
    public oanTuTiPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    public TaiXiuMD5Prefab: cc.Prefab = null;

    @property(cc.Node)
    public canvas: cc.Node = null;


    static instance: App = null;

    @property
    designResolution: cc.Size = new cc.Size(1280, 720);

    @property(cc.Node)
    loading: cc.Node = null;
    @property(cc.Node)
    loadingIcon: cc.Node = null;
    @property(cc.Label)
    loadingLabel: cc.Label = null;

    @property(AlertDialog)
    alertDialog: AlertDialog = null;
    @property(cc.Node)
    alertToast: cc.Node = null;

    @property(ConfirmDialog)
    confirmDialog: ConfirmDialog = null;

    @property([cc.SpriteFrame])
    sprFrameAvatars: Array<cc.SpriteFrame> = new Array<cc.SpriteFrame>();

    @property(cc.Node)
    buttonMiniGameNode: cc.Node = null;

    @property(cc.Node)
    miniGame: cc.Node = null;

    @property(cc.Prefab)
    popupWebView: cc.Prefab = null;

    @property(PopupUpdateNickname)
    popupUpdateNickname: PopupUpdateNickname = null;

    public isShowNotifyJackpot = true;
    public buttonMiniGame: ButtonMiniGame;
    public popupChangeAvatar: PopupChangeAvatar;
    public popupChangePassword: PopupChangePassword;
    public popupGameTransfer: PopupGameTransfer = null;
    public popupGameSBO: PopupGameSBO = null;
    public popupRule: UIPopupRule = null;
    private lastWitdh: number = 0;
    private lastHeight: number = 0;

    private timeOutLoading: any = null;
    private isFisrtNetworkConnected = false;

    private subpackageLoaded: Object = {};

    private taiXiuDouble: MiniGame = null;
    private miniPoker: MiniGame = null;
    private caoThap: MiniGame = null;
    private bauCua: MiniGame = null;
    private slot3x3: MiniGame = null;
    private slot3x3Gem: MiniGame = null;
    private oanTuTi: MiniGame = null;
    private taiXiuSieuToc: MiniGame = null;
    public numMiniGameOpening = 0;
    public cacheWebView = {};
    // LIFE-CYCLE CALLBACKS:
    private coinPool = null;
    public topHuData: any = null;
    public fakeTopHuData: any = {};
    public checkMailUnread: boolean = false;
    popupEvent: PopupEvent = null;
    public VERSION_CONFIG = "1.0.0";
    public timeLixi: number = -1;
    public popupWebLiveCasino: PopupWebView = null;
    private TaiXiuMD5: MiniGame = null;

    onLoad() {
        Global.LanguageManager = LanguageLanguageManager;
        if (App.instance != null) {
            this.node.destroy();
            return;
        }
        this.coinPool = new cc.NodePool("Coin");
        this.initConfigGameStart();
        App.instance = this;
        cc.game.addPersistRootNode(App.instance.node);
        this.buttonMiniGame = this.buttonMiniGameNode.getComponent(ButtonMiniGame);
        BroadcastReceiver.register(BroadcastReceiver.USER_LOGOUT, () => {
            this.checkMailUnread = false;
        }, this);
        this.setupTimeRunInBg();
    }
    getCoin() {
        let ret: cc.Node = null;

        if (this.coinPool.size() <= 0) {
            this.coinPool.put(cc.instantiate(this.prefabCoin));
        }
        ret = this.coinPool.get();
        ret.parent = this.nodeCoin;
        ret.active = true;
        ret.scale = 1;
        ret.opacity = 255;
        ret.position = cc.v3(0, 0, 0);
        let partical = ret.getComponentInChildren(cc.ParticleSystem);
        if (partical.particleCount > 0) { // check if particle has fully plaed
            partical.stopSystem(); // stop particle system
        } else {
            partical.resetSystem(); // restart particle system
        }
        partical.node.active = false;
        return ret;
    }


    getPositionInView(item) { // get item position in scrollview's node space
        //  //Utils.Log("getPositionInView:"+item.name);
        let worldPos = item.parent.convertToWorldSpaceAR(item.getPosition());
        let viewPos = this.nodeCoin.convertToNodeSpaceAR(worldPos);
        return viewPos;
    }

    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
    showCoins(numberCoin, nodeStart, nodeTarget, callback = null) {
        cc.audioEngine.play(this.clipCoin, false, 1);
        //Utils.Log("showCoins:" + numberCoin);
        if (numberCoin <= 20) numberCoin = 20;
        else if (numberCoin >= 40) numberCoin = 40;
        for (let i = 0; i < numberCoin; i++) {
            let chip = this.getCoin();
            chip.scale = 2.5;
            var posStart = this.getPositionInView(nodeStart);
            var posTarget = this.getPositionInView(nodeTarget);
            chip.position = posStart;
            var bezier = [cc.v2(posStart.x, posStart.y), cc.v2(posStart.x + 200, posStart.y + 300), posTarget];
            cc.Tween.stopAllByTarget(chip);
            cc.tween(chip)
                .delay(0 + (numberCoin * 0.1 - i * 0.1))
                // .to(0.5, {scale:1, x: this.getRandomArbitrary(posStart.x-50,posStart.x+50), y: this.getRandomArbitrary(posStart.y-50,posStart.y+50) }, { easing: cc.easing.backOut })
                // .delay(0.1)
                .call(() => {
                    chip.getChildByName("partical").active = true;
                })
                .then(cc.spawn(cc.scaleTo(1.0, 1.0).easing(cc.easeSineInOut()), cc.bezierTo(1, bezier).easing(cc.easeSineInOut())))
                // .to(0.5, { position: posTarget }, { easing: cc.easing.sineIn })
                .call(() => {
                    // chip.active = false;
                    let partical = chip.getComponentInChildren(cc.ParticleSystem);
                    if (partical.particleCount > 0) { // check if particle has fully plaed
                        partical.stopSystem(); // stop particle system
                    } else {
                        partical.resetSystem(); // restart particle system
                    }
                    partical.node.active = false;
                    chip.position = posStart;
                    this.coinPool.put(chip);
                }).start();
        }
    }
    public hideGameMini(nameGame) {
        delete this.arrMiniGame[nameGame];
        this.numMiniGameOpening--;
        if (this.numMiniGameOpening <= 0) {
            this.numMiniGameOpening = 0;
            this.bgMini.active = false;
        }
    }

    public showGameMini(nameGame, obj = null) {
        if (obj != null) {
            this.arrMiniGame[nameGame] = obj;
            this.numMiniGameOpening++;
        }
        if (this.numMiniGameOpening == 0) {
            this.bgMini.active = true;
        }


    }
    private isFadeOutBgMini = false;

    public showBgMiniGame(gameName) {
        this.isFadeOutBgMini = false;
        this.bgMini.active = true;
        for (var key in this.arrMiniGame) {
            if (gameName == key) {
                cc.tween(this.arrMiniGame[key].getComponent('MiniGame').gamePlay).to(0.2, { scale: 1.0 }).start();
                this.arrMiniGame[key].getComponent("MiniGame").reOrder();
            }
            else {
                cc.tween(this.arrMiniGame[key].getComponent('MiniGame').gamePlay).to(0.1, { scale: 0.5 }).start();
            }
        }
    }

    public hideBgMiniGame() {
        this.isFadeOutBgMini = true;
        this.bgMini.active = false;
        for (var key in this.arrMiniGame) {
            // this.arrMiniGame[key].opacity = 100;
            this.arrMiniGame[key].getComponent('MiniGame').gamePlay.scale = 0.5;
            // cc.tween(this.arrMiniGame[key]).to(0.1, { scale: 0.5 }).start();
        }
    }
    public boxApp: cc.Node = null;
    private bgMini: cc.Node = null;
    private arrMiniGame = {};
    onEnable() {
        var canvasTmp = cc.director.getScene().getChildByName("Canvas");
        this.miniPoker = null;
        this.caoThap = null;
        this.taiXiuDouble = null;
        this.TaiXiuMD5 = null;
        this.bauCua = null;
        this.slot3x3 = null;
        this.slot3x3Gem = null;
        this.taiXiuSieuToc = null;
        this.arrMiniGame = {};
        this.miniGame = new cc.Node('BoxMiniGame');
        this.miniGame.width = 1280;
        this.miniGame.height = 720;
        // this.miniGame.position = cc.v3(1280/2,720/2,0);
        this.bgMini = cc.instantiate(this.bgMiniPrefab);
        this.bgMini.parent = this.miniGame;
        this.bgMini.active = false;
        canvasTmp.addChild(this.miniGame);

        // var boxPopup = new cc.Node('BoxPopup');
        // boxPopup.width = cc.winSize.width;
        // boxPopup.height = cc.winSize.height;
        // canvasTmp.addChild(boxPopup);
        this.canvas = this.miniGame;
    }
    setUpNode() {
        var canvasTmp = cc.director.getScene().getChildByName("Canvas");
        this.miniPoker = null;
        this.caoThap = null;
        this.taiXiuDouble = null;
        this.TaiXiuMD5 = null;
        this.bauCua = null;
        this.slot3x3 = null;
        this.slot3x3Gem = null;

        this.miniGame = new cc.Node('BoxMiniGame');
        this.miniGame.width = 1280;
        this.miniGame.height = 720;
        canvasTmp.addChild(this.miniGame);

        var boxPopup = new cc.Node('BoxPopup');
        boxPopup.width = cc.winSize.width;
        boxPopup.height = cc.winSize.height;
        canvasTmp.addChild(boxPopup);
        this.canvas = boxPopup;
    }

    actChangeAvatar() {
        if (!Configs.Login.IsLogin) {
            this.alertDialog.showMsg("Bạn chưa đăng nhập.");
            return;
        }
        if (!this.popupChangeAvatar) {
            let cb = (prefab) => {
                let popupnaprut = cc.instantiate(prefab).getComponent("Lobby.PopupChangeAvatar");
                popupnaprut.node.parent = this.canvas;
                this.popupChangeAvatar = popupnaprut;
                this.popupChangeAvatar.show();
            }
            BundleControl.loadPrefabPopup("PrefabPopup/PopupChangeAvatar", cb);
        } else {
            this.popupChangeAvatar.show();
        }
    }

    actRule() {
        if (!Configs.Login.IsLogin) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
            return;
        }
        if (!this.popupRule) {
            let cb = (prefab) => {
                let popupRule = cc.instantiate(prefab).getComponent("UIPopupRule");
                App.instance.canvas.addChild(popupRule.node);
                this.popupRule = popupRule;
                this.popupRule.show();
            }
            BundleControl.loadPrefabPopup("PrefabPopup/UIPopupRule", cb);
        } else {
            this.popupRule.show();
        }
    }

    public TYPE_LOGIN = "NORMAL";//NORMAL , FACEBOOK
    public USER_NAME = "";
    public PASS_WORD = "";
    public FB_ID = "";
    public AT_FB = "";
    public RECONNECT_GAME = false;

    static DOMAIN = "go88s.fun";
    static API_CMD: string = "https://ga.go88s.fun/3rd/cmd";
    static API_IBC: string = "https://ga.go88s.fun/3rd/ibc";
    static API_SBO: string = "https://ga.go88s.fun/3rd/sbo"
    static API_AG: string = "https://ga.go88s.fun/3rd/ag";
    static API_EBET: string = "https://ga.go88s.fun/3rd/ebet";
    static API_WM: string = "https://ga.go88s.fun/3rd/wm";

    //http://localhost:8081/api?c=2021&nn=tuanbigbird&at=1628224022&ip=127.0.0.1&mn=100
    updateConfigGame(domain = "go88s.fun") {
        this.RECONNECT_GAME = true;

        Configs.App.API = "https://iportal." + domain + "/api";
        Configs.App.MONEY_TYPE = 1;
        Configs.App.LINK_DOWNLOAD = "https://" + domain + "";
        Configs.App.LINK_EVENT = "https://" + domain + "/event";

        Configs.App.HOST_MINIGAME.host = "wmini." + domain + "";
        Configs.App.HOST_TAI_XIU_MINI2.host = "overunder." + domain + "";
        Configs.App.HOST_SLOT.host = "wslot." + domain + "";
        Configs.App.HOST_TLMN.host = "wtlmn." + domain + "";
        Configs.App.HOST_SHOOT_FISH.host = "wbanca." + domain + "";
        Configs.App.HOST_SAM.host = "wsam." + domain + "";
        Configs.App.HOST_XOCDIA.host = "wxocdia." + domain + "";
        Configs.App.HOST_BACAY.host = "wbacay." + domain + "";
        Configs.App.HOST_BAICAO.host = "wbaicao." + domain + "";
        Configs.App.HOST_POKER.host = "wpoker." + domain + "";
        Configs.App.HOST_XIDACH.host = "wxizach." + domain + "";
        Configs.App.HOST_BINH.host = "wbinh." + domain + "";
        Configs.App.HOST_LIENG.host = "wlieng." + domain + "";

        App.API_AG = "https://ga." + domain + "/3rd/ag";
        App.API_IBC = "https://ga." + domain + "/3rd/ibc";
        App.API_WM = "https://ga." + domain + "/3rd/wm";
        App.API_CMD = "https://ga." + domain + "/3rd/cmd";
        //Utils.Log("CONFIG_API:" + Configs.App.API);
    }

    initConfigGameStart() {
        this.updateConfigGame(App.DOMAIN);
    }

    actChangePass() {
        if (!Configs.Login.IsLogin) {
            this.alertDialog.showMsg("Bạn chưa đăng nhập.");
            return;
        }
        if (!this.popupChangePassword) {
            let cb = (prefab) => {
                let popupnaprut = cc.instantiate(prefab).getComponent("Lobby.PopupChangePassword");
                popupnaprut.node.parent = this.canvas;
                this.popupChangePassword = popupnaprut;
                this.popupChangePassword.show();
            }
            BundleControl.loadPrefabPopup("PrefabPopup/PopupChangePassword", cb);
        } else {
            this.popupChangePassword.show();
        }
    }

    setupTimeRunInBg() {
        cc.game.on(cc.game.EVENT_HIDE, () => {
            let timeNow = cc.sys.now()

            //Utils.Log('-=-=EVENT_HIDE  ', timeNow)
            cc.sys.localStorage.setItem('timenow', timeNow)
        })

        cc.game.on(cc.game.EVENT_SHOW, () => {
            let timeNow = cc.sys.now()
            let timeHide = parseInt(cc.sys.localStorage.getItem('timenow'))
            //Utils.Log('-=-=EVENT_SHOW2_IN_SECCOND  ' + ((timeNow - timeHide) / 1000));
            cc.director.getActionManager().update((timeNow - timeHide) / 1000);
            this.timeLixi = Math.floor(this.timeLixi - ((timeNow - timeHide) / 1000));
        });
    }
    start() {
        SlotNetworkClient.getInstance().addListener((data) => {
            let inPacket = new InPacket(data);
            switch (inPacket.getCmdId()) {
                case cmd.Code.UPDATE_BIGWIN_JACKPOT_SLOT3X3: {
                    let res = new cmd.ResNotifyJackpot(data);
                    this.showJackpotNotify(res, "Pokemon");
                    break;
                }
                case cmd.Code.UPDATE_BIGWIN_JACKPOT_SLOT3x3GEM: {
                    let res = new cmd.ResNotifyJackpot(data);
                    this.showJackpotNotify(res, "Gem");
                    break;
                }
                case cmd.Code.UPDATE_BIGWIN_JACKPOT_MINIPOKER: {
                    let res = new cmd.ResNotifyJackpot(data);
                    this.showJackpotNotify(res, "MiniPoker");
                    break;
                }
                case cmd.Code.UPDATE_BIGWIN_JACKPOT_SLOT1: {
                    let res = new cmd.ResNotifyJackpot(data);
                    this.showJackpotNotify(res, "KHO TÀNG NGŨ LONG");
                    break;
                }
                case cmd.Code.UPDATE_BIGWIN_JACKPOT_SLOT3: {
                    let res = new cmd.ResNotifyJackpot(data);
                    this.showJackpotNotify(res, "Thần Tài");
                    break;
                }
                case cmd.Code.UPDATE_BIGWIN_JACKPOT_SLOT4: {
                    let res = new cmd.ResNotifyJackpot(data);
                    this.showJackpotNotify(res, "CUNG HỶ PHÁT TÀI");
                    break;
                }
                case cmd.Code.UPDATE_BIGWIN_JACKPOT_SLOT5: {
                    let res = new cmd.ResNotifyJackpot(data);
                    this.showJackpotNotify(res, "ĂN KHES TRẢ VÀNG");
                    break;
                }
                case cmd.Code.UPDATE_BIGWIN_JACKPOT_SLOT7: {
                    let res = new cmd.ResNotifyJackpot(data);
                    this.showJackpotNotify(res, "THE WITCHER");
                    break;
                }
                case cmd.Code.UPDATE_BIGWIN_JACKPOT_SLOT8: {
                    let res = new cmd.ResNotifyJackpot(data);
                    this.showJackpotNotify(res, "KHO BÁU TỨ LINH");
                    break;
                }
                case cmd.Code.UPDATE_BIGWIN_JACKPOT_SLOT10: {
                    let res = new cmd.ResNotifyJackpot(data);
                    this.showJackpotNotify(res, "SƠN TINH THỦY TINH");
                    break;
                }
                case cmd.Code.UPDATE_BIGWIN_JACKPOT_SLOT11: {
                    let res = new cmd.ResNotifyJackpot(data);
                    this.showJackpotNotify(res, "TÂY DU KÝ");
                    break;
                }
            }
        }, this);

        this.updateSize();
        // cc.tween(this.loadingIcon).repeatForever(cc.tween().to(0.5, { scale: 1.1 }).to(0.5, { scale: 0.9 }).to(0.5, { scale: 1.0 })).start();
    }
    showJackpotNotify(res, gameName) {
        //Utils.Log('showJackpotNotify:', res);
        if (res["type"] == 3) {
            var dataNotify = {};
            dataNotify["username"] = res["username"];
            dataNotify["totalPrizes"] = res["totalPrizes"];
            dataNotify["type"] = res["type"] == 3 ? "Nỗ Hũ" : "Thắng Lớn";
            dataNotify["gameName"] = gameName;
            App.instance.uiNotifyJackpot.addJackpot(dataNotify);
        }
    }
    showLoading(isShow: boolean, timeOut: number = 15) {
       // this.loading.zIndex = this.node.children[this.node.childrenCount - 1].zIndex + 1;
        this.loadingLabel.string = App.instance.getTextLang('txt_loading1');
        if (this.timeOutLoading != null) clearTimeout(this.timeOutLoading);
        if (isShow) {
            if (timeOut > 0) {
                this.timeOutLoading = setTimeout(() => {
                    this.showLoading(false);
                }, timeOut * 1000);
            }
            this.loading.active = true;
        } else {
            this.loading.active = false;
        }
        this.loadingIcon.stopAllActions();
        this.loadingIcon.runAction(cc.repeatForever(cc.rotateBy(1.5, 360)));
        // cc.tween(this.loadingIcon).to(0.5, { scale: 1.2 }).to(0.5, { scale: 0.8 }).to(0.5, { scale: 1.0 }).repeatForever().start();
    }

    showErrLoading(msg?: string) {
        this.showLoading(true, -1);
        this.loadingLabel.string = msg ? msg : "Mất kết nối, đang thử lại...";
    }

    update(dt: number) {
        this.updateSize();
    }

    updateSize() {
        var frameSize = cc.view.getFrameSize();
        if (this.lastWitdh !== frameSize.width || this.lastHeight !== frameSize.height) {

            this.lastWitdh = frameSize.width;
            this.lastHeight = frameSize.height;

            var newDesignSize = cc.Size.ZERO;
            if (this.designResolution.width / this.designResolution.height > frameSize.width / frameSize.height) {
                newDesignSize = cc.size(this.designResolution.width, this.designResolution.width * (frameSize.height / frameSize.width));
            } else {
                newDesignSize = cc.size(this.designResolution.height * (frameSize.width / frameSize.height), this.designResolution.height);
            }
            this.node.setContentSize(newDesignSize);
            this.node.setPosition(cc.v2(newDesignSize.width / 2, newDesignSize.height / 2));
        }
    }

    getAvatarSpriteFrame(avatar: string): cc.SpriteFrame {
        // avatar = "999";
        let avatarInt = parseInt(avatar);
        // if (avatarInt == 999) {
        //     let sprAvatar: cc.SpriteFrame;
        //     let url = 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=%fbid&height=100&width=100&ext=1633535436&hash=AeSjxozlk2teYdmfI_0';
        //     url = url.replace("%fbid", Configs.Login.FacebookID);
        //     cc.assetManager.loadRemote(url, { ext: ".png" }, (err, img: cc.Texture2D) => {

        //         if (err) {
        //             return this.sprFrameAvatars[0];
        //         }
        //          //Utils.Log(img);
        //         sprAvatar = new cc.SpriteFrame(img);
        //         return sprAvatar;
        //         // sprite.spriteFrame = new cc.SpriteFrame(tex);
        //     });
        // }
        if (isNaN(avatarInt) || avatarInt < 0 || avatarInt >= this.sprFrameAvatars.length) {
            return this.sprFrameAvatars[0];
        }

        return this.sprFrameAvatars[avatarInt];
    }

    loadScene(sceneName: string) {
        cc.director.preloadScene(sceneName, (c, t, item) => {
            this.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt("" + ((c / t) * 100)) + "%");
        }, () => {
            this.showLoading(false);
            cc.director.loadScene(sceneName);
        });
    }

    openWebView(url, cache = "") {
        cc.sys.openURL(url);
        return;

        if (cache == "AG") {
            if (Configs.Login.CACHE_AG) {
                SPUtils.setMusicVolumn(0);
                BroadcastReceiver.send(BroadcastReceiver.ON_AUDIO_CHANGED);
                this.cacheWebView[cache].position = cc.v3(0, 0, 0);
            } else {
                var item = cc.instantiate(this.popupWebView);
                item.parent = this.node;
                item.getComponent("PopupWebView").show(url, cache);
                this.cacheWebView[cache] = item;
            }
        }
        else if (cache == "IBC") {
            if (Configs.Login.CACHE_IBC) {
                SPUtils.setMusicVolumn(0);
                BroadcastReceiver.send(BroadcastReceiver.ON_AUDIO_CHANGED);
                this.cacheWebView[cache].position = cc.v3(0, 0, 0);
            } else {
                var item = cc.instantiate(this.popupWebView);
                item.parent = this.node;
                item.getComponent("PopupWebView").show(url, cache);
                this.cacheWebView[cache] = item;
            }
        }
        else if (cache == "WM") {
            if (Configs.Login.CACHE_WM) {
                SPUtils.setMusicVolumn(0);
                BroadcastReceiver.send(BroadcastReceiver.ON_AUDIO_CHANGED);
                this.cacheWebView[cache].position = cc.v3(0, 0, 0);
            } else {
                var item = cc.instantiate(this.popupWebView);
                item.parent = this.node;
                item.getComponent("PopupWebView").show(url, cache);
                this.cacheWebView[cache] = item;
            }
        }
        else {
            var item = cc.instantiate(this.popupWebView);
            item.parent = this.node;
            item.getComponent("PopupWebView").show(url, cache);
        }

    }

    actLoginCMD(isPlayNow = false) {
        if (!Configs.Login.IsLogin) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
            return;
        }
        App.instance.showLoading(true);
        Http.get(App.API_CMD, { t: "bl", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
            //Utils.Log("updateInfoCMD:" + JSON.stringify(res));
            App.instance.showLoading(false);
            if (res["code"] == 0) {
                var balance = res["data"]["data"][0]["betAmount"];
                if (balance < 10000 && isPlayNow == false) {
                    this.actPopupGameTransfer("CMD", balance);
                }
                else {
                    App.instance.showLoading(true);
                    Http.get(App.API_CMD, { t: "lg", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
                        App.instance.showLoading(false);
                        if (res["code"] == 0) {
                            var url = res["data"]["webRoot"] + "/auth.aspx?lang=vi-VN&user=" + res["data"]["userName"] + "&token=" + res["data"]["token"] + "&currency=VD&templatename=blue&view=v2";

                            if (cc.sys.isMobile == true) {
                                url = res["data"]["mobileRoot"] + "/auth.aspx?lang=vi-VN&user=" + res["data"]["userName"] + "&token=" + res["data"]["token"] + "&currency=VD&templatename=blue&view=v2";
                            }
                            cc.sys.openURL(url);
                        }
                        else {
                            App.instance.ShowAlertDialog(res["message"]);
                        }
                        //Utils.Log("LoginIBC err:" + JSON.stringify(err));
                        //Utils.Log("LoginIBC res:" + JSON.stringify(res));


                    });
                }
            }
            else {
                this.ShowAlertDialog("Game đang bảo trì");
            }
        });
    }

    actLoginSBO(isPlayNow = false) {
        if (!Configs.Login.IsLogin) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
            return;
        }
        App.instance.showLoading(true);
        Http.get(App.API_SBO, { t: "CheckBalance", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
            //Utils.Log("updateInfoSBO:" + JSON.stringify(res));
            App.instance.showLoading(false);
            if (res != null && res["res"] == 0) {
                var balance = parseInt(res["data"]["balance"]) * 1000;
                if (balance < 10000 && isPlayNow == false) {
                    this.actPopupGameTransfer("SBO", balance);
                }
                else {
                    App.instance.showLoading(true);
                    Http.get(App.API_SBO, { t: "Login", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken, gc: 'SportsBook' }, (err, res) => {
                        //Utils.Log("Login SBO:" + JSON.stringify(res));
                        App.instance.showLoading(false);
                        if (res["res"] == 0) {
                            var url = "https:" + res['data'] + "&lang=vi-vn&oddstyle=MY&theme=sbo&device=" + (cc.sys.isNative ? "m" : "d");
                            //Utils.Log("url=" + url);
                            cc.sys.openURL(url);
                        }
                        else {
                            App.instance.ShowAlertDialog(res["message"]);
                        }
                    });
                }
            }
            else {
                this.ShowAlertDialog("Game đang bảo trì");
            }
        });

    }
    actShowPopupGameSBO() {
        if (!this.popupGameSBO) {
            let cb = (prefab) => {
                App.instance.showLoading(false);
                this.popupGameSBO = cc.instantiate(prefab).getComponent("Lobby.PopupGameSBO");
                this.popupGameSBO.node.parent = App.instance.canvas;
                this.popupGameSBO.show();
            }
            BundleControl.loadPrefabPopup("PrefabPopup/PopupGameSBO", cb);
        } else {
            App.instance.showLoading(false);
            this.popupGameSBO.show();
        }
    }
    actLoginIBC(isPlayNow = false) {
        if (!Configs.Login.IsLogin) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
            return;
        }
        App.instance.showLoading(true);
        Http.get(App.API_IBC, { t: "CheckBalance", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
            //Utils.Log("updateInfoICB:" + JSON.stringify(res));
            App.instance.showLoading(false);
            if (res["code"] == 0) {
                var balance = parseInt(res["data"]["balance"]) * 1000;
                if (balance < 10000 && isPlayNow == false) {
                    this.actPopupGameTransfer("IBC", balance);
                }
                else {
                    App.instance.showLoading(true);
                    Http.get(App.API_IBC, { t: "Login", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
                        App.instance.showLoading(false);
                        if (res["code"] == 0) {
                            if (Configs.App.IS_PRO == true && Configs.Login.UserType != "2") {
                                var url = "https://mkt.l0030.ig128.com/deposit_processlogin.aspx?lang=vn&token=" + res["data"]["data"];
                                if (cc.sys.isMobile == true) {
                                    url = "https://ismart.l0030.ig128.com/deposit_processlogin.aspx?lang=vn&token=" + res["data"]["data"];
                                }
                                cc.sys.openURL(url);

                            }
                            else {
                                var url = "http://sbtest.l0030.ig128.com/deposit_processlogin.aspx?lang=vn&token=" + res["data"]["data"];
                                if (cc.sys.isMobile == true) {
                                    url = "http://smartsbtest.l0030.ig128.com/deposit_processlogin.aspx?lang=vn&token=" + res["data"]["data"];
                                }
                                cc.sys.openURL(url);
                            }
                        }
                        else {
                            App.instance.ShowAlertDialog(res["message"]);
                        }
                    });
                }

            }
            else {
                this.ShowAlertDialog("Game đang bảo trì");

            }


        });

    }

    actLoginWM(isPlayNow = false) {
        if (!Configs.Login.IsLogin) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
            return;
        }
        App.instance.showLoading(true);
        Http.get(App.API_WM, { t: "CheckBalance", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
            App.instance.showLoading(false);
            if (res["list"][0] == 0) {
                var balance = parseInt(res["list"][1]) * 1000;
                if (balance < 10000 && isPlayNow == false) {
                    this.actPopupGameTransfer("WM", balance);
                }
                else {
                    App.instance.showLoading(true);
                    Http.get(App.API_WM, { t: "Login", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
                        App.instance.showLoading(false);

                        if (res["list"][0] == 0) {
                            App.instance.openWebView(res["list"][1], "WM");
                        }
                        else {
                            App.instance.ShowAlertDialog(res["msg"]);
                        }

                    });
                }

            }
            else {
                this.ShowAlertDialog("Game đang bảo trì");

            }
        });

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
    actPopupGameTransfer(typeGame, balance = null) {
        if (!Configs.Login.IsLogin) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
            return;
        }
        if (!this.popupGameTransfer) {
            let cb = (prefab) => {
                let popupGameTransfer = cc.instantiate(prefab).getComponent("Lobby.PopupGameTransfer");
                popupGameTransfer.node.parent = App.instance.canvas;
                this.popupGameTransfer = popupGameTransfer;
                this.popupGameTransfer.showGame(typeGame, balance);
            }
            BundleControl.loadPrefabPopup("PrefabPopup/PopupGameTransfer", cb);
        } else {
            this.popupGameTransfer.showGame(typeGame, balance);
        }
    }

    actLoginAG(isPlayNow = false) {
        if (!Configs.Login.IsLogin) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
            return;
        }
        App.instance.showLoading(true);
        var self = this;
        Http.get(App.API_AG, { t: "GetBalance", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
            App.instance.showLoading(false);
            if (res["res"] == 0) {
                if (res["list"][0]["info"] == "error") {
                    this.ShowAlertDialog("Game đang bảo trì");
                }
                else {
                    var balance = parseInt(res.list[0]["info"]) * 1000;
                    if (balance < 10000 && isPlayNow == false) {
                        this.actPopupGameTransfer("AG", balance);
                    }
                    else {
                        App.instance.showLoading(true);
                        Http.get(App.API_AG, { t: "Forward", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
                            App.instance.showLoading(false);
                            //Utils.Log("LoginAG err:" + JSON.stringify(err));
                            //Utils.Log("LoginAG res:" + JSON.stringify(res));
                            if (res["res"] == 0) {
                                if (res["list"].length > 0) {
                                    App.instance.openWebView(res["list"][0], "AG");
                                }
                            }
                            else {
                                App.instance.ShowAlertDialog(res["msg"]);
                            }

                        });
                    }
                }
            }
            else {
                this.ShowAlertDialog("Game đang bảo trì");
            }
        });

    }
    actLoginEbet(isPlayNow = false) {
        if (!Configs.Login.IsLogin) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
            return;
        }
        App.instance.showLoading(true);
        var self = this;
        Http.get(App.API_EBET, { t: "CheckBalance", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
            App.instance.showLoading(false);
            //Utils.Log(res);
            if (res["res"] == 0) {
                if (res["data"] == null) {
                    this.ShowAlertDialog("Game đang bảo trì");
                }
                else {
                    var balance = parseInt(res.data["money"]) * 1000;
                    if (balance < 10000 && isPlayNow == false) {
                        this.actPopupGameTransfer("EBET", balance);
                    }
                    else {
                        App.instance.showLoading(true);
                        Http.get(App.API_EBET, { t: "Login", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
                            App.instance.showLoading(false);
                            if (res["res"] == 0) {
                                let url = "https://zf.live-b2b.com/h5/72895c?username=%s&accessToken=%s";
                                cc.sys.openURL(cc.js.formatStr(url, res['data']['ebetid'], res['data']['token']))
                            }
                            else {
                                App.instance.ShowAlertDialog(res["msg"]);
                            }

                        });
                    }
                }
            }
            else {
                this.ShowAlertDialog("Game đang bảo trì");
            }
        });

    }
    actLoginShootFish(isPlayNow = false, balance = 0) {
        // flow:Check Balance->show popup->goto game
        if (!Configs.Login.IsLogin) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
            return;
        }
        if (!isPlayNow) {
            this.actPopupGameTransfer("FISH");
        } else {
            App.instance.showLoading(true);
            Http.get(Configs.App.API, { c: 2021, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken, mn: balance }, (err, res) => {
                App.instance.showLoading(false);
                //Utils.Log("Res Login ShootFish:", res);
                if (res["errorCode"] == "0") {
                    //Utils.Log("Login Succes");
                    if (res.data != null && res.data != "") {
                        App.instance.openWebView(res.data);
                    }
                } else {
                    App.instance.ShowAlertDialog(res["msg"]);
                }
            });
        }

    }


    removeAllWebView() {
        Configs.Login.CACHE_AG = false;
        Configs.Login.CACHE_IBC = false;
        Configs.Login.CACHE_WM = false;

        for (var key in this.cacheWebView) {
            if (this.cacheWebView[key] != null) {
                this.cacheWebView[key].destroy();
            }
        }
    }

    openGame(bundleName, sceneName) {
        this.showLoading(true, -1);
        BundleControl.loadSceneGame(bundleName, sceneName, (finish, total) => {
            this.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
        }, bundle => {
            this.showLoading(false);
        });
        // }
    }

    openMiniGameBauCua(bundleName, prefabName) {
        this.showLoading(true, -1);
        BundleControl.loadPrefabGame(bundleName, prefabName, (finish, total) => {
            this.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
        }, (prefab, bundle) => {
            this.showLoading(false);
            if (this.bauCua == null) {
                let node = cc.instantiate(prefab);
                node.parent = this.canvas;
                node.active = false;
                this.bauCua = node.getComponent(MiniGame);
                node.getComponent("BauCua.BauCuaController").baucuaBundle = bundle;
            }
            this.showGameMini("BauCua", this.bauCua.node);
            this.bauCua.show();
        });
        // }
    }

    openMiniGameTaiXiuDouble(bundleName, prefabName) {
        if (this.taiXiuDouble == null) {
            this.showLoading(true, -1);
            BundleControl.loadPrefabGame(bundleName, prefabName, (finish, total) => {
                this.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
            }, prefab => {
                this.showLoading(false);
                if (this.taiXiuDouble == null) {
                    let node = cc.instantiate(prefab);
                    node.parent = this.canvas;
                    node.active = false;

                    this.taiXiuDouble = node.getComponent(MiniGame);
                }
                this.showGameMini("TaiXiu", this.taiXiuDouble.node);
                this.taiXiuDouble.show();
            });
        } else {
            this.showGameMini("TaiXiu", this.taiXiuDouble.node);
            this.taiXiuDouble.show();
        }

        // }
    }
    openMiniGameTaiXiuSieuToc(bundleName, prefabName) {
        TaiXiuSTNetworkClient.getInstance().checkConnect(() => {
            if (this.taiXiuSieuToc == null) {
                this.showLoading(true, -1);
                BundleControl.loadPrefabGame(bundleName, prefabName, (finish, total) => {
                    this.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
                }, prefab => {
                    this.showLoading(false);
                    if (this.taiXiuSieuToc == null) {
                        let node = cc.instantiate(prefab);
                        node.parent = this.miniGame;
                        node.active = false;
                        this.taiXiuSieuToc = node.getComponent(MiniGame);
                    }
                    this.showGameMini("TaiXiuSieuToc", this.taiXiuSieuToc.node);
                    this.taiXiuSieuToc.show();
                });
            } else {
                this.showGameMini("TaiXiuSieuToc", this.taiXiuSieuToc.node);
                this.taiXiuSieuToc.show();
            }
        })
    }

    openMiniGameTaiXiuMD5(bundleName, prefabName) {
        if (this.TaiXiuMD5 == null) {
            this.showLoading(true, -1);
            BundleControl.loadPrefabGame(bundleName, prefabName, (finish, total) => {
                this.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
            }, prefab => {
                this.showLoading(false);
                if (this.TaiXiuMD5 == null) {
                    let node = cc.instantiate(prefab);
                    node.parent = this.canvas;
                    node.active = false;

                    this.TaiXiuMD5 = node.getComponent(MiniGame);
                }
                this.showGameMini("TaiXiuMD5", this.TaiXiuMD5.node);
                this.TaiXiuMD5.show();
            });
        } else {
            this.showGameMini("TaiXiuMD5", this.TaiXiuMD5.node);
            this.TaiXiuMD5.show();
        }

        // }
    }

    openMiniGameCaoThap(bundleName, prefabName) {
        this.showLoading(true, -1);
        BundleControl.loadPrefabGame(bundleName, prefabName, (finish, total) => {
            this.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
        }, prefab => {
            this.showLoading(false);
            if (this.caoThap == null) {
                let node = cc.instantiate(prefab);
                node.parent = this.miniGame;
                node.active = false;

                this.caoThap = node.getComponent(MiniGame);
            }
            this.caoThap.show();
            this.showGameMini("CaoThap", this.caoThap.node);
        });
        // }
    }

    openMiniGameSlot3x3(bundleName, prefabName) {
        this.showLoading(true, -1);
        BundleControl.loadPrefabGame(bundleName, prefabName, (finish, total) => {
            this.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
        }, prefab => {
            this.showLoading(false);
            if (this.slot3x3 == null) {
                let node = cc.instantiate(prefab);
                node.parent = this.miniGame;
                node.active = false;

                this.slot3x3 = node.getComponent(MiniGame);
            }
            this.slot3x3.show();
            this.showGameMini("Slot3x3", this.slot3x3.node);
        });
        // }
    }
    openMiniGameSlot3x3Gem(bundleName, prefabName) {
        this.showLoading(true, -1);
        BundleControl.loadPrefabGame(bundleName, prefabName, (finish, total) => {
            this.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
        }, prefab => {
            this.showLoading(false);
            if (this.slot3x3Gem == null) {
                let node = cc.instantiate(prefab);
                node.parent = this.miniGame;
                node.active = false;

                this.slot3x3Gem = node.getComponent(MiniGame);
            }
            this.slot3x3Gem.show();
            this.showGameMini("Slot3x3Gem", this.slot3x3Gem.node);
        });
        // }
    }

    openMiniGameMiniPoker(bundleName, prefabName) {
        this.showLoading(true, -1);
        BundleControl.loadPrefabGame(bundleName, prefabName, (finish, total) => {
            this.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
        }, prefab => {
            this.showLoading(false);
            if (this.miniPoker == null) {
                let node = cc.instantiate(prefab);
                node.parent = this.miniGame;
                node.active = false;
                this.miniPoker = node.getComponent(MiniGame);
            }
            this.miniPoker.show();
            this.showGameMini("MiniPoker", this.miniPoker.node);
        });
        // }
    }

    openMiniGameOneTuTi(bundleName, prefabName) {
        this.showLoading(true, -1);

        BundleControl.loadPrefabGame(bundleName, prefabName, (finish, total) => {
            this.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
        }, prefab => {
            this.showLoading(false);
            if (this.oanTuTi == null) {
                let node = cc.instantiate(prefab);
                node.parent = this.miniGame;
                node.active = false;
                this.oanTuTi = node.getComponent(MiniGame);
            }
            this.oanTuTi.show();
        });
        // }
    }
    public openTelegram(name: string = null) {
        if (name == null) {
            name = Configs.App.getLinkTelegram();
        }
        let url = "http://www.telegram.me/" + name;
        if (cc.sys.isNative) {
            url = "tg://resolve?domain=" + name;
        }
        cc.sys.openURL(url);
    }
    public ShowAlertDialog(mess: string) {
        this.alertDialog.showMsg(mess);
    }
    public showConfirmDialog(mess, cb, canClose) {
        this.alertDialog.showMsgWithOnDismissed(mess, cb, canClose)
    }
    public showToast(msg) {
        this.alertToast.active = true;
        this.alertToast.zIndex = cc.macro.MAX_ZINDEX - 9;
        this.alertToast.getComponentInChildren(cc.Label).string = msg;
        cc.Tween.stopAllByTarget(this.alertToast);
        cc.tween(this.alertToast).set({ y: 0 }).to(2.0, { y: 100 }, { easing: cc.easing.sineOut }).call(() => {
            this.alertToast.active = false;
        }).start();
    }
    public getTextLang(key: string) {
        return LanguageLanguageManager.instance.getString(key)
    }
    public getJPGameID(gameName): string {
        let gameID = "";
        switch (gameName) {
            case "THANTAI":
                gameID = "spartan";
                break;
            case "DUAXE":
                gameID = "audition";
                break;
            case "CHIEMTINH":
                gameID = "chiemtinh";
                break;
            case "THETHAO":
                gameID = "maybach";
                break;
            case "CHIMDIEN":
                gameID = "tamhung";
                break;
            case "BITCOIN":
                gameID = "benley";
                break;
            case "THANBAI":
                gameID = "rollRoye";
                break;
            case "BIKINI":
                gameID = "bikini";
                break;
            case "PIKACHU":
                gameID = "pokemon";
                break;
            case "MINIPOKER":
                gameID = "minipoker";
                break;
            case "KIMCUONG":
                gameID = "galaxy";
                break;
            case "TAIXIU":
                gameID = "TAI_XIU";
                break;
        }
        return gameID;
    }
    public getGameName(gameID) {
        let gameName = gameID;
        switch (gameID) {
            case 'audition':
                gameName = "Đua Xe";
                break;
            case 'spartan':
                gameName = "Thần Tài";
                break;
            case 'pokemon':
                gameName = "Xèng";
                break;
            case 'benley':
                gameName = "Bitcoin";
                break;
            case 'maybach':
                gameName = "Sơn Tinh";
                break;
            case 'tamhung':
                gameName = "Ngũ Long";
                break;
            case 'chiemtinh':
                gameName = "Ăn Khế";
                break;
            case 'bikini':
                gameName = "Tây Du Ký";
                break;
            case 'minipoker':
                gameName = "Mini Poker";
                break;
            case 'caothap':
                gameName = "Cao Thấp";
                break;
            case 'rollRoye':
                gameName = "Tú Linh";
                break;
            case 'galaxy':
                gameName = "Kim Cương";
                break;
            case 'TAI_XIU':
                gameName = "Tài Xỉu";
                break;
        }
        return gameName;
    }
    checkTimeLixi() {
        let timeCurent = new Date();
        let timeLixi = new Date(timeCurent.getFullYear(), timeCurent.getMonth(), timeCurent.getDate(), 16);
        let deltaTime = timeLixi.getTime() - timeCurent.getTime();
        let deltaHour = Math.floor(deltaTime / 1000 / 3600);
        let hour = deltaHour > 9 ? deltaHour : "0" + deltaHour;
        let deltaMinutes = Math.floor((deltaTime / 1000 / 60) % 60);
        let minutes = deltaMinutes > 9 ? deltaMinutes : "0" + deltaMinutes;
        let msg = "Sự kiện \"Lì Xì Giờ Vàng\" sẽ diễn ra sau: %sh %s phút nữa!";
        msg = cc.js.formatStr(msg, hour, minutes);
        if (deltaTime > 60000) {
            this.uiNotifyJackpot.addNotify({ message: msg });
            this.scheduleOnce(() => {
                this.checkTimeLixi();
            }, 1800);
        }
    }
    actGetEventLixi() {
        // http://43.128.27.35:8081/api?c=2036&nn=BigBird&at=9350306a24c780af46509750ba4b50ab&ac=get
        Http.get(Configs.App.API, { "c": 2036, "nn": Configs.Login.Nickname, "at": Configs.Login.AccessToken, "ac": "get" }, (err, res) => {
            if (err) {
                return;
            } else {
             //   cc.log(res);
                if (res['data'] == "Not passed conditions") {
                    App.instance.ShowAlertDialog("Quý khách không đủ điều kiện tham gia sự kiện \"Lì Xì Giờ Vàng\"\nVui lòng đọc thể lệ hoặc liên hệ CSKH!");
                } else if (res['data'] == "Received bonus" || res['errorCode'] == "1003") {
                    // App.instance.ShowAlertDialog("Quý khách ");
                } else {
                    this.actShowPopupEventLixi();
                }
            }
        });

    }
    actShowPopupEventLixi() {
        if (!this.popupEvent) {
            let cb = (prefab) => {
                this.popupEvent = cc.instantiate(prefab).getComponent("PopupEvent");
                this.popupEvent.node.parent = App.instance.node;
                this.popupEvent.type = 1;
                this.popupEvent.showpPopup();
            }
            BundleControl.loadPrefabPopup("PrefabPopup/PopupEvent", cb);
        } else {
            this.popupEvent.type = 1;
            this.popupEvent.showpPopup();
        }
    }
    actShowPopupRuleLixi() {
        if (!this.popupEvent) {
            let cb = (prefab) => {
                this.popupEvent = cc.instantiate(prefab).getComponent("PopupEvent");
                this.popupEvent.node.parent = App.instance.node;
                this.popupEvent.type = 0;
                this.popupEvent.showpPopup();
            }
            BundleControl.loadPrefabPopup("PrefabPopup/PopupEvent", cb);
        } else {
            this.popupEvent.type = 0;
            this.popupEvent.showpPopup();
        }
    }

    openGameLiveCasino(url, cache = "") {
        if (cc.sys.isBrowser && (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)) {
            cc.sys.openURL(url);
            return;
        } else {
            this.showLoading(true);
            if (!this.popupWebLiveCasino) {
                let cb = (prefab) => {
                    let popupnaprut = cc.instantiate(prefab).getComponent("PopupWebView");
                    popupnaprut.node.parent = App.instance.node;
                    this.popupWebLiveCasino = popupnaprut;
                    SPUtils.setMusicVolumn(0);
                    BroadcastReceiver.send(BroadcastReceiver.ON_AUDIO_CHANGED);
                    this.popupWebLiveCasino.show1(url);
                }
                BundleControl.loadPrefabPopup("PrefabPopup/PopupWebView", cb);
            }else {
                SPUtils.setMusicVolumn(0);
                BroadcastReceiver.send(BroadcastReceiver.ON_AUDIO_CHANGED);
                this.popupWebLiveCasino.show1(url);
            }
        }
    }
}
