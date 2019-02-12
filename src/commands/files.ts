import { Message, User, RichEmbed, MessageAttachment } from "discord.js";
import { config } from '../config';
import * as moment from 'moment';
import * as fs from 'fs';
import File, { IFile } from '../schemas/files';
import DUser, { IUser } from '../schemas/user';
import * as path from 'path';
import * as aws from 'aws-sdk';
import * as https from 'https';

interface LocalFile {
    name: String,
    url: String,
    uploaded: String,
}

export class FilesCommand {
    private command: string;
    constructor(cmd: string, msg: string, context: Message, author: User) {
        let guildMember = context.member;
        if (!guildMember.roles.some(r => r.name === config.adminRole)) { context.channel.send('You do not have permission to use FS commands.'); return }
        let zip = context.attachments.first();
        this.command = msg.split(' ')[0];
        if(zip && this.command) {
            switch (this.command) {
                case 'save': this.saveFile(context, zip);
                // case 'listall': this.showAll(context); break
                // case 'ls': this.listFile(context, msg, context.author, obj); break
                // case 'load': this.readFile(context, msg, context.author, obj); break
                // case 'save': this.writeFile(context, msg, context.author, obj); break
                default: break;
            }
        } else if (this.command){
            switch (this.command) {
                case 'list': this.listFiles(context);
                default: break;
            }
        } else {
            context.channel.send('No command');
        }
    }

    private async saveFile(context: Message, zip: MessageAttachment) {
        const newFile: LocalFile = {
            name: zip.filename,
            url: zip.proxyURL,
            uploaded: moment().format('MMMM Do YYYY, h:mm:ss a')
        }
        DUser.findOne({userid: context.author.id}, async (err, doc) => {
            if(err)return console.log(err);
            if(doc && doc.fs == true) {
                var files = [];
                await doc.files.forEach(f => {
                    files.push(f);
                })
                if(files.some(f => f.name === zip.filename)) {
                    return context.channel.send(`File with the name ${zip.filename} already exists. Please rename file and try again.`);
                }
                DUser.updateOne({ userid: context.author.id }, { $push: { files: newFile } }).then(function () { 
                    return context.channel.send(`${zip.filename} saved to your file list. Use ` + "`!fs list` to list your files."); 
                });
            } else {
                console.log('something went wrong?');
            }
        })
    }

    private async listFiles(context: Message) {
        DUser.findOne({userid: context.author.id}, async (err, doc) => {
            if(err)return console.log(err);
            if(doc && doc.fs == true) {
                if(doc.files.length == 0 || doc.files == undefined || doc.files == null) {
                    return context.channel.send('No files found.');
                }
                var files = [];
                var output = '';
                await doc.files.forEach(f => {
                    files.push(f);
                })
                await files.forEach(f => {
                    output += `-${f.name} uploaded ${f.uploaded}: ${f.url}\n\n`;
                })
                const lsembed = new RichEmbed({
                    title: 'Your saved files:',
                    description: output,
                    author: {
                        name: context.author.username,
                        icon_url: context.author.avatarURL
                    }
                });
                return context.channel.send(lsembed);
            } else {
                console.log('something went wrong?');
            }// context.channel.send("Please register a filesystem before using fs commands. `!register fs`");
        })
    }

    /* private async showAll(context: Message) {
        try {
            aws.config.update({
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey,
                region: 'us-east-1',
            })
            const s3 = new aws.S3();
            const res = await s3.listObjectsV2({
                Bucket: 'devsandbox-userfiles'
            }).promise();
            var output: string = '';
            res.Contents.forEach(file => {
                console.log(file);
                output += `- Filename: ${file.Key} | Size: ${file.Size}B \n`;
            })
            context.channel.send("```css\n" + output + "```");
        } catch (e) {
            console.log(e.message);
        }
    } */

    private listFile(message: Message, msg: string, author: User, obj: any) {
        File.find({ fileowner: author.id }, function (err, docs) {
            if (err) {
                console.log('Error: ' + err);
            }
            if (docs) {
                var docList: string = '';
                docs.forEach(file => {
                    docList += `Filename: ${file.filename} | Size: ${file.filesize} | Uploaded: ${file.date} | Public: ${file.public}\n`
                })
                const success = new RichEmbed().setTitle('Your files: ').setColor(40850).setDescription(docList)
                message.channel.send(success);
            } else {
                const failure = new RichEmbed().setTitle('No Files Found.').setColor(16711680)
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
        File.findOne({ filename: findFile }, function (e, doc) {
            if (e) throw e;
            if (doc) {
                if (doc.fileowner == message.author.id) {
                    let ext = findFile.split('.')[1];
                    switch (ext) {
                        case 'ts':
                            fs.readFile(findFile, "utf8", function (err, data) {
                                if (err) throw err;
                                message.channel.send("```typescript\n" + data + "```")
                            });
                            break;
                        case 'js':
                            fs.readFile(findFile, "utf8", function (err, data) {
                                if (err) throw err;
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
        let file = await fs.readFile('./files/' + findFile, function (err, contents) {
            if (err) return message.channel.send('Error');
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
                var file = fs.createWriteStream('../files/' + obj.filename);
                var request = https.get(obj.url, function (response) {
                    response.pipe(file);
                });
                File.findOne({ filename: obj.filename }, function (err, doc) {
                    if (err) {
                        console.log('Error: ' + err);
                    } else if (!doc) {
                        let file = new File();
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