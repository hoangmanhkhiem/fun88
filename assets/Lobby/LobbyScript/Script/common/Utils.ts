import Configs from "../../../../Loading/src/Configs";

var IS_SHOW_LOG = true;

const { ccclass, property } = cc._decorator;

export namespace common {
    export class Utils {
        static Rad2Deg: number = 57.2957795;
        static Deg2Rad: number = 0.0174532925;
        static loadImgFromUrl(_sprite: cc.Sprite = null, url: string = '', parentScale: cc.Node = null) {
            if (_sprite === null || url === '') return;
            cc.assetManager.loadRemote(url, (err, tex: cc.Texture2D) => {
                if (err != null) return;
                _sprite.spriteFrame = new cc.SpriteFrame(tex);
                if (parentScale) {
                    if (parentScale.width < _sprite.node.width) {
                        let sc = (parentScale.width / _sprite.node.width) - .1
                        //Utils.Log('---> SCALE W ' + sc);
                        if (sc > .5)
                            _sprite.node.scale = sc
                    } else if (parentScale.height < _sprite.node.height) {
                        let sc = (parentScale.height / _sprite.node.height) - .1

                        //Utils.Log('---> SCALE H ' + sc);
                        if (sc > .5)
                            _sprite.node.scale = sc
                    }
                }
            });
        }

        static copy(text) {
            try {
                if (cc.sys.os == cc.sys.OS_ANDROID) {
                    // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "JavaCopy", "(Ljava/lang/String;)V", text);
                    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "JavaCopy", "(Ljava/lang/String;Ljava/lang/String;)V", text);
                }
                else if (cc.sys.os == cc.sys.OS_IOS) {
                    jsb.reflection.callStaticMethod("AppController", "JavaCopy:", text);
                }
                else {
                    const el = document.createElement('textarea');
                    el.value = text;
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand('copy');
                    document.body.removeChild(el);
                }
            }
            catch (message) {
                //  cc.log("Error Copy:", message);
            }
        }

        static degreesToVec2(degrees: number): cc.Vec2 {
            return Utils.radianToVec2(degrees * Utils.Deg2Rad);
        }

        static radianToVec2(radian: number): cc.Vec2 {
            return cc.v2(Math.cos(radian), Math.sin(radian));
        }

        static numberToEnum<T>(value: number, typeEnum: T): T[keyof T] | undefined {
            return typeEnum[typeEnum[value]];
        }

        static ToVND(number) {
            var result = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            if (result == null || result == "NaN") result = 0;
            return result;
        }
        static ToInt(vnd) {
            // var vndtmp = vnd.replaceAll('.','');
            if (vnd == "") return 0;
            var vndtmp = vnd.split('.').join('');
            return parseInt(vndtmp);
        }

