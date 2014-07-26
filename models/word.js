var mongodb = require('./db');
var lineReader = require('line-reader');

function Word(word) {
    this.wordId = word.wordId;
    this.phonetic = word.phonetic;//音标
    this.word = word.word;//单词
    this.mean = word.mean;//含义
};

module.exports = Word;

//存储用户信息
Word.prototype.save = function(dbname,callback) {
  var word = {
    wordId: this.wordId,
    phonetic: this.phonetic,
    word: this.word,
    mean: this.mean
  };
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
       mongodb.close();
      return callback(err);//错误，返回 err 信息
    }
    //读取 users 集合
    db.collection(dbname, function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //将用户数据插入 users 集合
      collection.insert(word, {
        safe: true
      }, function (err, word) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        return callback(null);//成功！err 为 null，并返回存储后的用户文档
      });
    });
  });
};

//读取单词信息
Word.get = function(dbname,id, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 users 集合
    db.collection(dbname, function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //查找用户名（name键）值为 name 一个文档
      collection.findOne({
        wordId: id
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);//失败！返回 err
        }
        return callback(null, user);//成功！返回查询的用户信息
      });
    });
  });
};

//获取一篇文章
Word.getOne = function(dbname,wordid, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection(dbname, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //根据用户名、发表日期及文章名进行查询
            collection.findOne({
                wordId: wordid
            }, function (err, word) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                if(word){
                    mongodb.close();
                    callback(null, word);//返回查询的一篇文章
                }
            });
        });
    });
};

Word.getMaxNum = function(dbname,callback){
    mongodb.open(function (err,db){
        if(err){
            return callback(err);
        }
        console.log('111');
        db.collection(dbname,function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            console.log('222');
            collection.count({}, function (err, total) {

                if(err){
                    mongodb.close();
                    return callback(err);
                }
                console.log('333'+total);
                mongodb.close();
                return callback(null,total);
            });

        });
    });
};

Word.clear = function(dbname,callback){
    mongodb.open(function (err,db){
        if(err){
            return callback(err);
        }
        db.collection(dbname,function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            console.log('222');
            collection.remove({}, function (err) {

                if(err){
                    mongodb.close();
                    return callback(err);
                }
                mongodb.close();
                return callback(null);
            });

        });
    });
};

Word.skip = function(dbnme,id,callback) {
    mongodb.open(function (err,db){
        if(err){
            return callback(err);
        }
        db.collection(dbname,function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            console.log('222');
            collection.remove({}, function (err) {

                if(err){
                    mongodb.close();
                    return callback(err);
                }
                mongodb.close();
                return callback(null);
            });

        });
    });
};

Word.readLine = function(dbname,splitStr,callback){
    //四级
    var index = 0;
    lineReader.eachLine(dbname+'.txt', function(line, last, cb) {
        console.log(line);
        var text = line;

       if(splitStr=='[]')
       {
           arr = text.split('[');
           if(arr.length==2)
           {
               arr1 = arr[1].split(']');
               if(arr1.length == 2)
               {
                   arr[1] = arr1[0];
                   arr[2] = arr1[1];
               }
           }
       }else{
           arr = text.split(splitStr);
       }

        if(arr.length!=3)
        {
            console.log("error parse word");
            cb();
            return;
        }
        arr[1] = arr[1].trim();//.replace(new RegExp(",", "gm"), " ");
        console.log("|||||"+arr[0]+"|||||"+arr[1]+"||||||"+arr[2]);
        var word = new Word({
            phonetic: "/" + arr[1] + "/",
            mean: arr[2].trim(),
            word: arr[0].trim(),
            wordId: ++index
        });
        word.save(dbname,function (err) {
            if (err) {
                console.log("error save "+line+err);
                cb();
                return;
            }
            console.log('save ok');
            cb();
        });
        if (last) {
            cb(false);
            callback();
        }
    });
};