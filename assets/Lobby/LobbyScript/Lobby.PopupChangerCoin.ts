import Http from "../../Loading/src/Http";
import Configs from "../../Loading/src/Configs";
import BroadcastReceiver from "./Script/common/BroadcastReceiver";
import Utils from "./Script/common/Utils";
import Dialog from "./Script/common/Dialog";
import App from "./Script/common/App";
import MiniGameNetworkClient from "./Script/networks/MiniGameNetworkClient";
import InPacket from "./Script/networks/Network.InPacket";
import cmd from "./Lobby.Cmd"; 



const { ccclass, property } = cc._decorator;

@ccclass("PopupChangerCoin.TabCashIn")


export class TabCashIn {
    @property(cc.Label)
    lblBalance: cc.Label = null;
    @property(cc.EditBox)
    edbCoin: cc.EditBox = null;
    @property(cc.Node)
    quickButtons: cc.Node = null;
	//private game = 0;
    private popup: PopupChangerCoin = null;

    private readonly values = [50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000];

    public start(popup: PopupChangerCoin) {
        this.popup = popup;
        this.edbCoin.node.on("editing-did-ended", () => {
            let number = Utils.stringToInt(this.edbCoin.string);
            this.edbCoin.string = Utils.formatNumber(number);
        });
        for (let i = 0; i < this.quickButtons.childrenCount; i++) {
            var btn = this.quickButtons.children[i];
            let value = this.values[i];
            btn.getComponentInChildren(cc.Label).string = Utils.formatNumber(value);
            btn.on("click", () => {
                this.edbCoin.string = Utils.formatNumber(value);
            });
        }
    }

    public submit() {
        let coin = Utils.stringToInt(this.edbCoin.string);
        if (coin <= 0) {
			App.instance.confirmDialog.show2("Số tiền đã nhập không hợp lệ.");	
            return;
        }
        App.instance.showLoading(true);
		Http.postz('https://serverv8.sun88.link/CashIn', {game: Configs.Login.Game, 'token': Configs.Login.SessionKeyV8, 'amount': coin, 'type': 'CashIn'  }, (err, resv2) => {
		App.instance.showLoading(false);
		 
		    if (resv2["status"] == 1) {
				App.instance.ShowAlertDialog(resv2['msg']);
                return;
            }else{ 
		    Configs.Login.CoinV8 = resv2["newCoin"];
			Configs.Login.Coin 	= resv2["newCash"];
            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
			App.instance.confirmDialog.show2("Thao tác thành công.");	
            this.reset();	
			MiniGameNetworkClient.getInstance().send(new cmd.ReqGetMoneyUse());
			}

		})	
		
    }

    public reset() {
        this.edbCoin.string = "";
        this.lblBalance.string = Utils.formatNumber(Configs.Login.Coin);
    }
}

@ccclass("PopupChangerCoin.TabCashOut")
export class TabCashOut {
    @property(cc.Label)
    lblBalance: cc.Label = null;
    @property(cc.EditBox)
    edbCoin: cc.EditBox = null;
    @property(cc.Node)
    quickButtons: cc.Node = null;

    private popup: PopupChangerCoin = null;

    private readonly values = [50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000];

    public start(popup: PopupChangerCoin) {
        this.popup = popup;
        this.edbCoin.node.on("editing-did-ended", () => {
            let number = Utils.stringToInt(this.edbCoin.string);
            this.edbCoin.string = Utils.formatNumber(number);
        });
        for (let i = 0; i < this.quickButtons.childrenCount; i++) {
            var btn = this.quickButtons.children[i];
            let value = this.values[i];
            btn.getComponentInChildren(cc.Label).string = Utils.formatNumber(value);
            btn.on("click", () => {
                this.edbCoin.string = Utils.formatNumber(value);
            });
        }
    }

