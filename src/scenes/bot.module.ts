import { Module } from "@nestjs/common";
import { AddUserScene } from "src/scenes/add-user.scene.service";
import { BotService } from "src/scenes/bot.service";
import { GroupScene } from "src/scenes/create-group.service";
import { LoginScene } from "src/scenes/login.scene.service";
import { UpdateService } from "src/scenes/update.service";

@Module({
    imports: [],
    controllers: [],
    providers: [UpdateService, BotService, LoginScene, AddUserScene, GroupScene],
})
export class BotModule { }
