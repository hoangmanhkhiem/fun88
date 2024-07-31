import Dialog from "../Script/common/Dialog";
import cmd from "../Lobby.Cmd";
import InPacket from "../Script/networks/Network.InPacket";
import MiniGameNetworkClient2 from "../Script/networks/MiniGameNetworkClient2";
import Dropdown from "../Script/common/Dropdown";
import Configs from "../../../Loading/src/Configs";
import App from "../Script/common/App";
import Utils from "../Script/common/Utils";
import SPUtils from "../Script/common/SPUtils";
import Http from "../../../Loading/src/Http";
import BroadcastReceiver from "../Script/common/BroadcastReceiver";
//import VersionConfig from "../Script/common/VersionConfig";
//import ShootFishNetworkClient from "../Script/networks/ShootFishNetworkClient";
const { ccclass, property } = cc._decorator;
// @ccclass
// export default class TabShop_PanelNapBank extends Dialog {
//     @property(cc.Node)
//     itemFactorTemplate: cc.Node = null;

//     @property(cc.Label)
//     lblBankNumber: cc.Label = null;
//     @property(cc.Label)
//     lblBankAccountName: cc.Label = null;
//     @property(cc.Label)
//     lblBankAddress: cc.Label = null;

//     @property(cc.Label)
//     lblTransNote: cc.Label = null;
// 	@property(cc.Button)
//     btnCopy: cc.Button = null;
// 	@property(cc.Button)
//     btnCopyND: cc.Button = null;
    

//     @property(Dropdown)
//     dropdownBank: Dropdown = null;

//     @property(cc.EditBox)
//     edbAmount: cc.EditBox = null;
//     private _listBank = [];

//     // start() {
//     //     this.lblTransNote.string = "Nap "+Configs.Login.Nickname;
//     //     App.instance.showLoading(true);
//     //     Http.get(Configs.App.API, { "c": 130 }, (err, res) => {
//     //         App.instance.showLoading(false);
//     //         if (err == null) {
//     //             if(res.list_bank === undefined || res.list_bank.length == 0){

//     //                 return;
//     //             }

//     //             let listBank = res.list_bank;
//     //             this._listBank = listBank;
//     //             let bankName = ["Chọn ngân hàng"];
//     //             for(let i = 0; i < listBank.length; i ++){
//     //                 bankName.push(listBank[i].bankName);
//     //             }
//     //             this.dropdownBank.setOptions(bankName);
//     //             this.dropdownBank.setOnValueChange((idx) => {
//     //                 if(idx > 0){
//     //                    // this.lblBankAddress.string = listBank[idx - 1].bankAddress;
//     //                     this.lblBankAccountName.string = listBank[idx - 1].bankAccountName;
//     //                     this.lblBankNumber.string = listBank[idx - 1].bankNumber;
//     //                 }else {
//     //                    // this.lblBankAddress.string = "";
//     //                     this.lblBankAccountName.string = "";
//     //                     this.lblBankNumber.string = "";
//     //                 }
                    
        
//     //             })
//     //         }
//     //     });
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
// 	// 	this.btnCopy.node.on("click", ()=> {
//     //         if (this.lblBankNumber.string.length > 0) {
                
//     //                 SPUtils.copyToClipboard(this.lblBankNumber.string);
// 	// 				App.instance.alertDialog.showMsg("Đã sao chép số tài khoản.");
                
//     //         } else {
//     //             App.instance.alertDialog.showMsg("Chưa có số tài khoản.");  
//     //         }
//     //     });
// 	// 	this.btnCopyND.node.on("click", ()=> {
//     //         if (this.lblTransNote.string.length > 0) {
//     //             SPUtils.copyToClipboard(this.lblTransNote.string);
// 	// 				App.instance.alertDialog.showMsg("Đã sao chép nội dung.");
                
//     //         } else {
//     //             App.instance.alertDialog.showMsg("Chưa có nội dung.");  
//     //         }
//     //     });
        
//     // }

//     // submit() {
//     //     let ddBank = this.dropdownBank.getValue();
//     //     if (ddBank == 0) {
//     //         App.instance.alertDialog.showMsg("Vui lòng chọn ngân hàng.");
//     //         return;
//     //     }
//     //     let bankSelected = this._listBank[ddBank - 1].bankNumber;
        
//     //     let amountSt = this.edbAmount.string.trim();
//     //     let amount = Number(amountSt);
//     //     if(isNaN(amount) || amount <= 0){
//     //         App.instance.alertDialog.showMsg("Số tiền nạp không hợp lệ");
//     //         return;
//     //     }

        
        
