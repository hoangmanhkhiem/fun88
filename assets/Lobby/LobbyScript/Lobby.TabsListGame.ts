//import Configs from "../../Loading/src/Configs";
//import { Global } from "../../Loading/src/Global";
//import ItemGame, { ItemGameType } from "./Lobby.ItemGame";
//import App from "./Script/common/App";
//import ScrollViewControl from "./Script/common/ScrollViewControl";
//import Utils from "./Script/common/Utils";
//
//
//const { ccclass, property } = cc._decorator;
//
//@ccclass("Lobby.TabsListGameTab")
//export class Tab {
//    @property(cc.Button)
//    button: cc.Button = null;
//    @property(cc.SpriteFrame)
//    sfNormal: cc.SpriteFrame = null;
//    @property(cc.SpriteFrame)
//    sfActive: cc.SpriteFrame = null;
//
//}
//
//@ccclass
//export default class TabsListGame extends cc.Component {
//
//    @property([Tab])
//    tabs: Tab[] = [];
//
//    @property([ItemGame])
//    itemGames: ItemGame[] = [];
//
//    @property(cc.Node)
//    contentIconGame: cc.Node = null;
//    private seletectIdx = 0;
//    @property(cc.ScrollView)
//    scrListGame: cc.ScrollView = null;
//
//    @property(ScrollViewControl)
//    scrGame: ScrollViewControl = null;
//    isShowStartEff: boolean = true;
//    currenListGame = [];
//    listGameConfig = [
//        {
//            listgame: [
//                {
//                    gameName: 'XOSO',
//                    spinePath: 'lote79/spineIcon/XoSo/xoso',
//                    spineName: 'animation',
//                    isSizeBig: true,
//                    isHot: true,
//                    position: cc.v2(3, -249),
//                    tabGame: 'gamefish',
//                 //   positionLbJP2: cc.v2(35, -82),
//                 //   positionLbJP1: cc.v2(-32, -129),
//                    comingSoon: false
//                }
//            ],
//            tabGame: "gamefish",
//            isBreakTab: false,
//            isSizeBig: true
//        },
//		{
//            listgame: [
//                {
//                    gameName: 'TAIXIU',
//                    spinePath: 'lote79/spineIcon/TAIXIU/Taixiu_icon',
//                    spineName: 'animation',
//                    isSizeBig: true,
//                    isHot: false,
//                    position: cc.v2(3, -244),
//                    tabGame: 'gamemini',
//                    positionLbJP2: cc.v2(35, -84),
//                    positionLbJP1: cc.v2(-32, -133),
//                    comingSoon: false
//                }
//            ],
//            tabGame: "gamemini",
//            isBreakTab: false,
//            isSizeBig: true
//        },
//		//{
//        //    listgame: [
//        //        {
//        //            gameName: 'MauBinh',
//        //            spinePath: 'lote79/spineIcon/TAIXIU/Taixiu_icon',
//        //            spineName: 'animation',
//        //            isSizeBig: true,
//        //            isHot: false,
//        //            position: cc.v2(3, -242),
//        //            tabGame: 'gamemini',
//        //            positionLbJP2: cc.v2(35, -82),
//        //            positionLbJP1: cc.v2(-32, -129),
//        //            comingSoon: false
//        //        }
//        //    ],
//        //    tabGame: "gamemini",
//        //    isBreakTab: false,
//        //    isSizeBig: true
//        //},
//        {
//            listgame: [
//                {
//                    gameName: 'FISH',
//                    spinePath: 'lote79/spineIcon/BANCA/Banca',
//                    spineName: 'animation vietnam',
//                    isSizeBig: true,
//                    isHot: true,
//                    position: cc.v2(-3, -238),
//                    tabGame: 'gamefish',
//                    comingSoon: false
//                }
//            ],
//            tabGame: "gamefish",
//            isBreakTab: false,
//            isSizeBig: true
//        },
//        {
//            listgame: [
//                {
//                    gameName: 'THANTAI',
//                    spinePath: 'lote79/spineIcon/THANTAI/ThanTai',
//                    spineName: 'animation vietnam',
//                    isSizeBig: true,
//                    isHot: false,
//                    position: cc.v2(-3.4, -254),
//                    tabGame: 'gameslot',
//                    comingSoon: false
//                }
//            ],
//            tabGame: "gameslot",
//            isBreakTab: false,
//            isSizeBig: true
//        },
//		{
//            listgame: [
//                {
//                    gameName: 'BACAY',
//                    spinePath: 'lote79/spineIcon/Bacay/bacay',
//                    spineName: 'animation vietnam',
//                    isSizeBig: false,
//                    isHot: false,
//                    position: cc.v2(0, -122),
//                    tabGame: 'gamecard',
//                    comingSoon: false
//                },
//                {
//                    gameName: 'TLMN',
//                    spinePath: 'lote79/spineIcon/TLMN/XocDia',
//                    spineName: 'animation vietnam',
//                    isSizeBig: false,
//                    isHot: false,
//                    position: cc.v2(1, -145),
//                    tabGame: 'gamecard',
//                    comingSoon: false
//                }
//            ],
//            tabGame: "gamecard",
//            isBreakTab: false,
//            isSizeBig: false
//        },
//		{
//            listgame: [
//                {
//                    gameName: 'MauBinh',
//                    spinePath: 'lote79/spineIcon/MauBinh/MauBinh',
//                    spineName: 'animation',
//                    isSizeBig: false,
//                    isHot: false,
//                    position: cc.v2(0, -124),
//                    tabGame: 'gamecard',
//                    comingSoon: false
//                },
//                {
//                    gameName: 'Lieng',
//                    spinePath: 'lote79/spineIcon/Lieng/Lieng',
//                    spineName: 'animation',
//                    isSizeBig: false,
//                    isHot: false, 
//                    position: cc.v2(1, -142),
//                    tabGame: 'gamecard',
//                    comingSoon: false
//                }
//            ],
//            tabGame: "gamecard",
//            isBreakTab: false,
//            isSizeBig: false
//        },
//		{
//            listgame: [
//                {
//                    gameName: 'BaiCao',
//                    spinePath: 'lote79/spineIcon/BaiCao/BaiCao',
//                    spineName: 'animation',
//                    isSizeBig: false,
//                    isHot: false,
//                    position: cc.v2(0, -130),
//                    tabGame: 'gamecard',
//                    comingSoon: false
//                },
//                { 
//                    gameName: 'Poker',
//                    spinePath: 'lote79/spineIcon/Poker/Poker',
//                    spineName: 'animation',
//                    isSizeBig: false,
//                    isHot: false, 
//                    position: cc.v2(1, -142),
//                    tabGame: 'gamecard',
//                    comingSoon: false
//                }
//            ],
//            tabGame: "gamecard",
//            isBreakTab: false,
//            isSizeBig: false
//        },
//        {
//            listgame: [
//                {
//                    gameName: 'BITCOIN',
//                    spinePath: 'lote79/spineIcon/CRYPTO/crypto',
//                    spineName: 'animation',
//                    isSizeBig: true,
//                    isHot: false,
//                    position: cc.v2(-7, -239),
//                    tabGame: 'gameslot',
//                    comingSoon: false
//                }
//            ],
//            tabGame: "gameslot",
//            isBreakTab: false,
//            isSizeBig: true
//        },
//        {
//            listgame: [
//                {
//                    gameName: 'DUAXE',
//                    spinePath: 'lote79/spineIcon/DuaXe/ic_sieuxe',
//                    spineName: 'animation vietnam',
//                    isSizeBig: true,
//                    isHot: false,
//                    position: cc.v2(0, -215),
//                    tabGame: 'gameslot',
//                    comingSoon: false
//                }
//            ],
//            tabGame: "gameslot",
//            isBreakTab: false,
//            isSizeBig: true
//        },
//        {
//            listgame: [
//                {
//                    gameName: 'THETHAO',
//                    spinePath: 'lote79/spineIcon/EURO/Euro',
//                    spineName: 'animation vietnam',
//                    isSizeBig: true,
//                    isHot: false,
//                    position: cc.v2(3.6, -237),
//                    tabGame: 'gameslot',
//                    comingSoon: false
//                }
//            ],
//            tabGame: "gameslot",
//            isBreakTab: false,
//            isSizeBig: true
//        },
//        {
//            listgame: [
//                {
//                    gameName: 'BIKINI',
//                    spinePath: 'lote79/spineIcon/Bikini/Bikini',
//                    spineName: 'animation',
//                    isSizeBig: true,
//                    isHot: false,
//                    position: cc.v2(-8, -302),
//                    tabGame: 'gameslot',
//                    comingSoon: false
//                }
//            ],
//            tabGame: "gameslot",
//            isBreakTab: false,
//            isSizeBig: true
//        },
//        {
//            listgame: [
//                {
//                    gameName: 'CHIEMTINH',
//                    spinePath: 'lote79/spineIcon/ChiemTinh/ic_chiemtinh',
//                    spineName: 'animation vietnam',
//                    isSizeBig: true,
//                    isHot: false,
//                    position: cc.v2(-2, -216),
//                    tabGame: 'gameslot',
//                    comingSoon: false
//                }
//            ],
//            tabGame: "gameslot",
//            isBreakTab: false,
//            isSizeBig: true
//        },
//		{
//            listgame: [
//                {
//                    gameName: 'BAUCUA',
//                    spinePath: 'lote79/spineIcon/BAUCUA/BauCua',
//                    spineName: 'animation vietnam',
//                    isSizeBig: false,
//                    isHot: false,
//                    position: cc.v2(-3, -129),
//                    tabGame: 'gamemini',
//                    comingSoon: false
//                },
//                {
//                    gameName: 'TAIXIUSIEUTOC',
//                    spinePath: 'lote79/spineIcon/TXST/ic_tx',
//                    spineName: 'animation',
//                    isSizeBig: false,
//                    isHot: false,
//                    position: cc.v2(-0.5, -7),
//                    tabGame: 'gamemini',
//					comingSoon: false
//                 //   comingSoon: cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS
//                }
//            ],
//            tabGame: "gamemini",
//            isBreakTab: false,
//            isSizeBig: false
//        },
//        {
//            listgame: [
//                {
//                    gameName: 'XOCDIA',
//                    spinePath: 'lote79/spineIcon/XocDiaMini/xocdia',
//                    spineName: 'animation',
//                    isSizeBig: true,
//                    isHot: false,
//                   // position: cc.v2(-0.5, -95),
//					position: cc.v2(-4.6, -224),
//                    tabGame: 'gamemini',
//                    comingSoon: false
//                }
//            ],
//            tabGame: "gamemini",
//            isBreakTab: false,
//            isSizeBig: true
//        },
//        {
//            listgame: [
//                {
//                    gameName: 'THANBAI',
//                    spinePath: 'lote79/spineIcon/ThanBai/anim_thanbai',
//                    spineName: 'animation vietnam',
//                    isSizeBig: true,
//                    isHot: false,
//                    position: cc.v2(-4.6, -216),
//                    tabGame: 'gameslot',
//                    comingSoon: false
//                }
//            ],
//            tabGame: "gameslot",
//            isBreakTab: false,
//            isSizeBig: true
//        },
//        {
//            listgame: [
//                {
//                    gameName: 'CHIMDIEN',
//                    spinePath: 'lote79/spineIcon/CHIMDIEN/Agrybird',
//                    spineName: 'animation',
//                    isSizeBig: true,
//                    isHot: false,
//                    position: cc.v2(-3, -216),
//                    tabGame: 'gameslot',
//                    comingSoon: false
//                }
//            ],
//            tabGame: "gameslot",
//            isBreakTab: false,
//            isSizeBig: true
//        },
//        
//        {
//            listgame: [
//                {
//                    gameName: 'GEM',
//                    spinePath: 'lote79/spineIcon/Gem/gem_lobby',
//                    spineName: 'animation',
//                    isSizeBig: false,
//                    isHot: false,
//                    position: cc.v2(-5, -93),
//                    tabGame: 'gamemini',
//                    comingSoon: false
//                },
//                {
//                    gameName: 'PIKACHU',
//                    spinePath: 'lote79/spineIcon/Xeng/Fruits',
//                    spineName: 'animation',
//                    isSizeBig: false,
//                    isHot: false,
//                    position: cc.v2(-3, -107),
//                    tabGame: 'gamemini',
//                    comingSoon: false
//                }
//            ],
//            tabGame: "gamemini",
//            isBreakTab: false,
//            isSizeBig: false
//        },
//        {
//            listgame: [
//                {
//                    gameName: 'MINIPOKER',
//                    spinePath: 'lote79/spineIcon/Minipoker/MiniPoker',
//                    spineName: 'animation',
//                    isSizeBig: false,
//                    isHot: false,
//                    position: cc.v2(-3, -134),
//                    tabGame: 'gamemini',
//                    comingSoon: false
//                },
//                {
//                    gameName: 'CAOTHAP',
//                    spinePath: 'lote79/spineIcon/CAOTHAP/CaoThap',
//                    spineName: 'animation vietnam',
//                    isSizeBig: false,
//                    isHot: false,
//                    position: cc.v2(-4, -129),
//                    tabGame: 'gamemini',
//                    comingSoon: false
//                }
//            ],
//            tabGame: "gamemini",
//            isBreakTab: false,
//            isSizeBig: false
//        },
//        
//        
//        {
//            listgame: [
//                {
//                    gameName: 'TLMNSOLO',
//                    spinePath: 'lote79/spineIcon/TLMNSOLO/TLMNsolo',
//                    spineName: 'animation vietam',
//                    isSizeBig: false,
//                    isHot: false,
//                    position: cc.v2(-1, -148),
//                    tabGame: 'gamecard',
//                    comingSoon: false
//                },
//                {
//                    gameName: 'SAM',
//                    spinePath: 'lote79/spineIcon/SAM/SAMLOC',
//                    spineName: 'animation vietnam',
//                    isSizeBig: false,
//                    isHot: false,
//                    position: cc.v2(-11, -123),
//                    tabGame: 'gamecard',
//                    comingSoon: false
//                }
//            ],
//            tabGame: "gamecard",
//            isBreakTab: false,
//            isSizeBig: false
//        },
//		{
//            listgame: [
//                {
//                    gameName: 'WM',
//                    spinePath: 'lote79/spineIcon/XocDiaWM/XocDia',
//                    spineName: 'animation3',
//                    isSizeBig: false,
//                    isHot: false,
//                    position: cc.v2(2, -176),
//                    tabGame: 'gamelive',
//                    comingSoon: true
//                },
//                {
//                    gameName: 'AG',
//                    spinePath: 'lote79/spineIcon/LIVEAG/livecasino2',
//                    spineName: 'animation',
//                    isSizeBig: false,
//                    isHot: false,
//                    position: cc.v2(80, -531.838),
//                    tabGame: 'gamelive',
//                    comingSoon: true
//                }
//            ],
//            tabGame: "gamelive",
//            isBreakTab: false,
//            isSizeBig: false,
//			comingSoon: true
//        },
//        {
//            listgame: [
//                {
//                    gameName: 'EBET',
//                    spinePath: 'lote79/spineIcon/EBET/Crypocopy6',
//                    spineName: 'animation',
//                    isSizeBig: false,
//                    isHot: true,
//                    position: cc.v2(-1, -89),
//                    tabGame: 'gamelive',
//                    comingSoon: true
//                },
//                {
//                    gameName: 'PRAGMATIC',
//                    spinePath: 'lote79/spineIcon/Pragmatic/skeleton',
//                    spineName: 'animation',
//                    isSizeBig: false,
//                    isHot: false,
//                    position: cc.v2(-6.3, -101),
//                    tabGame: 'gamelive',
//                    comingSoon: true,
//                },
//            ],
//            tabGame: "gamelive",
//            isBreakTab: false,
//            isSizeBig: false
//        }
//
//    ];
//    onLoad() {
//        this.scrListGame.getComponentInChildren(cc.Mask).enabled = true;
//        this.currenListGame = this.listGameConfig.slice();
//
//    }
//    start() {
//
//    }
//    initListGameConfig(data) {
//        for (let i = 0; i < this.listGameConfig.length; i++) {
//            let objGameItem = this.listGameConfig[i]['listgame'];
//            for (let j = 0; j < objGameItem.length; j++) {
//                let dataGameConfig = data[objGameItem[j]['gameName']];
//                objGameItem[j]['comingSoon'] = dataGameConfig['status'] == 0;
//            }
//        }
//        this.loadListGame();
//    }
//    loadListGame() {
//        this.scrGame.setDataList(this.setIconGameData.bind(this), this.currenListGame);
//        setTimeout(() => {
//            this.setJackpot();
//        }, 100);
//    }
//    setIconGameData(item, data) {
//        item.getChildByName("line_tab").active = data['isBreakTab'];
//        if (!data['isSizeBig']) {
//            for (let i = 0; i < data.listgame.length; i++) {
//                let dataGame = data.listgame[i];
//                let icGame = item.getChildByName('iconGame' + (i + 1)).getComponent(ItemGame);
//                icGame.setInfo(dataGame);
//                icGame.node.active = true;
//                if (!this.itemGames.includes(icGame))
//                    this.itemGames.push(icGame);
//            }
//            item.getChildByName('iconGameBig').active = false;
//        } else {
//            let iconGameBig = item.getChildByName('iconGameBig').getComponent(ItemGame);
//            if (!this.itemGames.includes(iconGameBig))
//                this.itemGames.push(iconGameBig);
//            iconGameBig.node.active = true;
//            let dataGame = data.listgame[0];
//            item.getChildByName('iconGame1').active = false;
//            item.getChildByName('iconGame2').active = false;
//            iconGameBig.setInfo(dataGame);
//        }
//    }
//    onScrollEvent() {
//        this.isShowStartEff = false;
//    }
//    updateSize(isHaveBanner) {
//        if (!isHaveBanner) {
//            this.scrListGame.node.width = 1250;
//            this.scrListGame.node.x = 0;
//            this.scrListGame.node.getChildByName("view").getComponent(cc.Widget).updateAlignment();
//        } else {
//            this.scrListGame.node.width = 994;
//            this.scrListGame.node.x = 140;
//            this.scrListGame.node.getChildByName("view").getComponent(cc.Widget).updateAlignment();
//        }
//    }
//    public changeTabGame(tab) {
//        this.isShowStartEff = true;
//        this.currenListGame = [];
//        if (tab == "gamelive") {
//            this.currenListGame = this.listGameConfig.slice();
//        } else {
//            let tabGameChoosen = [];
//            let tabGameLeft = [];
//            this.listGameConfig.forEach((data) => {
//                if (data['tabGame'] == tab) {
//                    tabGameChoosen.push(data);
//                } else {
//                    tabGameLeft.push(data);
//                }
//            });
//            this.currenListGame = tabGameChoosen.concat(tabGameLeft);
//        }
//        this.reset();
//        this.loadListGame();
//    }
//    reset() {
//        this.contentIconGame.children.forEach((item) => {
//            item.getChildByName('line_tab').active = false;
//        })
//        this.scrListGame.stopAutoScroll();
//        this.contentIconGame.x = -this.contentIconGame.parent.width / 2;
//    }
//
//    public getItemGameWithId(id: string): ItemGame {
//        for (let i = 0; i < this.itemGames.length; i++) {
//            if (this.itemGames[i].id == id) {
//                return this.itemGames[i];
//            }
//        }
//        return null;
//    }
//    setJackpot() {//update lại jackpot khi load lại item game;
//        if (Configs.Login.IsLogin && App.instance.topHuData != null) {
//            Global.LobbyController.handleUpdateJP();
//        } else {
//            App.instance.topHuData = JSON.parse('{"audition":{"100":{"p":647800,"x2":0},"1000":{"p":6959900,"x2":0},"10000":{"p":98156097,"x2":0}},"spartan":{"100":{"p":990296,"x2":0},"1000":{"p":9262455,"x2":0},"10000":{"p":73706904,"x2":0}},"pokemon":{"100":{"p":941981,"x2":1},"1000":{"p":5422705,"x2":1},"10000":{"p":57632614,"x2":1}},"TAI_XIU":{"0":{"px":565528720},"1":{"pt":715173010}},"benley":{"100":{"p":847257,"x2":0},"1000":{"p":7578500,"x2":0},"10000":{"p":60157886,"x2":0}},"maybach":{"100":{"p":680396,"x2":0},"1000":{"p":8596872,"x2":0},"10000":{"p":102489756,"x2":0}},"tamhung":{"100":{"p":581493,"x2":0},"1000":{"p":7870119,"x2":0},"10000":{"p":58135430,"x2":0}},"chiemtinh":{"100":{"p":511617,"x2":0},"1000":{"p":10404550,"x2":0},"10000":{"p":98601297,"x2":0}},"bikini":{"100":{"p":624702,"x2":0},"1000":{"p":9707592,"x2":0},"10000":{"p":50503932,"x2":0}},"minipoker":{"100":{"p":173090,"x2":0},"1000":{"p":1052463,"x2":0},"10000":{"p":15795786,"x2":0}},"caothap":{"1000":{},"10000":{},"50000":{},"100000":{},"500000":{}},"rollRoye":{"100":{"p":862429,"x2":1},"1000":{"p":7136508,"x2":1},"10000":{"p":65412566,"x2":1}},"galaxy":{"100":{"p":829294,"x2":1},"1000":{"p":7155563,"x2":1},"10000":{"p":52915908,"x2":1}},"rangeRover":{"100":{"p":540443,"x2":0},"1000":{"p":8776494,"x2":0},"10000":{"p":53316396,"x2":0}}}');
//            Global.LobbyController.handleUpdateJP();
//        }
//    }
//    public updateItemJackpots(id: string, j100: number, x2J100: boolean, j1000: number, x2J1000: boolean, j10000: number, x2J10000: boolean) {
//        let itemGame = this.getItemGameWithId(id);
//        if (itemGame != null) {
//            let listJP = [];
//            let dataJP100 = Object.create({});
//            dataJP100.number = j100;
//            dataJP100.x2 = x2J100;
//            listJP.push(dataJP100);
//
//            let dataJP1000 = Object.create({});
//            dataJP1000.number = j1000;
//            dataJP1000.x2 = x2J1000;
//            listJP.push(dataJP1000);
//
//            let dataJP10000 = Object.create({});
//            dataJP10000.number = j10000;
//            dataJP10000.x2 = x2J10000;
//            listJP.push(dataJP10000);
//            itemGame.setJackpot(listJP);
//        }
//    }
//    public onClickGame(even, data) {
//        //Utils.Log(data);
//        //Utils.Log('even.target.getComponent("Lobby.ItemGame").commingSoon:' + even.target.getComponent("Lobby.ItemGame").commingSoon);
//        if (even.target.getComponent("Lobby.ItemGame").commingSoon) {
//            Global.LobbyController.actComingSoon();
//            return;
//        }
//        switch (data) {
//            case "WM":
//                Global.LobbyController.actLoginWM();
//                break;
//            case "AG":
//                Global.LobbyController.actLoginAG();
//                break;
//            case "EBET":
//                Global.LobbyController.actLoginEbet();
//                break;
//            case "FISH":
//                Global.LobbyController.actGoToShootFish();
//                break;
//            case "IBC":
//                Global.LobbyController.actLoginIBC();
//                break;
//            case "SBO":
//                Global.LobbyController.actLoginSBO();
//                break;
//            case "CMD":
//                Global.LobbyController.actLoginCMD();
//                break;
//            case "THANBAI":
//                Global.LobbyController.actGoToSlot8();
//                break;
//            case "THANTAI":
//                Global.LobbyController.actGoToSlot3();
//                break;
//            case "CHIEMTINH":
//                Global.LobbyController.actGoToSlot6();
//                break;
//            case "BITCOIN":
//                Global.LobbyController.actGoToSlot7();
//                break;
//            case "BIKINI":
//                Global.LobbyController.actGoToSlot11();
//                break;
//            case "THETHAO":
//                Global.LobbyController.actGoToSlot10();
//                break;
//            case "CHIMDIEN":
//                Global.LobbyController.actGoToSlot4();
//                break;
//            case "DUAXE":
//                Global.LobbyController.actGoToSlot1();
//                break;
//            case "TAIXIU":
//                Global.LobbyController.actGameTaiXiu();
//                break;
//            case "MINIPOKER":
//                Global.LobbyController.actGameMiniPoker();
//                break;
//            case "BAUCUA":
//                Global.LobbyController.actGameBauCua();
//                break;
//            case "PIKACHU":
//                Global.LobbyController.actGameSlot3x3();
//                break;
//            case "GEM":
//                Global.LobbyController.actGameSlot3x3Gem();
//                break;
//            case "TAIXIUSIEUTOC":
//                Global.LobbyController.actGameTaiXiuSieuToc();
//                break;
//            case "CAOTHAP":
//                Global.LobbyController.actGameCaoThap();
//                break;
//            case "XOCDIA":
//                Global.LobbyController.actGoToXocDia();
//                break;
//            case "BACAY":
//                Global.LobbyController.actGoToBaCay();
//                break;
//			case "MauBinh":
//                Global.LobbyController.actGoToMauBinh();
//                break;
//			case "Lieng":
//                Global.LobbyController.actGoToLieng();
//                break;
//			case "Poker":
//                Global.LobbyController.actGoToPoker();
//                break;
//			case "BaiCao":
//                Global.LobbyController.actGoToBaiCao();
//                break;
//            case "TLMN":
//                Global.LobbyController.actGoToTLMN();
//                break;
//			case "SAM":
//                Global.LobbyController.actGoToSam();
//                break;
//            case "TLMNSOLO":
//                Global.LobbyController.actGameTLMNSolo();
//                break;
//			case "XOSO":
//                Global.LobbyController.actGotoLoto();
//                break;
//        }
//    }
//
//    // update (dt) {}
//}


