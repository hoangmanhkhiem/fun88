import Dialog from "../../../Lobby/LobbyScript/Script/common/Dialog";
import Utils from "../../../Lobby/LobbyScript/Script/common/Utils";
import TaiXiuMini2Controller from "./TaiXiuMini2.TaiXiuMiniController";


const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupSoiCau extends Dialog {
    @property(cc.Node)
    lineTemplate: cc.Node = null;

    @property(cc.Node)
    iconTaiTemplate: cc.Node = null;
    @property(cc.Node)
    iconXiuTemplate: cc.Node = null;

    @property(cc.Node)
    iconXX1Template: cc.Node = null;
    @property(cc.Node)
    iconXX2Template: cc.Node = null;
    @property(cc.Node)
    iconXX3Template: cc.Node = null;

    @property(cc.Node)
    iconNumberTemplate: cc.Node = null;

    @property(cc.Node)
    page1: cc.Node = null;
    @property(cc.Label)
    lblLastSession: cc.Label = null;
    @property(cc.Node)
    xx1Draw: cc.Node = null;
    @property(cc.Node)
    xx2Draw: cc.Node = null;
    @property(cc.Node)
    xx3Draw: cc.Node = null;
    @property(cc.Node)
    xx123Draw: cc.Node = null;

    @property(cc.Node)
    page2: cc.Node = null;
    @property(cc.Label)
    lblTai1: cc.Label = null;
    @property(cc.Label)
    lblTai2: cc.Label = null;
    @property(cc.Label)
    lblXiu1: cc.Label = null;
    @property(cc.Label)
    lblXiu2: cc.Label = null;
    @property(cc.Node)
    contentDraw: cc.Node = null;

    show() {
        super.show();
        this.page1.active = false;
        this.page2.active = false;
        this.lineTemplate.parent.active = false;
    }

    dismiss() {
        super.dismiss();
        this.page1.active = false;
        this.page2.active = false;
    }

    _onShowed() {
        super._onShowed();

        this.drawPage1();
        this.page1.active = true;
        this.page2.active = false;
    }

    toggleXX1(target: cc.Toggle) {
        this.xx1Draw.active = target.isChecked;
    }

    toggleXX2(target: cc.Toggle) {
        this.xx2Draw.active = target.isChecked;
    }

    toggleXX3(target: cc.Toggle) {
        this.xx3Draw.active = target.isChecked;
    }

    togglePage() {
        this.page1.active = !this.page1.active;
        this.page2.active = !this.page1.active;
        if (this.page1.active) {
            this.drawPage1();
        } else {
            this.drawPage2();
        }
    }

    private drawPage1() {
        var data = TaiXiuMini2Controller.instance.histories.slice();
        if (data.length > 22) {
            data.splice(0, data.length - 22);
        }
        var last = data[data.length - 1];
        var lastDices = last.dices;
        var lastScore = lastDices[0] + lastDices[1] + lastDices[2];
        this.lblLastSession.string = "Phiên gần nhất: (#" + last.session + ")  " + (lastScore >= 11 ? "TÀI" : "XỈU") + "  " + lastScore + "(" + lastDices[0] + "-" + lastDices[1] + "-" + lastDices[2] + ")";

        let endPosX = 311;
        let startPosY = -195.822;
        let startPosY123 = -4.234;
        this.xx1Draw.removeAllChildren();
        this.xx2Draw.removeAllChildren();
        this.xx3Draw.removeAllChildren();
        this.xx123Draw.removeAllChildren();

        let _i = 0;
        var spacingX = 28.3;
        var spacingY = 30.2;
        for (var i = data.length - 1; i >= 0; i--) {
            var dices = data[i].dices;
            var score = dices[0] + dices[1] + dices[2];

            let startPosXX1 = cc.v2(endPosX - _i * spacingX, startPosY + (dices[0] - 1) * spacingY);
            let startPosXX2 = cc.v2(endPosX - _i * spacingX, startPosY + (dices[1] - 1) * spacingY);
            let startPosXX3 = cc.v2(endPosX - _i * spacingX, startPosY + (dices[2] - 1) * spacingY);
            let startPosXX123 = cc.v2(endPosX - _i * spacingX, startPosY123 + (score - 3) * (spacingY / 3));

            let iconXX1 = cc.instantiate(this.iconXX1Template);
            iconXX1.parent = this.xx1Draw;
            iconXX1.setPosition(startPosXX1);

            let iconXX2 = cc.instantiate(this.iconXX2Template);
            iconXX2.parent = this.xx2Draw;
            iconXX2.setPosition(startPosXX2);

            let iconXX3 = cc.instantiate(this.iconXX3Template);
            iconXX3.parent = this.xx3Draw;
            iconXX3.setPosition(startPosXX3);

            let iconXX123 = cc.instantiate(score >= 11 ? this.iconTaiTemplate : this.iconXiuTemplate);
            iconXX123.parent = this.xx123Draw;
            iconXX123.setPosition(startPosXX123);

            if (_i > 0) {
                dices = data[i + 1].dices;
                score = dices[0] + dices[1] + dices[2];

                let endPosXX1 = cc.v2(endPosX - (_i - 1) * spacingX, startPosY + (dices[0] - 1) * spacingY);
                let endPosXX2 = cc.v2(endPosX - (_i - 1) * spacingX, startPosY + (dices[1] - 1) * spacingY);
                let endPosXX3 = cc.v2(endPosX - (_i - 1) * spacingX, startPosY + (dices[2] - 1) * spacingY);
                let endPosXX123 = cc.v2(endPosX - (_i - 1) * spacingX, startPosY123 + (score - 3) * (spacingY / 3));

                let line = cc.instantiate(this.lineTemplate);
                line.parent = this.xx1Draw;
                line.width = Utils.v2Distance(startPosXX1, endPosXX1);
                line.setPosition(startPosXX1);
                line.angle = Utils.v2Degrees(startPosXX1, endPosXX1);
                line.color = cc.Color.BLACK.fromHEX("#ff1800");
                line.zIndex = 0;

                line = cc.instantiate(this.lineTemplate);
                line.parent = this.xx2Draw;
                line.width = Utils.v2Distance(startPosXX2, endPosXX2);
                line.setPosition(startPosXX2);
                line.angle = Utils.v2Degrees(startPosXX2, endPosXX2);
                line.color = cc.Color.BLACK.fromHEX("#ffea00");
                line.zIndex = 0;

                line = cc.instantiate(this.lineTemplate);
                line.parent = this.xx3Draw;
                line.width = Utils.v2Distance(startPosXX3, endPosXX3);
                line.setPosition(startPosXX3);
                line.angle = Utils.v2Degrees(startPosXX3, endPosXX3);
                line.color = cc.Color.BLACK.fromHEX("#35e100");
                line.zIndex = 0;

                line = cc.instantiate(this.lineTemplate);
                line.parent = this.xx123Draw;
                line.width = Utils.v2Distance(startPosXX123, endPosXX123);
                line.setPosition(startPosXX123);
                line.angle = Utils.v2Degrees(startPosXX123, endPosXX123);
                line.color = cc.Color.BLACK.fromHEX("#ffea00");
                line.zIndex = -1;
            }

            _i++;
        }
    }

    private drawPage2() {
        var startPosX = -283.773;
        var startPosY = 132.93;
        var spacingX = 28.3;
        var spacingY = 30.2;

        this.contentDraw.removeAllChildren();
        var data = [];
        var curData = [];
        var count = TaiXiuMini2Controller.instance.histories.length;
        var countTai = 0;
        var countXiu = 0;
        if (count > 1) {
            var dices = TaiXiuMini2Controller.instance.histories[0].dices;
            var score = dices[0] + dices[1] + dices[2];
            var isTai = score >= 11;
            var maxItem = 5;
            for (var i = 0; i < count; i++) {
                dices = TaiXiuMini2Controller.instance.histories[i].dices;
                score = dices[0] + dices[1] + dices[2];
                var _isTai = score >= 11;
                if (_isTai !== isTai) {
                    if (curData.length > maxItem) {
                        curData.splice(0, curData.length - maxItem);
                    }
                    data.push(curData);
                    if (isTai) {
                        countTai += curData.length;
                    } else {
                        countXiu += curData.length;
                    }

                    isTai = _isTai;
                    curData = [];
                    curData.push(score);
                } else {
                    curData.push(score);
                }
                if (i === count - 1) {
                    if (curData.length > maxItem) {
                        curData.splice(0, curData.length - maxItem);
                    }
                    data.push(curData);
                    if (isTai) {
                        countTai += curData.length;
                    } else {
                        countXiu += curData.length;
                    }
                }
            }
        }
        if (data.length > 21) {
            data.splice(0, data.length - 21);
        }
        // cc.log(data);
        this.lblTai1.string = "TÀI: " + countTai;
        this.lblXiu1.string = "XỈU: " + countXiu;
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                let score = data[i][j];
                let icon = cc.instantiate(this.iconNumberTemplate);
                icon.parent = this.contentDraw;
                icon.setPosition(startPosX + spacingX * i, startPosY - spacingY * j);
                icon.color = cc.Color.BLACK.fromHEX(score >= 11 ? "#4192ff" : "#FFFFFF");
                icon.getComponent(cc.Label).string = "" + score;
            }
        }

        startPosX = -281.793;
        startPosY = -58.447;
        var column = 0;
        var row = 0;
        var countTai = 0;
        var countXiu = 0;
        var data = TaiXiuMini2Controller.instance.histories.slice();
        if (data.length > 105) {
            data.splice(0, data.length - 105);
        }
        for (var i = 0; i < data.length; i++) {
            var score = data[i].dices[0] + data[i].dices[1] + data[i].dices[2];
            if (score >= 11) {
                countTai++;
            } else {
                countXiu++;
            }

            let iconXX123 = cc.instantiate(score >= 11 ? this.iconTaiTemplate : this.iconXiuTemplate);
            iconXX123.parent = this.contentDraw;
            iconXX123.setPosition(startPosX + spacingX * column, startPosY - spacingY * row);

            row++;
            if (row >= 5) {
                row = 0;
                column++;
            }
        }
        this.lblTai2.string = "TÀI: " + countTai;
        this.lblXiu2.string = "XỈU: " + countXiu;
    }
}