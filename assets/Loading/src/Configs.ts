//import SPUtils from "../../Lobby/LobbyScript/Script/common/SPUtils";
import VersionConfig from "./VersionConfig";
import Http from "./Http";
namespace Configs {
    export class Login {
        static UserId: number = 0;
        static Username: string = "";
        static Password: string = "";
        static Nickname: string = "";
        static Avatar: string = "";
        static Coin: number = 0;
        static IsLogin: boolean = false;
        static AccessToken: string = "";
        static AccessToken2: string = "";
        static AccessTokenSockJs: string = "";
        static AccessTokenFB: string = "";
        static FacebookID: string = "";
        static SessionKey: string = "";
        static LuckyWheel: number = 0;
        static CreateTime: string = "";
        static Birthday: string = "";
        static IpAddress: string = "";
        static VipPoint: number = 0;
        static Address: string = "";
        static VipPointSave: number = 0;
        static Mail: string = "";
        static Gender: boolean = true;
        static RefferalCode: string = ""
        static VerifyMobile: boolean = false;

        static CoinFish: number = 0;
        static UserIdFish: number = 0;
        static UsernameFish: string = "";
        static PasswordFish: string = "";
        static FishConfigs: any = null;
        static BitcoinToken: string = "";
        static Currency: "vin";
        static UserType: string = "0";

        static ListBankRut = null;
        static ListPayment = null;
        static ClickPayPayment = null;

        static CACHE_AG = false;
        static CACHE_IBC = false;
        static CACHE_WM = false;

        static ListMail = null;
        static clear() {
            this.UserId = 0;
            this.Username = "";
            this.Password = "";
            this.Nickname = "";
            this.Avatar = "";
            this.Mail = "";
            this.Coin = 0;
            this.IsLogin = false;
            this.AccessToken = "";
            this.AccessToken2 = "";
			this.SessionKeyV8 = "";
            this.AccessTokenSockJs = "";
            this.SessionKey = "";
            this.CreateTime = "";
            this.Birthday = "";
            this.IpAddress = "";
            this.VipPoint = 0;
            this.VipPointSave = 0;
            this.CoinFish = 0;
            this.UserIdFish = 0;
            this.UsernameFish = "";
            this.PasswordFish = "";
            this.BitcoinToken = "";
         //    SPUtils.setUserPass("");
        }

        static readonly VipPoints = [80, 800, 4500, 8600, 12000, 50000, 1000000, 2000000, 5000000];
        static readonly VipPointsName = ["Đá", "Đồng", "Bạc", "Vàng", "BK1", "BK2", "KC1", "KC2", "KC3"];
        static getVipPointName(): string {
            for (let i = this.VipPoints.length - 1; i >= 0; i--) {
                if (Configs.Login.VipPoint > this.VipPoints[i]) {
                    return this.VipPointsName[i + 1];
                }
            }
            return this.VipPointsName[0];
        }

        static GetListMailNew() {
            if (this.ListMail == null || this.ListMail.length == 0) {
                return 0;
            }
            var number = 0;
            for (var i = 0; i < this.ListMail.length; i++) {
                if (this.ListMail[i].status == 0) {
                    number++;
                }
            }
            return number;
        }
        static getVipPointNextLevel(): number {
            for (let i = this.VipPoints.length - 1; i >= 0; i--) {
                if (Configs.Login.VipPoint > this.VipPoints[i]) {
                    if (i == this.VipPoints.length - 1) {
                        return this.VipPoints[i];
                    }
                    return this.VipPoints[i + 1];
                }
            }
            return this.VipPoints[0];
        }
        static getVipPointIndex(): number {
            for (let i = this.VipPoints.length - 1; i >= 0; i--) {
                if (Configs.Login.VipPoint > this.VipPoints[i]) {
                    return i;
                }
            }
            return 0;
        }
    }

