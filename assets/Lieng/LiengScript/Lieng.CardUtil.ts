const { ccclass, property } = cc._decorator;

export namespace common {
    export class CardUtils {
        static id: number;
        static so: number;
        static chat: number;
        static diem: number;

        static getCardInfo(a: number) {
            this.id = a;
            this.so = this.getSoById(a);
            this.chat = this.getChatById(a);
            this.diem = this.getDiemById(a)
        }

        static getSoById(a: number): number {
            return Math.floor(a / 4)
        }

        static getDiemById(a: number): number {
            return Math.floor(a / 4) <= 8 ? Math.floor(a / 4) + 1 : 0;
        }

        static getChatById(a: number): number {
            return a % 4
        }

        static getNormalId(a: number): number {
            //return 4 > a ? a + 48 : a -4;
            var b: number = -1;
            b = 4 > a ? 11 : 8 > a ? 12 : Math.floor(a / 4) - 2;
            a = Math.floor(a % 4);
            3 == a ? a = 2 : 2 == a && (a = 3);
            return 4 * b + a
        }
    }
}
export default common.CardUtils;