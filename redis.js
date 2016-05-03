/**
 * Created by dell-bo on 2016/4/6.
 */
var redis = require('redis'),
    client = redis.createClient();
    client2 = redis.createClient();
    client3 = redis.createClient();
//扔一个瓶子
exports.throw = function(bottle ,callback){
    //先到3号数据库检查用户是否超过扔瓶子的次数
    client2.SELECT(3,function(){
        client2.get(bottle.owner,function(err,result){
            if(result > 10){
                return callback({code : 0 , msg : "今天扔瓶子的机会已经用完了"})
            }
            client2.INCR(bottle.owner,function(){
                client2.TTL(bottle.owner,function(err,ttl){
                    if(ttl === -1){
                        client2.EXPIRE(bottle.owner,86400)
                    }
                })
            })
            bottle.time = bottle.time || Date.now();
            //为每个漂流瓶子生成一个id
            var bottleId = bottle.time + Math.random().toString(16);
            var type = {male : 0 , female : 1};
            //根据漂流瓶类型的不同将漂流瓶存放在不同的数据库里
            client.SELECT(type[bottle.type],function(){
                //以hash类型保存漂流瓶对象
                client.HMSET(bottleId,bottle,function(err,result){
                    if(err){
                        return callback({code : 0 , msg : "过会儿再试试吧"})
                    }
                    //返回结果,成功返回 ok
                    callback({code : 1 , msg : result});
                    client.EXPIRE(bottleId,86400);
                })
            })
        })
    })
}
//捡一个瓶子
exports.pick = function(info , callback){
    client3.SELECT(4,function(){
        client3.GET(info.user,function(err,result){
            if(result > 10){
                callback({code : 0 , msg : "今天捡瓶子的机会已经用完"})
            }
            client3.INCR(info.user,function(){
                client3.TTL(info.user,function(err,ttl){
                    if(ttl === -1){
                        client3.EXPIRE(info.user,86400);
                    }
                })
            })
            var type ={all:Math.round(Math.random()),male : 0,female : 1};
            info.type = info.type || "all";
            client.SELECT(type[info.type],function(){
                client.RANDOMKEY(function(err,bottleId){
                    if(Math.random() <= 0.2){
                        res.json({code : 0, msg : "海星"});
                    }
                    client.HGETALL(bottleId,function(err,bottle){
                        if(err){
                            res.json({code : 0 , msg : "漂流瓶破损了..."})
                        }
                        callback({code : 0 , msg : bottle});
                        client.DEL(bottleId);
                    })
                })
            })
        })
    })
}
//扔回海里一个瓶子
exports.throwBack = function(bottle,callback){
    var type = {male : 0 , female : 1};
    var bottleId = bottle.time + Math.random().toString(16);
    client.SELECT(type[bottle.type],function(){
        client.hmset(bottleId,bottle,function(err,result){
            if(err){
                callback({code : 0 , msg : "过会儿再试试吧！"})
            }
            callback({code : 1 , msg : result})
            client.PEXPIRE(bottleId , bottle.time + 86400000 - Date.now());
        })
    })
}
