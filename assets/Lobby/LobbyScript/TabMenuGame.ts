

import TabsListGame from "./Lobby.TabsListGame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TabMenuGame extends cc.Component {


    @property([cc.Node])
    listTab: cc.Node[] = [];

    @property([cc.Toggle])
    listToggle: cc.Toggle[] = [];

    @property([cc.Node])
    listAllGame: cc.Node[] = [];
    @property([cc.Node])
    listLiveGame: cc.Node[] = [];
    @property([cc.Node])
    listSlotGame: cc.Node[] = [];
    @property([cc.Node])
    listCardGame: cc.Node[] = [];
    @property([cc.Node])
    listMiniGame: cc.Node[] = [];
    @property([cc.Node])
    listGameSport: cc.Node[] = [];
    @property(TabsListGame)
    tabListGame: TabsListGame = null;

    startIdxs: number[] = [];

    onLoad() {
        this.listAllGame.forEach(e => {
            if (e) {
                this.startIdxs.push(e.getSiblingIndex());
            }
        });
    }

    onBtnTabAll() {
        for (let i = 0; i < this.listAllGame.length; i++) {
            if (this.listAllGame[i]) {
                this.listAllGame[i].active = true;
                this.listAllGame[i].setSiblingIndex(this.startIdxs[i]);
            }
        }
    }

    onBtnTabSport() {
        this.listAllGame.forEach(e => {
            if (e) e.active = false;
        });
        let idx = 0;
        this.listGameSport.forEach(e => {
            if (e) {
                e.active = true;
                e.setSiblingIndex(idx++);
            }
        });
    }

    onBtnTabLive() {
        this.listAllGame.forEach(e => {
            if (e) e.active = false;
        });
        let idx = 0;
        this.listLiveGame.forEach(e => {
            if (e) {
                e.active = true;
                e.setSiblingIndex(idx++);
            }
        });
    }

    onBtnTabSlot() {
        this.listAllGame.forEach(e => {
            if (e) e.active = false;
        });
        let idx = 0;
        this.listSlotGame.forEach(e => {
            if (e) {
                e.active = true;
                e.setSiblingIndex(idx++);
            }
        });
    }

    onBtnTabMini() {
        this.listAllGame.forEach(e => {
            if (e) e.active = false;
        });
        let idx = 0;
        this.listMiniGame.forEach(e => {
            if (e) {
                e.active = true;
                e.setSiblingIndex(idx++);
            }
        });
    }

    onBtnTabCard() {
        this.listAllGame.forEach(e => {
            if (e) {
                e.active = true;
                e.setSiblingIndex(idx++);
            }
        });
        let idx = 0;
        this.listCardGame.forEach(e => {
            if (e) {
                e.active = true;
                e.setSiblingIndex(idx++);
            }
        });
    }
    
    onBtnTabFish() {
        let idx = 0;
        this.listAllGame.forEach(e => {
            if (e) {
                e.active = true;
                e.setSiblingIndex(idx++);
            }
        });
    }
}
