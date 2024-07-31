import cmd from "./Slot11.Cmd";

import Configs from "../../Loading/src/Configs";
import PopupSelectLine from "./Slot11.PopupSelectLine";
import PopupBonus from "./Slot11.PopupBonus";
import TrialResults from "./Slot11.TrialResults";
import Slot11Lobby from "./Slot11.Lobby";
import Slot11Item from "./Slot11.Item";
import App from "../../Lobby/LobbyScript/Script/common/App";
import BroadcastReceiver from "../../Lobby/LobbyScript/Script/common/BroadcastReceiver";
import Tween from "../../Lobby/LobbyScript/Script/common/Tween";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import SlotNetworkClient from "../../Lobby/LobbyScript/Script/networks/SlotNetworkClient";
import BundleControl from "../../Loading/src/BundleControl";
import PopupGuide from "./Slot11.PopupGuide";
import PopupJackpotHistory from "./Slot11.PopupJackpotHistory";
import PopupHistory from "./Slot11.PopupHistory";

const enum TYPE_WIN {
  MISS = 0,
  WIN = 1,
  BIGWIN = 2,
  JACKPOT = 3,
  SUPERWIN = 4,
  BONUS = 5,
}

var TW = cc.tween;
const { ccclass, property } = cc._decorator;

@ccclass
export default class Slot11Controller extends cc.Component {
  @property(cc.Node)
  nodeCoin: cc.Node = null;
  @property(cc.Node)
  popupContainer: cc.Node = null;

  @property(Slot11Lobby)
  mSlotLobby: Slot11Lobby = null;

  @property(cc.Prefab)
  preItem: cc.Prefab = null;

  @property(cc.Integer)
  mHeightItem: number = 170;

  @property(cc.Integer)
  mWidthItem: number = 170;
  @property(sp.Skeleton)
  skeSpin: sp.Skeleton = null;

  @property(cc.Node)
  reels: cc.Node = null; // reel
  @property(cc.Node)
  linesWin: cc.Node = null;
  @property(cc.Node)
  iconWildColumns: cc.Node = null; // mang cac item expand wild

  @property(cc.Label)
  lblJackpot: cc.Label = null;
  @property(cc.Label)
  lblBet: cc.Label = null;
  @property(cc.Label)
  lblLine: cc.Label = null;
  @property(cc.Label)
  lblTotalBet: cc.Label = null;
  @property(cc.Label)
  lblCoin: cc.Label = null;
  @property(cc.Label)
  lblWinNow: cc.Label = null;
  @property(cc.Label)
  lblFreeSpinCount: cc.Label = null;

  @property(cc.Toggle)
  toggleAuto: cc.Toggle = null;

  @property(cc.Toggle)
  toggleSound: cc.Toggle = null;

  @property(cc.Toggle)
  togglgeMusic: cc.Toggle = null;

  @property(cc.Toggle)
  toggleBoost: cc.Toggle = null;
  // @property(cc.Toggle)
  // toggleTrial: cc.Toggle = null;

  @property(cc.Button)
  btnSpin: cc.Button = null;
  @property(cc.Button)
  btnBack: cc.Button = null;
  @property(cc.Button)
  btnPlayTry: cc.Button = null;
  @property(cc.Button)
  btnPlayReal: cc.Button = null;
  // @property(cc.Button)
  // btnBetUp: cc.Button = null;
  // @property(cc.Button)
  // btnBetDown: cc.Button = null;
  @property(cc.Button)
  btnLine: cc.Button = null;

  @property(cc.Node)
  toast: cc.Node = null;

  @property(cc.Node)
  panelSetting: cc.Node = null;

  @property(cc.Node)
  effectWinCash: cc.Node = null;
  @property(cc.Node)
  effectBigWin: cc.Node = null;
  @property(cc.Node)
  effectJackpot: cc.Node = null;
  @property(cc.ParticleSystem)
  particleJackpt: cc.ParticleSystem = null;
  @property(cc.ParticleSystem)
  particleBonus: cc.ParticleSystem = null;
  @property(cc.ParticleSystem)
  particleBigWin: cc.ParticleSystem = null;
  @property(cc.ParticleSystem)
  particleEffFree: cc.ParticleSystem = null;
  @property(cc.Node)
  effectBonus: cc.Node = null;
  @property(cc.Node)
  effectFreeSpin: cc.Node = null;

  @property(PopupSelectLine)
  popupSelectLine: PopupSelectLine = null;
  @property(PopupBonus)
  popupBonus: PopupBonus = null;

  @property({ type: cc.AudioClip })
  soundSpinMis: cc.AudioClip = null;
  @property({ type: cc.AudioClip })
  soundSpinWin: cc.AudioClip = null;
  @property({ type: cc.AudioClip })
  soundBigWin: cc.AudioClip = null;
  @property({ type: cc.AudioClip })
  soundJackpot: cc.AudioClip = null;
  @property({ type: cc.AudioClip })
  soundBonus: cc.AudioClip = null;
  @property({ type: cc.AudioClip })
  soundClick: cc.AudioClip = null;
  @property({ type: cc.AudioClip })
  soundSpin: cc.AudioClip = null;
  @property({ type: cc.AudioClip })
  soundReelStop: cc.AudioClip = null;

  //end music setting