    export class App {
        // 43.128.27.35
        public static IS_LOCAL = true;
        public static IS_PRO = true;
        static API: string = "https://iportal.go88s.fun/api";
		static API2: string = "https://iportal2.go88s.fun/api";
		static APIROY: string = "https://portal.go88s.fun/api";
        static API_PAYIN_PAYWELL_BANKS: string = "https://iportal.eloras.icu/api/payin/paywell/banks";
        static MONEY_TYPE = 1;
        static LINK_DOWNLOAD = "https://go88s.fun/app/";
        static LINK_EVENT = "https://eloras.icu/event";
        static LINK_SUPPORT = "https://eloras.icu";
        static USE_WSS = false;
        static LINK_GROUP = "/chat/";
        static FB_APPID = "758971848112749";
        static AGENCY_CODE = "";
		static options = {
            rememberUpgrade:true,
            transports: ['websocket'],
            secure:true, 
            rejectUnauthorized: false,
            reconnection: true,
            autoConnect: true,
            auth:{
                token:"WERTWER34534FGHFGBFVBCF345234XCVASD"
            }
        }
        static VERSION_APP = "1.0.0"

        static GameName = {
            110: "Đua Xe",
            170: "Crypto",
            2: "Tài Xỉu",
            5: "Xèng",
            11: "Tiến Lên",
            160: "Ngũ Long", // chimdien
            120: "Thần Tài",
            150: "Sơn Tinh", // The thao
            1: "MiniPoker",
            3: "Bầu Cua",
            9: "Ba Cây",
            4: "Cao Thấp",
            191: "Ăn Khế", // chiemtinh
            190: "Tài Xỉu Siêu Tốc",
            12: "Xóc Đĩa",
            180: "Tú Linh", // thanbai
            197: "Tây Du Ký", // bikini
            198: "Kim Cương",
        }
        static readonly HOST_MINIGAME = {

            host: "",
            port: 443
        };
		static readonly HOST_MINIGAME2 = {

            host: "",
            port: 443
        };
        static readonly HOST_TAI_XIU_MINI2 = {

            host: "",
            port: 443
        };
        static readonly HOST_SLOT = {

            host: "",
            port: 443
        };
        static readonly HOST_TLMN = {

            host: "",
            port: 443
        };
        static readonly HOST_SHOOT_FISH = {

            host: "",
            port: 443
        };
        static readonly HOST_SAM = {
            host: "",

            port: 443
        };
        static readonly HOST_XOCDIA = {
            host: "",
            port: 443
        };
        static readonly HOST_BACAY = {
            host: "",
            port: 443
        };
        static readonly HOST_BAICAO = {
            host: "",
            port: 443
        };
        static readonly HOST_POKER = {
            host: "",
            port: 443
        };
        static readonly HOST_XIDACH = {
            host: "",
            port: 443
        };
        static readonly HOST_BINH = {
            host: "",
            port: 443
        };
        static readonly HOST_LIENG = {
            host: "",
            port: 443
        };
        static readonly SERVER_CONFIG = {
            ratioNapThe: 1,
            ratioNapMomo: 1.2,
            ratioTransfer: 0.98,
            ratioTransferDL: 1,
            listTenNhaMang: ["Viettel", "Vinaphone", "Mobifone", "Vietnamobile"],
            listIdNhaMang: [0, 1, 2, 3],
            listMenhGiaNapThe: [10000, 20000, 30000, 50000, 100000, 200000, 500000],
            ratioRutThe: 1.2
        };
        static readonly CASHOUT_CARD_CONFIG = {
            listTenNhaMang: ["Viettel", "Vinaphone", "Mobifone", "Vietnamobile", "Garena", "Vcoin", "FPT Gate", "Mobi Data"],
            listIdNhaMang: ["VTT", "VNP", "VMS", "VNM", "GAR", "VTC", "FPT", "DBM"],
            listMenhGiaNapThe: [10000, 100000, 200000, 500000],
            listQuantity: ["1", "2", "3"]
        }
        static readonly HOST_SOCKJS = "https://st.go88s.fun/";
        static readonly SOCKJS_LOGIN = "websocket/ws-taixiu";
        // static readonly SOCKJS_LOGIN = "websocket/ws-minigame";
        static readonly TXST_SUB_TOPIC = "/topic/tx";

        static readonly nameKeyBank = { "VCB": 0, "TCB": 1, "VIB": 2, "VPB": 3 };
        static BILLING_CONF: any;

        static getServerConfig() {
        }

        static getPlatformName() {
            if (cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID) return "android";
            if (cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS) return "ios";
            return "web";
        }

