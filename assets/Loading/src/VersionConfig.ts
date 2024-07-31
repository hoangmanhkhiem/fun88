export default class VersionConfig {
    static readonly CP_NAME_F69 = "F69";
    static readonly ENV_DEV = "dev";
    static readonly ENV_PROD = "prod";
    static readonly DOMAIN_DEV = "go88s.fun";
    static readonly DOMAIN_PRO = "go88s.fun";

    static VersionName = "";
    static CPName = "";
    static ENV = VersionConfig.ENV_DEV;
}
if (cc.sys.isNative) {
    let versionConfig = cc.sys.localStorage.getItem("VersionConfig");
    if (versionConfig != null) {
        versionConfig = JSON.parse(versionConfig);
        VersionConfig.VersionName = versionConfig["VersionName"];
        VersionConfig.CPName = versionConfig["CPName"];
    }else{
        VersionConfig.VersionName = "1.0.0";
        VersionConfig.CPName = VersionConfig.CP_NAME_F69;
    }
} else {
    VersionConfig.VersionName = "1.0.0";
    VersionConfig.CPName = VersionConfig.CP_NAME_F69;
}