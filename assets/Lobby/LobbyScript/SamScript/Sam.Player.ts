import Player from "../TienLenScript/TienLen.Playerz"

const {ccclass, property} = cc._decorator;

@ccclass
export default class SamPlayer extends Player {

    setCardRemain(cardSize) {
        super.setCardRemain(cardSize);
        if (cardSize == 1)
            this.setStatus("BÁO");
    }
}


