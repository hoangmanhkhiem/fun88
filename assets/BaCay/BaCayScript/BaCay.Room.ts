import BundleControl from "../../Loading/src/BundleControl";
import Configs from "../../Loading/src/Configs";
import App from "../../Lobby/LobbyScript/Script/common/App";
import BroadcastReceiver from "../../Lobby/LobbyScript/Script/common/BroadcastReceiver";
import SPUtils from "../../Lobby/LobbyScript/Script/common/SPUtils";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import cmd from "./BaCay.Cmd";
import BaCayNetworkClient from "./BaCay.NetworkClient";
import cmdNetwork from "../../Lobby/LobbyScript/Script/networks/Network.Cmd";
import AudioManager from "../../Lobby/LobbyScript/Script/common/Common.AudioManager";
import { Global } from "../../Loading/src/Global";
enum audio_clip {
    BG = 0,
    LOSE = 1,
    WIN = 2,
    CHIA_BAI = 3,
    CHIP = 4,
    CLOCK = 5,
    START_BET = 6
}
const { ccclass, property } = cc._decorator;
@ccclass("BaCay.Room.SoundManager")
export class SoundManager {
    @property(cc.AudioSource)
    bgMusic: cc.AudioSource = null;

    @property(cc.AudioSource)
    effSound: cc.AudioSource = null;

    @property([cc.AudioClip])
    listAudio: cc.AudioClip[] = [];
    playBgMusic() {
        AudioManager.getInstance().playBackgroundMusic(this.listAudio[audio_clip.BG]);
    }
    playAudioEffect(indexAudio) {
        // this.effSound.clip = this.listAudio[indexAudio];
        // this.effSound.play();
        if (SPUtils.getSoundVolumn() > 0) {
            cc.audioEngine.play(this.listAudio[indexAudio], false, 1);
        }

    }
    stopAudioEffect() {
        cc.audioEngine.stopAll();
    }
    stopBgMusic() {
        this.bgMusic.stop();
    }
}
@ccclass
export default class BacayRoom extends cc.Component {
    public static instance: BacayRoom = null;

    @property(cc.Prefab)
    itemListTemp: cc.Prefab = null;
    @property(cc.Node)
    contentListRooms: cc.Node = null;
    @property(cc.Label)
    labelNickName: cc.Label = null;
    @property(cc.Label)
    labelCoin: cc.Label = null;
    @property(cc.ScrollView)
    scrRoom: cc.ScrollView = null;
    @property(cc.Node)
    UI_Playing: cc.Node = null;
    @property(cc.Prefab)
    uiInGamePr: cc.Prefab = null;
    @property(cc.Toggle)
    btnHideRoomFull: cc.Toggle = null;
    @property(cc.EditBox)
    edtFindRoom: cc.EditBox = null;
    @property(SoundManager)
    soundManager: SoundManager = null;

    private listDataRoom = [];
    private listFullRoom = [];

