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
import Player from "./TienLen.Player";
import Res from "./TienLen.Res";
import Room from "./TienLen.Room";
import History from "./TienLen.PopupHistory"

var TW = cc.tween;
const { ccclass, property } = cc._decorator;
enum TYPECARD {
    MOT_LA = 1,
    MOT_DOI = 2,
    HAI_DOI_THONG = 12,
    SAM_CO = 3,
    SANH = 4,
    TU_QUY = 5,
    HAI_TU_QUY = 25,
    BA_DOI_THONG = 6,
    BON_DOI_THONG = 7,
    NAM_DOI_THONG = 8,
    SAU_DOI_THUONG = 9,
    SAU_DOI_THONG = 10,
    SANH_RONG = 11
}
enum TYPE_WIN {
    SANH_RONG = 1,
    TU_QUY = 2,
    NAM_DOI_THONG = 3,
    SAU_DOI = 4,

}
enum STATE_GAME {
    WAITING = 0,
    PLAYING = 1,
    FINISH = 2,
}
enum audio_clip {
    BG = 0,
    LOSE = 1,
    WIN = 2,
    CHETMAYNE = 3,
    DODI = 4,
    HAINE = 5,
    MAYHABUOI = 6,
    THUADICUNG = 7,
    START_GAME = 8,
    CHIA_BAI = 9,
    DANH = 10
}
@ccclass
export default class InGame extends cc.Component {

    public static instance: InGame = null;
    @property(History)
    history: History = null;
    @property(cc.Toggle)
    toggleMusic: cc.Toggle = null;
    @property(cc.Toggle)
    toggleSound: cc.Toggle = null;
    @property(cc.Node)
    nodeSetting:cc.Node = null;

    @property(cc.Node)
    contentChatNhanh:cc.Node = null;
    @property(cc.Node)
    bgChat:cc.Node = null;
    @property(cc.Node)
    boxSetting:cc.Node = null;
    @property(cc.Sprite)
    sprAvatar: cc.Sprite = null;
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
    fxWhoPlayFirst: cc.Node = null;

    @property(sp.Skeleton)
    animWin: sp.Skeleton = null;

    @property(sp.SkeletonData)
    dataAnimChatHai: sp.SkeletonData = null;

    @property(sp.Skeleton)
    animBeat: sp.Skeleton = null;

    @property(sp.SkeletonData)
    animToiTrang: sp.SkeletonData = null;

    @property(sp.SkeletonData)
    animBeatTypeCard: sp.SkeletonData = null;

    soundManager = null;

    dataFirstTurn = null;
    dataChiaBai = null;
    state_game = STATE_GAME.WAITING;

    cardsOnHand = {};
    buttons = {};
    myChair = 0;
    sortBySuit = true;
    currTurnCards = [];
    curCardOnBoard = [];
    countChat = 0;
    checkTurn = false;

    countDown = null;

    private timeoutChiaBaiDone = null;
    private timeoutDelayChiaBai = null;

    cachePlayersInfo = [];

    onLoad() {
        InGame.instance = this;
        this.soundManager = Room.instance.soundManager;
        this.initRes();
        this.sprAvatar.spriteFrame = App.instance.getAvatarSpriteFrame(Configs.Login.Avatar);
        cc.Tween.stopAllByTarget(this.popupResult);
        this.popupResult.active = false;
        this.bgChat.active = false;
        var self = this;
        for(var i=0;i<this.contentChatNhanh.childrenCount;i++){
            let node = this.contentChatNhanh.children[i];
            node.on('click',function(){
                self.onBtnClickBoxChat();
                self.chatNhanhMsg(node.children[0].getComponent(cc.Label).string);
            })
        }
        this.edtChatInput.node.on('click',function(){
            self.onBtnClickBoxChat();
        });
    }

    

    showSetting(){
        this.toggleMusic.isChecked = SPUtils.getMusicVolumn() > 0;
        this.toggleSound.isChecked = SPUtils.getSoundVolumn() > 0;
        this.nodeSetting.active = true;
    }

    hideSetting(){
        this.nodeSetting.active = false;
    }

    

