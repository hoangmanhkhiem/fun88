import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../Script/common/App";
import BroadcastReceiver from "../Script/common/BroadcastReceiver";
import SPUtils from "../Script/common/SPUtils";
import Utils from "../Script/common/Utils";
import TienLenNetworkClient from "../Script/networks/TienLenNetworkClient";
import Card from "./TienLen.Card";
import CardGroup from "./TienLen.CardGoup";
import TienLenCmd from "./TienLen.Cmd";
import TienLenConstant from "./TienLen.Constant";
import Player from "./TienLen.Playerz";
import Res from "./TienLen.Resz";
import Room from "./TienLen.Room";
import History from "./TienLen.PopupHistory"
import cmd from "../Script/networks/Network.Cmd";

const { ccclass, property } = cc._decorator;

@ccclass
export default class InGame extends cc.Component {

    public static instance: InGame = null;

    @property(cc.Label)
    lbRoomId: cc.Label = null;
    @property(cc.Label)
    lbRoomBet: cc.Label = null;
    @property(Player)
    players: Player[] = [];
    @property(cc.Label)
    lbTimeCountDown: cc.Label = null;
    @property(cc.SpriteFrame)
    cards: cc.SpriteFrame[] = [];
    @property(cc.Node)
    cardLine: cc.Node = null;
    @property(cc.Prefab)
    cardItem: cc.Prefab = null;
    @property(cc.Node)
    board: cc.Node = null;
    @property(cc.Node)
    btnsInGame: cc.Node = null;
    @property(cc.Label)
    lblToast: cc.Label = null;
    @property(cc.Node)
    popupGuide: cc.Node = null;
    // UI Chat
    @property(cc.Node)
    UI_Chat: cc.Node = null;
    @property(cc.EditBox)
    edtChatInput: cc.EditBox = null;

    @property(cc.Node)
    cardsDeal: cc.Node = null;

    // Popup Result
    @property(cc.Node)
    popupResult: cc.Node = null;
    @property(cc.ScrollView)
    scrollPopupResult: cc.ScrollView = null;
    @property(cc.Node)
    contentPopupResult: cc.Node = null;
    @property(cc.Prefab)
    prefabPlayerResult: cc.Prefab = null;

    @property(cc.Node)
    fxMeWin: cc.Node = null;
    @property(cc.Node)
    fxMeLose: cc.Node = null;

    @property(cc.Node)
    fxWhoPlayFirst: cc.Node = null;

    cardsOnHand = {};
    buttons = {};
    myChair = 0;
    sortBySuit = true;
    currTurnCards = [];
    checkTurn = false;

    countDown = null;

    private timeoutChiaBaiDone = null;
    private timeoutDelayChiaBai = null;

    cachePlayersInfo = [];

    onLoad() {
        InGame.instance = this;
        this.initRes();
    }

    initRes() {
        Res.getInstance();
        this.btnsInGame.children.forEach(btn => {
            this.buttons[btn.name] = btn;
        });
    }

    public show(isShow: boolean, roomInfo = null) {
        if (isShow) {
            this.node.active = true;
            this.cleanCardLine();
            this.cleanCardsOnBoard();
            this.cleanCardsOnHand();
            for (let index = 0; index < TienLenConstant.Config.MAX_PLAYER; index++) {
                this.players[index].setStatus();
                this.players[index].setLeaveRoom();
            }
            this.setRoomInfo(roomInfo);

        } else {
            this.node.active = false;
        }
    }

    actLeaveRoom() {
        TienLenNetworkClient.getInstance().send(new TienLenCmd.SendRequestLeaveGame());
    }

    setRoomInfo(room) {
        //  cc.log("TLMN setRoomInfo data : ", room);
        this.lbRoomId.string = room.roomId;
        if (room.moneyBet == 0) {
            this.lbRoomBet.string = "";
        } else {
            this.lbRoomBet.string = Utils.formatNumber(room.moneyBet);
        }

        this.myChair = room.myChair;
        this.setPlayersInfo(room);
        for (let index = 0; index < 4; index++) {
            this.players[index].hideChat();
        }
        if (room.cards != null) {
            if (room.cards.length > 0) {
                this.cardLine.active = true;
                //  cc.log("TLMN setRoomInfo show card");
                this.setCardsOnHand(this.sortCards(room.cards));
                this.setActiveButtons(["bt_sort"], [true]);
            }
        }

        this.closePopupResult();
    }

