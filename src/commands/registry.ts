import { Message, User, Channel, CategoryChannel, Guild, GuildChannel, PermissionObject, ChannelResolvable } from "discord.js";
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
            case 'channel': this.createChannel(context, url); break
            default: break;
        }
    }

    private async createChannel(message: Message, url: string){
        let target = url;
        DUser.findOne({userid: target}, async (err, doc) => {
            if(err) console.log(err);
            if(doc) {
                if(doc.channels) return message.channel.send('User already has a private channel.');
                try {
                    var guild: Guild = message.guild;
                    var owner = guild.members.get(target);
                    var perm: PermissionObject = {
                        'VIEW_CHANNEL': true,
                        'CONNECT': true,
                        'READ_MESSAGES': true,
                    };
                    let newChannel = await guild.createChannel(doc.username, 'text');
                    await newChannel.overwritePermissions(guild.roles.get('456775919990865920'), {'VIEW_CHANNEL': false});
                    await newChannel.overwritePermissions(owner, perm);
                    await DUser.updateOne({ userid: target }, { $set: { channels: true }}).then(function () { return message.channel.send('New channel created') })
                    } catch (error) {
                        message.channel.send('Something went wrong!\n' + error);
                    }
            } else {
                return message.channel.send('Please provide a valid user ID.');
            }
        })
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