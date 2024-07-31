import Cmd from './MauBinh.Cmd';

export namespace maubinh {
    export class DetectGroupCards {
        groupKind = -1;
        cardList = [];
        valueList = [];

        getGroupCardsInfo() {
            this.groupKind = this.getGroupKind();
            return this.groupKind;
        }

        getGroupKind() {
            if (1 == this.cardList.length) return Cmd.Code.GROUP_MAU_THAU;
            if (3 == this.cardList.length) {
                if (this.isSamCo()) return Cmd.Code.GROUP_SAM_CO;
                if (this.isMotDoi()) return Cmd.Code.GROUP_MOT_DOI;
            }
            if (5 == this.cardList.length) {
                if (this.isThungPhaSanh()) return Cmd.Code.GROUP_THUNG_PHA_SANH;
                if (this.isTuQuy()) return Cmd.Code.GROUP_TU_QUY;
                if (this.isCuLu()) return Cmd.Code.GROUP_CU_LU;
                if (this.isThung()) return Cmd.Code.GROUP_THUNG;
                if (this.isSanh()) return Cmd.Code.GROUP_SANH;
                if (this.isSamCo()) return Cmd.Code.GROUP_SAM_CO;
                if (this.isThu()) return Cmd.Code.GROUP_THU;
                if (this.isMotDoi()) return Cmd.Code.GROUP_MOT_DOI;
            }
            this.valueList = [];
            for (var a = this.getSortedCardList(), b = this.cardList.length - 1; 0 <= b; b--) this.valueList.push(a[b].getNumber());
            return Cmd.Code.GROUP_MAU_THAU;
        }

        getGroupKindLevel(a) {
            var b = Cmd.Code.LV_BINH_THUONG;
            !a || this.groupKind != Cmd.Code.GROUP_THUNG_PHA_SANH && this.groupKind != Cmd.Code.GROUP_SANH || (10 == this.valueList[0] ? b = Cmd.Code.LV_THUONG : 1 == this.valueList[0] && (b = Cmd.Code.LV_HA));
            return b;
        }

        getSortedCardList() {
            var a = [];
            for (let b = 0; b < this.cardList.length; b++) {
                a.push(this.cardList[b]);
            }
            // return a.sort(function (a, c) { return c.getId() - a.getId(); });
            return a.sort(function (a, c) { return a.getId() - c.getId(); });
        }

        sortCardList(isIncrease) {
            if (isIncrease) {
                this.cardList.sort(function (a, c) { return c - a; });
            } else {
                this.cardList.sort(function (a, c) { return a - c; });
            }
        }


        // Kinds
        isThungPhaSanh() {
            if (5 != this.cardList.length) return !1;
            for (var a = this.getSortedCardList(), b = 1, c = 1; c < this.cardList.length; c++) a[c].getSuit() == a[c - 1].getSuit() && (a[c].getNumber() == a[c - 1].getNumber() + 1 || 2 == a[0].getNumber() && 14 == a[c].getNumber()) && b++;
            b == this.cardList.length && (this.valueList = [], 2 == a[0].getNumber() && 14 == a[a.length - 1].getNumber() ? this.valueList.push(1) : this.valueList.push(a[0].getNumber()));
            return b == this.cardList.length;
        }

        isTuQuy() {
            if (5 != this.cardList.length) return !1;
            for (var a = 0; a < this.cardList.length; a++)
                for (var b = 1, c = 0; c < this.cardList.length; c++)
                    if (a != c && this.cardList[a].getNumber() == this.cardList[c].getNumber() && b++, 4 == b) return this.valueList = [], this.valueList.push(this.cardList[a].getNumber()), !0;
            return !1
        }

        isCuLu() {
            if (5 != this.cardList.length) return !1;
            var a = this.getSortedCardList(),
                b = !1;
            a[0].getNumber() == a[1].getNumber() && (a[1].getNumber() == a[2].getNumber() && a[3].getNumber() == a[4].getNumber() && (b = !0, this.valueList = [], this.valueList.push(a[0].getNumber()), this.valueList.push(a[3].getNumber())), a[2].getNumber() ==
                a[3].getNumber() && a[3].getNumber() == a[4].getNumber() && (b = !0, this.valueList = [], this.valueList.push(a[2].getNumber()), this.valueList.push(a[0].getNumber())));
            return b
        }

        isThung() {
            var a = this.getSortedCardList();
            if (5 != this.cardList.length) return !1;
            for (var b = 1; b < this.cardList.length; b++)
                if (a[b].getSuit() != a[0].getSuit()) return !1;
            this.valueList = [];
            for (b = this.cardList.length - 1; 0 <= b; b--) this.valueList.push(a[b].getNumber());
            return !0
        }

        isSanh() {
            if (5 != this.cardList.length) return !1;
            for (var a = this.getSortedCardList(), b = 1, c = 1; c < this.cardList.length; c++)
                (a[c].getNumber() == a[c - 1].getNumber() + 1 || 2 == a[0].getNumber() && 14 == a[c].getNumber()) && b++;
            b == this.cardList.length && (this.valueList = [], 2 == a[0].getNumber() && 14 == a[a.length - 1].getNumber()
                ? this.valueList.push(1) : this.valueList.push(a[0].getNumber()));
            return b == this.cardList.length;
        }

        isSamCo() {
            for (var a = 0; a < this.cardList.length; a++) {
                for (var b = 1, c = 0; c < this.cardList.length; c++) a != c && this.cardList[a].getNumber() ==
                    this.cardList[c].getNumber() && b++;
                if (3 == b) return this.valueList = [], this.valueList.push(this.cardList[a].getNumber()), !0
            }
            return !1
        }

        isThu() {
            if (5 != this.cardList.length) return !1;
            for (var a = [], b = 0; b < this.cardList.length - 1; b++)
                if (-1 == a.indexOf(this.cardList[b].getNumber()))
                    for (var c = b + 1; c < this.cardList.length; c++)
                        if (this.cardList[b].getNumber() == this.cardList[c].getNumber()) {
                            a.push(this.cardList[b].getNumber());
                            break
                        }
            if (2 == a.length) {
                this.valueList = [];
                this.valueList.push(Math.max(a[0], a[1]));
                this.valueList.push(Math.min(a[0], a[1]));
                for (b = 0; b < this.cardList.length; b++) - 1 == a.indexOf(this.cardList[b].getNumber()) && this.valueList.push(this.cardList[b].getNumber());
                return !0
            }
            return !1
        }

        isMotDoi() {
            for (var a = [], b = 0; b < this.cardList.length - 1; b++)
                for (let c = b + 1; c < this.cardList.length; c++) this.cardList[b].getNumber() == this.cardList[c].getNumber() && a.push(this.cardList[b].getNumber());
            if (1 == a.length) {
                this.valueList = [];
                this.valueList.push(a[0]);
                let d = this.getSortedCardList();
                for (b = this.cardList.length - 1; 0 <= b; b--) d[b].getNumber() != a[0] && this.valueList.push(d[b].getNumber());
                return !0
            }
            return !1
        }

        addCard(a) {
            this.cardList.push(a);
        }

        removeCard(id) {
            for (let b = 0; b < this.cardList.length; b++)
                if (this.cardList[b] == id) {
                    this.cardList.splice(b, 1);
                    break
                }
        }
    }
}

export default maubinh.DetectGroupCards;

