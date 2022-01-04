import Commands from "common/apis/commands"
import BotMessage from "common/apis/clyde"

import { ensureTimezone } from "../utils/timezones"
import { addUser, isExistingUser } from "../utils/userList"
import { Channels, Users } from "@discord/stores"

import ThisPlugin from "../index"
import { ApplicationCommandOptionType, DefaultAvatarSettings } from "./index"

export default (caller: string) => {
    Commands.registerCommand(caller, {
        name: "timezone add",
        description: "Adds a timezone to a user locally",
        id: "timezones-add-user",
        options: [
            {
                name: "user",
                description: "The user that you wanna add the timezone",
                required: true,
                type: ApplicationCommandOptionType.USER
            },
            {
                name: "timezone",
                description: "The timezone of the user",
                required: true,
                type: ApplicationCommandOptionType.INTEGER
            }
        ],
        execute: async function (options, props) {
            try {
                const userId: UserID = options.user[0].userId
                const timezone: Timezone = ensureTimezone(options.timezone[0].text)
                if (Users.getCurrentUser().id === userId) {
                    BotMessage.sendMessage(props.channel.id, {
                        author: DefaultAvatarSettings,
                        content: ":face_with_monocle: Isn't that you?"
                    })
                    return
                }

                if (Users.getUser(userId).bot) {
                    BotMessage.sendMessage(props.channel.id, {
                        author: DefaultAvatarSettings,
                        content: ":robot: 01000010 01100101 01100101 01110000 00100000 01000010 01101111 01101111 01110000 00100001 00100000 01011001 01101111 01110101 00100111 01110110 01100101 00100000 01110011 01100101 01101100 01100101 01100011 01110100 00100000 01100001 00100000 01100010 01101111 01110100 00100001"
                    })
                    return
                }

                if (await isExistingUser(userId)) {
                    BotMessage.sendMessage(props.channel.id, {
                        author: DefaultAvatarSettings,
                        content: ":rage: Hey! This user already exists!"
                    })
                    return
                }

                addUser(userId, timezone)

                ThisPlugin.prototype.forceUpdateMessages()

                BotMessage.sendMessage(props.channel.id, {
                    author: DefaultAvatarSettings,
                    content: `:tada: Timezone UTC ${timezone} was assigned sucessfully to ${Users.getUser(userId).username}!`
                })
            } catch (err) {
                BotMessage.sendMessage(props.channel.id, {
                    author: DefaultAvatarSettings,
                    content: `:fire: An error happened!\n${err.toString()}\n\nPlease contact A user#8169 and send the error!`
                })
            }
        },
        predicate: () => true
    })
}