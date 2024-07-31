import Configs from "../../Loading/src/Configs";
import Http from "../../Loading/src/Http";
import App from "./Script/common/App";
import BroadcastReceiver from "./Script/common/BroadcastReceiver";
import Dialog from "./Script/common/Dialog";
import Utils from "./Script/common/Utils";


const { ccclass, property } = cc._decorator;

@ccclass
export class PopupRefund extends Dialog {
    @property(cc.Label)
    lblBalance: cc.Label = null;
    @property(cc.EditBox)
    edbCoin: cc.EditBox = null;
    @property([cc.Node])
    listItem: cc.Node[] = [];
    @property([cc.Font])
    fonts: cc.Font[] = [];
    @property(Dialog)
    popupConfirm: Dialog = null;

    @property(cc.Label)
    lbSport: cc.Label = null;
    @property(cc.Label)
    lbCasino: cc.Label = null;
    @property(cc.Label)
    lbGameLot: cc.Label = null;
    @property(cc.Label)
    lbTotal: cc.Label = null;
    @property(cc.Label)
    lbInfomation: cc.Label = null;
    @property(cc.Button)
    btnConfirm: cc.Button = null;

    currentItemRefund = null;
    onLoad() {
      
    }
    onEnable(){
        this.setInfo();
    }
    start() {
       
    }
    setInfo() {
        let today = new Date().getTime();
         //Utils.Log("today==" + today);
        let firstDayRefund = today - 86400 * 1000 * 8;
        let firstDay = new Date(firstDayRefund).getDate();
        for (let i = 0; i < 7; i++) {
            let item = this.listItem[i];
            let dayRefund = new Date(today - (86400 * 1000 * (7 - i)));
            let date = dayRefund.getDate();
            let month = dayRefund.getMonth() + 1;
            let year = dayRefund.getFullYear();
            item.getChildByName('lbDay').getComponent(cc.Label).string = cc.js.formatStr("%s/%s/%s", (date < 10 ? "0" + date : date), (month < 10 ? "0" + month : month), year);
            item.getComponent(cc.Button).clickEvents[0].customEventData = cc.js.formatStr("%s-%s-%s", year, (month < 10 ? "0" + month : month), (date < 10 ? "0" + date : date));
            App.instance.showLoading(true);
            Http.get(Configs.App.API, { c: "2029", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken, date: item.getComponent(cc.Button).clickEvents[0].customEventData }, (err, res) => {
                 //Utils.Log(res);
                App.instance.showLoading(false);
                let lbChip = item.getChildByName('lbChip').getComponent(cc.Label);
                if (res["success"]) {
                    let totalRefund = res['data']['sumCasino'] + res['data']['sumGame'] + res['data']['sumSport'];
                    lbChip.string = "";
                    lbChip.font = this.fonts[0];
                    lbChip.string = Utils.formatNumber(totalRefund);
                    lbChip.fontSize = 40;
                    lbChip.node.y = -101.237;
                    item.getComponentInChildren(cc.Sprite).node.color = cc.Color.WHITE;
                    item.getComponent(cc.Button).interactable = true;
                    item['data'] = res['data'];
                    item['data']['total'] = totalRefund;
                    item['data']['date'] = cc.js.formatStr("%s-%s-%s", (date < 10 ? "0" + date : date), (month < 10 ? "0" + month : month), year);//cái này để show ra cho dễ nhìn
                    item['data']['dateRefund'] = cc.js.formatStr("%s-%s-%s", year, (month < 10 ? "0" + month : month), (date < 10 ? "0" + date : date)); //cái này để gưi lên cho server
                }
                else {
                    lbChip.string = "";
                    lbChip.font = this.fonts[1];
                    lbChip.node.y = -94;
                    lbChip.fontSize = 20;
                    item.getComponentInChildren(cc.Sprite).node.color = cc.Color.GRAY;
                    item.getComponent(cc.Button).interactable = false;
                    if (res['errorCode'] == 1002) {
                        lbChip.string = App.instance.getTextLang('txt_refund_receive');
                    }
                    else {
                        lbChip.string = App.instance.getTextLang('txt_refund_error');
                    }

                }
            }
            );
        }
    }
    onClickReceive(even, data) {
        let dataItem = even.target['data'];
        this.currentItemRefund = even.target;
        this.popupConfirm.show();
        this.lbCasino.string = Utils.formatNumber(dataItem['sumCasino']);
        this.lbSport.string = Utils.formatNumber(dataItem['sumSport']);
        this.lbGameLot.string = Utils.formatNumber(dataItem['sumGame']);
        this.lbTotal.string = Utils.formatNumber(dataItem['total']);
        this.lbInfomation.string = App.instance.getTextLang('txt_refund_confirm') + "\n" + dataItem['date'];
        this.btnConfirm.clickEvents[0].customEventData = dataItem['dateRefund'];
    }
    onClickConfirm(even, data) {
        this.popupConfirm.dismiss();
        App.instance.showLoading(true);
        Http.get(Configs.App.API, { c: "2030", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken, date: data }, (err, res) => {
             //Utils.Log(res);
            App.instance.showLoading(false);
            if (res["success"]) {
                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_refund_success'));
                Configs.Login.Coin += this.currentItemRefund['data']['total'];
                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                let lbChip = this.currentItemRefund.getChildByName('lbChip').getComponent(cc.Label);
                this.currentItemRefund.getComponent(cc.Button).interactable = false;
                this.currentItemRefund.getComponentInChildren(cc.Sprite).node.color = cc.Color.GRAY;
                lbChip.font = this.fonts[1];
                lbChip.node.y = -94;
                lbChip.fontSize = 20;
                lbChip.string = App.instance.getTextLang('txt_refund_receive');

            }
            else {
                App.instance.ShowAlertDialog(res.data);
            }
        }
        );
    }
}
