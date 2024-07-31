    // var UserModel = require("UserModel");
    var RestApi = {

        CallGet: function (api, data, callbackSuccess) {
            var url = api; //LINK_API + api;
            console.log("CallGet:"+url);
            let xhr = cc.loader.getXMLHttpRequest();//new XMLHttpRequest();
            xhr.open("GET", url, true);
            // xhr.setRequestHeader("Content-type", "application/json");
            // xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
            // xhr.setRequestHeader("Access-Control-Allow-Credentials", "true");
            // xhr.setRequestHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            // xhr.setRequestHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
            // if (UserModel.token != "")
            // {
            //     xhr.setRequestHeader("Authorization", "Bearer " + UserModel.token);
            // }
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    callbackSuccess(xhr.responseText);
                }
            };
            
            xhr.send();
        },

        CallPost: function (api, data, callbackSuccess, token = "") {
            // var url = LINK_API + api;
            var url =  api;
            console.log("CallPost:" + url + ":" + JSON.stringify(data));
            let xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            if (token != "")
            {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    console.log("Response Success:" + api + ":" + xhr.responseText);
                    callbackSuccess(xhr.responseText);
                }
            };
        
            xhr.send(JSON.stringify(data));
        }
    };

    module.exports = RestApi;