import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../Script/common/App";
import Utils from "../Script/common/Utils";
import { Global } from "../../../Loading/src/Global";
import SPUtils from "../Script/common/SPUtils";
const { ccclass, property } = cc._decorator;

@ccclass
export default class TapTopupManualMomo extends cc.Component {
    @property(cc.Sprite)
    btnChoseBank: cc.Sprite = null;
	@property(cc.Button)
    btnCopystk: cc.Button = null;
	@property(cc.Button)
    btnCopynoidung: cc.Button = null;

    @property(cc.EditBox)
    editName: cc.EditBox = null;

    @property(cc.EditBox)
    editMoney: cc.EditBox = null;

    @property(cc.EditBox)
    editBankNumber: cc.EditBox = null;

    @property(cc.Button)
    btnXacNhan: cc.Button = null;


    @property(cc.Node)
    nodeInput: cc.Node = null;

    @property(cc.Node)
    nodeQR: cc.Node = null;

    @property(cc.Node)
    nodeArrow: cc.Node = null;
    @property(cc.Label)
    lbTransMsg: cc.Label = null;
	@property(cc.Label)
    lbBankAccount: cc.Label = null;
	@property(cc.Label)
    lbBankNumber: cc.Label = null;
	@property(cc.Sprite)
    spriteBank: cc.Sprite = null;
//	@property(cc.Label)
//    lbBank: cc.Label = null;

    private providerName = null;
    private data = null;
    // onLoad () {}

    start() {

    }
    show(data, providerName) {
        this.providerName = providerName;
        this.data = data;
        this.node.active = true;
        this.btnChoseBank.node.active = false;
        this.nodeQR.active = false;
        this.nodeInput.active = true;
        this.nodeArrow.active = false;
        this.editName.string = this.editMoney.string = this.editBankNumber.string = "";
        this.editName.node.opacity = this.editBankNumber.node.opacity = this.editMoney.node.opacity = this.btnXacNhan.node.opacity = 255;
        this.editName.enabled = true;
        this.editMoney.enabled = true;
        this.editBankNumber.enabled = true;
        this.editBankNumber.placeholder = App.instance.getTextLang('txt_phone_number');
        this.btnXacNhan.interactable = true;
    }
    hide() {
        this.node.active = false;
    }
    onClickConfirm() {
        if (this.node.active) {
            var money = Utils.formatEditBox(this.editMoney.string);
            var bankNumber = this.editBankNumber.string.trim();
            if (this.editMoney.string == "" || bankNumber == "" || this.editName.string.trim() == "") {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                return;
            }
            if (money < 10000) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_in_min") + " 10.000");
                return;
            }
            if (money > 300000000) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_in_max") + " 300.000.000");
                return;
            }
            var self = this;
            App.instance.showLoading(true, -1);
            var request = {
                "c": 2003,
                "fn": encodeURIComponent(this.editName.string.trim()),
                "am": money,
                "pt": 4,
                "nn": Configs.Login.Nickname,
                "at": Configs.Login.AccessToken,
                "pn": this.providerName,
                "bc": "",
                "ds": this.generateTransMsg(),
                "bn": bankNumber
            };
            Http.get(Configs.App.API, { "c": 130 }, (err, res) => {
                let momoConfig = res.momoConfig;
                this._momoConfig = momoConfig;
                    //    this.lbBank.string = listBank[0].bankName;
                        this.lbBankNumber.string = momoConfig.accountNumber;
                        this.lbBankAccount.string = momoConfig.accountName;
						cc.loader.load(momoConfig.image_path, function (err, texture) {
                    var newSpriteFrame = new cc.SpriteFrame(texture);
                    self.spriteBank.spriteFrame = newSpriteFrame;
                });	
            });
			this.lbTransMsg.string =request['ds'];
            Http.get(Configs.App.API, request, (err, res) => {
                App.instance.showLoading(false);
                //  cc.log(res);
                if (res.success == true) {
                    this.nodeInput.active = false;
                    this.nodeQR.active = true;
                }
                else {
                    App.instance.ShowAlertDialog(res.message);
                }
            });
			this.btnCopystk.node.on("click", ()=> {
            if (this.lbBankNumber.string.length > 0) {
                
                    SPUtils.copyToClipboard(this.lbBankNumber.string);
					App.instance.alertDialog.showMsg("Đã sao chép số tài khoản.");
                
            } else {
                App.instance.alertDialog.showMsg("Chưa có số tài khoản.");  
            }
        });
		this.btnCopynoidung.node.on("click", ()=> {
            if (this.lbTransMsg.string.length > 0) {
                SPUtils.copyToClipboard(this.lbTransMsg.string);
					App.instance.alertDialog.showMsg("Đã sao chép nội dung.");
                
            } else {
                App.instance.alertDialog.showMsg("Chưa có nội dung.");  
            }
        });
        }
    }
    generateTransMsg() {
        return (Configs.Login.Nickname);
    }
	
    // update (dt) {}
}
