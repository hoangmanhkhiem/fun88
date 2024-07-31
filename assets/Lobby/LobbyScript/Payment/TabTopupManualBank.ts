// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../Script/common/App";
import Utils from "../Script/common/Utils";
import LobbyChoseBank from "./LobbyChoseBank";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TabTopupManualBank extends cc.Component {
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

    @property(cc.EditBox)
    editBankNumber: cc.EditBox = null;

    @property(cc.Button)
    btnXacNhan: cc.Button = null;

    @property(cc.Node)
    nodeArrow: cc.Node = null;
    @property(cc.Node)
    nodeInput: cc.Node = null;
    @property(cc.Node)
    nodeInfoTrans: cc.Node = null;
    @property(cc.Label)
    lbTransMsg: cc.Label = null;
	@property(cc.Label)
    lbBankAccount: cc.Label = null;
	@property(cc.Label)
    lbBankNumber: cc.Label = null;
	@property(cc.Label)
    lbBank: cc.Label = null;
	private _listBank = [];

    private data = null;
    private dataBankChosing = null;
    private providerName = null;
    show(data, providerName) {
        this.btnChoseBank.spriteFrame = null;
        this.btnChoseBank.node.active = true;
        this.providerName = providerName;
        this.node.active = true;
        this.data = data;
        this.dataBankChosing = null;
        this.showBankChosing();
        this.nodeInput.active = true;
        this.nodeInfoTrans.active = false;
        this.editName.string = this.editMoney.string = this.editBankNumber.string = "";
        this.editBankNumber.placeholder = App.instance.getTextLang('txt_account_number');
        if (this.dataBankChosing != null) {
            this.editName.enabled = true;
            this.editMoney.enabled = true;
            this.editBankNumber.enabled = true;
            this.btnXacNhan.interactable = true;
        } else {
            this.editName.enabled = false;
            this.editMoney.enabled = false;
            this.editBankNumber.enabled = false;
            this.btnXacNhan.interactable = false;
        }
    }
    onLoad() {
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
    onEdbBankNumberChange() {
        if (cc.sys.isBrowser) {
            this.editBankNumber.focus();
        }
    }
    showBankChosing() {
        var self = this;

        this.btnChoseBank.node.active = true;
        if (this.dataBankChosing == null) {
            this.nodeArrow.active = true;
            this.editName.node.opacity = 50;
            this.editMoney.node.opacity = 50;
            this.btnXacNhan.node.opacity = 50;
            this.editBankNumber.node.opacity = 50;
            this.editName.string = "";
            this.editMoney.string = "";
            this.btnChoseBank.spriteFrame = this.sfChoseBank;
            this.btnChoseBank.node.scale = 1;
            this.editName.enabled = false;
            this.editMoney.enabled = false;
            this.editBankNumber.enabled = true;
            this.btnXacNhan.interactable = false;
        }
        else {
            this.nodeArrow.active = false;
            this.editName.node.opacity = 255;
            this.editMoney.node.opacity = 255;
            this.btnXacNhan.node.opacity = 255;
            this.editBankNumber.node.opacity = 255;
            this.editName.enabled = true;
            this.editMoney.enabled = true;
            this.editBankNumber.enabled = true;
            this.btnXacNhan.interactable = true;
            cc.loader.load(this.dataBankChosing.imageUrl, function (err, texture) {
                var newSpriteFrame = new cc.SpriteFrame(texture);
                self.btnChoseBank.spriteFrame = newSpriteFrame;
                self.btnChoseBank.node.scale = 1;
            });
        }
    }

    hide() {
        this.node.active = false;
    }

    onBtnXacNhan() {
        if (this.node.active) {
            var money = Utils.formatEditBox(this.editMoney.string);
            var bankNumber = this.editBankNumber.string.trim();
            if (this.editMoney.string == "" || bankNumber == "" || this.editName.string.trim() == "" || this.dataBankChosing == null) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                return;
            }
            if (money < 100000) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_in_min") + " 100.000");
                return;
            }
            if (money > 300000000) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_in_max") + " 300.000.000");
                return;
            }
            var self = this;
            App.instance.showLoading(true, -1);
            //Utils.Log("chuyen khoan:" + encodeURIComponent(this.editName.string.trim()));
            var request = {
                "c": 2003,
                "fn": encodeURIComponent(this.editName.string.trim()),
                "am": money,
                "pt": 1,
                "nn": Configs.Login.Nickname,
                "at": Configs.Login.AccessToken,
                "pn": this.providerName,
                "bc": this.dataBankChosing['name'],
                "ds": this.generateTransMsg(),
                "bn": bankNumber
            };
			Http.get(Configs.App.API, { "c": 130 }, (err, res) => {
                let listBank = res.list_bank;
                this._listBank = listBank;
                        this.lbBank.string = listBank[0].bankName;
                        this.lbBankNumber.string = listBank[0].bankNumber;
                        this.lbBankAccount.string = listBank[0].bankAccountName;
            });
       
            this.lbTransMsg.string = request['ds'];
		//	this.lbBankNumber.string = listBank.bankNumber;
		//	this.lbBankAccount.string = listBank.bankAccountName;
		//	this.lbBank.string = listBank.bankName;
			
            Http.get(Configs.App.API, request, (err, res) => {
                App.instance.showLoading(false);
                //  cc.log(res);
                if (res.success == true) {
                    this.nodeInput.active = false;
                    this.nodeInfoTrans.active = true;
                }
                else {
                    App.instance.ShowAlertDialog(res.message);
                }
            });
        }

    }

    onBtnChoseBank() {
        var self = this;
        this.lobbyChoseBank.init(self.tabWell, self.data.banks, (dataBankChosing) => {
            self.dataBankChosing = dataBankChosing;
            self.showBankChosing();
        });
        this.lobbyChoseBank.show();
    }
    generateTransMsg() {
        return (Configs.Login.Nickname);
    }
}
