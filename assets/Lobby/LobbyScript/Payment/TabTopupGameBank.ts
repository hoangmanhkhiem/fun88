// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../Script/common/App";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TabTopupGameBank extends cc.Component {

    @property(cc.Node)
    nodeInfoTransfer: cc.Node = null;

    @property(cc.EditBox)
    edbAccountName: cc.EditBox = null;

    @property(cc.EditBox)
    edbBankNumber: cc.EditBox = null;

    @property(cc.EditBox)
    edbMoneyAmount: cc.EditBox = null;

    @property(cc.Button)
    btnConfirm: cc.Button = null;
    bankCode = "";
    transMsg = ""
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    onClickConfirm() {
        let accountName = this.edbAccountName.string.trim();
        let amount = this.edbMoneyAmount.string.trim();
        let bankNumber = this.edbBankNumber.string.trim();
        if (accountName == "" || amount == "" || bankNumber == "") {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_input_all'));
            return;
        }
        this.transMsg = this.generateTransMsg();
        Http.get(Configs.App.API,
            {
                "c": 2003,
                "nn": Configs.Login.Nickname,
                "at": Configs.Login.AccessToken,
                "pt": 1,
                "ds": this.transMsg,
                "bc": this.bankCode,
                "pn": "manual",
                "bn": parseInt(bankNumber)
            },
            (err, res) => {
                App.instance.showLoading(false);
                //  cc.log(res);
                if (res['success']) {
                    
                }
            });
    }
   
    // update (dt) {}
}
