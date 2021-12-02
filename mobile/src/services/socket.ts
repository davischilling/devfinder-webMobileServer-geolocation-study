import { io } from "socket.io-client";

const socket = io("http://192.168.0.120:3333", {
  autoConnect: false,
});

export const subscribeToNewDev = (subscribeFunction: any) => {
  socket.on("new-dev", subscribeFunction);
};

export const connect = (latitude: string, longitude: string, techs: string) => {
  socket.io.opts.query = {
    latitude,
    longitude,
    techs,
  };

  socket.connect();

  socket.on("message", (text: string) => {
    console.log(text);
  });
};

export const disconnect = () => {
  socket.connected && socket.disconnect();
};
