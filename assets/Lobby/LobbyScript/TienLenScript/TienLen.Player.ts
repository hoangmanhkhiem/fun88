import Configs from "../../../Loading/src/Configs";
import App from "../Script/common/App";
import Utils from "../Script/common/Utils";
import Card from "./TienLen.Card";
import Res from "./TienLen.Res";


const { ccclass, property } = cc._decorator;
enum STATE_GAME {
    WAITING = 0,
    PLAYING = 1,
    FINISH = 2,
}

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

    @property(cc.Node)
    clockTurn: cc.Node = null;

    @property(sp.Skeleton)
    animWinLose: sp.Skeleton = null;

    @property(sp.Skeleton)
    animToiTrang: sp.Skeleton = null;

    @property([cc.BitmapFont])
    fontNumber: cc.BitmapFont[] = [];
    @property(cc.Font)
    fontNormal: cc.Font = null;

    @property(cc.Node)
    ic_back_game: cc.Node = null;

    cardDeal = [];
    ingame = false;
    active = false;
    chairLocal = -1;
    chairInServer = -1;
    type = 1;
    cards = [];
    state = STATE_GAME.WAITING;
    status = -1;
    info = null;

    runRemain = null;

    private timeoutChat = null;

    setPlayerInfo(info) {
         //Utils.Log("TLMN setPlayerInfo : ", info);
        this.lblNickname.string = info.nickName;
        this.setCoin(info.money);
        if (info.nickName == Configs.Login.Nickname) {
            this.avatar.spriteFrame = App.instance.getAvatarSpriteFrame(Configs.Login.Avatar);
        }
        this.node.active = true;

        this.active = true;
        this.info = info;
        this.ic_back_game.active = false;
        this.offFirstCard();
        this.clockTurn.active = false;
    }
    setStateViewing(state) {
        cc.find("/avatar/face", this.node).color = state ? cc.Color.GRAY : cc.Color.WHITE;
        if (state) {
            this.state = STATE_GAME.WAITING;
            this.setStatus("Đang Xem");
        } else {
            this.state = STATE_GAME.PLAYING;
            this.setStatus();
        }

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
         //Utils.Log("card size==" + cardSize);
        if (cardSize == 0) {
            this.card.node.active = false;
            return;
        }
         //Utils.Log("Active carrd size");
        this.card.spriteFrame = Res.getInstance().getCardFace(52);
        this.card.node.active = true;
        this.lblCardRemain.node.active = true;
        this.lblCardRemain.string = cardSize;
    }

    setTimeRemain(remain = 0) {
        if (remain == 0) {
            cc.Tween.stopAllByTarget(this.clockTurn);
            this.clockTurn.active = false;
            return;
        } else {
            this.clockTurn.active = true;
            this.clockTurn.getComponentInChildren(cc.Label).string = remain + "";
            cc.Tween.stopAllByTarget(this.clockTurn);
            cc.tween(this.clockTurn)
                .set({ angle: 0 })
                .to(0.25, { angle: 5 }).to(0.25, { angle: 0 })
                .to(0.25, { angle: -5 })
                .to(0.25, { angle: 0 })
                .call(() => {
                    remain--;
                    this.setTimeRemain(remain);
                }).start();
        }
    }

    clearTimeRemain() {
        this.timeRemain.fillRange = 0;
    }

    setStatus(status = "") {
        if (status == "") {
            this.lbStatus.node.active = false;
            return;
        }

        this.lbStatus.node.active = true;
        this.lbStatus.fontSize = 22;
        this.lbStatus.font = this.fontNormal;
        this.lbStatus.node.color = new cc.Color().fromHEX("#F7E0A0");
        var stt = status.toUpperCase();
        this.lbStatus.string = stt;
    }

    setNotify(data) {
        this.lbStatus.font = this.fontNormal;
        this.lbStatus.node.color = new cc.Color().fromHEX("#F7E0A0");
        this.lbStatus.string = data;
        this.lbStatus.node.active = true;
        cc.Tween.stopAllByTarget(this.lbStatus.node);
        this.lbStatus.fontSize = 32;
        cc.tween(this.lbStatus.node).set({ y: 0, scale: 0 }).to(0.3, { scale: 1.0 }, { easing: cc.easing.backOut }).start();
        setTimeout(() => {
            this.lbStatus.node.active = false;
        }, 1000)
    }

    setCoin(coin) {
        this.lblCoin.string = Utils.formatNumber(coin);
    }

    setCoinChange(change) {
         //Utils.Log("set coin change:" + change);
        this.lbStatus.node.color = cc.Color.WHITE;
        this.lbStatus.node.active = true;
        this.lbStatus.string = "";
        if (change > 0) {
            this.lbStatus.font = this.fontNumber[0];
            this.lbStatus.string = "+" + Utils.formatNumber(change);
        } else if (change < 0) {
            this.lbStatus.font = this.fontNumber[1];
            this.lbStatus.string = Utils.formatNumber(change);
        }
        this.lbStatus.spacingX = -1;
        this.lbStatus.fontSize = 25;
        cc.Tween.stopAllByTarget(this.lbStatus.node);
        cc.tween(this.lbStatus.node).set({ y: 0, scale: 1.0 }).to(1.0, { y: 6, scale: 1.2 }, { easing: cc.easing.backOut }).start();
    }
    setLeaveRoom() {
        this.node.active = false;
        this.active = false;
        this.info = null;
    }
    setBackGame(state) {
        this.ic_back_game.active = state;
    }
    setCardLine(cards) {
        this.cardLine.getComponent(cc.Layout).enabled = true;
        cards.forEach(card => {
            var item = cc.instantiate(Res.getInstance().getCardItem());
            item.parent = this.cardLine;
            item.removeComponent(cc.Button);
            item.getComponent(Card).setCardData(card);
            item.opacity = 0;
        });
        setTimeout(() => {
            if (this.node.x > 0) {
                this.cardLine.getComponent(cc.Layout).enabled = false;
                let size = this.cardLine.childrenCount;
                for (let i = 0; i < size; i++) {
                    this.cardLine.children[i].zIndex = size - i;
                    cc.tween(this.cardLine.children[i]).to(0.1 * i, { opacity: 255 }).start();
                }
            } else {
                this.cardLine.getComponent(cc.Layout).enabled = false;
                let size = this.cardLine.childrenCount;
                for (let i = 0; i < size; i++) {
                    this.cardLine.children[i].zIndex = i;
                    cc.tween(this.cardLine.children[i]).to(0.1 * i, { opacity: 255 }).start();
                }
            }
        }, 100);

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
    showAnimWinLose(state) {
        this.animWinLose.node.active = true;
        let animName = state ? "thắng3" : "thua";
        this.animWinLose.node.scale = state ? 0.6 : 0.7;
        let posAnim = state ? cc.v2(0, -81) : cc.v2(-40, -77);
        this.animWinLose.node.setPosition(posAnim);
        this.animWinLose.setAnimation(0, animName, true);
    }
    showAnimToiTrang(winType) {
        let animName = "5 đoi thòng";
        switch (winType) {
            case 4:
                animName = "sanh rong"
                break;
            case 5:
                animName = "tu quy hai"
                break;
            case 6:
                animName = "5 đoi thòng"
                break;
            case 7:
                animName = "6 doi"
                break;
        }
        this.animToiTrang.node.active = true;
        this.animToiTrang.setAnimation(0, animName, true);
    }
}
