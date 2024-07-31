import Configs from "../../Loading/src/Configs";
import cmd from "../../Lobby/LobbyScript/Lobby.Cmd";
import App from "../../Lobby/LobbyScript/Script/common/App";
import BroadcastReceiver from "../../Lobby/LobbyScript/Script/common/BroadcastReceiver";
import Dialog from "../../Lobby/LobbyScript/Script/common/Dialogz";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import MiniGameNetworkClient from "../../Lobby/LobbyScript/Script/networks/MiniGameNetworkClient";
import ShootFishNetworkClient from "../../Lobby/LobbyScript/Script/networks/ShootFishNetworkClient";

const { ccclass, property } = cc._decorator;

@ccclass("OanTuTi.PopupCoinTransfer.TabCashIn")
export class TabCashIn {
    @property(cc.Label)
    lblBalance: cc.Label = null;
    @property(cc.EditBox)
    edbCoin: cc.EditBox = null;
    @property(cc.Node)
    quickButtons: cc.Node = null;

    private popup: PopupCoinTransfer = null;

    private readonly values = [50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000];

    public start(popup: PopupCoinTransfer) {
        this.popup = popup;
        this.edbCoin.node.on("editing-did-ended", () => {
            let number = Utils.stringToInt(this.edbCoin.string);
            this.edbCoin.string = Utils.formatNumber(number);
        });
        for (let i = 0; i < this.quickButtons.childrenCount; i++) {
            var btn = this.quickButtons.children[i];
            let value = this.values[i];
            btn.getComponentInChildren(cc.Label).string = Utils.formatNumber(value);
            btn.on("click", () => {
                this.edbCoin.string = Utils.formatNumber(value);
            });
        }
    }

    public submit() {
        let coin = Utils.stringToInt(this.edbCoin.string);
        if (coin <= 0) {
            App.instance.alertDialog.showMsg("Số tiền đã nhập không hợp lệ.");
            return;
        }
        App.instance.showLoading(true);
        ShootFishNetworkClient.getInstance().request("xxengCashin", { "ccash": coin }, (res) => {
            App.instance.showLoading(false);
            // console.log(res);
            if (!res["ok"]) {
                App.instance.alertDialog.showMsg("Thao tác thất bại, vui lòng thử lại sau.");
                return;
            }
            Configs.Login.CoinFish = res["newCash"];
            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
            App.instance.alertDialog.showMsg("Thao tác thành công.");
            this.reset();

            MiniGameNetworkClient.getInstance().send(new cmd.ReqGetMoneyUse());
        }, this.popup);
    }

    public reset() {
        this.edbCoin.string = "";
        this.lblBalance.string = Utils.formatNumber(Configs.Login.Coin);
    }
}

@ccclass("OanTuTi.PopupCoinTransfer.TabCashOut")
export class TabCashOut {
    @property(cc.Label)
    lblBalance: cc.Label = null;
    @property(cc.EditBox)
    edbCoin: cc.EditBox = null;
    @property(cc.Node)
    quickButtons: cc.Node = null;

    private popup: PopupCoinTransfer = null;

    private readonly values = [50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000];

    public start(popup: PopupCoinTransfer) {
        this.popup = popup;
        this.edbCoin.node.on("editing-did-ended", () => {
            let number = Utils.stringToInt(this.edbCoin.string);
            this.edbCoin.string = Utils.formatNumber(number);
        });
        for (let i = 0; i < this.quickButtons.childrenCount; i++) {
            var btn = this.quickButtons.children[i];
            let value = this.values[i];
            btn.getComponentInChildren(cc.Label).string = Utils.formatNumber(value);
            btn.on("click", () => {
                this.edbCoin.string = Utils.formatNumber(value);
            });
        }
    }

    public submit() {
        let coin = Utils.stringToInt(this.edbCoin.string);
        if (coin <= 0) {
            App.instance.alertDialog.showMsg("Số tiền đã nhập không hợp lệ.");
            return;
        }
        App.instance.showLoading(true);
        ShootFishNetworkClient.getInstance().request("xxengCashin", { "ccash": -coin }, (res) => {
            App.instance.showLoading(false);
            // console.log(res);
            if (!res["ok"]) {
                App.instance.alertDialog.showMsg("Thao tác thất bại, vui lòng thử lại sau.");
                return;
            }
            Configs.Login.CoinFish = res["newCash"];
            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
            App.instance.alertDialog.showMsg("Thao tác thành công.");
            this.reset();

            MiniGameNetworkClient.getInstance().send(new cmd.ReqGetMoneyUse());
        }, this.popup);
    }

    public reset() {
        this.edbCoin.string = "";
        this.lblBalance.string = Utils.formatNumber(Configs.Login.CoinFish);
    }
}

@ccclass
export default class PopupCoinTransfer extends Dialog {
    @property(cc.ToggleContainer)
    tabs: cc.ToggleContainer = null;
    @property(cc.Node)
    tabContents: cc.Node = null;
    @property(TabCashIn)
    tabCashIn: TabCashIn = null;
    @property(TabCashOut)
    tabCashOut: TabCashOut = null;

    private tabSelectedIdx = 0;

    start() {
        for (let i = 0; i < this.tabs.toggleItems.length; i++) {
            this.tabs.toggleItems[i].node.on("toggle", () => {
                this.tabSelectedIdx = i;
                this.onTabChanged();
            });
        }

        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            this.tabCashIn.lblBalance.string = Utils.formatNumber(Configs.Login.Coin);
            this.tabCashOut.lblBalance.string = Utils.formatNumber(Configs.Login.CoinFish);
        }, this);

        this.tabCashIn.start(this);
        this.tabCashOut.start(this);
    }

    show() {
        super.show();
        this.tabSelectedIdx = 0;
        this.tabs.toggleItems[this.tabSelectedIdx].isChecked = true;
        this.onTabChanged();
    }

    private onTabChanged() {
        for (let i = 0; i < this.tabContents.childrenCount; i++) {
            this.tabContents.children[i].active = i == this.tabSelectedIdx;
        }
        switch (this.tabSelectedIdx) {
            case 0:
                this.tabCashIn.reset();
                break;
            case 1:
                this.tabCashOut.reset();
                break;
        }
    }

    public actSubmitCashIn() {
        this.tabCashIn.submit();
    }

    public actSubmitCashOut() {
        this.tabCashOut.submit();
    }

    public actClearCashIn() {
        this.tabCashIn.edbCoin.string = "0";
    }

    public actClearCashOut() {
        this.tabCashOut.edbCoin.string = "0";
    }
}
