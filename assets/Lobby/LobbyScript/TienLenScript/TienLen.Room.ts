import BundleControl from "../../../Loading/src/BundleControl";
import Configs from "../../../Loading/src/Configs";
import App from "../Script/common/App";
import BroadcastReceiver from "../Script/common/BroadcastReceiver";
import AudioManager from "../Script/common/Common.AudioManager";
import SPUtils from "../Script/common/SPUtils";
import Utils from "../Script/common/Utils";
import CardGameCmd from "../Script/networks/CardGame.Cmd";
import InPacket from "../Script/networks/Network.InPacket";
import TienLenNetworkClient from "../Script/networks/TienLenNetworkClient";
import TienLenCmd from "./TienLen.Cmd";
import TienLenGameLogic from "./TienLen.GameLogic";
import InGame from "./TienLen.InGame";
import Res from "./TienLen.Res";

enum audio_clip {
    BG = 0,
    LOSE = 1,
    WIN = 2,
    CHETMAYNE = 3,
    DODI = 4,
    HAINE = 5,
    MAYHABUOI = 6,
    THUADICUNG = 7,
    START_GAME = 8,
    CHIA_BAI = 9,
    DANH = 10
}
const { ccclass, property } = cc._decorator;
@ccclass("TienLen.InGame.SoundManager")
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
        if (SPUtils.getSoundVolumn() > 0) {
            this.effSound.clip = this.listAudio[indexAudio];
            this.effSound.play();
        }
    }
    stopBgMusic() {
        this.bgMusic.stop();
    }
}
@ccclass
export default class Room extends cc.Component {
    public static IS_SOLO = false;
    public static instance: Room = null;
    @property(cc.Sprite)
    sprAvatar: cc.Sprite = null;
    @property(cc.Node)
    roomContent: cc.Node = null;
    @property(cc.Prefab)
    roomItem: cc.Node = null;
    @property(cc.Node)
    ingameNode: cc.Node = null;
    @property(cc.Prefab)
    ingamePr: cc.Prefab = null;
    @property(cc.Label)
    lbCoin: cc.Label = null;
    @property(cc.Label)
    lblNickname: cc.Label = null;

    @property(cc.Prefab)
    prefabItemRoom: cc.Prefab = null;
    @property(SoundManager)
    soundManager: SoundManager = null;
    bundleGame = null;

    private ingame: InGame = null;
    private listRoom = [];

