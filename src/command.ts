import { Message, RichEmbed, User, Client } from 'discord.js';
import { Bot } from "./bot";
import { config } from './config';
import { Member } from './models/Member';
import DUser, { IUser } from './schemas/user';
import { Help, Random, Purge, Pad } from './commands/general';
import { LsCommand } from './commands/ls';
import { Registry } from './commands/registry';
import { FilesCommand } from './commands/files';
import { CodeDoctor } from './commands/doctor';

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
        console.log('cmd: ' + this.cmd + ' msg: ' + this.msg);
        switch (this.cmd) {
            case 'ls': new LsCommand(this.cmd, this.msg, context); break
            // case 'fs': new FilesCommand(this.cmd, this.msg, context, this.author); break
            case 'help': new Help(context); break
            case 'ran': new Random(context); break
            case 'purge': new Purge(this.context); break
            case 'pad': new Pad(this.context); break
            case 'promote': new CodeDoctor().promoteDoctor(this.context); break
            case 'demote': new CodeDoctor().demoteDoctor(this.context); break
            case 'whois': new CodeDoctor().whois(this.context); break
            case 'register': new Registry(this.context, this.msg); break;
            case 'updatemembers': this.update(this.context, client); break;
            default: console.log('Default switch'); break
        }
    }

    private async update(message: Message, client: Client) {
        await message.guild.members.forEach(m => {
            DUser.countDocuments({userid: m.user.id}, (err, count) => {
                if(count >= 1) {
                    return
                } else {
                    new Member(m.user.username, m.user.id, message, client); 
                }
            })
        });
        
    }

    
}