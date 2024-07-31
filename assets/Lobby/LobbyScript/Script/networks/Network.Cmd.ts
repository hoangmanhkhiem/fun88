import InPacket from "./Network.InPacket";
import OutPacket from "./Network.OutPacket";


export namespace cmd {
    export class Code {
        static LOGIN = 1;
    }

    export class Login extends OutPacket {
        constructor() {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.LOGIN);
        }

        putData(nickname: string, accessToken: string) {
            this.packHeader();
            this.putString(nickname);
            this.putString(accessToken);
            this.updateSize()
        }
    }

    export class SendLogin extends OutPacket {
        constructor(nickname: string, accessToken: string) {
            super();
            this.initData(100);
            this.setControllerId(1);
            this.setCmdId(Code.LOGIN);
            this.packHeader();
            this.putString(nickname);
            this.putString(accessToken);
            this.updateSize();
            this.getData();
        }
    }
}
export default cmd;
