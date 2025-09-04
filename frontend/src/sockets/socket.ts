// import { io, Socket } from "socket.io-client";

// const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// export const socket: Socket = io(SOCKET_URL, {
//   transports: ["websocket"],
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000,
// });

// socket.on("connect", () => {
//   console.log(" Connected to socket:", socket.id);
// });

// socket.on("disconnect", () => {
//   console.log(" Disconnected from socket");
// });

// export default socket;

 import { io, Socket } from "socket.io-client";

 const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:4001";

 export const socket:Socket=io(SOCKET_URL,{
  transports:["websocket"],
  reconnection:true,
  reconnectionAttempts:5,
  reconnectionDelay:1000
 })

 socket.on('connect',()=>{
   console.log(" Connected to socket:", socket.id);
 })

 socket.on('disconnect',()=>{
     console.log(" Disconnected from socket");
 })

  export default socket;
