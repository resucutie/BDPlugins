import Commands from "common/apis/commands"
import BotMessage from "common/apis/clyde"

import { ensureTimezone } from "../utils/timezones"
import { editUser, getTimezone, isExistingUser } from "../utils/userList"
import { Users } from "@discord/stores"

import ThisPlugin from "../index"
import { ApplicationCommandOptionType, DefaultAvatarSettings } from "./index"

export default (caller: string) => {
    Commands.registerCommand(caller, {
        name: "timezone edit",
        description: "Edits a timezone from a user locally",
        id: "timezones-edit-user",
        options: [
            {
                name: "user",
                description: "The user that you wanna edit the timezone",
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
                const prevTimezone: Timezone = await getTimezone(userId)
                if (Users.getCurrentUser().id === userId) {
                    BotMessage.sendMessage(props.channel.id, {
                        author: DefaultAvatarSettings,
                        content: ":face_with_monocle: Isn't that you?"
                    })
                    return
                }

                if (!await isExistingUser(userId)) {
                    BotMessage.sendMessage(props.channel.id, {
                        author: DefaultAvatarSettings,
                        content: ":face_with_raised_eyebrow: I couldn't find this user in the local user list"
                    })
                    return
                }

                editUser(userId, timezone)

                ThisPlugin.prototype.forceUpdateMessages()

                BotMessage.sendMessage(props.channel.id, {
                    author: DefaultAvatarSettings,
                    content: `:tada: ${Users.getUser(userId).username}'s Timezone was changed sucessfully from UTC ${prevTimezone} to UTC ${timezone}!`
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