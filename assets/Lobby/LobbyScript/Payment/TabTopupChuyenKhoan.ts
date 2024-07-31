// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import DropDown from "../../../Loading/Add-on/DropDown/Script/DropDown";
import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../Script/common/App";
import Utils from "../Script/common/Utils";
import LobbyChoseBank from "./LobbyChoseBank";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TabTopupChuyenKhoan extends cc.Component {
    @property
    tabWell: string = "";
    @property(LobbyChoseBank)
    lobbyChoseBank: LobbyChoseBank = null;
    @property(cc.Sprite)
    btnChoseBank: cc.Sprite = null;
    @property(cc.SpriteFrame)
    sfChoseBank: cc.SpriteFrame = null;


    @property(cc.EditBox)
    editName: cc.EditBox = null;

    @property(cc.EditBox)
    editMoney: cc.EditBox = null;

    @property(cc.Button)
    btnXacNhan: cc.Button = null;

    @property(cc.Node)
    nodeArrow: cc.Node = null;

    @property(DropDown)
    dropCard: DropDown = null;

    public data = null;
    public dataBankChosing = null;
    public providerName = null;
    
    
    show(data, providerName) {
        this.btnChoseBank.spriteFrame = null;
        this.providerName = providerName;
        this.node.active = true;
        this.data = data;
        this.dataBankChosing = null;
        this.showBankChosing();
    }

    onFormatNumber() {
        this.editMoney.string = Utils.formatNumberBank(this.editMoney.string).toUpperCase();
    }

    onFormatName() {
        this.editName.string = Utils.formatNameBank(this.editName.string).toUpperCase();
        if (cc.sys.isBrowser) {
            this.editName.focus();
        }
    }
    showBankChosing() {
        var self = this;
        if (self.tabWell == "princePay") {
            this.nodeArrow.active = false;
            this.editName.node.opacity = 255;
            this.editMoney.node.opacity = 255;
            this.btnXacNhan.node.opacity = 255;
            this.editName.enabled = true;
            this.editMoney.enabled = true;
            this.btnXacNhan.interactable = true;
            this.btnChoseBank.node.active = false;
        }
        else {
            this.btnChoseBank.node.active = true;
            if (this.dataBankChosing == null) {
                this.nodeArrow.active = true;
                this.editName.node.opacity = 50;
                this.editMoney.node.opacity = 50;
                this.btnXacNhan.node.opacity = 50;
                this.editName.string = "";
                this.editMoney.string = "";
                this.btnChoseBank.spriteFrame = this.sfChoseBank;
                this.btnChoseBank.node.scale = 1;
                this.editName.enabled = false;
                this.editMoney.enabled = false;
                this.btnXacNhan.interactable = false;
            }
            else {
                this.nodeArrow.active = false;
                this.editName.node.opacity = 255;
                this.editMoney.node.opacity = 255;
                this.btnXacNhan.node.opacity = 255;
                this.editName.enabled = true;
                this.editMoney.enabled = true;
                this.btnXacNhan.interactable = true;
                if (self.tabWell == "clickpay") {
                    cc.loader.load(this.dataBankChosing.bank_code, function (err, texture) {
                        var newSpriteFrame = new cc.SpriteFrame(texture);
                        self.btnChoseBank.spriteFrame = newSpriteFrame;
                        self.btnChoseBank.node.scale = 1;
                    });
                }
                else {
                    cc.loader.load(this.dataBankChosing.imageUrl, function (err, texture) {
                        var newSpriteFrame = new cc.SpriteFrame(texture);
                        self.btnChoseBank.spriteFrame = newSpriteFrame;
                        self.btnChoseBank.node.scale = 1;
                    });
                }
            }
        }
    }

    hide() {
        this.node.active = false;
    }

    onBtnXacNhan() {
        var money = Utils.formatEditBox(this.editMoney.string);
        if (this.providerName == "paywell") {
            if (money < 100000) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_in_min") + " 100.000");
                return;
            }
            if (money > 300000000) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_in_max") + " 300.000.000");
                return;
            }
        }
        else if (this.providerName == "princewell") {
            if (money < 50000) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_in_min") + " 50.000");
                return;
            }
            if (money > 300000000) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_in_max") + " 300.000.000");
                return;
            }
        }
        else if (this.providerName == "clickpay") {
            if (money < 200000) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_in_min") + " 200.000");
                return;
            }
            if (money > 300000000) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_in_max") + " 300.000.000");
                return;
            }
        }
        if (this.editName.string == "" || this.editMoney.string == "") {
            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
            return;
        }
        if (this.editName.string.indexOf(' ') == -1) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_bank_transfer_note_10"));
            return;
        }
        if (this.tabWell != "princePay") {
            if (this.dataBankChosing == null) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                return;
            }
        }
        var self = this;
        App.instance.showLoading(true, -1);
        let request = {
            "c": 2003,
            "fn": encodeURIComponent(this.editName.string.trim()),
            "am": money,
            "pt": 1,
            "nn": Configs.Login.Nickname,
            "at": Configs.Login.AccessToken,
            "pn": this.providerName
        };
        if (self.tabWell != "princePay") {
            request["bc"] = this.dataBankChosing.key;
        }
        if (self.tabWell == "clickpay") {
            request["bc"] = this.dataBankChosing.code;
        }
        Http.get(Configs.App.API, request, (err, res) => {
            App.instance.showLoading(false);
            if (res.success == true) {

                if (self.tabWell == "princePay") {
                    var url = JSON.parse(res.data);
                    App.instance.openWebView(url.payurl);
                }
                else if (self.tabWell == "clickpay") {
                    var url = JSON.parse(res.data);
                    cc.sys.openURL(url.redirect_url);
                }
                else {
                    App.instance.openWebView(res.data);
                }
            }
            else {
                App.instance.ShowAlertDialog(res.message);
            }


        });

    }

    onBtnChoseBank() {
        var self = this;
        if (self.tabWell == "clickpay") {
            if (Configs.Login.ClickPayPayment != null) {
                this.lobbyChoseBank.init(self.tabWell, this.data.banks, (dataBankChosing) => {
                    self.dataBankChosing = dataBankChosing;
                    self.showBankChosing();
                });
                this.lobbyChoseBank.show();
            }
            else {
                App.instance.showLoading(true);
                var request = {
                    "c": 2014,
                    "pn": this.providerName
                };
                Http.get(Configs.App.API, request, (err, res) => {
                    App.instance.showLoading(false);
                    Configs.Login.ClickPayPayment = Configs.Login.ListPayment[3].providerConfig.banks = res;

                    this.lobbyChoseBank.init(self.tabWell, this.data.banks, (dataBankChosing) => {
                        self.dataBankChosing = dataBankChosing;
                        self.showBankChosing();
                    });
                    this.lobbyChoseBank.show();
                });
            }

        }
        else {
            //  cc.log("Data Topup Chuyen khoan:", self.data);
            this.lobbyChoseBank.init(self.tabWell, self.data.banks, (dataBankChosing) => {
                self.dataBankChosing = dataBankChosing;
                self.showBankChosing();
            });
            this.lobbyChoseBank.show();
        }
    }
}
