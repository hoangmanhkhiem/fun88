
import Configs from "../../Loading/src/Configs";
import Http from "../../Loading/src/Http";
import App from "../../Lobby/LobbyScript/Script/common/App";
import BroadcastReceiver from "../../Lobby/LobbyScript/Script/common/BroadcastReceiver";
import Dialog from "../../Lobby/LobbyScript/Script/common/Dialog";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import MiniGameNetworkClient from "../LobbyScript/Script/networks/MiniGameNetworkClient";
import cmd from "../LobbyScript/Lobby.Cmd";
import InPacket from "../LobbyScript/Script/networks/Network.InPacket";
import SamCmd from "./SamScript/Sam.Cmd";


const { ccclass, property } = cc._decorator;

@ccclass("PopupGameTransfer.TabCashIn")
export class TabCashIn {
    @property(cc.Label)
    lblBalance: cc.Label = null;
    @property(cc.EditBox)
    edbCoin: cc.EditBox = null;
    @property(cc.Node)
    quickButtons: cc.Node = null;

    private popup: PopupGameTransfer = null;

    private readonly values = [50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000];

    public start(popup: PopupGameTransfer) {
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

    public NapAG() {
        var money = Utils.formatEditBox(this.edbCoin.string);
        if (money > Configs.Login.Coin) {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_not_enough'));
            return;
        }
        if (this.edbCoin.string == "") {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_input_all'));
            return;
        }
        App.instance.showLoading(true);
        Http.get(App.API_AG, { t: "Deposit", a: money / 1000, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
            App.instance.showLoading(false);
            if (res["res"] == 0) {
                this.popup.updateInfoAG();
                Configs.Login.Coin -= money;
                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_note_transfer_8'));
                this.reset();
            }
            else {
                App.instance.ShowAlertDialog(res["msg"]);
            }


        });
    }

    public NapIBC() {
        var money = Utils.formatEditBox(this.edbCoin.string);
        if (money > Configs.Login.Coin) {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_not_enough'));
            return;
        }
        if (this.edbCoin.string == "") {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_input_all'));
            return;
        }
        Http.get(App.API_IBC, { t: "Transfer", d: 1, a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
            App.instance.showLoading(false);
            if (res["code"] == 0) {
                this.popup.updateInfoIBC();
                Configs.Login.Coin -= money;
                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_note_transfer_8'));
                this.reset();
            }
            else {
                App.instance.ShowAlertDialog(res["message"]);
            }


        });
    }
    public NapSBO() {
        var money = Utils.formatEditBox(this.edbCoin.string);
        if (money > Configs.Login.Coin) {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_not_enough'));
            return;
        }
        if (this.edbCoin.string == "") {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_input_all'));
            return;
        }
        Http.get(App.API_SBO, { t: "Transfer", d: 1, a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
            App.instance.showLoading(false);
             ////Utils.Log("DEPOSIT SBO:", res);
            if (res["res"] == 0) {
                this.popup.updateInfoSBO();
                Configs.Login.Coin -= money;
                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_note_transfer_8'));
                this.reset();
            }
            else {
                App.instance.ShowAlertDialog(res["message"]);
            }


        });
    }

    public NapWM() {
        var money = Utils.formatEditBox(this.edbCoin.string);
        if (money > Configs.Login.Coin) {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_not_enough'));
            return;
        }
        if (this.edbCoin.string == "") {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_input_all'));
            return;
        }
        App.instance.showLoading(true);
        Http.get(App.API_WM, { t: "Transfer", d: 1, a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
            App.instance.showLoading(false);
            if (res["res"] == 0) {
                this.popup.updateInfoWM();
                Configs.Login.Coin -= money;
                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_note_transfer_8'));
                this.reset();
            }
            else {
                App.instance.ShowAlertDialog(res["msg"]);
            }
        });
    }

    public NapEBET() {
        var money = Utils.formatEditBox(this.edbCoin.string);
        if (money > Configs.Login.Coin) {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_not_enough'));
            return;
        }
        if (this.edbCoin.string == "") {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_input_all'));
            return;
        }
        App.instance.showLoading(true);
        Http.get(App.API_EBET, { t: "Trans", d: 1, a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
            App.instance.showLoading(false);
             ////Utils.Log("Nap ebet err:" + JSON.stringify(err));
             ////Utils.Log("Nap ebet res:" + JSON.stringify(res));
            if (res["res"] == 0) {
                this.popup.updateInfoEBET();
                Configs.Login.Coin -= money;
                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_note_transfer_8'));
                this.reset();
            }
            else {
                App.instance.ShowAlertDialog(res["msg"]);
            }


        });
    }
    public napFish() {
        var money = Utils.formatEditBox(this.edbCoin.string);
        if (money > Configs.Login.Coin) {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_not_enough'));
            return;
        }
        if (this.edbCoin.string == "") {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_input_all'));
            return;
        }
        App.instance.showLoading(true);
        Http.get(Configs.App.API, { c: 2022, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken, mn: money }, (err, res) => { //check balance 
            App.instance.showLoading(false);
             ////Utils.Log("Deposit ShootFish:", res);
            if (res["errorCode"] == "0") {
                 ////Utils.Log("Deposit ShootFish Succes");
                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_note_transfer_8') + " " + Utils.formatNumber(money));
                Configs.Login.Coin -= money;
                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                this.reset();
            } else {
                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_unknown_error1'));
            }
        });
    }

    public NapSex() {
        var money = Utils.formatEditBox(this.edbCoin.string);
        if (money > Configs.Login.Coin) {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_not_enough'));
            return;
        }
        if (this.edbCoin.string == "") {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_input_all'));
            return;
        }
        App.instance.showLoading(true);

        MiniGameNetworkClient.getInstance().send(new cmd.ReqDepositLive("" + money/1000));

        // Http.get(App.API_EBET, { t: "Trans", d: 1, a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
        //     App.instance.showLoading(false);
        //      ////Utils.Log("Nap ebet err:" + JSON.stringify(err));
        //      ////Utils.Log("Nap ebet res:" + JSON.stringify(res));
        //     if (res["res"] == 0) {
        //         this.popup.updateInfoEBET();
        //         Configs.Login.Coin -= money;
        //         BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
        //         App.instance.ShowAlertDialog(App.instance.getTextLang('txt_note_transfer_8'));
        //         this.reset();
        //     }
        //     else {
        //         App.instance.ShowAlertDialog(res["msg"]);
        //     }


        // });
    }

    public submit() {
        let coin = Utils.stringToInt(this.edbCoin.string);
        let minAmount = 1000;
        if (this.popup.typeGame == "FISH") {
            minAmount = 10000;
        }
        if (coin < minAmount) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_money_error') + "\n" + App.instance.getTextLang('txt_money_error2') + Utils.formatNumber(minAmount) + " VND");
            return;
        }
        if (this.popup.typeGame == "AG") {
            this.NapAG();
        }
        else if (this.popup.typeGame == "IBC") {
            this.NapIBC();
        }
        else if (this.popup.typeGame == "SBO") {
            this.NapSBO();
        }
        else if (this.popup.typeGame == "WM") {
            this.NapWM();
        }
        else if (this.popup.typeGame == "EBET") {
            this.NapEBET();
        }
        else if (this.popup.typeGame == "FISH") {
            this.napFish();
        }  else if (this.popup.typeGame == "SEX") {
            this.NapSex();
        }

    }

