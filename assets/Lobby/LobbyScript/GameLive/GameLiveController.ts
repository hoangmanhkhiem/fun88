import DropDown from "../../../Loading/Add-on/DropDown/Script/DropDown";
import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../Script/common/App";
import BroadcastReceiver from "../Script/common/BroadcastReceiver";
import Tween from "../Script/common/Tween";
import Utils from "../Script/common/Utils";
import ItemGameLive from "./ItemGameLive";

const { ccclass, property } = cc._decorator;
var ListGame = ["Tài khoản chính", "Live Casino AG", "Live Casino EBET", "Live Casino WM", "Thể thao IBC2", "Thể thao SBO", "Bắn Cá"];
var _this = null;
@ccclass
export default class GameLiveController extends cc.Component {

    @property(cc.Node)
    boxLeft: cc.Node = null;
    @property(cc.Node)
    boxRight: cc.Node = null;
    @property([ItemGameLive])
    arrItem: ItemGameLive[] = [];
    @property(DropDown)
    dropFrom: DropDown = null;
    @property(DropDown)
    dropTo: DropDown = null;
    @property(cc.EditBox)
    editMoney: cc.EditBox = null;
    @property(cc.Label)
    txtTotalMoney: cc.Label = null;

    private balanceAG = 0;
    private balanceIBC = 0;
    private balanceWM = 0;
    private balanceSBO = 0;
    private balanceBanca = 0;
    private balanceEBET = 0;
    private totalMoney = 0;
    onLoad() {
        _this = this;
        ListGame = [App.instance.getTextLang("txt_main_account"), "Live Casino AG", "Live Casino EBET", "Live Casino WM", "Thể thao IBC2", "Thể thao SBO", "Bắn Cá"];
    }
    show() {
        this.node.setSiblingIndex(this.node.parent.childrenCount);
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

        // this.dropFrom = this.dropFrom.getComponent("DropDown");
        this.dropTo = this.dropTo.getComponent("DropDown");
        this.editMoney.string = "";
        this.initDropFrom();
        this.initDropTo();
        this.totalMoney = Configs.Login.Coin;
        this.updateTotalMoney();
        this.node.active = true;

        for (var i = 0; i < this.arrItem.length; i++) {
            this.arrItem[i].show();
        }
        this.arrItem[0].updateData(Configs.Login.Coin);
        this.updateInfoAG(true);
        this.updateInfoIBC(true);
        this.updateInfoWM(true);
        this.updateInfoSBO(true);
        this.updateInfBanCa(true);
        this.updateInfoEBET(true);
    }