//     //     App.instance.showLoading(true);
//     //     MiniGameNetworkClient.getInstance().send(new cmd.ReqDepositBank(bankSelected, amount));
//     // }
// 	// onBtnXacNhan() {
//     //     if (this.node.active) {
		
        
		
//     //         var money = Utils.formatEditBox(this.edbAmount.string);
// 	// 		//let ddBank = this.dropdownBank.getValue();
// 	// 		let ddBank = this.dropdownBank.getValue();
// 	// 		if (ddBank == 1) {
            
// 	// 		var bank = "VietcomBank"
//     //     }
// 	// 	if (ddBank == 2) {
            
// 	// 		var bank = "VietinBank"
//     //     }
// 	// 	if (ddBank == 3) {
            
// 	// 		var bank = "TPBank"
//     //     }
// 	// 	if (ddBank == 4) {
            
// 	// 		var bank = "TechcomBank"
//     //     }
// 	// 	if (ddBank == 5) {
            
// 	// 		var bank = "BIDV"
//     //     }
// 	// 	if (ddBank == 6) {
            
// 	// 		var bank = "SacomBank"
//     //     }
//     //         //var bankNumber = this.editBankNumber.string.trim();
//     //         if (money == "" || ddBank == null) {
//     //             App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
//     //             return;
//     //         }
//     //         if (money < 100000) {
//     //             App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_in_min") + " 100.000");
//     //             return;
//     //         }
//     //         if (money > 300000000) {
//     //             App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_in_max") + " 300.000.000");
//     //             return;
//     //         }
//     //         var self = this;
//     //         App.instance.showLoading(true, -1);
//     //         //Utils.Log("chuyen khoan:" + encodeURIComponent(this.editName.string.trim()));
//     //         var request = {
//     //             "c": 2003,
//     //             "fn": encodeURIComponent(ddBank),
//     //             "am": money,
//     //             "pt": 1,
//     //             "nn": Configs.Login.Nickname,
//     //             "at": Configs.Login.AccessToken,
//     //             "pn": "manualbank",
//     //             "bc": bank,
//     //             "ds": Configs.Login.Nickname,
//     //             "bn": money
//     //         };
//     //         //this.lbTransMsg.string = request['ds'];
//     //         Http.get(Configs.App.API, request, (err, res) => {
//     //             App.instance.showLoading(false);
//     //             cc.log(res);
//     //             if (res.success == true) {
//     //                 App.instance.ShowAlertDialog("Gửi thông tin nạp tiền thành công!");
//     //             }
//     //             else {
//     //                 App.instance.ShowAlertDialog(res.message);
//     //             }
//     //         });
//     //     }

//     // }

    

    
// }


import BaseTabShop from "./BaseTabShop";
@ccclass
export class TabShop_PanelNapBank extends BaseTabShop {



    // https://iportal.go88vin.live/api?c=2002&nn=mrkenju66&at=397c67ce8ad778258d9622b54a173baa&pt=1&cp=R&cl=R&pf=web

    // c: 2002
    // nn: mrkenju66
    // at: 397c67ce8ad778258d9622b54a173baa
    // pt: 1
    // cp: R
    // cl: R
    // pf: web

