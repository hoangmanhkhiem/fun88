import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../Script/common/App";
import BroadcastReceiver from "../Script/common/BroadcastReceiver";
import Tween from "../Script/common/Tween";
import Utils from "../Script/common/Utils";
import ItemGameLive from "./ItemGameLive";

const { ccclass, property } = cc._decorator;
var ListGame = ["Tài khoản chính", "Live Casino AG", "Thể thao IBC2", "Live Casino WM","Thể thao CMD368"];
var _this = null;
@ccclass
export default class GameLiveGeneralController extends cc.Component {

    @property(cc.Node)
    boxLeft: cc.Node = null;
    @property(cc.Node)
    boxRight: cc.Node = null;
    @property([ItemGameLive])
    arrItem: ItemGameLive[] = [];
    @property(cc.Node)
    dropFrom: cc.Node = null;
    @property(cc.Node)
    dropTo: cc.Node = null;
    @property(cc.EditBox)
    editMoney: cc.EditBox = null;
    @property(cc.Label)
    txtTotalMoney: cc.Label = null;
  
    private balanceAG = 0;
    private balanceIBC = 0;
    private balanceWM = 0;
    private balanceCMD = 0;
    private totalMoney = 0;
    onLoad() {
        _this = this;
    }
    show() {
        this.editMoney.tabIndex = -1;
        this.boxLeft.opacity = 0;
        this.boxLeft.position = new cc.Vec3(0, 200, 0);
        cc.Tween.stopAllByTarget(this.boxLeft);
        cc.tween(this.boxLeft)
            .to(0.5, { position: cc.v3(0, 0, 0), opacity: 255 }, { easing: "backOut" })
            .start();

        this.boxRight.opacity = 0;
        this.boxRight.position = new cc.Vec3(0, -200, 0);
        cc.Tween.stopAllByTarget(this.boxRight);
        cc.tween(this.boxRight)
            .to(0.5, { position: cc.v3(0, 0, 0), opacity: 255 }, { easing: "backOut" })
            .start();

        this.dropFrom = this.dropFrom.getComponent("DropDown");
        this.dropTo = this.dropTo.getComponent("DropDown");
        this.editMoney.string = "";
        this.initDropFrom();
        this.initDropTo();
        this.totalMoney = 0;
        this.totalMoney += Configs.Login.Coin;
        this.updateTotalMoney();
        this.node.active = true;

        for (var i = 0; i < this.arrItem.length; i++) {
            this.arrItem[i].show();
        }
        this.arrItem[0].updateData(Configs.Login.Coin);
        this.updateInfoAG(true);
        this.updateInfoIBC(true);
        this.updateInfoWM(true);
        this.updateInfoCMD(true);
    }

   

    updateInfoAG(isUpdateTotal = false) {
        Http.get(App.API_AG, { t: "GetBalance", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
             ////Utils.Log("updateInfoAg:"+JSON.stringify(res));
            if (res["res"] == 0) {
                if(res["list"][0]["info"] == "error"){
                    _this.arrItem[1].maintain();
                    
                }
                else{
                    _this.arrItem[1].updateData(res.list[0]["info"]);
                    _this.balanceAG =  parseInt(res.list[0]["info"]) * 1000;
                    if (isUpdateTotal == true) {
                        _this.totalMoney += parseInt(res.list[0]["info"]) * 1000;
                        _this.updateTotalMoney();
                    }
                }

            }
            else {
                _this.arrItem[1].maintain();
            }
        });
    }

    updateInfoIBC(isUpdateTotal = false) {
        Http.get(App.API_IBC, { t: "CheckBalance", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
             ////Utils.Log("updateInfoICB:"+JSON.stringify(res));
            if (res["code"] == 0) {
                _this.arrItem[2].updateData(res["data"]["balance"]);
                _this.balanceIBC = parseInt(res["data"]["balance"]) * 1000;

                if (isUpdateTotal == true) {
                    _this.totalMoney += parseInt(res["data"]["balance"]) * 1000;
                    _this.updateTotalMoney();
                }
            }
            else {
                _this.arrItem[2].maintain();
               
            }


        });
    }

