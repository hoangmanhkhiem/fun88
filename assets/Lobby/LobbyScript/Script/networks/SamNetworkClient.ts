import Configs from "../../../../Loading/src/Configs";
import Utils from "../common/Utils";
import CardGameNetworkClient from "./CardGameNetworkClient";

export default class SamNetworkClient extends CardGameNetworkClient {
    
    public static getInstance(): SamNetworkClient {
        if (this.instance == null) {
            this.instance = new SamNetworkClient();
        }
        return this.instance as SamNetworkClient;
    }

    constructor() {
        super();
    }

    _connect() {
        super.connect(Configs.App.HOST_SAM.host, Configs.App.HOST_SAM.port);
    }

    onOpen(ev: Event) {
        super.onOpen(ev);
         //Utils.Log("sam connected");
    }
}