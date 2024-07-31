import cmd from "./Lobby.Cmd";
import Tween from "./Script/common/Tween";
import InPacket from "./Script/networks/Network.InPacket";
import SlotNetworkClient from "./Script/networks/SlotNetworkClient";

var GAME_INDEX = {
    ANGRY: 0,
    BITCOIN: 1,
    CHIEMTINH: 2,
    THETHAO: 3,
    THANTAI: 4,
    DUAXE: 5
}
const { ccclass, property } = cc._decorator;

@ccclass
export default class MutipleJackpot extends cc.Component {

    @property([cc.Label])
    lbJackpot: cc.Label[] = [];
    @property([cc.SpriteFrame])
    sprBg: cc.SpriteFrame[] = [];
    @property(cc.Node)
    Bg: cc.Node = null;

    @property([cc.Vec2])
    position_lb_ANGRY: cc.Vec2[] = [];
    @property([cc.Vec2])
    position_lb_BITCOIN: cc.Vec2[] = [];
    @property([cc.Vec2])
    position_lb_CHIEMTINH: cc.Vec2[] = [];
    @property([cc.Vec2])
    position_lb_EURO: cc.Vec2[] = [];
    @property([cc.Vec2])
    position_lb_THANTAI: cc.Vec2[] = [];
    @property([cc.Vec2])
    position_lb_DUAXE: cc.Vec2[] = [];
    @property([cc.Vec2])
    position_init: cc.Vec2[] = [];
    listPosLb = [];
    gameType = "";
    dataJPGame = null;
    // LIFE-CYCLE CALLBACKS:
    /*name game :
    spartans-Thantai
    BENLEY:bitcoin
    audition:duaxe
    maybach:thethao
    tamhung:chimdien
    chiemtinh:chiemtinh
    
    */

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (touch: cc.Event.EventTouch) => {
            this.node.setPosition(this.node.position.add(cc.v3(touch.getDeltaX(), touch.getDeltaY(), 0)));
        })
    }
    setInfo(gametype) {
        this.gameType = gametype;
        switch (gametype) {
            case "ANGRY":
                this.listPosLb = this.position_lb_ANGRY;
                this.Bg.getComponent(cc.Sprite).spriteFrame = this.sprBg[GAME_INDEX.ANGRY]
                this.node.setPosition(this.position_init[GAME_INDEX.ANGRY])
                break;
            case "BITCOIN":
                this.listPosLb = this.position_lb_BITCOIN;
                this.Bg.getComponent(cc.Sprite).spriteFrame = this.sprBg[GAME_INDEX.BITCOIN]
                this.node.setPosition(this.position_init[GAME_INDEX.BITCOIN])
                break;
            case "CHIEMTINH":
                this.listPosLb = this.position_lb_CHIEMTINH;
                this.Bg.getComponent(cc.Sprite).spriteFrame = this.sprBg[GAME_INDEX.CHIEMTINH]
                this.node.setPosition(this.position_init[GAME_INDEX.CHIEMTINH])
                break;
            case "THETHAO":
                this.listPosLb = this.position_lb_EURO;
                this.Bg.getComponent(cc.Sprite).spriteFrame = this.sprBg[GAME_INDEX.THETHAO];
                this.node.setPosition(this.position_init[GAME_INDEX.THETHAO])
                break;
            case "THANTAI":
                this.listPosLb = this.position_lb_THANTAI;
                this.Bg.getComponent(cc.Sprite).spriteFrame = this.sprBg[GAME_INDEX.THANTAI];
                this.node.setPosition(this.position_init[GAME_INDEX.THANTAI]);
                break;
            case "DUAXE":
                this.listPosLb = this.position_lb_DUAXE;
                this.Bg.getComponent(cc.Sprite).spriteFrame = this.sprBg[GAME_INDEX.DUAXE]
                this.node.setPosition(this.position_init[GAME_INDEX.DUAXE])
                break;
        }
        for (let i = 0; i < this.listPosLb.length; i++) {
            this.lbJackpot[i].node.setPosition(cc.v2(this.listPosLb[i].x-7, this.listPosLb[i].y + 10));
        }
        SlotNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeHallSlot());

        SlotNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmd.Code.UPDATE_JACKPOT_SLOTS:
                    {
                        let res = new cmd.ResUpdateJackpotSlots(data);
                        let resJson = JSON.parse(res.pots);
                        //  //Utils.Log("UPDATE_JACKPOT_SLOTS:" + JSON.stringify(resJson['maybach']));
                        //  //Utils.Log("gametype="+this.gameType);
                        switch (this.gameType) {
                            case "ANGRY":
                                this.dataJPGame = resJson['tamhung'];
                                break;
                            case "BITCOIN":
                                this.dataJPGame = resJson['benley'];
                                break;
                            case "CHIEMTINH":
                                this.dataJPGame = resJson['chiemtinh'];
                                break;
                            case "THETHAO":
                                this.dataJPGame = resJson['maybach'];
                                break;
                            case "THANTAI":
                                this.dataJPGame = resJson['spartan'];
                                break;
                            case "DUAXE":
                                this.dataJPGame = resJson['audition'];
                                break;
                        }
                    }
                    break;
            }
            //  //Utils.Log("dataJP==", this.dataJPGame);
            if(this.dataJPGame!=null){
                Tween.numberTo(this.lbJackpot[0], this.dataJPGame['100']['p'], 3.0);
                Tween.numberTo(this.lbJackpot[1], this.dataJPGame['1000']['p'], 3.0);
                Tween.numberTo(this.lbJackpot[2], this.dataJPGame['10000']['p'], 3.0);
            }
        }, this);
    }
    start() {

    }
    onDestroy() {
        SlotNetworkClient.getInstance().send(new cmd.ReqUnSubcribeHallSlot());
    }
    // update (dt) {}
}