  @property({ type: cc.AudioClip })
  soundBg: cc.AudioClip = null;
  private currentNumberFreeSpin = 0;
  private daiLyFreeSpin = 0;
  private rollStartItemCount = 15;
  private rollAddItemCount = 10;
  private spinDuration = 1.2;
  private addSpinDuration = 0.3;
  //private itemHeight = 0;
  public betIdx = -1;
  private listBet = [100, 1000, 10000];
  private listBetLabel = ["100", "1000", "10000"];
  private arrLineSelect = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25,
  ];
  private isSpined = true;
  private readonly wildItemId = 2;
  private readonly mapLine = [
    [5, 6, 7, 8, 9], //1
    [0, 1, 2, 3, 4], //2
    [10, 11, 12, 13, 14], //3
    [10, 6, 2, 8, 14], //4
    [0, 6, 12, 8, 4], //5
    [5, 1, 2, 3, 9], //6
    [5, 11, 12, 13, 9], //7
    [0, 1, 7, 13, 14], //8
    [10, 11, 7, 3, 4], //9
    [5, 11, 7, 3, 9], //10
    [5, 1, 7, 13, 9], //11
    [0, 6, 7, 8, 4], //12
    [10, 6, 7, 8, 14], //13
    [0, 6, 2, 8, 4], //14
    [10, 6, 12, 8, 14], //15
    [5, 6, 2, 8, 9], //16
    [5, 6, 12, 8, 9], //17
    [0, 1, 12, 3, 4], //18
    [10, 11, 2, 13, 14], //19
    [0, 11, 12, 13, 4], //20
    [10, 1, 2, 3, 14], //21
    [5, 1, 12, 3, 9], //22
    [5, 11, 2, 13, 9], //23
    [0, 11, 2, 13, 4], //24
    [10, 1, 12, 3, 14], //25
  ];
  private lastSpinRes: cmd.ReceivePlay = null;
  private columnsWild = [];
  private popupGuide: PopupGuide = null;
  private popupHonor: PopupJackpotHistory = null;
  private popupHistory: PopupHistory = null;
  private musicSlotState = null;
  public soundSlotState = null;
  private remoteMusicBackground = null;
  private mIsTrial = false;
  private effectSound_Spin = 0;
  mutipleJpNode = null;

  start() {
    this.soundInit();
    this.currentNumberFreeSpin = 0;
    //this.itemHeight = this.itemTemplate.height;
    for (let i = 0; i < this.reels.childrenCount; i++) {
      let reel = this.reels.children[i];
      let count = this.rollStartItemCount + i * this.rollAddItemCount;
      for (let j = 0; j < count; j++) {
        //let item = cc.instantiate(this.itemTemplate);
        let itemNode = cc.instantiate(this.preItem);
        itemNode.height = this.mHeightItem;
        itemNode.width = this.mWidthItem;
        let item: Slot11Item = itemNode.getComponent(Slot11Item);
        itemNode.parent = reel;
        let id = Utils.randomRangeInt(0, 10);
        item.init(id, j);
      }
    }
    // this.itemTemplate.removeFromParent();
    // this.itemTemplate = null;

    //dang ky khi mat ket noi tu dong back
    SlotNetworkClient.getInstance().addOnClose(() => {
      //this.actBack();
      this.mSlotLobby.onBtnBack();
    }, this);

    //listenner client - server
    SlotNetworkClient.getInstance().addListener((data) => {
      let inpacket = new InPacket(data);
      switch (inpacket.getCmdId()) {
        case cmd.Code.FREE_DAI_LY:
          {
            if (!this.mIsTrial) {
              let res = new cmd.ReceiveFreeDaiLy(data);
              cc.log("init info Slot11:" + JSON.stringify(res));
              this.daiLyFreeSpin = res.freeSpin;
            }
          }
          break;
        case cmd.Code.DATE_X2:
          {
            let res = new cmd.ReceiveDateX2(data);
            cc.log("init info Slot11:" + JSON.stringify(res));
            this.currentNumberFreeSpin = res.freeSpin + this.daiLyFreeSpin;
            if (this.currentNumberFreeSpin > 0) {
              this.lblFreeSpinCount.node.parent.active = true;
              this.lblFreeSpinCount.string = this.currentNumberFreeSpin + "";
            } else {
              this.lblFreeSpinCount.node.parent.active = false;
            }
          }
          break;
        case cmd.Code.UPDATE_POT:
          let res = new cmd.ReceiveUpdatePot(data);
          Tween.numberTo(this.lblJackpot, res.jackpot, 0.3);

          break;
        case cmd.Code.UPDATE_JACKPOT_SLOTS:
          this.mSlotLobby.onUpdateJackpot(data);
          break;
        case cmd.Code.PLAY:
          {
            let res = new cmd.ReceivePlay(data);
            cc.log(res);
            this.onSpinResult(res);
          }
          break;
        default:
          break;
      }
    }, this);
    SlotNetworkClient.getInstance().sendCheck(new cmd.ReqSubcribeHallSlot());

    //cc.log("Slot3Controller started");

    //SlotNetworkClient.getInstance().send(new cmd.SendSubcribe(this.betIdx));
    this.stopShowLinesWin();

    this.toast.active = false;
    this.effectWinCash.active = false;
    this.effectJackpot.active = false;
    this.effectBigWin.active = false;
    this.panelSetting.active = false;

    this.lblTotalBet.string = (
      this.arrLineSelect.length * this.listBet[this.betIdx]
    ).toString();

    BroadcastReceiver.register(
      BroadcastReceiver.USER_UPDATE_COIN,
      () => {
        Tween.numberTo(this.lblCoin, Configs.Login.Coin, 0.3);
      },
      this
    );
    BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);

    App.instance.showErrLoading("Đang kết nối tới server...");
    SlotNetworkClient.getInstance().checkConnect(() => {
      App.instance.showLoading(false);
    });
    //cc.log("Slot3Controller started");

    this.mSlotLobby.init(this);
    this.mSlotLobby.node.active = true;
    this.btnPlayReal.node.active = false;
    this.btnPlayTry.node.active = false;
    //this.initMutipleJPNode();
  }
  private initMutipleJPNode() {
    if (!this.mutipleJpNode) {
      cc.assetManager.getBundle("Lobby").load(
        "prefabs/MutipleJackpotPr",
        cc.Prefab,
        function (finish, total, item) {},
        (err1, prefab: cc.Prefab) => {
          if (err1 != null) {
            cc.log("errr load game TIENLEN:", err1);
          } else {
            this.mutipleJpNode = cc
              .instantiate(prefab)
              .getComponent("MutipleJackpot");
            this.mutipleJpNode.node.parent = cc.director
              .getScene()
              .getChildByName("Canvas");
            this.mutipleJpNode.setInfo("BITCOIN");
          }
        }
      );
    }
  }
  private showCoins(prize) {
    var number = prize / 20000;
    if (number <= 10) number = 10;
    else if (number >= 30) number = 30;
    App.instance.showCoins(number, this.lblWinNow.node, this.nodeCoin);
  }

  public onJoinRoom() {
    this.lblBet.string = this.listBetLabel[this.betIdx];
    let totalbet = this.arrLineSelect.length * this.listBet[this.betIdx];
    Tween.numberTo(this.lblTotalBet, totalbet, 0.3);

    this.skeSpin.animation = "xoay";
    this.skeSpin.loop = true;
  }

  private showToast(msg: string) {
    this.toast.getComponentInChildren(cc.Label).string = msg;
    this.toast.stopAllActions();
    this.toast.active = true;
    this.toast.runAction(
      cc.sequence(
        cc.delayTime(2),
        cc.callFunc(() => {
          this.toast.active = false;
        })
      )
    );
  }

  private moneyToK(money: number): string {
    // if (money < 10000) {
    //     return money.toString();
    // }
    // money = parseInt((money / 1000).toString());
    return money.toString();
  }

  private setEnabledAllButtons(enabled: boolean) {
    this.btnSpin.interactable = enabled;
    this.btnBack.interactable = enabled;
    // this.btnBetUp.interactable = enabled;
    // this.btnBetDown.interactable = enabled;
    this.btnLine.interactable = enabled;
    this.btnPlayTry.interactable = false;
    this.btnPlayReal.interactable = false;
    //this.toggleTrial.interactable = enabled;
    this.btnSpin.getComponentInChildren(cc.Sprite).node.active = !enabled;
  }

  private stopAllEffects() {
    this.effectJackpot.stopAllActions();
    this.effectJackpot.active = false;
    this.effectBigWin.stopAllActions();
    this.effectBigWin.active = false;
    this.effectFreeSpin.stopAllActions();
    this.effectFreeSpin.active = false;
  }

  private stopShowLinesWin() {
    this.linesWin.stopAllActions();
    for (var i = 0; i < this.linesWin.childrenCount; i++) {
      this.linesWin.children[i].active = false;
    }
    for (var i = 0; i < this.iconWildColumns.childrenCount; i++) {
      this.iconWildColumns.children[i].active = false;
    }
    this.stopAllItemEffect();
  }

  private stopAllItemEffect() {
    for (let i = 0; i < this.reels.childrenCount; i++) {
      for (let i = 0; i < this.reels.childrenCount; i++) {
        let children = this.reels.children[i].children; // ???
        for (let j = 0; j < children.length; j++) {
          cc.Tween.stopAllByTarget(children[j]);
          children[j].scale = 0.67;
        }
      }
    }
  }

  private spin() {
    if (!this.isSpined) return;

    let isTrail = this.mIsTrial;
    if (!isTrail) {
      if (this.currentNumberFreeSpin <= 0) {
        if (
          Configs.Login.Coin <
          this.listBet[this.betIdx] * this.arrLineSelect.length
        ) {
          App.instance.alertDialog.showMsg(
            App.instance.getTextLang("txt_not_enough")
          );
          return;
        }
        let curMoney =
          Configs.Login.Coin -
          this.arrLineSelect.length * this.listBet[this.betIdx];
        Tween.numberTo(this.lblCoin, curMoney, 0.3);
      } else {
        this.currentNumberFreeSpin--;
        this.lblFreeSpinCount.string = this.currentNumberFreeSpin + "";
        if (this.currentNumberFreeSpin <= 0) {
          this.currentNumberFreeSpin = 0;
          this.lblFreeSpinCount.node.parent.active = false;
        }
      }

      this.isSpined = false;
      this.changeAllItemToDark(false);
      this.stopAllEffects();
      this.stopShowLinesWin();
      this.setEnabledAllButtons(false);
      this.btnSpin.node.getComponentInChildren(cc.Sprite).node.active = true;
      cc.log("PLAY:", new cmd.SendPlay(this.arrLineSelect.toString()));
      SlotNetworkClient.getInstance().send(
        new cmd.SendPlay(this.arrLineSelect.toString())
      );
    } else {
      this.isSpined = false;
      this.stopAllEffects();
      this.stopShowLinesWin();
      this.setEnabledAllButtons(false);
      this.btnSpin.node.getComponentInChildren(cc.Sprite).node.active = true;
      var rIdx = Utils.randomRangeInt(0, TrialResults.results.length);
      this.onSpinResult(TrialResults.results[rIdx]);
    }
  }

  private stopSpin() {
    for (var i = 0; i < this.reels.childrenCount; i++) {
      var roll = this.reels.children[i];
      roll.stopAllActions();
      roll.setPosition(cc.v2(roll.getPosition().x, 0));
    }
  }

  private showLineWins() {
    this.isSpined = true;
    Tween.numberTo(this.lblWinNow, this.lastSpinRes.prize, 0.3);
    let isTrail = this.mIsTrial;
    if (!isTrail) BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
    if (!this.toggleAuto.isChecked && !this.toggleBoost.isChecked)
      this.setEnabledAllButtons(true);

    this.linesWin.stopAllActions();
    let linesWin = this.lastSpinRes.linesWin.split(",");
    linesWin = Utils.removeDups(linesWin);
    for (let i = 0; i < linesWin.length; i++) {
      if (linesWin[i] == "0") {
        linesWin.splice(i, 1);
        i--;
      }
    }
    let matrix = this.lastSpinRes.matrix.split(",");
    let linesWinChildren = this.linesWin.children;
    let rolls = this.reels.children;
    let actions = [];
    for (let i = 0; i < linesWinChildren.length; i++) {
      linesWinChildren[i].active = linesWin.indexOf("" + (i + 1)) >= 0;
    }
    if (this.lastSpinRes.prize > 0) {
      this.changeAllItemToDark(true);
      this.linesWin.setSiblingIndex(1);
      this.reels.parent.setSiblingIndex(0);
      this.showWinCash(this.lastSpinRes.prize);
      actions.push(cc.delayTime(1.5));
      actions.push(
        cc.callFunc(() => {
          for (let i = 0; i < linesWinChildren.length; i++) {
            linesWinChildren[i].active = false;
          }
        })
      );
      actions.push(cc.delayTime(0.3));
      if (!this.toggleBoost.isChecked) {
        for (let i = 0; i < linesWin.length; i++) {
          let lineIdx = parseInt(linesWin[i]) - 1;
          let line = linesWinChildren[lineIdx];
          actions.push(
            cc.callFunc(() => {
              // cc.log("================: " + lineIdx);
              this.linesWin.setSiblingIndex(0);
              this.reels.parent.setSiblingIndex(1);
              line.active = true;
              let mLine = this.mapLine[lineIdx];
              let countItemWin = 0;
              let fisrtItemId = parseInt(matrix[mLine[0]]);
              for (let j = 0; j < mLine.length; j++) {
                let itemId = parseInt(matrix[mLine[j]]);
                if (
                  fisrtItemId == itemId ||
                  (itemId == this.wildItemId && fisrtItemId > 3) ||
                  this.columnsWild.indexOf(j) >= 0
                ) {
                  // cc.log("==" + itemId + " j:" + j);
                  countItemWin++;
                } else {
                  break;
                }
              }
              for (let j = 0; j < countItemWin; j++) {
                let itemRow = parseInt((mLine[j] / 5).toString());
                let item =
                  rolls[j].children[2 - itemRow].getComponent(Slot11Item);
                item.node.stopAllActions();
                item.checkShowSpriteOrSpine();
              }
              // cc.log("lineIdx: " + lineIdx + "fisrtItemId: " + fisrtItemId + " countItemWin: " + countItemWin);
            })
          );
          actions.push(cc.delayTime(1));
          actions.push(
            cc.callFunc(() => {
              line.active = false;
              this.stopAllItemEffect();
            })
          );
          actions.push(cc.delayTime(0.1));
        }
      }
    }
    if (actions.length == 0) {
      actions.push(
        cc.callFunc(() => {
          //fixed call cc.sequence.apply
        })
      );
    }
    actions.push(
      cc.callFunc(() => {
        this.changeAllItemToDark(false);
        if (this.toggleBoost.isChecked || this.toggleAuto.isChecked) {
          this.spin();
        }
      })
    );
    this.linesWin.runAction(cc.sequence.apply(null, actions));
  }

  private showWinCash(cash: number) {
    this.effectWinCash.stopAllActions();
    this.effectWinCash.active = true;
    let label = this.effectWinCash.getComponentInChildren(cc.Label);
    label.string = "0";
    this.effectWinCash.opacity = 0;
    this.showCoins(cash);
    this.effectWinCash.runAction(
      cc.sequence(
        cc.fadeIn(0.3),
        cc.callFunc(() => {
          Tween.numberTo(label, cash, 0.5);
        }),
        cc.delayTime(1.5),
        cc.fadeOut(0.3),
        cc.callFunc(() => {
          this.effectWinCash.active = false;
        })
      )
    );
  }

  private showEffectBigWin(cash: number, cb: () => void) {
    this.effectBigWin.stopAllActions();
    this.effectBigWin.active = true;
    // this.effectBigWin.getComponentInChildren("MultiLanguage").updateSkeleton();
    let label = this.effectBigWin.getComponentInChildren(cc.Label);
    let partical = this.effectBigWin.getComponentInChildren(cc.ParticleSystem);
    partical.node.active = true;
    label.node.active = false;

    this.effectBigWin.runAction(
      cc.sequence(
        cc.delayTime(1),
        cc.callFunc(() => {
          label.string = "";
          label.node.active = true;

          Tween.numberTo(label, cash, 1);
        }),
        cc.delayTime(3),
        cc.callFunc(() => {
          partical.resetSystem();
          this.effectBigWin.active = false;
          if (cb != null) cb();
        })
      )
    );
  }

  private showEffectFreeSpin(cb: () => void) {
    this.effectFreeSpin.stopAllActions();
    this.effectFreeSpin.active = true;
    this.effectFreeSpin
      .getComponentInChildren(sp.Skeleton)
      .setAnimation(0, "freespin", true);
    this.particleEffFree.node.active = true;
    this.effectFreeSpin.runAction(
      cc.sequence(
        cc.delayTime(1),
        cc.delayTime(3),
        cc.callFunc(() => {
          this.particleEffFree.resetSystem();
          this.particleEffFree.node.active = false;
          this.effectFreeSpin.active = false;
          if (cb != null) cb();
        })
      )
    );
  }

  private showEffectJackpot(cash: number, cb: () => void = null) {
    var animName = ["animation7"];
    var index = parseInt(Math.random() + "");
    this.effectJackpot.stopAllActions();
    this.effectJackpot.active = true;
    this.effectJackpot
      .getComponentInChildren(sp.Skeleton)
      .setAnimation(0, animName[index], false);
    let label = this.effectJackpot.getComponentInChildren(cc.Label);
    label.node.active = false;

    this.effectJackpot.runAction(
      cc.sequence(
        cc.delayTime(0.4),
        cc.callFunc(() => {
          this.particleJackpt.resetSystem();
        }),
        cc.callFunc(() => {
          label.string = "";
          label.node.active = true;
          Tween.numberTo(label, cash, 1);
        }),
        cc.delayTime(5),
        cc.callFunc(() => {
          this.effectJackpot.active = false;
          if (cb != null) cb();
        })
      )
    );
  }

  private showEffectBonus(cb: () => void) {
    this.effectBonus.stopAllActions();
    this.effectBonus.active = true;
    this.effectBonus
      .getComponentInChildren(sp.Skeleton)
      .setAnimation(0, "bounus", true);
    this.particleBonus.node.active = true;

    this.effectBonus.runAction(
      cc.sequence(
        cc.delayTime(3),
        cc.callFunc(() => {
          this.particleBonus.resetSystem();
          this.particleBonus.node.active = false;
          this.effectBonus.active = false;
          if (cb != null) cb();
        })
      )
    );
  }

  private onSpinResult(res: cmd.ReceivePlay | any) {
    this.stopSpin();
    cc.log("onSpinResult:" + JSON.stringify(res));
    // res = JSON.parse('{"_pos":114,"_data":{"0":1,"1":15,"2":161,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0,"9":0,"10":9,"11":120,"12":2,"13":0,"14":29,"15":51,"16":44,"17":53,"18":44,"19":50,"20":44,"21":54,"22":44,"23":49,"24":44,"25":54,"26":44,"27":50,"28":44,"29":50,"30":44,"31":53,"32":44,"33":49,"34":44,"35":53,"36":44,"37":54,"38":44,"39":55,"40":44,"41":55,"42":44,"43":53,"44":0,"45":44,"46":49,"47":44,"48":51,"49":44,"50":52,"51":44,"52":54,"53":44,"54":55,"55":44,"56":57,"57":44,"58":49,"59":48,"60":44,"61":49,"62":49,"63":44,"64":49,"65":51,"66":44,"67":49,"68":53,"69":44,"70":49,"71":54,"72":44,"73":49,"74":55,"75":44,"76":49,"77":57,"78":44,"79":50,"80":49,"81":44,"82":50,"83":50,"84":44,"85":50,"86":51,"87":44,"88":50,"89":53,"90":0,"91":0,"92":0,"93":0,"94":0,"95":0,"96":0,"97":103,"98":194,"99":128,"100":0,"101":0,"102":0,"103":0,"104":37,"105":174,"106":98,"107":186,"108":0,"109":0,"110":0,"111":0,"112":0,"113":0},"_length":114,"_controllerId":1,"_cmdId":4001,"_error":0,"ref":2424,"result":2,"matrix":"3,5,2,6,1,6,2,2,5,1,5,6,7,7,5","linesWin":"1,3,4,6,7,9,10,11,13,15,16,17,19,21,22,23,25","haiSao":"","prize":6800000,"currentMoney":632185530,"freeSpin":0,"isFree":false,"itemsWild":"","ratio":0,"currentNumberFreeSpin":0}');
    var successResult = [0, 1, 2, 3, 4, 5, 6];
    //res.result == 5 //bonus
    //res.result == 0 //khong an
    //res.result == 1 //thang thuong
    //res.result == 2 //thang lon
    //res.result == 3 //no hu
    //res.result == 6 //thang cuc lon
    // cc.log("saosao:" + (successResult.indexOf(res.result) === -1));
    if (successResult.indexOf(res.result) === -1) {
      this.isSpined = true;

      this.toggleAuto.isChecked = false;
      this.toggleAuto.interactable = true;
      this.toggleBoost.isChecked = false;
      this.toggleBoost.interactable = true;

      this.setEnabledAllButtons(true);
      switch (res.result) {
        case 102:
          this.showToast(App.instance.getTextLang("txt_slot_error"));
          break;
        default:
          this.showToast(App.instance.getTextLang("txt_unknown_error1"));
          break;
      }
      return;
    }
    this.changeAllItemToDark(false);
    this.currentNumberFreeSpin = res.currentNumberFreeSpin;
    this.lastSpinRes = res;
    this.columnsWild.length = 0;

    let isTrail = this.mIsTrial;
    if (!isTrail && !this.lastSpinRes.isFree) {
      Configs.Login.Coin = res.currentMoney;
    }

    let matrix = res.matrix.split(",");
    let timeScale = this.toggleBoost.isChecked ? 0.5 : 1;
    if (this.soundSlotState == 1) {
      this.effectSound_Spin = cc.audioEngine.play(this.soundSpin, false, 1);
    }
    for (let i = 0; i < this.reels.childrenCount; i++) {
      let roll = this.reels.children[i];
      let step1Pos = this.mHeightItem * 0.3;
      let step2Pos =
        -this.mHeightItem * roll.childrenCount +
        this.mHeightItem * 3 -
        this.mHeightItem * 0.3;
      let step3Pos =
        -this.mHeightItem * roll.childrenCount + this.mHeightItem * 3;
      roll.runAction(
        cc.sequence(
          cc.delayTime(0.2 * i * timeScale),
          cc
            .moveTo(0.2 * timeScale, cc.v2(roll.position.x, step1Pos))
            .easing(cc.easeQuadraticActionOut()),
          cc
            .moveTo(
              (this.spinDuration + this.addSpinDuration * i) * timeScale,
              cc.v2(roll.position.x, step2Pos)
            )
            .easing(cc.easeQuadraticActionInOut()),
          cc.callFunc(() => {
            if (this.soundSlotState == 1) {
              cc.audioEngine.play(this.soundReelStop, false, 1);
              if (i == 4) {
                cc.audioEngine.stop(this.effectSound_Spin);
              }
            }
          }),
          cc
            .moveTo(0.2 * timeScale, cc.v2(roll.position.x, step3Pos))
            .easing(cc.easeQuadraticActionIn()),
          cc.callFunc(() => {
            roll.setPosition(cc.v2(roll.position.x, 0));
            if (i == 4) {
              //find columns wild
              for (let j = 0; j < matrix.length; j++) {
                if (parseInt(matrix[j]) == this.wildItemId) {
                  let c = j % 5;
                  if (this.columnsWild.indexOf(c) == -1)
                    this.columnsWild.push(c);
                }
              }
              //replace wild items in columns
              for (let j = 0; j < this.columnsWild.length; j++) {
                let c = this.columnsWild[j];
                this.iconWildColumns.children[c].active = true;
                let children = this.reels.children[c].children;
                children[2]
                  .getComponent(Slot11Item)
                  .changeSpineIcon(this.wildItemId);
                children[1]
                  .getComponent(Slot11Item)
                  .changeSpineIcon(this.wildItemId);
                children[0]
                  .getComponent(Slot11Item)
                  .changeSpineIcon(this.wildItemId);
              }
              if (this.columnsWild.length > 0) {
                roll.runAction(
                  cc.sequence(
                    cc.delayTime(2.6),
                    cc.callFunc(() => {
                      for (
                        let i = 0;
                        i < this.iconWildColumns.childrenCount;
                        i++
                      ) {
                        this.iconWildColumns.children[i].active = false;
                      }
                    }),
                    cc.delayTime(0.1),
                    cc.callFunc(() => {
                      this.spined();
                    })
                  )
                );
              } else {
                this.spined();
              }
            }
          })
        )
      );

      //rool = reel
      TW(roll)
        .delay(0.2 * i * timeScale + 0.4 * timeScale)
        .call(() => {
          for (let m = 0; m < roll.childrenCount; m++) {
            let item = roll.children[m].getComponent(Slot11Item);
            item.changeSpriteBlurByItemId(item.itemId);
          }
        })
        .start();
      TW(roll)
        .delay((0.47 + 0.2 * i) * timeScale)
        .call(() => {
          let listItemNode = roll.children;
          listItemNode[2]
            .getComponent(Slot11Item)
            .changeSpineIcon(parseInt(matrix[i]));
          listItemNode[1]
            .getComponent(Slot11Item)
            .changeSpineIcon(parseInt(matrix[5 + i]));
          listItemNode[0]
            .getComponent(Slot11Item)
            .changeSpineIcon(parseInt(matrix[10 + i]));
          listItemNode[listItemNode.length - 1]
            .getComponent(Slot11Item)
            .changeSpineIcon(parseInt(matrix[i]));
          listItemNode[listItemNode.length - 2]
            .getComponent(Slot11Item)
            .changeSpineIcon(parseInt(matrix[5 + i]));
          listItemNode[listItemNode.length - 3]
            .getComponent(Slot11Item)
            .changeSpineIcon(parseInt(matrix[10 + i]));
          for (let m = 0; m < roll.childrenCount; m++) {
            let item = roll.children[m].getComponent(Slot11Item);
            item.spriteIcon.sizeMode = cc.Sprite.SizeMode.TRIMMED;
          }
        })
        .start();
    }
  }

  private spined() {
    this.skeSpin.animation = "xoay";
    this.currentNumberFreeSpin = this.lastSpinRes.currentNumberFreeSpin;
    if (this.lastSpinRes.currentNumberFreeSpin > 0) {
      this.lblFreeSpinCount.node.parent.active = true;
      this.lblFreeSpinCount.string = this.currentNumberFreeSpin + "";
    } else {
      this.lblFreeSpinCount.node.parent.active = false;
    }
    if (this.lastSpinRes.freeSpin == 1) {
      this.showEffectFreeSpin(() => {
        this.showLineWins();
      });
    } else {
      var successResult = [0, 1, 3, 5, 6];
      switch (this.lastSpinRes.result) {
        case TYPE_WIN.MISS: //k an
          if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundSpinMis, false, 1);
          }
          this.showLineWins();
          break;
        case TYPE_WIN.WIN: // thang thuong
          if (this.soundSlotState == 1) {
            if (this.lastSpinRes.prize > 0)
              cc.audioEngine.play(this.soundSpinWin, false, 1);
            else cc.audioEngine.play(this.soundSpinMis, false, 1);
          }
          this.showLineWins();
          break;
        case TYPE_WIN.BIGWIN: // thang lon
          if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundBigWin, false, 1);
          }
          this.showEffectBigWin(this.lastSpinRes.prize, () => {
            this.showLineWins();
          });
          break;
        case TYPE_WIN.JACKPOT: //jackpot
          if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundJackpot, false, 1);
          }
          this.showEffectJackpot(this.lastSpinRes.prize, () => {
            this.showLineWins();
          });
          break;
        case TYPE_WIN.SUPERWIN: //jackpot
          if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundJackpot, false, 1);
          }
          this.showEffectJackpot(this.lastSpinRes.prize, () => {
            this.showLineWins();
          });
          break;
        case 6: //thang sieu lon
          if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundBigWin, false, 1);
          }
          this.showEffectBigWin(this.lastSpinRes.prize, () => {
            this.showLineWins();
          });
          break;
        case TYPE_WIN.BONUS: //bonus
          if (this.soundSlotState == 1) {
            cc.audioEngine.play(this.soundBonus, false, 1);
          }
          this.showEffectBonus(() => {
            let linesWin = this.lastSpinRes.linesWin.split(",");
            linesWin = Utils.removeDups(linesWin);
            for (let i = 0; i < linesWin.length; i++) {
              if (linesWin[i] == "0") {
                linesWin.splice(i, 1);
                i--;
              }
            }

            let matrix = this.lastSpinRes.matrix.split(",");
            let countItem = 0;
            for (let i = 0; i < linesWin.length; i++) {
              let countItemBonus = 0;
              let lineIdx = parseInt(linesWin[i]) - 1;
              let mLine = this.mapLine[lineIdx];
              for (let j = 0; j < mLine.length; j++) {
                let itemId = matrix[mLine[j]];
                if (itemId == "1") {
                  countItemBonus++;
                } else {
                  if (countItemBonus > countItem) {
                    countItem = countItemBonus;
                  }
                  break;
                }
              }
            }
            this.actShowBonus(
              this.mIsTrial ? 100 : this.listBet[this.betIdx],
              this.lastSpinRes.haiSao,
              () => {
                this.showLineWins();
              },
              countItem
            );
          });
          break;
      }
    }
  }
  onBtnSoundTouchBonus() {}

  onBtnSoundSumary() {}
  actBack() {
    if (this.soundSlotState == 1) {
      cc.audioEngine.play(this.soundClick, false, 1);
    }
    SlotNetworkClient.getInstance().send(new cmd.SendUnSubcribe(this.betIdx));
    // cc.audioEngine.stopAll();
    // App.instance.loadScene("Lobby");

    this.mSlotLobby.node.active = true;
  }
  actChangeRoom() {
    if (!this.isSpined) return;
    this.actBack();
  }
  actHidden() {
    this.showToast(App.instance.getTextLang("txt_function_in_development"));
  }

  actBetUp() {
    if (this.soundSlotState == 1) {
      cc.audioEngine.play(this.soundClick, false, 1);
    }

    let isTrail = this.mIsTrial;
    if (isTrail) {
      this.showToast(App.instance.getTextLang("txt_slot_error"));
      return;
    }
    if (this.betIdx < this.listBet.length - 1) {
      this.daiLyFreeSpin = 0;
      this.lblFreeSpinCount.node.parent.active = false;
      SlotNetworkClient.getInstance().send(
        new cmd.SendChangeRoom(this.betIdx, ++this.betIdx)
      );
      this.lblBet.string = this.listBetLabel[this.betIdx];
      Tween.numberTo(
        this.lblTotalBet,
        this.arrLineSelect.length * this.listBet[this.betIdx],
        0.3,
        (n) => {
          return this.moneyToK(n);
        }
      );
    }
  }

  actBetDown() {
    if (this.soundSlotState == 1) {
      cc.audioEngine.play(this.soundClick, false, 1);
    }

    let isTrail = this.mIsTrial;
    if (isTrail) {
      this.showToast(App.instance.getTextLang("txt_slot_error"));
      return;
    }
    if (this.betIdx > 0) {
      this.daiLyFreeSpin = 0;
      this.lblFreeSpinCount.node.parent.active = false;
      SlotNetworkClient.getInstance().send(
        new cmd.SendChangeRoom(this.betIdx, --this.betIdx)
      );
      this.lblBet.string = this.listBetLabel[this.betIdx];
      Tween.numberTo(
        this.lblTotalBet,
        this.arrLineSelect.length * this.listBet[this.betIdx],
        0.3,
        (n) => {
          return this.moneyToK(n);
        }
      );
    }
  }

  actLine() {
    if (this.soundSlotState == 1) {
      cc.audioEngine.play(this.soundClick, false, 1);
    }

    let isTrail = this.mIsTrial;
    if (isTrail) {
      this.showToast(App.instance.getTextLang("txt_slot_error"));
      return;
    }
    this.popupSelectLine.show();
  }

  actSetting() {
    if (this.soundSlotState == 1) {
      cc.audioEngine.play(this.soundClick, false, 1);
    }
    this.panelSetting.active = !this.panelSetting.active;
  }

  toggleTrialOnCheck() {
    if (this.soundSlotState == 1) {
      cc.audioEngine.play(this.soundClick, false, 1);
    }

    this.mIsTrial = !this.mIsTrial;
    let isTrail = this.mIsTrial;
    if (isTrail) {
      this.btnPlayReal.node.active = true;
      this.btnPlayTry.node.active = false;
      this.lblLine.string = "25";
      this.lblBet.string = "100";
      Tween.numberTo(this.lblTotalBet, 2500, 0.3, (n) => this.moneyToK(n));
    } else {
      this.btnPlayReal.node.active = false;
      this.btnPlayTry.node.active = true;
      this.lblLine.string = this.arrLineSelect.length.toString();
      this.lblBet.string = this.listBetLabel[this.betIdx];
      Tween.numberTo(
        this.lblTotalBet,
        this.arrLineSelect.length * this.listBet[this.betIdx],
        0.3,
        (n) => this.moneyToK(n)
      );
    }
    cc.log("isTrial==" + this.mIsTrial);
  }

  toggleAutoOnCheck() {
    if (this.soundSlotState == 1) {
      cc.audioEngine.play(this.soundClick, false, 1);
    }

    let isTrail = this.mIsTrial;
    if (this.toggleAuto.isChecked && isTrail) {
      this.toggleAuto.isChecked = false;
      this.showToast(App.instance.getTextLang("txt_slot_error"));
      return;
    }
    if (this.toggleAuto.isChecked) {
      this.spin();
      this.toggleBoost.interactable = false;
    } else {
      this.toggleBoost.interactable = true;
      if (this.isSpined) {
        this.setEnabledAllButtons(true);
      }
    }
  }

  toggleBoostOnCheck() {
    if (this.soundSlotState == 1) {
      cc.audioEngine.play(this.soundClick, false, 1);
    }

    let isTrail = this.mIsTrial;
    if (this.toggleBoost.isChecked && isTrail) {
      this.toggleBoost.isChecked = false;
      this.showToast(App.instance.getTextLang("txt_slot_error"));
      return;
    }
    if (this.toggleBoost.isChecked) {
      this.spin();
      this.toggleAuto.interactable = false;
    } else {
      this.toggleAuto.interactable = true;
      if (this.isSpined) {
        this.setEnabledAllButtons(true);
      }
    }
  }

  //music setting

  private soundInit() {
    // musicSave :   0 == OFF , 1 == ON
    var musicSave = cc.sys.localStorage.getItem("music_Slot_7");
    if (musicSave != null) {
      this.musicSlotState = parseInt(musicSave);
    } else {
      this.musicSlotState = 1;
      cc.sys.localStorage.setItem("music_Slot_7", "1");
    }

    // soundSave :   0 == OFF , 1 == ON
    var soundSave = cc.sys.localStorage.getItem("sound_Slot_7");
    if (soundSave != null) {
      this.soundSlotState = parseInt(soundSave);
    } else {
      this.soundSlotState = 1;
      cc.sys.localStorage.setItem("sound_Slot_7", "1");
    }

    if (this.musicSlotState == 0) {
      //this.musicOff.active = true;
    } else {
      //this.musicOff.active = false;
    }

    if (this.soundSlotState == 0) {
      //this.soundOff.active = true;
    } else {
      //this.soundOff.active = false;
    }

    if (this.musicSlotState == 1) {
      this.remoteMusicBackground = cc.audioEngine.playMusic(this.soundBg, true);
    }
  }
  settingMusic() {
    //this.musicOff.active = !this.musicOff.active;
    if (!this.togglgeMusic.isChecked) {
      cc.audioEngine.stop(this.remoteMusicBackground);
      this.musicSlotState = 0;
    } else {
      this.remoteMusicBackground = cc.audioEngine.playMusic(this.soundBg, true);
      this.musicSlotState = 1;
    }

    if (this.soundSlotState == 1) {
      cc.audioEngine.play(this.soundClick, false, 1);
    }

    cc.sys.localStorage.setItem("music_Slot_7", "" + this.musicSlotState);
  }
  settingSound() {
    if (this.soundSlotState == 1) {
      cc.audioEngine.play(this.soundClick, false, 1);
    }

    if (!this.toggleSound.isChecked) {
      this.soundSlotState = 0;
    } else {
      this.soundSlotState = 1;
    }

    cc.sys.localStorage.setItem("music_Slot_7", "" + this.soundSlotState);
  }
  changeAllItemToDark(state) {
    for (let i = 0; i < this.reels.childrenCount; i++) {
      let col = this.reels.children[i];
      for (let j = 0; j < col.childrenCount; j++) {
        let item = col.children[j];
        let sprite = item.getComponentInChildren(cc.Sprite);
        let spine = item.getComponentInChildren(sp.Skeleton);
        spine.node.color = state ? cc.Color.GRAY : cc.Color.WHITE;
        sprite.node.color = state ? cc.Color.GRAY : cc.Color.WHITE;
        spine.node.active = false;
        sprite.node.active = true;
        if (!state) {
          cc.Tween.stopAllByTarget(sprite.node);
          sprite.node.scale = 1.0;
          cc.Tween.stopAllByTarget(spine.node);
        }
      }
    }
  }
  actSelectline() {
    if (this.soundSlotState == 1) {
      cc.audioEngine.play(this.soundClick, false, 1);
    }
    if (this.mIsTrial) {
      App.instance.showToast(App.instance.getTextLang("txt_slot_error"));
      return;
    }
    if (this.popupSelectLine == null) {
      BundleControl.loadPrefabGame(
        "Slot11Bikini",
        "prefabs/PopupSelectLine",
        (finish, total) => {
          // App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
        },
        (prefab) => {
          App.instance.showLoading(false);
          this.popupSelectLine = cc
            .instantiate(prefab)
            .getComponent(PopupSelectLine);
          this.popupSelectLine.node.parent = cc.director
            .getScene()
            .getChildByName("Canvas");
          this.popupSelectLine.show();
          this.popupSelectLine.onSelectedChanged = (lines) => {
            this.arrLineSelect = lines;
            this.lblLine.string = this.arrLineSelect.length.toString();
            Tween.numberTo(
              this.lblTotalBet,
              this.arrLineSelect.length * this.listBet[this.betIdx],
              0.3,
              (n) => {
                return this.moneyToK(n);
              }
            );
          };
        }
      );
    } else {
      this.popupSelectLine.show();
    }
  }
  actGuide() {
    if (this.soundSlotState == 1) {
      cc.audioEngine.play(this.soundClick, false, 1);
    }
    if (this.mIsTrial) {
      App.instance.showToast(App.instance.getTextLang("txt_slot_error"));
      return;
    }
    if (this.popupGuide == null) {
      BundleControl.loadPrefabGame(
        "Slot11Bikini",
        "prefabs/PopupGuide",
        (finish, total) => {
          // App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
        },
        (prefab) => {
          App.instance.showLoading(false);
          this.popupGuide = cc.instantiate(prefab).getComponent(PopupGuide);
          this.popupGuide.node.parent = cc.director
            .getScene()
            .getChildByName("Canvas");
          this.popupGuide.show();
        }
      );
    } else {
      this.popupGuide.show();
    }
  }
  actHonor() {
    if (this.soundSlotState == 1) {
      cc.audioEngine.play(this.soundClick, false, 1);
    }
    if (this.mIsTrial) {
      App.instance.showToast(App.instance.getTextLang("txt_slot_error"));
      return;
    }
    if (this.popupHonor == null) {
      BundleControl.loadPrefabGame(
        "Slot11Bikini",
        "prefabs/PopupJackpotHistory",
        (finish, total) => {
          // App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
        },
        (prefab) => {
          App.instance.showLoading(false);
          this.popupHonor = cc
            .instantiate(prefab)
            .getComponent(PopupJackpotHistory);
          this.popupHonor.node.parent = cc.director
            .getScene()
            .getChildByName("Canvas");
          this.popupHonor.show();
        }
      );
    } else {
      this.popupHonor.show();
    }
  }
  actHistory() {
    if (this.soundSlotState == 1) {
      cc.audioEngine.play(this.soundClick, false, 1);
    }
    if (this.mIsTrial) {
      App.instance.showToast(App.instance.getTextLang("txt_slot_error"));
      return;
    }
    if (this.popupHistory == null) {
      BundleControl.loadPrefabGame(
        "Slot11Bikini",
        "prefabs/PopupHistory",
        (finish, total) => {
          // App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
        },
        (prefab) => {
          App.instance.showLoading(false);
          this.popupHistory = cc.instantiate(prefab).getComponent(PopupHistory);
          this.popupHistory.node.parent = cc.director
            .getScene()
            .getChildByName("Canvas");
          this.popupHistory.show();
        }
      );
    } else {
      this.popupHistory.show();
    }
  }
  actShowBonus(isTrial, dataHaiSao, cb, numberIcon) {
    if (this.popupBonus == null) {
      BundleControl.loadPrefabGame(
        "Slot11Bikini",
        "prefabs/PopupBonus",
        (finish, total) => {
          // App.instance.showErrLoading(App.instance.getTextLang('txt_loading1') + parseInt((finish / total) * 100) + "%");
        },
        (prefab) => {
          App.instance.showLoading(false);
          this.popupBonus = cc.instantiate(prefab).getComponent(PopupBonus);
          this.popupBonus.node.parent = cc.director
            .getScene()
            .getChildByName("Canvas");
          this.popupBonus.showBonus(isTrial, dataHaiSao, this, cb, numberIcon);
        }
      );
    } else {
      this.popupBonus.showBonus(isTrial, dataHaiSao, this, cb, numberIcon);
    }
  }

  actTrialOnCheck() {
    this.mIsTrial = true;
    let isTrail = this.mIsTrial;
    if (isTrail) {
      this.btnPlayReal.node.active = false;
      this.btnPlayTry.node.active = false;
      this.lblLine.string = "25";
      this.lblBet.string = "100";
      Tween.numberTo(this.lblTotalBet, 2500, 0.3, (n) => this.moneyToK(n));
    }
    cc.log("isTrial==" + this.mIsTrial);
  }
}
