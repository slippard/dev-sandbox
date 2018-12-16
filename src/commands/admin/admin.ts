import { Message, User } from "discord.js";
import * as data from './../../config.json';
import { Registry } from './registry';
const config = (<any>data);

export class AdminCommand {
    private author: User;
    private command: string;
    constructor(cmd: string, msg: string, context: Message) {
        this.author = context.author;
        this.command = msg.split(' ')[0];
        console.log('cmd: ' + cmd + " msg: " + msg)
        if (this.command) {
            switch (this.command) {
                // case 'add': this.addDoctor(context, msg, this.author); break
                case 'remove': this.removeDoctor(context, msg); break
                case 'register': new Registry(context, msg); break
                default: context.channel.send('No admin param found.');
            }
        } else {
            context.channel.send('No command');
        }
    }

    

    private removeDoctor(message: Message, msg: string) {
        let guildMember = message.member;
        let target = message.mentions.members.first();
        if (target) {
            if (guildMember.roles.some(r => r.id == '456920159441911808')) {
                if (!target.roles.some((r => r.id == '460452397538476032'))) {
                    return message.channel.send('User is already a code doctor.');
                } else {
                    target.removeRole('460452397538476032');
                    message.channel.send('Removing role from: ' + target.user.username);
                }
            } else {
                return message.channel.send('Not allowed');
            }
        } else {
            return message.channel.send('Mention the member to be promoted to code doctor.');
        }
    }

}