import ItemGame, { ItemGameType } from "./Lobby.ItemGame";
import ItemSlotGame from "./Lobby.ItemSlotGame";
import Tween from "./Script/common/Tween";
import Utils from "./Script/common/Utils";


const { ccclass, property } = cc._decorator;

@ccclass("Lobby.TabsListGameTab")
export class Tab {
    @property(cc.Button)
    button: cc.Button = null;
    @property(cc.SpriteFrame)
    sfNormal: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sfActive: cc.SpriteFrame = null;


}

@ccclass
export default class TabsListGame extends cc.Component {

    @property([Tab])
    tabs: Tab[] = [];

    @property([ItemGame])
    itemGames: ItemGame[] = [];

    @property(cc.Node)
    contentIconGame: cc.Node = null;
    private seletectIdx = 0;
    @property(cc.ScrollView)
    scrListGame: cc.ScrollView = null;

    start() {
	/*
        this.contentIconGame.children.forEach((item) => {
            let posInWorld = this.contentIconGame.convertToWorldSpaceAR(item.getPosition());
            let posInView = this.contentIconGame.parent.convertToNodeSpaceAR(posInWorld);
            let deltaLeft = (-this.contentIconGame.parent.width / 2) - item.width / 2;
            let deltaRight = (this.contentIconGame.parent.width / 2) + item.width / 2;
            if (posInView.x < deltaLeft || posInView.x > deltaRight) {
                item.opacity = 0
            } else {
                item.opacity = 255;
            }
        })
		*/

    }
    onEnable() {
        var self = this;
        setTimeout(function () {
            cc.log(" vao day");
            self.onScrollEvent();
        }, 200);
    }
    onScrollEvent() {
	/*
        this.contentIconGame.children.forEach((item) => {
            let posInWorld = this.contentIconGame.convertToWorldSpaceAR(item.getPosition());
            let posInView = this.contentIconGame.parent.convertToNodeSpaceAR(posInWorld);
            let deltaLeft = (-this.contentIconGame.parent.width / 2) - item.width / 2;
            let deltaRight = (this.contentIconGame.parent.width / 2) + item.width / 2;
            if (posInView.x < deltaLeft || posInView.x > deltaRight) {
                item.opacity = 0
            } else {
                item.opacity = 255;
            }
        })
		*/
    }
    updateSize(isHaveBanner) {
        if (!isHaveBanner) {
            this.scrListGame.node.width = 1250;
            this.scrListGame.node.x = 0;
            this.scrListGame.node.getChildByName("view").getComponent(cc.Widget).updateAlignment();
            cc.log("updateSize khong co banner");
        } else {
            this.scrListGame.node.width = 994;
            this.scrListGame.node.x = 140;
            this.scrListGame.node.getChildByName("view").getComponent(cc.Widget).updateAlignment();
        }
    }
    private onTabChanged() {
        switch (this.seletectIdx) {
            case 0:
                for (let i = 0; i < this.itemGames.length; i++) {
                    if (this.itemGames[i] == null) continue;
                    this.itemGames[i].node.active = true;
                }
                break;
            case 1:
                for (let i = 0; i < this.itemGames.length; i++) {
                    if (this.itemGames[i] == null) continue;
                    this.itemGames[i].node.active = this.itemGames[i].type == ItemGameType.SLOT;
                }
                break;
            case 2:
                for (let i = 0; i < this.itemGames.length; i++) {
                    if (this.itemGames[i] == null) continue;
                    this.itemGames[i].node.active = this.itemGames[i].type == ItemGameType.CARD;
                }
                break;
        }
    }
    public changeTabGame() {
        let scrWidth = this.scrListGame.node.width;

        if (this.contentIconGame.width < scrWidth) {
            this.contentIconGame.x = 0;
        } else {
            this.contentIconGame.x = (scrWidth / 2) + ((this.contentIconGame.width / 2) - scrWidth);
        }
    }

