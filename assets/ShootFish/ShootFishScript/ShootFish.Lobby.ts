import Configs from "../../Loading/src/Configs";
import cmd from "../../Lobby/LobbyScript/Lobby.Cmd";
import App from "../../Lobby/LobbyScript/Script/common/App";
import BroadcastReceiver from "../../Lobby/LobbyScript/Script/common/BroadcastReceiver";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import MiniGameNetworkClient from "../../Lobby/LobbyScript/Script/networks/MiniGameNetworkClient";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import ShootFishNetworkClient from "../../Lobby/LobbyScript/Script/networks/ShootFishNetworkClient";
import Play from "./ShootFish.Play";
import PopupCoinTransfer from "./ShootFish.PopupCoinTransfer";
import Http from "../../Loading/src/Http";
import SPUtils from "../../Lobby/LobbyScript/Script/common/SPUtils";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Lobby extends cc.Component {

    public static instance: Lobby = null;

    @property(cc.Node)
    playNode: cc.Node = null;
    @property(cc.Label)
    lblBalance: cc.Label = null;
    @property(PopupCoinTransfer)
    popupCoinTransfer: PopupCoinTransfer = null;

    private play: Play = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Lobby.instance = this;

        this.play = this.playNode.getComponent(Play);
        this.play.node.active = false;

        this.lblBalance.string = Utils.formatNumber(Configs.Login.CoinFish);

        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            this.lblBalance.string = Utils.formatNumber(Configs.Login.CoinFish);
        }, this);

        ShootFishNetworkClient.getInstance().checkConnect((isLogined) => {
            if (!isLogined) {
                App.instance.alertDialog.showMsgWithOnDismissed("Đăng nhập thất bại, vui lòng thử lại.", () => {
                    this.actBack();
                });
                return;
            }
            Play.SERVER_CONFIG = Configs.Login.FishConfigs;
            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

            if (this && this.node && this.node.parent) {
                if (Configs.Login.CoinFish <= 0) {
                    App.instance.confirmDialog.show3("Tiền trong Bắn Cá của bạn đã hết, bạn có muốn chuyển tiền vào không?", "Có", (isConfirm) => {
                        if (isConfirm) {
                            this.popupCoinTransfer.show();
                        }
                    });
                }
            }
        });

        ShootFishNetworkClient.getInstance().addOnClose(() => {
            App.instance.showErrLoading("Mất kết nối, đang thử kết nối lại...");
        }, this);

        MiniGameNetworkClient.getInstance().addListener((data) => {
            let inPacket = new InPacket(data);
            switch (inPacket.getCmdId()) {
                case cmd.Code.GET_MONEY_USE: {
                    let res = new cmd.ResGetMoneyUse(data);
                    Configs.Login.Coin = res.moneyUse;
                    BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                    break;
                }
            }
        }, this);
    }

    actBack() {
        // NetworkClient.getInstance().close();
        cc.audioEngine.stopAll();
        App.instance.loadScene("Lobby");
    }

    actHonors() {

    }

    actRoom1() {
        this.show(false);
        this.play.show(true, 1);
    }

    actRoom2() {
        this.show(false);
        this.play.show(true, 2);
    }
    actLogin(): void {
        let username = Configs.Login.Username;
        let password = Configs.Login.Password;

        App.instance.showLoading(true);
        Http.get(Configs.App.API, { c: 3, un: username, pw: md5(password) }, (err, res) => {
            App.instance.showLoading(false);
            if (err != null) {
                //    App.instance.alertDialog.showMsg("Đăng nhập không thành công, vui lòng kiểm tra lại kết nối.");
                return;
            }
            // console.log(res);
            switch (parseInt(res["errorCode"])) {
                case 0:
                    //    console.log("Đăng nhập thành công.");
                    Configs.Login.AccessToken = res["accessToken"];
                    Configs.Login.SessionKey = res["sessionKey"];
                    Configs.Login.Username = username;
                    Configs.Login.Password = password;
                    Configs.Login.IsLogin = true;
                    var userInfo = JSON.parse(base64.decode(Configs.Login.SessionKey));
                    Configs.Login.Nickname = userInfo["nickname"];
                    Configs.Login.Avatar = userInfo["avatar"];
                    Configs.Login.Coin = userInfo["vinTotal"];
                    Configs.Login.LuckyWheel = userInfo["luckyRotate"];
                    Configs.Login.IpAddress = userInfo["ipAddress"];
                    Configs.Login.CreateTime = userInfo["createTime"];
                    Configs.Login.Birthday = userInfo["birthday"];
                    Configs.Login.Birthday = userInfo["birthday"];
                    Configs.Login.VipPoint = userInfo["vippoint"];
                    Configs.Login.VipPointSave = userInfo["vippointSave"];

                    // MiniGameNetworkClient.getInstance().checkConnect();
                    //    MiniGameNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeJackpots());
                    //    SlotNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeHallSlot());
                    //    ShootFishNetworkClient.getInstance().checkConnect(() => {
                    //        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                    //    });

                    //     this.panelNotLogin.active = false;
                    //    this.panelLogined.active = true;

                    SPUtils.setUserName(Configs.Login.Username);
                    SPUtils.setUserPass(Configs.Login.Password);

                    App.instance.buttonMiniGame.show();
                    //     this.getMailNotRead();

                    BroadcastReceiver.send(BroadcastReceiver.USER_INFO_UPDATED);

                    /* switch (VersionConfig.CPName) {
                        default:
                            this.popupBoomTan.show();
                            break;
                    } */
                    break;
                case 1007:
                    App.instance.alertDialog.showMsg("Thông tin đăng nhập không hợp lệ.");
                    break;
                case 2001:
                    this.popupUpdateNickname.show2(username, password);
                    break;
                default:
                    App.instance.alertDialog.showMsg("Đăng nhập không thành công vui lòng thử lại sau.");
                    break;
            }
        });
    }
    actRoom3() {
        this.show(false);
        this.play.show(true, 3);
    }

    public show(isShow: boolean) {
        this.node.active = isShow;
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
    }
}