    updateInfoWM(isUpdateTotal = false) {
        Http.get(App.API_WM, { t: "CheckBalance", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
             ////Utils.Log("updateInfoWM:"+JSON.stringify(res));
            if (res["list"][0] == 0) {
                _this.arrItem[3].updateData(res["list"][1]);
                _this.balanceWM =  parseInt(res["list"][1]) * 1000;
                if (isUpdateTotal == true) {
                    _this.totalMoney += parseInt(res["list"][1]) * 1000;
                    _this.updateTotalMoney();
                }
            }
            else {
                _this.arrItem[3].maintain();

            }


        });
    }

    updateInfoCMD(isUpdateTotal = false) {
        Http.get(App.API_CMD, { t: "bl", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
             ////Utils.Log("updateInfoCMD:"+JSON.stringify(res));
            if (res["code"] == 0) {
                _this.arrItem[4].updateData(res["data"]["data"][0]["betAmount"]);
                _this.balanceCMD = res["data"]["data"][0]["betAmount"];

                if (isUpdateTotal == true) {
                    _this.totalMoney += res["data"]["data"][0]["betAmount"];
                    _this.updateTotalMoney();
                }
            }
            else {
                // if (res["msg"] != null) {
                //     App.instance.ShowAlertDialog("msg");
                // }
                _this.arrItem[4].maintain();
            }


        });
    }

    initDropFrom() {
        var datas = new Array();
        for (let i = 0; i < ListGame.length; i++) {
            datas.push({ optionString: ListGame[i] });
        }
        this.dropFrom.clearOptionDatas();
        this.dropFrom.addOptionDatas(datas);
        this.dropFrom.selectedIndex = 0;
    }

    initDropTo() {
        var datas = new Array();
        for (let i = 0; i < ListGame.length; i++) {
            datas.push({ optionString: ListGame[i] });
        }
        this.dropTo.clearOptionDatas();
        this.dropTo.addOptionDatas(datas);
        this.dropTo.selectedIndex = 1;
    }

    updateTotalMoney() {
        Tween.numberTo(this.txtTotalMoney, this.totalMoney, 1);
    }

    hide() {
        this.node.active = false;
    }

    onToggleDropTo() {

    }