        static getLinkFanpage() {
            switch (VersionConfig.CPName) {
                default:
                    return "/chat/";
            }
        }

        static getLinkTelegram() {
            switch (VersionConfig.CPName) {
                default:
                    return "OTPBOTGAME_BOT";
            }
        }

        static getLinkTelegramGroup() {
            switch (VersionConfig.CPName) {
                default:
                    return "/chat/";
            }
        }

        static init() {
            //  cc.log("init config vao day casi sakdjas");
            switch (VersionConfig.ENV) {

                case VersionConfig.ENV_DEV:
                    this.USE_WSS = true;

                    this.API = "https://iportal." + VersionConfig.DOMAIN_DEV + "/api";
                    this.MONEY_TYPE = 1;
                    this.LINK_DOWNLOAD = "https://" + VersionConfig.DOMAIN_DEV + "";
                    this.LINK_EVENT = "https://" + VersionConfig.DOMAIN_DEV + "/event";

                    this.HOST_MINIGAME.host = "wmini." + VersionConfig.DOMAIN_DEV + "";
					this.HOST_MINIGAME2.host = "wmini2." + VersionConfig.DOMAIN_DEV + "";
                    this.HOST_TAI_XIU_MINI2.host = "overunder." + VersionConfig.DOMAIN_DEV + "";
                    this.HOST_SLOT.host = "wslot." + VersionConfig.DOMAIN_DEV + "";
                    this.HOST_TLMN.host = "wtlmn." + VersionConfig.DOMAIN_DEV + "";
                    this.HOST_SHOOT_FISH.host = "wbanca." + VersionConfig.DOMAIN_DEV + "";
                    this.HOST_SAM.host = "wsam." + VersionConfig.DOMAIN_DEV + "";
                    this.HOST_XOCDIA.host = "wxocdia." + VersionConfig.DOMAIN_DEV + "";
                    this.HOST_BACAY.host = "wbacay." + VersionConfig.DOMAIN_DEV + "";
                    this.HOST_BAICAO.host = "wbaicao." + VersionConfig.DOMAIN_DEV + "";
                    this.HOST_POKER.host = "wpoker." + VersionConfig.DOMAIN_DEV + "";
                    this.HOST_XIDACH.host = "wxizach." + VersionConfig.DOMAIN_DEV + "";
                    this.HOST_BINH.host = "wbinh." + VersionConfig.DOMAIN_DEV + "";
                    this.HOST_LIENG.host = "wlieng." + VersionConfig.DOMAIN_DEV + "";
                    //  cc.log(VersionConfig.ENV);
                    break;
                case VersionConfig.ENV_PROD:
                    this.USE_WSS = true;

                    this.API = "https://iportal." + VersionConfig.DOMAIN_PRO + "/api";
                    this.MONEY_TYPE = 1;
                    this.LINK_DOWNLOAD = "https://" + VersionConfig.DOMAIN_PRO + "";
                    this.LINK_EVENT = "https://" + VersionConfig.DOMAIN_PRO + "/event";

                    this.HOST_MINIGAME.host = "wmini." + VersionConfig.DOMAIN_PRO + "";
					this.HOST_MINIGAME2.host = "wmini2." + VersionConfig.DOMAIN_PRO + "";
                    this.HOST_TAI_XIU_MINI2.host = "overunder." + VersionConfig.DOMAIN_PRO + "";
                    this.HOST_SLOT.host = "wslot." + VersionConfig.DOMAIN_PRO + "";
                    this.HOST_TLMN.host = "wtlmn." + VersionConfig.DOMAIN_PRO + "";
                    this.HOST_SHOOT_FISH.host = "wbanca." + VersionConfig.DOMAIN_PRO + "";
                    this.HOST_SAM.host = "wsam." + VersionConfig.DOMAIN_PRO + "";
                    this.HOST_XOCDIA.host = "wxocdia." + VersionConfig.DOMAIN_PRO + "";
                    this.HOST_BACAY.host = "wbacay." + VersionConfig.DOMAIN_PRO + "";
                    this.HOST_BAICAO.host = "wbaicao." + VersionConfig.DOMAIN_PRO + "";
                    this.HOST_POKER.host = "wpoker." + VersionConfig.DOMAIN_PRO + "";
                    this.HOST_XIDACH.host = "wxizach." + VersionConfig.DOMAIN_PRO + "";
                    this.HOST_BINH.host = "wbinh." + VersionConfig.DOMAIN_PRO + "";
                    this.HOST_LIENG.host = "wlieng." + VersionConfig.DOMAIN_PRO + "";
                    //  cc.log(VersionConfig.ENV);
                    break;
                default:
                    this.USE_WSS = true;

                    this.API = "https://iportal." + VersionConfig.DOMAIN_DEV + "/api";
                    this.MONEY_TYPE = 1;
                    this.LINK_DOWNLOAD = "https://" + VersionConfig.DOMAIN_DEV + "";
                    this.LINK_EVENT = "https://" + VersionConfig.DOMAIN_DEV + "/event";

                    this.HOST_MINIGAME.host = "wmini." + VersionConfig.DOMAIN_DEV + "";
					this.HOST_MINIGAME2.host = "wmini2." + VersionConfig.DOMAIN_DEV + "";
                    this.HOST_TAI_XIU_MINI2.host = "overunder." + VersionConfig.DOMAIN_DEV + "";
                    this.HOST_SLOT.host = "wslot." + VersionConfig.DOMAIN_DEV + "";
                    this.HOST_TLMN.host = "wtlmn." + VersionConfig.DOMAIN_DEV + "";
                    this.HOST_SHOOT_FISH.host = "wbanca." + VersionConfig.DOMAIN_DEV + "";
                    this.HOST_SAM.host = "wsam." + VersionConfig.DOMAIN_DEV + "";
                    this.HOST_XOCDIA.host = "wxocdia." + VersionConfig.DOMAIN_DEV + "";
                    this.HOST_BACAY.host = "wbacay." + VersionConfig.DOMAIN_DEV + "";
                    this.HOST_BAICAO.host = "wbaicao." + VersionConfig.DOMAIN_DEV + "";
                    this.HOST_POKER.host = "wpoker." + VersionConfig.DOMAIN_DEV + "";
                    this.HOST_XIDACH.host = "wxizach." + VersionConfig.DOMAIN_DEV + "";
                    this.HOST_BINH.host = "wbinh." + VersionConfig.DOMAIN_DEV + "";
                    this.HOST_LIENG.host = "wlieng." + VersionConfig.DOMAIN_DEV + "";
                    break;
            }
        }
    }
    export class GameId {
        static readonly MiniPoker = 1;
        static readonly TaiXiu = 2;
        static readonly BauCua = 3;
        static readonly CaoThap = 4;
        static readonly Slot3x3 = 5;
        static readonly VQMM = 7;
        static readonly Sam = 8;
        static readonly BaCay = 9;
        static readonly MauBinh = 10;
        static readonly TLMN = 11;
        static readonly TaLa = 12;
        static readonly Lieng = 13;
        static readonly XiTo = 14;
        static readonly XocXoc = 15;
        static readonly BaiCao = 16;
        static readonly Poker = 17;
        static readonly Bentley = 19;
        static readonly RangeRover = 20;
        static readonly MayBach = 21;
        static readonly RollsRoyce = 22;
        static readonly TaiXiuMD5 = 22000;

