import Configs from "../../Loading/src/Configs";
import Http from "../../Loading/src/Http";
import App from "./Script/common/App";
import BroadcastReceiver from "./Script/common/BroadcastReceiver";
import Dialog from "./Script/common/Dialog";
import Utils from "./Script/common/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIPopupMail extends Dialog {
    @property(cc.Label)
    lblPage: cc.Label = null;

    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Node)
    prefab: cc.Node = null;

    @property(cc.Label)
    txtTitle: cc.Label = null;

    @property(cc.RichText)
    txtContent: cc.RichText = null;

    @property(cc.Label)
    txtTime: cc.Label = null;

    @property(cc.Label)
    txtSender: cc.Label = null;

    @property(cc.Node)
    boxInfo: cc.Node = null;

    @property(cc.Node)
    boxEmpty: cc.Node = null;

    @property(cc.Node)
    boxHave: cc.Node = null;

    private page: number = 1;
    private maxPage: number = 1;
    private items = new Array<cc.Node>();
    private listMail = [];

    start() {

    }
    _onShowed() {
        super._onShowed();
        this.page = 1;
        this.maxPage = 1;
        this.lblPage.string = this.page + "/" + this.maxPage;
        this.loadData();
    }

    actNextPage() {
        if (this.page < this.maxPage) {
            this.page++;
            this.lblPage.string = this.page + "/" + this.maxPage;
            this.loadData();
        }
    }

    actPrevPage() {
        if (this.page > 1) {
            this.page--;
            this.lblPage.string = this.page + "/" + this.maxPage;
            this.loadData();
        }
    }

    show() {
        super.show();
        // this.loadData();
    }

    private loadData() {
        App.instance.showLoading(true);
        Http.get(Configs.App.API, { c: "405", nn: Configs.Login.Nickname, p: this.page }, (err, res) => {
            App.instance.showLoading(false);
            if (err != null) return;
             //Utils.Log("UIPopupMail:" + JSON.stringify(res));
            if (res["success"]) {
                if (res["errorCode"] == "10001") {
                    this.boxEmpty.active = true;
                    this.boxHave.active = false;
                }
                else {
                    this.boxEmpty.active = false;
                    this.boxHave.active = true;
                    this.boxInfo.active = false;
                    this.content.removeAllChildren();

                    this.maxPage = res["totalPages"];
                    this.lblPage.string = this.page + "/" + this.maxPage;
                    Configs.Login.ListMail = res["transactions"];
                    res['transactions'].sort((x, y) => {
                        return x['status'] - y['status'];
                    });
                    BroadcastReceiver.send(BroadcastReceiver.ON_UPDATE_MAIL);
                    for (let i = 0; i < res["transactions"].length; i++) {
                        let dataItem = res["transactions"][i];
                         //Utils.Log("Status==" + dataItem['status']);
                        var item = cc.instantiate(this.prefab);
                        item.parent = this.content;
                        item.getComponent("UIItemMail").init(this, dataItem);
                    }
                }
            }
        });
    }

    private dataMailReading = null;
    readMail(dataMail) {

        this.dataMailReading = dataMail;
        this.boxInfo.active = true;
        this.txtTitle.string = App.instance.getTextLang('txt_mail_title') + dataMail.title + " " + dataMail.title;
        this.txtContent.string =App.instance.getTextLang('txt_mail_content')+ dataMail.content;
        this.txtTime.string =App.instance.getTextLang('txt_mail_time_send')+ dataMail.createTime;
        this.txtSender.string = App.instance.getTextLang('txt_mail_from') + dataMail.author;
    }

    OpenURL() {
        cc.sys.openURL("https://google.com");
    }
    onBtnXoa() {
        if (this.dataMailReading != null) {
            App.instance.showLoading(true);
            Http.get(Configs.App.API, { c: "403", mid: this.dataMailReading.mail_id }, (err, res) => {
                App.instance.showLoading(false);
                if (err != null) return;
                if (res.success) {
                    this.loadData();
                }
            });
        }
    }
}
