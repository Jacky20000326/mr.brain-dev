const room = require("./models/roomModel");
const SocketConnect = function(io){
    io.on("connection", (socket) => {

// all

    // 取得連線提示
    io.emit("connectInfo","The device is connecting");
    console.log("connect socket server");
    console.log("connect id is"+ socket.id);
    
    // 沒有連線提示
    socket.on("disconnect",()=>{
        io.emit("message","user have leave rom")
        console.log("user is leaving")
    }); 

// host 

    // host取得房間id(由前端提供)

    // host創建房間
        // 在此新建table的原因為要讓其他要加入的user可以透過roomId撈取資料庫的host設定的時間

    socket.on("createNewRoom",(roomId,UserId,hostSetTime)=>{
        room.create({
            roomId: roomId,
            creator: UserId,
            members: UserId,
            setTime : hostSetTime
        },(err,Data)=>{
            if(err){
                cosnole.log(err)
            }
            console.log(Data)
            socket.join(roomId)
        })
    });

    // start to study

    // socket.on("start",(isstart,roomId)=>{
    //     io.in(roomId).emit("startStudy","isstart")
    //     })




    

// companion

    //  加入房間
    socket.on("joinRoom",(roomID,userId)=>{
        // let clients = io.sockets.adapter.rooms[roomID]
        room.findRoom(roomID,(Room)=>{
            // 將使用者加到房間
            if(!Room){
                socket.emit("isJoin","false")
            }else{
                socket.emit("isJoin","true")
                Room.members.push(userId)
                Room.save()
                // 加房間
                socket.join(roomID)
            }
        });
    });






    // 得到host設定的時間
    socket.on("setTime",(roomId,timer)=>{
        room.findRoom(roomId,(Room)=>{
            Room.setTime = timer
            Room.save()
            io.emit("getTime",timer)
            })
        })
    });   

    // study successs

    // study false




}

module.exports = SocketConnect