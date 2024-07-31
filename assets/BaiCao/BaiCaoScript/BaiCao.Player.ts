import App from "../../Lobby/LobbyScript/Script/common/App";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";

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
    actionVaoGa: cc.Node = null;
    @property(cc.Node)
    actionDanhBien: cc.Node = null;
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
    hub: cc.Node = null;
    @property(cc.Label)
    goldBet: cc.Label = null;
    @property(cc.Prefab)
    prefabItemChip: cc.Prefab = null;
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
    popupBet: cc.Node = null;
    @property(cc.Node)
    popupRequestDanhBien: cc.Node = null;
    @property(cc.Label)
    labelValueDanhBien: cc.Label = null;

    private posCardOpened = null;
    private timeoutNotify = null;

    private timeoutShowCardName = null;
    private timeoutChat = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    updatePosCardOpened(data) {
        /*
         -1 : chua mo cai nao
         0 : mo left
         1 : mo right
         2: mo het r
        */
        this.posCardOpened = data;
    }

    showChatEmotion(content) {
        this.node.children[7].active = true;
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
        this.node.children[7].active = true;
        this.chatEmotion.active = false;
        this.chatMsg.active = true;
        clearTimeout(this.timeoutChat);
        this.chatMsg.children[1].getComponent(cc.Label).string = content;
        this.timeoutChat = setTimeout(() => {
            this.chatEmotion.active = false;
            this.chatMsg.active = false;
        }, 3000);
    }

    showPopupBet(state) {
        this.popupBet.active = state;
        if (state) {
            this.popupBet.children[2].active = true;
            this.popupBet.children[3].active = true;
            this.popupBet.children[5].active = true;
            this.popupBet.children[6].active = true;
            this.setCanDanhBien(true);
            this.setCanKeCua(true);
        }
    }

    setupBetValue(bet) {
        this.popupBet.children[2].children[1].getComponent(cc.Label).string = Utils.formatNumber(bet);
        this.popupBet.children[3].children[1].getComponent(cc.Label).string = Utils.formatNumber(bet * 2);
        this.popupBet.children[5].children[1].getComponent(cc.Label).string = Utils.formatNumber(bet);
        this.popupBet.children[6].children[1].getComponent(cc.Label).string = Utils.formatNumber(bet * 2);
    }

    disableDanhBien(id) {
        if (id == 1) {
            this.popupBet.children[3].active = false;
        } else {
            this.popupBet.children[2].active = false;
        }
        this.setCanDanhBien(false);
    }

    disableKeCua(id) {
        if (id == 1) {
            this.popupBet.children[6].active = false;
        } else {
            this.popupBet.children[5].active = false;
        }
        this.setCanKeCua(false);
    }

    setCanDanhBien(state) {
        this.popupBet.children[2].getComponent(cc.Button).interactable = state;
        this.popupBet.children[3].getComponent(cc.Button).interactable = state;
    }

    setCanKeCua(state) {
        this.popupBet.children[5].getComponent(cc.Button).interactable = state;
        this.popupBet.children[6].getComponent(cc.Button).interactable = state;
    }

    showBtnInvite(state) {
        this.btnInvite.active = state;
    }

    setOwner(state) {
        this.owner.active = state;
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

    showCardReady(state) {
        this.node.children[2].active = true;
        this.cardReady.active = state;
    }

    showCardReal(state) {
        this.node.children[2].active = true;
        this.cardReal.active = state;
    }

    prepareToTransform() {
        this.prepareCardReal(0);
        this.prepareCardReal(1);
        this.prepareCardReal(2);
    }

    prepareCardReal(pos) {
        this.cardReal.children[pos].runAction(cc.scaleTo(0, 0, 1));
    }

    transformToCardReal(cardPos, spriteCard) {
        this.showCardReal(true);
        this.cardReal.children[cardPos].children[0].getComponent(cc.Sprite).spriteFrame = spriteCard;
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

    }

    showCardName(name) {
        //  cc.log("BaiCao_Player showCardName name : ", name);
        this.cardsName.active = true;
        this.cardsName.children[0].getComponent(cc.Label).string = name;
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

    setBet(data) {
        this.showPlayerBet(true);
        this.goldBet.string = this.formatGold(data);
    }

    addChips() {
        var item1 = cc.instantiate(this.prefabItemChip);
        var item2 = cc.instantiate(this.prefabItemChip);
        this.hub.addChild(item1);
        this.hub.addChild(item2);
    }

    showPlayerBet(state) {
        this.node.children[5].active = state;
        if (!state) {
            // clear Hub
            this.hub.removeAllChildren(true);
        }
    }

    setCardReal01(data) {
        this.cardReal.children[0].children[0].getComponent(cc.Sprite).spriteFrame = data;
    }

    setCardReal02(data) {
        this.cardReal.children[1].children[0].getComponent(cc.Sprite).spriteFrame = data;
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
        //  cc.log("BaiCao_Player processThinking rate : ", rate);
        this.actionThinking.getComponent(cc.Sprite).fillRange = rate;
    }

    showGold(state) {
        this.node.children[3].children[2].active = state;
    }

    showPopupRequestDanhBien(value) {
        this.popupRequestDanhBien.active = true;
        this.labelValueDanhBien.string = this.formatGold(value);
    }

    closePopupRequestDanhBien() {
        this.popupRequestDanhBien.active = false;
    }

    prepareFxAction() {
        // this.showGold(false);
        this.node.children[4].active = true;
        this.resetAction();
    }
    
    // Fx Action
    playFxDanhBien() {
        this.node.children[4].active = true;
        this.actionDanhBien.active = true;
        this.actionDanhBien.runAction(
            cc.sequence(
                cc.scaleTo(0, 0),
                cc.scaleTo(0.1, 1.1, 1.1),
                cc.scaleTo(0.05, 1, 1)
            )
        );
    }

    playFxVaoGa() {
        this.node.children[4].active = true;
        this.actionVaoGa.active = true;
        this.actionVaoGa.runAction(
            cc.sequence(
                cc.scaleTo(0, 0),
                cc.scaleTo(0.1, 1.1, 1.1),
                cc.scaleTo(0.05, 1, 1)
            )
        );
    }

    playFxViewer() {
        this.prepareFxAction();
        this.actionViewer.active = true;
    }

    fxOtherPlayerFold() {
        // Ready card
        // this.shadowCardReady(true);
        this.cardReady.runAction(
            cc.moveBy(0.5, 0, -100)
        );
    }

    fxMeFold() {
        // Real card
        this.shadowCardReal(true);
        this.cardReal.runAction(
            cc.moveBy(0.5, 0, -20)
        );
    }

    showEatGa(state) {
        this.actionWin.children[3].active = state;
    }

    fxWin(playerInfo) {
        //  cc.log("BaiCao_Player fxWin playerInfo : ", playerInfo);
        this.node.children[4].active = true;
        this.actionWin.active = true;
        this.fxGoldChange(0, playerInfo.moneyChange, this.goldWin.node);
        this.setGold(this.formatGold(playerInfo.money));
        this.showEatGa(playerInfo.ga > 0 ? true : false);
        setTimeout(() => {
            this.actionWin.active = false;
            this.node.children[4].active = false;
        }, 2500);
    }

    fxLose(playerInfo) {
        //  cc.log("BaiCao_Player fxLose playerInfo : ", playerInfo);
        this.node.children[4].active = true;
        this.actionLose.active = true;
        this.fxGoldChange(0, playerInfo.moneyChange, this.goldLose.node);
        this.setGold(this.formatGold(playerInfo.money));
        setTimeout(() => {
            this.actionLose.active = false;
            this.node.children[4].active = false;
        }, 2500);
    }

    shadowCardReady(state) {
        this.cardReady.children[0].color = state ? cc.Color.GRAY : cc.Color.WHITE;
        this.cardReady.children[1].color = state ? cc.Color.GRAY : cc.Color.WHITE;
        this.cardReady.children[2].color = state ? cc.Color.GRAY : cc.Color.WHITE;
    }

    shadowCardReal(state) {
        this.cardReal.children[0].children[0].color = state ? cc.Color.GRAY : cc.Color.WHITE;
        this.cardReal.children[1].children[0].color = state ? cc.Color.GRAY : cc.Color.WHITE;
        this.cardReal.children[2].children[0].color = state ? cc.Color.GRAY : cc.Color.WHITE;
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
    resetAction() {
        for (let index = 0; index < this.node.children[4].childrenCount; index++) {
            this.node.children[4].children[index].active = false;
        }
    }

    resetMatchHistory() {
        // card

        this.resetCardReady();
        this.resetCardReal();
        this.node.children[2].active = false;

        // this.setCardWin(0, true);
        // this.setCardWin(1, true);
        // this.setCardWin(2, true);

        // Info
        this.showGold(true);
        this.cardsName.active = false;

        // Action
        this.resetAction();

        // Chips
        this.node.children[5].active = false;
        this.goldBet.string = "0";
        this.hub.removeAllChildren(true);

    }

    resetCardReady() {
        this.cardReady.children[0].scale = 1;
        this.cardReady.children[1].scale = 1;
        this.cardReady.children[2].scale = 1;
        this.cardReady.active = false;
        // this.shadowCardReady(false);
    }

    resetCardReal() {
        this.cardReal.active = false;
        this.cardReal.y = 0;
        this.cardReal.children[0].children[0].getComponent(cc.Sprite).spriteFrame = this.spriteCardBack;
        this.cardReal.children[1].children[0].getComponent(cc.Sprite).spriteFrame = this.spriteCardBack;
        this.cardReal.children[2].children[0].getComponent(cc.Sprite).spriteFrame = this.spriteCardBack;
        this.shadowCardReal(false);
    }

    resetPlayerInfo() {
        // Hide node Lv1
        for (let index = 0; index < this.node.childrenCount; index++) {
            this.node.children[index].active = false;
        }

        // reset card
        this.cardReal.children[0].children[0].getComponent(cc.Sprite).spriteFrame = this.spriteCardBack;
        this.cardReal.children[1].children[0].getComponent(cc.Sprite).spriteFrame = this.spriteCardBack;
        this.cardReal.children[2].children[0].getComponent(cc.Sprite).spriteFrame = this.spriteCardBack;
        this.cardReady.active = false;
        this.cardReal.active = false;

        this.cardsName.active = false;

        // reset Action
        this.actionVaoGa.active = false;
        this.actionDanhBien.active = false;
        this.actionViewer.active = false;
        this.actionThinking.active = false;
        this.actionWin.active = false;
        this.actionLose.active = false;

        // reset Hub chips
        this.goldBet.string = "0";
        this.hub.removeAllChildren(true);

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