    private onBtnHistory() {

        // this.actCoomingSoon();
        // return;
        if (this.history == null) {
            App.instance.showLoading(true);
            cc.assetManager.getBundle("TienLen").load("PopupHistory", cc.Prefab, function (finish, total, item) {
            }, (err1, prefab: cc.Prefab) => {
                App.instance.showLoading(false);
                if (err1 != null) {
                     //Utils.Log("errr load game TIENLEN:", err1);
                } else {
                     //Utils.Log("vao daycai chu");
                    this.history = cc.instantiate(prefab).getComponent("TienLen.PopupHistory");
                    this.history.node.parent = this.node.parent;
                    this.history.node.active = true;
                    this.history.show()
                }
            })
        } else {
            this.history.node.parent = this.node.parent;
            this.history.node.active = true;
            this.history.show()
        }

        // App.instance.showLoading(true);
        // Http.get(Configs.App.API, { "c": 139, "p": this.page, "un": Configs.Login.Nickname, "gn": "Audition" }, (err, res) => {
        //     App.instance.showLoading(false);
        //     if (err != null) return;
        //      //Utils.Log("");

            
        // });
    }


    onBtnToggleMusic(){
        SPUtils.setMusicVolumn(this.toggleMusic.isChecked ? 1 : 0);
        BroadcastReceiver.send(BroadcastReceiver.ON_AUDIO_CHANGED);
    }

    onBtnToggleSound(){
        SPUtils.setSoundVolumn(this.toggleSound.isChecked ? 1 : 0);
        BroadcastReceiver.send(BroadcastReceiver.ON_AUDIO_CHANGED);
    }

    initRes() {
        Res.getInstance();
        this.btnsInGame.children.forEach(btn => {
            this.buttons[btn.name] = btn;
        });
    }

    onBtnSetting(){
        this.boxSetting.active = !this.boxSetting.active;
    }

