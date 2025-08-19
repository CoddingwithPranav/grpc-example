import path from 'path';
import * as grpc from '@grpc/grpc-js';
import type { GrpcObject, ServiceClientConstructor } from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './generated/a';
import { AddressBookServiceHandlers } from './generated/AddressBookService';


const packageDefinition = protoLoader.loadSync(path.join(__dirname, './a.proto'));

const personProto = (grpc.loadPackageDefinition(packageDefinition) as unknown) as ProtoGrpcType;

const PERSONS = [
    {
        name: "harkirat",
        age: 45
    },
    {
      name: "raman",
      age: 45
    },
];



//const app = express()
const server = new grpc.Server();

const handler:AddressBookServiceHandlers ={
  AddPerson: (call, callback) => {
    let person = {
      name: call.request.name,
      age: call.request.age
    }
    PERSONS.push(person);
    callback(null, person)  //argument = error , response
  },
  GetPersonByName: (call, callback)=>{
      const person = PERSONS.find(p => p.name === call.request.name);
  if (person) {
    callback(null, person);
  } else {
    callback({
      code: grpc.status.NOT_FOUND,
      details: "Person not asdfound"
    });
  }
  }
}


//app.use()
server.addService(personProto.AddressBookService.service, handler);

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});



///❯ ./node_modules/@grpc/proto-loader/build/bin/proto-loader-gen-types.js  --longs=String --enums=String --defaults --oneofs --grpcLib=@grpc/grpc-js --outDir=generated src/a.proto
//to generate types