import Dialog from "../../../Lobby/LobbyScript/Script/common/Dialog";
import Utils from "../../../Lobby/LobbyScript/Script/common/Utils";
import Http from "../../../Loading/src/Http";
import Configs from "../../../Loading/src/Configs";
import TaiXiuMiniController from "./TaiXiuMD5.TaiXiuMiniController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupGuide extends Dialog {

    @property(cc.Sprite)
    bgL: cc.Sprite = null;
    @property(cc.SpriteFrame)
    frame1: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    frame2: cc.SpriteFrame = null;

    show() {
        super.show();
        this.bgL.spriteFrame = this.frame1;
    }

    public actShowChungThuc() {
        this.bgL.spriteFrame = this.frame2;
    }
}
