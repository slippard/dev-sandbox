import { Message, User, RichEmbed } from "discord.js";
import * as data from './../../config.json';
import * as fs from 'fs';
import * as https from 'https';
import DUser, { IUser } from '../../schemas/user';
const config = (<any>data);

export class FilesCommand {
    private command: string;
    constructor(msg: string, cmd: string, context: Message, author: User) {
        let guildMember = context.member;
        if(!guildMember.roles.some(r => r.name === config.adminRole)) { context.channel.send('You do not have permission to use FS commands.'); return }
        let obj = context.attachments.first();
        this.command = msg.split(' ')[0];
        if (this.command) {
            switch (this.command) {
                case 'add': this.writeFile(context, msg, context.author, obj); break
                case 'ls': this.listFile(context, msg, context.author, obj); break
                case 'read': this.readFile(context, msg, context.author, obj); break
                default: context.channel.send('No fs param found.');
            }
        } else {
            context.channel.send('No command');
        }
    }

    private listFile(message: Message, msg: string, author: User, obj: any) {
        let fileList = config.files;
        DUser.findOne({ userid: author.id }, function (err, doc) {
            if(err)console.log(err);
            if(doc) {
                var list: string = ''
                doc.files.forEach(f => {
                    list += `${f}\n`
                });
                let fileList = new RichEmbed()
                .setTitle(message.author.username + "'s files: ")
                .setDescription('**No. Files: ' + doc.files.length + '**\n' + list)
                message.channel.send(fileList)
            }
        })
    }

    private readFile(message: Message, msg: string, author: User, obj: any) {
        message.channel.send('File Reading coming soon.');
    }

    private writeFile(message: Message, msg: string, author: User, obj: any) {
        if (!obj) {
            message.channel.send('No file attached');
        } else {
            console.log('File: ' + obj.filename + ' | Size: ' + obj.filesize + ' | Url: ' + obj.url)
            try {
                var file = fs.createWriteStream('./files/' + obj.filename);
                var request = https.get(obj.url, function (response) {
                    response.pipe(file);
                });
                DUser.updateOne({ userid: author.id }, { $push: { files: obj.filename } }).then(function () { return })
                const success = new RichEmbed()
                    .setTitle('File Upload Successful!')
                    .setColor(40850)
                    .setDescription("Filename: " + obj.filename + "\nFile Size: " +obj.filesize + 'Bytes\Public Link: ' + obj.url)
                message.channel.send(success);
            } catch (error) {
                console.log(error)
            }

        }
    }

}