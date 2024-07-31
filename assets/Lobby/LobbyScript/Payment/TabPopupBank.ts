import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import cmd from "../Lobby.Cmd";
import App from "../Script/common/App";
import Utils from "../Script/common/Utils";
import MiniGameNetworkClient from "../Script/networks/MiniGameNetworkClient";
import BaseTabShop from "./BaseTabShop";

const { ccclass, property } = cc._decorator;
@ccclass
export class TabPopupBank extends BaseTabShop {


    @property(cc.Label)
    lblBankNumber: cc.Label = null;
    @property(cc.Label)
    lblBankAccountName: cc.Label = null;
    @property(cc.Label)
    lblBankAddress: cc.Label = null;

    @property(cc.Label)
    lblTransNote: cc.Label = null;


    @property(cc.Node)
    dropdownBank: Node = null;

    @property(cc.EditBox)
    edbAmount: cc.EditBox = null;

    private _listBank = [];

    start() {
        this.lblTransNote.string = App.instance.getTextLang('txt_bank_transfer_note_9') + Configs.Login.Nickname;
        App.instance.showLoading(true);


        this.dropdownBank = this.dropdownBank.getComponent("DropDown");
        Http.get(Configs.App.API, { "c": 130 }, (err, res) => {
            App.instance.showLoading(false);
            if (err == null) {
                if (res.list_bank === undefined || res.list_bank.length == 0) {

                    return;
                }

                let listBank = res.list_bank;
                this._listBank = listBank;


                let bankName = [{ optionString: App.instance.getTextLang("txt_select_bank") }];
                for (let i = 0; i < listBank.length; i++) {
                    bankName.push({ optionString: listBank[i].bankName });
                }
                this.dropdownBank.clearOptionDatas();
                this.dropdownBank.addOptionDatas(bankName);
                this.dropdownBank.selectedIndex = 0;
                this.dropdownBank.setCallBack((idx) => {
                    if (idx > 0) {
                        this.lblBankAddress.string = listBank[idx - 1].bankAddress;
                        this.lblBankAccountName.string = listBank[idx - 1].bankAccountName;
                        this.lblBankNumber.string = listBank[idx - 1].bankNumber;
                    } else {
                        this.lblBankAddress.string = "";
                        this.lblBankAccountName.string = "";
                        this.lblBankNumber.string = "";
                    }


                })
            }
        });

    }

    show(data) {
         //Utils.Log("showTabBank:" + JSON.stringify(data));
        let listBank = data.providerConfig.banks;
        this._listBank = listBank;


        let bankName = [{ optionString: App.instance.getTextLang("txt_select_bank") }];
        for (let i = 0; i < listBank.length; i++) {
            bankName.push({ optionString: listBank[i].name });
        }
        this.dropdownBank.clearOptionDatas();
        this.dropdownBank.addOptionDatas(bankName);
        this.dropdownBank.selectedIndex = 0;
        this.dropdownBank.setCallBack((idx) => {
            if (idx > 0) {
                this.lblBankAddress.string = listBank[idx - 1].bankAddress;
                this.lblBankAccountName.string = listBank[idx - 1].bankAccountName;
                this.lblBankNumber.string = listBank[idx - 1].bankNumber;
            } else {
                this.lblBankAddress.string = "";
                this.lblBankAccountName.string = "";
                this.lblBankNumber.string = "";
            }


        })
    }

    submit() {
        let ddBank = this.dropdownBank.selectedIndex;
        if (ddBank == 0) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_select_bank1"));
            return;
        }

        let bankSelected = this._listBank[ddBank - 1].bankNumber;

        let amount = Utils.formatEditBox(this.edbAmount.string);
        if (amount < 10000) {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_cash_in_min') + "10.000");
            return;
        }
        if (amount > 200000) {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_cash_in_max') + "200.000");
            return;
        }

        var self = this;
        App.instance.showLoading(true, -1);
        var request = {
            "c": 2003,
            "fn": bankSelected,
            "am": amount,
            "nn": Configs.Login.Nickname,
            "at": Configs.Login.AccessToken,
            "pn": "manualbank"
        };

         //Utils.Log("request sieutoc:" + JSON.stringify(request) + " : tabWell:" + self.tabWell);
        Http.get(Configs.App.API, request, (err, res) => {
            App.instance.showLoading(false);
             //Utils.Log(" res:" + JSON.stringify(res));
            if (res.success == true) {
                 //Utils.Log("princePay:" + JSON.stringify(res));

            }
            else {
                App.instance.ShowAlertDialog(res.message);
            }


        });


        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqDepositBank(bankSelected, amount));
    }




}