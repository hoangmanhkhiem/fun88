import cmd from "./Loto.Cmd";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;
    @property(cc.Label)
    labelTime: cc.Label = null;
    @property(cc.Label)
    labelMode: cc.Label = null;
    @property(cc.Label)
    labelNums: cc.Label = null;
    @property(cc.Label)
    labelBet: cc.Label = null;
    @property(cc.Label)
    labelWin: cc.Label = null;
    @property(cc.Label)
    labelResult: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    initItem(index, data) {
        this.bg.active = index % 2 == 0 ? false : true;
        this.labelTime.string = data.timePlay.split(" ")[0];
        this.labelMode.string = cmd.Code.LOTO_GAME_MODE_NAME[data.gameMode];
        // cc.log("Loto ItemHistory row : ", data);
        let a = data.number.toString();
        let b = a.indexOf(",");
        if (data.number.length > 0 && data.number.toString().indexOf(",")!=-1) {
            for (let index = 0; index < data.number.length; index++) {
                if (index == 0) {
                    this.labelNums.string += "";
                } else if (index == 5) {
                    this.labelNums.string += "\n";
                } else {
                    this.labelNums.string += ", ";
                }
                this.labelNums.string += data.number[index];
            }
        } else {
            this.labelNums.string = data.number.toString();
        }

        this.labelBet.string = Utils.formatNumber(data.pay * data.payRate);
        this.labelWin.string = Utils.formatNumber(data.win);

        if (data.status == 0) {
            this.labelResult.string = "Chờ kết quả XS";
        } else if (data.status == 1) {
            this.labelResult.string = "Hoàn thành";
            // if (data.winNumber.length > 0) {
            //     for (let index = 0; index < data.winNumber.length; index++) {
            //         if (index == 0) {
            //             this.labelResult.string += "";
            //         } else if (index == 5) {
            //             this.labelResult.string += "\n";
            //         } else {
            //             this.labelResult.string += ", ";
            //         }
            //         this.labelResult.string += data.winNumber[index];
            //     }
            // } else {
            //     this.labelResult.string = data.winNumber;
            // }
        }/* else if (data.status == 1) {
            this.labelResult.string = "Hủy";
        }*/ else {
            this.labelResult.string = "Lỗi";
        }
    }

    // update (dt) {}
}