    // {"success":true,"errorCode":"0","message":null,"statistic":null,"totalRecords":0,"data":[{"providerName":"manualbank","providerConfig":{"currencyCode":"VND","payType":[{"key":"1","name":"bank_recharge","status":1},{"key":"4","name":"momo_recharge","status":1},{"key":"5","name":"zalo_recharge","status":1}],"banks":[{"key":"VCB","imageUrl":"https://cdn.yo789.club/1.png","name":"Vietcombank","status":1,"isWithdraw":0},{"key":"TCB","imageUrl":"https://cdn.yo789.club/10.png","name":"Techcombank","status":1,"isWithdraw":0},{"key":"BIDV","imageUrl":"https://cdn.yo789.club/9.png","name":"BIDV","status":1,"isWithdraw":1},{"key":"DAB","imageUrl":"https://cdn.yo789.club/2.png","name":"DongA Bank","status":1,"isWithdraw":1},{"key":"ICB","imageUrl":"https://cdn.yo789.club/3.png","name":"VietinBank","status":1,"isWithdraw":1},{"key":"STB","imageUrl":"https://cdn.yo789.club/4.png","name":"Sacombank","status":1,"isWithdraw":1},{"key":"ACB","imageUrl":"https://cdn.yo789.club/8.png","name":"ACB","status":1,"isWithdraw":1},{"key":"EXB","imageUrl":"https://cdn.yo789.club/7.png","name":"Eximbank","status":1,"isWithdraw":1},{"key":"VIB","imageUrl":"https://cdn.yo789.club/6.png","name":"VIB Bank","status":1,"isWithdraw":1},{"key":"MB","imageUrl":"https://cdn.yo789.club/5.png","name":"Mbbank","status":1,"isWithdraw":1},{"key":"TPB","imageUrl":"https://cdn.yo789.club/13.png","name":"TienPhong Bank","status":1,"isWithdraw":1},{"key":"MSB","imageUrl":"https://cdn.yo789.club/12.png","name":"MariTimeBank","status":1,"isWithdraw":1},{"key":"HDB","imageUrl":"https://cdn.yo789.club/11.png","name":"HD Bank","status":1,"isWithdraw":1}],"minMoney":20000,"status":1}},{"providerName":"napthe","providerConfig":{"currencyCode":"VND","payType":[{"key":"1","name":"bank_recharge","status":1},{"key":"4","name":"momo_recharge","status":1},{"key":"5","name":"zalo_recharge","status":1}],"banks":[{"key":"VCB","imageUrl":"https://cdn.yo789.club/1.png","name":"Vietcombank","status":1,"isWithdraw":0},{"key":"TCB","imageUrl":"https://cdn.yo789.club/10.png","name":"Techcombank","status":1,"isWithdraw":0},{"key":"BIDV","imageUrl":"https://cdn.yo789.club/9.png","name":"BIDV","status":1,"isWithdraw":1},{"key":"DAB","imageUrl":"https://cdn.yo789.club/2.png","name":"DongA Bank","status":1,"isWithdraw":1},{"key":"ICB","imageUrl":"https://cdn.yo789.club/3.png","name":"VietinBank","status":1,"isWithdraw":1},{"key":"STB","imageUrl":"https://cdn.yo789.club/4.png","name":"Sacombank","status":1,"isWithdraw":1},{"key":"ACB","imageUrl":"https://cdn.yo789.club/8.png","name":"ACB","status":1,"isWithdraw":1},{"key":"EXB","imageUrl":"https://cdn.yo789.club/7.png","name":"Eximbank","status":1,"isWithdraw":1},{"key":"VIB","imageUrl":"https://cdn.yo789.club/6.png","name":"VIB Bank","status":1,"isWithdraw":1},{"key":"MB","imageUrl":"https://cdn.yo789.club/5.png","name":"Mbbank","status":1,"isWithdraw":1},{"key":"TPB","imageUrl":"https://cdn.yo789.club/13.png","name":"TienPhong Bank","status":1,"isWithdraw":1},{"key":"MSB","imageUrl":"https://cdn.yo789.club/12.png","name":"MariTimeBank","status":1,"isWithdraw":1},{"key":"HDB","imageUrl":"https://cdn.yo789.club/11.png","name":"HD Bank","status":1,"isWithdraw":1}],"minMoney":20000,"status":1}},{"providerName":"clickpay","providerConfig":{"currencyCode":"VND","payType":[{"key":"907","name":"quickPay","status":1},{"key":"908","name":"banking","status":0}],"banks":[{"key":"VCB","imageUrl":"https://cdn.yo789.club/1.png","name":"Vietcombank","status":0,"isWithdraw":1}],"minMoney":10000,"status":0}},{"providerName":"bank","providerConfig":{"currencyCode":"VND","payType":[{"key":"907","name":"quickPay","status":1},{"key":"908","name":"banking","status":0}],"banks":[{"key":"VCB","imageUrl":"https://cdn.yo789.club/1.png","name":"Vietcombank","status":0,"isWithdraw":1}],"minMoney":10000,"status":1}},{"providerName":"gift","providerConfig":{"currencyCode":"VND","payType":[{"key":"907","name":"quickPay","status":1},{"key":"908","name":"banking","status":0}],"banks":[{"key":"VCB","imageUrl":"https://cdn.yo789.club/1.png","name":"Vietcombank","status":0,"isWithdraw":1}],"minMoney":10000,"status":1}}]}




    // https://iportal.go88vin.live/api?c=130&cp=R&cl=R&pf=web&at=397c67ce8ad778258d9622b54a173baa

    // c: 130
    // cp: R
    // cl: R
    // pf: web
    // at: 397c67ce8ad778258d9622b54a173baa

