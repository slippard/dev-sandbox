import { Client, Message, VoiceConnection, ClientUser, MessageReaction, Guild, TextChannel, Channel, Emoji } from "discord.js";
import { Command } from "./command";
import User, { IUser } from './schemas/user';
import { Member } from './models/Member';
import * as net from 'net';
import { config } from './config';
import DUser from "./schemas/user";

export class Bot {
    public client: Client;
    private token: string;

    constructor(token: string) {
        this.client = new Client();
        this.client.on('message', this.handleMessage.bind(this)); 
        this.client.on('ready', this.ready.bind(this));
        this.client.on('emojiCreate', this.newEmoji.bind(this));
        this.client.on('messageReactionAdd', this.reactionAdd.bind(this));
        this.client.on('error', this.reboot.bind(this));
        this.token = token;
    }

    public async reboot() {
        await this.client.destroy();
        setTimeout(() => {
            this.login();
        }, 3000);
    }

    public async login() {
        return this.client.login(this.token);
    }

    private reactionAdd(reaction: MessageReaction) {
        let emojiInfo = `${reaction.emoji.name} | ${reaction.emoji.id}`
        // console.log(emojiInfo);
    }

    private newEmoji(emoji: Emoji) {
        (this.client.guilds.get(config.default_server).channels.get('509789262020083712') as TextChannel)
            .send('New emoji: ' + `${emoji.url}`);
    }

    private ready() {
        var guild = this.client.guilds.get(config.default_server);
        var devsOnline: number = 0;
        guild.members.forEach(m => {
            if (m.roles.get('493012268733431812')) devsOnline++;
        })
        this.client.user.setPresence({
            status: "dnd",
            game: {
                name: `Serving ${devsOnline} devs`,
                type: "PLAYING",
            }
        })

        /* tcp */
        var tcpServer = net.createServer({ allowHalfOpen: true });

        tcpServer.on('connection', function (socket) {
            socket.on('data', function (data: string) {
                const req = data.toString().split(' ')[0];
                switch (req) {
                    case 'login':
                        console.log('Attempted login: ' + data.toString().split(' ')[1]);
                        socket.write('true');
                        var user = data.toString().split(' ')[1];

                        const number = user;
                        const last4Digits = number.slice(-4);

                        DUser.findOne({ userid: user }, function (err, doc) {
                            if (err) console.log(err);
                            if (doc && doc.doctor == true) {
                                DUser.updateOne({ userid: user }, { $set: { vericode: last4Digits } }).then(() => console.log('Vericode set for ' + doc.username));
                            }
                        })
                        break;
                }
                socket.destroy();
            });

            socket.on('error', (error: Error) => {
                console.log(error.stack);
                socket.destroy();
            });
        });

        tcpServer.on('close', () => console.log('Server closed connection'));
        tcpServer.listen(1337);
    }

    private async handleMessage(message: Message) {
        new Command(message, this.client);
    }
}