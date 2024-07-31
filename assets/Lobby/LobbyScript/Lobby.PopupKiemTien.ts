import Configs from "../../Loading/src/Configs";
import Http from "../../Loading/src/Http";
import UtilsNative from "../../Loading/src/UtilsNative";
import App from "./Script/common/App";
import Dialog from "./Script/common/Dialog";
import Utils from "./Script/common/Utils";

const { ccclass, property } = cc._decorator;
var TAB_POPUP = {
    INFO: 0,
    LIST: 1,
    HISTORY: 2,
    POLICY: 3
}
@ccclass
export default class PopupKiemTien extends Dialog {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    @property(cc.Button)
    btnConfirm: cc.Button = null;
    @property(cc.EditBox)
    edbInviteCode: cc.EditBox = null;
    @property(cc.Label)
    lbInviteCode: cc.Label = null;
    @property(cc.Label)
    lbTotalUser1: cc.Label = null;
    @property(cc.Label)
    lbTitleInvite: cc.Label = null;
    @property(cc.Label)
    lbBonus1: cc.Label = null;
    @property(cc.Label)
    lbUrlInvite: cc.Label = null;
    @property(cc.Label)
    lbTotalPage_tabList: cc.Label = null;
    @property(cc.Label)
    lbTotalPage_tabHistory: cc.Label = null;
    @property(cc.Node)
    NodeInfo: cc.Node = null;
    @property(cc.Node)
    NodeListUser: cc.Node = null;
    @property(cc.Node)
    NodeHistory: cc.Node = null;
    @property(cc.Node)
    NodePolicy: cc.Node = null;
    @property(cc.Node)
    btnReceive: cc.Node = null;
    @property(cc.Toggle)
    toggleInfo: cc.Toggle = null;
    @property(cc.Node)
    nodeTabContainer: cc.Node = null;
    @property(cc.ScrollView)
    scrListUser: cc.ScrollView = null;
    @property(cc.ScrollView)
    scrListHistory: cc.ScrollView = null;
    page = 1;
    totalPage = 1;
    tab_popup = 0;
    status_history = 0;
    historyData = [];