        static IsJsonString(text) {
            if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
                replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                //the json is ok
                return true;
            } else {

                //the json is not ok
                return false;
            }
        }



        static loadSpriteFrameFromBase64(base64: string, callback: (sprFrame: cc.SpriteFrame) => void) {
            //create DOM element
            let img = new Image();
            //define img.onload before assigning src
            img.onload = function () {
                let texture = new cc.Texture2D();
                texture.initWithElement(img);
                texture.handleLoadedTexture();
                let sp = new cc.SpriteFrame(texture);
                //  //Utils.Log(sp);
                //assign the spriteframe to you sprite
                callback(sp);
            }.bind(this);
            img.src = "data:image/png;base64," + base64;
        }

        static formatNameBank(n: string): string {
            var name = n.toLowerCase();
            var arr = {
                "àáảãạăắằẳẵặâấầẩẫậ": "a",
                "óòỏõọơớờởỡợôốồổỗộ": "o",
                "éèẻẽẹêếềểễệ": "e",
                "úùủũụưứừửữự": "u",
                "íìỉĩị": "i",
                "ýỳỷỹỵ": "y",
                "đ": "d",
                "~!@#$%^&*()_+`[]\{}|;':*-+\",./<>?0123456789": "_"
            };
            for (var i = 0; i < name.length; i++) {
                for (var key in arr) {
                    for (var j = 0; j < key.length; j++) {
                        if (name[i] == key[j]) {
                            name = name.replace(name[i], arr[key]);
                        }
                    }
                }
            }
            name = name.replace(/_/g, '');
            // name = name.replace(/[^a-zA-Z ]/g, "");
            name = name.toUpperCase();
            return name;
        }

        static formatName(n: string): string {
            var name = n;
            var arr = {
                "àáảãạăắằẳẵặâấầẩẫậ": "a",
                "óòỏõọơớờởỡợôốồổỗộ": "o",
                "éèẻẽẹêếềểễệ": "e",
                "úùủũụưứừửữự": "u",
                "íìỉĩị": "i",
                "ýỳỷỹỵ": "y",
                "đ": "d",
            };
            for (var i = 0; i < name.length; i++) {
                for (var key in arr) {
                    for (var j = 0; j < key.length; j++) {
                        if (name[i] == key[j]) {
                            name = name.replace(name[i], arr[key]);
                        }
                    }
                }
            }
            name = name.trim();
            return name;
        }

        static formatNumberBank(n: string): string {
            var name = n;
            name = name.replace(/[^0-9]/g, "")
            return name;
        }


        static formatEditBox(n: string): number {
            if (n == "") return 0;
            var vndtmp = n.split('.').join('');
            return parseInt(vndtmp);
        }

        static formatNumber(n: number): string {
            var result = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return result;
            // return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        }
        static formatMoney(money: number, isForMatK = false) {
            let format = "";
            let mo = Math.abs(money);
            if (mo >= 1000000000) {
                mo /= 1000000000;
                format = "B";
            } else if (mo >= 1000000) {
                mo /= 1000000;
                format = "M";
            } else if (mo >= 1000 && isForMatK) {
                mo /= 1000;
                format = "K";
            } else {
                return this.formatNumber(money);
            }

            let str = Math.abs(money).toString();
            let str1 = Math.floor(mo).toString();

            let strResult = str[str1.length] + str[str1.length + 1]
            if (strResult === '00') {
                return (money < 0 ? "-" : "") + Math.floor(mo) + format;
            } else {
                if (strResult[1] === '0') {
                    return (money < 0 ? "-" : "") + Math.floor(mo) + "." + strResult[0] + format;
                } else
                    return (money < 0 ? "-" : "") + Math.floor(mo) + "." + strResult + format;
            }
        }
        static formatNumberMin(value) {
            var newValue = value;
            if (value >= 1000) {
                var suffixes = ["", "K", "M", "B", "T"];
                var suffixNum = Math.floor(("" + value).length / 3);
                var shortValue = 0;
                for (var precision = 2; precision >= 1; precision--) {
                    shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
                    var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
                    if (dotLessShortValue.length <= 2) { break; }
                }
                if (shortValue % 1 != 0) shortValue = parseFloat(shortValue.toFixed(1));
                newValue = shortValue + suffixes[suffixNum];
            }
            return newValue;
        }

        static stringToInt(s: string): number {
            var n = parseInt(s.replace(/\./g, '').replace(/,/g, ''));
            if (isNaN(n)) n = 0;
            return n;
        }

        static randomRangeInt(min: number, max: number): number {
            //Returns a random number between min (inclusive) and max (inclusive)
            //Math.floor(Math.random() * (max - min + 1)) + min;

            //Returns a random number between min (inclusive) and max (exclusive)
            return Math.floor(Math.random() * (max - min)) + min;
        }

        static randomRange(min: number, max: number): number {
            //Returns a random number between min (inclusive) and max (exclusive)
            return Math.random() * (max - min) + min;
        }

        static v2Distance(v1: cc.Vec2, v2: cc.Vec2): number {
            return Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2));
        }

        static v2Degrees(v1: cc.Vec2, v2: cc.Vec2): number {
            return Math.atan2(v2.y - v1.y, v2.x - v1.x) * 180 / Math.PI;
        }

        static dateToYYYYMMdd(date: Date) {
            var mm = date.getMonth() + 1; // getMonth() is zero-based
            var dd = date.getDate();

            return [
                date.getFullYear(),
                (mm > 9 ? '' : '0') + mm,
                (dd > 9 ? '' : '0') + dd
            ].join('-');
        }

        static dateToYYYYMM(date: Date) {
            var mm = date.getMonth() + 1; // getMonth() is zero-based
            var dd = date.getDate();

            return [
                date.getFullYear(),
                (mm > 9 ? '' : '0') + mm
            ].join('-');
        }

        static removeDups(array: Array<any>) {
            var unique = {};
            array.forEach(function (i) {
                if (!unique[i]) {
                    unique[i] = true;
                }
            });
            return Object.keys(unique);
        }
        static Log(str, params1 = null) {
            if (IS_SHOW_LOG) {
                if (Configs.App.IS_PRO) {
               //     console.log(str + ":", (params1 != null ? params1 : ""));
                } else {
                //    cc.log(str + ":", (params1 != null ? params1 : ""));
                }
            }
        }
    }
}
export default common.Utils;