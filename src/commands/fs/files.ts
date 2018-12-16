import { Message, User, RichEmbed } from "discord.js";
import * as data from './../../config.json';
import * as moment from 'moment';
import * as fs from 'fs';
import * as https from 'https';
import Files, { IFile } from '../../schemas/files';
import DUser, { IUser } from '../../schemas/user';
const config = (<any>data);

export class FilesCommand {
    private command: string;
    constructor(cmd: string, msg: string, context: Message, author: User) {
        let guildMember = context.member;
        if (!guildMember.roles.some(r => r.name === config.adminRole)) { context.channel.send('You do not have permission to use FS commands.'); return }
        let obj = context.attachments.first();
        this.command = msg.split(' ')[0];
        if (this.command) {
            switch (this.command) {
                case 'save': this.writeFile(context, msg, context.author, obj); break
                case 'ls': this.listFile(context, msg, context.author, obj); break
                case 'load': this.readFile(context, msg, context.author, obj); break
                default: context.channel.send('No fs param found.');
            }
        } else {
            context.channel.send('No command');
        }
    }

    private listFile(message: Message, msg: string, author: User, obj: any) {
        Files.find({ fileowner: author.id }, function (err, docs) {
            if (err) {
                console.log('Error: ' + err);
            }
            if (docs) {
                var docList: string = '';
                docs.forEach(file => {
                    console.log(file);
                    docList += `Filename: ${file.filename} | Size: ${file.filesize} | Uploaded: ${file.date} | Public: ${file.public}\n`
                })
                const success = new RichEmbed()
                    .setTitle('Your files: ')
                    .setColor(40850)
                    .setDescription(docList)
                message.channel.send(success);
            } else {
                const failure = new RichEmbed()
                    .setTitle('No Files Found.')
                    .setColor(16711680)
                message.channel.send(failure);
            }
        })
        /* DUser.findOne({ userid: author.id }, function (err, doc) {
            if(err)console.log(err);
            if(doc) {
                var list: string = ''
                doc.files.forEach(f => {
                    list += `${f}\n`
                });
                let fileList = new RichEmbed()
                .setTitle(message.author.username + "'s files: ")
                .setColor(40850)
                .setDescription('**No. Files: ' + doc.files.length + '**\n' + list)
                message.channel.send(fileList)
            }
        }) */
    }

    private async readFile(message: Message, msg: string, author: User, obj: any) {
        var findFile = msg.split(' ')[1];
        console.log('Find: ' + findFile);
        Files.findOne({filename: findFile}, function(e, doc) {
            if(e)throw e;
            if(doc) {
                if(doc.fileowner == message.author.id) {
                    let ext = findFile.split('.')[1];
                    switch (ext) {
                        case 'ts':
                            fs.readFile(findFile, "utf8", function(err, data) {
                                if(err) throw err;
                                message.channel.send("```typescript\n" + data + "```")
                            });
                        break;
                        case 'js':
                            fs.readFile(findFile, "utf8", function(err, data) {
                                if(err) throw err;
                                message.channel.send("```javascript\n" + data + "```")
                            });
                        break;
                        default:
                            break;
                    }
                } else {
                    message.channel.send('You do not have permission to view this file.');
                }
            } else {
                message.channel.send('No file found');
            }
        })
    }

    private async loadFile(findFile: string, message: Message) {
        let file = await fs.readFile('./files/' + findFile, function(err, contents) {
            if(err) return message.channel.send('Error');
        });
        message.channel.send(file);
    }

    private writeFile(message: Message, msg: string, author: User, obj: any) {
        message.delete()
        if (!obj) {
            message.channel.send('No file attached');
        } else {
            console.log('File: ' + obj.filename + ' | Size: ' + obj.filesize + ' | Url: ' + obj.url)
            try {
                var file = fs.createWriteStream('./files/' + obj.filename);
                var request = https.get(obj.url, function (response) {
                    response.pipe(file);
                });
                Files.findOne({ filename: obj.filename }, function (err, doc) {
                    if (err) {
                        console.log('Error: ' + err);
                    } else if (!doc) {
                        let file = new Files();
                        file.filename = obj.filename;
                        file.filesize = obj.filesize;
                        file.fileowner = message.author.id;
                        file.fileurl = obj.url;
                        file.date = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
                        file.public = false;
                        file.save(function (err) {
                            if (err) {
                                console.log(err)
                            } else {
                                const success = new RichEmbed()
                                    .setTitle('File Upload Successful!')
                                    .setColor(40850)
                                    .setDescription("Filename: " + obj.filename + "\nFile Size: " + obj.filesize + ' Bytes\nFile Owner: ' + author.id + '\nFile Url: *hidden*\n' + "Uploaded at: " + obj.date + "\nPublic: false")
                                message.channel.send(success);
                            }
                        })
                    } else {
                        message.channel.send('Error: A file with that name exists or you lack permissions.')
                    }
                })
                //DUser.updateOne({ userid: author.id }, { $push: { files: obj.filename } }).then(function () { return })
            } catch (error) {
                message.channel.send('Error: A file with that name exists or you lack permissions.')
                console.log(error)
            }

        }
    }

}