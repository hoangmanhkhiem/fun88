import SamPlayer from "./Sam.Player"
import SamNetworkClient from "../Script/networks/SamNetworkClient";
import SamCmd from "./Sam.Cmd";
import Room from "./Sam.Room";
import InGame from "../TienLenScript/TienLenz.InGame"

const { ccclass, property } = cc._decorator;

@ccclass
export default class SamInGame extends InGame {

    public static instance: SamInGame = null;

    @property({
        type: SamPlayer,
        override: true
    })
    players: SamPlayer[] = [];

    onLoad() {
        SamInGame.instance = this;
        this.initRes();
    }

    actLeaveRoom() {
        SamNetworkClient.getInstance().send(new SamCmd.SendRequestLeaveGame());
    }

    userLeaveRoom(data) {
        var chair = this.convertChair(data.chair);
        this.players[chair].setLeaveRoom();
        if (chair == 0) {
            this.show(false);
            Room.instance.show(true);
            Room.instance.refreshRoom();
        }
    }

    chiaBai(data) {
        super.chiaBai(data);
        this.setActiveButtons(["bt_sam", "bt_huy_sam"], [true, true]);
        this.players.forEach(p => {
            if (p.active)
                p.setTimeRemain(data.timeBaoSam);
        });
    }

    sendSubmitTurn(cardSelected) {
        SamNetworkClient.getInstance().send(new SamCmd.SendDanhBai(!1, cardSelected));
    }

    sendPassTurn() {
        SamNetworkClient.getInstance().send(new SamCmd.SendBoLuot(!0));
    }

    actBaoSam() {
        SamNetworkClient.getInstance().send(new SamCmd.SendBaoSam());
    }

    actHuyBaoSam() {
        SamNetworkClient.getInstance().send(new SamCmd.SendHuyBaoSam());
    }

    onBaoSam(data) {
        var chair = this.convertChair(data.chair);
        var p = this.players[chair];
        p.setTimeRemain(0);
        p.setStatus("BÁO SÂM");
        if (data.chair == this.myChair)
            this.setActiveButtons(["bt_sam", "bt_huy_sam"], [false, false]);
    }

    onHuyBaoSam(data) {
        var chair = this.convertChair(data.chair);
        var p = this.players[chair];
        p.setTimeRemain(0);
        p.setStatus("HUỶ SÂM");
        if (data.chair == this.myChair)
            this.setActiveButtons(["bt_sam", "bt_huy_sam"], [false, false]);
    }

    onQuyetDinhSam(data) {
        this.setActiveButtons(["bt_sam", "bt_huy_sam"], [false, false]);
        if (data.isSam) {
            var chair = this.convertChair(data.chair);
            var p = this.players[chair];
            if (p.active)
                this.showToast(p.info.nickName + " được quyền báo sâm");
        }
    }

    notifyUserRegOutRoom(res) {
        let outChair = res["outChair"];
        let isOutRoom = res["isOutRoom"];
        let chair = this.convertChair(outChair);
        if (chair == 0) {
            if (isOutRoom) {
                this.players[chair].setNotify("Sắp rời bàn !");
            } else {
                this.players[chair].setNotify("Khô Máu !");
            }
        }
    }

    playerChat(res) {
        let chair = res["chair"];
        let isIcon = res["isIcon"];
        let content = res["content"];

        let seatId = this.convertChair(chair);
        if (isIcon) {
            // Chat Icon
            this.players[seatId].showChatEmotion(content);
        } else {
            // Chat Msg
            this.players[seatId].showChatMsg(content);
        }
    }


    playerChatChong(res) {
        let winChair = res["winChair"];
        let lostChair = res["lostChair"];
        let winMoney = res["winMoney"];
        let lostMoney = res["lostMoney"];
        let winCurrentMoney = res["winCurrentMoney"];
        let lostCurrentMoney = res["lostCurrentMoney"];

        setTimeout(() => {
            let seatIdWin = this.convertChair(winChair);
            let seatIdLost = this.convertChair(lostChair);
            this.players[seatIdWin].setCoinChange(winMoney);
            this.players[seatIdLost].setCoinChange(lostMoney);
            this.players[seatIdWin].setCoin(winCurrentMoney);
            this.players[seatIdLost].setCoin(lostCurrentMoney);
            setTimeout(() => {
                this.players[seatIdWin].setStatus("");
                this.players[seatIdLost].setStatus("");
            }, 2000);
        }, 1000);
    }

    showPopupGuide() {
        this.popupGuide.active = true;
    }

    closePopupGuide() {
        this.popupGuide.active = false;
    }

    // Chat
    showUIChat() {
        this.UI_Chat.active = true;
        this.UI_Chat.runAction(
            cc.moveTo(0.5, 420, 0)
        );
    }

    closeUIChat() {
        this.UI_Chat.runAction(
            cc.moveTo(0.5, 1000, 0)
        );
    }

    chatEmotion(event, id) {
        //  cc.log("BaCay chatEmotion id : ", id);
        SamNetworkClient.getInstance().send(new SamCmd.SendChatRoom(1, id));
        this.closeUIChat();
    }

    chatMsg() {
        if (this.edtChatInput.string.trim().length > 0) {
            SamNetworkClient.getInstance().send(new SamCmd.SendChatRoom(0, this.edtChatInput.string));
            this.edtChatInput.string = "";
            this.closeUIChat();
        }
    }
}
