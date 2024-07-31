// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../Script/common/App";
import BaseTabShop from "./BaseTabShop";
import TabTopupChuyenKhoan from "./TabTopupChuyenKhoan";
import TabTopupManualBank from "./TabTopupManualBank";
import TapTopupManualMomo from "./TabTopupManualMomo";
import TapTopupManualZalo from "./TabTopupManualZalo";
import TabTopupMomo from "./TabTopupMomo";
import TabBanks from "./Lobby.PopupThes";
import TabTopupSieuToc from "./TabTopupSieuToc";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TabTopupGame extends BaseTabShop {

}
