import { Client } from 'discord.js';
import { Bot } from "./bot";
import * as mongoose from 'mongoose';
import * as data from './config.json';

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