import { Inject } from "@nestjs/common";
import { Ctx, On, Start, Wizard, WizardStep } from "nestjs-telegraf";
import { BotService } from "src/scenes/bot.service";
import { SceneContext } from "telegraf/typings/scenes";

@Wizard("phone")
export class LoginScene {

    constructor(@Inject() private readonly botService: BotService) {}

    @WizardStep(1)
    async onEnter(@Ctx() ctx: any) {

        ctx.wizard.state.data = { };
        await ctx.reply("Marhamat, telefon raqamingizmi (+998900000000) formatda kiriting\nYoki kontaktingizni ulashing!");
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

    @On("contact")
    @WizardStep(2)
    async onContact(@Ctx() ctx: any) {

        try {

            const phone = ctx.message?.contact?.phone_number;
            const valid = this.botService.validatePhoneNumber(phone);

            if (!valid) {

                await ctx.reply("Iltimos yaroqli telefon raqam kiriting!");
                return;

            }

            const response = await this.botService.sendCode(phone);
            await ctx.reply("Telegram akkauntingizga kelgan kodni kiriting...");

            ctx.wizard.state.data = { phone, codeHash: response.phone_code_hash };

            ctx.wizard.next();
            
        } catch (error) {

            console.error(error);
            await ctx.scene.leave();
            ctx.reply(error.error_message);
            
        }

    }

    @On("text")
    @WizardStep(2)
    async onText(@Ctx() ctx: any) {

        try {

            const phone = ctx.message?.text;
            const valid = this.botService.validatePhoneNumber(phone);

            if (!valid) {

                await ctx.reply("Iltimos yaroqli telefon raqam kiriting!");
                return;

            }

            const response = await this.botService.sendCode(phone);
            await ctx.reply("Telegram akkauntingizga kelgan kodni kiriting...");

            ctx.wizard.state.data = { phone, codeHash: response.phone_code_hash };

            ctx.wizard.next();
            
        } catch (error) {

            console.error(error);
            await ctx.scene.leave();
            ctx.reply(error.error_message);
            
        }

    }

    @On("text")
    @WizardStep(3)
    async signIn(@Ctx() ctx: any) {

        try {

            const code = ctx.message?.text;
            const phone = ctx.wizard?.state?.data?.phone;
            const phoneCodeHash = ctx.wizard?.state?.data?.codeHash;

            const response = await this.botService.signIn({ code, phone, phoneCodeHash });
            console.log(response);
            ctx.reply(JSON.stringify(response));

        } catch (error) {

            console.error(error);
            await ctx.scene.leave();
            ctx.reply(error.error_message);

        }

    }

}