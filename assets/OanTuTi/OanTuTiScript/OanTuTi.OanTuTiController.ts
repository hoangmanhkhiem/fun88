import Configs from "../../Loading/src/Configs";
import MiniGame from "../../Lobby/LobbyScript/MiniGame";
import App from "../../Lobby/LobbyScript/Script/common/App";
import BroadcastReceiver from "../../Lobby/LobbyScript/Script/common/BroadcastReceiver";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import ShootFishNetworkClient from "../../Lobby/LobbyScript/Script/networks/ShootFishNetworkClient";
import PopupCoinTransfer from "./OanTuTi.PopupCoinTransfer";
import Http from "../../Loading/src/Http";
import SPUtils from "../../Lobby/LobbyScript/Script/common/SPUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class OanTuTiController extends MiniGame {

    @property(cc.Label)
    public lblCoin: cc.Label = null;
    @property(cc.Label)
    public lblBet: cc.Label = null;
    @property([cc.Button])
    public btnBets: cc.Button[] = [];
    @property(cc.Button)
    public btnPlayNow: cc.Button = null;

    @property(cc.Node)
    public panelSelectBet: cc.Node = null;

    @property(cc.Node)
    public players: cc.Node = null;
    @property(cc.Node)
    public mePlayer: cc.Node = null;
    @property(cc.Node)
    public otherPlayer: cc.Node = null;

    @property(cc.Node)
    public panelSearchingMatch: cc.Node = null;
    @property(cc.Node)
    public panelPlaying: cc.Node = null;
    @property(cc.Node)
    public panelResult: cc.Node = null;

    //searching
    @property(cc.Label)
    public lblSearching: cc.Label = null;
    @property(cc.Button)
    public btnCancel: cc.Button = null;

    //playing
    @property(cc.Label)
    public lblTime: cc.Label = null;
    @property(cc.Sprite)
    public progressTime: cc.Sprite = null;
    @property([cc.Button])
    public btnPlays: cc.Button[] = [];
    @property([cc.SpriteFrame])
    public sprPlaysActive: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame])
    public sprPlaysNormal: cc.SpriteFrame[] = [];

    //result
    @property([cc.SpriteFrame])
    public sprResults: cc.SpriteFrame[] = [];

    @property(cc.Toggle)
    public toggleAuto: cc.Toggle = null;

    @property([cc.Node])
    public popups: cc.Node[] = [];

    @property(PopupCoinTransfer)
    public popupCoinTransfer: PopupCoinTransfer = null;

    private readonly listBet = [1000, 5000, 10000, 50000, 100000];
    private readonly timePlaying = 10;
    private remainTime = 0;
    private lastBetValue = 0;
    private isPlaying = false;

    start() {
        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            if (!this.node.active) return;
            this.lblCoin.string = Utils.formatNumber(Configs.Login.CoinFish);
        }, this);
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

        ShootFishNetworkClient.getInstance().addListener((route, push) => {
            if (!this.node.active) return;
            let routesLog = ["OttOnMatching", "OttOnMatchStart", "OttOnMatchEnd", "OttOnMatchSolved"];
            if (routesLog.indexOf(route) >= 0) {
           //     console.log(route);
           //     console.log(push);
            }
            switch (route) {
                case "OttOnMatching": {
                    let otherNickname = "";
                    let otherAvatar = "";
                    if (push["userId1"] == Configs.Login.UserIdFish) {
                        otherNickname = push["nickname2"];
                        otherAvatar = push["avatar2"];
                    } else {
                        otherNickname = push["nickname1"];
                        otherAvatar = push["avatar1"];
                    }

                    this.panelSelectBet.active = false;
                    this.panelPlaying.active = false;
                    this.players.active = true;

                    this.lblSearching.string = "ĐÃ TÌM THẤY ĐỐI THỦ";
                    this.btnCancel.node.active = false;

                    this.otherPlayer.active = true;
                    this.otherPlayer.getChildByName("lblNickname").getComponent(cc.Label).string = otherNickname;
                    this.otherPlayer.getChildByName("sprAvatar").getComponent(cc.Sprite).spriteFrame = App.instance.getAvatarSpriteFrame(otherAvatar);

                    this.lblBet.string = "CƯỢC: " + (Math.floor(push["blind"] / 1000)) + "K";
                }
                    break;
                case "OttOnMatchStart": {
                    this.panelSearchingMatch.active = false;
                    this.panelPlaying.active = true;
                    this.panelResult.active = false;
                    this.players.active = true;

                    this.remainTime = this.timePlaying;
                    this.lblTime.node.parent.active = true;
                    this.progressTime.fillRange = 1;

                    for (let i = 0; i < this.btnPlays.length; i++) {
                        this.btnPlays[i].interactable = true;
                        this.btnPlays[i].getComponent(cc.Sprite).spriteFrame = this.sprPlaysActive[i];
                    }
                }
                    break;
                case "OttOnMatchEnd": {
                    let result: number = push["result"];///result: 0: hoà, 1: player1 thắng, 2: player2 thắng
                    let changeCash1: number = push["changeCash1"];
                    let changeCash2: number = push["changeCash2"];
                    let blind: number = push["blind"];

                    let lblWin = this.panelResult.getChildByName("lblWin");
                    let lblLose = this.panelResult.getChildByName("lblLose")

                    if (push["userId1"] == Configs.Login.UserIdFish) {
                        if (result != 0) {
                            if (result == 1) {
                                lblWin.getComponent(cc.Label).string = "+" + Utils.formatNumber(changeCash1);
                            } else {
                                lblLose.getComponent(cc.Label).string = Utils.formatNumber(-blind);
                            }
                        }
                        Configs.Login.CoinFish = push["cash1"];
                    } else {
                        if (result != 0) {
                            if (result == 2) {
                                lblWin.getComponent(cc.Label).string = "+" + Utils.formatNumber(changeCash2);
                            } else {
                                lblLose.getComponent(cc.Label).string = Utils.formatNumber(-blind);
                            }
                        }
                        Configs.Login.CoinFish = push["cash2"];
                    }
                    BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

                    this.scheduleOnce(() => {
                        this.resetView();
                        if (this.toggleAuto.isChecked) {
                            this.selectBet(this.lastBetValue);
                        } else {
                            this.isPlaying = false;
                        }
                    }, 5);
                }
                case "OttOnMatchSolved": {
                    this.panelResult.active = true;
                    this.lblTime.node.parent.active = false;

                    let result: number = push["result"]; ///result: 0: hoà, 1: player1 thắng, 2: player2 thắng
                    let choice1: number = push["choice1"];
                    let choice2: number = push["choice2"];

                    let meValue = this.panelResult.getChildByName("meValue");
                    let otherValue = this.panelResult.getChildByName("otherValue");
                    let meActive = meValue.getChildByName("active");
                    let otherActive = otherValue.getChildByName("active");

                    let lblWin = this.panelResult.getChildByName("lblWin");
                    lblWin.active = false;
                    let lblLose = this.panelResult.getChildByName("lblLose")
                    lblLose.active = false;
                    let hoa = this.panelResult.getChildByName("hoa");
                    hoa.active = false;
                    let thang = this.panelResult.getChildByName("thang");
                    thang.active = false;
                    let thua = this.panelResult.getChildByName("thua");
                    thua.active = false;

                    if (push["userId1"] == Configs.Login.UserIdFish) {
                        meValue.getComponent(cc.Sprite).spriteFrame = this.sprResults[choice1];
                        otherValue.getComponent(cc.Sprite).spriteFrame = this.sprResults[choice2];
                        for (let i = 0; i < this.btnPlays.length; i++) {
                            this.btnPlays[i].interactable = false;
                            this.btnPlays[i].getComponent(cc.Sprite).spriteFrame = choice1 == i ? this.sprPlaysActive[i] : this.sprPlaysNormal[i];
                        }

                        if (result == 0) {
                            hoa.active = true;
                            hoa.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
                            meActive.active = true;
                            otherActive.active = true;
                        } else {
                            if (result == 1) {
                                thang.active = true;
                                thang.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
                                lblWin.active = true;
                                meActive.active = true;
                                otherActive.active = false;
                            } else {
                                thua.active = true;
                                thua.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
                                lblLose.active = true;
                                meActive.active = false;
                                otherActive.active = true;
                            }
                        }
                    } else {
                        meValue.getComponent(cc.Sprite).spriteFrame = this.sprResults[choice2];
                        otherValue.getComponent(cc.Sprite).spriteFrame = this.sprResults[choice1];
                        for (let i = 0; i < this.btnPlays.length; i++) {
                            this.btnPlays[i].interactable = false;
                            this.btnPlays[i].getComponent(cc.Sprite).spriteFrame = choice2 == i ? this.sprPlaysActive[i] : this.sprPlaysNormal[i];
                        }

                        if (result == 0) {
                            hoa.active = true;
                            hoa.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
                            meActive.active = true;
                            otherActive.active = true;
                        } else {
                            if (result == 2) {
                                thang.active = true;
                                thang.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
                                lblWin.active = true;
                                meActive.active = true;
                                otherActive.active = false;
                            } else {
                                thua.active = true;
                                thua.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
                                lblLose.active = true;
                                meActive.active = false;
                                otherActive.active = true;
                            }
                        }
                    }
                    break;
                }
            }
        }, this);

        for (let i = 0; i < this.btnBets.length; i++) {
            this.btnBets[i].node.on("click", () => {
                this.selectBet(this.listBet[i]);
            });
        }
        for (let i = 0; i < this.btnPlays.length; i++) {
            this.btnPlays[i].node.on("click", () => {
                this.play(i);
            });
        }
    }

    update(dt: number) {
        if (this.remainTime > 0) {
            this.remainTime = Math.max(0, this.remainTime - dt);
            let t = Math.round(this.remainTime);
            this.lblTime.string = (t > 9 ? "" : "0") + t;
            this.progressTime.fillRange = this.remainTime / this.timePlaying;
        }
    }

    show() {
        if (this.node.active) {
            this.reOrder();
            return;
        }
        super.show();
        this.toggleAuto.isChecked = false;
        this.resetView();
    }

    _onShowed() {
        super._onShowed();
        ShootFishNetworkClient.getInstance().checkConnect((isLogined) => {
            if (!this.node.active) return;
            if (!isLogined) {
                this.dismiss();
                return;
            }
            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
            if (Configs.Login.CoinFish <= 0) {
                App.instance.confirmDialog.show3("Tiền trong game của bạn đã hết, bạn có muốn chuyển tiền vào không?", "Có", (isConfirm) => {
                    if (isConfirm) {
                        this.popupCoinTransfer.show();
                    }
                });
            }
        });
    }
