import { Message, RichEmbed, User } from 'discord.js';
import { Bot } from "./bot";
import * as data from './config.json';
import { Member } from './models/GuildMember';
import DUser, { IUser } from './schemas/user';

import { TestCommand } from './commands/general/test';
import { AdminCommand } from './commands/admin/admin';
import { FilesCommand } from './commands/fs/files';

const config = (<any>data);

export class Command {
    private author: User;
    private cmd: string;
    private msg: string;
    constructor(public context: Message) {
        this.author = context.author;
        if(!context.content.startsWith(config.prefix)) return
        this.cmd = context.content.split(config.prefix)[1].split(' ')[0];
        this.msg = context.content.split(config.prefix)[1].split(this.cmd)[1].trim();
        switch(this.cmd) {
            case 'testing':
                new TestCommand(this.cmd, this.msg, context);
                break
            case 'admin': 
                new AdminCommand(this.cmd, this.msg, context);
                break
            case 'roles':
                //console.log('cmd: ' + this.cmd + ' msg: ' + this.msg)
                var roles: string = '';
                context.guild.roles.forEach(r => {
                    roles += r.name + ' | ' + r.id + "\n"
                    //roles += `**${r.name}** | ${r.id}\n`
                })
                var output: string = "```" + roles + "```"
                context.channel.send(output)
                break
            case 'fs':
                new FilesCommand(this.cmd, this.msg, context, this.author);
                break
            default: 
                console.log('Default switch');
                break
        }
    }
}