    onToggleDropFrom() {

    }
    onBtnConfirm() {
         ////Utils.Log("vao day cai ne");
        if (this.dropFrom.labelCaption.string == ListGame[0]) {
            //nap
            var money = Utils.formatEditBox(this.editMoney.string) / 1000;
            if (this.editMoney.string == "") {
                App.instance.ShowAlertDialog("Vui lòng điền đầy đủ thông tin");
                return;
            }

            else if (this.dropFrom.labelCaption.string == this.dropTo.labelCaption.string) {
                App.instance.ShowAlertDialog("Thông tin chưa chính xác! Vui lòng kiểm tra lại");
                return;
            }
            else if (this.dropFrom.selectedIndex != 0 && this.dropTo.selectedIndex != 0) {
                App.instance.ShowAlertDialog("Thông tin chưa chính xác! Vui lòng kiểm tra lại");
            }
            if (this.dropTo.labelCaption.string == ListGame[1]) {
                //ag
                if (money * 1000 > Configs.Login.Coin) {
                    App.instance.ShowAlertDialog("Số dư không đủ!");
                    return;
                }
                 ////Utils.Log("Nap:" + _this.arrItem[0].money + " : " + _this.arrItem[1].money + " : " + money);
                App.instance.showLoading(true);
                Http.get(Configs.App.API_AG, { t: "Deposit", a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
                    App.instance.showLoading(false);
                    if (res["res"] == 0) {
                         ////Utils.Log("Nap AG res:" + JSON.stringify(res));
                        _this.updateInfoAG();
                        _this.arrItem[0].updateData(_this.arrItem[0].money - money * 1000);
                        Configs.Login.Coin -= money * 1000;
                        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                        App.instance.ShowAlertDialog("Nạp Thành Công!");
                    }
                    else {
                        App.instance.ShowAlertDialog(res["msg"]);
                    }


                });
            }
            else if (this.dropTo.labelCaption.string == ListGame[2]) {
                //ibc
                var money = Utils.formatEditBox(this.editMoney.string);
                if (money > Configs.Login.Coin) {
                    App.instance.ShowAlertDialog("Số dư không đủ!");
                    return;
                }
                if (this.editMoney.string == "") {
                    App.instance.ShowAlertDialog("Vui lòng điền đầy đủ thông tin");
                    return;
                }

                else if (this.dropFrom.labelCaption.string == this.dropTo.labelCaption.string) {
                    App.instance.ShowAlertDialog("Thông tin chưa chính xác! Vui lòng kiểm tra lại");
                    return;
                }
                else if (this.dropFrom.selectedIndex != 0 && this.dropTo.selectedIndex != 0) {
                    App.instance.ShowAlertDialog("Thông tin chưa chính xác! Vui lòng kiểm tra lại");
                }
                 ////Utils.Log("Nap:" + _this.arrItem[0].money + " : " + _this.arrItem[2].money + " : " + money);
                App.instance.showLoading(true);
                Http.get(App.API_IBC, { t: "Transfer", d: 1, a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
                    App.instance.showLoading(false);
                     ////Utils.Log("Nap IBC err:" + JSON.stringify(err));
                     ////Utils.Log("Nap IBC res:" + JSON.stringify(res));
                    if (res["code"] == 0) {
                        _this.updateInfoIBC();
                        _this.arrItem[0].updateData(_this.arrItem[0].money - money);
                        Configs.Login.Coin -= money;
                        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                        App.instance.ShowAlertDialog("Nạp Thành Công!");
                    }
                    else {
                        App.instance.ShowAlertDialog(res["message"]);
                    }


                });
            }
            else if (this.dropTo.labelCaption.string == ListGame[3]) {
                //wm
                var money = Utils.formatEditBox(this.editMoney.string);
                if (money > Configs.Login.Coin) {
                    App.instance.ShowAlertDialog("Số dư không đủ!");
                    return;
                }
                if (this.editMoney.string == "") {
                    App.instance.ShowAlertDialog("Vui lòng điền đầy đủ thông tin");
                    return;
                }

                else if (this.dropFrom.labelCaption.string == this.dropTo.labelCaption.string) {
                    App.instance.ShowAlertDialog("Thông tin chưa chính xác! Vui lòng kiểm tra lại");
                    return;
                }
                else if (this.dropFrom.selectedIndex != 0 && this.dropTo.selectedIndex != 0) {
                    App.instance.ShowAlertDialog("Thông tin chưa chính xác! Vui lòng kiểm tra lại");
                }
                 ////Utils.Log("Nap:" + _this.arrItem[0].money + " : " + _this.arrItem[3].money + " : " + money);
                App.instance.showLoading(true);
                Http.get(App.API_WM, { t: "Transfer", d: 1, a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
                    App.instance.showLoading(false);
                     ////Utils.Log("Nap wm err:" + JSON.stringify(err));
                     ////Utils.Log("Nap wm res:" + JSON.stringify(res));
                    if (res["res"] == 0) {
                        _this.updateInfoWM();
                        _this.arrItem[0].updateData(_this.arrItem[0].money - money);
                        Configs.Login.Coin -= money;
                        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                        App.instance.ShowAlertDialog("Nạp Thành Công!");
                    }
                    else {
                        App.instance.ShowAlertDialog(res["msg"]);
                    }


                });
            }
            else if (this.dropTo.labelCaption.string == ListGame[4]) {
                //wm
                var money = Utils.formatEditBox(this.editMoney.string);
                if (money > Configs.Login.Coin) {
                    App.instance.ShowAlertDialog("Số dư không đủ!");
                    return;
                }
                if (this.editMoney.string == "") {
                    App.instance.ShowAlertDialog("Vui lòng điền đầy đủ thông tin");
                    return;
                }
                if (money < 50000) {
                    App.instance.ShowAlertDialog("Chuyển tiền tối thiểu 50.000");
                    return;
                }
                else if (this.dropFrom.labelCaption.string == this.dropTo.labelCaption.string) {
                    App.instance.ShowAlertDialog("Thông tin chưa chính xác! Vui lòng kiểm tra lại");
                    return;
                }
                else if (this.dropFrom.selectedIndex != 0 && this.dropTo.selectedIndex != 0) {
                    App.instance.ShowAlertDialog("Thông tin chưa chính xác! Vui lòng kiểm tra lại");
                }
                 ////Utils.Log("Nap:" + _this.arrItem[0].money + " : " + _this.arrItem[4].money + " : " + money);
                App.instance.showLoading(true);
                Http.get(App.API_CMD, { t: "tf", d: 1, a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
                    App.instance.showLoading(false);
                     ////Utils.Log("Nap cmd err:" + JSON.stringify(err));
                     ////Utils.Log("Nap cmd res:" + JSON.stringify(res));
                    if (res["code"] == 0) {
                        _this.updateInfoCMD();
                        _this.arrItem[0].updateData(_this.arrItem[0].money - money);
                        Configs.Login.Coin -= money;
                        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                        App.instance.ShowAlertDialog("Nạp Thành Công!");
                    }
                    else {
                        App.instance.ShowAlertDialog(res["message"]);
                    }


                });
            }
        }
        else if (this.dropTo.labelCaption.string == ListGame[0]) {
            //rut
            var money = Utils.formatEditBox(this.editMoney.string) / 1000;
            if (this.editMoney.string == "") {
                App.instance.ShowAlertDialog("Vui lòng điền đầy đủ thông tin");
                return;
            }
            
            else if (this.dropFrom.labelCaption.string == this.dropTo.labelCaption.string) {
                App.instance.ShowAlertDialog("Thông tin chưa chính xác! Vui lòng kiểm tra lại");
                return;
            }
            else if (this.dropFrom.selectedIndex != 0 && this.dropTo.selectedIndex != 0) {
                App.instance.ShowAlertDialog("Thông tin chưa chính xác! Vui lòng kiểm tra lại");
            }
            if (this.dropFrom.labelCaption.string == ListGame[1]) {
                 ////Utils.Log("Rut:"+this.balanceAG);
                //ag
                if (money * 1000 > this.balanceAG) {
                    App.instance.ShowAlertDialog("Số dư không đủ!");
                    return;
                }
                App.instance.showLoading(true);
                Http.get(App.API_AG, { t: "Withdraw", a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
                    App.instance.showLoading(false);

                    if (res["res"] == 0) {
                        _this.updateInfoAG();
                        _this.arrItem[0].updateData(_this.arrItem[0].money + money * 1000);
                        Configs.Login.Coin += money * 1000;
                        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                        App.instance.ShowAlertDialog("Rút Thành Công!");
                    }
                    else {
                        App.instance.ShowAlertDialog(res["msg"]);
                    }



                });
            }
            else if (this.dropFrom.labelCaption.string == ListGame[2]) {
                var money = Utils.formatEditBox(this.editMoney.string);
                if (money  > this.balanceIBC) {
                    App.instance.ShowAlertDialog("Số dư không đủ!");
                    return;
                }
                if (this.editMoney.string == "") {
                    App.instance.ShowAlertDialog("Vui lòng điền đầy đủ thông tin");
                    return;
                }

                else if (this.dropFrom.labelCaption.string == this.dropTo.labelCaption.string) {
                    App.instance.ShowAlertDialog("Thông tin chưa chính xác! Vui lòng kiểm tra lại");
                    return;
                }
                else if (this.dropFrom.selectedIndex != 0 && this.dropTo.selectedIndex != 0) {
                    App.instance.ShowAlertDialog("Thông tin chưa chính xác! Vui lòng kiểm tra lại");
                }
                //ibc
                App.instance.showLoading(true);
                Http.get(App.API_IBC, { t: "Transfer", d: 0, a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
                    App.instance.showLoading(false);
                    if (res["code"] == 0) {
                        _this.updateInfoIBC();
                        _this.arrItem[0].updateData(_this.arrItem[0].money + money);
                        Configs.Login.Coin += money;
                        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                        App.instance.ShowAlertDialog("Rút Thành Công!");
                    }
                    else {
                        App.instance.ShowAlertDialog(res["message"]);
                    }



                });
            }
            else if (this.dropFrom.labelCaption.string == ListGame[3]) {
                var money = Utils.formatEditBox(this.editMoney.string);
                if (money  > this.balanceWM) {
                    App.instance.ShowAlertDialog("Số dư không đủ!");
                    return;
                }
                if (this.editMoney.string == "") {
                    App.instance.ShowAlertDialog("Vui lòng điền đầy đủ thông tin");
                    return;
                }

                else if (this.dropFrom.labelCaption.string == this.dropTo.labelCaption.string) {
                    App.instance.ShowAlertDialog("Thông tin chưa chính xác! Vui lòng kiểm tra lại");
                    return;
                }
                else if (this.dropFrom.selectedIndex != 0 && this.dropTo.selectedIndex != 0) {
                    App.instance.ShowAlertDialog("Thông tin chưa chính xác! Vui lòng kiểm tra lại");
                }
                //ibc
                App.instance.showLoading(true);
                Http.get(App.API_WM, { t: "Transfer", d: 0, a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
                    App.instance.showLoading(false);
                     ////Utils.Log("withDraw IBC:" + JSON.stringify(res));
                    if (res["res"] == 0) {
                        _this.updateInfoWM();
                        _this.arrItem[0].updateData(_this.arrItem[0].money + money);
                        Configs.Login.Coin += money;
                        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                        App.instance.ShowAlertDialog("Rút Thành Công!");
                    }
                    else {
                        App.instance.ShowAlertDialog(res["msg"]);
                    }



                });
            }
            else if (this.dropFrom.labelCaption.string == ListGame[4]) {
                var money = Utils.formatEditBox(this.editMoney.string);
                if (money  > this.balanceCMD) {
                    App.instance.ShowAlertDialog("Số dư không đủ!");
                    return;
                }
                if (this.editMoney.string == "") {
                    App.instance.ShowAlertDialog("Vui lòng điền đầy đủ thông tin");
                    return;
                }
                if (money < 50000) {
                    App.instance.ShowAlertDialog("Chuyển tiền tối thiểu 50.000");
                    return;
                }
                else if (this.dropFrom.labelCaption.string == this.dropTo.labelCaption.string) {
                    App.instance.ShowAlertDialog("Thông tin chưa chính xác! Vui lòng kiểm tra lại");
                    return;
                }
                else if (this.dropFrom.selectedIndex != 0 && this.dropTo.selectedIndex != 0) {
                    App.instance.ShowAlertDialog("Thông tin chưa chính xác! Vui lòng kiểm tra lại");
                }
                //ibc
                App.instance.showLoading(true);
                Http.get(App.API_CMD, { t: "tf", d: 0, a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
                    App.instance.showLoading(false);
                     ////Utils.Log("withDraw CMD:" + JSON.stringify(res));
                    if (res["code"] == 0) {
                        _this.updateInfoCMD();
                        _this.arrItem[0].updateData(_this.arrItem[0].money + money);
                        Configs.Login.Coin += money;
                        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                        App.instance.ShowAlertDialog("Rút Thành Công!");
                    }
                    else {
                        App.instance.ShowAlertDialog(res["message"]);
                    }



                });
            }
        }
        else {
            App.instance.ShowAlertDialog("Thông tin chưa chính xác! Vui lòng kiểm tra lại");
            return;
        }


    }

}
