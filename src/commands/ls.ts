import { Message } from "discord.js";
import { userInfo } from "os";

export class LsCommand {
    private author: string;
    private keyword: string;
    private param: string;
    constructor(cmd: string, msg: string, context: Message) {
        this.author = context.author.id;
        this.keyword = msg.split(' ')[0];
        this.param = msg.split(' ')[1];
        //context.channel.send('Author: ' + this.author + ' said: ' + msg);
        if (this.keyword) {
            switch (this.keyword) {
                case 'rolemembers': this.getRoleMembers(context, msg, this.param); break
                case 'roles': this.listRoles(context); break
                case 'members': this.getMembers(context, msg, this.param); break
                case 'cat': this.getCatagories(context); break
            }
        } else {
            context.channel.send('No keyword');
        }
    }

    private getCatagories(message: Message) {
        let guild = message.guild;
        let channels: string = ' ';
        guild.channels.forEach(c => {
            if (c.type == 'category') {
                channels += `- ${c.name} | ${c.id}\n`;
            }
        });
        var output: string = "```\nServer Catagories: \n" + channels + "\n```";
        message.channel.send(output);
    }

    private getMembers(message: Message, msg: string, param: string) {
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
        var members: string = '';
        message.guild.members.forEach(r => {
            const number = r.user.id;
            const last4Digits = number.slice(-4);
            const maskedNumber = last4Digits.padStart(number.length, '*');
            members += '[' + r.user.id + ']' + ' ' + r.user.username + "\n"
        })
        var output: string = "```css\n" + members + "\n```"
        message.channel.send(output)
    }

    private getRoleMembers(message: Message, msg: string, param: string) {
        if (param) {
            let role = message.guild.roles.get(param);
            let userlist: string = '';
            role.members.forEach(m => {
                userlist += `- ${m.user.username}#${m.user.discriminator}\n`;
            })
            let roledata = "```\n" + `Name: ${role.name}\nID: ${role.id}\nColor: ${role.color}\nUsers with role:\n${userlist}` + "```";
            message.channel.send(roledata);
        } else {
            return message.channel.send("Provide a role ID to search. Use `!roles` to get role IDs.");
        }
    }

    private listRoles(message: Message) {
        const guild = message.guild;
        var roles: string = ''; 
        guild.roles.forEach(r => {
            roles += `${r.name} | ${r.id}\n`;
        })
        message.channel.send("```\n" + roles + "```");
    }

}