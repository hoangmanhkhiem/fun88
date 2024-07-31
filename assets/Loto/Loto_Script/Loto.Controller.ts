import ShootFishNetworkClient from "../../Lobby/LobbyScript/Script/networks/ShootFishNetworkClient";
import Configs from "../../Loading/src/Configs";
import App from "../../Lobby/LobbyScript/Script/common/App";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import BroadcastReceiver from "../../Lobby/LobbyScript/Script/common/BroadcastReceiver";
import cmd from "./Loto.Cmd";
import Http from "../../Loading/src/Http";
const { ccclass, property } = cc._decorator;
import MiniGameNetworkClient from "../../Lobby/LobbyScript/Script/networks/MiniGameNetworkClient";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import SPUtils from "../../Lobby/LobbyScript/Script/common/SPUtils";
@ccclass
export default class LotoController extends cc.Component {

    public static instance: LotoController = null;

    @property(cc.Label)
    labelUserGold: cc.Label = null;

    // Mode
    @property(cc.Node)
    currentMode: cc.Node = null;
    @property(cc.Node)
    listModes: cc.Node = null;
    @property(cc.Node)
    contentMode: cc.Node = null;
    @property(cc.Label)
    labelGameGuide: cc.Label = null;

    // Location
    @property(cc.Toggle)
    listLocation: cc.Toggle[] = [];

    // Flex
    @property(cc.Toggle)
    listTabs: cc.Toggle[] = [];
    @property(cc.Node)
    contentTabs: cc.Node = null;
    @property(cc.EditBox)

    edtChatInput: cc.EditBox = null;
    @property(cc.Node)
    contentChat: cc.Node = null;
    @property(cc.Prefab)
    prefabItemChat: cc.Prefab = null;
    @property(cc.ScrollView)
    scrollChat: cc.ScrollView = null;

    @property(cc.Node)
    contentNewBet: cc.Node = null;
    @property(cc.Prefab)
    prefabItemNewBet: cc.Prefab = null;
    @property(cc.ScrollView)
    scrollNewBet: cc.ScrollView = null;

    @property([cc.Label])
    labelTabResult: cc.Label[] = [];

    // Choose Channel
    @property(cc.Label)
    betDate: cc.Label = null;
    @property(cc.Label)
    currentBetChannel: cc.Label = null;
    @property(cc.Node)
    btnBetChannel: cc.Node = null;
    @property(cc.Node)
    betChannel: cc.Node = null;
    @property(cc.Node)
    contentBetChannel: cc.Node = null;
    @property(cc.Prefab)
    prefabItemChannel: cc.Prefab = null;
    @property(cc.ScrollView)
    scrollBetChannel: cc.ScrollView = null;

    @property(cc.Node)
    btnTabResultChannel: cc.Node = null;
    @property(cc.Label)
    tabResultDate: cc.Label = null;
    @property(cc.Label)
    currentTabResultChannel: cc.Label = null;

    @property(cc.Node)
    btnPopupResultChannel: cc.Node = null;
    @property(cc.Label)
    popupResultDate: cc.Label = null;
    @property(cc.Label)
    currentPopupResultChannel: cc.Label = null;

    @property(cc.Node)
    btnCancelChangeChannel: cc.Node = null;

    // Number Selector
    @property(cc.Node)
    numberSelector: cc.Node = null;
    @property(cc.Node)
    contentNumSelector: cc.Node = null;
    @property(cc.Prefab)
    prefabItemNumber: cc.Prefab = null;
    @property(cc.ScrollView)
    scrollNumSelector: cc.ScrollView = null;
    @property(cc.Node)
    btnOpenNumberSelector: cc.Node = null;
    @property(cc.Node)
    contentDescMode: cc.Node = null;

    // Number Picked
    @property(cc.Node)
    contentNumPicked: cc.Node = null;
    @property(cc.Prefab)
    prefabItemNumberPicked: cc.Prefab = null;
    @property(cc.ScrollView)
    scrollNumPicked: cc.ScrollView = null;
    @property(cc.EditBox)
    edtBet: cc.EditBox = null;
    @property(cc.Label)
    labelTotalBet: cc.Label = null;
    @property(cc.Label)
    labelWinValue: cc.Label = null;

    // Popup
    @property(cc.Node)
    popupHistory: cc.Node = null;
    @property(cc.Node)
    contentHistory: cc.Node = null;
    @property(cc.Prefab)
    prefabItemHistory: cc.Prefab = null;

    @property(cc.Node)
    popupResult: cc.Node = null;
    @property([cc.Label])
    labelResult: cc.Label[] = [];
    @property(cc.Node)
    contentTime: cc.Node = null;

    @property(cc.Node)
    popupNotify: cc.Node = null;
    @property(cc.Label)
    labelMsg: (cc.Label) = null;

    // Music
    @property({ type: cc.AudioClip })
    musicBackground: cc.AudioClip = null;


    private sessionDate = "";
    private today = "";

    // Constant
    private GAME_MODE = 1;
    private GAME_LOCATION = 0;
    private GAME_CHANNEL = 1;

    private currentNumPicked = [];
    private currentBetValue = 0; //K
    private currentWinValue = 0; //K

    private numRequest = 0;
    private numRequestCompleted = 0;

    private numRequired = 0;

    private musicSlotState = null;
    private remoteMusicBackground = null;

    private helpCenter = [];
    private currentGameHelp = "";

    private channelsOpen = [];
    private modesOpen = [];

