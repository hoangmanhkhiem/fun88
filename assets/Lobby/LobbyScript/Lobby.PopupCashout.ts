import Configs from "../../Loading/src/Configs";
import { Global } from "../../Loading/src/Global";
import Http from "../../Loading/src/Http";
import cmd from "./Lobby.Cmd";
import App from "./Script/common/App";
import BroadcastReceiver from "./Script/common/BroadcastReceiver";
import Dialog from "./Script/common/Dialog";
import Utils from "./Script/common/Utils";
import MiniGameNetworkClient from "./Script/networks/MiniGameNetworkClient";
import InPacket from "./Script/networks/Network.InPacket";



const { ccclass, property } = cc._decorator;

@ccclass("Lobby.PopupCashout.TabBank")
export class TabBank {

    @property(cc.Node)
    boxRut: cc.Node = null;

    @property(cc.Label)
    lblCoin: cc.Label = null;

    @property(cc.Node)
    dropdownBank: cc.Node = null;

    @property(cc.EditBox)
    edbAmount: cc.EditBox = null;

    @property(cc.EditBox)
    edbBankNumber: cc.EditBox = null;

    @property(cc.EditBox)
    edbBankAccountName: cc.EditBox = null;

    private _listBank = [];

    private fee: number = 1;
    private minCashout = 0;
    private maxCashout = 0;
    private isAllowCashout = false;

    start() {
        this.dropdownBank = this.dropdownBank.getComponent("DropDown");
        this.lblCoin.string = Utils.formatNumber(Configs.Login.Coin);

    }

    show() {
        var self = this;
        var data = {};
        data["c"] = 2008;
        data["nn"] = Configs.Login.Nickname;
        data["pn"] = 1;
        data["l"] = 10;
        Http.get(Configs.App.API, data, (err, res) => {
            var list = JSON.parse(res.data).data;
            if (res == null || list.length == 0) {
                self.boxRut.active = false;
            }
            else {
                self.boxRut.active = true;

                this._listBank = list;
                var datas = new Array();
                datas.push({ optionString: "Chọn ngân hàng" });
                for (let i = 0; i < list.length; i++) {
                    datas.push({ optionString: list[i].bankName });
                }
                this.dropdownBank.clearOptionDatas();
                this.dropdownBank.addOptionDatas(datas);
                this.dropdownBank.selectedIndex = 0;
            }
        });
    }

    onChoseBank() {
        var indexBank = this.dropdownBank.selectedIndex;
        if (indexBank != 0) {
            this.edbBankAccountName.string = this._listBank[indexBank - 1].customerName;
            this.edbBankNumber.string = this._listBank[indexBank - 1].bankNumber;
        }
    }

    onAddBank() {

    }
    submit() {
        // if(!this.isAllowCashout){
        //     App.instance.alertDialog.showMsg("Rút qua ngân hàng đang bảo trì, vui lòng thử lại sau!");
        //     return;
        // }
        let ddBank = this.dropdownBank.selectedIndex;
        if (ddBank == 0) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_select_bank1'));
            return;
        }
        let bankSelected = this._listBank[ddBank - 1].bankName;

        let amount = Utils.formatEditBox(this.edbAmount.string);
        if (amount < 100000) {
            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_out_min") + Utils.formatNumber(100000));
            return;
        }
        if (amount > 300000000) {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_cash_out_max') + Utils.formatNumber(300000000));
            return;
        }


        if (amount > Configs.Login.Coin) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_not_enough'));

            return;
        }

        let bankNumber = this.edbBankNumber.string.trim();
        if (bankNumber == "") {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_note_transfer_4'));
            return;
        }
        let bankActName = this.edbBankAccountName.string.trim();
        if (bankActName == "") {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_note_transfer_4'));
            return;
        }



        App.instance.showLoading(true);
        var data = {};
        data["c"] = 2010;
        data["am"] = amount;
        data["bn"] = bankNumber;
        data["nn"] = Configs.Login.Nickname;
        Http.get(Configs.App.API, data, (err, res) => {
            App.instance.showLoading(false);
             ////Utils.Log("CashOut:" + JSON.stringify(err) + " => " + JSON.stringify(res));
            if (res.success) {
                Configs.Login.Coin = res.data.currentMoney;
                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_note_transfer_5'));
            }
            else {
                App.instance.alertDialog.showMsg(res.message);
            }

        });
        // MiniGameNetworkClient.getInstance().send(new cmd.ReqCashoutBank(bankSelected, bankNumber,bankActName, amount ));
    }



}