    public isInitedUIRoom = false;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        BacayRoom.instance = this;
    }

    start() {
        this.showUIRooms();
        App.instance.showErrLoading("Đang kết nối tới server...");
        BaCayNetworkClient.getInstance().addOnOpen(() => {
            App.instance.showErrLoading("Đang đăng nhập...");
            BaCayNetworkClient.getInstance().send(new cmdNetwork.SendLogin(Configs.Login.Nickname, Configs.Login.AccessToken));
        }, this);
        BaCayNetworkClient.getInstance().addOnClose(() => {
            App.instance.loadScene("Lobby");
        }, this);
        BaCayNetworkClient.getInstance().connect();
        this.soundManager.playBgMusic();
    }
    showUIRooms() {
        if (this.isInitedUIRoom) {
            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
        } else {
            this.isInitedUIRoom = true;
            this.labelNickName.string = Configs.Login.Nickname;
            BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
                this.labelCoin.string = Utils.formatNumber(Configs.Login.Coin);
                // LogEvent.getInstance().sendEventMoneyChange(Configs.GameId.getGameName(Configs.GameId.BaCay),Configs.Login.Currency,Configs.Login.Coin);
            }, this);
            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
            this.setupListener();
        }
    }
    refeshListRoom() {
        App.instance.showLoading(true);
        BaCayNetworkClient.getInstance().send(new cmd.SendGetListRoom());
    }
    setupListener() {
        BaCayNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.LOGIN:
                    // App.instance.showLoading(false);
                    this.refeshListRoom();
                    BaCayNetworkClient.getInstance().send(new cmd.CmdReconnectRoom());
                    break;
                case cmd.Code.TOPSERVER:
                    {
                        // App.instance.showLoading(false);
                        let res = new cmd.ReceivedTopServer(data);
                        let rankType = res["rankType"];
                        let topDay_money = res["topDay_money"];
                        let topWeek_money = res["topWeek_money"];
                        let topMonth_money = res["topMonth_money"];
                    }
                    break;
                case cmd.Code.CMD_PINGPONG:
                    {
                    }
                    break;
                case cmd.Code.CMD_JOIN_ROOM:
                    {
                        // App.instance.showLoading(false);
                        ////Utils.Log("BaCay CMD_JOIN_ROOM");
                    }
                    break;
                case cmd.Code.CMD_RECONNECT_ROOM:
                    {
                        // App.instance.showLoading(false);
                        //         cc.log("BaCay CMD_RECONNECT_ROOM");
                    }
                    break;
                case cmd.Code.MONEY_BET_CONFIG:
                    {
                        // App.instance.showLoading(false);
                        //          cc.log("BaCay MONEY_BET_CONFIG");
                    }
                    break;
                case cmd.Code.JOIN_ROOM_FAIL:
                    {
                        // App.instance.showLoading(false);
                        let res = new cmd.ReceivedJoinRoomFail(data);
                        let msg = "Lỗi " + res.getError() + ", không xác định.";
                        switch (res.getError()) {
                            case 1:
                                msg = App.instance.getTextLang('txt_room_err1');
                                break;
                            case 3:
                                msg = App.instance.getTextLang('txt_room_err3');
                                break;
                            case 2:
                            case 4:
                                msg = App.instance.getTextLang('txt_room_err2');
                                break;
                            case 5:
                                msg = App.instance.getTextLang('txt_room_err5');
                                break;
                            case 6:
                                msg = App.instance.getTextLang('txt_room_err6');
                                break;
                            case 7:
                                msg = App.instance.getTextLang('txt_room_err7');
                                break;
                            case 8:
                                msg = App.instance.getTextLang('txt_room_err8');
                                break;
                            case 9:
                                msg = App.instance.getTextLang('txt_room_err9');
                                break;
                            case 10:
                                msg = App.instance.getTextLang('txt_room_err10');
                        }
                        App.instance.alertDialog.showMsg(msg);
                        App.instance.showLoading(false);
                    }
                    break;
                case cmd.Code.GET_LIST_ROOM:
                    {
                        // App.instance.showLoading(false);
                        let res = new cmd.ReceivedGetListRoom(data);
                        //         cc.log(res);
                        this.listDataRoom = res.list;
                        this.listDataRoom.sort((x, y) => {
                            return x.moneyBet - y.moneyBet;
                        })
                        this.reloadListRoom(this.listDataRoom);
                        // this.scrRoom.scrollToTop(0.2);
                    }
                    break;
                case cmd.Code.JOIN_GAME_ROOM_BY_ID:
                    {
                        // App.instance.showLoading(false);
                    }
                    break;

                // ------------------------ Game ---------------------------     

                case cmd.Code.JOIN_ROOM_SUCCESS:
                    {
                        //        cc.log("BaCay JOIN_ROOM_SUCCESS");
                        // App.instance.showLoading(false);
                        let res = new cmd.ReceivedJoinRoomSucceed(data);
                        let cb = (res) => {
                            this.UI_Playing.getComponent("BaCay.Controller").setupMatch(res);
                        }
                        this.showUIPlaying(res, cb);
                    }
                    break;
                case cmd.Code.THONG_TIN_BAN_CHOI: {
                    App.instance.showLoading(false);
                    let res = new cmd.ReceivedGameInfo(data);
                    //       cc.log("THONG_TIN_BAN_CHOI:", res);
                    let cb = (res) => {
                        this.UI_Playing.getComponent("BaCay.Controller").actReJoinRoom(res);
                    }
                    this.showUIPlaying(res, cb);
                    break;
                }
                case cmd.Code.LOGOUT: {
                    //          cc.log("Đăng nhâp từ nguồn khác!");
                }
                default:
                    break;
            }
        }, this);
    }
    showUIPlaying(res, cb) {

        if (this.UI_Playing == null) {
            App.instance.showLoading(true);
            cc.assetManager.getBundle("BaCay").load("prefabs/UI_Play", cc.Prefab, function (finish, total, item) {
            }, (err1, prefab: cc.Prefab) => {
                App.instance.showLoading(false);
                this.UI_Playing = cc.instantiate(prefab);
                this.UI_Playing.parent = this.node.parent;
                this.UI_Playing.active = true;
                this.node.active = false;
                cb(res);
                this.closeUIRoom();
            })
        } else {
            App.instance.showLoading(false);
            this.UI_Playing.active = true;
            this.node.active = false;
            cb(res);
        }
    }
    createRoom() {
        //      cc.log("BaCay createRoom");
        BaCayNetworkClient.getInstance().send(new cmd.SendCreateRoom(1, 8, 500, 0, 8, "", "", 10000));
    }
    hideRoomFull() {
        //   cc.log("hide room full");
        this.listFullRoom = [];
        if (this.btnHideRoomFull.isChecked) {
            this.listDataRoom.forEach((data) => {
                if (data.roomInfo['userCount'] == data.roomInfo["maxUserPerRoom"]) {
                    this.listFullRoom.push(data);
                }
            });
            this.reloadListRoom(this.listFullRoom);
        } else {
            this.reloadListRoom(this.listDataRoom);
        }
    }
    findRoomId() {
        let text = this.edtFindRoom.string.trim();
        if (text.length > 0) {
            let idFind = parseInt(text);
            let dataRoom = null;
            dataRoom = this.listDataRoom.find(data => data["id"] == idFind);
            this.reloadListRoom([dataRoom]);
        } else {
            this.reloadListRoom(this.listDataRoom);
        }
    }
    backToLobby() {
        BaCayNetworkClient.getInstance().close();
        App.instance.loadScene("Lobby");
    }
    reloadListRoom(listDataRoom) {
        this.listDataRoom = listDataRoom;
        App.instance.showLoading(false);
        // let cb = (item, itemData) => {
        //     item.getComponent("BaCay.ItemRoom").initItem(itemData);
        //     item.active = true;
        // }
        // this.scrRoom.node.getComponent("ScrollViewControl").setDataList(cb, listDataRoom);
        // this.contentListRooms.destroyAllChildren();
        let count = listDataRoom.length > this.contentListRooms.children.length ? listDataRoom.length : this.contentListRooms.children.length;
        for (let i = 0; i < count; i++) {
            let itemData = listDataRoom[i];
            let node = this.contentListRooms.children[i];
            if (itemData) {
                if (!node) {
                    node = cc.instantiate(this.itemListTemp);
                    node.parent = this.contentListRooms;
                }
                node.active = true;
                node.getComponent("BaCay.ItemRoom").initItem(itemData);
            } else if (node) {
                node.active = false;
            }
        }
    }

    private isSortRoom = false;
    onBtnSortRoomId() {
        if (this.isSortRoom == false) {
            if (this.listDataRoom) {
                this.listDataRoom.sort((x, y) => {
                    return x.id - y.id;
                })
            }
        }
        else {
            if (this.listDataRoom) {
                this.listDataRoom.sort((x, y) => {
                    return y.id - x.id;
                })
            }
        }
        this.isSortRoom = !this.isSortRoom;
        // let cb = (item, itemData) => {
        //     item.getComponent("BaCay.ItemRoom").initItem(itemData);
        //     item.active = true;
        // }
        // this.scrRoom.node.getComponent("ScrollViewControl").setDataList(cb, this.listDataRoom);
        this.reloadListRoom(this.listDataRoom);
    }
    private isSortMoney;
    onBtnSortRoomMoney() {
        if (this.isSortMoney == false) {
            if (this.listDataRoom) {
                this.listDataRoom.sort((x, y) => {
                    return x.requiredMoney - y.requiredMoney;
                })
            }
        }
        else {
            if (this.listDataRoom) {
                this.listDataRoom.sort((x, y) => {
                    return y.requiredMoney - x.requiredMoney;
                })
            }
        }
        this.isSortMoney = !this.isSortMoney;
        // let cb = (item, itemData) => {
        //     item.getComponent("BaCay.ItemRoom").initItem(itemData);
        //     item.active = true;
        // }
        // this.scrRoom.node.getComponent("ScrollViewControl").setDataList(cb, this.listDataRoom);
        this.reloadListRoom(this.listDataRoom);
    }
    joinRoom(info) {
        if (Configs.Login.Coin < info.requiredMoney) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_not_enough_money"));
            return;
        }
        App.instance.showLoading(true);
        BaCayNetworkClient.getInstance().send(new cmd.SendJoinRoomById(info["id"]));
    }
    playingNow() {
        let arrRoomOkMoney = [];
        for (let index = 0; index < this.contentListRooms.childrenCount; index++) {
            let roomItem = this.contentListRooms.children[index].getComponent("BaCay.ItemRoom");
            if (roomItem.roomInfo["requiredMoney"] < Configs.Login.Coin) {
                arrRoomOkMoney.push(index);
            }
        }

        //    cc.log("BaCay playingNow arrRoomOkMoney : ", arrRoomOkMoney);

        if (arrRoomOkMoney.length > 0) {
            let roomCrowed = arrRoomOkMoney[0];
            //    cc.log("BaCay playingNow roomCrowed start : ", roomCrowed);
            for (let index = 0; index < arrRoomOkMoney.length; index++) {
                let roomItem = this.contentListRooms.children[arrRoomOkMoney[index]].getComponent("BaCay.ItemRoom");
                let roomItemCrowed = this.contentListRooms.children[roomCrowed].getComponent("BaCay.ItemRoom");
                //        cc.log("BaCay playingNow ------------------------------------------");
                //     cc.log("BaCay playingNow roomItem : ", roomItem.roomInfo["userCount"]);
                //     cc.log("BaCay playingNow roomItemCrowed : ", roomItemCrowed.roomInfo["userCount"]);
                if (roomItem.roomInfo["userCount"] > roomItemCrowed.roomInfo["userCount"]) {
                    roomCrowed = arrRoomOkMoney[index];
                    //       cc.log("BaCay playingNow roomCrowed update : ", roomCrowed);
                }
            }
            //   cc.log("BaCay playingNow roomCrowed end : ", roomCrowed);
            let roomChoosed = this.contentListRooms.children[roomCrowed].getComponent("BaCay.ItemRoom");
            //   cc.log("BaCay playingNow roomCrowed end roomInfo : ", roomChoosed.roomInfo);
            this.joinRoom(roomChoosed.roomInfo);
        } else {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_not_enough_money'));
        }
    }
    closeUIRoom() {
        this.node.active = false;
    }
    // update (dt) {}
}
