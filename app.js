/**
 * Created by dell-bo on 2016/4/6.
 */
var express = require('express');
var redis = require('./redis');
var mongodb = require('mongoose');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//扔一个瓶子
app.post('/',function(req,res){
    if(!(req.body.owner && req.body.type && req.body.content)){
        if(req.body.type && (['male',"female"].indexOf(req.body.type) == -1)){
            return res.json({code : 0, msg : "类型错误"});
        }
        return res.json({code : 0, msg : "信息不完整"});
    }
    redis.throw(req.body,function(result){
        res.json(result);
    });
});
//捡一个瓶子
app.get('/',function(req,res){
    if(!req.query.user){
        return res.json({code : 0 , msg : "信息不完整"});
    }
    if(req.query.type && (['male' , 'female'].indexOf(req.query.type) === -1)){
        return res.json({code : 0 , msg : "类型错误"});
    }
    redis.pick(req.query,function(result){
       if(result.code ===1){
           mongodb.save(req.query.user,result.msg,function(err){
               if(err){
                   return res.json({code : 0 , msg : "获取漂流瓶失败，请重试"})
               }
               return res.json(result);
           })

       }
        res.json(result);
    })
})
//扔回海里一个瓶子
app.post('/back',function(req,res){
    redis.throwBack(req.body,function(result){
        res.json(result)
    })
})
//获取一个用户所有的漂流瓶
app.get('/user/:user',function(req,res){
    mongodb.getAll(req.params.user , function(result){
        res.json(result);
    })
})
//获取指定id的漂流瓶
app.get('/bottle/:id',function(req,res){
    mongodb.getOne(req.params._id,function(result){
        res.json(result);
    })
})
//回复指定id的漂流瓶
app.post('reply/:id',function(req,res){
    if(!(req.body.user && req.body.content)){
        return callback({code : 0 , msg : "回复信息不完整！"})
    }
    mongodb.reply(req.params._id , req.body , function(result){
        res.json(result);
    })
})
//删除指定id的漂流瓶
app.get('/delete/:id',function(req , res){
    mongodb.delete(req.params._id,function(result){
        res.json(result);
    })
})
app.listen(3000);
