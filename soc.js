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
            var closeWorkers=workers.filter(c=>c.id==socket.id);
            workers=workers.filter(c=>c.id!=socket.id);
            closeWorkers.forEach(w=>{
                clients.forEach(c=>{
                    if(c.workerId==w.workerId){
                        c.socket.emit("workerOffline")
                    }
                })
            })
        });
        socket.on("helloClient", (arg) => {
            var c={id:socket.id, workerId:JSON.parse(arg).workerId, socket}
            clients.push(c);

            var ww=workers.filter(w=>w.workerId==c.workerId)
            if(ww.length>0)
                c.socket.emit("workerOnline")
            else
                c.socket.emit("workerOffline")

        });
        socket.on("helloWorker", (arg) => {
            var w={id:socket.id, workerId:workers.length+1, socket}
            workers.push(w)
            socket.emit("readyWorker", w.workerId);
            clients.forEach(c=>{
                if(c.workerId==w.workerId){
                    c.socket.emit("workerOnline")
                }
            })
        });
        socket.on("message", (arg) => {
            var r=JSON.parse(arg);

            workers.forEach(w=>{
                console.log(w.workerId,r.workerId);
                if(w.workerId==r.workerId) {
                    console.log("worker find", )
                    w.socket.emit(r.cmd);
                }
            })
        });
    })
}

module.exports = soc;