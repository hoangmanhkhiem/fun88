
import Lobby from "./XocDia.Lobby";
import Play from "./XocDia.Play";
import XocDiaNetworkClient from "./XocDia.XocDiaNetworkClient";

import Configs from "../../Loading/src/Configs";
import App from "../../Lobby/LobbyScript/Script/common/App";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import cmdNetwork from "../../Lobby/LobbyScript/Script/networks/Network.Cmd";
import SPUtils from "../../Lobby/LobbyScript/Script/common/SPUtils";
import AudioManager from "../../Lobby/LobbyScript/Script/common/Common.AudioManager";
enum audio_clip {
    BG = 0,
    LOSE = 1,
    WIN = 2,
    START_GAME = 3,
    XOC_DIA = 4,
    CHIP = 5
}
const { ccclass, property } = cc._decorator;
@ccclass("XocDia.SoundManager")
export class SoundManager {
    @property(cc.AudioSource)
    bgMusic: cc.AudioSource = null;

    @property(cc.AudioSource)
    effSound: cc.AudioSource = null;

    @property([cc.AudioClip])
    listAudio: cc.AudioClip[] = [];
    playBgMusic() {
        if (SPUtils.getMusicVolumn() > 0) {
            this.bgMusic.clip = this.listAudio[audio_clip.BG];
            this.bgMusic.play();
        }
    }
    playAudioEffect(indexAudio) {
        if (SPUtils.getSoundVolumn() > 0) {
            cc.audioEngine.play(this.listAudio[indexAudio], false, 1);
        }
    }
    stopBgMusic() {
        this.bgMusic.stop();
    }
}
@ccclass
export default class XocDiaController extends cc.Component {

    public static instance: XocDiaController = null;

    @property(cc.Node)
    noteLobby: cc.Node = null;
    @property(cc.Node)
    nodePlay: cc.Node = null;
    @property(SoundManager)
    soundManager: SoundManager = null;

    public lobby: Lobby = null;
    public play: Play = null;

    onLoad() {
        XocDiaController.instance = this;
        this.lobby = this.noteLobby.getComponent(Lobby);
    }

    start() {
        this.lobby.init();
        // this.play.init();

        this.lobby.node.active = true;
         //this.play.node.active = true;

        App.instance.showErrLoading("Đang kết nối tới server...");
        XocDiaNetworkClient.getInstance().addOnOpen(() => {
            App.instance.showErrLoading("Đang đăng nhập...");
            XocDiaNetworkClient.getInstance().send(new cmdNetwork.SendLogin(Configs.Login.Nickname, Configs.Login.AccessToken));
        }, this);
        XocDiaNetworkClient.getInstance().addOnClose(() => {
            //  cc.log("-----------XocDia close:"+XocDiaNetworkClient.getInstance().isConnected());
            XocDiaNetworkClient.getInstance().close();
            App.instance.loadScene("Lobby");
        }, this);
        XocDiaNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            switch (inpacket.getCmdId()) {
                case cmdNetwork.Code.LOGIN:
                    App.instance.showLoading(false);
                    this.lobby.actRefesh();
					//this.lobby.actQuickPlay();
                    break;
            }
        }, this);
        //  cc.log("-----------XocDia start:"+XocDiaNetworkClient.getInstance().isConnected());
        if(XocDiaNetworkClient.getInstance().isConnected() == false){
            XocDiaNetworkClient.getInstance().connect();
        }
        AudioManager.getInstance().playBackgroundMusic(this.soundManager.listAudio[audio_clip.BG]);
    }

    public showLobby() {
        this.lobby.show();
        this.play.node.active = false;
    }
    public showGamePlay(res) {
        if (this.play == null) {
            App.instance.showLoading(true);
            cc.assetManager.loadBundle("XocDia", (err, bundleGame) => {
                bundleGame.load("res/prefabs/Play", cc.Prefab, (finish, total) => {
                    App.instance.showErrLoading(App.instance.getTextLang('txt_loading1'));
                }, (err, prefab: cc.Prefab) => {
                    this.play = cc.instantiate(prefab).getComponent(Play);
                    this.play.node.parent = this.node;
                    this.play.init();
                    this.play.show(res);
                    App.instance.showLoading(false);
                    //  cc.log("init game player succecss!");
                    this.lobby.node.active = false;
                });
            })
        } else {
            this.lobby.node.active = false;
            this.play.show(res);
        }
    }
    public playAudioEffect(index) {
        this.soundManager.playAudioEffect(index);
    }
}