    start() {

    }
    show() {
        super.show();
        this.toggleInfo.uncheck();
        this.toggleInfo.check();
        this.lbUrlInvite.string = cc.js.formatStr("https://play.go88s.fun/?aff=%s", Configs.Login.Nickname);
        this.lbInviteCode.string = Configs.Login.Nickname;
        this.edbInviteCode.enabled = true;
        this.edbInviteCode.string = "";
        this.lbTitleInvite.string = "Nhập mã giới thiệu:";
        this.btnConfirm.node.active = true;
        Http.get(Configs.App.API, { c: "2040", nn: Configs.Login.Nickname, "at": Configs.Login.AccessToken, "ac": "get" }, (err, res) => {
            if (res != null) {
                //  cc.log(res);
                App.instance.showLoading(false);
                if (res['success']) {
                    if (res['data'] != "") {
                        this.edbInviteCode.string = res['data'];
                        this.edbInviteCode.enabled = false;
                        this.lbTitleInvite.string = "Bạn là thành viên của ";
                        this.btnConfirm.node.active = false;
                    }
                } else {
                    // App.instance.ShowAlertDialog(res['message']);
                }
            }
        });
        if (cc.sys.isBrowser) {
            //  cc.log("URL Game==" + window.location.href);
            let url = window.location.href;
            // let url = "https://play.go88s.fun/?aff=NhungNgao4";
            if (url.includes("aff=")) {
                let indexOfEqual = url.indexOf("=");
                let inviteCode = url.substring(indexOfEqual + 1, url.length);
                this.edbInviteCode.string = inviteCode;
                this.edbInviteCode.enabled = false;
            }
        }
    }
    getInfoAll() {
        App.instance.showLoading(true);
        Http.get(Configs.App.API, { c: "2039", nn: Configs.Login.Nickname, "at": Configs.Login.AccessToken, "pg": 1, "mi": 6, }, (err, res) => {
            if (res != null) {
                //  cc.log(res);
                App.instance.showLoading(false);
                if (res['success']) {
                    this.lbBonus1.string = Utils.formatMoney(res['data']['totalBonus']);
                    this.lbTotalUser1.string = res['totalRecords'];
                }
            }
        });
    }
    onChangeTab(even: cc.Toggle) {
        if (even.node.name == "tabInfo") {
            this.nodeTabContainer.children[0].getComponent(cc.Toggle).check();
            this.tab_popup = TAB_POPUP.INFO;
            this.getInfoAll();
        }
        else if (even.node.name == "tabList") {
            this.nodeTabContainer.children[1].getComponent(cc.Toggle).check();
            this.resetTab();
            this.onGetListUser();
            this.tab_popup = TAB_POPUP.LIST
        }
        else if (even.node.name == "tabHistory") {
            this.nodeTabContainer.children[2].getComponent(cc.Toggle).check();
            this.resetTab();
            this.onGetHistory();
            this.tab_popup = TAB_POPUP.HISTORY
        }
        else if (even.node.name == "tabPolicy") {
            this.nodeTabContainer.children[3].getComponent(cc.Toggle).check();
            this.tab_popup = TAB_POPUP.POLICY;
        }
    }
    resetTab() {
        this.page = 1;
        this.totalPage = 1;
    }
    onToggleChangeTabSumary(even, data) {
        let currentTime = new Date();
        let day = currentTime.getDate();
        let month = currentTime.getMonth() + 1
        let year = currentTime.getFullYear();
        let fromTime = "";
        let endTime = "";
        switch (data) {
            case "1":
                this.getInfoAll();
                break;
            case "2"://today
                fromTime = year + "-" + month + "-" + day;
                this.onGetSumary(fromTime, fromTime);
                break;
            case "3"://yesterday
                day = day - 1;
                if (day == 0) {
                    if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
                        day = 31
                    } else {
                        day = 30;
                    }
                    month = month - 1;
                    if (month == 0) {
                        month = 12;
                    }
                }
                fromTime = year + "-" + month + "-" + day;
                this.onGetSumary(fromTime, fromTime);
                break;
            case "4"://this month
                fromTime = year + "-" + month + "-" + 1;
                endTime = year + "-" + month + "-" + day;
                this.onGetSumary(fromTime, endTime);
                break;
        }
    }
    onGetSumary(fromTime, endTime) {
        App.instance.showLoading(true);
        //http://localhost:8081/api?c=2038&nn=brightc&at=7898989&ft=2021-11-02&et=2021-11-30&st=0&pg=1&mi=10
        Http.get(Configs.App.API, { c: "2039", nn: Configs.Login.Nickname, "at": Configs.Login.AccessToken, "pg": 1, "mi": 10, "ft": fromTime, "et": endTime }, (err, res) => {
            if (res != null) {
                //  cc.log(res);
                App.instance.showLoading(false);
                if (res['success']) {
                    this.lbBonus1.string = Utils.formatMoney(res['data']['totalBonus']);
                    this.lbTotalUser1.string = res['totalRecords'];
                }
            }
        });
    }
    onGetListUser() {
        App.instance.showLoading(true);
        //http://localhost:8081/api?c=2039&nn=brightc&at=7898989&ft=2021-11-02&et=2021-11-30&pg=1&mi=10",
        Http.get(Configs.App.API, { c: "2039", nn: Configs.Login.Nickname, "at": Configs.Login.AccessToken, "pg": this.page, "mi": 6, }, (err, res) => {
            if (res != null) {
                //  cc.log("List user:\n", res);
                App.instance.showLoading(false);
                if (res['success']) {
                    let listUser = res['data']['userLevels'];
                    for (let i = 0, l = listUser.length; i < l; i++) {
                        let item = this.scrListUser.content.children[i];
                        let dataUser = listUser[i];
                        if (!cc.isValid(item)) {
                            item = cc.instantiate(this.scrListUser.content.children[0]);
                            item.parent = this.scrListUser.content;
                        }
                        item.active = true;
                        item.getChildByName('lbNickname').getComponent(cc.Label).string = dataUser['nick_name'];
                        item.getChildByName('lbDayCreated').getComponent(cc.Label).string = dataUser['created_at'].substring(0, 19).replace(" ", "\n");
                        item.getChildByName('lbBonus').getComponent(cc.Label).string = Utils.formatNumber(dataUser['totalBonus']);
                    }
                    if (res['totalRecords'] <= 6) {
                        this.totalPage = 1;
                    } else {
                        this.totalPage = res['totalRecords'] % 6 == 0 ? (res['totalRecords'] / 6) : Math.floor(res['totalRecords'] / 6) + 1;
                    }
                    this.lbTotalPage_tabList.string = this.page + "/" + this.totalPage;
                    for (let i = listUser.length; i < this.scrListUser.content.childrenCount; i++) {
                        this.scrListUser.content.children[i].active = false;
                    }
                }

            }
        });
    }
    async onGetHistory() {
        await Http.get(Configs.App.API, { c: "2038", nn: Configs.Login.Nickname, "at": Configs.Login.AccessToken, "st": this.status_history, "pg": this.page, "mi": 6 }, (err, res) => {
            if (res != null) {
                //  cc.log("history:\n", res);
                App.instance.showLoading(false);
                if (res['success']) {
                    let listHistory = res['data']['userWages'];
                    this.btnReceive.active = listHistory.length > 0 ? true : false;
                    for (let i = 0, l = listHistory.length; i < l; i++) {
                        let item = this.scrListHistory.content.children[i];
                        let dataHistory = listHistory[i];
                        if (!cc.isValid(item)) {
                            item = cc.instantiate(this.scrListHistory.content.children[0]);
                            item.parent = this.scrListHistory.content;
                        }
                        item.active = true;
                        item.getChildByName('lbBonus').getComponent(cc.Label).string = Utils.formatNumber(dataHistory['bonus']);
                        item.getChildByName('lbNickname').getComponent(cc.Label).string = dataHistory['nick_name'];
                        item.getChildByName('btnReceive').active = dataHistory['status'] == 0;
                        item.getChildByName('btnReceive').off("click");
                        item.getChildByName('btnReceive').on("click", () => {
                            //http://localhost:8081/api?c=2037&nn=brightc&at=7898989&id=1
                            Http.get(Configs.App.API, { c: "2037", nn: Configs.Login.Nickname, "at": Configs.Login.AccessToken, "id": dataHistory['id'] }, (err, res) => {
                                if (res['success']) {
                                    App.instance.showToast("Nhận hoa hồng thành công: +" + Utils.formatMoney(dataHistory['bonus']));
                                    this.onGetHistory();
                                } else {
                                    App.instance.showToast("Có lỗi xảy ra, Vui lòng thử lại sau!");
                                }
                            })
                        });
                        item.getChildByName('lbTime').getComponent(cc.Label).string = dataHistory['created_at'].substring(0, 19).replace(" ", "\n");
                        item['data'] = dataHistory;
                    }
                    if (res['totalRecords'] <= 6) {
                        this.totalPage = 1;
                    } else {
                        this.totalPage = res['totalRecords'] % 6 == 0 ? (res['totalRecords'] / 6) : Math.floor(res['totalRecords'] / 6) + 1;
                    }
                    this.lbTotalPage_tabHistory.string = this.page + "/" + this.totalPage;
                    for (let i = listHistory.length; i < this.scrListHistory.content.childrenCount; i++) {
                        this.scrListHistory.content.children[i].active = false;
                    }
                }
            }
        });
    }
    onChangeStatusHistory() {
        this.resetTab();
        this.status_history = this.status_history == 0 ? 1 : 0;
        this.btnReceive.active = this.status_history == 0;
        this.onGetHistory();
    }
    onClickNext() {
        if (this.page == this.totalPage) {
            return;
        }
        this.page++;
        if (this.tab_popup == TAB_POPUP.LIST) {
            this.onGetListUser();
        } else {
            this.onGetHistory();
        }
    }
    onClickPrevious() {
        if (this.page == 1) {
            return;
        }
        this.page--;
        if (this.tab_popup == TAB_POPUP.LIST) {
            this.onGetListUser();
        } else {
            this.onGetHistory();
        }
    }
    onClickReceiveAll() {
        //http://localhost:8081/api?c=2037&nn=brightc&at=7898989&id=1",
        App.instance.showLoading(true);
        Http.get(Configs.App.API, { c: "2037", nn: Configs.Login.Nickname, "at": Configs.Login.AccessToken, "ac": "all" }, (err, res) => {
            if (res != null) {
                //  cc.log(res);
                App.instance.showLoading(false);
                if (res['success']) {
                    this.onGetHistory();
                } else {
                    App.instance.ShowAlertDialog(res['message']);
                }
            }
        });
    }
    onClickCopyInviteLink() {
        // if (navigator && navigator.clipboard) {
        //     navigator.clipboard.writeText(this.lbUrlInvite.string);
        // } else {
        //     console.log("Khong Cos Navigator trên native đâu");
        // }
        // Utils.copy(this.lbUrlInvite.string);
        if (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS) {
            UtilsNative.copyClipboard(this.lbUrlInvite.string);
        } else {
            Utils.copy(this.lbUrlInvite.string);
        }

    }
    onClickUpdateInviteCode() {
        let inviteCode = this.edbInviteCode.string.trim();
        if (inviteCode == "") {
            return;
        }
        App.instance.showLoading(true);
        Http.get(Configs.App.API, { c: "2040", nn: Configs.Login.Nickname, "at": Configs.Login.AccessToken, "ac": "update", "inv": inviteCode }, (err, res) => {
            if (res != null) {
                //  cc.log(res);
                App.instance.showLoading(false);
                if (res['success']) {
                    App.instance.ShowAlertDialog("Chúc mừng!\nBạn đã cập nhật mã giới thiệu thành công!");
                    this.btnConfirm.node.active = false;
                    this.edbInviteCode.enabled = false;
                    this.lbTitleInvite.string = "Bạn là thành viên của";
                } else {
                    App.instance.ShowAlertDialog(res['message']);
                }
            }
        });
    }

    // update (dt) {}
}
