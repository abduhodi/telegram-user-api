import { Inject } from "@nestjs/common";
import { Ctx, On, Start, Wizard, WizardStep } from "nestjs-telegraf";
import { BotService } from "src/scenes/bot.service";
import { SceneContext } from "telegraf/typings/scenes";

@Wizard("group")
export class GroupScene {

    constructor(@Inject() private readonly botService: BotService) { }

    @WizardStep(1)
    async onEnter(@Ctx() ctx: any) {

        ctx.wizard.state.data = {};
        await ctx.reply("Marhamat, guruh nomini kiriting!");
        ctx.wizard.next();

    }

    @Start()
    @WizardStep(2)
    async leavePhone(@Ctx() ctx: SceneContext) {

        await ctx.scene.leave();
        await ctx.reply("Boshidan boshlaymiz!");

    }

    @Start()
    @WizardStep(3)
    async leaveCode(@Ctx() ctx: SceneContext) {

        await ctx.scene.leave();
        await ctx.reply("Boshidan boshlaymiz!");

    }

    @On("text")
    @WizardStep(2)
    async createGroup(@Ctx() ctx: any) {

        try {

            const groupName = ctx.message?.text;

            const response = await this.botService.createChat(groupName);

            await ctx.reply(JSON.stringify(response)); // will be deleted

            ctx.wizard.leave();

        } catch (error) {

            console.error(error);
            await ctx.scene.leave();
            ctx.reply(error.error_message);

        }

    }

}