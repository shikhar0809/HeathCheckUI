
const express = require('express');
const GRPCClient = require('node-grpc-client');
const appNode = express();
var protoParameter;
let myClient;
let protoValues;


appNode.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    console.log(`${req.ip} ${req.method} ${req.url}`);
    next();
  }
});

 const setProtoValues = () => {
  protoValues = this.protoParameter;
}

const getProtoValues = () => protoValues;

 module.exports = { setProtoValues, getProtoValues};

appNode.use(express.json());

function grpcCheck() {
  const path = require('path');
  const PROTO_PATH = path.resolve(
    __dirname,
    __dirname + '/ProtoFiles/' + protoParameter.fileName
  );

  myClient = new GRPCClient(
    PROTO_PATH,
    protoParameter.packageName,
    protoParameter.serviceName,
    'localhost:50083'
  );

  if (PROTO_PATH && myClient) {
    return true;
  } else { 
    return false;
  }
}

appNode.post('/checkService', (req, res) => {
    protoParameter = req.body;
    if (grpcCheck()) {
        res.send(true);
    } else {
        res.send(false);
    }

    //module.exports = {protoParameter, myClient} ;

});

appNode.post('/protoConfig', (req, res) => {
  protoParameter = req.body;
  res.send({ body: req.body });
  const check = grpcCheck();
});

appNode.post('/msgBody', (req, res) => {
  if (grpcCheck()) {
    // console.log(req.body);
    let dataToSend = {};
    dataToSend = req.body.jsonMsg;
    // console.log(dataToSend);

    if (protoParameter.streamType === 'Unary Streaming') {
      myClient.runService(
        protoParameter.methodName,
        dataToSend,
        (err, response) => {
          console.log('Service response ', response);
          res.send({body: response});
          appNode.get('/protoResult', (req, res) => res.send({ body: response }));
        }
      );
    }
    else if (protoParameter.streamType === 'Clientside Streaming') {
        myClient.runService(
          protoParameter.methodName,
          dataToSend,
          (err, response) => {
            console.log('Service response ', response);
             res.send({body: response});
            appNode.get('/protoResult', (req, res) => res.send({ body: response }));
          }
        );
    } else if( protoParameter.streamType === 'Serverside Streaming' ) {

      let streamMethod = protoParameter.methodName + 'Stream';
      const stream = myClient[streamMethod](dataToSend);
      stream.on('data', (data) => {
        console.log(data);
        res.pipe({body: data});
       // app.get('/protoResult', (req, res) => res.send({ body: data }));
      });
    } else if (protoParameter.streamType === 'Bi Directional Streaming') {

    }

    // res.send({ body: req.body });
  }
});

appNode.listen(3000, '127.0.0.1', function () {
  console.log('node server has started');
});
