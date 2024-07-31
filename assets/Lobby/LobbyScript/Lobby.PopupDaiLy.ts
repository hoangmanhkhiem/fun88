import Configs from "../../Loading/src/Configs";
import Http from "../../Loading/src/Http";
import PopupConfirmTransfer from "./PopupConfirmTransfer";
import App from "./Script/common/App";
import Dialog from "./Script/common/Dialog";
import ScrollViewControl from "./Script/common/ScrollViewControl";
import Utils from "./Script/common/Utils";
import BundleControl from "../../Loading/src/BundleControl";
var TYPE_SEARCH = {
    NICKNAME: 0,
    SDT: 1,
    REGION: 2
}
var TAB = {
    CASHIN: 0,
    CASHOUT: 1,
    HISTORY: 2
}
const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupDaiLy extends Dialog {

    listAgency = [];
    listBank = [];
    listSearchAgency = [];
    typeSearch = TYPE_SEARCH.REGION;
    @property(ScrollViewControl)
    scrAgency: ScrollViewControl = null;

    @property(ScrollViewControl)
    scrBankList: ScrollViewControl = null;

    @property(cc.EditBox)
    edbSearch: cc.EditBox = null;

    @property(cc.EditBox)
    edbMoney: cc.EditBox = null;

    @property(cc.EditBox)
    edbTransID: cc.EditBox = null;

    @property(cc.Label)
    lbChipReceive: cc.Label = null;
    @property(cc.Label)
    lblPage: cc.Label = null;

    @property(Dialog)
    popupBankInfo: Dialog = null;

    @property(PopupConfirmTransfer)
    popupConfirm: PopupConfirmTransfer = null;

    @property(cc.Node)
    dropBankUser: cc.Node = null;

    @property(cc.Node)
    nodeBankUser: cc.Node = null;

    @property(cc.Node)
    nodeBankAgency: cc.Node = null;

    @property(cc.Node)
    dropBankAgency: cc.Node = null;

    @property(cc.Node)
    nodeTransfer: cc.Node = null;

    @property(cc.Node)
    nodeHistory: cc.Node = null;

    @property(cc.Label)
    lbNameAgency: cc.Label = null;
    @property(cc.Label)
    lbNickname: cc.Label = null;

    @property(cc.Toggle)
    toggleDropBankUser: cc.Toggle = null;
    @property(cc.Toggle)
    toggleDropBankAgency: cc.Toggle = null;
    @property(cc.Toggle)
    toggleCashIn: cc.Toggle = null;
    @property(cc.Toggle)
    toggleCashOut: cc.Toggle = null;
    @property(cc.Node)
    itemHistoryContainer: cc.Node = null;

    tab = 0;
    currentDataDaily = null;
    currentBankDaily = null;
    currentDataUser = null;
    page = 1;
    maxPage = 1;
    show() {
        super.show();
        if (typeof (this.tab) != "number") {
            this.tab = 0;
        }
        if (this.tab == 0) {
            this.toggleCashIn.isChecked = true;
            this.toggleCashIn.check();
            this.onChangeTab(null, this.tab)
        } else if (this.tab == 1) {
            this.toggleCashOut.isChecked = true;
            this.toggleCashOut.check();
            this.onChangeTab(null, this.tab)
        }
    }
    dismiss() {
        super.dismiss();

    }
    onBtnCopy(obj, data) {
        Utils.copy(data);
        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_content_copied') + data);
    }
    _onShowed() {
        super._onShowed();
    }
    onEnable() {
        this.loadData();
        this.edbSearch.string = "";
    }
    loadData() {
        //http://43.128.27.35:8081/api?c=2034&code=367457&key=&pg=1&mi=10&level=2
        App.instance.showLoading(true);
        this.listAgency = [];
        Http.get(Configs.App.API2, { "c": 2034, "nn": Configs.Login.Nickname }, (err, res) => {
            App.instance.showLoading(false);
            if (err != null) return;
            if (res["success"] && res['data'] != null) {
                //  cc.log(res);
                this.listAgency = res['data'];
            }
            this.scrAgency.setDataList(this.setDataItem, this.listAgency);
            //  cc.log("list Agency=", this.listAgency);
        });
        var data = {};
        data["c"] = 2008;
        data["nn"] = encodeURIComponent(Configs.Login.Nickname.trim());
        data["pn"] = 1;
        data["l"] = 10;
        Http.get(Configs.App.API2, data, (err, res) => {
            var list = JSON.parse(res.data).data;
            this.setInfoDropBankUser(list);
        });
    }
    setDataItem(item, data) {
        item.opacity = data['rank'] >= 1 ? 255 : 150;
        item.getChildByName('lbStt').getComponent(cc.Label).string = item['itemID'] + 1;
        item.getChildByName('lbName').getComponent(cc.Label).string = data['nameagent'];
        item.getChildByName('lbNickname').getComponent(cc.Label).string = data['nickname'];
        item.getChildByName('lbRegion').getComponent(cc.Label).string = data['address'];
        item.getChildByName('lbSdt').getComponent(cc.Label).string = data['phone'];
        item.getChildByName('bg').active = data['index'] % 2 == 0;
        item['data'] = data;
        item.active = true;
    }
    setDataItemBank(item, data) {
        item.getChildByName('lbStt').getComponent(cc.Label).string = item['itemID'] + 1;
        item.getChildByName('lbAgencyCode').getComponent(cc.Label).string = data['agent_code'];
        item.getChildByName('lbBankAccount').getComponent(cc.Label).string = data['bank_acount'];
        item.getChildByName('lbBankName').getComponent(cc.Label).string = data['bank_name'];
        if (data['bank_name'].length > 30) {
            item.getChildByName('lbBankName').getComponent(cc.Label).string = data['bank_name'].slice(0, 27) + "...";
        }
        item.getChildByName('lbBranch').getComponent(cc.Label).string = data['bank_branch'];
        item.getChildByName('lbBankNumber').getComponent(cc.Label).string = data['bank_number'];
        item['data'] = data;
        item.active = true;
    }
    onClickItemAgency(even) {
        //api?c=2033&code=367457&key=&nn=a&at=2&pg=1&mi=10",
        if (even.target['data'].rank < 1) {
            App.instance.showToast(App.instance.getTextLang('txt_agency_note1'));
        } else {
            let dataAgency = even.target['data'];
            //  cc.log("dataAgency:", dataAgency);
            this.currentDataDaily = dataAgency;
            this.lbNameAgency.string = dataAgency['nameagent'];
            this.lbNickname.string = dataAgency['nickname'];
            let listBankAgency = [];
            this.currentBankDaily = null;
            this.toggleDropBankAgency.isChecked = false;
            this.toggleDropBankAgency.node.parent.getChildByName('lbCurrentBank').getComponent('MultiLanguage').updateText();
            if (dataAgency['banks'] != null) {
                listBankAgency = JSON.parse(dataAgency['banks']);
            }
            this.setInfoDropBankAgency(listBankAgency);
        }

    }
    onClickItemDetail(even) {
        let idAgency = even.target.parent['data']['code'];
        this.listBank = [];
        this.scrBankList.scrollView.content.children.forEach((item) => {
            item.active = false;
        })
        Http.get(Configs.App.API2, { "c": 2033, "code": idAgency, "nn": Configs.Login.Nickname, "at": Configs.Login.AccessToken }, (err, res) => {
            App.instance.showLoading(false);
            //  cc.log(res);
            if (err != null) return;
            if (res["success"] && res['data'] != null) {
                this.listBank = res['data'];
                this.scrBankList.setDataList(this.setDataItemBank, this.listBank);
                this.popupBankInfo.show();
            }
        });
    }
    onClickSearch() {
        let keySearch = this.edbSearch.string.trim().toLowerCase();;
        if (keySearch == "") {
            this.scrAgency.setDataList(this.setDataItem, this.listAgency);
            return;
        }
        let paramsSearch = "";
        this.listSearchAgency = [];
        if (this.typeSearch == TYPE_SEARCH.REGION) {
            paramsSearch = 'address';
        } else if (this.typeSearch == TYPE_SEARCH.NICKNAME) {
            paramsSearch = "nickname";
        } else {
            paramsSearch = "phone";
        }
        this.listAgency.forEach((item) => {
            if (item[paramsSearch] != null) {
                if (item[paramsSearch].toLowerCase().includes(keySearch))
                    this.listSearchAgency.push(item);
            }
        })
        this.scrAgency.setDataList(this.setDataItem, this.listSearchAgency);

    }
    onClickTypeSearch(even, data) {
        this.typeSearch = parseInt(data);

    }
    onEdbChange() {
        if (this.edbSearch.string.trim() == "") {
            this.scrAgency.setDataList(this.setDataItem, this.listAgency);
        }
    }
    onClickFacebook(even) {
        let fbLink = even.target.parent['data']['facebook'];
        cc.sys.openURL(fbLink);
    }
	onClickTelegram(even) {
        let tlLink = even.target.parent['data']['site'];
        cc.sys.openURL(tlLink);
    }
    edbChanged() {
        this.lbChipReceive.string = this.edbMoney.string + " XU";

    }
	
	
	actBankUpdate() {
            

             
                
                    let cb = (prefab) => {
                        let popupProfile = cc.instantiate(prefab).getComponent("Lobby.PopupProfile");
                        App.instance.node.addChild(popupProfile.node);
                        this.popupProfile = popupProfile;
                        this.popupProfile.showTabBank();
                    }
                    BundleControl.loadPrefabPopup("PrefabPopup/PopupProfile", cb);
                

            

        }
	
	
	
    onClickConfirm() {
        let agencyName = this.lbNameAgency.string.trim();
        let nickname = this.lbNickname.string.trim();
        let amount = Utils.ToInt(this.edbMoney.string.trim());
        let transactionID = this.generateTransMsg();
        if (this.tab == TAB.CASHIN) {
            if (agencyName == "" || nickname == "" || amount == 0 || this.currentDataDaily == null || this.currentDataUser == null) {
                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_input_all'));
                return;
            }
            let dataCashIn = Object.create({});
            dataCashIn['nameagent'] = agencyName;
            dataCashIn['nickname'] = nickname;
            dataCashIn['amount'] = amount;
            dataCashIn['cid'] = transactionID;
            dataCashIn['usernamebank'] = this.currentDataUser['bankName'];
            dataCashIn['agencynamebank'] = this.currentBankDaily['bank_name'];
            dataCashIn['bank_number'] = this.currentBankDaily['bank_number'];
            dataCashIn['agencyID'] = this.currentDataDaily['code'];
            dataCashIn['userbanknumber'] = this.currentDataUser["bankNumber"];
            this.popupConfirm.setInfoCashIn(dataCashIn);
            this.popupConfirm.show();
        } else {
            if (agencyName == "" || nickname == "" || amount == 0) {
                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_input_all'));
                return;
            }
            let dataCashOut = Object.create({});
            dataCashOut['nameagent'] = agencyName;
            dataCashOut['nickname'] = nickname;
            dataCashOut['amount'] = amount;
            dataCashOut['agencyID'] = this.currentDataDaily['code'];
            dataCashOut['userbankname'] = this.currentDataUser["bankName"];
            dataCashOut['useraccountname'] = this.currentDataUser["customerName"];
            dataCashOut['userbanknumber'] = this.currentDataUser["bankNumber"];
            this.popupConfirm.setInfoCashOut(dataCashOut);
            this.popupConfirm.show();
        }
    }
    setInfoDropBankUser(data) {
        //  cc.log("setInfoDropBankUser:", data);
        this.dropBankUser.children.forEach((item) => {
            item.active = false;
        });
        for (let i = 0; i < data.length; i++) {
            let itemBank = this.dropBankUser.children[i];
            if (!cc.isValid(itemBank)) {
                itemBank = cc.instantiate(this.dropBankUser.children[0])
                itemBank.parent = this.dropBankUser;
            }
            itemBank.active = true;
            itemBank.getComponentInChildren(cc.Label).string = data[i]['bankName'];
            itemBank['data'] = data[i];
        }
    }
    setInfoDropBankAgency(data) {
        if (data.length > 0) {
            this.dropBankAgency.children.forEach((item) => {
                item.active = false;
            })
            //  cc.log("data:", data);
            for (let i = 0; i < data.length; i++) {
                let itemBank = this.dropBankAgency.children[i];
                if (!cc.isValid(itemBank)) {
                    itemBank = cc.instantiate(this.dropBankAgency.children[0])
                    itemBank.parent = this.dropBankAgency;
                }
                itemBank.active = true;
                itemBank.getComponentInChildren(cc.Label).string = data[i]['bank_name'];
                if (itemBank.getComponentInChildren(cc.Label).string.length > 20) {
                    itemBank.getComponentInChildren(cc.Label).string = itemBank.getComponentInChildren(cc.Label).string.slice(0, 20) + "...";
                }
                itemBank['data'] = data[i];
            }
        }
    }
    onClickItemBankUser(even, data) {
        this.toggleDropBankUser.isChecked = false;
        //  cc.log("onClickItemBankUser:", even.target['data']);
        if (even.target['data'] != null) {
            this.toggleDropBankUser.node.parent.getChildByName('lbCurrentBank').getComponent(cc.Label).string = even.target['data']['bankName'];
            this.currentDataUser = even.target['data'];
        }
    }
    onClickItemBankAgency(even, data) {
        this.toggleDropBankAgency.isChecked = false;
        if (even.target['data'] != null) {
            this.toggleDropBankAgency.node.parent.getChildByName('lbCurrentBank').getComponent(cc.Label).string = even.target['data']['bank_name'];
            this.currentBankDaily = even.target['data'];
        }
    }
    onChangeTab(even, data) {
        //  cc.log("onchangetab");
        switch (parseInt(data)) {
            case TAB.CASHIN:
                this.tab = parseInt(data);
                this.nodeTransfer.active = true;
                this.nodeHistory.active = false;
                this.edbTransID.node.active = false;
                this.nodeBankUser.active = true;
                this.nodeBankAgency.active = true;
                this.maxPage = 1;
                this.page = 1;
                break;
            case TAB.CASHOUT:
                this.tab = parseInt(data);
                this.nodeTransfer.active = true;
                this.nodeHistory.active = false;
                this.edbTransID.node.active = false;
                this.nodeBankAgency.active = false;
                this.maxPage = 1;
                this.page = 1;
                break;
            case TAB.HISTORY:
                this.nodeTransfer.active = false;
                this.nodeHistory.active = true;
                this.loadDataHistory();
                break;
        }
    }
    loadDataHistory() {
        let params;
        if (this.tab == 0) {//cashin
            params = { "c": 2016, "nn": Configs.Login.Nickname, "tt": 0, "p": this.page, "mi": 5 };
        } else {//cashout
            params = { "c": 2016, "nn": Configs.Login.Nickname, "tt": 1, "p": this.page, "mi": 5 };
        }
        Http.get(Configs.App.API2, params, (err, res) => {
            //  cc.log(res);
            App.instance.showLoading(false);
            if (err != null) {
                return;
            }
            if (res['success']) {
                if (res['totalRecords'] <= 5) {
                    this.maxPage = 1;
                } else {
                    this.maxPage = res['totalRecords'] % 5 == 0 ? (res['totalRecords'] % 5) : Math.floor(res['totalRecords'] / 5) + 1;
                }
                this.lblPage.string = this.page + "/" + this.maxPage;
                this.setHistory(res['data']);
            }
        });
    }
    setHistory(data) {
        this.itemHistoryContainer.children.forEach((item) => {
            item.active = false;
        })
        for (let i = 0; i < data.length; i++) {
            let item = this.itemHistoryContainer.children[i];
            if (!cc.isValid(item)) {
                item = cc.instantiate(this.itemHistoryContainer.children[0])
                item.parent = this.itemHistoryContainer;
            }
            item.active = true;
            item.getChildByName('lbTime').getComponent(cc.Label).string = data[i]['CreatedAt'].replace(" ", "\n");
            item.getChildByName('lbBank').getComponent(cc.Label).string = data[i]['BankCode'];
            item.getChildByName('lbAmount').getComponent(cc.Label).string = Utils.formatMoney(data[i]['Amount']);
            switch (data[i]['Status']) {
                case 0:
                    item.getChildByName("lbStatus").getComponent(cc.Label).string = App.instance.getTextLang('txt_pending');
                    item.getChildByName("lbStatus").color = cc.Color.YELLOW;
                    break;
                case 2:
                    item.getChildByName("lbStatus").getComponent(cc.Label).string = App.instance.getTextLang('txt_success');
                    item.getChildByName("lbStatus").color = cc.Color.GREEN;
                    break;
                case 3:
                    item.getChildByName("lbStatus").getComponent(cc.Label).string = App.instance.getTextLang('txt_failed');
                    item.getChildByName("lbStatus").color = cc.Color.RED;
                    break;
                case 4:
                    item.getChildByName("lbStatus").getComponent(cc.Label).string = App.instance.getTextLang('txt_completed');
                    item.getChildByName("lbStatus").color = cc.Color.GREEN;
                    break;
                case 12:
                    item.getChildByName("lbStatus").getComponent(cc.Label).string = App.instance.getTextLang('txt_request_cashout');
                    item.getChildByName("lbStatus").color = cc.Color.CYAN;
                    break;
                default:
                    item.getChildByName("lbStatus").getComponent(cc.Label).string = App.instance.getTextLang('txt_receive2');
                    item.getChildByName("lbStatus").color = cc.Color.WHITE;

            }
        }
    }

    actNextPage() {
        if (this.page < this.maxPage) {
            this.page++;
            this.lblPage.string = this.page + "/" + this.maxPage;
            this.loadDataHistory();
        }
    }

    actPrevPage() {
        if (this.page > 1) {
            this.page--;
            this.lblPage.string = this.page + "/" + this.maxPage;
            this.loadDataHistory();
        }
    }
	generateTransMsg() {
        return (Configs.Login.Nickname + "-Bentley");
    }
}