    setPlayersInfo(room) {
        this.cachePlayersInfo = [];
        for (let i = 0; i < room.playerInfos.length; i++) {
            var info = room.playerInfos[i];
            if (room.playerStatus[i] != 0) {
                this.cachePlayersInfo.push(info.nickName);
                var chair = this.convertChair(i);
                var pl = this.players[chair];
                if (pl) pl.setPlayerInfo(info);
            }
        }
    }

    updateGameInfo(data) {
        this.show(true, data);
    }

    onUserJoinRoom(user) {
        if (user.uStatus != 0) {
            this.cachePlayersInfo[user.uChair] = user.info.nickName;
            this.players[this.convertChair(user.uChair)].setPlayerInfo(user.info);
        }
    }

    autoStart(autoInfo) {
        if (autoInfo.isAutoStart) {
            this.setTimeCountDown("Ván đấu bắt đầu sau: ", autoInfo.autoStartTime);
            this.closePopupResult();
        }
    }

    setTimeCountDown(msg, t) {
        this.lbTimeCountDown.string = msg + "" + t + "s";
        this.lbTimeCountDown.node.active = true;
        clearInterval(this.countDown);
        this.countDown = setInterval(() => {
            t--;
            if (t < 0) {
                clearInterval(this.countDown);
                this.lbTimeCountDown.node.active = false;
            } else {
                this.lbTimeCountDown.string = msg + "" + t + "s";
            }
        }, 1000);
    }

    firstTurn(data) {
        this.cleanCardLine();
        //  cc.log("TLMN firstTurn data : ", data);

        clearTimeout(this.timeoutDelayChiaBai);
        this.timeoutDelayChiaBai = setTimeout(() => {
            let numPlayer = 0;
            let arrSeatId = [];
            for (let i = 0; i < data.cards.length; i++) {
                var pl = this.players[this.convertChair(i)]
                if (pl.active) {
                    numPlayer += 1;
                    arrSeatId.push(this.convertChair(i));
                }
            }

            let cardDeal = 6;
            // Open | Hide cards not use -> Mau binh nhieu la bai qua nen chi chia 4 la tuong trung
            for (let index = 0; index < 4 * cardDeal; index++) { // 4 players * 6 cards
                this.cardsDeal.children[index].active = index >= numPlayer * cardDeal ? false : true;
                this.cardsDeal.children[index].position = cc.v2(0, 0);
            }

            let timeShip = 0.1; // 0.15
            // Move Cards used to each player joined
            for (let a = 0; a < cardDeal; a++) { // players x 6 cards
                for (let b = 0; b < numPlayer; b++) {
                    let seatId = arrSeatId[b];
                    let card4Me = this.cardsDeal.children[(a * numPlayer) + b];
                    let rawPlayerPos = this.players[seatId].node.position;
                    //  cc.log("TLMN CHIA_BAI delayTime : ", ((a * numPlayer) + b) * timeShip);
                    card4Me.runAction(
                        cc.sequence(
                            cc.delayTime(((a * numPlayer) + b) * timeShip),
                            cc.moveTo(0.2, rawPlayerPos)
                        )
                    );
                }
            }

            let delayOver2Under = 0.2;
            var maxDelay = (((cardDeal - 1) * numPlayer) + (numPlayer - 1)) * timeShip; // ((a * numPlayer) + b) * timeShip
            let timeUnderLayer = (maxDelay + 0.2 + delayOver2Under) * 1000;
            //  cc.log("CHIA_BAI timeUnderLayer : ", timeUnderLayer);
            clearTimeout(this.timeoutChiaBaiDone);
            this.timeoutChiaBaiDone = setTimeout(() => {
                for (let index = 0; index < 4 * 6; index++) { // 4 players * 6 cards
                    //  cc.log("CHIA_BAI cardsDeal index : ", index);
                    this.cardsDeal.children[index].active = false;
                }
                this.fxWhoPlayFirst.active = false;
            }, timeUnderLayer);

            this.fxWhoPlayFirst.active = true;
            this.fxWhoPlayFirst.children[0].getComponent(cc.Label).string = this.cachePlayersInfo[data.chair] + " đánh trước !";
        }, 1000);

        for (let i = 0; i < data.cards.length; i++) {
            var card = data.cards[i];
            var pl = this.players[this.convertChair(i)]
            if (pl.active) {
                pl.setFirstCard(card);
            }
        }
    }

