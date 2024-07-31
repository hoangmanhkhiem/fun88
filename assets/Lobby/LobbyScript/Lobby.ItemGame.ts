import Configs from "../../Loading/src/Configs";
import { Global } from "../../Loading/src/Global";
import App from "./Script/common/App";
import Tween from "./Script/common/Tween";
import Utils from "./Script/common/Utils";

const { ccclass, property } = cc._decorator;

export enum ItemGameType {
    OTHER,
    SLOT,
    CARD,
    MINI
}

@ccclass
export default class ItemGame extends cc.Component {
    @property
    id: string = "";
    @property({ type: cc.Enum(ItemGameType) })
    type: ItemGameType = ItemGameType.OTHER;
    @property
    commingSoon: boolean = false;

    @property(cc.Node)
    nodeIcon: cc.Node = null;
    @property(sp.Skeleton)
    animIcon: sp.Skeleton = null;
    @property(sp.Skeleton)
    animHot: sp.Skeleton = null;
    @property([cc.Label])
    listLbJP: cc.Label[] = [];

    @property(cc.Vec2)
    InitScale: cc.Vec2 = null;
    isInitFakeJP: boolean = false;

    onLoad() {
        if (this.nodeIcon && this.commingSoon) {
            this.nodeIcon.color = cc.Color.GRAY;
        }
    }
   
