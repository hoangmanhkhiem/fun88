import Utils from "./Script/common/Utils";
import InPacket from "./Script/networks/Network.InPacket";
import OutPacket from "./Script/networks/Network.OutPacket";
import Configs from "../../Loading/src/Configs";

/*name game :
  spartans-Thantai
  BENLEY:bitcoin
  audition:duaxe
  maybach:thethao
  tamhung:chimdien
  chiemtinh:chiemtinh
  RollRoyce:ThanBai
  */
export namespace cmd {
    export class Code {
        static readonly UPDATE_TIME_BUTTON = 2124;
        static readonly NOTIFY_MARQUEE = 20100;
        static readonly UPDATE_BIGWIN_JACKPOT_SLOT1 = 2010;//Duaxe
        static readonly UPDATE_BIGWIN_JACKPOT_SLOT3 = 12010;//than tai
        static readonly UPDATE_BIGWIN_JACKPOT_SLOT4 = 14010;//Chim Dien-tamhung
        static readonly UPDATE_BIGWIN_JACKPOT_SLOT5 = 6010;//chiemtinh
        static readonly UPDATE_BIGWIN_JACKPOT_SLOT7 = 4010;//Bitcoin
        static readonly UPDATE_BIGWIN_JACKPOT_SLOT8 = 5010;//ThanBai-RollRoyce
        static readonly UPDATE_BIGWIN_JACKPOT_SLOT10 = 3010;//Euro
        static readonly UPDATE_BIGWIN_JACKPOT_SLOT11 = 16010;//bikini
        static readonly UPDATE_BIGWIN_JACKPOT_MINIPOKER = 4010;
        static readonly UPDATE_BIGWIN_JACKPOT_SLOT3X3 = 7010;
        static readonly UPDATE_BIGWIN_JACKPOT_SLOT3x3GEM = 8010;
        static readonly INSERT_GIFTCODE = 20017;
        static readonly DEPOSIT_CARD = 20012;
        static readonly CHECK_NICKNAME_TRANSFER = 20018;
        static readonly SUBCRIBE_HALL_SLOT = 10001;
        static readonly UNSUBCRIBE_HALL_SLOT = 10002;
        static readonly UPDATE_JACKPOT_SLOTS = 10003;
        static readonly SPIN_LUCKY_WHEEL = 20042;
        static readonly GET_SECURITY_INFO = 20050;
        static readonly CHANGE_EMAIL = 20003;
        static readonly UPDATE_USER_INFO = 20002;
        static readonly GET_OTP = 20220;
        static readonly SEND_OTP = 20019;
        static readonly GET_LIST_QUEST = 21000;
        static readonly RECEIVE_LIST_QUEST = 21001;
        static readonly RESULT_ACTIVE_MOBILE = 20026;
        static readonly RESULT_ACTIVE_NEW_MOBILE = 20028;
        static readonly RESULT_CHANGE_MOBILE_ACTIVED = 20027;
        static readonly ACTIVE_PHONE = 20006;
        static readonly CHANGE_PHONE_NUMBER = 20007;
        static readonly TRANSFER_COIN = 20014;
        static readonly RESULT_TRANSFER_COIN = 20034;
        static readonly SAFES = 20009;
        static readonly RESULT_SAFES = 20029;
        static readonly CHANGE_PASSWORD = 20000;
        static readonly RESULT_CHANGE_PASSWORD = 20020;
        static readonly EXCHANGE_VIP_POINT = 20001;
        static readonly RESULT_EXCHANGE_VIP_POINT = 20021;
        static readonly UPDATE_JACKPOTS = 20101;
        static readonly SUBCRIBE_JACPORTS = 20102;
        static readonly UNSUBCRIBE_JACPORTS = 20103;
        static readonly GET_MONEY_USE = 20051;
        static readonly DEPOSIT_BANK = 20201;
        static readonly DEPOSIT_MOMO = 20202;
        static readonly LOGOUT = 2;
        static readonly LOGIN = 1;

        static readonly CASHOUT_CARD = 20211;
        static readonly CASHOUT_BANK = 20219;
        static readonly CASHOUT_MOMO = 20215;
        
