import { Command, Ctx, InjectBot, Start, Update } from "nestjs-telegraf";
import { Context, Telegraf } from "telegraf";
import { SceneContext } from "telegraf/typings/scenes";

@Update()
export class UpdateService {

    constructor(@InjectBot() private readonly bot: Telegraf<Context>) { }

    @Start()
    async start(@Ctx() ctx: Context) {

        await ctx.telegram.setMyCommands([
            {
                command: '/start',
                description: 'Botni ishga tushirish'
            },
            {
                command: '/login',
                description: 'Akkauntga kirish'
            },
            {
                command: '/logout',
                description: 'Akkauntdan chiqish'
            },
            {
                command: '/add',
                description: "Guruhga user qo'shish"
            },
            {
                command: '/group',
                description: "Yangi guruh yaratish"
            }
        ]);

        await ctx.reply("Assalomu alaykum! Xush kelibsiz!");

    }

    @Command('login')
    async loginScene(@Ctx() ctx: SceneContext) {

        await ctx.scene.enter('phone');

    }

    @Command('add')
    async addScene(@Ctx() ctx: SceneContext) {

        await ctx.scene.enter('add');

    }

    @Command('group')
    async groupScene(@Ctx() ctx: SceneContext) {

        await ctx.scene.enter('group');

    }

}