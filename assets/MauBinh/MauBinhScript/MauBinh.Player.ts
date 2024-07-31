import App from "../../Lobby/LobbyScript/Script/common/App";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {
    @property(cc.Node)
    btnInvite: cc.Node = null;
    @property(cc.Node)
    avatar: cc.Node = null;
    @property(cc.Node)
    cardReady: cc.Node = null;
    @property(cc.Node)
    cardReal: cc.Node = null;
    @property(cc.Label)
    userName: cc.Label = null;
    @property(cc.Label)
    userGold: cc.Label = null;
    @property(cc.Node)
    owner: cc.Node = null;
    @property(cc.Node)
    cardsName: cc.Node = null;
    @property(cc.Node)
    actionViewer: cc.Node = null;
    @property(cc.Node)
    actionThinking: cc.Node = null;
    @property(cc.Node)
    actionWin: cc.Node = null;
    @property(cc.Label)
    goldWin: cc.Label = null;
    @property(cc.Node)
    actionLose: cc.Node = null;
    @property(cc.Label)
    goldLose: cc.Label = null;
    @property(cc.Node)
    actionXepXong: cc.Node = null;
    @property(cc.Node)
    actionDangXep: cc.Node = null;
    @property(cc.Node)
    notify: cc.Node = null;
    @property(cc.Node)
    chatEmotion: cc.Node = null;
    @property(cc.Node)
    chatMsg: cc.Node = null;
    @property(cc.Node)
    shadowAvatar: cc.Node = null;
    @property(cc.Node)
    shadowInfo: cc.Node = null;
    @property(cc.SpriteFrame)
    spriteCardBack: cc.SpriteFrame = null;

    @property(cc.Node)
    resultGame: cc.Node = null;
    @property(cc.SpriteFrame)
    spriteResultChi: cc.SpriteFrame[] = [];
    @property(cc.SpriteFrame)
    spriteResultGeneral: cc.SpriteFrame[] = [];
    @property(cc.Node)
    actionGoldSoChi: cc.Node = null;

    private timeoutNotify = null;
    private timeoutShowCardName = null;
    private timeoutChat = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    showChatEmotion(content) {
        this.node.children[6].active = true;
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
        this.node.children[6].active = true;
        this.chatEmotion.active = false;
        this.chatMsg.active = true;
        clearTimeout(this.timeoutChat);
        this.chatMsg.children[1].getComponent(cc.Label).string = content;
        this.timeoutChat = setTimeout(() => {
            this.chatEmotion.active = false;
            this.chatMsg.active = false;
        }, 3000);
    }

    showBtnInvite(state) {
        this.btnInvite.active = state;
    }

    setOwner(state) {
        // this.owner.active = state;
        this.owner.active = false;
    }

    setAvatar(avatar) {
        this.node.children[1].active = true;
        this.avatar.getComponent(cc.Sprite).spriteFrame = App.instance.getAvatarSpriteFrame(avatar);
    }

    setIsViewer(state) {
        this.shadowAvatar.active = state;
        this.shadowInfo.active = state;
    }

    setName(data) {
        this.node.children[3].active = true;
        this.userName.string = data;
    }

    scaleCardReal(state) {
        this.cardReal.scale = state;
    }

    showCardReady(state) {
        this.node.children[2].active = true;
        this.cardReady.active = state;
    }

    showCardReal(state) {
        this.node.children[2].active = true;
        this.scaleCardReal(1);
        this.cardReal.active = state;
    }

    prepareToTransform() {
        for (let index = 0; index < 13; index++) {
            this.prepareCardReal(index);
        }
    }

    prepareCardReal(pos) {
        this.cardReal.children[pos].runAction(cc.scaleTo(0, 0, 1));
    }

    transformToCardReal(cardPos, spriteCard, seatId) {
        this.node.children[2].active = true;
        this.cardReal.active = true;
        if (seatId == 0) {
            this.cardReal.children[cardPos].children[1].getComponent(cc.Sprite).spriteFrame = spriteCard;

            this.cardReady.children[cardPos].runAction(
                cc.sequence(
                    cc.scaleTo(0.15, 0, 1),
                    cc.callFunc(() => {

                    })
                )
            );
            this.cardReal.children[cardPos].runAction(
                cc.sequence(
                    cc.delayTime(0.15),  // 2
                    cc.scaleTo(0.15, 1, 1),
                    cc.callFunc(() => {

                    })
                )
            );
        } else {
            this.cardReal.children[cardPos].children[0].getComponent(cc.Sprite).spriteFrame = spriteCard;
            this.cardReal.children[cardPos].runAction(
                cc.sequence(
                    cc.scaleTo(0.15, 1, 1),
                    cc.callFunc(() => {

                    })
                )
            );
        }
    }

    showCardName(img) {
        this.cardsName.active = true;
        this.cardsName.getComponent(cc.Sprite).spriteFrame = img;
        clearTimeout(this.timeoutShowCardName);
        this.timeoutShowCardName = setTimeout(() => {
            this.cardsName.active = false;
        }, 4500);
    }

    setGold(data) {
        // this.actionViewer.active = false;
        this.actionThinking.active = false;

        this.showGold(true);
        this.userGold.string = this.formatGold(data);
    }

    setCardReal(data, index) {
        this.cardReal.children[index].children[1].getComponent(cc.Sprite).spriteFrame = data;
    }

    showPlayCountdown() {
        this.node.children[4].active = true;
        this.actionThinking.active = true;
        this.processThinking(0);
        // 1 = Full | 0 = Empty
    }

    hidePlayCountdown() {
        this.actionThinking.active = false;
    }

    processThinking(rate) {
        //  cc.log("MauBinh_Player processThinking rate : ", rate);
        this.actionThinking.getComponent(cc.Sprite).fillRange = rate;
    }

    showGold(state) {
        this.node.children[3].children[2].active = state;
    }

    prepareFxAction() {
        // this.showGold(false);
        this.node.children[4].active = true;
        this.resetAction();
    }

    // Fx Action
    playFxViewer() {
        this.prepareFxAction();
        this.actionViewer.active = true;
    }

    playFxDangXep() {
        this.prepareFxAction();
        this.actionDangXep.active = true;
        this.actionXepXong.active = false;
    }

    playFxXepXong() {
        this.prepareFxAction();
        this.actionDangXep.active = false;
        this.actionXepXong.active = true;
    }

    playFxSoChiTotal(img) {
        this.node.children[7].active = true;
        this.resultGame.children[3].active = true;
        this.resultGame.children[3].children[0].getComponent(cc.Sprite).spriteFrame = img;
        this.resultGame.children[3].children[1].getComponent(cc.Label).string = "";
        this.resultGame.children[3].getComponent(cc.Animation).play();
    }

    playFxResultGeneral(seatId, isGood, type, isSoChi) {
        this.node.children[7].active = true;
        this.resultGame.children[3].active = true;
        if (seatId == 0) {
            this.resultGame.children[3].y = isSoChi == 0 ? 30 : 100;
            this.resultGame.children[3].children[0].scale = isSoChi == 0 ? 1 : 0.5;
            this.resultGame.children[3].children[1].scale = isSoChi == 0 ? 1 : 0.5;
        }
        this.resultGame.children[3].children[0].getComponent(cc.Sprite).spriteFrame
            = isGood ? this.spriteResultGeneral[0] : this.spriteResultGeneral[1];

        this.resultGame.children[3].children[1].getComponent(cc.Label).string = isGood ? type : "";
        this.resultGame.children[3].getComponent(cc.Animation).play();
    }

    playFxCompareChi(id, img) {
        //  cc.log("MauBinh_Player playFxCompareChi id : ", id);
        this.node.children[7].active = true;
        this.resultGame.children[id - 1].active = true;
        this.resultGame.children[id - 1].children[0].getComponent(cc.Sprite).spriteFrame = img;
        this.resultGame.children[id - 1].getComponent(cc.Animation).play();
    }

    playFxGoldSoChi(goldChi) {
        //  cc.log("MauBinh_Player playFxGoldSoChi goldChi : ", goldChi);
        if (goldChi >= 0) {
            this.actionGoldSoChi.active = true;
            this.actionGoldSoChi.children[1].getComponent(cc.Label).string = "+" + goldChi + " Chi";
        } else if (goldChi < 0) {
            this.actionGoldSoChi.active = true;
            this.actionGoldSoChi.children[1].getComponent(cc.Label).string = goldChi + " Chi";
        }
        setTimeout(() => {
            this.actionGoldSoChi.active = false;
        }, 2500);
    }

    playFxWinSoChi(result) {
        //  cc.log("MauBinh_Player playFxWinSoChi result : ", result);
        this.node.children[4].active = true;
        this.actionWin.active = true;
        this.actionWin.children[1].active = true;
        this.goldWin.string = "+" + result + " Chi";
        setTimeout(() => {
            this.node.children[4].active = false;
        }, 2000);
    }

    playFxLoseSoChi(result) {
        //  cc.log("MauBinh_Player playFxLoseSoChi result : ", result);
        this.node.children[4].active = true;
        this.actionLose.active = true;
        this.actionLose.children[1].active = true;
        this.goldLose.string = result + " Chi";
        setTimeout(() => {
            this.node.children[4].active = false;
        }, 2000);
    }

    fxWin(playerInfo) {
        //  cc.log("MauBinh_Player playFxWin playerInfo : ", playerInfo);
        this.node.children[4].active = true;
        this.actionLose.active = false;
        this.actionWin.active = true;
        this.actionWin.children[1].active = true;
        this.goldWin.node.stopAllActions();
        this.fxGoldChange(0, playerInfo.moneyChange, this.goldWin.node);
        if (playerInfo.money != -1) {
            this.setGold(this.formatGold(playerInfo.money));
        }
        setTimeout(() => {
            this.actionWin.active = false;
            this.node.children[4].active = false;
        }, 2500);
    }

    fxLose(playerInfo) {
        //  cc.log("MauBinh_Player playFxLose playerInfo : ", playerInfo);
        this.node.children[4].active = true;
        this.actionWin.active = false;
        this.actionLose.active = true;
        this.actionLose.children[1].active = true;
        this.goldLose.node.stopAllActions();
        this.fxGoldChange(0, playerInfo.moneyChange, this.goldLose.node);
        if (playerInfo.money != -1) {
            this.setGold(this.formatGold(playerInfo.money));
        }
        setTimeout(() => {
            this.actionLose.active = false;
            this.node.children[4].active = false;
        }, 2500);
    }

    shadowCardReady(state) {
        for (let index = 0; index < 13; index++) {
            this.cardReady.children[index].color = state ? cc.Color.GRAY : cc.Color.WHITE;
        }
    }

    shadowCardReal(state) {
        for (let index = 0; index < 13; index++) {
            this.cardReal.children[index].children[0].color = state ? cc.Color.GRAY : cc.Color.WHITE;
        }
    }

    shadowCard(index, state) {
        this.cardReal.children[index].children[1].color = state ? cc.Color.GRAY : cc.Color.WHITE;
    }

    setCardWin(pos, state) {
        this.cardReal.children[pos].children[0].color = state ? cc.Color.WHITE : cc.Color.GRAY;
    }

    // notify
    showNotify(content) {
        this.notify.active = true;
        this.notify.children[1].getComponent(cc.Label).string = content;
        clearTimeout(this.timeoutNotify);
        this.timeoutNotify = setTimeout(() => {
            this.notify.active = false;
        }, 1500);
    }

    // reset
    resetResultGame() {
        for (let index = 0; index < 4; index++) {
            this.resultGame.children[index].active = false;
        }
    }

    resetResultChi(chiId) {
        this.resultGame.children[chiId - 1].active = false;
    }

    resetAction() {
        for (let index = 0; index < this.node.children[4].childrenCount; index++) {
            this.node.children[4].children[index].active = false;
        }
    }

    resetMatchHistory(seatId) {
        // card
        this.resetCardReady(seatId);
        this.resetCardReal(seatId);
        this.node.children[2].active = false;

        // Info
        this.showGold(true);
        this.cardsName.active = false;

        // Action
        this.resetAction();
    }

    resetCardReady(seatId) {
        if (seatId == 0) {
            for (let index = 0; index < 13; index++) {
                this.cardReady.children[index].scale = 1;
            }
        }
        this.cardReady.active = false;
        // this.shadowCardReady(false);
    }

    resetCardReal(seatId) {
        this.cardReal.active = false;
        for (let index = 0; index < 13; index++) {
            this.cardReal.children[index].children[seatId == 0 ? 1 : 0].getComponent(cc.Sprite).spriteFrame = this.spriteCardBack;
        }
        this.shadowCardReal(false);
    }

    resetPlayerInfo(seatId) {
        // Hide node Lv1
        for (let index = 0; index < this.node.childrenCount; index++) {
            this.node.children[index].active = false;
        }

        // reset card
        for (let index = 0; index < 13; index++) {
            this.cardReal.children[index].children[seatId == 0 ? 1 : 0].getComponent(cc.Sprite).spriteFrame = this.spriteCardBack;
        }

        this.cardReady.active = false;
        this.cardReal.active = false;

        this.cardsName.active = false;

        // reset Action
        this.actionViewer.active = false;
        this.actionThinking.active = false;
        this.actionWin.active = false;
        this.actionLose.active = false;

        // reset Viewer
        this.setIsViewer(true);
    }

    fxGoldChange(goldStart, goldEnd, node) {
        var goldAdd = goldEnd - goldStart;
        node.getComponent(cc.Label).string = this.formatGold(goldStart);

        var steps = 10;
        var deltaGoldAdd = Math.floor(goldAdd / steps);

        var rep = cc.repeat(
            cc.sequence(
                cc.delayTime(0.05),
                cc.callFunc(() => {
                    goldStart += deltaGoldAdd;
                    node.getComponent(cc.Label).string = (goldAdd > 0 ? "+" : "") + this.formatGold(goldStart);
                }),
            ), steps);
        var seq = cc.sequence(rep, cc.callFunc(() => {
            goldStart = goldEnd;
            node.getComponent(cc.Label).string = (goldAdd > 0 ? "+" : "") + this.formatGold(goldStart);
        }));
        node.runAction(seq);
    }

    formatGold(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // update (dt) {}
}
