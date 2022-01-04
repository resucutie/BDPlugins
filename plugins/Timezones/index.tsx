/// <reference path="../../types/main.d.ts" />

import React from "react"
import BasePlugin from "@zlibrary/plugin";
import { Patcher } from "@zlibrary";
import { Text, Button } from "@discord/components"
import { ModalRoot, ModalSize, ModalHeader, ModalContent, openModal } from "@discord/modal"
import { Messages, SelectedChannels } from "@discord/stores";
import { Dispatcher } from "@discord/modules";
import stylesheet from "styles"
import styles from "./style.scss"
import commands from "./commands";

import userProfilePatch from "./patches/userProfile";
import messagePatch from "./patches/messages";
import contextMenuPatch from "./patches/contextMenu";
import dmPatch from "./patches/dm";

import { getList, getTimezone, isExistingUser, removeUser } from "./utils/userList";
import createQuestion from "./utils/createQuestion";
import SettingsPanel from "./Settings";
import UserList from "./components/UserList";

// const onDeleteTimezone = id => {
//     createQuestion(
//         "Remove timezone",
//         "Are you sure that you want to remove the timezone for this user? Note that this is an IRREVERSIBLE action.",
//         [
//             { text: "Proceed", color: Button.Colors.RED },
//             { text: "Cancel", color: Button.Colors.TRANSPARENT, look: Button.Looks.LINK }
//         ]
//     //@ts-ignore
//     ).then(({ button }) => {
//         if (button === "Proceed") removeUser(id)
//     })
// }

export default class Timezones extends BasePlugin {
    async onStart() {
        stylesheet.inject()
        this.supressErrors(userProfilePatch, "User Profile", "176cd0")
        this.supressErrors(messagePatch, "Messages", "36cd30")
        this.supressErrors(contextMenuPatch, "Context Menu", "ff5177")
        this.supressErrors(dmPatch, "Direct Messages", "6262da")
        commands.apply(this.getName())
    }

    /**
     * @see {@link https://github.com/Puv1s/ColorTooltips/blob/d3386bff75ec03e13067cc819bac639c31e4bc35/ColorTooltips.plugin.js#L443}
     */
    forceUpdateMessages(channelId: ChannelID = SelectedChannels.getChannelId()){
        if (!channelId) return;
        const messages = Messages.getMessages(channelId);
        if (!messages._array?.length) return;
        for (const message of messages._array) {
            Dispatcher.dispatch({
                type: "MESSAGE_UPDATE",
                message: message
            });
        }
    }

    onDeleteTimezone(id) {
        createQuestion(
            "Remove timezone",
            "Are you sure that you want to remove the timezone for this user? Note that this is an IRREVERSIBLE action.",
            [
                { text: "Proceed", color: Button.Colors.RED },
                { text: "Cancel", color: Button.Colors.TRANSPARENT, look: Button.Looks.LINK }
            ]
            //@ts-ignore
        ).then(({ button }) => {
            if (button === "Proceed") {
                removeUser(id)
                this.forceUpdateMessages()
            }
        })
    }

    async openSettingsModal(userID: UserID, includeTT?: boolean) {
        const timezone = await getTimezone(userID, { includeTT })
        const existingUsers = await isExistingUser(userID, false)
        openModal((h) => <ModalRoot size={ModalSize.MEDIUM} className={styles["add-user-modal"]} {...h}>
            <ModalHeader separator={false}><Text size={Text.Sizes.SIZE_14} className={"h4-AQvcAz title-3sZWYQ defaultColor-1_ajX0 defaultMarginh4-2vWMG5"}>Add a new user</Text></ModalHeader>
            <ModalContent className={"bd-addon-modal-settings"}>
                <div className={styles["user-add-wrapper"]}>
                    <UserList
                        defaultVals={{ userID, timezone, userPicker: { existingUsers } }}
                        isModal={true}
                        {...h}
                    />
                </div>
            </ModalContent>
        </ModalRoot>)
    }

    supressErrors(func: Function, name, color = "4ec5df"){
        try {
            func()
        } catch (err) {
            const stack: string = err.stack

            const splitStack = stack.split("    at")

            const formattedStyle = splitStack.flatMap(e => [
                "",
                `color: #834343`,
                ""
            ])

            const formattedText = stack.slice(6).replace(/    at/g, "%c    %cat%c")

            console.error(
                "%cTimezones" + "%c " +
                "An error happened with" + " " +
                `%c${name}` + "%c's patcher!" + "\nError stack:" +
                formattedText
                ,
                
                // plugin name
                `
                background: #006db5;
                padding: 2px 4px;
                border-radius: 4px;
                color: #fff;
                font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif
                `,
                
                //unstyled
                "",

                // module name
                `
                background: #${color};
                padding: 2px 4px;
                border-radius: 4px;
                color: #fff;
                font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif
                `,

                "",

                ...formattedStyle
            )
        }
    }

    getSettingsPanel() {
        return <SettingsPanel />;
    }

    onStop() {
        Patcher.unpatchAll()
        stylesheet.remove()
        commands.remove(this.getName())
    }
}