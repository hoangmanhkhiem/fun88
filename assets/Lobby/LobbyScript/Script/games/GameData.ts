export default class GameData {
    static instance: GameData;

    gameLogic = null;
    gameType = 0;
    moneyBetWinList = [];
    moneyBetXuList = [];
    configVinList = [];
    configXuList = [];
    configGameCoVin = [];
    configGameCoXu = [];
    save_BetVinList = [];
    save_BetXuList = [];
    xuTopServerWeekListMoney = [];
    xuTopServerAllListMoney = [];
    vinTopServerWeekListMoney = [];
    vinTopServerAllListMoney = [];
    xuTopServerWeekListNumber = [];
    xuTopServerAllListNumber = [];
    vinTopServerWeekListNumber = [];
    vinTopServerAllListNumber = [];
    topDayVin_money = [];
    topWeekVin_money = [];
    topMonthVin_money = [];
    topDayVin_number = [];
    topWeekVin_number = [];
    topMonthVin_number = [];
    topDayXu_money = [];
    topWeekXu_money = [];
    topMonthXu_money = [];
    topDayXu_number = [];
    topWeekXu_number = [];
    topMonthXu_number = [];
    vinCaoThuList = [];
    xuCaoThuList = [];
    maxPlayer = -1;
    RoomFind = [];
    fundVipMinRegis = null;
    ListRoomHavePass = [];
    ruleType = 0;
    openMoiChoi = !1;

    constructor() {
        this.gameLogic = null;
        this.gameType = 0;
        this.moneyBetWinList = [];
        this.moneyBetXuList = [];
        this.configVinList = [];
        this.configXuList = [];
        this.configGameCoVin = [];
        this.configGameCoXu = [];
        this.save_BetVinList = [];
        this.save_BetXuList = [];
        this.xuTopServerWeekListMoney = [];
        this.xuTopServerAllListMoney = [];
        this.vinTopServerWeekListMoney = [];
        this.vinTopServerAllListMoney = [];
        this.xuTopServerWeekListNumber = [];
        this.xuTopServerAllListNumber = [];
        this.vinTopServerWeekListNumber = [];
        this.vinTopServerAllListNumber = [];
        this.topDayVin_money = [];
        this.topWeekVin_money = [];
        this.topMonthVin_money = [];
        this.topDayVin_number = [];
        this.topWeekVin_number = [];
        this.topMonthVin_number = [];
        this.topDayXu_money = [];
        this.topWeekXu_money = [];
        this.topMonthXu_money = [];
        this.topDayXu_number = [];
        this.topWeekXu_number = [];
        this.topMonthXu_number = [];
        this.vinCaoThuList = [];
        this.xuCaoThuList = [];
        this.maxPlayer = -1;
        this.RoomFind = [];
        this.fundVipMinRegis = null;
        this.ListRoomHavePass = [];
        this.ruleType = 0;
        this.openMoiChoi = !1;
    }

    public static getInstance(): GameData {
        if (this.instance == null) {
            this.instance = new GameData();
        }
        return this.instance;
    }
}