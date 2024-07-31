//import Configs from "../../Loading/src/Configs";
import { Global } from "../../Loading/src/Global";
import cmd from "./Lobby.Cmd";
import App from "./Script/common/App";
import BroadcastReceiver from "./Script/common/BroadcastReceiver";
import SPUtils from "./Script/common/SPUtils";
import Utils from "./Script/common/Utils";
import MiniGameNetworkClient from "./Script/networks/MiniGameNetworkClient";
import InPacket from "./Script/networks/Network.InPacket";


const { ccclass, property } = cc._decorator;

@ccclass
export default class ButtonMiniGame extends cc.Component {

    @property(cc.Label)
    labelTime: cc.Label = null;

    @property(cc.Label)
    labelTimePanel: cc.Label = null;

    @property(cc.Node)
    button: cc.Node = null;

    @property(cc.Node)
    buttonAG: cc.Node = null;

    @property(cc.Node)
    buttonTxSieuToc: cc.Node = null;

    @property(cc.Node)
    buttonIBC: cc.Node = null;

    @property(cc.Node)
    buttonWM: cc.Node = null;

    @property(cc.Node)
    panel: cc.Node = null;

    @property(cc.Node)
    container: cc.Node = null;

    private buttonClicked = true;
    private buttonMoved = cc.Vec2.ZERO;

    private buttonClickedAG = true;
    private buttonMovedAG = cc.Vec2.ZERO;

    private buttonClickedIBC = true;
    private buttonMovedIBC = cc.Vec2.ZERO;

    private buttonClickedWM = true;
    private buttonMovedWM = cc.Vec2.ZERO;

