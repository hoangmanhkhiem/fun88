
import VersionConfig from "../../../Loading/src/VersionConfig";
import MiniGame from "../../../Lobby/LobbyScript/MiniGame";
import App from "../../../Lobby/LobbyScript/Script/common/App";
import BroadcastReceiver from "../../../Lobby/LobbyScript/Script/common/BroadcastReceiver";
import MiniGameNetworkClient from "../../../Lobby/LobbyScript/Script/networks/MiniGameNetworkClient";
import TX2NetworkClient from "../../../Lobby/LobbyScript/Script/networks/TX2NetworkClient";
import TaiXiuMiniController from "../TaiXiu1/TaiXiuMini.TaiXiuMiniController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TaiXiuDoubleController extends MiniGame {

    static instance: TaiXiuDoubleController = null;

    @property(cc.Node)
    taiXiu1Node: cc.Node = null;

    

    @property(cc.Node)
    btnSwitch: cc.Node = null;

    taiXiu1: TaiXiuMiniController = null;

    private isShowTX1 = true;

    public onLoad() {
        super.onLoad();
        this.taiXiu1 = this.taiXiu1Node.getComponent(TaiXiuMiniController);
        TaiXiuDoubleController.instance = this;

        switch (VersionConfig.CPName) {
            
        }
    }

    public reOrder(){
        super.reOrder();
        // App.instance.showBgMiniGame("TaiXiu");
    }

    public start() {
        BroadcastReceiver.register(BroadcastReceiver.USER_LOGOUT, () => {
            if (!this.node.active) return;
            this.dismiss();
        }, this);

        MiniGameNetworkClient.getInstance().addOnClose(() => {
            if (!this.node.active) return;
            this.dismiss();
        }, this);

        TX2NetworkClient.getInstance().addOnClose(() => {
            if (!this.node.active) return;
            this.dismiss();
        }, this);
    }

    public show() {
        super.show();
        App.instance.showBgMiniGame("TaiXiu");
        this.isShowTX1 = true;

        switch (VersionConfig.CPName) {
            case VersionConfig.CP_NAME_HT68:
            case VersionConfig.CP_NAME_F69:
            case VersionConfig.CP_NAME_R99_2:
            case VersionConfig.CP_NAME_MARBLES99:
            case VersionConfig.CP_NAME_SIN99:
            case VersionConfig.CP_NAME_ZINGVIP:
                //nothing
                break;
            default:
                TX2NetworkClient.getInstance().checkConnect(() => {
                    this.checkShow();
                });
                break;
        }

        MiniGameNetworkClient.getInstance().checkConnect(() => {
            this.taiXiu1.show();
            this.checkShow();
        });
        App.instance.buttonMiniGame.showTimeTaiXiu(false);
        this.checkShow();
    }

    public dismiss() {
        super.dismiss();
        App.instance.buttonMiniGame.showTimeTaiXiu(true);
        this.taiXiu1.dismiss();
        App.instance.hideGameMini("TaiXiu");
    }



    private checkShow() {
        if (this.isShowTX1) {
            this.taiXiu1.gamePlay.scale = 1;
            this.taiXiu1.gamePlay.position = cc.Vec3.ZERO;
            this.taiXiu1.nodePanelChat.active = true;
            this.taiXiu1.node.setSiblingIndex(1);

          
        } else {
           

            this.taiXiu1.gamePlay.scale = 0.5;
            this.taiXiu1.gamePlay.position = cc.v3(-405, 234,0);
            this.taiXiu1.nodePanelChat.active = false;
            this.taiXiu1.layoutBet.active = false;
        }
    }

    public actSwitch() {
        this.isShowTX1 = !this.isShowTX1;
        this.checkShow();
    }
}