    chiaBai(data) {
        this.setCardsOnHand(this.sortCards(data.cards));
        if (data.toiTrang > 0) {

        }
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].active) {
                this.players[i].offFirstCard();
                if (i > 0) {
                    this.players[i].setCardRemain(data.cardSize);
                }
            }
        }
        this.setActiveButtons(["bt_sort"], [true]);
    }

    changeTurn(turn) {
        var chair = this.convertChair(turn.chair);
        for (let index = 0; index < 4; index++) {
            this.players[index].setTimeRemain(0);
        }
        //  cc.log("UUUUUUU turn : ", turn);
        if (turn.time) {
            this.players[chair].setTimeRemain(turn.time);
        } else {
            this.players[chair].setTimeRemain(14);
        }

        if (chair == 0) {
            this.setActiveButtons(["bt_submit_turn", "bt_pass_turn"], [true, true]);
            this.checkTurn = true;
        }
        if (turn.newRound) {
            this.cleanCardsOnBoard();
            this.currTurnCards = [];
            this.checkTurn = false;
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].active) {
                    this.players[i].setStatus();
                }
            }
        }
    }

    submitTurn(turn) {
        this.setActiveButtons(["bt_submit_turn", "bt_pass_turn"], [false, false]);
        this.players[0].setTimeRemain(0);
        var cards = this.sortCards(turn.cards);

        let isExist2 = false;
        for (let index = 0; index < turn.cards.length; index++) {
            if (turn.cards[index] == 48 || turn.cards[index] == 49 || turn.cards[index] == 50 || turn.cards[index] == 51) {
                isExist2 = true;
            }
        }

        if (isExist2) {
            this.fxWhoPlayFirst.active = true;
            this.fxWhoPlayFirst.children[0].getComponent(cc.Label).string = "Heo !";
            setTimeout(() => {
                this.fxWhoPlayFirst.active = false;
            }, 2000);
        }

        var cardHalf = (cards.length - 1) / 2;
        var ranX = Math.floor(Math.random() * 100) - 50;
        var ranY = Math.floor(Math.random() * 100) - 50;
        var chair = this.convertChair(turn.chair);
        var pl = this.players[chair];
        if (chair == 0) {
            for (let i = 0; i < cards.length; i++) {
                var cardIndex = cards[i];
                var _card = this.cardsOnHand[cardIndex];
                var pos = _card.parent.convertToWorldSpaceAR(_card.position)
                pos = this.board.convertToNodeSpaceAR(pos);
                _card.parent = this.board;
                _card.setPosition(pos);
                _card.runAction(cc.moveTo(0.2, cc.v2((i - cardHalf) * 30 + ranX, ranY)));
                _card.runAction(cc.scaleTo(0.2, 0.6, 0.6));
                delete this.cardsOnHand[cardIndex];
            }
        } else {
            var pos = pl.node.parent.convertToWorldSpaceAR(pl.node.position)
            pos = this.board.convertToNodeSpaceAR(pos);
            for (let i = 0; i < cards.length; i++) {
                var cardItem = cc.instantiate(this.cardItem);
                cardItem.parent = this.board;
                cardItem.setScale(0.6, 0.6);
                cardItem.setPosition(pos);
                cardItem.getComponent(Card).setCardData(cards[i]);
                cardItem.runAction(cc.moveTo(0.2, cc.v2((i - cardHalf) * 30 + ranX, ranY)));
            }
            pl.setCardRemain(turn.numberCard);
            this.currTurnCards = cards;
        }
    }

    passTurn(turn) {
        this.players[this.convertChair(turn.chair)].setStatus("Bỏ lượt");
        this.setActiveButtons(["bt_submit_turn", "bt_pass_turn"], [false, false]);
        this.players[0].setTimeRemain(0);
    }

    actSubmitTurn() {
        var cardSelected = [];
        this.cardLine.children.forEach(card => {
            var _card = card.getComponent(Card);
            if (_card.isSelected)
                cardSelected.push(_card.getCardIndex());
        });
        this.sendSubmitTurn(cardSelected);

        this.checkTurn = false;
    }

    sendSubmitTurn(cardSelected) {
        TienLenNetworkClient.getInstance().send(new TienLenCmd.SendDanhBai(!1, cardSelected));
    }

    actPassTurn() {
        this.sendPassTurn();

        this.checkTurn = false;
    }

    sendPassTurn() {
        TienLenNetworkClient.getInstance().send(new TienLenCmd.SendBoLuot(!0));
    }

    sortCards(cards) {
        cards = CardGroup.indexsToCards(cards);
        var _cards = [];
        if (this.sortBySuit)
            _cards = new CardGroup(cards).getOrderedBySuit();
        else
            _cards = CardGroup.sortCards(cards);
        return CardGroup.cardsToIndexs(_cards);
    }

    actSort() {
        this.sortBySuit = !this.sortBySuit;
        var cards = this.getCardsOnHand();
        cards = this.sortCards(cards);
        this.sortCardsOnHand(cards);
        this.setToggleCardsOnHand();
    }

    setCardsOnHand(cards) {
        cards.forEach(card => {
            var cardItem = cc.instantiate(this.cardItem);
            cardItem.parent = this.cardLine;
            cardItem.getComponent(Card).setCardData(card, this.onCardSelectCallback.bind(this));
            this.cardsOnHand[card] = cardItem;
        });
    }

    onCardSelectCallback(card) {
        if (this.currTurnCards
            && this.currTurnCards.length == 1
            && this.currTurnCards[0].card >= 48) //1 la khac 2
        {
            this.setToggleCardsOnHand();
            this.setToggleCardsOnHand([card]);
        } else
            this.checkSuggestion(card);
    }

    checkSuggestion(data) {
        data = CardGroup.indexToCard(data);
        var cardsOnHand = CardGroup.indexsToCards(this.getCardsOnHand());
        var turnCards = CardGroup.indexsToCards(this.currTurnCards);
        var suggestionCards;
        if (this.checkTurn)
            suggestionCards = new CardGroup(cardsOnHand).getSuggestionCards(turnCards, data, () => {
                let tmp = new Array();
                for (var key in this.cardsOnHand) {
                    let tmpCard = this.cardsOnHand[key].getComponent(Card);
                    if (tmpCard.isSelected) {
                        tmp.push(tmpCard);
                    }
                }
                return new CardGroup(cardsOnHand).getSuggestionNoCards(tmp, data, true);
            });
        else {
            let tmp = new Array();
            for (var key in this.cardsOnHand) {
                let tmpCard = this.cardsOnHand[key].getComponent(Card);
                if (tmpCard.isSelected) {
                    tmp.push(tmpCard);
                }
            }
            suggestionCards = new CardGroup(cardsOnHand).getSuggestionNoCards(tmp, data);
        }
        if (suggestionCards) {
            for (let i = 0; i < suggestionCards.length; i++) {
                for (let j = 0; j < suggestionCards[i].length; j++) {
                    if (CardGroup.cardToIndex(data) == CardGroup.cardToIndex(suggestionCards[i][j])) {
                        this.setToggleCardsOnHand(CardGroup.cardsToIndexs(suggestionCards[i]));
                    }
                }
            }
        }
    }

    getCardsOnHand() {
        var cards = [];
        for (var key in this.cardsOnHand) {
            cards.push(this.cardsOnHand[key].getComponent(Card).getCardIndex());
        }
        return cards;
    }

    cleanCardsOnHand() {
        for (var key in this.cardsOnHand)
            delete this.cardsOnHand[key];
    }

    cleanCardsOnBoard() {
        this.board.removeAllChildren();
    }

    setToggleCardsOnHand(cards = null) {
        if (cards === null) {
            for (var key in this.cardsOnHand) {
                this.cardsOnHand[key].getComponent(Card).deSelect();
            }
        } else {
            for (var key in this.cardsOnHand) {
                this.cardsOnHand[key].getComponent(Card).deSelect();
            }
            for (let i = 0; i < cards.length; i++) {
                this.cardsOnHand[cards[i]].getComponent(Card).select();
            }
        }
    }

    sortCardsOnHand(cards) {
        for (let i = 0; i < cards.length; i++) {
            var index = cards[i];
            this.cardsOnHand[index].setSiblingIndex(i);
        }
    }

    cleanCardLine() {
        this.cardLine.removeAllChildren();

        for (let i = 1; i < this.players.length; i++) {
            this.players[i].clearCardLine();
        }
    }

    setActiveButtons(btnNames, actives) {
        for (let i = 0; i < btnNames.length; i++) {
            this.buttons[btnNames[i]].active = actives[i];
        }
    }

    endGame(data) {
        //  cc.log("TTTTTTTTTT endGame data : ", data);
        for (let index = 0; index < 4; index++) {
            this.players[index].setTimeRemain(0);
        }
        var coinChanges = data.ketQuaTinhTienList;
        for (let i = 0; i < coinChanges.length; i++) {
            var chair = this.convertChair(i);
            if (i < TienLenConstant.Config.MAX_PLAYER) {
                this.players[chair].setCoinChange(coinChanges[i]);
                this.players[chair].setCoin(data.currentMoney[i]);
                if (chair == 0) {
                    Configs.Login.Coin = data.currentMoney[i];
                    this.fxMeWin.active = coinChanges[i] > 0 ? true : false;
                    this.fxMeLose.active = coinChanges[i] < 0 ? true : false;
                }
            }
        }
        for (let i = 0; i < data.cards.length; i++) {
            var chair = this.convertChair(i);
            if (chair != 0) {
                this.players[chair].setCardLine(data.cards[i]);
                this.players[chair].setCardRemain(0);
            }
        }
        this.setActiveButtons(["bt_sort"], [false]);
        //  cc.log("TTTTTTTTTT Sam 1 : ", data.countDown);
        if (data.countDown == 0) {
            //  cc.log("TTTTTTTTTT Sam");
            this.setTimeCountDown("Ván đấu kết thúc sau: ", 10);
            setTimeout(() => {
                this.cleanCardsOnHand();
                this.cleanCardLine();
                this.cleanCardsOnBoard();
                for (let index = 0; index < TienLenConstant.Config.MAX_PLAYER; index++) {
                    this.players[index].setStatus();
                }
            }, 5000);
        } else {
            //  cc.log("TTTTTTTTTT TLMN");
            setTimeout(() => {
                this.setTimeCountDown("Ván đấu kết thúc sau: ", data.countDown - 6);
            }, 4000);

            setTimeout(() => {
                this.cleanCardsOnHand();
                this.cleanCardLine();
                this.cleanCardsOnBoard();
                for (let index = 0; index < TienLenConstant.Config.MAX_PLAYER; index++) {
                    this.players[index].setStatus();
                }
            }, 9000);
        }
        TienLenNetworkClient.getInstance().send(new TienLenCmd.SendReadyAutoStart());

        setTimeout(() => {
            // show Popup Result
            this.fxMeWin.active = false;
            this.fxMeLose.active = false;
            this.popupResult.active = true;
            this.contentPopupResult.destroyAllChildren();
            this.contentPopupResult.removeAllChildren();

            let isTLMN = data.sizeWinType == 5 ? false : true;

            for (let index = 0; index < data.ketQuaTinhTienList.length; index++) {
                if (data.ketQuaTinhTienList[index] != 0) {
                    let item = cc.instantiate(this.prefabPlayerResult).getComponent("TienLen.ItemPlayerResult");
                    item.initItem({
                        id: index + 1,
                        userName: this.cachePlayersInfo[index],
                        goldChange: data.ketQuaTinhTienList[index],
                        cards: data.cards[index],
                        winTypes: data.winTypes[index],
                        isTLMN: isTLMN
                    })
                    this.contentPopupResult.addChild(item.node);
                }
            }
            this.scrollPopupResult.scrollToTop(0);
        }, 4000);
    }

    updateMatch(data) {

    }

    userLeaveRoom(data) {
        var chair = this.convertChair(data.chair);
        this.players[chair].setLeaveRoom();
        if (chair == 0) {
            this.show(false);
            Room.instance.show(true);
            Room.instance.refreshRoom();
        }
    }

    notifyUserRegOutRoom(res) {
        let outChair = res["outChair"];
        let isOutRoom = res["isOutRoom"];
        let chair = this.convertChair(outChair);
        if (chair == 0) {
            if (isOutRoom) {
                this.players[chair].setNotify("Sắp rời bàn !");
            } else {
                this.players[chair].setNotify("Khô Máu !");
            }
        }
    }

    playerChat(res) {
        let chair = res["chair"];
        let isIcon = res["isIcon"];
        let content = res["content"];

        let seatId = this.convertChair(chair);
        if (isIcon) {
            // Chat Icon
            this.players[seatId].showChatEmotion(content);
        } else {
            // Chat Msg
            this.players[seatId].showChatMsg(content);
        }
    }

    playerChatChong(res) {
        let winChair = res["winChair"];
        let lostChair = res["lostChair"];
        let winMoney = res["winMoney"];
        let lostMoney = res["lostMoney"];
        let winCurrentMoney = res["winCurrentMoney"];
        let lostCurrentMoney = res["lostCurrentMoney"];

        setTimeout(() => {
            let seatIdWin = this.convertChair(winChair);
            let seatIdLost = this.convertChair(lostChair);
            this.players[seatIdWin].setCoinChange(winMoney);
            this.players[seatIdLost].setCoinChange(lostMoney);
            this.players[seatIdWin].setCoin(winCurrentMoney);
            this.players[seatIdLost].setCoin(lostCurrentMoney);
            setTimeout(() => {
                this.players[seatIdWin].setStatus("");
                this.players[seatIdLost].setStatus("");
            }, 2000);
        }, 1000);

    }

    wait4doithong(res) {
        let chair = res["chair"];

        this.fxWhoPlayFirst.active = true;
        this.fxWhoPlayFirst.children[0].getComponent(cc.Label).string = "Đợi Bốn Đôi Thông !";
        setTimeout(() => {
            this.fxWhoPlayFirst.active = false;
        }, 2000);
    }

    showPopupGuide() {
        this.popupGuide.active = true;
    }

    closePopupGuide() {
        this.popupGuide.active = false;
    }

    // Chat
    showUIChat() {
        this.UI_Chat.active = true;
        this.UI_Chat.runAction(
            cc.moveTo(0.5, 420, 0)
        );
    }

    closeUIChat() {
        this.UI_Chat.runAction(
            cc.moveTo(0.5, 1000, 0)
        );
    }

    chatEmotion(event, id) {
        //  cc.log("BaCay chatEmotion id : ", id);
        TienLenNetworkClient.getInstance().send(new TienLenCmd.SendChatRoom(1, id));
        this.closeUIChat();
    }

    chatMsg() {
        if (this.edtChatInput.string.trim().length > 0) {
            TienLenNetworkClient.getInstance().send(new TienLenCmd.SendChatRoom(0, this.edtChatInput.string));
            this.edtChatInput.string = "";
            this.closeUIChat();
        }
    }

    convertChair(a) {
        return (a - this.myChair + 4) % 4;
    }

    showToast(message: string) {
        this.lblToast.string = message;
        let parent = this.lblToast.node.parent;
        parent.stopAllActions();
        parent.active = true;
        parent.opacity = 0;
        parent.runAction(cc.sequence(cc.fadeIn(0.1), cc.delayTime(2), cc.fadeOut(0.2), cc.callFunc(() => {
            parent.active = false;
        })));
    }

    closePopupResult() {
        this.popupResult.active = false;
    }
}
