import Configs from "../../Loading/src/Configs";
import Http from "../../Loading/src/Http";
import App from "./Script/common/App";
import BroadcastReceiver from "./Script/common/BroadcastReceiver";



const {ccclass, property} = cc._decorator;

@ccclass
export default class UIItemDiemDanh extends cc.Component {

    @property(cc.Label)
    txtContent: cc.Label = null;
    
    @property(cc.Node)
    nodeNew: cc.Node = null;
   

    private data = null;
    private uiPopupMail = null;
    init(uiPopupMail,data){
        this.uiPopupMail = uiPopupMail;
        this.data = data;
        this.txtContent.string = data.title;
        this.nodeNew.active = data.status == 0 ?true:false;
    }

    onBtnRead(){
        this.uiPopupMail.readMail(this.data);
        if(this.data.status == 0){
            //new
            this.data.status = 1;
            this.nodeNew.active = this.data.status == 0 ?true:false;
            Http.get(Configs.App.API, { c: "404", mid: this.data.mail_id }, (err, res) => {
                App.instance.showLoading(false);
                if (err != null) return;
                BroadcastReceiver.send(BroadcastReceiver.ON_UPDATE_MAIL);
                
            });
        }
    }
}
