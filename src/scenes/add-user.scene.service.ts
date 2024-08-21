import { Inject } from "@nestjs/common";
import { Ctx, On, Start, Wizard, WizardStep } from "nestjs-telegraf";
import { BotService } from "src/scenes/bot.service";
import { SceneContext } from "telegraf/typings/scenes";

@Wizard("add")
export class AddUserScene {

    constructor(@Inject() private readonly botService: BotService) { }

    @WizardStep(1)
    async onEnter(@Ctx() ctx: any) {

        ctx.wizard.state.data = {};
        await ctx.reply("Marhamat, qo'shmoqchi bo'lgan user telefon raqamini\n(+998900000000) formatda kiriting\n\nYoki kontaktini ulashing!");
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

            await ctx.reply("Foydalanuvchi ism-sharifini kiriting!");

            ctx.wizard.state.data = { phone };

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

            await ctx.reply("Foydalanuvchi ism-sharifini kiriting!");

            ctx.wizard.state.data = { phone };

            ctx.wizard.next();

        } catch (error) {

            console.error(error);
            await ctx.scene.leave();
            ctx.reply(error.error_message);

        }

    }

    @On("text")
    @WizardStep(3)
    async onFullName(@Ctx() ctx: any) {

        try {

            const [firstName, lastName] = ctx.message?.text?.split(' ');
            const phone = ctx.wizard?.state?.data?.phone;

            const response = await this.botService.addContact(phone, firstName, lastName);
            await ctx.reply(JSON.stringify(response)); // will be deleted
            const userId = response.imported[0]?.user_id;

            if (!userId) {

                await ctx.reply("Bu telefon raqamga telegram akkaunt ochilmagan!");
                return;

            }

            const data = await this.botService.addChatMember(userId, 4541023893);

            await ctx.reply(JSON.stringify(data)); // will be deleted

            await ctx.wizard.leave();

        } catch (error) {

            console.error(error);
            await ctx.scene.leave();
            ctx.reply(error.error_message);

        }

    }

}