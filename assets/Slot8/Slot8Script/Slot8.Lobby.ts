
import App from "../../Lobby/LobbyScript/Script/common/App";
import Tween from "../../Lobby/LobbyScript/Script/common/Tween";
import SlotNetworkClient from "../../Lobby/LobbyScript/Script/networks/SlotNetworkClient";
import cmd from "./Slot8Cmd";
import Slot8Controller from "./Slot8Controller";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Slot8Lobby extends cc.Component {

    @property([cc.Label])
    listPot: cc.Label[] = [];
    @property([cc.Node])
    rooms: cc.Node[] = [];

    mSlotController: Slot8Controller = null;

    public init(pSlot3Controller: Slot8Controller) {
        this.mSlotController = pSlot3Controller;
        this.node.zIndex = 2;
        if (this.mSlotController.isMusic) cc.audioEngine.playMusic(this.mSlotController.musicGame, true);
        this.show();
    }

    onLoad() {
        this.node.getComponentInChildren(sp.Skeleton).node.setScale(cc.v2(0.67 * (cc.winSize.width / 1280), 0.67 * (cc.winSize.height / 720)));
        // for (let i = 0; i < this.rooms.length; i++) {
        //     this.rooms[i].x = this.rooms[i].x * (cc.winSize.width / 1280);
        //     this.rooms[i].y = this.rooms[i].y * (cc.winSize.width / 1280);
        //     this.rooms[i].scale = this.rooms[i].scale * (cc.winSize.width / 1280)
        // }
    }
    show() {
        this.node.active = true;

    }

    hide() {
        this.node.active = false;
    }


    public onBtnBack() {
        if (this.mSlotController.isSound) {
            cc.audioEngine.play(this.mSlotController.soundClick, false, 1);
        }
        SlotNetworkClient.getInstance().send(new cmd.SendUnSubcribe(this.mSlotController.betId));
        cc.audioEngine.stopAll();
        App.instance.loadScene("Lobby");
    }

    private onBtnTry() {
        this.mSlotController.betId = 0;
        SlotNetworkClient.getInstance().send(new cmd.SendSubcribe(this.mSlotController.betId));
        this.node.active = false;

        this.mSlotController.onJoinRoom(null);
        this.mSlotController.isTrial = true;
    }


    public onUpdateJackpot(pData) {
        let res = new cmd.ResUpdateJackpotSlots(pData);
        let resJson = JSON.parse(res.pots);
        Tween.numberTo(this.listPot[0], resJson['rollRoye']['100'].p, 3.0);
        Tween.numberTo(this.listPot[1], resJson['rollRoye']['1000'].p, 3.0);
        Tween.numberTo(this.listPot[2], resJson['rollRoye']['10000'].p, 3.0);
    }
}
