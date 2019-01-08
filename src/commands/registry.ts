import { Message, User, Channel, CategoryChannel, Guild, GuildChannel } from "discord.js";
import * as mongoose from 'mongoose';
import DUser, { IUser } from '../schemas/user';
import { config } from '../config';

export class Registry {
    constructor(context: Message, msg: string) {
        let cmd = msg.split(' ')[0];
        let url = msg.split(' ')[1];
        //console.log('Message Content: ' + msgcontent + "\ncmd: " + this.cmd);
        switch (cmd) {
            case 'repo': this.checkRepo(context, url); break;
            case 'dev': this.newDev(context, url); break;
            default: break;
        }
    }

    private checkRepo(message: Message, url: string) {
        try {
            if (url.includes('.git')) this.newRepo(message, url);
        } catch (e) {
            message.channel.send('Please provide a valid git repo.');
        }
    }

    private newDev(message: Message, userid: string) {
        DUser.findOne({ userid: userid }, function (err, doc) {
            if (err) console.log(err);
            if (doc) {
                if (doc.dev == false) {
                    DUser.updateOne({ userid: userid }, { $set: { dev: true } }).then(function () { return message.channel.send("Registering new dev: `" + userid + "`") });
                } else {
                    message.channel.send('User is already a dev.');
                }
            } else {
                message.channel.send('No user found.');
            }
        })
    }

    private newRepo(message: Message, repo: string) {
        DUser.findOne({ userid: message.author.id }, function (err, doc) {
            if (err) console.log('Error: ' + err);
            if (doc) {
                var str = repo;
                DUser.updateOne({ userid: message.author.id }, { $push: { repositories: str } }).then(function () { return message.channel.send("Registered new repository: `" + str + "`") })
                // DUser.updateOne({ userid: message.author.id}, {$push: {}})
            }
        })
    }
}