
import App from "../../Lobby/LobbyScript/Script/common/App";
import Tween from "../../Lobby/LobbyScript/Script/common/Tween";
import SlotNetworkClient from "../../Lobby/LobbyScript/Script/networks/SlotNetworkClient";
import cmd from "./Slot10.Cmd";
import Slot10Controller from "./Slot10.Slot10Controller";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Slot10Lobby extends cc.Component {

    @property([cc.Label])
    listPot: cc.Label[] = [];
    @property([cc.Node])
    rooms: cc.Node[] = [];

    mSlotController: Slot10Controller = null;

    public init(pSlot3Controller: Slot10Controller) {
        this.mSlotController = pSlot3Controller;
        // for(var i=0;i<this.rooms.length;i++){
        //     this.rooms[i].opacity = 0;
        // }
        // var self = this;
        // setTimeout(function(){
        //     self.showAnimation();
        // },2000);
        this.node.zIndex = 2;
    }

    showAnimation() {
        var self = this;
        for (var i = 0; i < this.rooms.length; i++) {
            var nodeBox = this.rooms[i]
            cc.Tween.stopAllByTarget(nodeBox);
            nodeBox.opacity = 0;
            if (i == 0) {
                nodeBox.position = cc.v2(-200, 0);
            }
            else if (i == 1) {
                nodeBox.position = cc.v2(0, -200);
            }
            else if (i == 2) {
                nodeBox.position = cc.v2(0, 200);
            }
            else {
                nodeBox.position = cc.v2(200, 0);
            }
            cc.tween(nodeBox)
                .to(1, { position: cc.v2(0, 0), opacity: 255 }, { easing: "backOut" })
                .start();
        }
    },

    public onBtnBack() {
        if (this.mSlotController.soundSlotState == 1) {
            cc.audioEngine.play(this.mSlotController.soundClick, false, 1);
        }
        SlotNetworkClient.getInstance().send(new cmd.SendUnSubcribe(this.mSlotController.betIdx));
        cc.audioEngine.stopAll();
        App.instance.loadScene("Lobby");
    }

    private onBtnTry() {
        this.mSlotController.dailyFreeSpin = 0;
        this.mSlotController.lblFreeSpinCount.node.parent.active = false;
        this.mSlotController.betIdx = 0;
        this.mSlotController.mIsTrial = false;
        this.mSlotController.toggleTrialOnCheck();
        SlotNetworkClient.getInstance().send(new cmd.SendSubcribe(this.mSlotController.betIdx));
        this.node.active = false;
        this.mSlotController.onJoinRoom();

    }


    private onBtn100() {
        this.mSlotController.dailyFreeSpin = 0;
        this.mSlotController.lblFreeSpinCount.node.parent.active = false;
        this.mSlotController.betIdx = 0;
        this.mSlotController.mIsTrial = true;
        this.mSlotController.toggleTrialOnCheck();
        SlotNetworkClient.getInstance().send(new cmd.SendSubcribe(this.mSlotController.betIdx));
        this.node.active = false;
        this.mSlotController.onJoinRoom();
    }

    private onBtn5k() {
        this.mSlotController.dailyFreeSpin = 0;
        this.mSlotController.lblFreeSpinCount.node.parent.active = false;
        this.mSlotController.betIdx = 1;
        this.mSlotController.mIsTrial = true;
        this.mSlotController.toggleTrialOnCheck();
        SlotNetworkClient.getInstance().send(new cmd.SendSubcribe(this.mSlotController.betIdx));
        this.node.active = false;
        this.mSlotController.onJoinRoom();
    }

    private omBtn10k() {
        this.mSlotController.dailyFreeSpin = 0;
        this.mSlotController.lblFreeSpinCount.node.parent.active = false;
        this.mSlotController.betIdx = 2;
        this.mSlotController.mIsTrial = true;
        this.mSlotController.toggleTrialOnCheck();
        SlotNetworkClient.getInstance().send(new cmd.SendSubcribe(this.mSlotController.betIdx));
        this.node.active = false;
        this.mSlotController.onJoinRoom();
    }

    public onUpdateJackpot(pData) {
        let res = new cmd.ResUpdateJackpotSlots(pData);
        let resJson = JSON.parse(res.pots);
        Tween.numberTo(this.listPot[0], resJson['maybach']['100'].p, 0.3);
        Tween.numberTo(this.listPot[1], resJson['maybach']['1000'].p, 0.3);
        Tween.numberTo(this.listPot[2], resJson['maybach']['10000'].p, 0.3);
    }
}
