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
            // Bai cao thi J, Q, K = 10
            let score = Math.floor(a / 4) + 1;
            if (score == 11 || score == 12 || score == 13) {
                score = 10;
            }
            return score;
        }

        static getChatById(a: number): number {
            return a % 4
        }

        static getNormalId(a: number): number {
            var b: number = -1;
            b = 4 > a ? 11 : 8 > a ? 12 : Math.floor(a / 4) - 2;
            a = Math.floor(a % 4);
            3 == a ? a = 2 : 2 == a && (a = 3);
            return 4 * b + a
        }
    }
}
export default common.CardUtils;