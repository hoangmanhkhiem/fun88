import Configs from "../../Loading/src/Configs";
import { Global } from "../../Loading/src/Global";
import Http from "../../Loading/src/Http";
import App from "./Script/common/App";
import Dialog from "./Script/common/Dialog";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Popupnaprut extends Dialog {



    show() {
        super.show();
        // for (let i = 0; i < this.itemTemplate.parent.childrenCount; i++) {
        //     this.itemTemplate.parent.children[i].active = false;
        // }
            if(Configs.Login.ListBankRut == null){
                App.instance.showLoading(true);
                var data = {};
                data["c"] = 2008;
                data["nn"] = Configs.Login.Nickname;
                data["pn"] = 1;
                data["l"] = 10;
                Http.get(Configs.App.API, data, (err, res) => {
                    App.instance.showLoading(false);
                    var list = JSON.parse(res.data).data;
                    Configs.Login.ListBankRut = list;
                });
            }
    }

    dismiss() {
        super.dismiss();
        // for (let i = 0; i < this.itemTemplate.parent.childrenCount; i++) {
        //     this.itemTemplate.parent.children[i].active = false;
        // }
    }
    onClickNap(){
        Global.LobbyController.actAddCoin();
        this.dismiss();
    }
    onClickRut(){
        Global.LobbyController.actCashout();
        this.dismiss();
    }


    // private getItem(): cc.Node {
    //     let item = null;
    //     for (let i = 0; i < this.itemTemplate.parent.childrenCount; i++) {
    //         let node = this.itemTemplate.parent.children[i];
    //         if (node != this.itemTemplate && !node.active) {
    //             item = node;
    //             break;
    //         }
    //     }
    //     if (item == null) {
    //         item = cc.instantiate(this.itemTemplate);
    //         item.parent = this.itemTemplate.parent;
    //     }
    //     item.active = true;
    //     return item;
    // }


    //             }
    //         }
    //     });
    // }
}
