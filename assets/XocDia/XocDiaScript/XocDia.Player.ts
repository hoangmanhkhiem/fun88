import App from "../../Lobby/LobbyScript/Script/common/App";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {
    
    @property(cc.Button)
    btnInvite: cc.Button = null;
    @property(cc.Node)
    info: cc.Node = null;

    @property(cc.Label)
    lblNickname: cc.Label = null;
    @property(cc.Label)
    lblCoin: cc.Label = null;
    @property(cc.Sprite)
    sprAvatar: cc.Sprite = null;
    @property(cc.Label)
    lbCoin: cc.Label = null;
    @property(cc.Node)
    boxWin: cc.Node = null;
    @property(cc.Vec2)
    chipsPoint: cc.Vec2 = cc.v2(0, 0);
    @property(cc.Vec2)
    chipsPoint2: cc.Vec2 = cc.v2(0, 0);
    @property(cc.Node)
    banker: cc.Node = null;
    @property(cc.Node)
    chatEmotion: cc.Node = null;
    @property(cc.Node)
    chatMsg: cc.Node = null;

    public nickname: string = "";
    public avatar: string = "";
    private timeoutChat = null;
    start() {
       
    }
    public leave() {
        this.nickname = "";

        if (this.btnInvite) this.btnInvite.node.active = true;
        if (this.info) this.info.active = false;
        this.lbCoin.node.active = false;
        this.boxWin.active = false;
        this.banker.active = false;
        this.unscheduleAllCallbacks();
    }

    public set(nickname: string, avatar: string, coin: number, isBanker: boolean) {
        this.nickname = nickname;
        this.lblNickname.string = nickname;
        if (this.lblNickname.string.length > 14) {
            this.lblNickname.string = this.lblNickname.string.substring(0, 11) + "...";
        }
        this.sprAvatar.spriteFrame = App.instance.getAvatarSpriteFrame(avatar);
        this.setCoin(coin);
        this.banker.active = isBanker;

        if (this.btnInvite) this.btnInvite.node.active = false;
        if (this.info) this.info.active = true;
    }

    public setCoin(coin: number) {
        this.lblCoin.string = Utils.formatMoney(coin);
    }

    public clearUI(){
        cc.Tween.stopAllByTarget(this.lbCoin.node);
        this.lbCoin.node.active = false;
        this.boxWin.active = false;
    }

    public showWinCoinString(coin: string) {
        this.lbCoin.node.active = true;
        this.boxWin.active = true;
        this.boxWin.getComponentInChildren(sp.Skeleton).setAnimation(0, "Win5", true);
        this.lbCoin.string = "" + (coin);
        cc.tween(this.lbCoin.node)
            .set({ scale: 0, y: -50 })
            .to(1.0, { scale: 0.6, y: 70 }, { easing: cc.easing.backOut })
            .delay(4.0)
            .call(() => {
                this.lbCoin.node.active = false;
                this.boxWin.active = false;
            }).start();
    }

    public showWinCoin(coin: number) {
        this.lbCoin.node.active = true;
        this.boxWin.active = true;
        this.boxWin.getComponentInChildren(sp.Skeleton).setAnimation(0, "Win5", true);
        this.lbCoin.string = "" + Utils.formatMoney(coin);
        cc.tween(this.lbCoin.node)
            .set({ scale: 0, y: -50 })
            .to(1.0, { scale: 0.6, y: 70 }, { easing: cc.easing.backOut })
            .delay(4.0)
            .call(() => {
                this.lbCoin.node.active = false;
                this.boxWin.active = false;
            }).start();
    }

    showChatEmotion(content) {
        this.chatEmotion.active = true;
        this.chatMsg.active = false;
        clearTimeout(this.timeoutChat);
        this.chatEmotion.getComponent(sp.Skeleton).setAnimation(0, content, true);
        this.timeoutChat = setTimeout(() => {
            this.chatEmotion.active = false;
            this.chatMsg.active = false;
        }, 3000);
    }

    showChatMsg(content) {

        this.chatEmotion.active = false;
        this.chatMsg.active = true;
        clearTimeout(this.timeoutChat);
        this.chatMsg.getComponentInChildren(cc.Label).string = content;
        this.timeoutChat = setTimeout(() => {
            this.chatEmotion.active = false;
            this.chatMsg.active = false;
        }, 5000);
    }

    hideChat() {
        clearTimeout(this.timeoutChat);
        this.chatEmotion.active = false;
        this.chatMsg.active = false;
    }

    public showRefundCoin(coin: number) {
        this.lbCoin.node.active = true;
        this.boxWin.getComponentInChildren(sp.Skeleton).setAnimation(0, "Win5", true);
        this.lbCoin.string = "" + Utils.formatMoney(coin);
        cc.tween(this.lbCoin.node)
            .set({ scale: 0, y: -50 })
            .to(1.0, { scale: 0.6, y: 70 }, { easing: cc.easing.backOut })
            .delay(4.0)
            .call(() => {
                this.lbCoin.node.active = false;
                this.boxWin.active = false;
            }).start();
    }
  
}
