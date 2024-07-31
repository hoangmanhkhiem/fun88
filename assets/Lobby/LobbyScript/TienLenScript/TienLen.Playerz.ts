import Configs from "../../../Loading/src/Configs";
import App from "../Script/common/App";
import Utils from "../Script/common/Utils";
import Card from "./TienLen.Card";
import Res from "./TienLen.Resz";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property(cc.Label)
    lblNickname: cc.Label = null;
    @property(cc.Label)
    lblCoin: cc.Label = null;
    @property(cc.Sprite)
    avatar: cc.Sprite = null;
    @property(cc.Sprite)
    card: cc.Sprite = null;
    @property(cc.Label)
    lblCardRemain: cc.Label = null;
    @property(cc.Sprite)
    timeRemain: cc.Sprite = null;
    @property(cc.Label)
    lbStatus: cc.Label = null;
    @property(cc.Node)
    cardLine: cc.Node = null;

    @property(cc.Node)
    chatEmotion: cc.Node = null;
    @property(cc.Node)
    chatMsg: cc.Node = null;

    ingame = false;
    active = false;
    chairLocal = -1;
    chairInServer = -1;
    type = 1;
    cards = [];
    state = 0;
    status = -1;
    info = null

    runRemain = null;

    private timeoutChat = null;

    setPlayerInfo(info) {
        //  cc.log("TLMN setPlayerInfo : ", info);
        this.lblNickname.string = info.nickName;
        this.setCoin(info.money);
        this.avatar.spriteFrame = App.instance.getAvatarSpriteFrame(info.avatar);
        this.node.active = true;

        this.active = true;
        this.info = info;
        this.offFirstCard();
    }

    setFirstCard(index) {
        this.card.spriteFrame = Res.getInstance().getCardFace(index);
        this.card.node.active = true;
        this.lblCardRemain.node.active = false;
    }

    offFirstCard() {
        this.card.node.active = false;
        this.card.spriteFrame = Res.getInstance().getCardFace(52);
    }

    setCardRemain(cardSize) {
        if (cardSize == 0) {
            this.card.node.active = false;
            return;
        }
        this.card.spriteFrame = Res.getInstance().getCardFace(52);
        this.card.node.active = true;
        this.lblCardRemain.node.active = true;
        this.lblCardRemain.string = cardSize;
    }

    setTimeRemain(remain = 0) {
        //  cc.log("OOOOOOOOOOOOOOOO : ", remain);
        if (remain == 0) {
            clearInterval(this.runRemain);
            this.timeRemain.fillRange = 0;
            return;
        } else {
            var refresh = 100;
            var step = refresh / remain / 1000;
            var sefl = this;
            var change = function () {
                if (!sefl || !sefl.timeRemain)
                    return;
                if (sefl.timeRemain.fillRange <= 0) {
                    clearInterval(sefl.runRemain);
                    sefl.timeRemain.fillRange = 0;
                    return;
                }
                sefl.timeRemain.fillRange -= step;
            }
            this.timeRemain.fillRange = 1;
            this.runRemain = setInterval(change, refresh);
        }
    }

    clearTimeRemain() {
        this.timeRemain.fillRange = 0;
    }

    setStatus(status = "") {
        var stt = status.toUpperCase();
        this.lbStatus.string = stt;
    }

    setNotify(data) {
        this.lbStatus.string = data;
        setTimeout(() => {
            this.lbStatus.string = "";
        }, 1000)
    }

    setCoin(coin) {
        this.lblCoin.string = Utils.formatNumber(coin);
    }

    setCoinChange(change) {
        if (change > 0) {
            //  cc.log("GGGG hide setCoinChange change : ", change);
            this.lbStatus.node.active = true;
            this.lbStatus.string = "+" + Utils.formatNumber(change);
        } else if (change < 0) {
            this.lbStatus.node.active = true;
            this.lbStatus.string = Utils.formatNumber(change);
        }
    }

    setLeaveRoom() {
        this.node.active = false;
        this.active = false;
        this.info = null;
    }

    setCardLine(cards) {
        cards.forEach(card => {
            var item = cc.instantiate(Res.getInstance().getCardItem());
            item.parent = this.cardLine;
            item.removeComponent(cc.Button);
            item.getComponent(Card).setCardData(card);
        });
    }

    clearCardLine() {
        this.cardLine.removeAllChildren();
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
        this.chatMsg.children[1].getComponent(cc.Label).string = content;
        this.timeoutChat = setTimeout(() => {
            this.chatEmotion.active = false;
            this.chatMsg.active = false;
        }, 3000);
    }

    hideChat() {
        clearTimeout(this.timeoutChat);
        this.chatEmotion.active = false;
        this.chatMsg.active = false;
    }
}


