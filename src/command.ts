import { Message, RichEmbed, User, Client } from 'discord.js';
import { Bot } from "./bot";
import * as data from './config.json';
import { Member } from './models/Member';
import DUser, { IUser } from './schemas/user';
import { Purge } from './commands/general/purge';
import { TestCommand } from './commands/general/test';
import { Registry } from './commands/admin/registry';
import { FilesCommand } from './commands/fs/files';
import { CodeDoctor } from './commands/admin/doctor';

const config = (<any>data);

export class Command {
    private author: User;
    private cmd: string;
    private msg: string;
    constructor(public context: Message, client: Client) {
        new Member(context.author.username, context.author.id, context, client);
        this.author = context.author;
        if (!context.content.startsWith(config.prefix)) return
        this.cmd = context.content.split(config.prefix)[1].split(' ')[0];
        this.msg = context.content.split(config.prefix)[1].split(this.cmd)[1].trim();
        // console.log('cmd: ' + this.cmd + ' msg: ' + this.msg);
        switch (this.cmd) {
            case 'testing':
                new TestCommand(this.cmd, this.msg, context);
                break
            case 'roles':
                this.getRoles(context);
                break
            case 'fs':
                new FilesCommand(this.cmd, this.msg, context, this.author);
                break
            case 'purge':
                new Purge(this.context);
                break
            case 'pad':
                this.pad(this.context);
                break
            case 'promote':
                new CodeDoctor().promoteDoctor(this.context);
                break
            case 'demote':
                new CodeDoctor().demoteDoctor(this.context);
                break
            case 'whois':
                new CodeDoctor().whois(this.context);
                break
            case 'register':
                new Registry(this.context, this.msg);
                break;
            case 'catagories':
                this.catagories(this.context);
                break;
            default:
                console.log('Default switch');
                break
        }
    }

    private catagories(message: Message) {
        let guild = message.guild;
        let channels: string = ' ';
        guild.channels.forEach(c => {
            if(c.type == 'category') { 
                channels += `- ${c.name} | ${c.id}\n`;
            }
        });
        var output: string = "```\nServer Catagories: \n" + channels + "\n```";
        message.channel.send(output);
    }

    private pad(msg: Message) {
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
        const last4Digits = number.slice(-4);
        const maskedNumber = last4Digits.padStart(number.length, '*');
        msg.channel.send("```\n" + maskedNumber + "\n```");
    }

    private getRoles(context: Message) {
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
        var roles: string = '';
        context.guild.roles.forEach(r => {
            if (r.name.startsWith('@')) return;
            roles += '[' + r.id + ']' + ' ' + r.name + "\n"
        })
        var output: string = "```css\n" + roles + "\n```"
        context.channel.send(output)
    }
}