/**
 * Created by oye on 14-7-20.
 */
Word = require('./models/word.js');
var index = 0;
var wordsFile = ["four_words","six_words","gre_words","tuo_words"];
//console.log("text"+ text.replace(/,/,' '));

Word.clear(wordsFile[index++],function(err){
    if(err){
        console.log("error");
        return;
    }
    Word.clear(wordsFile[index++],function(err){
        if(err){
            console.log("error");
            return;
        }
        Word.clear(wordsFile[index++],function(err){
            if(err){
                console.log("error");
                return;
            }
            Word.clear(wordsFile[index++],function(err){
                if(err){
                    console.log("error");
                    return;
                }
                console.log("all clear ok");
                index = 0;
                var splitStr = ['/','/','[]','[]'];
                var index = 0;
                Word.readLine(wordsFile[index],splitStr[index],function(){
                    index++;
                    Word.readLine(wordsFile[index],splitStr[index],function() {
                        index++;
                        Word.readLine(wordsFile[index],splitStr[index],function() {
                            index++;
                            Word.readLine(wordsFile[index],splitStr[index],function() {
                                console.log("all finished");
                            });
                        });
                    });
                });

            });
        });
    });
});
