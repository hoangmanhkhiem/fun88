export namespace TienLenConstant {
    export class GameState {
        static NONE = -1;
        static AUTOSTART = 0;
        static JOINROOM = 4;
        static FIRSTTURN = 1;
        static CHIABAI = 2;
        static CHANGETURN = 3;
        static USERJOIN = 5;
        static DANHBAI = 6;
        static BOLUOT = 7;
        static QUIT = 8;
        static USERLEAVE = 12;
        static ENDGAME = 13;
        static UPDATEMATH = 14;
        static UPDATEOWNERROOM = 15;
        static PLAYCONTINUE = 16;
        static CHATCHONG = 17;
        static JACKPOT = 18;
        static REASONQUIT = 19;
        static NOTIFYOUTROOM = 20;
        static WAITBONDOITHONG = 21;
    }

    export class Config {
        static MAX_PLAYER = 4;
        static MAX_CARDS = 13;
    }

    export class SortType {
        static kSortTangDan = 0;
        static kSortGroup = 1;
        static kSortUnkown = 2;
    }

    export class PlayerType {
        static MY = 0;
        static ENEMY = 1;
        static STATENONE = 0;
        static STATEVIEWING = 1;
        static STATEBAOSAM = 2;
    }
}
export default TienLenConstant;