@ccclass("Lobby.PopupCashout.TabMomo")
export class TabMomo {


    @property(cc.Label)
    lblCoin: cc.Label = null;


    @property(cc.EditBox)
    edbAmount: cc.EditBox = null;
    @property(cc.EditBox)
    edbPhone: cc.EditBox = null;

    private fee: number = 1;
    private minCashout = 0;
    private maxCashout = 0;
    private isAllowCashout = false;
    start() {

        //get config from server 
        App.instance.showLoading(true);
        this.lblCoin.string = Utils.formatNumber(Configs.Login.Coin);
        Http.get(Configs.App.API, { "c": 130 }, (err, res) => {
            App.instance.showLoading(false);
            this.fee = res.ratio_cashout_momo;
            this.minCashout = res.cashout_momo_min;
            this.maxCashout = res.cashout_momo_max;
            this.isAllowCashout = res.is_cashout_momo == 1 ? false : true;

        });


    }
    amountChange() {
        let amount = this.edbAmount.string.trim();
        if (amount == "" || parseInt(amount) <= 0 || isNaN(Number(amount))) {
            return;
        }
        let amountSend = Number(amount);
        if (amountSend < this.minCashout || amountSend > this.maxCashout) {
            return;
        }




    }

    submit() {
        // if(!this.isAllowCashout){
        //     App.instance.alertDialog.showMsg("Rút Momo đang bảo trì, vui lòng thử lại sau!");
        //     return;
        // }
        let amount = this.edbAmount.string.trim();
        // let phoneSend = this.edbPhone.string.trim();

        if (amount == "" || parseInt(amount) <= 0 || isNaN(Number(amount))) {
            App.instance.alertDialog.showMsg("Số tiền không hợp lệ");
            return;
        }


    }





}


@ccclass
export default class PopupCashout extends Dialog {


    @property(cc.Node)
    tabContents: cc.Node = null;


    @property([cc.Label])
    lblContainsBotOTPs: cc.Label[] = [];


    @property(TabBank)
    tabBank: TabBank = null;



    private tabSelectedIdx = 0;

    start() {
        for (let i = 0; i < this.lblContainsBotOTPs.length; i++) {
            let lbl = this.lblContainsBotOTPs[i];
            lbl.string = lbl.string.replace("$bot_otp", "@" + Configs.App.getLinkTelegram());
        }

        this.onTabChanged();

        MiniGameNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
             ////Utils.Log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {
                case cmd.Code.CASHOUT_CARD: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResCashoutCard(data);
                     ////Utils.Log(JSON.stringify(res));


                }
                case cmd.Code.CASHOUT_BANK: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResCashoutBank(data);
                    if (res.error == 0) {
                        Configs.Login.Coin = res.currentMoney;
                        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_note_transfer_6'));
                    } else {
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_note_transfer_7'));
                    }
                    break;
                }
                case cmd.Code.CASHOUT_MOMO: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResCashoutMomo(data);
                    if (res.error == 0) {
                        Configs.Login.Coin = res.currentMoney;
                        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_note_transfer_6'));
                    } else {
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_note_transfer_7'));
                    }
                    break;
                }
            }
        }, this);

        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            if (!this.node.active) return;
            // this.tabNapThe.lblBalance.string = Utils.formatNumber(Configs.Login.Coin);
            this.tabBank.lblCoin.string = Utils.formatNumber(Configs.Login.Coin);
            // this.tabMomo.lblCoin.string = Utils.formatNumber(Configs.Login.Coin);
        }, this);

        // this.tabNapThe.start();

        this.tabBank.start();
        // this.tabMomo.start();
    }

    private onBtnChoseBank() {
        this.tabBank.onChoseBank();
    }

    private onBtnAddBank() {
        // this.tabBank.onAddBank();
        Global.LobbyController.actProfile(2);
        this.dismiss();
    }

    private onTabChanged() {
        for (let i = 0; i < this.tabContents.childrenCount; i++) {
            this.tabContents.children[i].active = i == this.tabSelectedIdx;
        }

        switch (this.tabSelectedIdx) {
            case 0:
                this.tabBank.show();
                break;

            case 1:

                break;

        }
    }

    private longToTime(l: number): string {
        return (l / 60) + " giờ " + (l % 60) + " phút";
    }

    show() {
        super.show();
        this.tabSelectedIdx = 0;
        this.onTabChanged();
    }





    actGetOTP() {
        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetOTP());
    }

    actSubmitNapNganHang() {
        this.tabBank.submit();
    }

}
