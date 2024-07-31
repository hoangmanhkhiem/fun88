
import Configs from "../../Loading/src/Configs";
import Http from "../../Loading/src/Http";
import App from "./Script/common/App";
import Dialog from "./Script/common/Dialog";
import Utils from "./Script/common/Utils";

const { ccclass, property } = cc._decorator;
var TYPE = {
    CASHIN: 0,
    CASHOUT: 1
}
@ccclass
export default class PopupConfirmTransfer extends Dialog {

    @property(cc.Label)
    lbNameAgency: cc.Label = null;
    @property(cc.Label)
    lbNickname: cc.Label = null;
    @property(cc.Label)
    lbUserBankName: cc.Label = null;
    @property(cc.Label)
    lbAgencyBankName: cc.Label = null;
    @property(cc.Label)
    lbUserAccountName: cc.Label = null;
    @property(cc.Label)
    lbBankNumber: cc.Label = null;
    @property(cc.Label)
    lbAmount: cc.Label = null;
    @property(cc.Label)
    lbContent: cc.Label = null;
    @property(cc.Node)
    titleContainer: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:
    type = 0;
    private dataCashIn: any = null;
    private dataCashOut: any = null;
    // onLoad () {}

    start() {

    }
    setInfoCashIn(data) {
        //  cc.log("setInfoCashIn:", data);
        this.lbUserBankName.node.active = true;
        this.lbContent.node.active = true;
        this.lbAgencyBankName.node.active = true;

        this.type = TYPE.CASHIN;
        this.dataCashIn = data;
        this.lbNameAgency.string = data['nameagent'];
        this.lbNickname.string = data['nickname'];
        this.lbUserBankName.string = data['usernamebank'];
        this.lbAgencyBankName.string = data['agencynamebank'];
        if (this.lbAgencyBankName.string.length > 20) {
            this.lbAgencyBankName.string = this.lbAgencyBankName.string.slice(0, 20) + "...";
        }
        this.lbBankNumber.string = data['bank_number'];
        this.lbAmount.string = Utils.formatNumber(data['amount']);
        this.lbContent.string = data['cid'];

        this.titleContainer.getChildByName('lbUserAccountName').active = false;
        this.titleContainer.getChildByName('lbAgencyBankName').active = true;
        this.titleContainer.getChildByName('lbBankNumber').active = true;
        this.titleContainer.getChildByName('Content').active = true;
        this.lbBankNumber.node.active = true;
    }
    setInfoCashOut(data) {
        this.type = TYPE.CASHOUT;
        this.dataCashOut = data;
        //  cc.log("setInfoCashOut:", data);
        this.titleContainer.getChildByName('lbUserAccountName').active = true;
        this.lbUserAccountName.node.active = true;

        this.lbNameAgency.string = data['nameagent'];
        this.lbNickname.string = data['nickname'];
        this.lbAmount.string = Utils.formatNumber(data['amount']);
        this.lbUserAccountName.string = data['useraccountname'];
        this.lbUserBankName.string = data['userbankname'];

        this.lbContent.node.active = false;
        this.lbAgencyBankName.node.active = false;
        this.titleContainer.getChildByName('lbAgencyBankName').active = false;
        this.titleContainer.getChildByName('lbBankNumber').active = false;
        this.titleContainer.getChildByName('Content').active = false;
        this.lbBankNumber.node.active = false;


    }
    onClickConfirm() {
        cc.log("TYPE TAB:" + this.type);
        if (this.type == TYPE.CASHIN) {
            cc.log("DataCassh IN=", this.dataCashIn);
            //api?c=2003&am=100000&code=367457&abn=2222&bc=TPB&cid=1122334455&nn=BigBird&at=123123&bn=1234",
            App.instance.showLoading(true);
            Http.get(Configs.App.API2, {
                "c": 2003,
                "am": this.dataCashIn['amount'],
                "nn": Configs.Login.Nickname,
                "at": Configs.Login.AccessToken,
                "code": this.dataCashIn['agencyID'],
                "cid": this.dataCashIn['cid'],
                "abn": this.dataCashIn['bank_number'],
                "bn": this.dataCashIn['userbanknumber'],
            }, (err, res) => {
                App.instance.showLoading(false);
                cc.log(res);
                if (res['success']) {
                    App.instance.ShowAlertDialog(App.instance.getTextLang('txt_request_cashin_success'));
                    this.dismiss();
                } else {
                    App.instance.ShowAlertDialog(res['message']);
                    this.dismiss();
                }
            });
        } else {
            cc.log("DataCassh=", this.dataCashOut);
            //api?c=2010&am=100000&code=367457&bc=TPB&nn=BigBird&at=123123&bn=1234",
            App.instance.showLoading(true);
            Http.get(Configs.App.API2, {
                "c": 2010,
                "am": this.dataCashOut['amount'],
                "nn": Configs.Login.Nickname,
                "at": Configs.Login.AccessToken,
                "code": this.dataCashOut['agencyID'],
                "bn": this.dataCashOut['userbanknumber'],
            }, (err, res) => {
                App.instance.showLoading(false);
                cc.log(res);
                if (res['success']) {
                    App.instance.ShowAlertDialog(App.instance.getTextLang('txt_request_cashin_success'));
                    this.dismiss();
                } else {
                    App.instance.ShowAlertDialog(res['message']);
                    this.dismiss();
                }
            });
        }

    }

    // update (dt) {}
}
