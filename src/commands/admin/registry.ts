import { Message, User, Channel, CategoryChannel, Guild, GuildChannel } from "discord.js";
import * as data from './../../config.json';
const config = (<any>data);

export class Registry {
    private cat: GuildChannel; 
    private guild: Guild;
    private channel: GuildChannel;
    constructor(context: Message, msg: string) {
        let cmd = msg.split(' ')[1];
        console.log(cmd);
        switch (cmd) {
            case "create":
                console.log('Create');
                break;
            case "log": 
            this.guild = context.guild;
            this.channel = this.guild.channels.find("id", `${context.channel.id}`);
            context.channel.send("Channel: " + this.channel.name + ' POS: ' + this.channel.position + ' Parent: ' + this.channel.parent + ' Catagory: ' + this.channel.type);
                break;
            default:
                break;
        }
    }
}