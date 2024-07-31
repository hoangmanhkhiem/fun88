import Cmd from './MauBinh.Cmd';

export namespace maubinh {
    export class MauBinhCard {
        id: -1;
        display: null;

        constructor(a, b) {
            this.id = a;
            this.display = b;
        }

        setCard(a, b) {
            this.id = 4 * (a - 2) + b
        }

        getNumber() {
            return Math.floor(this.id / 4) + 2
        }

        getSuit() {
            return this.id % 4
        }

        getId() {
            return this.id
        }

        getColor() {
            var a = this.getSuit();
            if (a == Cmd.Code.SPADE || a == Cmd.Code.CLUB) return Cmd.Code.BLACK;
            if (a == Cmd.Code.DIAMOND || a == Cmd.Code.HEART) return Cmd.Code.RED;
            //  cc.log("Not consistent card color with suit \x3d " + a);
            return null
        }
    }
}
export default maubinh.MauBinhCard;