    updateInfoAG(isUpdateTotal = false) {
        Http.get(App.API_AG, { t: "GetBalance", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
             ////Utils.Log("updateInfoAg:" + JSON.stringify(res));
            if (res["res"] == 0) {
                if (res["list"][0]["info"] == "error") {
                    _this.arrItem[1].maintain();

                }
                else {
                    _this.arrItem[1].updateData(res.list[0]["info"]);
                    _this.balanceAG = parseInt(res.list[0]["info"]) * 1000;
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
             ////Utils.Log("updateInfoICB:" + JSON.stringify(res));
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
             ////Utils.Log("updateInfoWM:" + JSON.stringify(res));
            if (res["list"][0] == 0) {
                _this.arrItem[3].updateData(res["list"][1]);
                _this.balanceWM = parseInt(res["list"][1]) * 1000;
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

    updateInfoSBO(isUpdateTotal = false) {
        Http.get(App.API_SBO, { t: "CheckBalance", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
             ////Utils.Log("updateInfo SBO:" + JSON.stringify(res));
            if (res["res"] == 0) {
                _this.arrItem[4].updateData(res["data"]["balance"] * 1000);
                _this.balanceSBO = res["data"]["balance"] * 1000;

                if (isUpdateTotal == true) {
                    _this.totalMoney += res["data"]["balance"] * 1000;
                    _this.updateTotalMoney();
                }
            }
            else {
                this.arrItem[4].maintain();
            }


        });
    }
    updateInfoEBET(isUpdateTotal = false) {
        Http.get(App.API_EBET, { t: "CheckBalance", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
             ////Utils.Log("updateInfo EBET:" + JSON.stringify(res));
            if (res["res"] == 0) {
                _this.arrItem[6].updateData(res["data"]["money"] * 1000);
                _this.balanceEBET = res["data"]["money"] * 1000;

                if (isUpdateTotal == true) {
                    _this.totalMoney += res["data"]["money"] * 1000;
                    _this.updateTotalMoney();
                }
            }
            else {
                this.arrItem[6].maintain();
            }


        });
    }
    updateInfBanCa(isUpdateTotal = false) {

        Http.get(Configs.App.API, { c: 2025, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => { //check balance 
            App.instance.showLoading(false);
             ////Utils.Log("Res Balance ShootFish:", res);
            if (res["errorCode"] == "0") {
                 ////Utils.Log("check Balance Succes");
                this.arrItem[5].updateData(res.data);
                this.balanceBanca = res.data;
                if (isUpdateTotal == true) {
                    _this.totalMoney += res.data
                    _this.updateTotalMoney();
                }
            } else {
                // App.instance.ShowAlertDialog("Chưa có thông tin số dư\n Vui lòng vào game để tạo tài khoản!");
                this.arrItem[5].updateData(0);
                this.balanceBanca = 0
            }
        })
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
        setTimeout(() => {
            if (this.dropFrom.labelCaption.string == ListGame[0]) {
                //nap
                var money = Utils.formatEditBox(this.editMoney.string) / 1000;
                if (this.editMoney.string == "") {
                    App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                    return;
                }

                else if (this.dropFrom.labelCaption.string == this.dropTo.labelCaption.string) {
                    App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                    return;
                }
                else if (this.dropFrom.selectedIndex != 0 && this.dropTo.selectedIndex != 0) {
                    App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                }
                switch (this.dropTo.labelCaption.string) {
                    case ListGame[1]:
                        if (money * 1000 > Configs.Login.Coin) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
                            return;
                        }
                         ////Utils.Log("Nap:" + _this.arrItem[0].money + " : " + _this.arrItem[1].money + " : " + money);
                        App.instance.showLoading(true);
                        Http.get(App.API_AG, { t: "Deposit", a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
                            App.instance.showLoading(false);
                            if (res["res"] == 0) {
                                 ////Utils.Log("Nap AG res:" + JSON.stringify(res));
                                _this.updateInfoAG();
                                _this.arrItem[0].updateData(_this.arrItem[0].money - money * 1000);
                                Configs.Login.Coin -= money * 1000;
                                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_note_transfer_8"));
                            }
                            else {
                                App.instance.ShowAlertDialog(res["msg"]);
                            }
                        });
                        break;
                    case ListGame[2]:
                        //ebet
                        var money = Utils.formatEditBox(this.editMoney.string);
                        if (money > Configs.Login.Coin) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
                            return;
                        }
                        if (this.editMoney.string == "") {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                            return;
                        }
                        if (money < 50000) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_min_transfer') + "50.000");
                            return;
                        }
                        else if (this.dropFrom.labelCaption.string == this.dropTo.labelCaption.string) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                            return;
                        }
                        else if (this.dropFrom.selectedIndex != 0 && this.dropTo.selectedIndex != 0) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                        }
                         ////Utils.Log("Nap:" + _this.arrItem[0].money + " : " + _this.arrItem[6].money + " : " + money);
                        App.instance.showLoading(true);
                        Http.get(App.API_EBET, { t: "Trans", d: 1, a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
                            App.instance.showLoading(false);
                             ////Utils.Log("Nap EBET err:" + JSON.stringify(err));
                             ////Utils.Log("Nap EBET res:" + JSON.stringify(res));
                            if (res["res"] == 0) {
                                _this.updateInfoEBET();
                                _this.arrItem[0].updateData(_this.arrItem[0].money - money);
                                Configs.Login.Coin -= money;
                                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_note_transfer_8"));
                            }
                            else {
                                App.instance.ShowAlertDialog(res["message"]);
                            }
                        });
                        break;
                    case ListGame[3]:
                        //wm
                        var money = Utils.formatEditBox(this.editMoney.string);
                        if (money > Configs.Login.Coin) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
                            return;
                        }
                        if (this.editMoney.string == "") {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                            return;
                        }

                        else if (this.dropFrom.labelCaption.string == this.dropTo.labelCaption.string) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                            return;
                        }
                        else if (this.dropFrom.selectedIndex != 0 && this.dropTo.selectedIndex != 0) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
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
                                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_note_transfer_8"));
                            }
                            else {
                                App.instance.ShowAlertDialog(res["msg"]);
                            }
                        });
                        break;
                    case ListGame[4]:
                        //

                        var money = Utils.formatEditBox(this.editMoney.string);
                        if (money > Configs.Login.Coin) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
                            return;
                        }
                        if (this.editMoney.string == "") {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                            return;
                        }

                        else if (this.dropFrom.labelCaption.string == this.dropTo.labelCaption.string) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                            return;
                        }
                        else if (this.dropFrom.selectedIndex != 0 && this.dropTo.selectedIndex != 0) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
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
                                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_note_transfer_8"));
                            }
                            else {
                                App.instance.ShowAlertDialog(res["message"]);
                            }
                        });
                        break;
                    case ListGame[5]:
                        //
                        var money = Utils.formatEditBox(this.editMoney.string);
                        if (money > Configs.Login.Coin) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
                            return;
                        }
                        if (this.editMoney.string == "") {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                            return;
                        }
                        if (money < 50000) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_min_transfer') + "50.000");
                            return;
                        }
                        else if (this.dropFrom.labelCaption.string == this.dropTo.labelCaption.string) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                            return;
                        }
                        else if (this.dropFrom.selectedIndex != 0 && this.dropTo.selectedIndex != 0) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                        }
                         ////Utils.Log("Nap:" + _this.arrItem[0].money + " : " + _this.arrItem[4].money + " : " + money);
                        App.instance.showLoading(true);
                        Http.get(App.API_SBO, { t: "Transfer", d: 1, a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
                            App.instance.showLoading(false);
                             ////Utils.Log("Nap SBO err:" + JSON.stringify(err));
                             ////Utils.Log("Nap SBO res:" + JSON.stringify(res));
                            if (res["res"] == 0) {
                                _this.updateInfoSBO();
                                _this.arrItem[0].updateData(_this.arrItem[0].money - money);
                                Configs.Login.Coin -= money;
                                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_note_transfer_8"));
                            }
                            else {
                                App.instance.ShowAlertDialog(res["msg"]);
                            }
                        });


                        break;
                    case ListGame[6]:
                        var money = Utils.formatEditBox(this.editMoney.string);
                        if (money > Configs.Login.Coin) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
                            return;
                        }
                        if (this.editMoney.string == "") {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                            return;
                        }
                        if (money < 50000) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_min_transfer') + "50.000");
                            return;
                        }
                        else if (this.dropFrom.labelCaption.string == this.dropTo.labelCaption.string) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                            return;
                        }
                        else if (this.dropFrom.selectedIndex != 0 && this.dropTo.selectedIndex != 0) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                        }
                         ////Utils.Log("Nap:" + _this.arrItem[0].money + " : " + _this.arrItem[4].money + " : " + money);
                        App.instance.showLoading(true);

                        Http.get(Configs.App.API, { c: 2022, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken, mn: money }, (err, res) => { //nap fish
                            App.instance.showLoading(false);
                             ////Utils.Log("Deposit ShootFish:", res);
                            if (res["errorCode"] == "0") {
                                 ////Utils.Log("Deposit ShootFish Succes");
                                _this.updateInfBanCa();
                                _this.arrItem[0].updateData(_this.arrItem[0].money - money);
                                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_note_transfer_8') + " " + Utils.formatNumber(money));
                                Configs.Login.Coin -= money;
                                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            } else {
                                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_unknown_error1'));
                            }
                        });
                        break;
                }
            }
            else if (this.dropTo.labelCaption.string == ListGame[0]) {
                //rut
                var money = Utils.formatEditBox(this.editMoney.string) / 1000;
                if (this.editMoney.string == "") {
                    App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                    return;
                }

                else if (this.dropFrom.labelCaption.string == this.dropTo.labelCaption.string) {
                    App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                    return;
                }
                else if (this.dropFrom.selectedIndex != 0 && this.dropTo.selectedIndex != 0) {
                    App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                }
                switch (this.dropFrom.labelCaption.string) {
                    case ListGame[1]:
                         ////Utils.Log("Rut:" + this.balanceAG);
                        //ag
                        if (money * 1000 > this.balanceAG) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
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
                                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_note_transfer_9"));
                            }
                            else {
                                App.instance.ShowAlertDialog(res["msg"]);
                            }
                        });
                        break;
                    case ListGame[2]:


                        var money = Utils.formatEditBox(this.editMoney.string);
                         ////Utils.Log("balanceEBET:" + this.balanceEBET);
                        if (money > this.balanceEBET) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
                            return;
                        }
                        if (this.editMoney.string == "") {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                            return;
                        }
                        if (money < 50000) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_min_transfer') + "50.000");
                            return;
                        }
                        else if (this.dropFrom.labelCaption.string == this.dropTo.labelCaption.string) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                            return;
                        }
                        else if (this.dropFrom.selectedIndex != 0 && this.dropTo.selectedIndex != 0) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                        }
                        App.instance.showLoading(true);
                        Http.get(App.API_EBET, { t: "Trans", d: 0, a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
                            App.instance.showLoading(false);
                             ////Utils.Log("withDraw EBET:" + JSON.stringify(res));
                            if (res["res"] == 0) {
                                _this.updateInfoEBET();
                                _this.arrItem[0].updateData(_this.arrItem[0].money + money);
                                Configs.Login.Coin += money;
                                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_note_transfer_9"));
                            }
                            else {
                                App.instance.ShowAlertDialog(res["msg"]);
                            }
                        });
                        break;
                    case ListGame[3]:
                        var money = Utils.formatEditBox(this.editMoney.string);
                        if (money > this.balanceWM) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
                            return;
                        }
                        if (this.editMoney.string == "") {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                            return;
                        }

                        else if (this.dropFrom.labelCaption.string == this.dropTo.labelCaption.string) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                            return;
                        }
                        else if (this.dropFrom.selectedIndex != 0 && this.dropTo.selectedIndex != 0) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
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
                                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_note_transfer_9"));
                            }
                            else {
                                App.instance.ShowAlertDialog(res["msg"]);
                            }
                        });
                        break;
                    case ListGame[4]:
                        var money = Utils.formatEditBox(this.editMoney.string);
                        if (money > this.balanceIBC) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
                            return;
                        }
                        if (this.editMoney.string == "") {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                            return;
                        }

                        else if (this.dropFrom.labelCaption.string == this.dropTo.labelCaption.string) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                            return;
                        }
                        else if (this.dropFrom.selectedIndex != 0 && this.dropTo.selectedIndex != 0) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
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
                                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_note_transfer_9"));
                            }
                            else {
                                App.instance.ShowAlertDialog(res["message"]);
                            }
                        });
                        break;
                    case ListGame[5]:

                        var money = Utils.formatEditBox(this.editMoney.string);
                        if (money > this.balanceSBO) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
                            return;
                        }
                        if (this.editMoney.string == "") {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                            return;
                        }
                        if (money < 50000) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_min_transfer') + "50.000");
                            return;
                        }
                        else if (this.dropFrom.labelCaption.string == this.dropTo.labelCaption.string) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                            return;
                        }
                        else if (this.dropFrom.selectedIndex != 0 && this.dropTo.selectedIndex != 0) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                        }
                        //ibc
                        App.instance.showLoading(true);
                        Http.get(App.API_SBO, { t: "Transfer", d: 0, a: money, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken }, (err, res) => {
                            App.instance.showLoading(false);
                             ////Utils.Log("withDraw SBO:" + JSON.stringify(res));
                            if (res["res"] == 0) {
                                _this.updateInfoSBO();
                                _this.arrItem[0].updateData(_this.arrItem[0].money + money);
                                Configs.Login.Coin += money;
                                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_note_transfer_9"));
                            }
                            else {
                                App.instance.ShowAlertDialog(res["msg"]);
                            }
                        });


                        break;
                    case ListGame[6]:
                        var money = Utils.formatEditBox(this.editMoney.string);
                        if (money > this.balanceBanca) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
                            return;
                        }
                        if (this.editMoney.string == "") {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                            return;
                        }
                        if (money < 50000) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_min_transfer') + "50.000");
                            return;
                        }
                        else if (this.dropFrom.labelCaption.string == this.dropTo.labelCaption.string) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                            return;
                        }
                        else if (this.dropFrom.selectedIndex != 0 && this.dropTo.selectedIndex != 0) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                        }
                        App.instance.showLoading(true);
                        Http.get(Configs.App.API, { c: 2023, nn: Configs.Login.Nickname, at: Configs.Login.AccessToken, mn: money }, (err, res) => { //rut
                            App.instance.showLoading(false);
                             ////Utils.Log("WithDraw ShootFish:", res);
                            if (res["errorCode"] == "0") {
                                 ////Utils.Log("Withdraw Succes");
                                _this.updateInfBanCa();
                                _this.arrItem[0].updateData(_this.arrItem[0].money + money);
                                Configs.Login.Coin += money;
                                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_note_transfer_9') + Utils.formatNumber(money) + "\n" + App.instance.getTextLang('txt_note_transfer_10'));
                            } else {
                                App.instance.ShowAlertDialog(App.instance.getTextLang('txt_unknown_error1'));
                            }
                        });
                        break;
                }
            }
            else {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                return;
            }
        }, 300)
    }

}
