const express = require("express");
const app = express();
const http = require("http")
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require("mongoose");
const dotenv = require("dotenv")
dotenv.config()
const bodyParser = require('body-parser');
const AuthRoute = require("./routes/index").Auth
const store = require("./routes/index").store
const interactive = require("./routes/index").interactive
const room = require("./models/roomModel")
const authentication =  require("./config/passport")
const SocketConnect = require("./socketIo");
const port = process.env.PORT || 3002


// connect cosmos db
// mongoose.connect("mongodb://"+process.env.COSMOSDB_HOST+":"+process.env.COSMOSDB_PORT+"/"+process.env.COSMOSDB_DBNAME+"?ssl=true&replicaSet=globaldb", {
//   auth: {
//     user: process.env.COSMOSDB_USER,
//     password: process.env.COSMOSDB_PASSWORD
//   },
// useNewUrlParser: true,
// useUnifiedTopology: true,
// retryWrites: false
// })
// .then(() => console.log('Connection to CosmosDB successful'))
// .catch((err) => console.error(err));

// mongo atlas connect
mongoose.connect("mongodb+srv://778899:778899password@1014db.72drx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { 
    useUnifiedTopology: true,
    useNewUrlParser: true, 
}).then(()=>{
    console.log("success to connect to mongodb atlas")
}).catch((err)=>{
    console.log(err)
})




// middlewares
app.use(bodyParser.urlencoded({ extended: false }))
app.use("/api/auth",AuthRoute)
app.use("/api/interactive",interactive)
app.use("/api/store",store)
app.use('/api/passport',authentication)
app.use('/api/room',room)


SocketConnect(io)



server.listen(port,()=>{
    console.log(`It's port ${port} `);
})








