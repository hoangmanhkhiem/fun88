// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../Script/common/App";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseTabShop extends cc.Component {

    show(data){
        this.node.active = true;
        if(!!App.instance.configGame == false) this.getConfigGame()
        if(!!App.instance.configShop == false) this.getConfigShop()
    }

    hide(){
        this.node.active = false;
    }

    resetPos(){
        this.node.x = this.node.y = 0
    }

    private getConfigGame(){
        console.log("getConfigGame")
        Http.get(Configs.App.API, { "c": 130 }, (err, res) => {
            App.instance.showLoading(false);
            
            App.instance.configGame = res
            console.log("->> App.instance.configGame",App.instance.configGame)
        });
    }

    private getConfigShop(){
        console.log("getConfigShop")
        Http.get(Configs.App.API, { "c": 2002, "nn": Configs.Login.Nickname, "at": Configs.Login.AccessToken, pt: 1 }, (err, res) => {
            App.instance.showLoading(false);
            if(res.success == true)
            {
                App.instance.configShop = res.data
                console.log("->> App.instance.configShop",App.instance.configShop)
            }
            
        });
    }
}
