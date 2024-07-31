import Configs from "../../Loading/src/Configs";
import XocDiaNetworkClient from "./XocDia.XocDiaNetworkClient";
import cmd from "./XocDia.Cmd";

import XocDiaController from "./XocDia.XocDiaController";
import App from "../../Lobby/LobbyScript/Script/common/App";
import BroadcastReceiver from "../../Lobby/LobbyScript/Script/common/BroadcastReceiver";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Lobby extends cc.Component {

    @property(cc.Prefab)
    itemPrefab :cc.Prefab = null;
    @property(cc.Sprite)
    sprAvatar:cc.Sprite = null;
    @property(cc.Label)
    lblNickname: cc.Label = null;
    @property(cc.Label)
    lblCoin: cc.Label = null;

    @property(cc.Node)
    listItems: cc.Node = null;
    
    @property(cc.ScrollView)
    scrRoom: cc.ScrollView = null;

    private inited = false;
    private dataRoom = [];
    // onLoad () {}

    start() {

    }
    private isSortRoom = false;
    onBtnSortRoomId(){
        if(this.isSortRoom == false){
            if(this.dataRoom){
                this.dataRoom.sort((x, y) => {
                    return x.id - y.id;
                })
            }
        }
        else{
            if(this.dataRoom){
                this.dataRoom.sort((x, y) => {
                    return y.id - x.id;
                })
            }
        }
        this.isSortRoom = !this.isSortRoom;
        this.scrRoom.content.removeAllChildren();
        for(var i=0;i<this.dataRoom.length;i++){
            var item = cc.instantiate(this.itemPrefab);
            item.active = true;
            this.scrRoom.content.addChild(item);
            item.getComponent("XocDia.Room").init(this.dataRoom[i]);
        }
    }
    private isSortMoney;
    onBtnSortRoomMoney(){
        //  cc.log("onBtnSortRoomMoney");
        if(this.isSortMoney == false){
            if(this.dataRoom){
                this.dataRoom.sort((x, y) => {
                    return x.requiredMoney - y.requiredMoney;
                })
            }
        }
        else{
            if(this.dataRoom){
                this.dataRoom.sort((x, y) => {
                    return y.requiredMoney - x.requiredMoney;
                })
            }
        }
        this.isSortMoney = !this.isSortMoney;
        this.scrRoom.content.removeAllChildren();
        for(var i=0;i<this.dataRoom.length;i++){
            var item = cc.instantiate(this.itemPrefab);
            item.active = true;
            this.scrRoom.content.addChild(item);
            item.getComponent("XocDia.Room").init(this.dataRoom[i]);
        }
    }
    public init() {
        if (this.inited) return;
        this.inited = true;
        this.sprAvatar.spriteFrame = App.instance.getAvatarSpriteFrame(Configs.Login.Avatar);
        this.lblNickname.string = Configs.Login.Nickname;
        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            if (!this.node.active) return;
            this.lblCoin.string = Utils.formatNumber(Configs.Login.Coin);
        }, this);
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

        XocDiaNetworkClient.getInstance().addListener((data) => {
            if (!this.node.active) return;
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.LOGIN:
                    {
                        XocDiaNetworkClient.getInstance().send(new cmd.SendReconnect());
                    }
                    break;
                case cmd.Code.GETLISTROOM:
                    {
                        let res = new cmd.ReceiveGetListRoom(data);
                        //  cc.log("GETLISTROOM:" + JSON.stringify(res));
                        //  cc.log(res);
                        this.scrRoom.content.removeAllChildren();
                        this.dataRoom = res.list;
                        this.dataRoom.sort((x, y) => {
                            return x.id - y.id;
                        })
                        for(var i=0;i<this.dataRoom.length;i++){
                            var item = cc.instantiate(this.itemPrefab);
                            item.active = true;
                            this.scrRoom.content.addChild(item);
                            item.getComponent("XocDia.Room").init(this.dataRoom[i]);
                        }
                        // let cb = (item, itemData) => {
                        //     item.getComponent("XocDia.Room").init(itemData);
                        //     item.active = true;
                        // }
                        // this.dataRoom = res.list;
                        // this.dataRoom.sort((x, y) => {
                        //     return x.moneyBet - y.moneyBet;
                        // })
                        // this.scrRoom.node.getComponent("ScrollViewControl").setDataList(cb, this.dataRoom);
                        
                    }
                    break;
                case cmd.Code.JOIN_ROOM_FAIL:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceiveJoinRoomFail(data);
                        //  cc.log(res);
                        let msg = "Lỗi " + res.getError() + ", không xác định.";
                        switch (res.getError()) {
                            case 1:
                                msg = App.instance.getTextLang("txt_room_err1")
                                break;
                            case 2:
                                msg = App.instance.getTextLang("txt_room_err2")
                                break;
                            case 3:
                                msg = App.instance.getTextLang("txt_room_err3")
                                break;
                            case 4:
                                msg = App.instance.getTextLang("txt_room_err2")
                                break;
                            case 5:
                                msg = App.instance.getTextLang("txt_room_err5")
                                break;
                            case 6:
                                msg = App.instance.getTextLang("txt_room_err6")
                                break;
                            case 7:
                                msg = App.instance.getTextLang("txt_room_err2")
                                break;
                            case 8:
                                msg = App.instance.getTextLang("txt_room_err11")
                                break;
                            case 9:
                                msg = App.instance.getTextLang("txt_room_err9")
                                break;
                            case 10:
                                msg = App.instance.getTextLang("txt_room_err10")
                        }
                        App.instance.alertDialog.showMsg(msg);
                    }
                    break;
                case cmd.Code.JOIN_ROOM_SUCCESS:
                    {
                        App.instance.showLoading(false);
                        let res = new cmd.ReceiveJoinRoomSuccess(data);
                        XocDiaController.instance.showGamePlay(res);
                    }
                    break;
                default:
                    //  cc.log("--inpacket.getCmdId(): " + inpacket.getCmdId());
                    break;
            }
        }, this);

    }

    public show() {
        this.node.active = true;
        this.actRefesh();
        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
    }

    public actQuickPlay() {
        XocDiaNetworkClient.getInstance().send(new cmd.SendJoinRoomById(2);
    }

    public actRefesh() {
        // for (let i = 0; i < this.listItems.childrenCount; i++) {
        //     if (this.listItems.children[i] != this.itemTemplate) {
        //         this.listItems.children[i].destroy();
        //     }
        // }
        XocDiaNetworkClient.getInstance().send(new cmd.SendGetListRoom());
    }

    public actBack() {
        XocDiaNetworkClient.getInstance().close();
        App.instance.loadScene("Lobby");
    }

    public actCreateTable() {
        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_room_err12'));
    }

    // update (dt) {}
}
