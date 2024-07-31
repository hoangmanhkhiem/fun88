import cmd from "./TaiXiuMini.Cmd";
import TaiXiuMiniController from "./TaiXiuMini.TaiXiuMiniController";
import Configs from "../../../Loading/src/Configs";
import MiniGameNetworkClient from "../../../Lobby/LobbyScript/Script/networks/MiniGameNetworkClient";

const { ccclass, property } = cc._decorator;

namespace taixiumini {
    @ccclass
    export class PanelChat extends cc.Component {

        @property(cc.Node)
        itemChatTemplate: cc.Node = null;
        @property(cc.ScrollView)
        scrMessage: cc.ScrollView = null;
        @property(cc.EditBox)
        edbMessage: cc.EditBox = null;

        start() {
            this.itemChatTemplate.active = false;
            this.edbMessage.node.on("editing-return", ()=>{
                this.sendChat();
            });
            // this.edbMessage.node.on("editing-did-ended", ()=>{
            //     this.sendChat();
            // });
        }

        show(isShow: boolean) {
            this.node.active = isShow;
            if (isShow) {
                // for (var i = 0; i < this.scrMessage.content.childrenCount; i++) {
                //     let node = this.scrMessage.content.children[i];
                //     node.active = false;
                // }
                MiniGameNetworkClient.getInstance().send(new cmd.SendScribeChat());
            } else {
                MiniGameNetworkClient.getInstance().send(new cmd.SendUnScribeChat());
            }
        }

        addMessage(nickname: string, message: string) {
            let item: cc.Node = null;
            for (var i = 0; i < this.scrMessage.content.childrenCount; i++) {
                let node = this.scrMessage.content.children[i];
                if (!node.active) {
                    item = node;
                    break;
                }
            }
            if (item == null) {
                if (this.scrMessage.content.childrenCount >= 50) {
                    item = this.scrMessage.content.children[0];
                } else {
                    item = cc.instantiate(this.itemChatTemplate);
                }
            }
            var zIndex = 0;
            for (var i = 0; i < this.scrMessage.content.childrenCount; i++) {
                let node = this.scrMessage.content.children[i];
                if (node != item) {
                    node.zIndex = zIndex++;
                }
            }
            item.parent = this.scrMessage.content;
            let lblNickname: cc.Label = item.getChildByName("lblNickname").getComponent(cc.Label);
            lblNickname.string = `${nickname}:`;
            lblNickname.node.color = nickname == Configs.Login.Nickname ? cc.Color.WHITE.fromHEX("#3bff49") : cc.Color.WHITE.fromHEX("#FF9900");
            item.getComponent(cc.Label).string = `${nickname}: ${message}`;
            item.active = true;
            item.zIndex = zIndex++;
            this.scrollToBottom();
        }

        sendChat() {
            let msg = this.edbMessage.string.trim();
            if (msg.length == 0) {
                return;
            }
            this.edbMessage.string = "";
            TaiXiuMiniController.instance.sendChat(msg);
        }

        scrollToBottom() {
            this.scrMessage.scrollToBottom(0.2);
        }
    }
}
export default taixiumini.PanelChat;
