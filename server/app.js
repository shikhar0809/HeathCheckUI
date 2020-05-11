/* var express = require('express'),
    http = require('http');
var app = express();
var server = http.createServer(app);
const io = require("socket.io")(server, {  
  handlePreflightRequest: (req, res) => {  
  const headers = {  
  "Access-Control-Allow-Headers": "Content-Type, Authorization",  
  "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,  
  "Access-Control-Allow-Credentials": true  
  };  
  res.writeHead(200, headers);  
  res.end();  
  }  
  });  
  io.on("connection", () => {
  console.log("Connected!");
  });  
  server.listen(4444);
//io.origins('*:*');
 */

const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
let protoParams;
const GRPCClient = require("node-grpc-client");
let myClient;
var fs = require("fs");

http.listen(4444, () => {
  console.log("*******Node Socket Server Started*********");
});

io.on("connection", (socket) => {
  function grpcCheck() {
    const path = require("path");
    try {
      if (fs.existsSync(__dirname + "/ProtoFiles/" + protoParam.fileName)) {
        const PROTO_PATH = path.resolve(
          __dirname,
          __dirname + "/ProtoFiles/" + protoParam.fileName
        );

        myClient = new GRPCClient(
          PROTO_PATH,
          protoParam.packageName,
          protoParam.serviceName,
          "localhost:50083"
        );

        if (PROTO_PATH && myClient) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  socket.on("checkService", (req) => {
    protoParam = req;
    console.log(req);
    if (grpcCheck()) {
      socket.emit("serviceCheck", true);
    } else {
      socket.emit("serviceCheck", false);
    }
  });

  socket.on("protoConfig", (req) => {
    protoParam = req;
    grpcCheck();
    console.log(protoParam);
  });

  socket.on("msgBody", (req) => {
    if (true) {
      // console.log(req.body);
      let dataToSend = {};
      dataToSend = req.jsonMsg;

      if (protoParam.streamType === "Unary Streaming") {
        myClient.runService(
          protoParam.methodName,
          dataToSend,
          (err, response) => {
            console.log("Service response ", response);
            socket.emit("msgResponse", { body: response, request: req });
            // app.get('/protoResult', (req, res) => res.send({ body: response }));
          }
        );
      }
      if (protoParam.streamType === "Clientside Streaming") {
        
        console.log(protoParam);
        console.log(dataToSend);
        myClient.runService(
          protoParam.methodName,
          dataToSend,
          (err, response) => {
            console.log("Service response ", response);
            socket.emit("msgResponse", { body: response, request: req });
            //app.get('/protoResult', (req, res) => res.send({ body: response }));

            /* let streamMethod = protoParam.methodName + "Async";
        myClient[streamMethod](dataToSend, (err, res) => {
          console.log("Service response ", res);
          socket.emit("msgResponse", { body: response,  request: req }); */
          console/log(err);
          }
        );
      } else if (protoParam.streamType === "Serverside Streaming") {
        console.log(protoParam.streamType);
        let streamMethod = protoParam.methodName + "Stream";
        const stream = myClient[streamMethod](dataToSend);
        stream.on("data", (data) => {
          console.log(data);
          socket.emit("msgResponse", { body: data, request: req });
          // app.get('/protoResult', (req, res) => res.send({ body: data }));
        });
      } else if (protoParam.streamType === "Bi Directional Streaming") {
        console.log(protoParam);
        console.log(dataToSend);
        let streamMethod = protoParam.methodName + "Stream";
        const stream = myClient[streamMethod](dataToSend);
        stream.on("data", (data) => {
          console.log(data);
          socket.emit("msgResponse", { body: data, request: req });
          // app.get('/protoResult', (req, res) => res.send({ body: data }));
        });
      }

      // res.send({ body: req.body });
    }
  });
});
