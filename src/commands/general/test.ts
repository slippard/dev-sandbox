import { Message } from "discord.js";

export class TestCommand {
    private author: string;
    private keyword: string;
    constructor(msg: string, cmd: string, context: Message) {
        this.author = context.author.id;
        this.keyword = msg.split(' ')[0];
        //context.channel.send('Author: ' + this.author + ' said: ' + msg)
        if(this.keyword) {
            switch(this.keyword) {
                case 'func': this.testFunc(context, msg); break
                case 'func2': this.testFunc2(context, msg); break
                case 'roles': this.getRoles(context, msg); break
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

    private getRoles(message: Message, msg: string) {
        let roles = message.mentions.roles;
        console.log(roles);
    }

    private testFunc(message: Message, msg: string) {
        return message.channel.send('func: ' + msg);
    }

    private testFunc2(message: Message, msg: string) {
        return message.channel.send('func2: ' + msg);
    }
    
}