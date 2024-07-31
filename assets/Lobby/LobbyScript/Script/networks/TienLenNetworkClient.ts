import Configs from "../../../../Loading/src/Configs";
import Utils from "../common/Utils";
import CardGameNetworkClient from "./CardGameNetworkClient";


export default class TienLenNetworkClient extends CardGameNetworkClient {

    public static getInstance(): TienLenNetworkClient {
        if (this.instance == null) {
            this.instance = new TienLenNetworkClient();
        }
        return this.instance as TienLenNetworkClient;
    }

    constructor() {
        super();
    }

    _connect() {
        super.connect(Configs.App.HOST_TLMN.host, Configs.App.HOST_TLMN.port);
    }

    onOpen(ev: Event) {
        super.onOpen(ev);
         //Utils.Log("tlmn connected");
    }
}