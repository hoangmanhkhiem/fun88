import LobbyLobbyController from "../../Lobby/LobbyScript/Lobby.LobbyController";
import PopupSecurity from "../../Lobby/LobbyScript/Lobby.PopupSecurity";
import PopupRegister from "../../Lobby/LobbyScript/PopupRegister";


const { ccclass, property } = cc._decorator;

@ccclass
export class Global {
    static PopupSecurity: PopupSecurity = null;
    static LobbyController: LobbyLobbyController = null;
    static PopupRegister: PopupRegister = null;
    // static LanguageManager: LanguageLanguageManager = null;
    static BundleLobby: cc.AssetManager.Bundle = null;
    static isLoginFromOtherPlaces = false;
    static LanguageManager :any=null;
    // update (dt) {}

}
