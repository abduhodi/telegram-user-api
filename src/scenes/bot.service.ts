import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from "telegraf";
import * as MTProto from '@mtproto/core';
import * as path from 'path';
import { parsePhoneNumber } from 'libphonenumber-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BotService implements OnModuleInit {

    private apiId: number;
    private apiHash: string;
    private api;

    constructor(@InjectBot() private readonly bot: Telegraf<Context>, @Inject() config: ConfigService) {

        this.apiId = config.get<number>("API_ID");
        this.apiHash = config.get<string>("API_HASH");

    }

    onModuleInit() {

        this.api = new MTProto({
            api_id: this.apiId,
            api_hash: this.apiHash,
            storageOptions: {
                path: path.resolve(__dirname, '../config/credentials.json')
            },
        });

    }

    signIn({ code, phone, phoneCodeHash }): Promise<any> {

        return this.api.call('auth.signIn', {
            phone_code: code,
            phone_number: phone,
            phone_code_hash: phoneCodeHash,
        });

    }

    sendCode(phone: string): Promise<any> {

        return this.api.call('auth.sendCode', {
            phone_number: phone,
            settings: {
                _: 'codeSettings',
            },
        });

    }

    checkPassword({ srpId, A, M1 }): Promise<any> {

        return this.api.call('auth.checkPassword', {
            password: {
                _: 'inputCheckPasswordSRP',
                srp_id: srpId,
                A,
                M1,
            },
        });

    }

    getPassword(): Promise<any> {

        return this.api.call('account.getPassword');

    }

    addChatMember(userid: number, chatId: number, limit: number = 100): Promise<any> {

        return this.api.call("messages.addChatUser", {
            chat_id: chatId,
            user_id: {
                _: 'inputUser',
                user_id: userid
            },
            fwd_limit: limit
        });

    }

    deleteChatMember(userId: number, chatId: number): Promise<any> {

        return this.api.call("messages.deleteChatUser", {
            chat_id: chatId,
            user_id: {
                _: 'inputUser',
                user_id: userId
            },
            revoke_history: false
        });

    }

    createChat(title: string, users: any = []): Promise<any> {

        return this.api.call("messages.createChat", { users, title });

    }

    async addContact(phone: string, firstName: string, lastName?: string): Promise<any> {

        const clientId = (await this.getContacts()).contacts.length + 1;

        return this.api.call("contacts.importContacts", {
            contacts: [
                {
                    _: "inputPhoneContact",
                    client_id: clientId,
                    phone,
                    first_name: firstName,
                    last_name: lastName
                }
            ]
        });

    }

    getContacts(): Promise<any> {

        return this.api.call("contacts.getContacts");

    }

    async pass2FA(password: string): Promise<any> {

        try {

            const { srp_id: srpId, current_algo: currentAlgo, srp_B: srpB } = await this.getPassword();
            const { g, p, salt1, salt2 } = currentAlgo;

            const { A, M1 } = await this.api.crypto.getSRPParams({
                g,
                p,
                salt1,
                salt2,
                gB: srpB,
                password,
            });

            const checkPasswordResult = await this.checkPassword({ srpId, A, M1 });
            console.log(checkPasswordResult, "data");

        } catch (error) {

            console.error(error.message);

        }

    }

    validatePhoneNumber(phoneNumber: string) {

        try {

            const parsedNumber = parsePhoneNumber(phoneNumber);
            return parsedNumber.isValid();

        } catch (e) {

            console.error(e.message);
            return false;

        }

    }

}