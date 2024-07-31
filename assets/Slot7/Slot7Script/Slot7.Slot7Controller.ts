import cmd from "./Slot7.Cmd";

import Configs from "../../Loading/src/Configs";
import PopupSelectLine from "./Slot7.PopupSelectLine";
import PopupBonus from "./Slot7.PopupBonus";
import TrialResults from "./Slot7.TrialResults";
import Slot7Lobby from "./Slot7.Lobby";
import Slot7Item from "./Slot7.Item";
import App from "../../Lobby/LobbyScript/Script/common/App";
import BroadcastReceiver from "../../Lobby/LobbyScript/Script/common/BroadcastReceiver";
import Tween from "../../Lobby/LobbyScript/Script/common/Tween";
import Utils from "../../Lobby/LobbyScript/Script/common/Utils";
import InPacket from "../../Lobby/LobbyScript/Script/networks/Network.InPacket";
import SlotNetworkClient from "../../Lobby/LobbyScript/Script/networks/SlotNetworkClient";

const enum TYPE_WIN {
  MISS = 0,
  WIN = 1,
  BIGWIN = 2,
  JACKPOT = 3,
  SUPERWIN = 4,
  BONUS = 5,
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class Slot7Controller extends cc.Component {
  @property(cc.Node)
  nodeCoin: cc.Node = null;

  @property(Slot7Lobby)
  mSlotLobby: Slot7Lobby = null;

  @property(cc.Prefab)
  preItem: cc.Prefab = null;

  @property(cc.Integer)
  mHeightItem: number = 180;

  @property(cc.Integer)
  mWidthItem: number = 180;

  // @property([cc.SpriteFrame])
  // sprFrameItems: cc.SpriteFrame[] = [];
  // @property([cc.SpriteFrame])
  // sprFrameItemsBlur: cc.SpriteFrame[] = [];

  @property(sp.Skeleton)
  skeSpin: sp.Skeleton = null;

  @property(cc.Node)
  reels: cc.Node = null; // reel

  // @property(cc.Node)
  // itemTemplate: cc.Node = null;
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
  @property(cc.Node)
  effectBonus: cc.Node = null;
  @property(cc.Node)
  effectFreeSpin: cc.Node = null;

  @property(PopupSelectLine)
  popupSelectLine: PopupSelectLine = null;
  @property(PopupBonus)
  popupBonus: PopupBonus = null;

  // //music setting
  // @property(cc.Node)
  // musicOff: cc.Node = null;

  // @property(cc.Node)
  // soundOff: cc.Node = null;

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
    [0, 6, 12, 8, 4], //4
    [10, 6, 2, 8, 14], //5
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
    [5, 11, 2, 13, 9], //22
    [5, 1, 12, 3, 9], //23
    [0, 11, 2, 13, 4], //24
    [10, 1, 12, 3, 14], //25
  ];
  private lastSpinRes: cmd.ReceivePlay = null;
  private columnsWild = [];

  private musicSlotState = null;
  public soundSlotState = null;
  private remoteMusicBackground = null;
  private mIsTrial = false;
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
        let item: Slot7Item = itemNode.getComponent(Slot7Item);
        itemNode.parent = reel;
        // if (j >= 3) {
        //     item.children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItemsBlur[Utils.randomRangeInt(0, this.sprFrameItemsBlur.length)];
        // } else {
        //     item.children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItems[Utils.randomRangeInt(0, this.sprFrameItems.length)];
        // }
        let id = Utils.randomRangeInt(0, 10);
        item.setId(id);
        //item.children[0].width=this.itemTemplate.children[0].width;
        //item.children[0].height=this.itemTemplate.children[0].height;
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
              cc.log("init info Slot7:" + JSON.stringify(res));
              this.daiLyFreeSpin = res.freeSpin;
            }
          }
          break;
        case cmd.Code.DATE_X2:
          {
            let res = new cmd.ReceiveDateX2(data);
            cc.log("init info Slot7:" + JSON.stringify(res));
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
            // cc.log(res);
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
    this.btnPlayTry.node.active = true;
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

    this.skeSpin.animation = "iat";
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
    this.btnPlayTry.interactable = enabled;
    this.btnPlayReal.interactable = enabled;
    //this.toggleTrial.interactable = enabled;
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
      let children = this.reels.children[i].children; // ???
      children[0].stopAllActions();
      children[1].stopAllActions();
      children[2].stopAllActions();

      children[0].runAction(cc.scaleTo(0.1, 1));
      children[1].runAction(cc.scaleTo(0.1, 1));
      children[2].runAction(cc.scaleTo(0.1, 1));
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
      this.stopAllEffects();
      this.stopShowLinesWin();
      this.setEnabledAllButtons(false);
      this.skeSpin.animation = "iat2";
      this.skeSpin.loop = true;
      SlotNetworkClient.getInstance().send(
        new cmd.SendPlay(this.arrLineSelect.toString())
      );
    } else {
      this.isSpined = false;
      this.stopAllEffects();
      this.stopShowLinesWin();
      this.setEnabledAllButtons(false);
      this.skeSpin.animation = "iat2";
      this.skeSpin.loop = true;
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
      this.showWinCash(this.lastSpinRes.prize);
      actions.push(cc.delayTime(1.5));
      actions.push(
        cc.callFunc(function () {
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
              line.active = true;
              let mLine = this.mapLine[lineIdx];
              let countItemWin = 0;
              let fisrtItemId = matrix[mLine[0]];
              for (let j = 0; j < mLine.length; j++) {
                let itemId = matrix[mLine[j]];
                if (
                  fisrtItemId == itemId ||
                  parseInt(itemId) == this.wildItemId ||
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
                rolls[j].children[2 - itemRow].stopAllActions();
                rolls[j].children[2 - itemRow].runAction(
                  cc.repeatForever(
                    cc.sequence(cc.scaleTo(0.2, 1.1), cc.scaleTo(0.2, 1))
                  )
                );
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
    this.effectBigWin
      .getComponentInChildren(sp.Skeleton)
      .setAnimation(0, "animation", false);
    let label = this.effectBigWin.getComponentInChildren(cc.Label);
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
      .setAnimation(0, "animation", false);

    this.effectFreeSpin.runAction(
      cc.sequence(
        cc.delayTime(1),
        cc.delayTime(3),
        cc.callFunc(() => {
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
        cc.delayTime(0.6),
        cc.callFunc(() => {
          label.string = "";
          label.node.active = true;
          Tween.numberTo(label, cash, 1);
        }),
        cc.delayTime(6),
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
      .setAnimation(0, "animation", false);

    this.effectBonus.runAction(
      cc.sequence(
        cc.delayTime(3),
        cc.callFunc(() => {
          this.effectBonus.active = false;
          if (cb != null) cb();
        })
      )
    );
  }

  private onSpinResult(res: cmd.ReceivePlay | any) {
    this.stopSpin();
    cc.log("onSpinResult:" + JSON.stringify(res));
    var successResult = [0, 1, 2, 3, 4, 5, 6];
    //res.result == 5 //bonus
    //res.result == 0 //khong an
    //res.result == 1 //thang thuong
    //res.result == 2 //thang lon
    //res.result == 3 //no hu
    //res.result == 6 //thang cuc lon
    cc.log("saosao:" + (successResult.indexOf(res.result) === -1));
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
      cc.audioEngine.play(this.soundSpin, false, 1);
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
                let children = this.reels.children[c].children;
                children[2].getComponent(Slot7Item).setId(this.wildItemId);
                children[1].getComponent(Slot7Item).setId(this.wildItemId);
                children[0].getComponent(Slot7Item).setId(this.wildItemId);

                // children[2].children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItems[this.wildItemId];
                // children[1].children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItems[this.wildItemId];
                // children[0].children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItems[this.wildItemId];
                this.iconWildColumns.children[c].active = true;
                this.iconWildColumns.children[c].getComponent(
                  sp.Skeleton
                ).animation = "1";
                this.iconWildColumns.children[c].getComponent(
                  sp.Skeleton
                ).loop = false;
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
      roll.runAction(
        cc.sequence(
          cc.delayTime((0.47 + 0.2 * i) * timeScale),
          cc.callFunc(() => {
            let listItemNode = roll.children;
            // listItem[2].children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItems[parseInt(matrix[i])];
            // listItem[1].children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItems[parseInt(matrix[5 + i])];
            // listItem[0].children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItems[parseInt(matrix[10 + i])];
            // listItem[listItem.length - 1].children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItems[parseInt(matrix[i])];
            // listItem[listItem.length - 2].children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItems[parseInt(matrix[5 + i])];
            // listItem[listItem.length - 3].children[0].getComponent(cc.Sprite).spriteFrame = this.sprFrameItems[parseInt(matrix[10 + i])];

            listItemNode[2].getComponent(Slot7Item).setId(parseInt(matrix[i]));
            listItemNode[1]
              .getComponent(Slot7Item)
              .setId(parseInt(matrix[5 + i]));
            listItemNode[0]
              .getComponent(Slot7Item)
              .setId(parseInt(matrix[10 + i]));
            listItemNode[listItemNode.length - 1]
              .getComponent(Slot7Item)
              .setId(parseInt(matrix[i]));
            listItemNode[listItemNode.length - 2]
              .getComponent(Slot7Item)
              .setId(parseInt(matrix[5 + i]));
            listItemNode[listItemNode.length - 3]
              .getComponent(Slot7Item)
              .setId(parseInt(matrix[10 + i]));
          })
        )
      );
    }
  }

  private spined() {
    this.skeSpin.animation = "iat";
    this.skeSpin.loop = true;
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
            cc.audioEngine.play(this.soundSpinWin, false, 1);
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
            this.popupBonus.showBonus(
              this.mIsTrial ? 100 : this.listBet[this.betIdx],
              this.lastSpinRes.haiSao,
              this,
              () => {
                this.showLineWins();
              }
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
}
