
var socket = io();
const User=prompt("Enter your name");
let date=new Date();
        let hour=date.getHours();
        let min=date.getMinutes();
        let ampm=hour>=12?"PM":"AM";
        hours = hour % 12 || 12;
        let time=hour+':'+ min +" "+ ampm;
let user={
    "name":User,
    "time":time
};
socket.emit('new-user-joined',user);

function update(users){
    const container=document.querySelector(".userinfo");
    container.innerHTML=``;
     users.forEach(ele => {
        container.innerHTML+=`<div class="user">${ele.name}</div>`
     });
}


socket.on('user-joined',(user)=>{
    document.querySelector(".massege-container").innerHTML+= `<div class="massege update"><span id='name'>${user.name}:</span> has joined the chat <span id="time">${user.time}</span></div>`;
})
socket.on('user-left',(user)=>{
    document.querySelector(".massege-container").innerHTML+= `<div class="massege update"><span id='name'>${user.name}:</span> has left the chat <span id="time">${user.time} </span></div>`;
})

document.querySelector("#btn").addEventListener("click",(e)=>{
    e.preventDefault();
    
    let inputmsg=document.querySelector("#input").value;
    if(inputmsg){
        let date=new Date();
        let hour=date.getHours();
        let min=date.getMinutes();
        let ampm=hour>=12?"PM":"AM";
        hours = hour % 12 || 12;
        let time=hour+':'+ min +" "+ ampm;
        let input={"massege":inputmsg,"time":time};
        document.querySelector(".massege-container").innerHTML+= `<div class="massege right"><span id='name'>You: </span>${inputmsg}<span id="time"> ${time} </span></div>`;
        document.querySelector("#input").value="";
        socket.emit('send',input);
    }
});
socket.on('recieve',(input)=>{
    document.querySelector(".massege-container").innerHTML+= `<div class="massege left"> <span id='name'>${input.name}:</span> ${input.massege} <span id="time">${input.time} </span></div>`;
});

socket.on('user-update',(users)=>{
    update(users);
})
