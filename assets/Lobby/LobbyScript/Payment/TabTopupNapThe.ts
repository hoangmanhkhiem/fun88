import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../Script/common/App";
import Utils from "../Script/common/Utils";
import TabTopupChuyenKhoan from "./TabTopupChuyenKhoan";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TabTopupNapThe extends TabTopupChuyenKhoan {

    @property(cc.Label)
    lbFree: cc.Label = null;
    @property({
        type: cc.EditBox,
        displayName: "edbCardPin",
        override: true
    })
    editName: cc.EditBox = null;
    @property({
        type: cc.EditBox,
        displayName: "edbCardSeri",
        override: true
    })
    editMoney: cc.EditBox = null;

    private listCard = [{ value: 10000, str: "10.000 VNĐ" }, { value: 20000, str: "20.000 VNĐ" }, { value: 50000, str: "50.000 VNĐ" }, { value: 100000, str: "100.000 VNĐ" }, { value: 200000, str: "200.000 VNĐ" }, { value: 500000, str: "500.000 VNĐ" }]
    private listRateCard = [{ type: "VNM", fee: "26%" }, { type: "GATE", fee: "32%" }, { type: "VCOIN", fee: "32%" }, { type: "VMS", fee: "26%" }, { type: "VTT", fee: "24%" }, { type: "VNP", fee: "26%" }, { type: "ZING", fee: "32%" }]
    show(data, providerName) {
        super.show(data, providerName);
        this.loadCardList();
        this.lbFree.string = "- Mỗi loại thẻ có phí nạp khác nhau.";
    }
    onBtnXacNhan() {
        let cardPin = this.editName.string.trim();
        let seri = this.editMoney.string.trim();
        var money = Utils.formatEditBox(this.dropCard.labelCaption.string);
        if (seri == "" || cardPin == "" || this.dataBankChosing == null) {
            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
            return;
        }
        App.instance.showLoading(true, -1);
        let request = {
            "c": 2033,
            "p": cardPin,
            "sn": seri,
            "am": money,
            "tc": this.dataBankChosing['key'],
            "nn": Configs.Login.Nickname,
            "at": Configs.Login.AccessToken,
        };
        //  cc.log("request:", request);
        Http.get(Configs.App.API, request, (err, res) => {
            App.instance.showLoading(false);
            //  cc.log(res);
            if (res.success == true) {
                App.instance.ShowAlertDialog("Yêu cầu nạp thẻ đã được gửi thành công!\nQuý khách vui lòng chờ trong ít phút!");
            }
            else {
                App.instance.ShowAlertDialog("Thông tin thẻ không đúng.\nVui lòng kiểm tra lại!");
            }
        });
    }
    loadCardList() {
        var datas = new Array();
        for (var i = 0; i < this.listCard.length; i++) {
            datas.push({ optionString: this.listCard[i]['str'] });
        }
        this.dropCard.clearOptionDatas();
        this.dropCard.addOptionDatas(datas);
        this.dropCard.selectedIndex = 0;
    }
    onBtnChoseBank() {
        this.lobbyChoseBank.init(this.tabWell, this.data.banks, (dataBankChosing) => {
            this.dataBankChosing = dataBankChosing;
            //  cc.log("data card=", this.dataBankChosing);
            for (let i = 0; i < this.listRateCard.length; i++) {
                if (this.dataBankChosing['key'] == this.listRateCard[i]['type']) {
                    this.lbFree.string = "- Phí nạp: " + this.listRateCard[i]['fee'];
                }
            }
            this.showBankChosing();
        });
        this.lobbyChoseBank.show();
    }
}
