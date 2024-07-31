var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var manifest = {
    packageUrl: 'http://127.0.0.1:8000/remote-assets/',
    remoteManifestUrl: 'http://127.0.0.1:8000/remote-assets/project.manifest',
    remoteVersionUrl: 'http://127.0.0.1:8000/remote-assets/version.manifest',
    version: '1.0.0',
    assets: {},
    searchPaths: []
};
var listBundleName = [];
var listVersion = []
var bundleVersionData = {};
var urlBundle = "https://go88vin.live/assets"
var dest = 'D:/frontend-dev/buildweb-mobile/assets';
var assetsUrl = "D:/frontend-dev/buildweb-mobile/assets"
var src = './jsb/';

// Parse arguments
var i = 2;
while (i < process.argv.length) {
    var arg = process.argv[i];

    switch (arg) {
        case '--url':
        case '-u':
            urlBundle = process.argv[i + 1];
            i += 2;
            break;
        case '--version':
        case '-v':
            manifest.version = process.argv[i + 1];
            i += 2;
            break;
        case '--src':
        case '-s':
            assetsUrl = process.argv[i + 1];
            i += 2;
            break;
        case '--dest':
        case '-d':
            dest = process.argv[i + 1];
            i += 2;
            break;
        default:
            i++;
            break;
    }
}


function readDir(dir, obj) {
    var stat = fs.statSync(dir);
    if (!stat.isDirectory()) {
        return;
    }
    var subpaths = fs.readdirSync(dir), subpath, size, md5, compressed, relative;
    for (var i = 0; i < subpaths.length; ++i) {
        if (subpaths[i][0] === '.') {
            continue;
        }
        subpath = path.join(dir, subpaths[i]);
        stat = fs.statSync(subpath);
        if (stat.isDirectory()) {
            readDir(subpath, obj);
        }
        else if (stat.isFile()) {
            // Size in Bytes
            size = stat['size'];
            md5 = crypto.createHash('md5').update(fs.readFileSync(subpath, 'binary')).digest('hex');
            compressed = path.extname(subpath).toLowerCase() === '.zip';

            relative = path.relative(src, subpath);
            relative = relative.replace(/\\/g, '/');
            relative = encodeURI(relative);
            obj[relative] = {
                'size': size,
                'md5': md5
            };
            if (compressed) {
                obj[relative].compressed = true;
            }
        }
    }
}

var mkdirSync = function (path) {
    try {
        fs.mkdirSync(path);
    } catch (e) {
        if (e.code != 'EEXIST') throw e;
    }
}

fs.readdir(assetsUrl, (err, files) => {
    listVersion = [];
    files.forEach(file => {
        listBundleName.push(file);
        getVersionBundle(path.join(assetsUrl, file), file);
    });
    setTimeout(() => {
        createVersionJson();
    }, 500);

});
var getVersionBundle = function (dir, bundleName) {
    status = fs.statSync(dir);
    if (status.isDirectory()) {
        let bundleUrl = urlBundle + "/" + bundleName;
        fs.readdir(dir, (err, files) => {
            files.forEach(file => {
                if (file.includes("index")) {
                    let dataBundle = {};
                    listVersion.push(file.substr(6, 5));
                    dataBundle['hash'] = file.substr(6, 5)
                    dataBundle.url = bundleUrl;
                    bundleVersionData[bundleName] = dataBundle;
                    console.log("dataBundle:", dataBundle)
                }
            });
        });
    }
}
var createVersionJson = function () {
    let str = JSON.stringify(bundleVersionData);
    str = str.replace(/\\/g, "/");
    console.log(str);
    fs.writeFile(path.join(dest, 'AssetBundleVersion.json'), str, (err) => {
        if (err) throw err;
        console.log('Generate AssetBundleVersion.json successfully!');
    });
}
// Iterate res and src folder
// readDir(path.join(src, 'src'), manifest.assets);
// readDir(path.join(src, 'res'), manifest.assets);

var destManifest = path.join(dest, 'project.manifest');
var destVersion = path.join(dest, 'version.manifest');

// mkdirSync(dest);

// fs.writeFile(destManifest, JSON.stringify(manifest), (err) => {
//   if (err) throw err;
//   cc.NGWlog('Generate Project.mainifes duoc roi day ku');
// });

// delete manifest.assets;
// delete manifest.searchPaths;
// fs.writeFile(destVersion, JSON.stringify(manifest), (err) => {
//   if (err) throw err;
//   cc.NGWlog('Generate Version duoc roi day ku');
// });
