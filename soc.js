const {Server} = require("socket.io");

class soc {

    workers = [];
    clients = [];

    constructor(server) {
        var io = new Server(server, { /* options */});
        io.on('connection', (socket) => {
            var workerId = 0;
            socket.on('disconnect', () => {
                console.log("disconnect", socket.id);
                this.clients = this.clients.filter(c => c.id != socket.id);
                var closeWorkers = this.workers.filter(c => c.id == socket.id);
                this.workers = this.workers.filter(c => c.id != socket.id);
                closeWorkers.forEach(w => {
                    this.clients.forEach(c => {
                        if (c.workerId == w.workerId) {
                            c.socket.emit("workerOffline")
                        }
                    })
                })
            });
            socket.on("helloClient", (arg) => {
                var c = {id: socket.id, workerId: JSON.parse(arg).workerId, socket}
                this.clients.push(c);

                var ww = this.workers.filter(w => w.workerId == c.workerId)
                if (ww.length > 0)
                    c.socket.emit("workerOnline")
                else
                    c.socket.emit("workerOffline")

            });
            socket.on("helloWorker", (arg) => {
                var w = {id: socket.id, workerId: this.workers.length + 1, socket}
                this.workers.push(w)
                socket.emit("readyWorker", w.workerId);
                this.clients.forEach(c => {
                    if (c.workerId == w.workerId) {
                        c.socket.emit("workerOnline")
                    }
                })
            });

            socket.on("timerTick", (arg) => {
                var w = this.workers.filter(ww => {
                    return ww.socket.id == socket.id
                });
                w.forEach(ww => {
                    this.clients.forEach(c => {
                        if (ww.workerId == c.workerId) {
                            c.socket.emit("timerTick", arg)
                        }
                    })
                })
            });
            socket.on("timerStop", (arg) => {
                var w = this.workers.filter(ww => {
                    return ww.socket.id == socket.id
                });
                w.forEach(ww => {
                    this.clients.forEach(c => {
                        if (ww.workerId == c.workerId) {
                            c.socket.emit("timerStop", arg)
                        }
                    })
                })
            });

            socket.on("message", (arg) => {
                var r = JSON.parse(arg);

                this.workers.forEach(w => {
                    if (w.workerId == r.workerId) {
                        console.log("worker ",r.cmd);
                        w.socket.emit(r.cmd);
                    }
                })
            });
        })
    }
    next=function (id){
        this.workers.forEach(w => {
            if (w.workerId == id) {
                w.socket.emit(JSON.stringify({workerId:id, cmd:"r"}));
            }
        })
    }
    pre=function (id){
        this.workers.forEach(w => {
            if (w.workerId == id) {
                console.log("pre api",JSON.stringify({workerId:id, cmd:"l"} ));
                w.socket.emit(JSON.stringify({workerId:id, cmd:"l"}));
            }
        })
    }


}

module.exports = soc;