    // {"cashout_bank_max": 20000000,"cashout_limit_system": 1000000000,"cashout_limit_user": 2000000,"cashout_time_block": 24,"chuyen_vin_min": 10000,"dl1_to_super_max": -2147483648,"dl1_to_super_min": 0,"dl1_to_super_min_x": 0,"i2b": [500000,1000000,2000000,5000000,10000000,20000000],"iap_max": 30000,"iap_package": [],"is_api_otp": 0,"is_chuyen_vin": 0,"is_mua_the": 0,"is_nap_dt": 1,"is_nap_mega_card": 0,"is_nap_the": 0,"is_nap_tien_nh": 0,"is_nap_vin_card": 0,"is_nap_vin_iap": 1,"is_nap_vin_nh": 1,"is_nap_xu": 0,"is_sms": 0,"is_sms_plus": 0,"is_vin_plus": 0,"mua_the_dt": [0,1,2],"mua_the_game": [5,6,7],"nap_the": [0,1,2],"nap_tien_dt": [0,1,2,4],"nap_tien_nh": [0,1,2,3],"nap_vin_nh": [0,1,2,3,4,5,6,7,8,9,10,12,13,14,15,17,19,22,24,26],"num_doi_the": 3,"num_recharge_fail": 3,"payment_fb": 1,"r_tf_01": 1,"r_tf_02": 0.98,"r_tf_11": 1,"r_tf_12": 1,"r_tf_20": 0.98,"r_tf_21": 1,"r_tf_22": 1,"ratio_chuyen": 0.98,"ratio_mua_the": 1.2,"ratio_nap_dt": 1.17,"ratio_nap_mega_card": 0.1,"ratio_nap_sms": 0.1,"ratio_nap_the": 0.77,"ratio_nap_tien_nh": 0.83,"ratio_nap_vin_card": 0.1,"ratio_nap_vin_nh": 1,"ratio_nap_vin_momo": 1,"ratio_refund_fee_1": 0,"ratio_refund_fee_2": 0,"ratio_refund_fee_2_more": 0.1,"ratio_transfer_dl_1": 1,"ratio_xu": 100,"refund_fee_2_more": 0.1,"super_admin": "superadmin123","super_agent": "tongdailyhn","system_iap_max": 0,"list_bank": [{"bankName": "Vietcombank","bankNumber": "1018759225","bankAccountName": "Phạm Ngọc Hân","bankAddress": "HN"},{"bankName": "BIDV","bankNumber": "48610000651162","bankAccountName": "Phạm Thanh Phong","bankAddress": "HN"},{"bankName": "Vietinbank","bankNumber": "106873922516","bankAccountName": "Phạm Thanh Phong","bankAddress": "HN"},{"bankName": "MB Bank","bankNumber": "1712666789999","bankAccountName": "Phạm Thanh Phong","bankAddress": "HN"},{"bankName": "Agribank","bankNumber": "3204205581595","bankAccountName": "Phạm Thanh Phong","bankAddress": "HN"}],"list_bank_cashout": [{"bankName": "Vietcombank","bankNumber": "1018759225","bankAccountName": "Vietcombank","bankAddress": "HN"},{"bankName": "BIDV","bankNumber": "48610000651162","bankAccountName": "Phạm Thanh Phong","bankAddress": "HN"},{"bankName": "Vietinbank","bankNumber": "106873922516","bankAccountName": "Phạm Thanh Phong","bankAddress": "HN"},{"bankName": "MB Bank","bankNumber": "1712666789999","bankAccountName": "Phạm Thanh Phong","bankAddress": "HN"},{"bankName": "Agribank","bankNumber": "3204205581595","bankAccountName": "Phạm Thanh Phong","bankAddress": "HN"}],"momoConfig": {"accountName": "wefwefwe erferfwf","accountNumber": "0123456789","image_path": "https://cdn.kingwin.vin/banner_3.png"},"is_cashout_momo": 0,"is_cashout_bank": 0,"ratio_nap_tien_momo": 1.1,"ratio_cashout_momo": 1.1,"ratio_cashout_bank": 1.1,"cashout_bank_min": 100000,"cashout_momo_min": 100000,"ratio_nap_vin_coin": 1,"list_coin_support": ["USDT.ERC20","BTC","ETH"],"ratio_cashout_coin": 1.2,"cashout_coin_min": 23000,"cashout_coin_max": 230000000,"rate_usdt_point": 5000,"is_cashout_coin": 0,"ratio_cashout_com": 0.97,"cashout_com_min": 1000000,"radio_free_com": 0.02,"cashout_momo_max": 1000000 }



