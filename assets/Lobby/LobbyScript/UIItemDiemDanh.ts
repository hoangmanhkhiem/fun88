
import { cmd } from "./Lobby.Cmd";
import App from "./Script/common/App";
import Utils from "./Script/common/Utils";
import MiniGameNetworkClient from "./Script/networks/MiniGameNetworkClient";
import SlotNetworkClient from "./Script/networks/SlotNetworkClient";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIItemDiemDanh extends cc.Component {

    @property(cc.Label)
    txtProgress: cc.Label = null;
    @property(cc.Label)
    txtDes: cc.Label = null;
    @property(cc.Sprite)
    imgProgress: cc.Sprite = null;
    @property(cc.Node)
    btnLam: cc.Node = null;
    @property(cc.Node)
    btnNhanThuong: cc.Node = null;
    @property(cc.Node)
    btnHoanThanh: cc.Node = null;

    private data = null;

    getDescription(gameId) {
        var des = "";
        switch (gameId) {
            case 191:
                des = "Tổng cược ĂN KHẾ TRẢ VÀNG 200k Tặng 1 lượt quay THEWITCHER 100";
                break;
            case 170:
                des = "Tổng cược THEWITCHER 200k Tặng 1 lượt quay THẦN TÀI 100";
                break;
            case 110:
                des = "Tổng cược THẦN TÀI 200k Tặng 1 lượt quay CUNG HỶ PHÁT TÀI 100";
                break;
            case 160:
                des = "Tổng cược CUNG HỶ PHÁT TÀI 200k Tặng 1 lượt quay SƠN TINH THỦY TINH 100";
                break;
            case 150:
                des = "Tổng cược SƠN TINH THỦY TINH 200k Tặng 1 lượt quay CUNG HỶ PHÁT TÀI 100";
                break;
            case 180:
                des = "Tổng cược KHO TÀNG NGŨ LONG 200k Tặng 1 lượt quay THEWITCHER 100";
                break;
                break;
        }
        return des;
    }

    init(data) {
        this.data = data;
        this.txtDes.string = this.getDescription(data.dailyQuestData.gameId);
        var ratio = data.dailyGiftData.currentValue / data.dailyQuestData.valueDone;
        if (ratio > 1) {
            ratio = 1;
        }
        this.txtProgress.string = App.instance.getTextLang('txt_progress') + ": " + Math.floor(ratio * 100) + "%";
        this.imgProgress.fillRange = ratio;
        if (data.dailyGiftData.isReceive == true) {
            this.btnLam.active = false;
            this.btnNhanThuong.active = false;
            this.btnHoanThanh.active = false;
        }
        else if (data.dailyGiftData.isSuccess == true) {
            this.btnLam.active = false;
            this.btnNhanThuong.active = true;
            this.btnHoanThanh.active = false;
        }

        else {
            this.btnLam.active = true;
            this.btnNhanThuong.active = false;
            this.btnHoanThanh.active = false;
        }
    }

    onBtnLam() {
        if (this.data.dailyQuestData.gameId == 120) {
            App.instance.removeAllWebView();
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openGame("Slot3", "Slot3");
            });
        }
        else if (this.data.dailyQuestData.gameId == 110) {
            App.instance.removeAllWebView();
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openGame("Slot1", "Slot1");
            });
        }
        else if (this.data.dailyQuestData.gameId == 170) {
            App.instance.removeAllWebView();
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openGame("Slot7", "Slot7");
            });
        }
        else if (this.data.dailyQuestData.gameId == 160) {
            App.instance.removeAllWebView();
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openGame("Slot4", "Slot4");
            });
        }
        else if (this.data.dailyQuestData.gameId == 150) {
            App.instance.removeAllWebView();
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openGame("Slot10", "Slot10");
            });
        }
        else if (this.data.dailyQuestData.gameId == 150) {
            App.instance.removeAllWebView();
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openGame("Slot10", "Slot10");
            });
        }
        else if (this.data.dailyQuestData.gameId == 191) {
            App.instance.removeAllWebView();
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openGame("Slot6", "Slot6");
            });
        }
        else if (this.data.dailyQuestData.gameId == 180) {
            App.instance.removeAllWebView();
            App.instance.showErrLoading("Đang kết nối tới server...");
            SlotNetworkClient.getInstance().checkConnect(() => {
                App.instance.showLoading(false);
                App.instance.openGame("Slot8", "Slot8");
            });
        }
    }

    onBtnNhanThuong() {
        //Utils.Log("onBtnNhanThuong:" + JSON.stringify(this.data));
        MiniGameNetworkClient.getInstance().send(new cmd.ReqReceiveQuest(this.data.index));
    }
}