    public show(isShow: boolean, roomInfo = null) {
        if (isShow) {
            this.node.active = true;
            this.sprAvatar.spriteFrame = App.instance.getAvatarSpriteFrame(Configs.Login.Avatar);
            this.cleanCardLine();
            this.cleanCardsOnBoard();
            this.cleanCardsOnHand();
            for (let index = 0; index < TienLenConstant.Config.MAX_PLAYER; index++) {
                this.players[index].setStatus();
                this.players[index].setLeaveRoom();
                this.players[index].state = STATE_GAME.WAITING;
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
         //Utils.Log("TLMN setRoomInfo data : ", room);
        this.lbRoomId.string = room.roomId;
        if (room.moneyBet == 0) {
            this.lbRoomBet.string = "";
        } else {
            this.lbRoomBet.string = Utils.formatNumber(room.moneyBet);
        }
        this.lbTimeCountDown.node.active = false;
        this.myChair = room.myChair;
        this.setPlayersInfo(room);
        for (let index = 0; index < 4; index++) {
            this.players[index].hideChat();
        }
        if (room.cards != null) {
            if (room.cards.length > 0) {
                this.cardLine.active = true;
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
                if (room.playerStatus[i] == 1) {
                    pl.setStateViewing(true);
                }
                if (info.nickName == Configs.Login.Nickname && room.playerStatus[i] == 1) {
                    this.state_game = STATE_GAME.PLAYING;
                }
                if (room.playerStatus[i] == 3 && room.hasOwnProperty("handCardSize")) {
                    pl.setCardRemain(room.handCardSize[i]);
                }

            }
        }
    }

    updateGameInfo(data) {
        this.show(true, data);
    }

    onUserJoinRoom(user) {
        if (user.uStatus != 0) {
            this.cachePlayersInfo[user.uChair] = user.info.nickName;
            let player = this.players[this.convertChair(user.uChair)];
            if (this.state_game == STATE_GAME.PLAYING) {
                player.setStateViewing(true);
            }
            player.setPlayerInfo(user.info);
        }
    }

    autoStart(autoInfo) {
        if (autoInfo.isAutoStart) {
            this.state_game = STATE_GAME.WAITING;
            this.setTimeCountDown("Ván đấu bắt đầu sau: ", autoInfo.autoStartTime);
            this.closePopupResult();
            this.players.forEach((player) => {
                if (player.node.active)
                    player.setStateViewing(false);
            })
        }
    }

    setTimeCountDown(msg, t) {
        this.lbTimeCountDown.string = msg + "" + t + "s";
        this.lbTimeCountDown.node.active = true;
        clearInterval(this.countDown);
        this.countDown = setInterval(() => {
            if (this.node) {
                t--;
                if (t < 1) {
                    this.state_game = STATE_GAME.PLAYING;
                }
                if (t < 0) {

                    clearInterval(this.countDown);
                    this.lbTimeCountDown.node.active = false;
                } else {
                    this.lbTimeCountDown.string = msg + "" + t + "s";
                }
            }
        }, 1000);
    }

    firstTurn(data) {
        this.cleanCardLine();
        clearTimeout(this.timeoutDelayChiaBai);
        // this.timeoutDelayChiaBai = setTimeout(() => {
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
        // for (let index = 0; index < 4 * cardDeal; index++) { // 4 players * 6 cards

        let timeShip = 0.05; // 0.15
        // Move Cards used to each player joined
        if (numPlayer > 4) numPlayer = 4;
        this.fxWhoPlayFirst.active = true;
         //Utils.Log("thang ngay danh truoc:" + this.cachePlayersInfo[data.chair]);
        this.fxWhoPlayFirst.getChildByName("txt").getComponent(cc.Label).string = this.cachePlayersInfo[data.chair] + " đánh trước !";
        this.scheduleOnce(() => {
            this.fxWhoPlayFirst.active = false;
        }, 2.0)
        for (let i = 0; i < this.players.length; i++) {
            let player = this.players[i];
            this.resolveCardDeal(player);
        }
        // }, 1000);
    }
    actCoomingSoon(){
        App.instance.ShowAlertDialog(App.instance.getTextLang("txt_function_in_development"));
    }
    resolveCardDeal(player) {
        if (player.state == STATE_GAME.PLAYING) {
            for (let j = 0, l = 6; j < l; j++) {
                let card4Me = player.cardDeal[j];
                if (!card4Me) {
                    card4Me = cc.instantiate(this.cardItem);
                    card4Me.getComponent(Card).setCardData(52);
                    this.node.addChild(card4Me);
                    player.cardDeal.push(card4Me);
                }
                card4Me.active = true;
                let rawPlayerPos = cc.v2(player.node.x, player.node.y - 50);
                cc.Tween.stopAllByTarget(card4Me);
                TW(card4Me)
                    .set({ opacity: 150, scale: 0.5, x: 0, y: 0 })
                    .delay(j * 0.05)
                    .parallel(TW()
                        .to(0.2, { x: rawPlayerPos.x, y: rawPlayerPos.y, opacity: 255 }, { easing: cc.easing.sineOut }),
                        TW().by(0.15, { angle: 360 }, { easing: cc.easing.sineOut })
                    )
                    .call(() => {
                        this.soundManager.playAudioEffect(audio_clip.CHIA_BAI);
                        card4Me.active = false;
                        if (j == l - 1 && this.players.indexOf(player) == 0) {
                            this.resolveChiaBai(this.dataChiaBai);
                        }
                    }).start();
            }
        }
    }

    chiaBai(data) {
        this.dataChiaBai = data;
        this.firstTurn(this.dataFirstTurn);
    }
    resolveChiaBai(data) {
        this.setCardsOnHand(this.sortCards(data.cards));
        if (data.toiTrang > 0) {

        }
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].active && this.players[i].state == STATE_GAME.PLAYING) {
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
            this.curCardOnBoard = [];
            this.countChat = 0;
            this.checkTurn = false;
            // for (let i = 0; i < this.players.length; i++) {
            //     if (this.players[i].active) {
            //         this.players[i].setStatus();
            //     }
            // }
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
            let animChatHai = new cc.Node("animChatHai").addComponent(sp.Skeleton);
            this.node.getChildByName("board").addChild(animChatHai.node);
            animChatHai.node.setPosition(cc.v2(-98, -348));
            animChatHai.skeletonData = this.dataAnimChatHai;
            animChatHai.setAnimation(0, "Đánh 2", false);
            setTimeout(() => {
                animChatHai.node.destroy();
            }, 1500);
        }

        var cardHalf = (cards.length - 1) / 2;
        var ranX = Math.floor(Math.random() * 100) - 50;
        var ranY = Math.floor(Math.random() * 100) - 30;
        var chair = this.convertChair(turn.chair);
        var pl = this.players[chair];
        this.board.children.forEach((card) => {
            card.color = cc.Color.GRAY;
        })
        if (chair == 0) {//this player
            for (let i = 0; i < cards.length; i++) {
                var cardIndex = cards[i];
                var _card = this.cardsOnHand[cardIndex];
                var pos = _card.parent.convertToWorldSpaceAR(_card.position)
                pos = this.board.convertToNodeSpaceAR(pos);
                _card.parent = this.board;
                _card.setPosition(pos);
                _card.runAction(cc.moveTo(0.2, cc.v2((i - cardHalf) * 30 + ranX, ranY)));
                _card.runAction(cc.scaleTo(0.2, 0.65, 0.65));
                delete this.cardsOnHand[cardIndex];
            }
        } else { //that player
            var pos = pl.node.parent.convertToWorldSpaceAR(pl.node.position)
            pos = this.board.convertToNodeSpaceAR(pos);
            for (let i = 0; i < cards.length; i++) {
                var cardItem = cc.instantiate(this.cardItem);
                cardItem.parent = this.board;
                cardItem.setScale(0.65, 0.65);
                cardItem.setPosition(pos);
                cardItem.getComponent(Card).setCardData(cards[i]);
                cardItem.setContentSize(cc.size(100, 135));
                cardItem.runAction(cc.moveTo(0.2, cc.v2((i - cardHalf) * 30 + ranX, ranY)));
            }
            pl.setCardRemain(turn.numberCard);
            this.currTurnCards = cards;
        }
        this.checkTypeSoundEff(cards, this.curCardOnBoard);
        this.curCardOnBoard = cards;

        let typeCard = this.getTypeCard(cards);
        this.showAnimTypeCard(typeCard, cards);


    }
    checkTypeSoundEff(cards, currTurnCards = null) {
        let typeSound = 10;
        let arrPig = [48, 49, 50, 51];

        if (arrPig.some(ele => cards.includes(ele))) {
            typeSound = audio_clip.HAINE;
        }
        if (currTurnCards.some(ele => arrPig.includes(ele))) {//chat dc 2.
            this.countChat++;
            if (this.countChat == 1)
                typeSound = audio_clip.CHETMAYNE;
            else if (this.countChat == 2) {
                typeSound = audio_clip.MAYHABUOI;
            } else if (this.countChat == 3) {
                typeSound = audio_clip.DODI;
            }
        }
        this.soundManager.playAudioEffect(typeSound);
    }

