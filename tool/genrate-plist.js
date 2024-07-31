const fs = require('fs');

var data = [
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "khungspin_bot",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          1,
          1042,
          439,
          36
        ],
        "offset": [
          0,
          -1
        ],
        "originalSize": [
          439,
          38
        ],
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "maingame_BG",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          1,
          1,
          800,
          369
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          800,
          369
        ],
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "buttonsieutoc_disable",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          746,
          1161,
          103,
          103
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          103,
          103
        ],
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "buttonsieutoc",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          641,
          1123,
          103,
          103
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          103,
          103
        ],
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "20winline",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          213,
          1249,
          38,
          25
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          38,
          25
        ],
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "tayduky_bonusgame_BG0",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          1,
          372,
          800,
          369
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          800,
          369
        ],
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "button_caidat",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          843,
          1078,
          78,
          78
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          78,
          78
        ],
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "maingame10",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          704,
          743,
          140,
          143
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          140,
          143
        ],
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "maingame9",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          276,
          1080,
          198,
          199
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          198,
          199
        ],
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "BGspin",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          931,
          1,
          39,
          488
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          39,
          488
        ],
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "khungspin_left",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          803,
          1,
          126,
          558
        ],
        "offset": [
          0,
          -2
        ],
        "originalSize": [
          126,
          562
        ],
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "ketthucsau",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          1,
          1249,
          210,
          35
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          210,
          35
        ],
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "button_info",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          912,
          903,
          78,
          78
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          78,
          78
        ],
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "thanhchiacot",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          972,
          1,
          23,
          466
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          23,
          466
        ],
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "otienthang",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          403,
          743,
          299,
          145
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          299,
          145
        ],
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "buttondung",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          442,
          890,
          213,
          163
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          213,
          163
        ],
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "buttonquay",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          476,
          1055,
          213,
          163
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          213,
          163
        ],
        "rotated": 1,
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "Vi",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          657,
          890,
          231,
          91
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          231,
          91
        ],
        "rotated": 1,
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "box_money",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          843,
          903,
          173,
          67
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          173,
          67
        ],
        "rotated": 1,
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "maingame15",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          750,
          888,
          271,
          91
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          271,
          91
        ],
        "rotated": 1,
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "free",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          803,
          561,
          144,
          165
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          144,
          165
        ],
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "giudetuquay",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          972,
          469,
          89,
          23
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          89,
          23
        ],
        "rotated": 1,
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "khungspin_top",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          1,
          953,
          439,
          87
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          439,
          87
        ],
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "maingame14",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          846,
          728,
          173,
          92
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          173,
          92
        ],
        "rotated": 1,
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "choithu",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          851,
          1158,
          112,
          136
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          112,
          136
        ],
        "rotated": 1,
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "boxthongbao0",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          1,
          743,
          400,
          208
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          400,
          208
        ],
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "khung_jackpot",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          1,
          1080,
          273,
          167
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          273,
          167
        ],
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    },
    {
      "__type__": "cc.SpriteFrame",
      "content": {
        "name": "button_quaylai",
        "texture": "0bbRHA6SpJm4t5wEzs8fc+",
        "rect": [
          912,
          983,
          78,
          78
        ],
        "offset": [
          0,
          0
        ],
        "originalSize": [
          78,
          78
        ],
        "capInsets": [
          0,
          0,
          0,
          0
        ]
      }
    }
  ];


  var str = '<?xml version="1.0" encoding="utf-8"?> \n';
  str += '<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"> \n';
  str += '<plist version="1.0"> \n';
  str += '\t<dict>\n';
  str += '\t\t<key>frames</key> \n';
  str += '\t\t\t<dict> \n';

  //start key
  for(var i = 0; i < data.length; i++){
      var item = data[i];
    str += '\t\t\t\t<key>'+item.content.name+'</key>\n';
    str += '\t\t\t\t<dict>\n';
    str += ' \t\t\t\t\t<key>frame</key> \n';
    var rect = item.content.rect;
    str += '\t\t\t\t\t<string>{{'+rect[0]+','+rect[1]+'},{'+rect[2]+','+rect[3]+'}}</string> \n';
    str += '\t\t\t\t\t <key>offset</key> \n';
    var offset = item.content.offset;
    str += '\t\t\t\t\t<string>{'+offset[0]+','+offset[1]+'}</string> \n';
    str += '\t\t\t\t\t <key>rotated</key> \n';
    var rotated = item.content.rotated !== undefined && item.content.rotated == 1 ? "true" : "false";
    str += "\t\t\t\t\t<"+rotated+' /> \n' ;
    str += ' \t\t\t\t\t<key>sourceSize</key> \n';
    var originalSize = item.content.originalSize;
    str += '\t\t\t\t\t <string>{'+originalSize[0]+','+originalSize[1]+'}</string> \n';
    str += '\t\t\t\t</dict> \n';
    
    
  }
  
  str += '\t\t\t</dict> \n';
//end key
              str += '\t\t</dict> \n';
              str += '</plist> \n';
console.log(str);
fs.writeFileSync('raw.plist', str);