    private arrDates = null;
    private popupResultCurrentChannelId = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        LotoController.instance = this;
        this.sessionDate = "";
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        this.sessionDate += "" + year;
        this.sessionDate += month < 10 ? "0" + month : month;
        this.sessionDate += day < 10 ? "0" + day : day;

        this.today = (day < 10 ? "0" + day : day) + "/" + (month < 10 ? "0" + month : month) + "/" + year;
        //    cc.log(this.sessionDate);

        //   cc.log("UserId : ", Configs.Login.UserId);
        //   cc.log("SessionKey : ", Configs.Login.SessionKey);
        //   cc.log("UserIdFish : ", Configs.Login.UserIdFish);
        //   cc.log("CoinFish : ", Configs.Login.CoinFish);

        // setup arrDates
        let today = new Date();
        this.arrDates = [today];
        for (let index = 1; index < 7; index++) {
            let yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - index);
            this.arrDates.push(yesterday);
        }


        ShootFishNetworkClient.getInstance().checkConnect((isLogined) => {
            if (!isLogined) {
                App.instance.alertDialog.showMsgWithOnDismissed("Đăng nhập thất bại, vui lòng thử lại.", () => {
                    this.actBack();
                });
                return;
            }
            //    Play.SERVER_CONFIG = Configs.Login.FishConfigs;
            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
            if (this && this.node && this.node.parent) {
                if (Configs.Login.CoinFish <= 0) {
                    App.instance.confirmDialog.show3("Tiền trong Lô Đề của bạn đã hết, bạn có muốn chuyển tiền vào không?", "Có", (isConfirm) => {
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

    start() {
        // musicSave :   0 == OFF , 1 == ON
        var musicSave = cc.sys.localStorage.getItem("musicLoto");
        if (musicSave != null) {
            this.musicSlotState = parseInt(musicSave);
        } else {
            this.musicSlotState = 1;
            cc.sys.localStorage.setItem("musicLoto", "1");
        }

        if (this.musicSlotState == 1) {
            this.remoteMusicBackground = cc.audioEngine.playMusic(this.musicBackground, true);
        }

        this.initNumSelector(1000);

        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            this.labelUserGold.string = Utils.formatNumber(Configs.Login.CoinFish);
        }, this);
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

        ShootFishNetworkClient.getInstance().addListener((route, push) => {
            //    cc.log("LOTO route : ", route);
            //   cc.log("LOTO push : ", push);
            switch (route) {
                case "onLOTO1":
                    //     cc.log("Loto LOTO1 push : ", push);
                    let itemNewBet = cc.instantiate(this.prefabItemNewBet);
                    itemNewBet.getComponent('Loto.ItemNewBet').initItem({
                        nickname: push["nickname"],
                        channel: push["channel"],
                        mode: push["mode"],
                        bet: push["cost"],
                        nums: push["number"]
                    });
                    this.contentNewBet.addChild(itemNewBet);
                    this.scrollNewBet.scrollToBottom(0.2);
                    break;
                case "LOTO2":
                    //     cc.log("Loto LOTO2 push : ", push);
                    break;
                case "LOTO3":
                    //    cc.log("Loto LOTO3 push : ", push);
                    break;
                case "LOTO4":
                    //    cc.log("Loto LOTO4 push : ", push);
                    break;
                case "LOTO5":
                    //    cc.log("Loto LOTO5 push : ", push);
                    break;
                case "LOTO6":
                    //   cc.log("Loto LOTO6 push : ", push);
                    break;
                case "onLOTO7":
                    //    cc.log("Loto LOTO7 push : ", push);
                    let itemNewChat = cc.instantiate(this.prefabItemChat);
                    itemNewChat.getComponent('Loto.ItemChat').initItem({
                        nickname: push["nickname"],
                        msg: push["msg"],
                    });
                    this.contentChat.addChild(itemNewChat);
                    this.scrollChat.scrollToBottom(0.2);
                    break;
                case "LOTO8":
                    //    cc.log("Loto LOTO8 push : ", push);
                    break;
                case "LOTO9":
                    //   cc.log("Loto LOTO9 push : ", push);
                    break;
                default:
                    break;
            }
        }, this);

        // ShootFishNetworkClient.getInstance().checkConnect((isLogined) => {
        //     if (!isLogined) {
        //         // this.dismiss();
        //         return;
        //     }
        //     BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

        //     if (Configs.Login.CoinFish <= 0) {
        //         App.instance.confirmDialog.show3("Tiền trong Bắn Cá của bạn đã hết, bạn có muốn chuyển tiền vào không?", "Có", (isConfirm) => {
        //             if (isConfirm) {
        //                 // this.popupCoinTransfer.show();
        //             }
        //         });
        //     }
        // });

        // Chat
        this.listTabs[0].isChecked = true;
        this.contentTabs.children[0].active = true;
        this.requestGetChatHistory();
        this.requestGetNewBetHistory();

        // Mode
        App.instance.showLoading(true);
        this.requestGetGameAvailable();
        this.betDate.string = this.today;

        // Lay ket qua cac lan danh truoc xem hom nay co an dc gi k
        this.requestGetCalculateResult();

        this.onBetChannelSelected(0, 1);
        this.changeMode(null, 1);
    }


    // action
    showListMode() {
        this.listModes.active = !this.listModes.active;
        this.listModes.parent.children[2].angle = this.listModes.active ? 0 : 180;
    }

    changeMode(event, groupId) {
        var groupMode = parseInt(groupId);
        //   cc.log("Loto changeMode groupMode : ", groupMode);
        this.listModes.active = false;
        this.listModes.parent.children[2].angle = 180;

        let modeName = this.listModes.children[groupMode - 1].children[0].getComponent(cc.Label).string;
        this.currentMode.children[1].getComponent(cc.Label).string = modeName;

        this.resetContentModeState();
        this.contentMode.children[groupMode - 1].active = true;
        this.contentMode.children[groupMode - 1].children[0].getComponent(cc.Toggle).isChecked = true;

        let arrModesInGroup = [];
        switch (groupMode) {
            case 1:
                arrModesInGroup = [1, 2];
                break;
            case 2:
                arrModesInGroup = [3, 4, 5];
                break;
            case 3:
                arrModesInGroup = [6, 7];
                break;
            case 4:
                arrModesInGroup = [8, 9, 10];
                break;
            case 5:
                arrModesInGroup = [11, 12, 13, 14];
                break;
            case 6:
                arrModesInGroup = [17, 24, 25];
                break;
            case 7:
                arrModesInGroup = [18, 19, 20];
                break;
            case 8:
                arrModesInGroup = [21, 22, 23];
                break;
            default:
                break;
        }

        let arrModeAvailableInLocation = [];
        switch (this.GAME_LOCATION) {
            case cmd.Code.LOTO_LOCATION.MienBac:
                arrModeAvailableInLocation = cmd.Code.LOTO_MODE_BAC;
                break;
            case cmd.Code.LOTO_LOCATION.MienTrung:
                arrModeAvailableInLocation = cmd.Code.LOTO_MODE_TRUNG;
                break;
            case cmd.Code.LOTO_LOCATION.MienNam:
                arrModeAvailableInLocation = cmd.Code.LOTO_MODE_NAM;
                break;
            default:
                break;
        }

        // setup Mode in Group
        let nodeMode = this.contentMode.children[groupMode - 1];
        let firstActive = 0;
        let count = -1;
        for (let index = 0; index < arrModesInGroup.length; index++) {
            let findId = arrModeAvailableInLocation.indexOf(arrModesInGroup[index]);
            if (findId != -1) {
                if (count == -1) {
                    firstActive = index;
                }
                count++;
                nodeMode.children[index].active = true;
                // Open
            } else {
                // Block
                nodeMode.children[index].active = false;
            }
        }
        var firstModeInGroup = arrModesInGroup[firstActive];
        if (this.GAME_LOCATION == cmd.Code.LOTO_LOCATION.MienTrung && firstModeInGroup == 11) {
            firstModeInGroup = arrModesInGroup[1];
            this.contentMode.children[groupMode - 1].children[1].getComponent(cc.Toggle).isChecked = true;
        }
        this.chooseMode(null, firstModeInGroup);
    }

    chooseMode(event, modeId) {
        //   cc.log("Loto chooseMode : ", modeId);
        this.GAME_MODE = parseInt(modeId);
        let numCount = -1;
        switch (this.GAME_MODE) {
            // 1 chu so
            case 6:
            case 7:
                numCount = 10;
                break;
            // 2 chu so
            case 1:
            case 3:
            case 4:
            case 5:
            case 8:
            case 9:
            case 10:
            case 15:
            case 16:
            case 17:
            case 21:
            case 22:
            case 23:
            case 24:
            case 25:
                numCount = 100;
                break;
            // 3 chu so
            case 2:
            case 11:
            case 12:
            case 13:
            case 14:
            case 18:
            case 19:
            case 20:
                numCount = 1000;
                break;
            default:
                break;
        }

        this.numRequired = cmd.Code.LOTO_GAME_MODE_NUM_REQUIRE[this.GAME_MODE];
        //   cc.log("Loto chooseMode numRequired : ", this.numRequired);
        this.changeGameGuide();
        this.currentNumPicked = [];
        this.labelTotalBet.string = "0";
        this.edtBet.string = "1";
        //   cc.log("Loto chooseMode numCount : ", numCount);
        this.updateNumSelector(numCount);
        this.requestGetPayWinRate();
    }

    chooseLocation(toggle) {
        var index = this.listLocation.indexOf(toggle);
        //   cc.log("Loto chooseLocation locationId : ", index);
        this.GAME_LOCATION = index;

        let firstChannelInLocation = 0;
        switch (this.GAME_LOCATION) {
            case cmd.Code.LOTO_LOCATION.MienBac:
                this.setupGroup(cmd.Code.LOTO_GROUP_BAC);
                firstChannelInLocation = 1;
                break;
            case cmd.Code.LOTO_LOCATION.MienTrung:
                this.setupGroup(cmd.Code.LOTO_GROUP_TRUNG);
                firstChannelInLocation = 2;
                break;
            case cmd.Code.LOTO_LOCATION.MienNam:
                this.setupGroup(cmd.Code.LOTO_GROUP_NAM);
                firstChannelInLocation = 16;
                break;
            default:
                break;
        }

        this.changeMode(null, 1);
        this.onBetChannelSelected("0", firstChannelInLocation);
    }

    setupGroup(arrGroupAvailable) {
        for (let index = 0; index < this.listModes.childrenCount; index++) {
            let findId = arrGroupAvailable.indexOf(index + 1);
            if (findId != -1) {
                // Open
                this.listModes.children[index].active = true;
            } else {
                // Block
                this.listModes.children[index].active = false;
            }
        }
    }

    actionCancelBet() {
        this.currentNumPicked = [];
        this.labelTotalBet.string = "0";
        this.labelWinValue.string = "" + this.currentWinValue;
        this.edtBet.string = "1";
        this.resetContentNumberPicked();
        this.chooseMode(null, this.GAME_MODE);
    }


    actionSubmitBet() {


        let hourOfDay = new Date().getHours();
        let minOfDay = new Date().getMinutes();
        if ((hourOfDay == 18 && minOfDay > 5) || hourOfDay >= 19) {
            let msg_1 = "Hết thời gian đặt cược.\nThời gian đặt cược từ 0h tới 18h05.";
            this.showPopupNotify(msg_1);
            return;
        }



        // kiem tra so luong so can danh cua mode do
        if (this.numRequired == 1) {
            if (this.currentNumPicked.length < 1) {
                let msg_3 = "Bạn cần chọn ít nhất 1 số !";
                this.showPopupNotify(msg_3);
                return;
            }
        } else {
            if (this.currentNumPicked.length !== this.numRequired) {
                let msg_3 = "Bạn cần chọn " + this.numRequired + " số !";
                this.showPopupNotify(msg_3);
                return;
            }
        }
        if (this.currentBetValue == 0) {
            this.showPopupNotify("Vui Lòng Chọn Lại Đài Miền Bắc");
            return;
        }

        let totalBet = 0;
        let betOneTurn = parseInt(this.edtBet.string) * 1000;
        if (this.numRequired == 1) {
            totalBet = betOneTurn * this.currentBetValue * this.currentNumPicked.length;
        } else {
            totalBet = betOneTurn * this.currentBetValue;
        }
        //    cc.log("Loto actionSubmitBet totalBet : ", totalBet);
        if (Configs.Login.CoinFish >= totalBet) {
            //      cc.log("Loto actionSubmitBet Du tien");
            App.instance.showLoading(true);
            switch (this.numRequired) {
                case 1:
                    this.numRequest = 0;
                    this.numRequestCompleted = this.currentNumPicked.length;
                    for (let index = 0; index < this.currentNumPicked.length; index++) {
                        this.requestPlay(this.currentNumPicked[index], betOneTurn);
                    }
                    break;
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 12:
                case 14:
                    this.numRequest = 0;
                    this.numRequestCompleted = 1;
                    this.requestPlay(this.currentNumPicked, betOneTurn);
                    break;
                default:
                    break;
            }
        } else {
            // Khong du tien
            //    cc.log("Loto actionSubmitBet Khong du tien");
            this.showPopupNotify("Bạn không có đủ tiền !");
        }
    }

    // Feature Flex
    changeFlexFeatures(toggle) {
        var index = this.listTabs.indexOf(toggle);
        //    cc.log("Loto changeFlexFeatures tabId : ", index);
        this.resetContentTabsState();
        this.contentTabs.children[index].active = true;
        switch (index) {
            case 0: // Chat
                this.scrollChat.scrollToBottom(0.2);
                break;
            case 1:  // New Bet
                this.scrollNewBet.scrollToBottom(0.2);
                break;
            case 2: // Result
                this.tabResultDate.string = this.today;
                this.onBetChannelSelected("1", cmd.Code.LOTO_CHANNEL.MIEN_BAC);
                break;
            default:
                break;
        }
    }

    actionSendChat() {
        //   cc.log("Chat msg : ", this.edtChatInput.string);

        let msg = this.edtChatInput.string.trim();
        //   cc.log("Chat msg trim : ", msg);
        if (msg.length > 0) {
            this.requestChat(msg);
            this.edtChatInput.string = "";
        }
    }

    // Choose Bet Channel
    showBetChannel(event, type) {
        this.btnBetChannel.children[0].angle = 180;
        this.btnTabResultChannel.children[0].angle = 180;
        this.btnPopupResultChannel.children[0].angle = 180;

        this.btnCancelChangeChannel.active = true;

        this.betChannel.active = !this.betChannel.active;
        if (type == "0") {// o phan chon cuoc
            this.btnBetChannel.children[0].angle = this.betChannel.active ? 0 : 180;
            this.betChannel.position = cc.v2(-385, -75);
        } else if (type == "1") { // o phan tab ket qua nho
            this.btnTabResultChannel.children[0].angle = this.betChannel.active ? 0 : 180;
            this.betChannel.position = cc.v2(485, -15);
        } else if (type == "2") { // o phan Tab ket qua To
            this.btnPopupResultChannel.children[0].angle = this.betChannel.active ? 0 : 180;
            this.betChannel.position = cc.v2(60, 35);
        }
        //    console.log("showBetChannel: " + this.contentBetChannel.childrenCount);
        // for (let index = 0; index < this.contentBetChannel.childrenCount; index++) {

        if (this.contentBetChannel.childrenCount == 0) {
            for (let index = 1; index < 2; index++) { // 0 = NONE
                let info = {
                    name: cmd.Code.LOTO_CHANNEL_NAME[index],
                    id: index,
                    from: type
                };
                let item = cc.instantiate(this.prefabItemChannel);
                item.getComponent("Loto.ItemChannel").initItem(info);
                this.contentBetChannel.addChild(item);
            }
        } else {
            // update field From
            for (let index = 0; index < this.contentBetChannel.childrenCount; index++) {
                this.contentBetChannel.children[index].getComponent("Loto.ItemChannel").updateInfo(type);
            }
        }
        this.contentBetChannel.children[0].active = true;
        // }

        if (type == "0") {
            let arrChannelAvailableInLocation = [];
            switch (this.GAME_LOCATION) {
                case cmd.Code.LOTO_LOCATION.MienBac:
                    arrChannelAvailableInLocation = cmd.Code.LOTO_CHANNEL_BAC;
                    break;
                case cmd.Code.LOTO_LOCATION.MienTrung:
                    arrChannelAvailableInLocation = cmd.Code.LOTO_CHANNEL_TRUNG;
                    break;
                case cmd.Code.LOTO_LOCATION.MienNam:
                    arrChannelAvailableInLocation = cmd.Code.LOTO_CHANNEL_NAM;
                    break;
                default:
                    break;
            }

            for (let index = 0; index < this.contentBetChannel.childrenCount; index++) {
                let findId = arrChannelAvailableInLocation.indexOf(index + 1);
                if (findId != -1) {
                    // Open
                    this.contentBetChannel.children[index].active = true;
                } else {
                    // Block
                    this.contentBetChannel.children[index].active = false;
                }
            }
        }
        this.scrollBetChannel.scrollToOffset(cc.v2(0, 0), 0.2);
    }

    onBetChannelSelected(type, channelId) {
        //    cc.log("LotoController onBetChannelSelected type : ", type);
        //    cc.log("LotoController onBetChannelSelected channelId : ", channelId);
        this.btnCancelChangeChannel.active = false;
        this.betChannel.active = false;
        if (type == "0") {// o phan chon cuoc
            this.btnBetChannel.children[0].angle = 180;
            this.currentBetChannel.string = cmd.Code.LOTO_CHANNEL_NAME[channelId];
            this.GAME_CHANNEL = channelId;
            this.actionCancelBet();
        } else if (type == "1") { // o phan tab ket qua nho
            this.btnTabResultChannel.children[0].angle = 180;
            this.currentTabResultChannel.string = cmd.Code.LOTO_CHANNEL_NAME[channelId];
            this.requestGetLotoResult(this.sessionDate, channelId);
        } else if (type == "2") { // o phan Tab ket qua To
            this.btnPopupResultChannel.children[0].angle = 180;
            this.currentPopupResultChannel.string = cmd.Code.LOTO_CHANNEL_NAME[channelId];
            this.popupResultCurrentChannelId = channelId;
            this.chooseTime(null, 0);
            // this.requestGetLotoResult(this.sessionDate, channelId);
        }
    }

    cancelChangeChannel() {
        this.btnCancelChangeChannel.active = false;
        this.btnBetChannel.children[0].angle = 180;
        this.btnTabResultChannel.children[0].angle = 180;
        this.btnPopupResultChannel.children[0].angle = 180;
        this.betChannel.active = false;
    }

    // Number Selector
    initNumSelector(numCount) {
        if (numCount > 0) {
            for (let index = 0; index < numCount; index++) {
                let item = cc.instantiate(this.prefabItemNumber);
                item.getComponent("Loto.ItemNumber").initItem(numCount, index);
                this.contentNumSelector.addChild(item);
            }
            this.scrollNumSelector.scrollToOffset(cc.v2(0, 0), 0.2);
        }
    }

    updateNumSelector(numCount) {
        for (let index = 0; index < 1000; index++) {
            if (index < numCount) {
                this.contentNumSelector.children[index].active = true;
                this.contentNumSelector.children[index].getComponent(cc.Toggle).isChecked = false;
                this.contentNumSelector.children[index].getComponent("Loto.ItemNumber").formatName(numCount);
            } else {
                this.contentNumSelector.children[index].active = false;
            }
        }
        this.scrollNumSelector.scrollToOffset(cc.v2(0, 0), 0.2);
    }

    openNumSelector() {
        let heightOpen = 460;
        let heightClose = 345; // 0.75

        let current = this.numberSelector.children[0].height;
        this.numberSelector.children[0].height = current == 480 ? 365 : 480;
        this.contentNumSelector.height = current == 480 ? heightClose : heightOpen;
        this.contentNumSelector.parent.height = current == 480 ? heightClose : heightOpen;
        this.scrollNumSelector.node.height = current == 480 ? heightClose : heightOpen;
        this.btnOpenNumberSelector.y = current == 480 ? -375 : -490;
        this.contentDescMode.active = current == 480 ? true : false;
    }

    // Number Picked
    addNumberPicked(number) {
        this.currentNumPicked.push(number);
        //     cc.log("LOTO addNumberPicked number : ", number);
        let item = cc.instantiate(this.prefabItemNumberPicked);
        item.getComponent("Loto.ItemNumSelected").initItem(number);
        this.contentNumPicked.addChild(item);
        this.scrollNumPicked.scrollToRight(0.5);

        if (this.numRequired == 1) {
            this.labelTotalBet.string = "" + (this.currentBetValue * parseInt(this.edtBet.string) * this.currentNumPicked.length);
        } else {
            this.labelTotalBet.string = "" + (this.currentBetValue * parseInt(this.edtBet.string));
        }
        this.labelWinValue.string = "" + (this.currentWinValue * parseInt(this.edtBet.string));
    }

    removeNumberPicked(number) {
        // cc.log("LOTO removeNumberPicked number : ", number);
        this.resetContentNumberPicked();
        var temp = [...this.currentNumPicked];
        this.currentNumPicked = [];
        for (let index = 0; index < temp.length; index++) {
            if (temp[index] != number) {
                this.currentNumPicked.push(temp[index]);
                let item = cc.instantiate(this.prefabItemNumberPicked);
                item.getComponent("Loto.ItemNumSelected").initItem(temp[index]);
                this.contentNumPicked.addChild(item);
            }
        }
        this.scrollNumPicked.scrollToRight(0.5);
        if (this.numRequired == 1) {
            this.labelTotalBet.string = "" + (this.currentBetValue * parseInt(this.edtBet.string) * this.currentNumPicked.length);
        } else {
            this.labelTotalBet.string = "" + (this.currentBetValue * parseInt(this.edtBet.string));
        }
        this.labelWinValue.string = "" + (this.currentWinValue * parseInt(this.edtBet.string));
        //  cc.log("Loto removeNumberPicked currentNumPicked : ", this.currentNumPicked);
    }

    // Game guide
    changeGameGuide() {
        //  cc.log("LOTO changeGameGuide GAME_MODE : ", this.GAME_MODE);
        //  cc.log("LOTO changeGameGuide GAME_LOCATION : ", this.GAME_LOCATION);
        //  cc.log("LOTO changeGameGuide GAME_CHANNEL : ", this.GAME_CHANNEL);
        this.currentGameHelp = "";
        for (let index = 0; index < this.helpCenter.length; index++) {
            let data = this.helpCenter[index];
            if (data.gameMode == this.GAME_MODE && data.location == this.GAME_LOCATION) {
                this.currentGameHelp = data.help;
            }
        }
        //    cc.log(this.currentGameHelp);
        this.labelGameGuide.string = this.currentGameHelp;
    }


    // State
    resetContentModeState() {
        for (let index = 0; index < this.contentMode.childrenCount; index++) {
            this.contentMode.children[index].active = false;
        }
    }

    resetContentTabsState() {
        for (let index = 0; index < this.contentTabs.childrenCount; index++) {
            this.contentTabs.children[index].active = false;
        }
    }

    resetContentNumberPicked() {
        this.contentNumPicked.removeAllChildren();
    }

    resetContentNumSelector() {
        this.contentNumSelector.removeAllChildren();
    }

    // Popup
    showPopupResult() {
        this.popupResult.active = true;
        this.popupResultDate.string = this.formatDate(this.arrDates[0]);
        for (let index = 0; index < this.arrDates.length; index++) {
            let time = this.arrDates[index];
            this.contentTime.children[1].children[index].children[0].getComponent(cc.Label).string = this.formatDate(time);
        }
        //   cc.log("LOTO showPopupResult sessionDate : ", this.sessionDate);
        this.onBetChannelSelected("2", cmd.Code.LOTO_CHANNEL.MIEN_BAC);
    }

    showContentTime() {
        //   cc.log("LOTO showContentTime");
        let scaleNow = this.contentTime.scaleY;
        this.contentTime.stopAllActions();
        if (scaleNow < 0.5) {
            this.contentTime.scaleY = 0;
            this.contentTime.runAction(
                cc.scaleTo(0.2, 1, 1)
            );
        } else {
            this.contentTime.scaleY = 1;
            this.contentTime.runAction(
                cc.scaleTo(0.2, 1, 0)
            );
        }
    }

    chooseTime(event, id) {
        //   cc.log("LOTO chooseTime id : ", id);
        //   cc.log("LOTO chooseTime arrDates : ", this.arrDates[parseInt(id)]);

        this.contentTime.scaleY = 0;

        let time = this.arrDates[parseInt(id)];
        this.popupResultDate.string = this.formatDate(time);
        let session = this.getSession(time);
        //  cc.log("LOTO chooseTime session : ", session);
        this.requestGetLotoResult(session, this.popupResultCurrentChannelId);
    }

    formatDate(date) {
        var month = '' + (date.getMonth() + 1);
        var day = '' + date.getDate();
        var year = date.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('/');
    }

    getSession(date) {
        var month = '' + (date.getMonth() + 1);
        var day = '' + date.getDate();
        var year = date.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('');
    }

    closePopupResult() {
        this.popupResult.active = false;
    }

    showPopupHistory() {
        this.requestGetPlayerRequest();
    }

    closePopupHistory() {
        this.popupHistory.active = false;
    }

    showPopupNotify(msg) {
        this.popupNotify.active = true;
        this.labelMsg.string = msg;
    }

    closePopupNotify() {
        this.popupNotify.active = false;
    }

    onTextChangeBet(event) {
        //   cc.log("LOTO onTextChangeBet event: ", event);
        if (event.length > 0) {
            if (/^[0-9]*$/.test(event) == false) {
                App.instance.alertDialog.showMsg("Tiền cược phải là số dương");
                this.edtBet.string = "1";
                event = "1";
            }
            let raw = parseInt(event);
            if (raw == 0) {
                this.edtBet.string = "1";
                event = "1";
            }
            this.edtBet.string = "" + parseInt(event);
        } else {
            this.edtBet.string = "1";
            event = "1";
        }
        let delta = parseInt(event);
        if (this.numRequired == 1) {
            this.labelTotalBet.string = "" + (this.currentBetValue * delta * this.currentNumPicked.length);
        } else {
            this.labelTotalBet.string = "" + (this.currentBetValue * delta);
        }
        this.labelWinValue.string = "" + (this.currentWinValue * delta);
    }

    // Request
    requestPlay(num, betOneTurn) {
        //   cc.log("Loto requestPlay number : ", num);
        //   cc.log("Loto requestPlay betOneTurn : ", betOneTurn);
        ShootFishNetworkClient.getInstance().request("LOTO1", {
            "appId": "xxeng",
            "userId": Configs.Login.UserIdFish,
            "number": num,  // số người chơi chọn, có thể là số hoặc mảng số, tùy mode
            "session": this.sessionDate,
            "mode": this.GAME_MODE,
            "channel": this.GAME_CHANNEL,
            "pay": betOneTurn
        }, (res) => {
            //   cc.log("LOTO1 : ", res);
            if (res["code"] != 200) {
                App.instance.showLoading(false);
                App.instance.alertDialog.showMsg("Lỗi " + res["code"] + ", " + res["msg"]);
                return;
            }

            this.numRequest += 1;
            //   cc.log("LOTO1 numRequest : ", this.numRequest);
            if (this.numRequest == this.numRequestCompleted) {
                this.showPopupNotify("Đặt thành công !");
                // Bet Success -> Can reset
                this.numRequest = 0;
                this.numRequestCompleted = 0;
                this.actionCancelBet();
                App.instance.showLoading(false);
            }

            // Tru tien
            //   cc.log("Loto Bet Success cost : ", res["cost"]);

            Configs.Login.CoinFish = res["cash"];
            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

            // do something
        }, this);
    }

    requestGetPayWinRate() {
        //   cc.log("Loto requestGetPayWinRate GAME_MODE : ", this.GAME_MODE);
        //   cc.log("Loto requestGetPayWinRate GAME_CHANNEL : ", this.GAME_CHANNEL);
        ShootFishNetworkClient.getInstance().request("LOTO2", {
            "mode": this.GAME_MODE,
            "channel": this.GAME_CHANNEL
        }, (res) => {
            //   cc.log("LOTO2 : ", res);
            if (res["code"] != 200) {
                //App.instance.alertDialog.showMsg("Lỗi " + res["code"] + ", không xác định.");
                return;
            }
            // do something
            this.currentNumPicked = [];
            this.resetContentNumberPicked();

            this.currentBetValue = res["payRate"];
            this.currentWinValue = res["winRate"];
            //   cc.log("LOTO2 this.currentBetValue : ", this.currentBetValue);
            this.edtBet.string = "1";
            this.labelTotalBet.string = "0";
            this.labelWinValue.string = res["winRate"];
        }, this);
    }

    // Lay theo Session
    requestGetCalculateResult() {
        ShootFishNetworkClient.getInstance().request("LOTO3", {
            "session": this.sessionDate,
        }, (res) => {
            //    cc.log("LOTO3 : ", res);
            if (res["code"] != 200) {
                //App.instance.alertDialog.showMsg("Lỗi " + res["code"] + ", không xác định.");
                return;
            }
            // do something
        }, this);
    }

    // Lay tat ca
    requestGetPlayerRequest() {
        ShootFishNetworkClient.getInstance().request("LOTO4", null, (res) => {
            //    cc.log("LOTO4 : ", res);
            if (res["code"] != 200) {
                //App.instance.alertDialog.showMsg("Lỗi " + res["code"] + ", không xác định.");
                return;
            }
            // do something

            this.popupHistory.active = true;
            this.contentHistory.removeAllChildren(true);
            let data = res["data"];
            for (let index = 0; index < data.length; index++) {
                let item = cc.instantiate(this.prefabItemHistory);
                item.getComponent("Loto.ItemHistory").initItem(index, data[index]);
                this.contentHistory.addChild(item);
            }
        }, this);
    }


    requestGetLotoResult(sessionId, channelId) {
        //   cc.log("Loto requestGetLotoResult sessionId : ", sessionId);
        //   cc.log("Loto requestGetLotoResult channelId : ", channelId);
        ShootFishNetworkClient.getInstance().request("LOTO5", {
            "session": sessionId,
            "channel": channelId
        }, (res) => {
            //  cc.log("LOTO5 : ", res);
            if (res["code"] != 200) {
                //App.instance.alertDialog.showMsg("Lỗi " + res["code"] + ", không xác định.");
                return;
            }
            // do something
            if (this.popupResult.active) {
                // Popup Result
                for (let index = 0; index < 9; index++) {
                    this.labelResult[index].string = "......";
                }
            } else {
                // Tab Result
                for (let index = 0; index < 9; index++) {
                    this.labelTabResult[index].string = "......";
                }
            }

            let resData = res["data"];

            if (resData["channel"] == 0 || resData["session"] == 0) {
                // Chua co ket qua

            } else {
                resData = res["data"];

                let result = resData["results"];
                if (resData["result8"] == "[]") { // k co giai 8
                    if (this.popupResult.active) {
                        // Popup Result
                        this.labelResult[8].string = "";
                    } else {
                        // Tab Result
                        this.labelTabResult[8].string = "";
                    }
                }

                let deltaSpaces = this.popupResult.active ? "    " : "  ";

                for (let index = 0; index < 8; index++) {
                    let strJson = resData["result" + index];
                    if (index == 0) {
                        strJson = resData["resultSp"];
                    }
                    let rowInfo = JSON.parse(strJson);

                    let text = "";
                    for (let i = 0; i < rowInfo.length; i++) {
                        if (i < rowInfo.length - 1) {
                            if (i == 2 && (index == 3 || index == 5)) {
                                text = text + rowInfo[i].toString() + "\n";
                            } else {
                                text = text + rowInfo[i].toString() + deltaSpaces;
                            }
                        } else {
                            text = text + rowInfo[i].toString();
                        }
                    }
                    // if (index == 0) {
                    //     rowInfo=resData["resultSp"];
                    //     text = rowInfo[0];
                    // }else if (index == 1) {
                    //     text = resData["resultSp"][0];
                    // } else if (index == 2) {
                    //     text = rowInfo[0] + deltaSpaces + rowInfo[1];
                    // } else if (index == 3 || index == 5) {
                    //     text = rowInfo[0] + deltaSpaces + rowInfo[1] + deltaSpaces + rowInfo[2] + "\n" + rowInfo[3] + deltaSpaces + rowInfo[4] + deltaSpaces + rowInfo[5];
                    // } else if (index == 4) {
                    //     text = rowInfo[0] + deltaSpaces + rowInfo[1] + deltaSpaces + rowInfo[2] + deltaSpaces + rowInfo[3];
                    // } else if (index == 6) {
                    //     text = rowInfo[0] + deltaSpaces + rowInfo[1] + deltaSpaces + rowInfo[2];
                    // } else if (index == 7 || index == 8) {
                    //     text = rowInfo[0] + deltaSpaces + rowInfo[1] + deltaSpaces + rowInfo[2] + deltaSpaces + rowInfo[3];
                    // }

                    if (this.popupResult.active) {
                        // Popup Result
                        this.labelResult[index].string = text;
                    } else {
                        // Tab Result
                        this.labelTabResult[index].string = text;
                    }
                }
            }
        }, this);
    }

    requestGetHelp() {
        ShootFishNetworkClient.getInstance().request("LOTO6", null, (res) => {
            //   cc.log("LOTO6 : ", res);
            if (res["code"] != 200) {
                //App.instance.alertDialog.showMsg("Lỗi " + res["code"] + ", không xác định.");
                return;
            }

            // do something
            //  cc.log("LOTO6 : ", res['data']);
            this.helpCenter = res["data"];
            this.changeGameGuide();
        }, this);
    }

    requestChat(msg) {
        //  cc.log("Loto requestChat msg : ", msg);
        ShootFishNetworkClient.getInstance().request("LOTO7", {
            "msg": msg,
        }, (res) => {
            //    cc.log("LOTO7 : ", res);
            if (res["code"] != 200) {
                //App.instance.alertDialog.showMsg("Lỗi " + res["code"] + ", không xác định.");
                return;
            }
            // do something
        }, this);
    }

    requestGetChatHistory() {
        ShootFishNetworkClient.getInstance().request("LOTO8", null, (res) => {
            //  cc.log("LOTO8 :", res);
            if (res["code"] != 200) {
                //App.instance.alertDialog.showMsg("Lỗi " + res["code"] + ", không xác định.");
                return;
            }
            // do something
            this.contentChat.removeAllChildren(true);
            let arrChat = res["data"];
            for (let index = 0; index < arrChat.length; index++) {
                let item = cc.instantiate(this.prefabItemChat);
                item.getComponent('Loto.ItemChat').initItem({
                    nickname: arrChat[index].nickname,
                    msg: arrChat[index].msg,
                });
                this.contentChat.addChild(item);
            }
            this.scrollChat.scrollToBottom(0.2);
        }, this);
    }

    requestGetGameAvailable() {
        ShootFishNetworkClient.getInstance().request("LOTO9", null, (res) => {
            //  cc.log("LOTO9 :", res);
            if (res["code"] != 200) {
                //App.instance.alertDialog.showMsg("Lỗi " + res["code"] + ", không xác định.");
                return;
            }
            // do something
            App.instance.showLoading(false);
            // Neu mode va channel la [] nghia la cho choi Full game

            this.channelsOpen = res["channels"];
            this.modesOpen = res["modes"];

            if (this.modesOpen.length == 0) {
                for (let index = 0; index < 24; index++) {
                    this.modesOpen.push(index);
                }
            }

            if (this.channelsOpen.length == 0) {
                for (let index = 0; index < 37; index++) {
                    this.channelsOpen.push(index);
                }
            }

            //   cc.log("Mode Open : ", this.modesOpen);
            //  cc.log("Channel Open : ", this.channelsOpen);

            // Init Game
            this.chooseLocation(this.listLocation[0]);

            this.listLocation[0].isChecked = true;
            this.GAME_LOCATION = cmd.Code.LOTO_LOCATION.MienBac;
            this.onBetChannelSelected("0", cmd.Code.LOTO_CHANNEL.MIEN_BAC); // param 1 la 0 nghia la chon o phan Bet

            this.requestGetHelp();
            this.requestGetPayWinRate();
        }, this);
    }

    // lay danh sach bet cua cac nguoi cho khac cho tab new bet
    requestGetNewBetHistory() {
        ShootFishNetworkClient.getInstance().request("LOTO10", null, (res) => {
            //   cc.log("LOTO10 :", res);
            if (res["code"] != 200) {
                //App.instance.alertDialog.showMsg("Lỗi " + res["code"] + ", không xác định.");
                return;
            }
            // do something
            this.contentNewBet.removeAllChildren(true);
            let arrBet = res["data"];
            for (let index = 0; index < arrBet.length; index++) {
                let push = arrBet[index];
                let item = cc.instantiate(this.prefabItemNewBet);
                item.getComponent('Loto.ItemNewBet').initItem({
                    nickname: push["nickname"],
                    channel: push["channel"],
                    mode: push["mode"],
                    bet: push["cost"],
                    nums: push["number"]
                });
                this.contentNewBet.addChild(item);
            }
            this.scrollNewBet.scrollToBottom(0.2);
        }, this);
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
                    //   console.log("Đăng nhập thành công.");
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

    actBack() {
        cc.audioEngine.stopAll();
        App.instance.loadScene("Lobby");
    }

    // update (dt) {}
}
