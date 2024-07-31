import Configs from "../../../../../Loading/src/Configs";
import App from "../../common/App";
import SPUtils from "../../common/SPUtils";
import Utils from "../../common/Utils";
import facebookSdk from "./Facebook";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FBsrv extends cc.Component {

    static inst: FBsrv = null;
    isLogined: boolean = false;
    private statusResponse: fb.StatusResponse = null;
    static appID = '439607153788936';
    static webVersion = '{api-version}';
    accessToken: string = null;

    start() {
        this.init();
    }

    static getInst() {
        if (!this.inst) {
            this.inst = new cc.Node().addComponent(FBsrv);
        }
        return this.inst;
    };

    init() {
        if (cc.sys.isBrowser) {
            this._initWeb();
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            this._initAndroid();
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            this._initIOS();
        }
    };

    _initWeb() {
        let params: fb.InitParams = {
            appId: Configs.App.FB_APPID,
            version: FBsrv.webVersion,
            status: true,
            cookie: true,
            xfbml: true,
            autoLogAppEvents: false
        }
        FB.init(params);
    };

    isUseSDK()
    {
        if (cc.sys.os == cc.sys.OS_ANDROID) return true;
        if (cc.sys.os == cc.sys.OS_IOS) return true;
        return false;
    };

    callLoginToFB(callback)
    {
        cc.sys.localStorage.setItem("isLoginFB",1);
        App.instance.showLoading(true,-1);
        var self = this;
        if(self.isUseSDK())
        {
            if (sdkbox.PluginFacebook.isLoggedIn()) {
                Configs.Login.AccessToken = sdkbox.PluginFacebook.getAccessToken();
                callback();
            } else {
                 //Utils.Log("FB to Login");
                sdkbox.PluginFacebook.login(['public_profile', 'email']);
            }
        }
        else
        {
            let Appid = Configs.App.FB_APPID;
            let scope = 'email,public_profile';
            if(self.sdk != null)
            {
                try{
                    FB.getLoginStatus((data) => {
                        if (data.status === 'connected') {
                            
                            Configs.Login.AccessToken = data.authResponse.accessToken;
                            callback();

                        } else if (data.status === 'not_authorized') {

                            App.instance.showErrLoading("Lỗi đăng nhập status: " + data.status);
                        } else {
                            FB.login(self.fbRespone, { scope: Scope });
                        }
                    });
                }
                catch (e)
                {
                    App.instance.showLoading(false);
                    App.instance.showErrLoading("Lỗi đăng nhập status: " + e.message);
                }
            }
            else
            {
                self.sdk = new facebookSdk(Appid, scope, self.fbRespone);
            }
            
            
        }
    }

    fbRespone(response)
    {
        var self = this;
        if(response.status != "200")
        {
            if(response.response != "wait")
            {
                 //Utils.Log(JSON.stringify(response));
                App.instance.showLoading(false);
                App.instance.showErrLoading("Lỗi đăng nhập status: " + response.status);
                
            }
            
        }else
        {
            Configs.Login.AccessToken = response.response.authResponse.accessToken;
            self.loginFB();
        }
    },

    _initAndroid() {

    };

    _initIOS() {

    };

    async login(callBack: Function) {
        if (cc.sys.isBrowser) {
            await this._loginWeb(callBack);
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            this._loginAndroid(callBack);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            this._loginIOS(callBack);
        }
        return this.isLogined;
    };

    async _loginWeb(callBack: Function) {
        let _this = this;
        await new Promise((resolve => {
            FB.login(function (response) {
                callBack(response);
                if (response.status === 'connected') {
                    _this.isLogined = true;
                }
                else{
                    _this.isLogined = false;
                }
                resolve('success');
            }, { auth_type: "reauthorize"});
        }));
    };

    _loginAndroid(callBack: Function) {

    };

    _loginIOS(callBack: Function) {

    };

    logout(callBack: Function) {
        if (cc.sys.isBrowser) {
            this._logoutWeb(callBack);
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            this._logoutAndroid(callBack);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            this._logoutIOS(callBack);
        }
    };

    _logoutWeb(callBack: Function) {
        FB.logout(function (response) {
            callBack(response);
        });
    };

    _logoutAndroid(callBack: Function) {

    };

    _logoutIOS(callBack: Function) {

    };

    async checkLoginStatus(callBack: Function) {
        if (cc.sys.isBrowser) {
            await this._checkLoginStatusWeb(callBack);
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            this._checkLoginStatusAndroid(callBack);
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            this._checkLoginStatusIOS(callBack)
        }
        return this.isLogined;
    };

    async _checkLoginStatusWeb(callBack: Function) {
        let _this = this;
        await new Promise((resolve => {
            FB.getLoginStatus(function (response) {
                callBack(response);
                if (response.status === 'connected') {
                    _this.isLogined = true;
                    SPUtils.setUserAccessTokenFB(response.authResponse.accessToken);
                }
                else{
                    _this.isLogined = false;
                }
                resolve('success');
            });
        }));
    }

    _checkLoginStatusAndroid(callBack: Function) {

    }

    _checkLoginStatusIOS(callBack: Function) {

    }

    async getAccessToken() {
        await this.checkLoginStatus(()=>{});
        return SPUtils.getUserAccessTokenFB();
    }

}