    public reset() {
        this.edbCoin.string = "";
        this.lblBalance.string = Utils.formatNumber(Configs.Login.Coin);
        for (let i = 0; i < this.quickButtons.childrenCount; i++) {
            this.quickButtons.children[i].getComponent(cc.Toggle).isChecked = false;
        }
    }
}

@ccclass("PopupGameTransfer.TabCashOut")
export class TabCashOut {
    @property(cc.Label)
    lblBalance: cc.Label = null;
    @property(cc.Label)
    lblTitleBalance: cc.Label = null;
    @property(cc.EditBox)
    edbCoin: cc.EditBox = null;
    @property(cc.Node)
    quickButtons: cc.Node = null;

    private popup: PopupGameTransfer = null;

    private readonly values = [50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000];
    currentBalance = 0;
    public start(popup: PopupGameTransfer) {
        this.popup = popup;
        // this.lblTitleBalance.string = "Số dư " + this.popup.typeGame;
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

    public RutAG() {
        var money = Utils.formatEditBox(this.edbCoin.string) / 1000;
        if (this.edbCoin.string == "") {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_input_all'));
            return;
        }

        if (money * 1000 > this.popup.balance) {
            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
            return;
        }
        App.instance.showLoading(true);
        Http.get(App.API_AG, { t: "Withdraw", a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
            App.instance.showLoading(false);

            if (res["res"] == 0) {
                this.popup.updateInfoAG();
                Configs.Login.Coin += money * 1000;
                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_note_transfer_5'));
                this.reset();
            }
            else {
                App.instance.ShowAlertDialog(res["msg"]);
            }
        });
    }

    public RutIBC() {
        var money = Utils.formatEditBox(this.edbCoin.string);
        if (money > this.popup.balance) {
            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
            return;
        }
        if (this.edbCoin.string == "") {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_input_all'));
            return;
        }
         ////Utils.Log("RutIBC:" + money);
        //ibc
        App.instance.showLoading(true);
        Http.get(App.API_IBC, { t: "Transfer", d: 0, a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
            App.instance.showLoading(false);
            if (res["code"] == 0) {
                this.popup.updateInfoIBC();
                Configs.Login.Coin += money;
                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_note_transfer_5'));
            }
            else {
                App.instance.ShowAlertDialog(res["message"]);
            }
        });
    }
    public RutSBO() {
        var money = Utils.formatEditBox(this.edbCoin.string);
        if (money > this.popup.balance) {
            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
            return;
        }
        if (this.edbCoin.string == "") {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_input_all'));
            return;
        }
         ////Utils.Log("RutSBO:" + money);
        //sbo
        App.instance.showLoading(true);
        Http.get(App.API_SBO, { t: "Transfer", d: 0, a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
            App.instance.showLoading(false);
            if (res["res"] == 0) {
                this.popup.updateInfoSBO();
                Configs.Login.Coin += money;
                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_note_transfer_5'));
            }
            else {
                App.instance.ShowAlertDialog(res["message"]);
            }
        });
    }

    public RutWM() {
        var money = Utils.formatEditBox(this.edbCoin.string);
        if (money > this.popup.balance) {
            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
            return;
        }
        if (this.edbCoin.string == "") {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_input_all'));
            return;
        }

        //ibc
        App.instance.showLoading(true);
        Http.get(App.API_WM, { t: "Transfer", d: 0, a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
            App.instance.showLoading(false);
             ////Utils.Log("withDraw IBC:" + JSON.stringify(res));
            if (res["res"] == 0) {
                this.popup.updateInfoWM();
                Configs.Login.Coin += money;
                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_note_transfer_5'));
                this.reset();
            }
            else {
                App.instance.ShowAlertDialog(res["msg"]);
            }
        });
    }

    public RutEBET() {
        var money = Utils.formatEditBox(this.edbCoin.string);
        if (money > this.popup.balance) {
            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
            return;
        }
        if (this.edbCoin.string == "") {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_input_all'));
            return;
        }
        if (money < 50000) {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_min_transfer') + "50.000");
            return;
        }

        App.instance.showLoading(true);
        Http.get(App.API_EBET, { t: "Trans", d: 0, a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
            App.instance.showLoading(false);
             ////Utils.Log("RutEBET:", res);
            if (res["res"] == 0) {
                this.popup.updateInfoEBET();
                Configs.Login.Coin += money;
                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_note_transfer_5'));
                this.reset();
            }
            else {
                App.instance.ShowAlertDialog(res["msg"]);
            }
        });
    }
    public RutFish() {
        var money = Utils.formatEditBox(this.edbCoin.string);
        if (money > this.popup.balance) {
            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
            return;
        }
        if (this.edbCoin.string == "") {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_input_all'));
            return;
        }
        if (money < 50000) {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_min_transfer') + "50.000");
            return;
        }
        Http.get(Configs.App.API, { c: 2023, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken, mn: money }, (err, res) => { //check balance 
            App.instance.showLoading(false);
             ////Utils.Log("WithDraw ShootFish:", res);
            if (res["errorCode"] == "0") {
                 ////Utils.Log("Withdraw Succes");
                Configs.Login.Coin += money;
                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_note_transfer_9') + Utils.formatNumber(money) + "\n" + App.instance.getTextLang('txt_note_transfer_10'));
                this.popup.balance = res.data.Balance;
                this.reset();
            } else {
                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_unknown_error1'));
            }
        });
    }
    public RutSex() {
        var money = Utils.formatEditBox(this.edbCoin.string);
        if (money > this.popup.balance) {
            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
            return;
        }
        if (this.edbCoin.string == "") {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_input_all'));
            return;
        }
        if (money < 2000) {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_min_transfer') + "2.000");
            return;
        }

        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqRutBalanceLive());
        
    }
    public submit() {
        let coin = Utils.stringToInt(this.edbCoin.string);
        if (coin <= 0) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_money_error'));
            return;
        }
        if (this.popup.typeGame == "AG") {
            this.RutAG();
        }
        else if (this.popup.typeGame == "IBC") {
            this.RutIBC();
        }
        else if (this.popup.typeGame == "SBO") {
            this.RutSBO();
        }
        else if (this.popup.typeGame == "WM") {
            this.RutWM();
        }
        else if (this.popup.typeGame == "EBET") {
            this.RutEBET();
        }
        else if (this.popup.typeGame == "FISH") {
            this.RutFish();
        } else if (this.popup.typeGame == "SEX") {
            this.RutSex();
        }

    }

    public reset() {
        this.edbCoin.string = "";
        this.lblBalance.string = Utils.formatNumber(this.popup.balance);
        for (let i = 0; i < this.quickButtons.childrenCount; i++) {
            this.quickButtons.children[i].getComponent(cc.Toggle).isChecked = false;
        }
        if (this.popup.typeGame == "FISH") {
            Http.get(Configs.App.API, { c: 2025, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => { //check balance 
                App.instance.showLoading(false);
                 ////Utils.Log("Res Balance ShootFish:", res);
                if (res["errorCode"] == "0") {
                     ////Utils.Log("Login Succes");
                    this.lblBalance.string = Utils.formatNumber(res.data);
                    this.popup.balance = res.data;
                } else {
                    // App.instance.ShowAlertDialog("Chưa có thông tin số dư\n Vui lòng vào game để tạo tài khoản!");
                    this.lblBalance.string = "0";
                    this.popup.balance = 0;
                }
            })
        } else {
            this.lblBalance.string = Utils.formatNumber(this.popup.balance);
        }
    }
}