    setInfo(dataGame) {
        this.reset();
        this.animIcon.node.setPosition(dataGame['position']);
        switch (dataGame['tabGame']) {
            case 'gamesport':
            case 'gamelive':
            case 'gamefish':
                this.type = ItemGameType.OTHER;
                break;
            case 'gamecard':
                this.type = ItemGameType.CARD;
                break;
            case 'gameslot':
                this.type = ItemGameType.SLOT;
                break;
            case 'gamemini':
                this.type = ItemGameType.MINI;
                break;
	 
																 
						   
								   
							
							
					  
							 
										  
				  
											  
				 
        }
        this.getComponent(cc.Button).clickEvents[0].customEventData = dataGame['gameName'];
        this.id = dataGame['gameName'];
        Global.BundleLobby.load(dataGame['spinePath'], sp.SkeletonData, (finish, number) => {
        }, (err, skeData: sp.SkeletonData) => {
            if (err) {
                ////Utils.Log("Error load spine:", err);
                return;
            }
            this.animIcon.skeletonData = skeData;
            this.animIcon.setAnimation(0, dataGame['spineName'], true);
            this.animHot.node.active = dataGame['isHot'];
			
            if (dataGame['tabGame'] == "gamesport" || dataGame['tabGame'] == 'gamelive') {
										   
		   
                this.node.getChildByName('tagLive').active = true;
            } else {
                this.node.getChildByName('tagLive').active = false;
            }
			
            if (this.type != ItemGameType.SLOT && dataGame['gameName'] != "TAIXIU") {
										  
		   
                this.listLbJP.forEach((item) => {
                    item.node.active = false;
                })
            } else {
                this.listLbJP.forEach((item) => {
                    item.node.active = true;
                });
                this.listLbJP[0].node.active = !(this.id == "TAIXIU");
            }
            this.startEff();
        });
	  
																
        if (this.type == ItemGameType.SLOT || this.id == "TAIXIU") {//set lại jacpot khi scroll list game . luc moi vao game chua co jp tra ve tu sv thi fix tam 1 thang fake cho so n chay tam.
				  
									  
								  
					   
            let gameJP = App.instance.topHuData != null ? App.instance.topHuData : JSON.parse('{"audition":{"100":{"p":647800,"x2":0},"1000":{"p":6959900,"x2":0},"10000":{"p":98156097,"x2":0}},"spartan":{"100":{"p":990296,"x2":0},"1000":{"p":9262455,"x2":0},"10000":{"p":73706904,"x2":0}},"pokemon":{"100":{"p":941981,"x2":1},"1000":{"p":5422705,"x2":1},"10000":{"p":57632614,"x2":1}},"TAI_XIU":{"0":{"px":565528720},"1":{"pt":715173010}},"benley":{"100":{"p":847257,"x2":0},"1000":{"p":7578500,"x2":0},"10000":{"p":60157886,"x2":0}},"maybach":{"100":{"p":680396,"x2":0},"1000":{"p":8596872,"x2":0},"10000":{"p":102489756,"x2":0}},"tamhung":{"100":{"p":581493,"x2":0},"1000":{"p":7870119,"x2":0},"10000":{"p":58135430,"x2":0}},"chiemtinh":{"100":{"p":511617,"x2":0},"1000":{"p":10404550,"x2":0},"10000":{"p":98601297,"x2":0}},"bikini":{"100":{"p":624702,"x2":0},"1000":{"p":9707592,"x2":0},"10000":{"p":50503932,"x2":0}},"minipoker":{"100":{"p":173090,"x2":0},"1000":{"p":1052463,"x2":0},"10000":{"p":15795786,"x2":0}},"caothap":{"1000":{},"10000":{},"50000":{},"100000":{},"500000":{}},"rollRoye":{"100":{"p":862429,"x2":1},"1000":{"p":7136508,"x2":1},"10000":{"p":65412566,"x2":1}},"galaxy":{"100":{"p":829294,"x2":1},"1000":{"p":7155563,"x2":1},"10000":{"p":52915908,"x2":1}},"rangeRover":{"100":{"p":540443,"x2":0},"1000":{"p":8776494,"x2":0},"10000":{"p":53316396,"x2":0}}}');
			  
            let dataJP = [];
            let gameId = App.instance.getJPGameID(dataGame['gameName']);
            let itemJP100 = Object.create({});
            let itemJP1000 = Object.create({});
            let itemJP10000 = Object.create({});
            if (this.id == 'TAIXIU') {
                itemJP10000.number = gameJP[gameId]["1"]["pt"];
                itemJP10000.x2 = false;

                itemJP1000.number = gameJP[gameId]["0"]["px"];
                itemJP1000.x2 = false;

                itemJP100.number = 0;
                itemJP100.x2 = false
            } else {
                itemJP100.number = gameJP[gameId]["100"]["p"];
                itemJP100.x2 = gameJP[gameId]["100"]["x2"] == 1;

                itemJP1000.number = gameJP[gameId]["1000"]["p"];
                itemJP1000.x2 = gameJP[gameId]["1000"]["x2"] == 1;

                itemJP10000.number = gameJP[gameId]["10000"]["p"];
                itemJP10000.x2 = gameJP[gameId]["10000"]["x2"] == 1;
            }
            dataJP.push(itemJP100, itemJP1000, itemJP10000);
            this.setJackpot(dataJP);
            this.listLbJP[2].node.position = dataGame.hasOwnProperty('positionLbJP2') ? dataGame['positionLbJP2'] : cc.v2(8.2, -102);
								   
						   
            this.listLbJP[1].node.position = dataGame.hasOwnProperty('positionLbJP1') ? dataGame['positionLbJP1'] : cc.v2(5.4, -133);
        }
        if (dataGame.hasOwnProperty('comingSoon')) {
            this.animIcon.node.color = dataGame['comingSoon'] ? cc.Color.GRAY : cc.Color.WHITE;
            this.commingSoon = dataGame['comingSoon'];
        } else {
            this.commingSoon = false;
            this.animIcon.node.color = cc.Color.WHITE;
        }
    }
    startEff() {
        cc.Tween.stopAllByTarget(this.node);
        if (Global.LobbyController.tabsListGame.isShowStartEff) {
            cc.tween(this.node).set({ opacity: 0, scale: 0 }).to(0.1, { opacity: 255, scale: 1 }, { easing: cc.easing.sineOut }).start();
        }
        else {
            this.node.scale = 1.0;
            this.node.opacity = 255;
        }
    }
   
    reset() {
        this.animHot.node.active = false;
        this.animIcon.skeletonData = null;
        this.listLbJP.forEach((item) => {
            item.node.active = false;
        })
        this.node.getChildByName('tagLive').active = false;
        this.node.getChildByName("x2").active = false;
							
							  
    }
   
		   
									 
									  
									 
							   
	   
													   
												  
   
    setJackpot(data) {
        for (let i = 0, l = data.length; i < l; i++) {
            if (this.listLbJP.length > 0) {
                Tween.numberTo(this.listLbJP[i], data[i].number, 3.0);
            }
            if (data[i]['x2'] != 0) {
                this.node.getChildByName("x2").active = true;
            }
        }
    }
   
}
