import * as mongoose from 'mongoose';
import { Message, Client, Channel, TextChannel } from 'discord.js';
import { config } from './../config';
import DUser, { IUser } from '../schemas/user';

mongoose.connect(config.dburl, { useNewUrlParser: true });

export class Member {
    private username: string;
    private userid: string;
    private bot: Client;
    constructor(username: string, userid: string, message: Message, bot: Client) {
        this.username = username;
        this.userid = userid;
        this.bot = bot;
        DUser.findOne({ userid: userid }, function (err, doc) {
            if (err) {
                console.log('Error: ' + err);
            } else if (!doc) {
                let user = new DUser();
                user.username = username;
                user.userid = userid;
                user.messageCount = 0; 
                user.bots = [];
                user.doctor = false; 
                user.dev = false;
                user.repositories = [];
                user.save(function (err) {
                    if (err) return console.log(err);
                    (bot.guilds.get(config.default_server).channels.get(config.modlog) as TextChannel).send(username + ' has been registered in the database.');
                })
            } else {
                DUser.updateOne({ userid: userid }, { $inc: { messageCount: 1 } }).then(function () { return })
            }
        })
    }

    public async isDoc(id: string) {
        var data = await this.bot.users.get(id).fetchProfile();
        console.log(data);
    }

}
