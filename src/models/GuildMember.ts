import * as mongoose from 'mongoose';
import { Message } from 'discord.js';
import * as data from './../config.json';
import DUser, { IUser } from '../schemas/user';
import { isUndefined, error } from 'util';
const config = (<any>data);

mongoose.connect(config.dburl, { useNewUrlParser: true });

export class Member {
    private username: string;
    private userid: string;

    constructor(username: string, userid: string) {
        this.username = username;
        this.userid = userid;
        DUser.findOne({ userid: userid }, function (err, doc) {
            if (err) {
                console.log('Error: ' + err);
            } else if (!doc) {
                let user = new DUser();
                user.username = username;
                user.userid = userid;
                user.messageCount = 0;
                user.doctor = false;
                user.save(function (err) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(username + ' added to the database.');
                    }
                })
            } else {
                DUser.updateOne({ userid: userid }, { $inc: { messageCount: 1 } }).then(function () { return })
            }
        })
    }

    

}
