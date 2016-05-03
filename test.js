/**
 * Created by dell-bo on 2016/4/6.
 */
var request = require('request');
for(var i = 1; i < 6; i ++){
    (function(i){
        request.post({
            url : "http://127.0.0.1:3000",
            json : {"owner" : "bottle" + i , "type" : "male" ,"content" : "content" + i}

        })
    })(i)
}
for(var i = 5; i >= 0 ; i --){
    (function(i){
        request.post({
            url : "http://127.0.0.1:3000",
            json : {"owner" : "bottle" + i , "type" : "female" ,"content" : "content" + i}

        })
    })(i)
}