    onLoad() {
        if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) {
            this.buttonTxSieuToc.color = cc.Color.GRAY;
            this.buttonTxSieuToc.getComponent(cc.Button).interactable = false;
        }
        this.panel.active = false;
        this.button.active = false;
        this.labelTime.string = "00";
        this.labelTimePanel.string = "00";
        this.button.x = cc.winSize.width / 2 - 50;
        this.button.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.buttonClicked = true;
            this.buttonMoved = cc.Vec2.ZERO;
        }, this);

        this.button.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            this.buttonMoved = this.buttonMoved.add(event.getDelta());
            if (this.buttonClicked) {
                if (Math.abs(this.buttonMoved.x) > 30 || Math.abs(this.buttonMoved.y) > 30) {
                    let pos = this.button.position;
                    pos.x += this.buttonMoved.x;
                    pos.y += this.buttonMoved.y;
                    this.button.position = pos;
                    this.buttonClicked = false;
                }
            } else {
                let pos = this.button.position;
                pos.x += event.getDeltaX();
                pos.y += event.getDeltaY();
                this.button.position = pos;
            }
        }, this);

        this.button.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            if (this.buttonClicked) {
                this.actButton();
            }
            let posX = this.button.x > 0 ? cc.winSize.width / 2 - 55 : -cc.winSize.width / 2 + 90;
            cc.tween(this.button).to(0.3, { x: posX }, { easing: cc.easing.sineOut }).start();
        }, this);

        //AG
        this.buttonAG.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.buttonClickedAG = true;
            this.buttonMovedAG = cc.Vec2.ZERO;
        }, this);

        this.buttonAG.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            this.buttonMovedAG = this.buttonMovedAG.add(event.getDelta());
            if (this.buttonClickedAG) {
                if (Math.abs(this.buttonMovedAG.x) > 30 || Math.abs(this.buttonMovedAG.y) > 30) {
                    let pos = this.buttonAG.position;
                    pos.x += this.buttonMovedAG.x;
                    pos.y += this.buttonMovedAG.y;
                    this.buttonAG.position = pos;
                    this.buttonClickedAG = false;
                }
            } else {
                let pos = this.buttonAG.position;
                pos.x += event.getDeltaX();
                pos.y += event.getDeltaY();
                this.buttonAG.position = pos;
            }
        }, this);

        this.buttonAG.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            if (this.buttonClickedAG) {
                this.actButtonAG();
            }
        }, this);

        //IBC
        this.buttonIBC.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.buttonClickedIBC = true;
            this.buttonMovedIBC = cc.Vec2.ZERO;
        }, this);

        this.buttonIBC.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            this.buttonMovedIBC = this.buttonMovedIBC.add(event.getDelta());
            if (this.buttonClickedIBC) {
                if (Math.abs(this.buttonMovedIBC.x) > 30 || Math.abs(this.buttonMovedIBC.y) > 30) {
                    let pos = this.buttonIBC.position;
                    pos.x += this.buttonMovedIBC.x;
                    pos.y += this.buttonMovedIBC.y;
                    this.buttonIBC.position = pos;
                    this.buttonClickedIBC = false;
                }
            } else {
                let pos = this.buttonIBC.position;
                pos.x += event.getDeltaX();
                pos.y += event.getDeltaY();
                this.buttonIBC.position = pos;
            }
        }, this);

        this.buttonIBC.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            if (this.buttonClickedIBC) {
                this.actButtonIBC();
            }
        }, this);

        //WM
        this.buttonWM.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this.buttonClickedWM = true;
            this.buttonMovedWM = cc.Vec2.ZERO;
        }, this);

        this.buttonWM.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            this.buttonMovedWM = this.buttonMovedWM.add(event.getDelta());
            if (this.buttonClickedWM) {
                if (Math.abs(this.buttonMovedWM.x) > 30 || Math.abs(this.buttonMovedWM.y) > 30) {
                    let pos = this.buttonWM.position;
                    pos.x += this.buttonMovedWM.x;
                    pos.y += this.buttonMovedWM.y;
                    this.buttonWM.position = pos;
                    this.buttonClickedWM = false;
                }
            } else {
                let pos = this.buttonWM.position;
                pos.x += event.getDeltaX();
                pos.y += event.getDeltaY();
                this.buttonWM.position = pos;
            }
        }, this);

        this.buttonWM.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            if (this.buttonClickedWM) {
                this.actButtonWM();
            }
        }, this);

        MiniGameNetworkClient.getInstance().addListener((data: Uint8Array) => {
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.UPDATE_TIME_BUTTON:
                    {
                        let res = new cmd.ReceiveUpdateTimeButton(data);
                        this.labelTime.string = res.remainTime > 9 ? res.remainTime.toString() : "0" + res.remainTime;
                        this.labelTimePanel.string = res.remainTime > 9 ? res.remainTime.toString() : "0" + res.remainTime;
                    }
                    break;
            }
        }, this);
    }

    

   

    


    show() {
        this.panel.active = false;
        this.button.active = true;
        this.labelTime.string = "00";
        this.labelTimePanel.string = "00";
    }

    hidden() {

        this.panel.active = false;
        this.button.active = false;



    }

    showTimeTaiXiu(isShow: boolean) {
        this.labelTime.node.parent.active = isShow;
    }

    actButton() {
        this.panel.active = true;
        this.button.active = false;
        cc.tween(this.panel.getChildByName("Container")).set({ angle: -180, scale: 0 }).to(0.3, { scale: 1.0, angle: 0 }, { easing: cc.easing.sineOut }).start();
    }

    actHidden() {
        cc.tween(this.panel.getChildByName("Container")).to(0.3, { angle: -180, scale: 0 }, { easing: cc.easing.sineIn }).call(() => {
            this.panel.active = false;
            this.button.active = true;
        }).start();
    }

    actTaiXiu() {
        App.instance.openMiniGameTaiXiuDouble("TaiXiuDouble", "TaiXiuDouble");
        this.actHidden();
    }
    actTaiXiuSieuToc() {
        App.instance.openMiniGameTaiXiuSieuToc("TaiXiuSieuToc", "TaiXiuSieuToc");
        this.actHidden();
    }

    actMiniPoker() {
        App.instance.openMiniGameMiniPoker("MiniPoker", "MiniPoker");
        this.actHidden();
    }

    actSlot3x3() {
        App.instance.openMiniGameSlot3x3("Slot3x3", "Slot3x3");
        this.actHidden();
    }
    actSlot3x3Gem() {
        App.instance.openMiniGameSlot3x3Gem("Slot3x3Gem", "Slot3x3Gem");
        this.actHidden();
    }

    actCaoThap() {
        App.instance.openMiniGameCaoThap("CaoThap", "CaoThap");
        this.actHidden();
    }

    actBauCua() {
        App.instance.openMiniGameBauCua("BauCua", "BauCua");
        this.actHidden();
    }

    actChimDien() {
        App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_coming_soon"));
        this.actHidden();
    }
    actMaintain() {
        App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_reparing"));
        this.actHidden();
    }

    actOanTuTi() {
        App.instance.openMiniGameOneTuTi("OanTuTi", "OanTuTi");
        this.actHidden();
    }

    actTaiXiuMd5() {
        App.instance.openMiniGameTaiXiuMD5("TaiXiuMD5", "TaiXiuMD5");
        this.actHidden();
    }
}