    // https://iportal.go88vin.live/api?c=2003&fn=1&am=123123&pt=1&nn=mrkenju66&at=397c67ce8ad778258d9622b54a173baa&pn=manualbank&bc=Vietcombank&ds=mrkenju66&bn=123123&cp=R&cl=R&pf=web

    // c: 2003
    // fn: 1
    // am: 123123
    // pt: 1
    // nn: mrkenju66
    // at: 397c67ce8ad778258d9622b54a173baa
    // pn: manualbank
    // bc: Vietcombank
    // ds: mrkenju66
    // bn: 123123
    // cp: R
    // cl: R
    // pf: web

    // {"success":true,"errorCode":"0","message":null,"statistic":null,"totalRecords":0,"data":""}


    @property(cc.Label)
    lblNameBank:cc.Label

    @property(cc.Label)
    lblNumberBank:cc.Label

    @property(cc.Label)
    lblAccountBank:cc.Label

    @property(cc.Label)
    lblContentBank:cc.Label

    @property(cc.EditBox)
    edbInputMoney:cc.EditBox

    @property(Dropdown)
    nodeDropDown:Dropdown


    _listBank = []
    show(data) {
        super.show(data);
        var self = this;
        self.clearAll()



        self.nodeDropDown.setOptions([])
        self.nodeDropDown.setOnValueChange((idx) => {
            console.log("setOnValueChange",idx)
            if (idx >= 0) {
                self.lblAccountBank.string = self._listBank[idx].bankAccountName;
                self.lblNumberBank.string = self._listBank[idx].bankNumber;
                self.lblNumberBank.string = self._listBank[idx].bankNumber;
            } else {
                self.lblAccountBank.string = "";
                self.lblNumberBank.string = "";
                self.lblNumberBank.string = "";
                self.lblNameBank.string = "Chọn Ngân Hàng";
            }


        })


        self.request().getListBank()
    }

    clearAll() {
        var self = this;
        
        self.lblAccountBank.string = ""
        self.lblNameBank.string = "Chọn Ngân Hàng";
        self.lblNumberBank.string = "";
        self.lblContentBank.string = "";
        self.edbInputMoney.string = "";
    }

    hide() {
        super.hide();

    }

    onCopy(pE,pK){
        let self = this;
        console.log("onCopy",pE,pK)
        switch(pK){
            case 'stk':{
                SPUtils.copyToClipboard(self.lblNumberBank.string)
				App.instance.alertDialog.showMsg("Đã sao chép số tài khoản.");
            }break;
            case 'noidung':{
                SPUtils.copyToClipboard(self.lblContentBank.string)
				App.instance.alertDialog.showMsg("Đã sao chép nội dung.");
            }break;
        }
    }
    onEdbChange(pText){
        console.log("onEdbChange",pText)
        this.lblContentBank.string = `${Configs.Login.Nickname}_${Utils.formatMoney(pText,true)}`;
    }

    onBtnSendRequest(){
        var self = this;
        self.request().sendRequestCashIn()
    };
    request(){
        var self = this;



        return {


            getListBank : () => {
                // //get config from server 
                App.instance.showLoading(true);
                
                Http.get(Configs.App.API, { "c": 130 }, (err, res) => {
                    App.instance.showLoading(false);
                    
                   

                    this._listBank = res.list_bank ? res.list_bank : []
                    console.log("this._listBank",this._listBank)

                    let dataArray = []
                    for(let i =0 ;i< this._listBank.length ;i++)
                    {
                        dataArray.push(this._listBank[i]['bankName'])
                    }


                    this.nodeDropDown.setOptions(dataArray)
                });
            },

            sendRequestCashIn : () => {

                let ddBank = self.nodeDropDown.getValue();
                let bankSelected = this._listBank[ddBank].bankNumber;


                App.instance.showLoading(true, -1);
                
				var request = {
					"c": 2003,
					"fn": bankSelected,
					"am": Utils.stringToInt(self.edbInputMoney.string),
					"nn": Configs.Login.Nickname,
					"at": Configs.Login.AccessToken,
					"pn": "manualbank",
					"pt": "1",
					"bn": bankSelected,
					"bc": this._listBank[ddBank].bankName,
					"ds": this.lblContentBank.string
					
				};
                Http.get(Configs.App.API, request, (err, res) => {
                    App.instance.showLoading(false);
                    //  cc.log(res);
                    if (res.success == true) {
						App.instance.ShowAlertDialog("Tạo đơn hàng thành công. Chúng tôi sẽ xem xét xử lý!");
                        self.clearAll();
                    }else{
					App.instance.ShowAlertDialog(res.message);	
					}
                    
                });

            }

        }
    }
}
 