'use strict';
var path = require('path');
var fs = require('fs');
var listBundleName = [];
var listVersion = []
var bundleVersionData = {};
var urlBundle = "https://play.go88vin.live/assets"
var dest = 'D:\frontend-dev\LOT79\build\web-mobile\assets';
var assetsUrl = "D:\frontend-dev\LOT79\build\web-mobile\assets"
function onBuildFinished(options, callback) {
  assetsUrl = path.join(options.dest, "assets");
  dest = path.join(options.dest, "assets");
  Editor.log("Prepare gen file AssetBundleVersion in:" + dest);
  setTimeout(() => {
    getListBundle();
  }, 1000);

  callback();
}

function onBeforeChangeFile(options) {
  getProjectManifestUid(projectManifestPath);
}
function onBeforeBuildFinish(options, callback) {
  onBuildFinished(options);
}
function getVersionBundle(dir, bundleName) {
  let status = fs.statSync(dir);
  if (status.isDirectory()) {
    let bundleUrl = urlBundle + "/" + bundleName;
    fs.readdir(dir, (err, files) => {
      files.forEach(file => {
        if (file.includes("index")) {
          let dataBundle = {};
          // listVersion.push(file.substr(6, 5));
          dataBundle['hash'] = file.substr(6, 5)
          dataBundle.url = bundleUrl;
          bundleVersionData[bundleName] = dataBundle;
        }
      });
    });
  }
}
function createVersionJson() {
  let str = JSON.stringify(bundleVersionData);
  str = str.replace(/\\/g, "/");
  fs.writeFile(path.join(dest, 'AssetBundleVersion.json'), str, (err) => {
    if (err) throw err;
    Editor.log('Generate AssetBundleVersion.json successfully!');
  });
}
function getListBundle() {
  let listFolder = [];
  fs.readdir(assetsUrl, (err, files) => {
    if (err) {
      Editor.log("Error Gen List Bundler:", err);
      return;
    }
    listFolder = files;
  });
  setTimeout(() => {
    listFolder.forEach(file => {
      listBundleName.push(file);
      getVersionBundle(path.join(assetsUrl, file), file);
    });
  }, 500);

  setTimeout(() => {
    createVersionJson();
  }, 1000);
}

module.exports = {
  load() {
    Editor.Builder.on('build-finished', onBuildFinished);
    // Editor.Builder.on('build-start', unCheckSub);
  },

  unload() {
    Editor.Builder.removeListener('build-finished', onBuildFinished);
    // Editor.Builder.removeListener('build-start', unCheckSub);
  },

  // register your ipc messages here
  messages: {
    'open'() {
      // open entry panel registered in package.json
      Editor.Panel.open('test');
    },
    'say-hello'() {
      //  Editor.log('Hello World!');
      // send ipc message to panel
      Editor.Ipc.sendToPanel('test', 'test:hello');
    },
    'clicked'() {
      //  Editor.log('Button clicked!');
    }
  },
};