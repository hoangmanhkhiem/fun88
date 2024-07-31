import { Global } from "./Global";

var SEND_LOG_EVENT = "1";
var GET_DEVICE_ID = "2";
var VERIFY_PHONE = "3";
var VERIFY_OTP = "4";
var COPY_CLIPBOARD = "5";

cc.NativeCallJS = function (evt: string, params: string, param2: string) {
    // if (evt !== UPDATE_INFO_TIME)
    switch (evt + '') {
        case SEND_LOG_EVENT: {
            //  cc.log("Send Log Event:");
            break;
        }
        case GET_DEVICE_ID: {
            //  cc.log("Device id:" + params);
            break;
        }
        case VERIFY_PHONE: {
            let token = params;
            Global.PopupSecurity.actGetOtpServer(token);
            break;
        }
        case VERIFY_OTP: {
            let result = params;
            Global.PopupSecurity.actGetVerifyCode(result);
            break;
        }
        default: {
            //  cc.log('-=-=-=-=-=->>>No CASE:' + evt);
            break;
        }
    }
}

export default class UtilsNative {
    static onCallNative(evt: string, params: string) {
        if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) {
            //  cc.log('Call Native-=-=-= EVT ' + evt + " PARAMS " + params)
            //jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "onCallFromJavascript", "(Ljava/lang/String;Ljava/lang/String;)V", evt, params);
        } else if (cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative) {
            //  cc.log('Call Native-=-=-= EVT ' + evt)
            //jsb.reflection.callStaticMethod("AppController", "onCallFromJavaScript:andParams:", evt, params);
        }
    }

    static sendLogEvent(jsonData) {
        //  cc.log("sendLogEvent:", JSON.stringify(jsonData));
        this.onCallNative(SEND_LOG_EVENT, JSON.stringify(jsonData));
    }
    static getDeviceId() {
        // this.onCallNative(GET_DEVICE_ID,"");
        if (!CC_JSB)
            return;
        let deviceID;
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            //deviceID = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getDeviceId", "()Ljava/lang/String;");
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            //deviceID = jsb.reflection.callStaticMethod("AppController", "getDeviceId:andParams:", "", "");
        }
        //  cc.log("Device ID=" + deviceID);
        return deviceID;
    }
    static verifyPhone(phoneNumber) {
        this.onCallNative(VERIFY_PHONE, phoneNumber);
    }
    static verifyOTP(otp) {
        this.onCallNative(VERIFY_OTP, otp);
    }
    static httpGet(url: string, onFinished: (err: any, json: any) => void) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var data = null;
                    var e = null;
                    try {
                        data = JSON.parse(xhr.responseText);
                    } catch (ex) {
                        e = ex;
                    }
                    onFinished(e, data);
                } else {
                    onFinished(xhr.status, null);
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    }
    static copyClipboard(text) {
        this.onCallNative(COPY_CLIPBOARD, text);
    }

}