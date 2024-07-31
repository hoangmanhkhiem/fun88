namespace common {
    export class SPUtils {
        private static encode(s: string, k: number): string {
            var enc = "";
            var str = "";
            // make sure that input is string
            str = s.toString();
            for (var i = 0; i < s.length; i++) {
                // create block
                var a = s.charCodeAt(i);
                // bitwise XOR
                var b = a ^ k;
                enc = enc + String.fromCharCode(b);
            }
            return enc;
        }

        static get(key: string, defaultValue: string = ""): string {
            var keyEncrypted = this.encode(key, 3265812).toString();
            if (typeof defaultValue === "undefined") defaultValue || null;
            var r = cc.sys.localStorage.getItem(keyEncrypted);
            if(cc.sys.isBrowser){
                r = window.localStorage.getItem(keyEncrypted);
            }
            if (r) {
                r = this.encode(r, 3265812).toString();
                return r;
            }
            return defaultValue;
        }

        static set(key: string, value: string) {
            value = value.toString();
            var keyEncrypted = "" + this.encode(key, 3265812);
            var valueEncrypted = "" + this.encode(value, 3265812);
            if(cc.sys.isBrowser){
                window.localStorage.setItem(keyEncrypted, valueEncrypted);
            }
            else{
                cc.sys.localStorage.setItem(keyEncrypted, valueEncrypted);
            }
        }

        static setAccessTokenFB(value: string) {
            this.set("at_fb", value);
        }

        static getAccessTokenFB(): string {
            return this.get("at_fb");
        }
		
		
		
		static copyToClipboard(content) {
            if (cc.sys.isNative) {
                if (jsb) {
                    jsb.copyTextToClipboard(content);
                    return true;
                } else {
                    return false;
                }
            } else {
                var input = document.createElement('input');
                input.value = content;
                input.id = 'inputID';
                document.body.appendChild(input);
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);
                return true;
            }
        };
		
		
		
		
		
		

        static setAccessToken(value: string) {
            this.set("at", value);
        }

        static setUserName(value: string) {
            this.set("username", value);
        }

        static setNN(value: string) {
            this.set("u", value);
        }

        static getNN(): string {
            return this.get("u");
        }

        static getUserName(): string {
            return this.get("username");
        }

        static getAccessToken(): string {
            return this.get("at");
        }

        static setUserPass(value: string) {
            this.set("userpass", value);
        }

        static getUserPass(): string {
            return this.get("userpass");
        }

        static setUserAccessTokenFB(value: string) {
            this.set("fbAccessToken", value);
        }

        static getUserAccessTokenFB(): string {
            return this.get("fbAccessToken");
        }

        static getMusicVolumn(): number {
            return Number(this.get("music_volumn", "1"));
        }

        static setMusicVolumn(volumn: number) {
            this.set("music_volumn", volumn.toString());
        }

        static getSoundVolumn(): number {
            return Number(this.get("sound_volumn", "1"));
        }

        static setSoundVolumn(volumn: number) {
            this.set("sound_volumn", volumn.toString());
        }
    }
}
export default common.SPUtils;