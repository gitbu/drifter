/**
 * Created by dell-bo on 2016/4/6.
 */
var mongoose = require('mongoose');
var bottleModel = mongoose.model('Bottle',new mongoose.Schema(
        {
            bottle:Array,
            message : Array
        },
        {
            collections : 'bottles'
        }
))
//讲用户捡到漂流瓶改变格式保存
exports.save = function(picker , _bottle , callback){
    var bottle = {bottle : [] , message : []};
    bottle.bottle.push(picker);
    bottle.message.push([_bottle.owner , _bottle.time , _bottle.content]);
    bottle = new bottleModel(bottle);
    bottle.save(function(err){
        callback(err);
    })
}
//获取用户捡到的所有漂流瓶
exports.getAll = function(user , callback){
    bottleModel.find({"bottle" : user},function(err,bottles){
        if(err){
            return callback({code : 0 , msg : "获取漂流瓶失败..."})
        }
        callback({code : 1 , msg : bottles})
    })
}
//获取特定id的漂流瓶
exports.getOne = function(_id , callback){
    bottleModel.findById(_id,function(err , bottle){
        if(err){
            return callback({code : 0 , msg : "读取漂流瓶失败..."})
        }
        callback({code : 1 , msg : bottle})
    })
}
//回复特定的id的漂流瓶
exports.reply = function(_id , reply ,callback){
    reply.time = reply.time || Date.now();
    bottleModel.findById(_id , function(err , _bottle){
        if(err){
            return callback({code : 0 , msg : "回复漂流瓶失败..."})
        }
        var newBottle={};
        newBottle.bottle = _bottle.bottle;
        newBottle.message = _bottle.message;
        if(newBottle.bottle.length ===1){
            newBottle.bottle.push(_bottle.message[0][0]);
        }
        newBottle.message.push([reply.user , reply.time , reply.content]);
        bottleModel.findByIdAndUpdate(_id , newBottle , function(err , bottle){
            if(err){
                return callback({code : 0,msg : "回复漂流瓶失败..."})
            }
            callback({code : 1 , msg : bottle});
        })
    })
}
//删除id指定的漂流瓶
exports.delete = function(_id , callback){
    bottleModel.findOneAndUpdate(_id , function(err){
        if(err){
            return callback({code : 0 , msg : "删除漂流瓶失败..."})
        }
        callback({code : 1 , msg : "删除成功！"});
    })
}