import { Client, Message, VoiceConnection, ClientUser, MessageReaction, Guild } from "discord.js";
import { Command } from "./command";
import User, { IUser } from './schemas/user';
import { Member } from './models/GuildMember';
import * as data from './config.json';

const config = (<any>data);

export class Bot {
    public client: Client;
    private token: string;

    constructor(token: string) {
        this.client = new Client();
        this.client.on('message', this.handleMessage.bind(this));
        this.client.on('ready', this.ready.bind(this));
        this.client.on('messageReactionAdd', this.reactionAdd.bind(this))
        this.token = token;
    }

    public async login() {
        return this.client.login(this.token);
    }

    public async reactionAdd(reaction: MessageReaction) {
        let emojiInfo = `${reaction.emoji.name} | ${reaction.emoji.id}`
        console.log(emojiInfo);
    }

    public async ready() {
        this.client.user.setPresence({
            afk: true,
            status: "dnd"
        })
        return this.client.user.setStatus('online');
    }

    public async handleMessage(message: Message) {
        new Member(message.author.username, message.author.id);
        new Command(message);
    }
}