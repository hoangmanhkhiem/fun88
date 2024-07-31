import BundleControl from "../../../Loading/src/BundleControl";
import Configs from "../../../Loading/src/Configs";
import App from "../Script/common/App";
import BroadcastReceiver from "../Script/common/BroadcastReceiver";
import Utils from "../Script/common/Utils";
import CardGameCmd from "../Script/networks/CardGame.Cmd";
import InPacket from "../Script/networks/Network.InPacket";
import TienLenNetworkClient from "../Script/networks/TienLenNetworkClient";
import SamNetworkClient from "../Script/networks/SamNetworkClient";
import SamCmd from "./Sam.Cmd";
import Tween from "../Script/common/Tween";
import InGame from "./Sam.InGame";
import Res from "../TienLenScript/TienLen.Resz";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Room extends cc.Component {

    public static instance: Room = null;

    @property(cc.Node)
    roomContent: cc.Node = null;
    @property(cc.Prefab)
    roomItem: cc.Node = null;
    @property(cc.Node)
    ingameNode: cc.Node = null;
    @property(cc.Label)
    lbCoin: cc.Label = null;
    @property(cc.Label)
    lblNickname: cc.Label = null;

    private ingame: InGame = null;
    private listRoom = [];

    onLoad() {
        Room.instance = this;
        Res.getInstance();
        this.ingame = this.ingameNode.getComponent(InGame);
        this.ingameNode.active = false;

        this.lbCoin.string = Utils.formatNumber(Configs.Login.Coin);
        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            this.lbCoin.string = Utils.formatNumber(Configs.Login.Coin);
        }, this);

        SamNetworkClient.getInstance().addOnClose(() => {
            this.actBack();
        }, this);

        this.lblNickname.string = Configs.Login.Nickname;

    }

    start() {
        SamNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            let cmdId = inpacket.getCmdId();
            //  cc.log("Sam cmd: ", cmdId);
            switch (cmdId) {
                case CardGameCmd.Code.LOGIN:
                    SamNetworkClient.getInstance().send(new SamCmd.SendReconnectRoom());
                    break;
                case CardGameCmd.Code.MONEY_BET_CONFIG: {
                    let res = new CardGameCmd.ResMoneyBetConfig(data);
                    //  cc.log(res);
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
                case SamCmd.Code.JOIN_ROOM_SUCCESS: {
                    let res = new SamCmd.ReceivedJoinRoomSuccess(data);
                    //  cc.log(res);
                    this.show(false);
                    this.ingame.show(true, res);
                    break;
                }
                case SamCmd.Code.UPDATE_GAME_INFO: {
                    let res = new SamCmd.ReceivedUpdateGameInfo(data);
                    //  cc.log("Sam UPDATE_GAME_INFO res : ", res);
                    this.show(false);
                    this.ingame.updateGameInfo(res);
                    break;
                }
                case SamCmd.Code.AUTO_START: {
                    let res = new SamCmd.ReceivedAutoStart(data);
                    //  cc.log(res);
                    this.ingame.autoStart(res);
                    break;
                }
                case SamCmd.Code.USER_JOIN_ROOM: {
                    let res = new SamCmd.ReceiveUserJoinRoom(data);
                    //  cc.log(res);
                    this.ingame.onUserJoinRoom(res);
                    break;
                }
                case SamCmd.Code.FIRST_TURN: {
                    let res = new SamCmd.ReceivedFirstTurnDecision(data);
                    //  cc.log(res);
                    this.ingame.firstTurn(res);
                    break;
                }
                case SamCmd.Code.CHIA_BAI: {
                    let res = new SamCmd.ReceivedChiaBai(data);
                    //  cc.log(res);
                    this.ingame.chiaBai(res)
                    break;
                }
                case SamCmd.Code.CHANGE_TURN: {
                    let res = new SamCmd.ReceivedChangeTurn(data);
                    //  cc.log(res);
                    this.ingame.changeTurn(res);
                    break;
                }
                case SamCmd.Code.DANH_BAI: {
                    let res = new SamCmd.ReceivedDanhBai(data);
                    //  cc.log(res);
                    this.ingame.submitTurn(res);
                    break;
                }
                case SamCmd.Code.BO_LUOT: {
                    let res = new SamCmd.ReceivedBoluot(data);
                    //  cc.log(res);
                    this.ingame.passTurn(res);
                    break;
                }
                case SamCmd.Code.END_GAME: {
                    let res = new SamCmd.ReceivedEndGame(data);
                    //  cc.log(res);
                    this.ingame.endGame(res);
                    break;
                }
                case SamCmd.Code.UPDATE_MATCH: {
                    let res = new SamCmd.ReceivedUpdateMatch(data);
                    //  cc.log(res);
                    this.ingame.updateMatch(res);
                    break;
                }
                case SamCmd.Code.USER_LEAVE_ROOM: {
                    let res = new SamCmd.UserLeaveRoom(data);
                    //  cc.log(res);
                    this.ingame.userLeaveRoom(res);
                    break;
                }
                // case SamCmd.Code.RECONNECT_GAME_ROOM: {
                //     let res = new SamCmd.UserLeaveRoom(data);
                //     //  cc.log(res);
                //     this.ingame.userLeaveRoom(res);
                //     break;
                // }
                case SamCmd.Code.BAO_SAM: {
                    let res = new SamCmd.ReceiveBaoSam(data);
                    //  cc.log(res);
                    this.ingame.onBaoSam(res);
                    break;
                }
                case SamCmd.Code.HUY_BAO_SAM: {
                    let res = new SamCmd.ReceiveHuyBaoSam(data);
                    //  cc.log(res);
                    this.ingame.onHuyBaoSam(res);
                    break;
                }
                case SamCmd.Code.QUYET_DINH_SAM: {
                    let res = new SamCmd.ReceivedQuyetDinhSam(data);
                    //  cc.log(res);
                    this.ingame.onQuyetDinhSam(res);
                    break;
                }
                case SamCmd.Code.REQUEST_LEAVE_ROOM: {
                    let res = new SamCmd.ReceivedNotifyRegOutRoom(data);
                    //  cc.log(res);
                    this.ingame.notifyUserRegOutRoom(res);
                    break;
                }
                case SamCmd.Code.CHAT_ROOM:
                    {
                        App.instance.showLoading(false);
                        let res = new SamCmd.ReceivedChatRoom(data);
                        //  cc.log("Sam CHAT_ROOM res : ", JSON.stringify(res));
                        this.ingame.playerChat(res);
                    }
                    break;
                case SamCmd.Code.CHAT_CHONG:
                    {
                        App.instance.showLoading(false);
                        let res = new SamCmd.ReceivedChatChong(data);
                        //  cc.log("SAM CHAT_CHONG res : ", JSON.stringify(res));
                        this.ingame.playerChatChong(res);
                    }
                    break;
            }
        }, this);

        //get list room
        this.refreshRoom();
        SamNetworkClient.getInstance().send(new SamCmd.SendReconnectRoom());
    }

    initRooms(rooms) {
        this.roomContent.removeAllChildren();
        let names = ["San bằng tất cả", "Nhiều tiền thì vào", "Dân chơi", "Bàn cho đại gia", "Tứ quý", "Bốn đôi thông", "Tới trắng", "Chặt heo"];
        for (let i = 0; i < rooms.length; i++) {
            let room = rooms[i];
            var item = cc.instantiate(this.roomItem);
            item.getChildByName("lblId").getComponent(cc.Label).string = (i + 1).toString();
            item.getChildByName("lblName").getComponent(cc.Label).string = names[Utils.randomRangeInt(0, names.length)];
            var txts = item.getComponentsInChildren(cc.Label);
            Tween.numberTo(txts[2], room.moneyRequire, 0.3);
            Tween.numberTo(txts[3], room.moneyBet, 0.3);
            txts[4].string = room.nPersion + "/" + room.maxUserPerRoom;
            var progress = item.getChildByName("playersProgress").getComponent(cc.Sprite);
            progress.fillRange = room.nPersion / room.maxUserPerRoom;
            var btnJoin = item.getComponentInChildren(cc.Button);
            btnJoin.node.on(cc.Node.EventType.TOUCH_END, (event) => {
                SamNetworkClient.getInstance().send(new CardGameCmd.SendJoinRoom(Configs.App.MONEY_TYPE, room.maxUserPerRoom, room.moneyBet, 0));
            });
            item.parent = this.roomContent;
        };
    }

    actBack() {
        SamNetworkClient.getInstance().close();
        App.instance.loadScene("Lobby");
    }

    public show(isShow: boolean) {
        this.node.active = isShow;
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
    }

    refreshRoom() {
        SamNetworkClient.getInstance().send(new CardGameCmd.SendMoneyBetConfig());
    }

    public actQuickPlay() {
        if (this.listRoom == null) {
            App.instance.alertDialog.showMsg("Không tìm thấy bàn nào phù hợp với bạn.");
            return;
        }
        //find all room bet < coin
        let listRoom = [];
        for (let i = 0; i < this.listRoom.length; i++) {
            if (this.listRoom[i].moneyRequire <= Configs.Login.Coin) {
                listRoom.push(this.listRoom[i]);
            }
        }
        if (listRoom.length <= 0) {
            App.instance.alertDialog.showMsg("Không tìm thấy bàn nào phù hợp với bạn.");
            return;
        }
        let randomIdx = Utils.randomRangeInt(0, listRoom.length);
        let room = listRoom[randomIdx];
        SamNetworkClient.getInstance().send(new CardGameCmd.SendJoinRoom(Configs.App.MONEY_TYPE, room.maxUserPerRoom, room.moneyBet, 0));
    }
}