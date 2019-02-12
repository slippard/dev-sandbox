import { Message, RichEmbed, Emoji } from "discord.js";
import * as mongoose from 'mongoose';
import { config } from '../config';
import DUser, { IUser } from '../schemas/user';

export class Help {
    constructor(context: Message) {
        this.sendHelp(context); 
    }

    private sendHelp(context: Message) {
        context.delete();
        let helpEmbed = new RichEmbed()
            .setTitle('Get some help')
            .setDescription(`jk help yourself`)
        context.channel.send(helpEmbed);
    }
}

export class Random { 
    private context: Message;
    private max: number;
    constructor(context: Message) {
        this.context = context;
        this.max = parseInt(context.content.split('!ran')[1]);
        const errEmoji: Emoji = context.guild.emojis.find('name', 'thonk')
        if(this.max)this.getMax(this.max); else context.react(errEmoji);
    }
    private getMax(max: number) {
        const ran = Math.floor(Math.random() * (max - 1 + 1) + 1);  
        this.context.channel.send(`${ran}`);
    }
}

export class Pad {
    constructor(msg: Message) {
        msg.delete().then(() => {
            if (!String.prototype.padStart) {
                String.prototype.padStart = function padStart(targetLength, padString) {
                    targetLength = targetLength >> 0;
                    padString = String(typeof padString !== 'undefined' ? padString : ' ');
                    if (this.length >= targetLength) {
                        return String(this);
                    } else {
                        targetLength = targetLength - this.length;
                        if (targetLength > padString.length) {
                            padString += padString.repeat(targetLength / padString.length);
                        }
                        return padString.slice(0, targetLength) + String(this);
                    }
                };
            }
            const number = msg.content;
            const last4Digits = number.slice(-6);
            const maskedNumber = last4Digits.padStart(number.length, '*');
            msg.channel.send("```\n" + maskedNumber + "\n```");
        })
    }
}


export class Purge {
    constructor(context: Message) {
        DUser.findOne({ userid: context.author.id }, function (err, doc) {
            if (err) console.log('Error: ' + err);
            if (doc) {
                var amount = !!parseInt(context.content.split(' ')[1]) ? parseInt(context.content.split(' ')[1]) : parseInt(context.content.split(' ')[2])
                    let guildMember = context.member;
                    if (!amount || amount >= 100) return context.reply('Must specify an amount of messages to delete. Max 99.');
                    if (guildMember.roles.some(r => r.id === config.adminRole)) {
                        context.channel.fetchMessages({
                            limit: amount + 1,
                        }).then((msg: any) => {
                            context.channel.bulkDelete(msg).catch(error => console.log(error.stack));
                        });
                    } else {
                        context.channel.send('You do not have permission to purge in this channel.');
                    }
            }
        })   
    }
}

