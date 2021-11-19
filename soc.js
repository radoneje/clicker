const {Server} = require("socket.io");
let soc=function (server){

    const io = new Server(server, { /* options */ });
    var workers=[];
    var clients=[];
    io.on('connection', function(socket) {
        console.log('Client connected to the WebSocket');
        socket.on('disconnect', () => {
            console.log("disconnect", socket.id);
            clients=clients.filter(c=>c.id!=socket.id);
            workers=clients.filter(c=>c.id!=socket.id);
        });
        socket.on("helloClient", (arg) => {
            clients.push({id:socket.id, workerId:JSON.parse(arg).workerId})
        });
    })
}

module.exports = soc;