        static getGameName(gameId: number): string {
            switch (gameId) {
                case this.MiniPoker:
                    return "MiniPoker";
                case this.TaiXiu:
                    return "Tài xỉu";
                case this.BauCua:
                    return "Bầu cua";
                case this.CaoThap:
                    return "Cao thấp";
                case this.Slot3x3:
                    return "Slot3x3";
                case this.VQMM:
                    return "VQMM";
                case this.Sam:
                    return "Sâm";
                case this.MauBinh:
                    return "Mậu binh";
                case this.TLMN:
                    return "TLMN";
                case this.TaLa:
                    return "Tá lả";
                case this.Lieng:
                    return "Liêng";
                case this.XiTo:
                    return "Xì tố";
                case this.XocXoc:
                    return "Xóc xóc";
                case this.BaiCao:
                    return "Bài cào";
                case this.Poker:
                    return "Poker";
                case this.Bentley:
                    return "Bentley";
                case this.RangeRover:
                    return "Range Rover";
                case this.MayBach:
                    return "May Bach";
                case this.RollsRoyce:
                    return "Rolls Royce";
            }
            return "Unknow";
        }
    }

    export class Payment {
        static Deposit = null;
    }
    export class EventFacebook {
        static readonly EVENT_NAME_ACTIVATED_APP = "fb_mobile_activate_app" //mo app
        static readonly EVENT_NAME_DEACTIVATED_APP = "fb_mobile_deactivate_app"
        static readonly EVENT_NAME_SESSION_INTERRUPTIONS = "fb_mobile_app_interruptions"
        static readonly EVENT_NAME_TIME_BETWEEN_SESSIONS = "fb_mobile_time_between_sessions"

