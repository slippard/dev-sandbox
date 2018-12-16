import { Message } from 'discord.js';
import * as mongoose from 'mongoose';
import * as data from '../../config.json';
import DUser, { IUser } from '../../schemas/user';
const config = (<any>data);

export class Purge {
    constructor(message: Message) {

        DUser.findOne({ userid: message.author.id }, function (err, doc) {
            if (err) console.log('Error: ' + err);
            if (doc) {
                if(doc.doctor === true) {
                    var amount = !!parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2])
                    let guildMember = message.member;
                    if (!amount) return message.reply('Must specify an amount to delete!');
                    if (guildMember.roles.some(r => r.name === config.adminRole)) {
                        message.channel.fetchMessages({
                            limit: amount + 1,
                        }).then((msg: any) => {
                            message.channel.bulkDelete(msg).catch(error => console.log(error.stack));
                        });
                    } else {
                        message.channel.send('You do not have permission to purge in this channel.');
                    }
                } else {
                    return message.channel.send('You do not have permission to purge this channel.').then((m: Message) => {
                        setTimeout(() => {
                            m.delete();
                        }, 3000);
                    })
                }
                
            }
        })




    }
}