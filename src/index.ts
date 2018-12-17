import { Client } from 'discord.js';
import { Bot } from "./bot";
import * as mongoose from 'mongoose';
import * as data from './config.json';
import { Socket } from 'net';

var io = require('socket.io').listen(1337);

io.sockets.on('connection', function (socket: Socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

const config = (<any>data);
export const db = mongoose.connection;

mongoose.connect(config.dburl, { useNewUrlParser: true });

new Bot(config.token).login().then(() => console.log('Sandbox online')).catch(err => {
    console.log('Login failed: ' + err);
});

db.on('error', function (err: any) {
    console.log('Error connecting to mongo db: ' + err);
});

db.once('open', function () {
    console.log('Connected to mongo database.');
})