        static readonly EVENT_NAME_COMPLETED_REGISTRATION = "fb_mobile_complete_registration" //dang ky
        static readonly EVENT_NAME_COMPLETED_LOGIN = "fb_mobile_complete_login"//todo dang nhap

        static readonly EVENT_NAME_VIEWED_CONTENT = "fb_mobile_content_view"
        static readonly EVENT_NAME_SEARCHED = "fb_mobile_search"
        static readonly EVENT_NAME_RATED = "fb_mobile_rate"
        static readonly EVENT_NAME_COMPLETED_TUTORIAL = "fb_mobile_tutorial_completion"
        static readonly EVENT_NAME_PUSH_TOKEN_OBTAINED = "fb_mobile_obtain_push_token"
        static readonly EVENT_NAME_ADDED_TO_CART = "fb_mobile_add_to_cart"
        static readonly EVENT_NAME_ADDED_TO_WISHLIST = "fb_mobile_add_to_wishlist"
        static readonly EVENT_NAME_INITIATED_CHECKOUT = "fb_mobile_initiated_checkout"
        static readonly EVENT_NAME_ADDED_PAYMENT_INFO = "fb_mobile_add_payment_info" //sdt

        static readonly EVENT_NAME_PURCHASED = "fb_mobile_purchase" //nap tien
        static readonly EVENT_NAME_EARN_VIRTUAL_CURRENCY = "fb_mobile_earn_virtual_currency" //todo doi thuong

        static readonly EVENT_NAME_ACHIEVED_LEVEL = "fb_mobile_level_achieved"
        static readonly EVENT_NAME_UNLOCKED_ACHIEVEMENT = "fb_mobile_achievement_unlocked"
        static readonly EVENT_NAME_SPENT_CREDITS = "fb_mobile_spent_credits" //tieu tien
    }
    export class ParamsFacebook {
        static readonly EVENT_PARAM_CURRENCY = "fb_currency"
        static readonly EVENT_PARAM_REGISTRATION_METHOD = "fb_registration_method"
        static readonly EVENT_PARAM_LOGIN_METHOD = "fb_login_method" //todo

