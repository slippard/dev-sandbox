import { Message } from "discord.js";

export class TestCommand {
    private author: string;
    private keyword: string;
    private param: string;
    constructor(cmd: string, msg: string, context: Message) {
        this.author = context.author.id;
        this.keyword = msg.split(' ')[0];
        this.param = msg.split(' ')[1];
        //context.channel.send('Author: ' + this.author + ' said: ' + msg)
        if(this.keyword) {
            switch(this.keyword) {
                case 'roles': this.getRoles(context, msg, this.param); break

                default: console.log('default');
            }
        } else {
            context.channel.send('No keyword');
        }
        
        /* if(this.keyword == 'func') {
            this.testFunc(context)
        } else {
            context.channel.send('Constructor');
        } */
        //console.log(this.author + ': ' + this.msg)
    }

    private getRoles(message: Message, msg: string, param: string) {
        let role = message.guild.roles.get(param);
        let userlist: string = '';
        role.members.forEach(m => {
            userlist += `- ${m.user.username}#${m.user.discriminator}\n`;
        })
        let roledata = "```\n" + `Name: ${role.name}\nID: ${role.id}\nColor: ${role.color}\nUsers with role:\n${userlist}` + "```";
        message.channel.send(roledata);
    }
    
}