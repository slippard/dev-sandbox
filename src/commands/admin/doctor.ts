import { Message } from "discord.js";
import * as mongoose from 'mongoose';
import * as data from '../../config.json';
import DUser, { IUser } from '../../schemas/user';
const config = (<any>data);

export class CodeDoctor {

    constructor() {

    }

    public whois(message: Message) {
        let guildMember = message.member;
        let target = message.mentions.members.first();
        if (target) {
            DUser.findOne({userid: target.id}, function(err, doc) {
                if (err) return console.log(err);
                if(doc) {
                    
                    let repos: string = '';
                    doc.repositories.forEach(r => {
                        repos += `- ${r}\n`
                    })
                    let profile = "```\n" + `Username: ${doc.username}\nUserid: ${doc.userid}\nMessage Count: ${doc.messageCount}\nCode Doctor: ${doc.doctor}\nRepositories:\n${repos}` + "```";
                    message.channel.send(profile);
                } else {
                    message.channel.send('Could not find user.');
                }
            });
        } else {
            try {
                var user = message.content.split(config.prefix)[1].slice(6);
                DUser.findOne({userid: user}, function(err, doc) {
                    if (err) return console.log(err);
                    if(doc) {
                        let repos: string = '';
                        doc.repositories.forEach(r => {
                            repos += `- ${r}\n`
                        })
                        let profile = "```\n" + `Username: ${doc.username}\nUserid: ${doc.userid}\nMessage Count: ${doc.messageCount}\nCode Doctor: ${doc.doctor}\nRepositories:\n${repos}` + "```";
                        message.channel.send(profile);
                    } else {
                        message.channel.send('Could not find user.');
                    }
                });
            } catch (error) {
                return message.channel.send('Something went wrong.');
            }
        }
    }

    public demoteDoctor(message: Message) {
        DUser.findOne({ userid: message.author.id }, function (err, doc) {
            if (err) console.log('Error: ' + err);
            if (doc) {
                if (doc.doctor === true) {
                    let guildMember = message.member;
                    let target = message.mentions.members.first();
                    if (target) {
                        if (guildMember.roles.some(r => r.id == '460452397538476032')) {
                            if (target.roles.some((r => r.id == '460452397538476032'))) {
                                return target.removeRole('460452397538476032').then(() => { DUser.updateOne({ userid: message.author.id }, { $set: { doctor: true } }).then(function () { return message.channel.send('Demoting: ' + target.user.username) }) });
                            } else {
                                return message.channel.send('User is not a code doctor.');
                            }
                        } else {
                            return message.channel.send('You do not have permission to demote.');
                        }
                    } else {
                        return message.channel.send('Mention the member to be demoted.');
                    }
                } else {
                    return message.channel.send('You do not have permission promote.').then((m: Message) => {
                        setTimeout(() => {
                            m.delete();
                        }, 3000);
                    })
                }
            }
        })
    }

    public promoteDoctor(message: Message) {
        DUser.findOne({ userid: message.author.id }, function (err, doc) {
            if (err) console.log('Error: ' + err);
            if (doc) {
                if (doc.doctor === true) {
                    let guildMember = message.member;
                    let target = message.mentions.members.first();
                    if (target) {
                        if (guildMember.roles.some(r => r.id == '460452397538476032')) {
                            if (target.roles.some((r => r.id == '460452397538476032'))) {
                                return message.channel.send(target.user.username + ' is already a code doctor.');
                            } else {
                                target.addRole('460452397538476032');
                                DUser.updateOne({ userid: message.author.id }, { $set: { doctor: true } }).then(function () { return message.channel.send('Promoting: ' + target.user.username) })
                            }
                        } else {
                            return message.channel.send('Not allowed');
                        }
                    } else {
                        return message.channel.send('Mention the member to be promoted to code doctor.');
                    }
                } else {
                    return message.channel.send('You do not have permission promote.').then((m: Message) => {
                        setTimeout(() => {
                            m.delete();
                        }, 3000);
                    })
                }
            }
        })
    }
}