        static readonly EVENT_PARAM_CONTENT_TYPE = "fb_content_type"
        static readonly EVENT_PARAM_CONTENT = "fb_content"
        static readonly EVENT_PARAM_CONTENT_ID = "fb_content_id"
        static readonly EVENT_PARAM_SEARCH_STRING = "fb_search_string"
        static readonly EVENT_PARAM_SUCCESS = "fb_success"
        static readonly EVENT_PARAM_MAX_RATING_VALUE = "fb_max_rating_value"
        static readonly EVENT_PARAM_PAYMENT_INFO_AVAILABLE = "fb_payment_info_available"
        static readonly EVENT_PARAM_NUM_ITEMS = "fb_num_items"
        static readonly EVENT_PARAM_LEVEL = "fb_level"
        static readonly EVENT_PARAM_DESCRIPTION = "fb_description"
        static readonly EVENT_PARAM_SOURCE_APPLICATION = "fb_mobile_launch_source"
        static readonly EVENT_PARAM_VALUE_YES = "1"
        static readonly EVENT_PARAM_VALUE_NO = "0"
    }
    export class EventFirebase {
        static readonly ADD_PAYMENT_INFO = "add_payment_info"
        static readonly ADD_TO_CART = "add_to_cart"
        static readonly ADD_TO_WISHLIST = "add_to_wishlist"
        static readonly APP_OPEN = "app_open"
        static readonly BEGIN_CHECKOUT = "begin_checkout"
        static readonly CAMPAIGN_DETAILS = "campaign_details"
        static readonly ECOMMERCE_PURCHASE = "ecommerce_purchase"
        static readonly GENERATE_LEAD = "generate_lead"
        static readonly JOIN_GROUP = "join_group"
        static readonly LEVEL_UP = "level_up"
        static readonly LOGIN = "login"
        static readonly POST_SCORE = "post_score"
        static readonly PRESENT_OFFER = "present_offer"
        static readonly PURCHASE_REFUND = "purchase_refund"
        static readonly SEARCH = "search"
        static readonly SELECT_CONTENT = "select_content"
        static readonly SHARE = "share"
        static readonly SIGN_UP = "sign_up"
        static readonly SPEND_VIRTUAL_CURRENCY = "spend_virtual_currency"
        static readonly TUTORIAL_BEGIN = "tutorial_begin"
        static readonly TUTORIAL_COMPLETE = "tutorial_complete"
        static readonly UNLOCK_ACHIEVEMENT = "unlock_achievement"
        static readonly VIEW_ITEM = "view_item"
        static readonly VIEW_ITEM_LIST = "view_item_list"
        static readonly VIEW_SEARCH_RESULTS = "view_search_results"
        static readonly EARN_VIRTUAL_CURRENCY = "earn_virtual_currency"
        static readonly REMOVE_FROM_CART = "remove_from_cart"
        static readonly CHECKOUT_PROGRESS = "checkout_progress"
        static readonly SET_CHECKOUT_OPTION = "set_checkout_option"
    }
    export class ParamsFireBase {
        static readonly ACHIEVEMENT_ID = "achievement_id"
        static readonly CHARACTER = "character"
        static readonly TRAVEL_CLASS = "travel_class"
        static readonly CONTENT_TYPE = "content_type"
        static readonly CURRENCY = "currency"
        static readonly COUPON = "coupon"
        static readonly START_DATE = "start_date"
        static readonly END_DATE = "end_date"
        static readonly FLIGHT_NUMBER = "flight_number"
        static readonly GROUP_ID = "group_id"
        static readonly ITEM_CATEGORY = "item_category"
        static readonly ITEM_ID = "item_id"
        static readonly ITEM_LOCATION_ID = "item_location_id"
        static readonly ITEM_NAME = "item_name"
        static readonly LOCATION = "location"
        static readonly LEVEL = "level"
        static readonly SIGN_UP_METHOD = "sign_up_method"
        static readonly NUMBER_OF_NIGHTS = "number_of_nights"
        static readonly NUMBER_OF_PASSENGERS = "number_of_passengers"
        static readonly NUMBER_OF_ROOMS = "number_of_rooms"
        static readonly DESTINATION = "destination"
        static readonly ORIGIN = "origin"
        static readonly PRICE = "price"
        static readonly QUANTITY = "quantity"
        static readonly SCORE = "score"
        static readonly SHIPPING = "shipping"
        static readonly TRANSACTION_ID = "transaction_id"
        static readonly SEARCH_TERM = "search_term"
        static readonly TAX = "tax"
        static readonly VALUE = "value"
        static readonly VIRTUAL_CURRENCY_NAME = "virtual_currency_name"
        static readonly CAMPAIGN = "campaign"
        static readonly SOURCE = "source"
        static readonly MEDIUM = "medium"
        static readonly TERM = "term"
        static readonly CONTENT = "content"
        static readonly ACLID = "aclid"
        static readonly CP1 = "cp1"
        static readonly ITEM_BRAND = "item_brand"
        static readonly ITEM_VARIANT = "item_variant"
        static readonly ITEM_LIST = "item_list"
        static readonly CHECKOUT_STEP = "checkout_step"
        static readonly CHECKOUT_OPTION = "checkout_option"
        static readonly CREATIVE_NAME = "creative_name"
        static readonly CREATIVE_SLOT = "creative_slot"
        static readonly AFFILIATION = "affiliation"
        static readonly INDEX = "index"
        static readonly METHOD = "method"
    }
    export class ParamType {
        static readonly STRING = "String"
        static readonly DOUBLE = "Double"
    }

}
export default Configs;
Configs.App.init();

//acc test: Bright111/admin123 bright/123456