actBack() {
	if (this.isPlaying) {
            App.instance.alertDialog.showMsg("Bạn đang chơi không thể thoát.");
            return;
        }
        // NetworkClient.getInstance().close();
        cc.audioEngine.stopAll();
        App.instance.loadScene("Lobby");
    }
	actLogin(): void {
           let username = Configs.Login.Username;
            let password = Configs.Login.Password;

            App.instance.showLoading(true);
            Http.get(Configs.App.API, { c: 3, un: username, pw: md5(password) }, (err, res) => {
                App.instance.showLoading(false);
                if (err != null) {
                    App.instance.alertDialog.showMsg("Đăng nhập không thành công, vui lòng kiểm tra lại kết nối.");
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
    dismiss() {
        if (this.isPlaying) {
            App.instance.alertDialog.showMsg("Bạn đang chơi không thể thoát.");
            return;
        }
        super.dismiss();
        for (let i = 0; i < this.popups.length; i++) {
            this.popups[i].active = false;
        }
    }

    private resetView() {
        this.lblBet.string = "CHỌN CƯỢC";

        this.panelSelectBet.active = true;
        this.panelPlaying.active = false;
        this.panelResult.active = false;
        this.players.active = false;
        this.panelSearchingMatch.active = false;

        this.mePlayer.active = true;
        this.mePlayer.getChildByName("sprAvatar").getComponent(cc.Sprite).spriteFrame = App.instance.getAvatarSpriteFrame(Configs.Login.Avatar);

        this.otherPlayer.active = false;
        this.otherPlayer.getChildByName("lblNickname").getComponent(cc.Label).string = "";
        this.interactableBtnBets(true);
    }

    public playNow() {
        this.selectBet(0);
    }

    private selectBet(betValue: number) {
        this.interactableBtnBets(false);
        this.isPlaying = true;
    //    console.log("betValue: " + betValue);
        ShootFishNetworkClient.getInstance().request("OTT1", {
            "userId": Configs.Login.UserIdFish,
            "nickname": Configs.Login.Nickname,
            "blind": betValue
        }, (res) => {
            if (res["code"] != 200) {
                switch (res["code"]) {
                    case 302:
                        App.instance.alertDialog.showMsg("Số dư không đủ.");
                        break;
                    default:
                        App.instance.alertDialog.showMsg("Lỗi " + res["code"] + ", không xác định.");
                        break;
                }
                this.interactableBtnBets(true);
                this.isPlaying = false;
                return;
            }
            this.lastBetValue = betValue;

            if (betValue <= 0) {
                this.lblBet.string = "CƯỢC: __";
            } else {
                let value = Math.floor(betValue / 1000);
                this.lblBet.string = "CƯỢC: " + Utils.formatNumber(value) + "K";
            }

            this.panelSelectBet.active = false;
            this.panelSearchingMatch.active = true;
            this.players.active = true;

            this.lblSearching.string = "ĐANG TÌM KIẾM ĐỐI THỦ...";
            this.btnCancel.node.active = true;
        }, this);
    }

    ///selectValue: 0: kéo, 1: bao, 2: búa
    private play(selectValue: number) {
        ShootFishNetworkClient.getInstance().request("OTT2", {
            "userId": Configs.Login.UserIdFish,
            "choice": selectValue
        }, (res) => {
       //     console.log(res);
            if (res["code"] != 200) {
                App.instance.alertDialog.showMsg("Lỗi " + res["code"] + ", không xác định.");
                this.interactableBtnBets(true);
                return;
            }
            for (let i = 0; i < this.btnPlays.length; i++) {
                this.btnPlays[i].interactable = false;
                this.btnPlays[i].getComponent(cc.Sprite).spriteFrame = i == selectValue ? this.sprPlaysActive[i] : this.sprPlaysNormal[i];
            }
        }, this);
    }

    private interactableBtnBets(enabled: boolean) {
        for (let i = 0; i < this.btnBets.length; i++) {
            this.btnBets[i].interactable = enabled;
        }
        this.btnPlayNow.interactable = enabled;
    }

    public actCancel() {
        ShootFishNetworkClient.getInstance().request("OTT11", {
        }, (res) => {
            if (res["code"] != 200) {
                App.instance.alertDialog.showMsg("Lỗi " + res["code"] + ", không xác định.");
                return;
            }
            this.resetView();
            this.isPlaying = false;
        }, this);
    }
}
