import { Client, Message, VoiceConnection, ClientUser, MessageReaction, Guild, TextChannel, Channel, Emoji } from "discord.js";
import { Command } from "./command";
import User, { IUser } from './schemas/user';
import { Member } from './models/Member';
import * as data from './config.json';

const config = (<any>data);

export class Bot {
    public client: Client;
    private token: string;

    constructor(token: string) {
        this.client = new Client();
        this.client.on('message', this.handleMessage.bind(this));
        this.client.on('ready', this.ready.bind(this));
        this.client.on('emojiCreate', this.newEmoji.bind(this));
        this.client.on('messageReactionAdd', this.reactionAdd.bind(this));
        this.token = token;
    }

    public async login() {
        return this.client.login(this.token);
    }

    private reactionAdd(reaction: MessageReaction) {
        let emojiInfo = `${reaction.emoji.name} | ${reaction.emoji.id}`
        // console.log(emojiInfo);
    }

    private newEmoji(emoji: Emoji) {
        (this.client.guilds.get('456775919990865920').channels.get('509789262020083712') as TextChannel)
        .send('New emoji: ' + `${emoji.url}`);
    }

    private ready() {
        var guild = this.client.guilds.get('456775919990865920');
        var devsOnline: number = 0;
        guild.members.forEach(m => {
            if(m.roles.get('493012268733431812')) devsOnline++;
        })
        this.client.user.setPresence({
            status: "dnd",
            game: {
                name: `Serving ${devsOnline} devs`,
                type: "PLAYING",
            }
        })
    }

    private async handleMessage(message: Message) {
        new Command(message, this.client);
    }
}