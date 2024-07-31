import GameIconJackpot from "./GameIconJackpot";
import ItemGame from "./Lobby.ItemGame";


const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemSlotGame extends ItemGame {
    @property(GameIconJackpot)
    gameIconJackpot:GameIconJackpot = null;
    @property([cc.Label])
    lblJackpots: cc.Label[] = [];
    @property
    fakeJackpot: boolean = false;
    @property(cc.Node)
    nodeX2:cc.Node = null;
    
    private jackpot0 = 0;
    private jackpotMax0 = 0;
    private jackpot1 = 0;
    private jackpotMax1 = 0;
    private jackpot2 = 0;
    private jackpotMax2 = 0;
    private updateNext0 = 0;
    private updateNext1 = 0;
    private updateNext2 = 0;

    start() {
       
    }

  
}
