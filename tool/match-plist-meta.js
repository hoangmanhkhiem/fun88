const fs = require('fs');
var filePath = "/Users/raymond/Code/game/client/f69/F69_Logic/assets/subpackages/SlotTayDuKy/assets/maingame.plist.meta";
var str = fs.readFileSync(filePath);
var meta = JSON.parse(str);

//parse packed uuid

var fileUuid = "/Users/raymond/Code/game/client/f69/F69_Logic/tool/uuid-plist.json";
var strUuid = fs.readFileSync(fileUuid);
var dataUuid = JSON.parse(strUuid);

//parse scene packed

var sceneFile = "/Users/raymond/Code/game/client/f69/F69_Logic/assets/scenes/SlotTayDuKy.fire";
var strScene = fs.readFileSync(sceneFile);
var dataScene = JSON.parse(strScene);



var submeta = meta.subMetas;

var listUuid = dataUuid._spriteFrames;


var dataArrayId = []
var i = 0
for(var item in submeta){
    for(var itemId in listUuid){
        if(item == itemId){
            var dataCheck = {
                uuidPacked: listUuid[itemId].__uuid__,
                uuidGenerated: submeta[item].uuid
            }
            dataArrayId.push(dataCheck);
            
        }
    }
}

for(var check in dataArrayId){
    for(var i = 0; i < dataScene.length; i++){
        if(dataScene[i]._components !== undefined &&
            dataScene[i]._components[0]._spriteFrame !== undefined &&
             dataScene[i]._components[0]._spriteFrame.__uuid__ == dataArrayId[check].uuidPacked){
            dataScene[i]._components[0]._spriteFrame.__uuid__ = dataArrayId[check].uuidGenerated
        }
    }
}

//console.log(dataArrayId);
fs.writeFileSync(sceneFile, JSON.stringify(dataScene));