        static readonly TX_SCRIBE = 2000;
        static readonly TX_GAME_INFO = 2111;
        static readonly TX_UPDATE_INFO = 2112;

        static readonly DEPOSIT_LIVECASIO = 20302;
        static readonly GET_BALANCE_LIVECASIO = 20300;
        static readonly GET_RUT_BALANCE_LIVECASIO = 20301;
        static readonly GET_LINK_LIVECASIO = 20303;

        static readonly TX_SCRIBE_MD5 = 22000;
        static readonly TX_GAME_INFO_MD5 = 22111;
        static readonly TX_UPDATE_INFO_MD5 = 22112;
        static readonly GET_LIST_BANK = 20204;
    }

    export class ReceiveUpdateTimeButton extends InPacket {
        remainTime = 0;
        bettingState = false;

        constructor(data: Uint8Array) {
            super(data);
            this.remainTime = this.getByte();
            this.bettingState = this.getBool();
        }
    }

    export class ReqInsertGiftcode extends OutPacket {
        constructor(code: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.INSERT_GIFTCODE);
            this.packHeader();
            this.putString(code);
            this.updateSize();
        }
    }

    export class ResInsertGiftcode extends InPacket {
        error = 0;
        currentMoneyVin = 0;
        currentMoneyXu = 0;
        moneyGiftCodeVin = 0;
        moneyGiftCodeXu = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.currentMoneyVin = this.getLong();
            this.currentMoneyXu = this.getLong();
            this.moneyGiftCodeVin = this.getLong();
            this.moneyGiftCodeXu = this.getLong();
        }
    }

    export class ReqDepositCard extends OutPacket {
        constructor(telcoId: number, serial: string, code: string, amount: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.DEPOSIT_CARD);
            this.packHeader();
            this.putByte(telcoId);
            this.putString(serial);
            this.putString(code);
            this.putString(amount);
            this.updateSize();
        }
    }
    export class ReqDepositBank extends OutPacket {
        constructor(bankNumber: string, amount: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.DEPOSIT_BANK);
            this.packHeader();
            this.putString(bankNumber)
            this.putLong(amount);
            this.updateSize();
        }
    }
    export class ResDepositBank extends InPacket {
        error = 0;
        currentMoney = 0;
        timeFail = 0;
        numFail = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.currentMoney = this.getLong();
            this.timeFail = this.getLong();
            this.numFail = this.getInt();
        }
    }
    export class ReqDepositMomo extends OutPacket {
        constructor(amount: number, phoneSent: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.DEPOSIT_MOMO);
            this.packHeader();

            this.putLong(amount);
            this.putString(phoneSent);
            this.updateSize();
        }
    }
    export class ResDepositMomo extends InPacket {
        error = 0;
        currentMoney = 0;
        timeFail = 0;
        numFail = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.currentMoney = this.getLong();
            this.timeFail = this.getLong();
            this.numFail = this.getInt();
        }
    }

    export class ResDepositCard extends InPacket {
        error = 0;
        currentMoney = 0;
        timeFail = 0;
        numFail = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.currentMoney = this.getLong();
            this.timeFail = this.getLong();
            this.numFail = this.getInt();
        }
    }

    export class ReqCheckNicknameTransfer extends OutPacket {
        constructor(nickname: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CHECK_NICKNAME_TRANSFER);
            this.packHeader();
            this.putString(nickname);
            this.updateSize();
        }
    }

    export class ResCheckNicknameTransfer extends InPacket {
        error = 0;
        type = 0;
        fee = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.type = this.getByte();
            this.fee = this.getByte();
        }
    }

    export class ReqSpinLuckyWheel extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SPIN_LUCKY_WHEEL);
            this.packHeader();
            this.updateSize();
        }
    }

    export class ResSpinLuckyWheel extends InPacket {
        error = 0;
        prizeVin = "";
        prizeXu = "";
        prizeSlot = "";
        remainCount = 0;
        currentMoneyVin = 0;
        currentMoneyXu = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.prizeVin = this.getString();
            this.prizeXu = this.getString();
            this.prizeSlot = this.getString();
            this.remainCount = this.getShort();
            this.currentMoneyVin = this.getLong();
            this.currentMoneyXu = this.getLong();
        }
    }

    export class ReqGetSecurityInfo extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.GET_SECURITY_INFO);
            this.packHeader();
            this.updateSize();
        }
    }

    export class ResGetListQuest extends InPacket {
        error = 0;
        bf = "";

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.bf = this.getString();

        }
    }

    export class ResReceiveListQuest extends InPacket {
        error = 0;
        isSuccess = false;
        currentMoney = 0;
        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.isSuccess = this.getBool();
            this.currentMoney = this.getLong();

        }
    }


    export class ResGetSecurityInfo extends InPacket {
        error = 0;
        username = "";
        cmt = "";
        email = "";
        mobile = "";
        isVerifyPhone = false;
        usertype = "";
        refferalCode = "";
        mobileSecure = 0;
        emailSecure = 0;
        appSecure = 0;
        loginSecure = 0;
        moneyLoginOtp = 0;
        moneyUse = 0;
        safe = 0;
        configGame = "";
        address = "";
        birthday = "";
        gender=true;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.username = this.getString();
            this.cmt = this.getString();
            this.email = this.getString();
            this.mobile = this.getString();
            this.isVerifyPhone = this.getBool();
            this.usertype = this.getString();
            this.refferalCode = this.getString();
            this.mobileSecure = this.getByte();
            this.emailSecure = this.getByte();
            this.appSecure = this.getByte();
            this.loginSecure = this.getByte();
            this.moneyLoginOtp = this.getLong();
            this.moneyUse = this.getLong();
            this.safe = this.getLong();
            this.configGame = this.getString();
            this.birthday = this.getString();
            this.address = this.getString();
            this.gender = this.getBool();
        }
    }

    export class ReqUpdateUserInfo extends OutPacket {
        constructor(mail: string, birthday: string, address: string,gender: number,refCode:string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.UPDATE_USER_INFO);
            this.packHeader();
            this.putString("");//cmt
            this.putString(mail);//mail
            this.putString(""); 
            this.putString(birthday);//birth
            this.putString(address);//address
            this.putInt(gender);
            this.putString(refCode);
            this.updateSize();
        }
    }
    export class ResUpdateUserInfo extends InPacket {
        error = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
        }
    }

    export class ReqGetOTP extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.GET_OTP);
            this.packHeader();
            this.updateSize();
        }
    }
    export class ResGetOTP extends InPacket {
        error = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
        }
    }

    export class ReqSendDiemDanh extends OutPacket {
        constructor(otp: string, type: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SEND_OTP);
            this.packHeader();
            this.putString(otp);
            this.putByte(type);//0: sms, 1: telegram
            this.updateSize();
        }
    }

    export class ReqGetListQuest extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.GET_LIST_QUEST);
            this.packHeader();
            this.updateSize();
        }
    }

    export class ReqReceiveQuest extends OutPacket {
        constructor(index) {
            super();
             ////Utils.Log("ReqReceiveQuest");
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.RECEIVE_LIST_QUEST);
            this.packHeader();
            this.putByte(index);
            this.updateSize();
        }
    }



    export class ReqSendOTP extends OutPacket {
        constructor(otp: string, type: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SEND_OTP);
            this.packHeader();
            this.putString(otp);
            this.putByte(type);//0: sms, 1: telegram
            this.updateSize();
        }
    }


    export class ResSendOTP extends InPacket {
        error = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
        }
    }

    export class ResResultActiveMobie extends InPacket {
        error = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
        }
    }

    export class ResResultActiveNewMobie extends InPacket {
        error = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
        }
    }

    export class ReqChangePhoneNumber extends OutPacket {
        constructor(phoneNumber: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CHANGE_PHONE_NUMBER);
            this.packHeader();
            this.putString(phoneNumber);
            this.updateSize();
        }
    }
    export class ResChangePhoneNumber extends InPacket {
        error = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
        }
    }

    export class ReqActivePhone extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.ACTIVE_PHONE);
            this.packHeader();
            this.updateSize();
        }
    }
    export class ResActivePhone extends InPacket {
        error = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
        }
    }

    export class ReqTransferCoin extends OutPacket {
        constructor(nickname: string, coin: number, note: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.TRANSFER_COIN);
            this.packHeader();
            this.putString(nickname);
            this.putLong(coin);
            this.putString(unescape(encodeURIComponent(note)));
            this.updateSize();
        }
    }
    export class ResTransferCoin extends InPacket {
        error = 0;
        moneyUse = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.moneyUse = this.getLong();
        }
    }
    export class ResResultTransferCoin extends InPacket {
        error = 0;
        moneyUse = 0;
        currentMoney = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.moneyUse = this.getLong();
            this.currentMoney = this.getLong();
        }
    }

    export class ReqSafes extends OutPacket {
        constructor(coin: number, action: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SAFES);
            this.packHeader();
            this.putByte(action);//0: rút, 1: nạp
            this.putLong(coin);
            this.updateSize();
        }
    }
    export class ResSafes extends InPacket {
        error = 0;
        moneyUse = 0;
        safe = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.moneyUse = this.getLong();
            this.safe = this.getLong();
        }
    }
    export class ResResultSafes extends InPacket {
        error = 0;
        moneyUse = 0;
        safe = 0;
        currentMoney = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.moneyUse = this.getLong();
            this.safe = this.getLong();
            this.currentMoney = this.getLong();
        }
    }

    export class ReqChangePassword extends OutPacket {
        constructor(oldPassword: string, newPassword: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CHANGE_PASSWORD);
            this.packHeader();
            this.putString(md5(oldPassword));
            this.putString(md5(newPassword));
            this.updateSize();
        }
    }
    export class ResChangePassword extends InPacket {
        error = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
        }
    }
    export class ResResultChangePassword extends InPacket {
        error = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
        }
    }

    export class ReqExchangeVipPoint extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.EXCHANGE_VIP_POINT);
            this.packHeader();
            this.updateSize();
        }
    }
    export class ResExchangeVipPoint extends InPacket {
        error = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
        }
    }
    export class ResResultExchangeVipPoint extends InPacket {
        error = 0;
        currentMoney = 0;
        moneyAdd = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.currentMoney = this.getLong();
            this.moneyAdd = this.getLong()
        }
    }

    export class ResNotifyMarquee extends InPacket {
        message = "";

        constructor(data: Uint8Array) {
            super(data);
            this.message = this.getString();
        }
    }

    export class ResNotifyJackpot extends InPacket {
        username = "";
        type = 0;
        betValue = 0;
        totalPrizes = 0;
        timestamp = "";


        constructor(data: Uint8Array) {
            super(data);
            this.username = this.getString();
            this.type = this.getByte();
            this.betValue = this.getShort();
            this.totalPrizes = this.getLong();
            this.timestamp = this.getString();
        }
    }

    export class ReqSubcribeJackpots extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SUBCRIBE_JACPORTS);
            this.packHeader();
            this.updateSize();
        }
    }
    export class ReqUnSubcribeJackpots extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.UNSUBCRIBE_JACPORTS);
            this.packHeader();
            this.updateSize();
        }
    }
    export class ResUpdateJackpots extends InPacket {
        miniPoker100 = 0;
        miniPoker1000 = 0;
        miniPoker10000 = 0;
        pokeGo100 = 0;
        pokeGo1000 = 0;
        pokeGo10000 = 0;
        khoBau100 = 0;
        khoBau1000 = 0;
        khoBau10000 = 0;
        NDV100 = 0;
        NDV1000 = 0;
        NDV10000 = 0;
        Avengers100 = 0;
        Avengers1000 = 0;
        Avengers10000 = 0;
        Vqv100 = 0;
        Vqv1000 = 0;
        Vqv10000 = 0;
        fish100 = 0;
        fish1000 = 0;

        //spartan
        spartan100 = 0;
        spartan1000 = 0;
        spartan5000 = 0;
        spartan10000 = 0;
        constructor(data: Uint8Array) {
            super(data);
            this.miniPoker100 = this.getLong();
            this.miniPoker1000 = this.getLong();
            this.miniPoker10000 = this.getLong();
            this.pokeGo100 = this.getLong();
            this.pokeGo1000 = this.getLong();
            this.pokeGo10000 = this.getLong();
            this.khoBau100 = this.getLong();
            this.khoBau1000 = this.getLong();
            this.khoBau10000 = this.getLong();
            this.NDV100 = this.getLong();
            this.NDV1000 = this.getLong();
            this.NDV10000 = this.getLong();
            this.Avengers100 = this.getLong();
            this.Avengers1000 = this.getLong();
            this.Avengers10000 = this.getLong();
            this.Vqv100 = this.getLong();
            this.Vqv1000 = this.getLong();
            this.Vqv10000 = this.getLong();
            this.fish100 = this.getLong();
            this.fish1000 = this.getLong();
            //spartan game
            this.spartan100 = this.getLong();
            this.spartan1000 = this.getLong();
            this.spartan5000 = this.getLong();
            this.spartan10000 = this.getLong();

        }
    }
    export class ReqGetMoneyUse extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.GET_MONEY_USE);
            this.packHeader();
            this.updateSize();
        }
    }
    export class ResGetMoneyUse extends InPacket {
        moneyUse = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.moneyUse = this.getLong();
        }
    }



    //slot
    export class ReqSubcribeHallSlot extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.SUBCRIBE_HALL_SLOT);
            this.packHeader();
            this.updateSize();
        }
    }
    export class ReqUnSubcribeHallSlot extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.UNSUBCRIBE_HALL_SLOT);
            this.packHeader();
            this.updateSize();
        }
    }
    export class ResUpdateJackpotSlots extends InPacket {
        pots = "";

        constructor(data: Uint8Array) {
            super(data);
            this.pots = this.getString()
        }
    }

    // cashout class

    export class ReqCashoutCard extends OutPacket {
        constructor(telcoId: string, amount: number, quantity: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CASHOUT_CARD);
            this.packHeader();

            this.putString(telcoId);
            this.putInt(amount);
            this.putInt(quantity);
            this.updateSize();
        }
    }

    export class ResCashoutCard extends InPacket {
        error = 0;
        currentMoney = 0;
        listCard = "";

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.currentMoney = this.getLong();
            this.listCard = this.getString();
        }
    }

    export class ReqCashoutBank extends OutPacket {
        constructor(bankName: string, bankNumber: string, bankActName: string, amount: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CASHOUT_BANK);
            this.packHeader();

            this.putString(bankName);
            this.putString(bankNumber);
            this.putString(bankActName);
            this.putInt(amount);
            this.updateSize();
        }
    }

    export class ResCashoutBank extends InPacket {
        error = 0;
        currentMoney = 0;
        //listCard = "";

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.currentMoney = this.getLong();
            //this.listCard = this.getString();
        }
    }

    export class ReqCashoutMomo extends OutPacket {
        constructor(phoneNumber: string, amount: number) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CASHOUT_MOMO);
            this.packHeader();

            this.putString(phoneNumber);
            this.putInt(amount);
            this.updateSize();
        }
    }

    export class ResCashoutMomo extends InPacket {
        error = 0;
        currentMoney = 0;
        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.currentMoney = this.getLong();

        }
    }
    export class ReqChangeEmail extends OutPacket {
        constructor(email: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.CHANGE_EMAIL);
            this.packHeader();
            this.putString(email);
            this.updateSize();
        }
    }
    export class ResChangeEmail extends InPacket {
        error = 0;
        email = "";
        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.email = this.getString();

        }
    }
    export class ResLogin extends InPacket {
        loginData: string;

        constructor(data: Uint8Array) {
            super(data);
             ////Utils.Log("data====", data);
            this.loginData = this.getString();
             ////Utils.Log("loginData====", this.loginData);
        }
    }

    export class ReqDepositLive extends OutPacket {
        constructor(amount: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.DEPOSIT_LIVECASIO);
            this.packHeader();
            this.putString(amount);
            this.updateSize();
        }
    }

    export class ResDepositLiveCasino extends InPacket {
        error = 0;
        amount = "";

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.amount = this.getString();
        }
    }

    export class ReqGetBalanceLive extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.GET_BALANCE_LIVECASIO);
            this.packHeader();
            this.updateSize();
        }
    }

    export class ResGetBalanceLive extends InPacket {
        error = 0;
        balance = "";

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.balance = this.getString();
        }
    }

    export class ReqGetLinkLive extends OutPacket {
    
        constructor(platform : string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.GET_LINK_LIVECASIO);
            this.packHeader();
            this.putString(platform);
            this.putString("SEX001");
            this.updateSize();
        }
    }

    export class ResGetLinkLive extends InPacket {
        error = 0;
        gameUrl = "";

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.gameUrl = this.getString();
        }
    }

    export class ReqRutBalanceLive extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.GET_RUT_BALANCE_LIVECASIO);
            this.packHeader();
            this.updateSize();
        }
    }

    export class ResRutBalanceLive extends InPacket {
        error = 0;
        balance = "";
        amount = "";

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.balance = this.getString();
            this.amount = this.getString();
        }
    }

    export class ReqDepositMomoQR extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.DEPOSIT_MOMO);
            this.packHeader();
            this.updateSize();
        }
    }
    export class ResDepositMomoQR extends InPacket {
        error = 0;
        data = "";

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.data = this.getString();
        }
    }

    export class SendScribe extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.TX_SCRIBE);
            this.packHeader();
            this.putShort(Configs.GameId.TaiXiu);
            this.putShort(Configs.App.MONEY_TYPE);
            this.updateSize();
        }
    }

    export class TXGameInfo extends InPacket {
        gameId = 0;
        moneyType = 0;
        referenceId = 0;
        remainTime = 0;
        bettingState = false;
        potTai = 0;
        potXiu = 0;
        betTai = 0;
        betXiu = 0;
        dice1 = 0;
        dice2 = 0;
        dice3 = 0;
        remainTimeRutLoc = 0;
        jpTai = 0;
        jpXiu = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.gameId = this.getShort();
            this.moneyType = this.getShort();
            this.referenceId = this.getLong();
            this.remainTime = this.getShort();
            this.bettingState = this.getBool();
            this.potTai = this.getLong();
            this.potXiu = this.getLong();
            this.betTai = this.getLong();
            this.betXiu = this.getLong();
            this.dice1 = this.getShort();
            this.dice2 = this.getShort();
            this.dice3 = this.getShort();
            this.remainTimeRutLoc = this.getShort();
            this.jpTai = this.getLong();
            this.jpXiu = this.getLong();
        }
    }

    export class TXUpdateTime extends InPacket {
        remainTime = 0;
        bettingState = false;
        potTai = 0;
        potXiu = 0;
        numBetTai = 0;
        numBetXiu = 0;
        fundJpTai = 0;
        fundJpXiu = 0;

        constructor(data: Uint8Array) {
            super(data);
            this.remainTime = this.getShort();
            this.bettingState = this.getBool();
            this.potTai = this.getLong();
            this.potXiu = this.getLong();
            this.numBetTai = this.getShort();
            this.numBetXiu = this.getShort();
            this.fundJpTai = this.getLong();
            this.fundJpXiu = this.getLong();
        }
    }

    export class SendScribeTxMd5 extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.TX_SCRIBE_MD5);
            this.packHeader();
            this.putShort(Configs.GameId.TaiXiuMD5);
            this.putShort(Configs.App.MONEY_TYPE);
            this.updateSize();
        }
    }

    export class ReqListBank extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.GET_LIST_BANK);
            this.packHeader();
            this.updateSize();
        }
    }
    export class ResListBank extends InPacket {
        error = 0;
        list_bank = "";

        constructor(data: Uint8Array) {
            super(data);
            this.error = this.getError();
            this.list_bank = this.getString();
        }
    }
}

export default cmd;
