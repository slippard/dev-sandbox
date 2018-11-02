import { Client, Message, VoiceConnection, ClientUser, MessageReaction, Guild } from "discord.js";
import { Command } from "./command";
import User, { IUser } from './schemas/user';
import { Member } from './models/GuildMember';
import * as data from './config.json';
import { type } from "os";

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
        var devs = this.client.guilds.get('456775919990865920').members;
        /* devs.forEach(user => {
            user.roles.some('')
        }); */
        this.client.user.setPresence({
            status: "dnd",
            game: {
                name: 'Playing',
                type: "PLAYING",
            }
        })
        
        //this.client.user.setStatus("dnd");
    }

    public async handleMessage(message: Message) {
        new Member(message.author.username, message.author.id, message, this.client);
        new Command(message);
    }
}