@ccclass
export default class PopupGameTransfer extends Dialog {
    @property(cc.ToggleContainer)
    tabs: cc.ToggleContainer = null;
    @property(cc.Node)
    tabContents: cc.Node = null;
    @property(TabCashIn)
    tabCashIn: TabCashIn = null;
    @property(TabCashOut)
    tabCashOut: TabCashOut = null;
    @property(cc.Label)
    txtTitle: cc.Label = null;
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

        var self = this;

        MiniGameNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            console.log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {
                case cmd.Code.DEPOSIT_LIVECASIO: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResDepositLiveCasino(data);
                    switch (res.error) {
                        case 0:
                            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_note_transfer_8'));
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            if (res.amount != '') {
                                Configs.Login.Coin -= (parseInt(res.amount) * 1000);
                            }
                            self.tabCashIn.reset();
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Lỗi " + res.error + ". Không xác định.");
                            break;
                    }
                    break;
                }
                case cmd.Code.GET_BALANCE_LIVECASIO: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResGetBalanceLive(data);
                    switch (res.error) {
                        case 0:
                            if (res.balance != '') {
                                self.balance = parseInt(res.balance) * 1000;
                                self.tabCashOut.lblBalance.string = Utils.formatNumber(parseInt(res.balance) * 1000);
                                self.tabCashOut.edbCoin.string = Utils.formatNumber(parseInt(res.balance) * 1000);
                            }
                            
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Lỗi " + res.error + ". Không xác định.");
                            break;
                    }
                    break;
                }
                case cmd.Code.GET_LINK_LIVECASIO: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResGetLinkLive(data);
                    switch (res.error) {
                        case 0:
                            if (res != null && res.gameUrl != '') {
                                App.instance.openGameLiveCasino(res.gameUrl, "SEX");
                            }
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Lỗi " + res.error + ". Không xác định.");
                            break;
                    }
                    break;
                }
                case cmd.Code.GET_RUT_BALANCE_LIVECASIO: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResRutBalanceLive(data);
                    switch (res.error) {
                        case 0:
                            if (res.amount != '') {
                                Configs.Login.Coin += (parseInt(res.amount) * 1000);
                            }
                            if (res.balance != '') {
                                self.balance = (parseInt(res.balance) * 1000);
                            }
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            self.tabCashIn.reset();
                            self.tabCashOut.reset();
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Lỗi " + res.error + ". Không xác định.");
                            break;
                    }
                    break;
                }
            }
        }, this);
    }

    public typeGame = "";
    public balance = 0;
    showGame(typeGame, balance) {
        if (typeGame == "FISH") {
            this.typeGame = typeGame;
            super.show();
            this.tabSelectedIdx = 0;
            this.tabs.toggleItems[this.tabSelectedIdx].isChecked = true;
            this.txtTitle.string = App.instance.getTextLang('txt_transfer_quy1') + " BẮN CÁ";
            this.onTabChanged();
        } else {
            if (typeGame == "AG") {
                this.txtTitle.string = App.instance.getTextLang('txt_transfer_quy1') + " AG";
            }
            else if (typeGame == "IBC") {
                this.txtTitle.string = App.instance.getTextLang('txt_transfer_quy1') + " IBC";
            }
            else if (typeGame == "SBO") {
                this.txtTitle.string = App.instance.getTextLang('txt_transfer_quy1') + " SBO";
            }
            else if (typeGame == "WM") {
                this.txtTitle.string = App.instance.getTextLang('txt_transfer_quy1') + " WM";
            }
            else if (typeGame == "EBET") {
                this.txtTitle.string = App.instance.getTextLang('txt_transfer_quy1') + " EBET";
            } else if (typeGame == "SEX") {
                this.txtTitle.string = App.instance.getTextLang('txt_transfer_quy1') + " SEX";
            }

            this.typeGame = typeGame;
            this.balance = balance;
            super.show();
            this.tabSelectedIdx = 0;
            this.tabs.toggleItems[this.tabSelectedIdx].isChecked = true;
            this.onTabChanged();
        }
        this.tabCashOut.lblTitleBalance.string = this.typeGame != "FISH" ? "Số Dư " + this.typeGame : "Số Dư Bắn Cá";
    }

    private onTabChanged() {
        for (let i = 0; i < this.tabContents.childrenCount; i++) {
            this.tabContents.children[i].active = i == this.tabSelectedIdx;
        }
        for (let j = 0; j < this.tabs.toggleItems.length; j++) {
            this.tabs.toggleItems[j].node.getComponentInChildren(cc.LabelOutline).color = j == this.tabSelectedIdx ? cc.Color.BLACK.fromHEX("#AA5F00") : cc.Color.BLACK.fromHEX("#4677F3");
        }
        switch (this.tabSelectedIdx) {
            case 0:
                this.tabCashIn.reset();
                break;
            case 1:
                this.tabCashOut.reset();
                App.instance.showLoading(true);
                MiniGameNetworkClient.getInstance().send(new cmd.ReqGetBalanceLive());
                break;
        }
    }

    public updateInfoAG(isUpdateTotal = false) {
        Http.get(App.API_AG, { t: "GetBalance", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
             ////Utils.Log("updateInfoAg:" + JSON.stringify(res));
            if (res["res"] == 0) {
                if (res["list"][0]["info"] == "error") {
                    App.instance.ShowAlertDialog(App.instance.getTextLang('txt_reparing'));
                }
                else {
                    this.balance = parseInt(res.list[0]["info"]) * 1000;
                    this.tabCashOut.reset();
                }
            }
            else {
                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_reparing'));
            }
        });
    }

    updateInfoIBC(isUpdateTotal = false) {
        Http.get(App.API_IBC, { t: "CheckBalance", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
             ////Utils.Log("updateInfoICB:" + JSON.stringify(res));
            if (res["code"] == 0) {
                this.balance = parseInt(res["data"]["balance"]) * 1000;
                this.tabCashOut.reset();
            }
            else {
                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_reparing'));
            }
        });
    }
    updateInfoSBO(isUpdateTotal = false) {
        Http.get(App.API_SBO, { t: "CheckBalance", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
             ////Utils.Log("updateInfoSBO:" + JSON.stringify(res));
            if (res["res"] == 0) {
                this.balance = parseInt(res["data"]["balance"]) * 1000;
                this.tabCashOut.reset();
            }
            else {
                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_reparing'));
            }
        });
    }

    updateInfoWM(isUpdateTotal = false) {
        Http.get(App.API_WM, { t: "CheckBalance", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
             ////Utils.Log("updateInfoWM:" + JSON.stringify(res));
            if (res["list"][0] == 0) {
                this.balance = parseInt(res["list"][1]) * 1000;
                this.tabCashOut.reset();
            }
            else {
                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_reparing'));
            }
        });
    }

    updateInfoEBET(isUpdateTotal = false) {
        Http.get(App.API_EBET, { t: "CheckBalance", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
             ////Utils.Log("updateInfoEBET:" + JSON.stringify(res));
            if (res["res"] == 0) {
                this.balance = res["data"]["money"]*1000;
                this.tabCashOut.reset();
            }
            else {
                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_reparing'));
            }
        });
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

    public actPlayNow() {
        if (this.typeGame == "AG") {
            App.instance.actLoginAG(true);
        }
        else if (this.typeGame == "IBC") {
            App.instance.actLoginIBC(true);
        }
        else if (this.typeGame == "SBO") {
            App.instance.actLoginSBO(true);
        }
        else if (this.typeGame == "WM") {
            App.instance.actLoginWM(true);
        }
        else if (this.typeGame == "EBET") {
            App.instance.actLoginEbet(true);
        }
        else if (this.typeGame == "FISH") {
            App.instance.actLoginShootFish(true);
        } else if (this.typeGame == "SEX") {
            App.instance.showLoading(true);
            var platform = ""
            if (cc.sys.isBrowser)
             platform = "html5-desktop"
            else 
             platform = "html5"
            MiniGameNetworkClient.getInstance().send(new cmd.ReqGetLinkLive(platform));
        }
    }
}
