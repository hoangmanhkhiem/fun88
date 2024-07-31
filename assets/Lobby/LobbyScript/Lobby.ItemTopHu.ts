import Tween from "./Script/common/Tween";
import Utils from "./Script/common/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    labelName: cc.Label = null;
    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property([cc.SpriteFrame])
    spriteFrames: cc.SpriteFrame[] = [];

    @property(cc.Sprite)
    iconX: cc.Sprite = null;
    @property([cc.SpriteFrame])
    spriteFramesX: cc.SpriteFrame[] = [];
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //this.icon.spriteFrame=SpriteFrame;
    }

    start() {
        this.icon.spriteFrame = this.spriteFrames[0];
    }
    public SetData(data: Tophudata) {
        if (data.valueX == 1) {
            this.iconX.node.active = true;
        }
        else {
            this.iconX.node.active = false;
        }
        this.labelName.string = data.gamename;
        this.ChangeIcon(data.gameid)
        Tween.numberTo(this.label, data.value, 3.0);
    }
    private ChangeIcon(id: string) {
        switch (id) {
            case "audition":
                this.icon.spriteFrame = this.spriteFrames[0];
                break;
            case "captain":
                this.icon.spriteFrame = this.spriteFrames[1];
                break;
            case "spartans":
                this.icon.spriteFrame = this.spriteFrames[2];
                break;
            case "tamhung":
                this.icon.spriteFrame = this.spriteFrames[3];
                break;
            case "aztec":
                this.icon.spriteFrame = this.spriteFrames[4];
                break;
            case "zeus":
                this.icon.spriteFrame = this.spriteFrames[5];
                break;
            case "gainhay":
                this.icon.spriteFrame = this.spriteFrames[6];
                break;
            case "rollRoye":
                this.icon.spriteFrame = this.spriteFrames[7];
                break;
            case "chiemtinh":
                this.icon.spriteFrame = this.spriteFrames[8];
                break;
            case "bikini":
                this.icon.spriteFrame = this.spriteFrames[4];
                break;
            case "galaxy":
                this.icon.spriteFrame = this.spriteFrames[1];
                break;
            default:
                this.icon.spriteFrame = this.spriteFrames[0];
                break;

        }
    }

    // update (dt) {}
}
export class Tophudata {
    gameid: string;
    gamename: string;
    value100: number = 0;
    value1000: number = 0;
    value10000: number = 0;
    valueX100: number = 0;
    valueX1000: number = 0;
    valueX10000: number = 0;
    constructor(gameid: string, gamename: string, value100: number, value1000: number, value10000: number=0, valueX100 = 0, valueX1000 = 0, valueX10000 = 0) {
        this.gameid = gameid;
        this.gamename = gamename;
        this.value100 = value100;
        this.value1000 = value1000;
        this.value10000 = value10000;
        this.valueX100 = valueX100;
        this.valueX1000 = valueX1000;
        this.valueX10000 = valueX10000;
    }
}
