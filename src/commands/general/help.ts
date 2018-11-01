import {Message, RichEmbed} from "discord.js";

export class HelpCommand {

    constructor() {
    }

    public async sendHelp(context: Message) {
        context.delete();
        let helpEmbed = new RichEmbed()
                .setTitle('Get some help')
                .setDescription(`jk help yourself`)
        return context.channel.send(helpEmbed);
    }
}