
export default class Res {
    static instance: Res;
    cards = [];
    cardItem = null;

    public static getInstance(): Res {
        if (this.instance == null)
            this.instance = new Res();
        return this.instance;
    }

    constructor() {
        cc.loader.loadResDir("sprites/LaBai", cc.SpriteFrame, (err, sprs, urls) => {
            this.cards = sprs;
        });
        cc.loader.loadRes("prefabs/card/card", cc.Prefab, (err, prefab) => {
            this.cardItem = prefab;
        });
    }

    getCardFace(index) {
        if (index < 10) index = "0" + index;
        return this.cards.filter(card => card.name == ("labai_" + index))[0];
    }

    getCardItem() {
        return this.cardItem;
    }
}
