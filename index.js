const express = require('express');
const path=require('path');
const http = require('http');
const { Server } = require("socket.io");
const { stringify } = require('querystring');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const clientpath=path.join(__dirname,'/clint');
app.use(express.static(clientpath));
var users=[];

app.get('/', (req, res) => {
  res.sendFile(`${clientpath}/index.html`);
});

io.on('connection', (socket) => {
    socket.on('new-user-joined',(user)=>{
        let User={
            "id" : socket.id,
            "name": user.name
        };
        users.push(User);
        io.emit('user-update',users);
        socket.broadcast.emit('user-joined',user);
    });

    socket.on('disconnect', () => {
        // console.log(socket.id);
        let discuser;
        index = users.findIndex(x => x.id ===socket.id);
        if(index != -1){
            discuser=users.splice(index, 1)[0];
        }
        if(discuser){
          let date=new Date();
          let hour=date.getHours();
          let min=date.getMinutes();
          let ampm=hour>=12?"PM":"AM";
          hours = hour % 12 || 12;
          let time=hour+':'+ min +" "+ ampm;
          let msg={"name":discuser.name,"time":time};
            socket.broadcast.emit('user-left',msg);
        }
        io.emit('user-update',users);
      });

    socket.on('send',(input)=>{
        let name = users.find(x => x.id === socket.id).name;
        let msg={"name":name,"massege":input.massege,"time":input.time}
        socket.broadcast.emit('recieve',msg);
    });
  });

server.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});

