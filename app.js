const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
const helmet = require('helmet');
var fs   = require('fs');
var counter = 0; //接続者数を計算する変数

app.use(helmet());

app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res) {
 res.sendFile(__dirname +'/public/index.html')
});

io.on('connection', function(socket){
    counter++; // 入室したら接続者数を増やす
    var name= '';
    //入室時にデータを受け取る処理
    socket.on('client_to_server_join', function (data) {
      name = data.name;
      console.log(name + "さんが入室しました。");
      //クライアントに～さんが入室しましたメッセージと接続者数メッセージの送信
      io.emit('server_to_client_join', { join:name + "さんが入室しました。"+"チャットルームの参加人数が"+ counter+"人になりました。"});
  });
  　//チャットメッセージの受信と送信
    socket.on('chat message', function(data){
      io.emit('chat message', {name:data.name,message:data.message});
    });
    //チャットから接続切れた際の処理　
    socket.on('disconnect',function(){
      counter--;
      //名前を入力せずにサイトを離れた時
      if (name == '') {
        console.log("サイトを離れました。");
        //チャットを終え退室した時
    } else {
      io.emit('server_to_client_leaving',{leaving: name + 'さんが退室しました。'+ "チャットルームの参加人数が"+ counter+"人になりました。"});
      console.log(name + "さんが退室しました。");
    }
    });
  });



http.listen(PORT,function() {
    console.log('listening on' + PORT);
});