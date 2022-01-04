import { WebpackModules } from "@zlibrary"
import Commands from "common/apis/commands"

import addTimezoneCommand from "./add"
import editTimezoneCommand from "./edit"
import deleteUserCommand from "./delete"

const { ApplicationCommandOptionType }: {
    ApplicationCommandOptionType: {
        BOOLEAN: 5;
        CHANNEL: 7;
        INTEGER: 4;
        MENTIONABLE: 9;
        ROLE: 8;
        STRING: 3;
        SUB_COMMAND: 1;
        SUB_COMMAND_GROUP: 2;
        USER: 6;
    }
} = WebpackModules.getByProps("ApplicationCommandType")

const DefaultAvatarSettings = {
    avatar: "betterdiscord",
    id: "81388395867156480",
    bot: true,
    discriminator: "5000",
    username: "Timezones"
}

export {DefaultAvatarSettings, ApplicationCommandOptionType}

export default {
    apply: (caller: string) => {
        addTimezoneCommand(caller)
        editTimezoneCommand(caller)
        deleteUserCommand(caller)
    },
    remove: (caller: string) => {
        Commands.unregisterAllCommands(caller)
    }
}