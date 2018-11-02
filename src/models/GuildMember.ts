import * as mongoose from 'mongoose';
import { Message, Client, Channel } from 'discord.js';
import * as data from './../config.json';
import DUser, { IUser } from '../schemas/user';
const config = (<any>data);

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
                var register: Channel;
                register = bot.channels.get('507488506113687562')
                user.username = username;
                user.userid = userid;
                user.messageCount = 0;
                user.bots = [];
                user.doctor = false;
                user.save(function (err) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(username + ' added to the database.');
                    }
                })
                message.channel.send(`New user registered`);
            } else {
                DUser.updateOne({ userid: userid }, { $inc: { messageCount: 1 } }).then(function () { return })
            }
        })
    }

    public async isDoc(id: string) {
        var data = this.bot.users.get(id).fetchProfile();
        console.log(data);
    }

    

}
