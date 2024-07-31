
import App from "../../Lobby/LobbyScript/Script/common/App";
import Tween from "../../Lobby/LobbyScript/Script/common/Tween";
import SlotNetworkClient from "../../Lobby/LobbyScript/Script/networks/SlotNetworkClient";
import cmd from "./Slot11.Cmd";
import Slot11Controller from "./Slot11.Slot11Controller";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Slot11Lobby extends cc.Component {

    @property([cc.Label])
    listPot: cc.Label[] = [];

    mSlotController: Slot11Controller = null;

    public init(pSlot11Controller: Slot11Controller) {
        this.mSlotController = pSlot11Controller;
        this.node.zIndex = 2;
    }

    public onBtnBack() {
        if (this.mSlotController.soundSlotState == 1) {
            cc.audioEngine.play(this.mSlotController.soundClick, false, 1);
        }
        SlotNetworkClient.getInstance().send(new cmd.SendUnSubcribe(this.mSlotController.betIdx));
        cc.audioEngine.stopAll();
        App.instance.loadScene("Lobby");
    }

    private onBtn100() {
        this.mSlotController.betIdx = 0;
        SlotNetworkClient.getInstance().send(new cmd.SendSubcribe(this.mSlotController.betIdx));
        this.node.active = false;
        this.mSlotController.onJoinRoom();
    }

    private onBtn5k() {
        this.mSlotController.betIdx = 1;
        SlotNetworkClient.getInstance().send(new cmd.SendSubcribe(this.mSlotController.betIdx));
        this.node.active = false;
        this.mSlotController.onJoinRoom();
    }

    private omBtn10k() {
        this.mSlotController.betIdx = 2;
        SlotNetworkClient.getInstance().send(new cmd.SendSubcribe(this.mSlotController.betIdx));
        this.node.active = false;
        this.mSlotController.onJoinRoom();
    }

    private omBtnTrial() {
        this.mSlotController.actTrialOnCheck();
        SlotNetworkClient.getInstance().send(new cmd.SendSubcribe(this.mSlotController.betIdx));
        this.node.active = false;
        this.mSlotController.onJoinRoom();
    }

    public onUpdateJackpot(pData) {
        let res = new cmd.ResUpdateJackpotSlots(pData);
        let resJson = JSON.parse(res.pots);

        Tween.numberTo(this.listPot[0], resJson['benley']['100'].p, 3.0);
        Tween.numberTo(this.listPot[1], resJson['benley']['1000'].p, 3.0);
        Tween.numberTo(this.listPot[2], resJson['benley']['10000'].p, 3.0);
    }
}
