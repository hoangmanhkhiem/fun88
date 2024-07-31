const { ccclass, property } = cc._decorator;
@ccclass
export default class Res extends cc.Component {
    static instance: Res;
    // cards = [];
    // cardItem = null;
    @property(cc.Prefab)
    cardItem: cc.Prefab = null;
    @property([cc.SpriteFrame])
    cards: cc.SpriteFrame[] = [];
    public static getInstance(): Res {
        return this.instance;
    }

    onLoad(){
        Res.instance = this;
        cc.game.addPersistRootNode(Res.instance.node)
    }

    // constructor() {
    //     cc.loader.loadResDir("sprites/LaBai", cc.SpriteFrame, (err, sprs, urls) => {
    //         this.cards = sprs;
    //     });
    //     cc.loader.loadRes("prefabs/card/card", cc.Prefab, (err, prefab) => {
    //         this.cardItem = prefab;
    //     });
    // }

    getCardFace(index) {
        if (index < 10) index = "0" + index;
        return this.cards.filter(card => card.name == ("labai_" + index))[0];
    }

    getCardItem() {
        return this.cardItem;
    }
}