    public getItemGameWithId(id: string): ItemSlotGame[] {
        var arr = [];
        for (let i = 0; i < this.itemGames.length; i++) {
            if (this.itemGames[i] == null) continue;
            if (this.itemGames[i].id == id) {
                arr.push(this.itemGames[i] as ItemSlotGame);
            }
        }
        return arr;
    }

    public updateItemJackpots(id: string, j100: number, x2J100: boolean, j1000: number, x2J1000: boolean, j10000: number, x2J10000: boolean) {
        let itemGame = this.getItemGameWithId(id);
        for (var i = 0; i < itemGame.length; i++) {

            // itemGame[i].lblJackpots[0].string = Utils.formatNumber(j100);
            // itemGame[i].lblJackpots[1].string = Utils.formatNumber(j1000);
            // itemGame[i].lblJackpots[2].string = Utils.formatNumber(j10000);

            Tween.numberTo(itemGame[i].lblJackpots[0], j100, 3)
            Tween.numberTo(itemGame[i].lblJackpots[1], j1000, 3)
            Tween.numberTo(itemGame[i].lblJackpots[2], j10000, 3)
            // itemGame[i].lblJackpots[1].string = Utils.formatNumber(j1000);
            // itemGame[i].lblJackpots[2].string = Utils.formatNumber(j10000);
        }
    }

    // update (dt) {}
}
