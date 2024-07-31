const { ccclass, property } = cc._decorator;
@ccclass
export default class HotUpdate extends cc.Component {

    // @property(cc.Asset)
    // manifestUrl: cc.Asset = null;

    @property({
        type: cc.Asset,
    })
    manifestUrl = null;

    @property(cc.Node)
    loadingNode: cc.Node = null;

    @property([cc.SpriteFrame])
    bgSplash: cc.SpriteFrame[] = [];

    @property(cc.Sprite)
    loadingBar: cc.Sprite = null;

    @property([cc.SpriteFrame])
    listSprBg: cc.SpriteFrame[] = [];

    @property(cc.Label)
    lb_Info: cc.Label = null;
    _updating: Boolean = false;
    _failCount = 0;
    _canRetry: Boolean = false;
    _storagePath: string = '';
    _updateListener = null;
    _am = null;
    _checkListener = null;
    versionCompareHandle = null;
    gameSceneName = "main";
    loadingGameComp: any = null;





    checkCb(event) {
        //  cc.log('Code CheckCb: ' + event.getEventCode());
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.loadGame();
                //  cc.log("No local manifest!");
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                //  cc.log("Error Parse/Download manifest!");
                this.loadGame();
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                //  cc.log("Up To Date!");
                this.loadGame();
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.lb_Info.node.active = true;
                this.lb_Info.string = "Đang tải bản cập nhật..."
                //  cc.log("new version found");
                this.loadingBar.fillRange = 0;
                this.hotUpdate();

                break;
            default:
                //  cc.log('Code: ' + event.getEventCode());
                return;
        }

        this._am.setEventCallback(null);
        //  cc.log("CheckCB:setEventCallback=null");
        this._checkListener = null;
        this._updating = false;
    }
    updateCb(event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                //  cc.log("============Update CB===============ERROR_NO_LOCAL_MANIFEST")
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                var msg = event.getMessage();
                //  cc.log("UPDATE_PROGRESSION:", JSON.stringify(msg));
                if (msg) {
                    //  cc.log("Progress" + event.getPercent() / 100 + '% : ' + msg);
                }
                this.lb_Info.string = "Updating: " + Math.floor(event.getPercent() * 100) + '%';
                this.loadingBar.fillRange = event.getPercent();
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                //  cc.log("============Update CB===============ERROR_PARSE_MANIFEST,ERROR_DOWNLOAD_MANIFEST")
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                //  cc.log("============Update CB===============ALREADY_UP_TO_DATE")
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                //  cc.log("============Update CB===============UPDATE_FINISHED")
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                //  cc.log("============Update CB===============UPDATE_FAILED")
                this._am.downloadFailedAssets();
                this._updating = false;
                this._canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                //  cc.log("============Update CB===============UPDATE_FAILED" + "Asset update error:" + event.getAssetId() + ', ' + event.getMessage());
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                //  cc.log("============Update CB===============ERROR_DECOMPRESS");
                break;
            default:
                //  cc.log('Code: ' + event.getEventCode());
                //  cc.log("============Update CB===============default hotupdate ");
                break;
        }

        if (failed) {
            //  cc.log("Update Failed");
            this._am.setEventCallback(null);
            this._updateListener = null;
            this._updating = false;
            this.loadGame();

        }

        if (needRestart) {
            this._am.setEventCallback(null);
            this._updateListener = null;
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            //  cc.log("newPaths==" + JSON.stringify(newPaths));
            //  cc.log("searchPaths==" + JSON.stringify(searchPaths));
            Array.prototype.unshift.apply(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);
            cc.audioEngine.stopAll();
            cc.game.restart();
        }

    }
    checkUpdate() {
        //  cc.log("Chay vao hot update");
        if (this._updating) {
            this.lb_Info.string = 'Checking or updating ...';
            return;
        }
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            // Resolve md5 url
            var url = this.manifestUrl.nativeUrl;
            if (cc.loader.md5Pipe) {
                url = cc.loader.md5Pipe.transformURL(url);
            }
            this._am.loadLocalManifest(url);
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            //this.panel.info.string = 'Failed to load local manifest ...';
            return;
        }
        this._am.setEventCallback(this.checkCb.bind(this));
        // cc.log("Check Update");
        this._am.checkUpdate();
        this._updating = true;
    }
    hotUpdate() {
        if (this._am && !this._updating) {
            //  cc.log("setEventCallback updateCB");
            this._am.setEventCallback(this.updateCb.bind(this));

            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                // Resolve md5 url
                var url = this.manifestUrl.nativeUrl;
                if (cc.loader.md5Pipe) {
                    url = cc.loader.md5Pipe.transformURL(url);
                }
                this._am.loadLocalManifest(url);
            }

            this._failCount = 0;
            this._am.update();
            //  cc.log("HotUpdate deee");
            this._updating = true;
        }
        else {
            var _this = this;
            this.scheduleOnce(function () {
                _this.hotUpdate();
            }, 0.5)
        }
    }
    onLoad() {
        this.loadingGameComp = this.loadingNode.getComponent("Loading");
        // Hot update is only available in Native build
        if (!cc.sys.isNative && cc.sys.isBrowser || cc.sys.os === cc.sys.OS_OSX) {
            this.loadGame();
            return;
        }
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-assets');
        //  cc.log('Storage path for remote asset : ' + this._storagePath);
        // Setup your own version compare handler, versionA and B is versions in string
        // if the return value greater than 0, versionA is greater than B,
        // if the return value equals 0, versionA equals to B,
        // if the return value smaller than 0, versionA is smaller than B.
        this.versionCompareHandle = function (versionA, versionB) {
            // cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        };

        // Init with empty manifest url for testing custom manifest
        this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);

        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        // Return true if the verification passed, otherwise return false
        this._am.setVerifyCallback(function (path, asset) {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            var compressed = asset.compressed;
            // Retrieve the correct md5 value.
            var expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            var relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            var size = asset.size;
            if (compressed) {
                //  cc.log("Verification passed : " + relativePath);
                return true;
            }
            else {
                //  cc.log("Verification passed : " + relativePath + ' (' + expectedMD5 + ')');
                return true;
            }
        });
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this._am.setMaxConcurrentTask(10);
        }
        this.checkUpdate();

    }
    start() {
        // Utils.getGetDeviceId();
        if (cc.sys.isBrowser) {

            // Global.loadTextConfig();
            // LoadConfig.getInstance().pushDataEco();
        }

    }
    loadGame() {
        this.loadingGameComp.startGame();

    }

    onDestroy() {
        if (this._updateListener) {
            this._am.setEventCallback(null);
            this._updateListener = null;
        }
    }
    // update (dt) {}
}