    public submit() {
        let coin = Utils.stringToInt(this.edbCoin.string);
        if (coin <= 0) {
			App.instance.confirmDialog.show2("Số tiền đã nhập không hợp lệ.");	


            return;
        }
			App.instance.showLoading(true);
			Http.postz('https://serverv8.sun88.link/CashIn', {game: Configs.Login.Game, 'token': Configs.Login.SessionKeyV8, 'amount': coin, 'type': 'CashOut'  }, (err, resv2) => {
			App.instance.showLoading(false);		 
		    if (resv2["status"] == 1) {
			App.instance.ShowAlertDialog(resv2['msg']);
            return;
            } else {
		    Configs.Login.CoinV8 = resv2["newCoin"];
			Configs.Login.Coin 	= resv2["newCash"];
            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
			App.instance.confirmDialog.show2("Thao tác thành công.");	
            this.reset();	
			MiniGameNetworkClient.getInstance().send(new cmd.ReqGetMoneyUse());
			}
		})	
		
    }

    public reset() {
        this.edbCoin.string = "";
        this.lblBalance.string = Utils.formatNumber(Configs.Login.CoinV8);
    }
}

@ccclass
export default class PopupChangerCoin extends Dialog {
    @property(cc.ToggleContainer)
    tabs: cc.ToggleContainer = null;
    @property(cc.Node)
    tabContents: cc.Node = null;
    @property(TabCashIn)
    tabCashIn: TabCashIn = null;
    @property(TabCashOut)
    tabCashOut: TabCashOut = null;

    private tabSelectedIdx = 0;
	private game = 0;
    start() {
        for (let i = 0; i < this.tabs.toggleItems.length; i++) {
            this.tabs.toggleItems[i].node.on("toggle", () => {
                this.tabSelectedIdx = i;
                this.onTabChanged();
            });
        }

        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            this.tabCashIn.lblBalance.string = Utils.formatNumber(Configs.Login.Coin);
            this.tabCashOut.lblBalance.string = Utils.formatNumber(Configs.Login.CoinV8);
        }, this);

        this.tabCashIn.start(this);
        this.tabCashOut.start(this);
    }

    show(res,event) {		
		if (!Configs.Login.IsLogin) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_need_login'));
            return;
        }	
		Http.post('https://serverv8.sun88.link/coin_game', {'token': Configs.Login.SessionKeyV8, 'game': this.game}, (err, resv2) => {
						//Configs.Login.SessionKeyV8 = resv2["token"];	
						Configs.Login.CoinV8 = resv2["newCoin"];
						Configs.Login.Coin 	= resv2["newCash"];
						
		});
        super.show();
        this.tabSelectedIdx = 0;
		this.game = event;
		Configs.Login.Game = event;
        this.tabs.toggleItems[this.tabSelectedIdx].isChecked = true;
        this.onTabChanged();
    }

    private onTabChanged() {
        for (let i = 0; i < this.tabContents.childrenCount; i++) {
            this.tabContents.children[i].active = i == this.tabSelectedIdx;
        }
        for (let j = 0; j < this.tabs.toggleItems.length; j++) {
            this.tabs.toggleItems[j].node.getComponentInChildren(cc.LabelOutline).color = j == this.tabSelectedIdx ? cc.Color.BLACK.fromHEX("#AA5F00") : cc.Color.BLACK.fromHEX("#4677F3");
        }
        switch (this.tabSelectedIdx) {
            case 0:
                this.tabCashIn.reset();
                break;
            case 1:
                this.tabCashOut.reset();
                break;
        }
    }

    public actSubmitCashIn() {
        this.tabCashIn.submit();
    }
	
	public actSubmitCashOut() {
        this.tabCashOut.submit();
    }


    public actSubmitGo(err, event) {
		App.instance.showLoading(true);		
		Http.postz('https://serverv8.sun88.link/logingame', {'token': Configs.Login.SessionKeyV8, 'game': this.game}, (err, resv2) => {
			App.instance.showLoading(false);
		    if (resv2["status"] == 1) {
			App.instance.confirmDialog.show2(resv2['msg']);			
			return;
           } else {
			var url = resv2['url'];
              cc.sys.openURL(url);
            //App.instance.openWebView(url);			
			
			}
		})

    public actClearCashOut() {
        this.tabCashOut.edbCoin.string = "0";
    }
}

