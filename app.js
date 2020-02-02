const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;
const helmet = require('helmet');
var fs   = require('fs');
var counter =0;

app.use(helmet());

app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res) {
 res.sendFile(__dirname +'/public/index.html')
});

io.on('connection', function(socket){
    counter++;
    var name= '';
    socket.on('client_to_server_join', function (data) {
      name = data.name;
      console.log(name + "さんが入室しました。");
      io.emit('server_to_client_join', { join:name + "さんが入室しました。"+"チャットルームの参加人数が"+ counter+"人になりました。"});
  });
    socket.on('chat message', function(data){
      io.emit('chat message', {name:data.name,message:data.message});
    });
    socket.on('disconnect',function(){
      counter--;
      if (name == '') {
        console.log("サイトを離れました。");
    } else {
      io.emit('server_to_client_leaving',{leaving: name + 'さんが退室しました。'+ "チャットルームの参加人数が"+ counter+"人になりました。"});
      console.log(name + "さんが退室しました。");
    }
    });
  });



http.listen(PORT,function() {
    console.log('listening on' + PORT);
});