    passTurn(turn) {
         //Utils.Log("Pass turn");
        this.players[this.convertChair(turn.chair)].setNotify("Bỏ lượt");
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
        let count = 0;
        cards.forEach(card => {
            var cardItem = cc.instantiate(this.cardItem);
            cardItem.setContentSize(cc.size(100, 135));
            cardItem.parent = this.cardLine;
            cardItem.getComponent(Card).setCardData(52);
            cc.tween(cardItem).delay(0.05 * count)
                .to(0.2, { angle: -10, scaleX: 0 })
                .to(0.2, { angle: 0, scaleX: 1 }).call(() => {
                    cardItem.getComponent(Card).setCardData(card, this.onCardSelectCallback.bind(this));
                    this.cardsOnHand[card] = cardItem;
                }).start();
            count++;
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
         //Utils.Log("TTTTTTTTTT endGame data : ", JSON.stringify(data));
        this.state_game = STATE_GAME.FINISH;

        for (let index = 0; index < 4; index++) {
            this.players[index].setTimeRemain(0);
        }
        if (this.cardLine.childrenCount > 0) {
            this.soundManager.playAudioEffect(audio_clip.THUADICUNG);
        }
        var coinChanges = data.ketQuaTinhTienList;
        for (let i = 0; i < coinChanges.length; i++) {
            var chair = this.convertChair(i);
            if (i < TienLenConstant.Config.MAX_PLAYER) {
                this.players[chair].setCoinChange(coinChanges[i]);
                this.players[chair].setCoin(data.currentMoney[i]);
            }
        }
        for (let i = 0, l = data.ketQuaTinhTienList.length; i < l; i++) {
            var chair = this.convertChair(i);
            if (i < TienLenConstant.Config.MAX_PLAYER) {
                let player = this.players[chair];
                if (data.winTypes[i] != 1) {
                    if (data.winTypes[i] < 11 && player.node.active) {
                        player.showAnimWinLose(true);
                        if ([4, 5, 6, 7, 8, 9].includes(data.winTypes[i])) {
                            player.showAnimToiTrang(data.winTypes[i]);
                        }
                        if (player == this.players[0]) {
                            this.soundManager.playAudioEffect(audio_clip.WIN)
                        }
                    } else {
                        player.showAnimWinLose(false);
                        if (player == this.players[0]) {
                            this.soundManager.playAudioEffect(audio_clip.LOSE)
                        }
                    }
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
        if (data.countDown == 0) {
            this.setTimeCountDown("Ván đấu kết thúc sau: ", 10);
            setTimeout(() => {
                this.cleanCardsOnHand();
                this.cleanCardLine();
                this.cleanCardsOnBoard();
                for (let index = 0; index < TienLenConstant.Config.MAX_PLAYER; index++) {
                    this.players[index].setStatus();
                    this.players[index].animWinLose.node.active = false;
                    this.players[index].animToiTrang.node.active = false;
                    this.players[index].setTimeRemain(0);
                }
            }, 5000);
        } else {
             //Utils.Log("TTTTTTTTTT TLMN");
            setTimeout(() => {
                this.setTimeCountDown("Ván đấu kết thúc sau: ", data.countDown - 6);
            }, 4000);

            setTimeout(() => {
                this.cleanCardsOnHand();
                this.cleanCardLine();
                this.cleanCardsOnBoard();
                for (let index = 0; index < TienLenConstant.Config.MAX_PLAYER; index++) {
                    this.players[index].animWinLose.node.active = false;
                    this.players[index].animToiTrang.node.active = false;
                    this.players[index].setStatus();
                    this.players[index].setTimeRemain(0);
                }
            }, 9000);
        }
        TienLenNetworkClient.getInstance().send(new TienLenCmd.SendReadyAutoStart());
        cc.Tween.stopAllByTarget(this.popupResult.getChildByName("bg"));
        setTimeout(() => {
            // show Popup Result
            this.popupResult.active = true;
            TW(this.popupResult.getChildByName("bg")).set({ opacity: 150, scale: 0.8 }).to(0.3, { scale: 1.0, opacity: 255 }, { easing: cc.easing.backInOut }).start();
            this.contentPopupResult.destroyAllChildren();
            this.contentPopupResult.removeAllChildren();

            let isTLMN = data.sizeWinType == 5 ? false : true;
            let ketQuaTinhTien = data.ketQuaTinhTienList.slice().sort((x, y) => {
                return y - x;
            })

            let countId = 0;
            for (let index = 0; index < ketQuaTinhTien.length; index++) {
                if (ketQuaTinhTien[index] != 0) {
                    countId++;
                    let item = cc.instantiate(this.prefabPlayerResult).getComponent("TienLen.ItemPlayerResult");
                    let indexInDataKqtt = data.ketQuaTinhTienList.indexOf(ketQuaTinhTien[index]);
                    item.initItem({
                        id: index + 1,// index + 1,
                        userName: this.cachePlayersInfo[indexInDataKqtt],
                        goldChange: data.ketQuaTinhTienList[indexInDataKqtt],
                        cards: data.cards[indexInDataKqtt],
                        winTypes: data.winTypes[indexInDataKqtt],
                        isTLMN: isTLMN,
                        countId: countId
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
                // this.players[chair].setNotify("Sắp rời bàn !");
                App.instance.showToast(App.instance.getTextLang('txt_room_leave'));
                this.players[chair].setBackGame(true);
            } else {
                // this.players[chair].setNotify("Khô Máu !");
                App.instance.showToast(App.instance.getTextLang('txt_room_cancel_leave'));
                this.players[chair].setBackGame(false);
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
        this.fxWhoPlayFirst.getChildByName("txt").getComponent(cc.Label).string = "Đợi Bốn Đôi Thông !";
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

    onBtnClickBgChat(){
        this.UI_Chat.opacity = 100;
        this.bgChat.active = false;
    }

    onBtnClickBoxChat(){
        this.UI_Chat.opacity = 255;
        this.bgChat.active = true;
    }
    showUIChat() {
        this.onBtnClickBoxChat();
        this.UI_Chat.active = true;
        cc.tween(this.UI_Chat).to(0.3, { x: cc.winSize.width / 2 - this.UI_Chat.width / 2 }, { easing: cc.easing.sineOut }).start();
    }

    toggleUIChat(){
        if(this.UI_Chat.active == false){
            this.showUIChat();
        }
        else{
            this.closeUIChat();
        }
    }

    closeUIChat() {
        this.UI_Chat.active = false;
        cc.tween(this.UI_Chat).to(0.3, { x: cc.winSize.width / 2 + this.UI_Chat.width / 2 }, { easing: cc.easing.sineIn }).call(() => {
            this.UI_Chat.active = false;
        }).start();
    }

    chatEmotion(event, id) {
         //Utils.Log("BaCay chatEmotion id : ", id);
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

    chatNhanhMsg(msg) {
        if (msg.trim().length > 0) {
             //Utils.Log("chatNhanhMsg:"+msg);
            TienLenNetworkClient.getInstance().send(new TienLenCmd.SendChatRoom(0, msg));
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
        cc.Tween.stopAllByTarget(this.popupResult);
        TW(this.popupResult.getChildByName("bg")).to(0.3, { opacity: 150, scale: 0.8 }, { easing: cc.easing.backIn }).call(() => {
            this.popupResult.active = false;
        }).start();
    }
    getTypeCard(arrCard) {
        let indexsToCard = [];
        arrCard.forEach((element) => {
            indexsToCard.push(CardGroup.indexToCard(element))
        });
        let cardtype = new CardGroup(indexsToCard).getCardType();
        return cardtype;
    }
    showAnimTypeCard(typeCard, cards) {
        let animName = "";
        switch (typeCard) {
            case TYPECARD.BA_DOI_THONG:
                animName = "chat ba doi thong"
                break;
            case TYPECARD.BON_DOI_THONG:
                animName = "chat bon doi thong"
                break;
            case TYPECARD.TU_QUY:
                animName = "chat tu quy"
                break;
        }
        if (animName != "") {
            this.animBeat.node.parent.active = true;
            this.animBeat.setAnimation(0, animName, true);
            this.showSpecialCard(cards);
        }


    }
    showSpecialCard(indexs) {
        // card.zIndex = 1000;
        // card.runAction(
        //     cc.sequence(
        //         cc.delayTime(delay),
        //         cc.spawn(
        //             cc.scaleTo(0.15,0.01,1.2),
        //             cc.skewTo(0.15,0,-15),
        //         ),
        //         cc.callFunc(()=>{
        //             card.skewY = 15;
        //             card.getComponent('Card').setTextureWithCode(code);
        //         }),
        //         cc.spawn(
        //             cc.scaleTo(0.15,1.2),
        //             cc.skewTo(0.15,0,0),
        //         ),
        //         cc.delayTime(0.1),
        //         cc.scaleTo(0.2,1).easing(cc.easeCubicActionIn()),
        //         cc.delayTime(0.2),

        //     )
        // )
        let totalSize = ((120 * indexs.length) / 2) + 60;
        let initPos = cc.v2(-(totalSize / 2) + 60, 0);
        let cardNode = []
        for (let i = 0; i < indexs.length; i++) {
            var cardItem = cc.instantiate(this.cardItem);
            cardNode.push(cardItem);
            cardItem.parent = this.animBeat.node.parent
            cardItem.getComponent(Card).setCardData(indexs[i]);
            // cardItem.setScale(0.6, 0.6);
            cardItem.setPosition(cc.v2(0, -cc.winSize.height));
            cardItem.active = true;
            TW(cardItem).delay(0.05 * i).to(0.15, { x: initPos.x + (i * 60), y: -cc.winSize.height / 4, scaleX: 0.01, scaleY: 1.2, skewX: 0, skewY: -15 })
                .call(() => {

                    cardItem.skewY = 15;
                }).to(0.15, { x: initPos.x + (i * 60), y: initPos.y, scale: 1.2, skewX: 0, skewY: 0 })
                .delay(0.1)
                .to(0.2, { scale: 1.0 }, { easing: cc.easing.cubicOut })
                .start();
        }
        setTimeout(() => {
            cardNode.forEach((card) => {
                card.destroy();
            });
            this.animBeat.node.parent.active = false;
        }, 2500)
        this.animBeat.node.scale = 0.6;
        this.animBeat.node.setPosition(cc.v2(-74.5, -158));
    }
}