    onLoad() {
        Room.instance = this;
        Res.getInstance();
        this.soundManager.playBgMusic();
        this.sprAvatar.spriteFrame = App.instance.getAvatarSpriteFrame(Configs.Login.Avatar);
        this.lbCoin.string = Utils.formatNumber(Configs.Login.Coin);
        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            this.lbCoin.string = Utils.formatNumber(Configs.Login.Coin);
        }, this);
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

        TienLenNetworkClient.getInstance().addOnClose(() => {
            this.actBack();
        }, this);
        this.lblNickname.string = Configs.Login.Nickname;
    }

    start() {
        TienLenNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            let cmdId = inpacket.getCmdId();
             //Utils.Log("TienLen cmd: ", cmdId);
            switch (cmdId) {
                case CardGameCmd.Code.LOGIN:
                    TienLenNetworkClient.getInstance().send(new TienLenCmd.SendReconnectRoom());
                    break;
                case CardGameCmd.Code.MONEY_BET_CONFIG: {
                    let res = new CardGameCmd.ResMoneyBetConfig(data);
                     //Utils.Log(res);
                    this.listRoom = res.list;
                    this.initRooms(res.list);
                    break;
                }
                case CardGameCmd.Code.JOIN_ROOM_FAIL: {
                    let res = new CardGameCmd.ReceivedJoinRoomFail(data);
                    var e = "";
                    switch (res.error) {
                        case 1:
                            e = "L\u1ed7i ki\u1ec3m tra th\u00f4ng tin!";
                            break;
                        case 2:
                            e = "Kh\u00f4ng t\u00ecm \u0111\u01b0\u1ee3c ph\u00f2ng th\u00edch h\u1ee3p. Vui l\u00f2ng th\u1eed l\u1ea1i sau!";
                            break;
                        case 3:
                            e = "B\u1ea1n kh\u00f4ng \u0111\u1ee7 ti\u1ec1n v\u00e0o ph\u00f2ng ch\u01a1i n\u00e0y!";
                            break;
                        case 4:
                            e = "Kh\u00f4ng t\u00ecm \u0111\u01b0\u1ee3c ph\u00f2ng th\u00edch h\u1ee3p. Vui l\u00f2ng th\u1eed l\u1ea1i sau!";
                            break;
                        case 5:
                            e = "M\u1ed7i l\u1ea7n v\u00e0o ph\u00f2ng ph\u1ea3i c\u00e1ch nhau 10 gi\u00e2y!";
                            break;
                        case 6:
                            e = "H\u1ec7 th\u1ed1ng b\u1ea3o tr\u00ec!";
                            break;
                        case 7:
                            e = "Kh\u00f4ng t\u00ecm th\u1ea5y ph\u00f2ng ch\u01a1i!";
                            break;
                        case 8:
                            e = "M\u1eadt kh\u1ea9u ph\u00f2ng ch\u01a1i kh\u00f4ng \u0111\u00fang!";
                            break;
                        case 9:
                            e = "Ph\u00f2ng ch\u01a1i \u0111\u00e3 \u0111\u1ee7 ng\u01b0\u1eddi!";
                            break;
                        case 10:
                            e = "B\u1ea1n b\u1ecb ch\u1ee7 ph\u00f2ng kh\u00f4ng cho v\u00e0o b\u00e0n!"
                    }
                    App.instance.alertDialog.showMsg(e);
                    break;
                }
                case TienLenCmd.Code.JOIN_ROOM_SUCCESS: {
                    let res = new TienLenCmd.ReceivedJoinRoomSuccess(data);
                     //Utils.Log(res);
                    TienLenGameLogic.getInstance().initWith(res);
                    this.show(false);
                    this.ingame.show(true, res);
                    break;
                }
                case TienLenCmd.Code.UPDATE_GAME_INFO: {
                    let res = new TienLenCmd.ReceivedUpdateGameInfo(data);
                     //Utils.Log(res);
                    this.show(false);
                    this.ingame.updateGameInfo(res);
                    break;
                }
                case TienLenCmd.Code.AUTO_START: {
                    let res = new TienLenCmd.ReceivedAutoStart(data);
                     //Utils.Log(res);
                    TienLenGameLogic.getInstance().autoStart(res);
                    this.ingame.autoStart(res);
                    break;
                }
                case TienLenCmd.Code.USER_JOIN_ROOM: {
                    let res = new TienLenCmd.ReceiveUserJoinRoom(data);
                     //Utils.Log("TienLenCmd.Code.USER_JOIN_ROOM:\n", res);
                    this.ingame.onUserJoinRoom(res);
                    break;
                }
                case TienLenCmd.Code.FIRST_TURN: {
                    let res = new TienLenCmd.ReceivedFirstTurnDecision(data);
                     //Utils.Log(res);
                    // this.ingame.firstTurn(res);
                    this.ingame.dataFirstTurn = res;
                    break;
                }
                case TienLenCmd.Code.CHIA_BAI: {
                    let res = new TienLenCmd.ReceivedChiaBai(data);
                     //Utils.Log(" TienLenCmd.Code.CHIA_BAI:", res);
                    this.ingame.chiaBai(res)
                    break;
                }
                case TienLenCmd.Code.CHANGE_TURN: {
                    let res = new TienLenCmd.ReceivedChangeTurn(data);
                     //Utils.Log(res);
                    this.ingame.changeTurn(res);
                    break;
                }
                case TienLenCmd.Code.DANH_BAI: {
                    let res = new TienLenCmd.ReceivedDanhBai(data);
                     //Utils.Log(res);
                    this.ingame.submitTurn(res);
                    break;
                }
                case TienLenCmd.Code.BO_LUOT: {
                    let res = new TienLenCmd.ReceivedBoluot(data);
                     //Utils.Log(res);
                    this.ingame.passTurn(res);
                    break;
                }
                case TienLenCmd.Code.END_GAME: {
                    let res = new TienLenCmd.ReceivedEndGame(data);
                     //Utils.Log(res);
                    this.ingame.endGame(res);
                    break;
                }
                case TienLenCmd.Code.UPDATE_MATCH: {
                    let res = new TienLenCmd.ReceivedUpdateMatch(data);
                     //Utils.Log(res);
                    this.ingame.updateMatch(res);
                    break;
                }
                case TienLenCmd.Code.USER_LEAVE_ROOM: {
                    let res = new TienLenCmd.UserLeaveRoom(data);
                     //Utils.Log(res);
                    this.ingame.userLeaveRoom(res);
                    break;
                }
                case TienLenCmd.Code.REQUEST_LEAVE_ROOM: {
                    let res = new TienLenCmd.ReceivedNotifyRegOutRoom(data);
                     //Utils.Log(res);
                    this.ingame.notifyUserRegOutRoom(res);
                    break;
                }
                case TienLenCmd.Code.CHAT_ROOM:
                    {
                        App.instance.showLoading(false);
                        let res = new TienLenCmd.ReceivedChatRoom(data);
                         //Utils.Log("TLMN CHAT_ROOM res : ", JSON.stringify(res));
                        this.ingame.playerChat(res);
                    }
                    break;
                case TienLenCmd.Code.CHAT_CHONG:
                    {
                        App.instance.showLoading(false);
                        let res = new TienLenCmd.ReceivedChatChong(data);
                         //Utils.Log("TLMN CHAT_CHONG res : ", JSON.stringify(res));
                        this.ingame.playerChatChong(res);
                    }
                    break;
                case TienLenCmd.Code.WAIT_4_DOI_THONG:
                    {
                        App.instance.showLoading(false);
                        let res = new TienLenCmd.ReceivedWaitBonDoiThong(data);
                         //Utils.Log("TLMN WAIT_4_DOI_THONG res : ", JSON.stringify(res));
                        this.ingame.wait4doithong(res);
                    }
            }
        }, this);

        //get list room
        this.refreshRoom();
    }

    initRooms(rooms) {
        let arrBet = [];
        this.roomContent.removeAllChildren();
        let id = 0;
        let names = ["San bằng tất cả", "Nhiều tiền thì vào", "Dân chơi", "Bàn cho đại gia", "Tứ quý", "Bốn đôi thông", "Tới trắng", "Chặt heo"];
        for (let i = 0; i < rooms.length; i++) {
            let room = rooms[i];
            if ((Room.IS_SOLO && room.maxUserPerRoom == 2) || (!Room.IS_SOLO && room.maxUserPerRoom != 2)) {
                id++;

                let isExisted = arrBet.indexOf(room.moneyBet);
                if (isExisted == -1) {
                    arrBet.push(room.moneyBet);
                }
            }
        }
        arrBet.sort(function (a, b) {
            return a - b;
        });
         //Utils.Log("CardGame_ItemRoom arrBet Increase : ", arrBet);

        for (let index = 0; index < arrBet.length; index++) {
            let playerCount = 0;
            let maxUser = 0;
            let moneyRequire = 0;
            for (let a = 0; a < rooms.length; a++) {
                let room = rooms[a];

                if ((Room.IS_SOLO && room.maxUserPerRoom == 2) || (!Room.IS_SOLO && room.maxUserPerRoom != 2)) {
                    if (room.moneyBet == arrBet[index]) {
                        playerCount += room.nPersion;
                        maxUser = room.maxUserPerRoom;
                        moneyRequire = room.moneyRequire;
                    }
                }
            }
            let item = cc.instantiate(this.prefabItemRoom).getComponent("CardGame_ItemRoom");
            item.initItems({
                bet: arrBet[index],
                players: playerCount,
                maxUser: maxUser,
                moneyRequire: moneyRequire,
                gameId: Room.IS_SOLO ? 1 : 0  // 0 = TLMN, 1 = TLMN Solo, 2 = Sam Loc, 3 = Ba Cay, 4 = Bai Cao, 5 = Poker, 6 = Mau Binh
            });
            this.roomContent.addChild(item.node);
        }

        this.roomContent.parent.parent.getComponent(cc.ScrollView).scrollToBottom(0);
        this.roomContent.parent.parent.getComponent(cc.ScrollView).scrollToTop(2);

    }

    handleJoinRoom(info) {
         //Utils.Log("CardGame handleJoinRoom info : ", info);
        if (Configs.Login.Coin < info.moneyRequire) {
            App.instance.showToast(App.instance.getTextLang('txt_not_enough'))
            return;
        }
        if (this.ingame == null) {
            App.instance.showLoading(true);
            cc.assetManager.getBundle("TienLen").load("InGame", cc.Prefab, function (finish, total, item) {
            }, (err1, prefab: cc.Prefab) => {
                App.instance.showLoading(false);
                if (err1 != null) {
                     //Utils.Log("errr load game TIENLEN:", err1);
                } else {
                    this.ingame = cc.instantiate(prefab).getComponent("TienLen.InGame");
                    this.ingame.node.parent = this.node.parent;
                    this.ingame.node.active = false;
                    TienLenNetworkClient.getInstance().send(new CardGameCmd.SendJoinRoom(Configs.App.MONEY_TYPE, info.maxUser, info.bet, 0));
                }
            })
        } else {
            this.ingame.node.parent = this.node.parent;
            this.ingame.node.active = false;
            TienLenNetworkClient.getInstance().send(new CardGameCmd.SendJoinRoom(Configs.App.MONEY_TYPE, info.maxUser, info.bet, 0));
        }


    }

    actBack() {
        TienLenNetworkClient.getInstance().close();
        App.instance.loadScene("Lobby");
    }

    public show(isShow: boolean) {
        this.node.active = isShow;
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
    }

    refreshRoom() {
        TienLenNetworkClient.getInstance().send(new CardGameCmd.SendMoneyBetConfig());
    }

    public actQuickPlay() {
        if (this.listRoom == null) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_room_err2'));
            return;
        }
        //find all room bet < coin
        let cb = () => {
            let listRoom = [];
            for (let i = 0; i < this.listRoom.length; i++) {
                if (this.listRoom[i].moneyRequire <= Configs.Login.Coin) {
                    let room = this.listRoom[i];
                    if ((Room.IS_SOLO && room.maxUserPerRoom == 2) || (!Room.IS_SOLO && room.maxUserPerRoom != 2)) {
                        listRoom.push(room);
                    }
                }
            }
            if (listRoom.length <= 0) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_room_err2'));
                return;
            }
            let randomIdx = Utils.randomRangeInt(0, listRoom.length);
            let room = listRoom[randomIdx];
            TienLenNetworkClient.getInstance().send(new CardGameCmd.SendJoinRoom(Configs.App.MONEY_TYPE, room.maxUserPerRoom, room.moneyBet, 0));
        };
        if (this.ingame == null) {
            App.instance.showLoading(true);
            cc.assetManager.getBundle("TienLen").load("InGame", cc.Prefab, function (finish, total, item) {
            }, (err1, prefab: cc.Prefab) => {
                this.ingame = cc.instantiate(prefab).getComponent("TienLen.InGame");
                this.ingame.node.parent = this.node.parent;
                this.ingame.node.active = false;
                App.instance.showLoading(false);
                cb();
            })
        } else {
            this.ingame.node.parent = this.node.parent;
            this.ingame.node.active = false;
            cb();
        }

    }
}