import { Message, User, Channel, CategoryChannel, Guild, GuildChannel } from "discord.js";
import * as mongoose from 'mongoose';
import DUser, { IUser } from '../../schemas/user';
import * as data from './../../config.json';
const config = (<any>data);

export class Registry {
    constructor(context: Message, msg: string) {
        let cmd = msg.split(' ')[0];
        let url = msg.split(' ')[1];
        console.log('url: ' + url)
        // !register repo git@git.com
        //console.log('Message Content: ' + msgcontent + "\ncmd: " + this.cmd);
        switch (cmd) {
            case 'repo':
                try {
                    if (url.includes('.git')) this.newRepo(context, url);
                } catch (e) {
                    context.channel.send('Something went wrong.');
                }
                break;
            default:
                break;
        }

    }

    private newRepo(message: Message, repo: string) {
        DUser.findOne({ userid: message.author.id }, function (err, doc) {
            if (err) console.log('Error: ' + err);
            if (doc) {
                var str = repo;
                DUser.updateOne({ userid: message.author.id }, { $push: { repositories: str } }).then(function () { return message.channel.send("Registered new repository: `" + str + "`")})
                // DUser.updateOne({ userid: message.author.id}, {$push: {}})
            }
        })
    }
}