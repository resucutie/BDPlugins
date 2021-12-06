/// <reference path="../../types/main.d.ts" />

import React, { useState, useEffect } from "react"
import BasePlugin from "@zlibrary/plugin";
import { Patcher, WebpackModules, Utilities } from "@zlibrary";
import { Text, TooltipContainer, Popout } from "@discord/components"
import { Timer as TimerIcon, ChatBubble } from "@discord/icons"
import { MenuItem } from "@discord/contextmenu"
import { ModalRoot, ModalSize, ModalHeader, ModalContent, openModal } from "@discord/modal"
import { Users } from "@discord/stores";
import stylesheet from "styles"
import styles from "./style.scss"

import settings from "./settingsManager";
import { checkIfUserExists, getTimezone } from "./utils/userList";
import { getTimeFromTimezone } from "./utils/timezones";
import SettingsPanel from "./Settings";
import Timer from "./components/Timer";
import BasicTimer from "./components/BasicTimer";
import UserList from "./components/UserAdd";
import CheckTimeIn from "./components/CheckTimeIn";

export default class Fuses extends BasePlugin {


    onStart() {
        stylesheet.inject()
        this.handleUserBannerPatch()
        this.handleTimestampPatch()
        this.handleContextMenuPatch()
    }

    handleUserBannerPatch(){
        Patcher.after(WebpackModules.find(m => m.default?.displayName === 'UserBanner'), "default", (_this, [props], res) => {
            if (!checkIfUserExists(props.user.id)) return

            let userTimezone = getTimezone(props.user.id)

            res.props.children.push(
                // <Popout position={Popout.Positions.RIGHT} renderPopout={props => <CheckTimeIn timezone={userTimezone} {...props}/>}>
                //     {props => <Timer {...props} timezone={userTimezone} className={styles["timer-positioning"]} />}
                // </Popout>
                <Timer /*{...props}*/ timezone={userTimezone} className={styles["timer-positioning"]} />
            )
        })
    }

    /**
     * Totally original code
     * @see {@link https://github.com/Strencher/BetterDiscordStuff/blob/337cb03bd0b1551138be09b2ed9faa0e466f897d/PronounDB/index.js#L39-L67}
     */
    handleTimestampPatch(){
        const OriginalMessageTimestamp = WebpackModules.getModule(m => m?.default?.toString().indexOf("showTimestampOnHover") > -1);

        Patcher.after(OriginalMessageTimestamp, "default", (_this, [props], res) => {
            if (!(settings.get("timestamps", false) || settings.get("timestampsMessages", false))) return
            //console.log(props.message.timestamp.toDate())

            const isBothSettingsApplied = settings.get("timestamps", false) && settings.get("timestampsMessages", false)

            if (!checkIfUserExists(props.message.author.id)) return

            let userTimezone = getTimezone(props.message.author.id)

            let timestamp = Utilities.findInReactTree(res, e => e?.type?.displayName === "MessageTimestamp")
            
            const firstOgFunc = timestamp?.type
            if (!firstOgFunc) return
            timestamp.type = function(){
                let firstRes = firstOgFunc.apply(this, arguments)
                let children = firstRes?.props?.children
                if (!children) return firstRes

                firstRes.props.className += ` ${styles["timestamp-timer-wrapper"]}`

                if (!_.isArray(children)) children = [children]


                if (settings.get("timestampsMessages", false)) children.push(<>
                    <span className={styles["timestamp-dot"]}>•</span>
                    {(isBothSettingsApplied || settings.get("timestampsIcons", false)) && <TooltipContainer className={styles["timestamp-tooltip"]} text={`Message's time in ${props.message.author.username}'s timezone`}>
                        <ChatBubble width={16} height={16} />
                    </TooltipContainer>}
                    <BasicTimer className={styles["timestamp-timer"]} staticTime={getTimeFromTimezone(userTimezone, props.message.timestamp.toDate())} />
                </>)

                if (settings.get("timestamps", false)) children.push(<>
                    <span className={styles["timestamp-dot"]}>•</span>
                    {(isBothSettingsApplied || settings.get("timestampsIcons", false)) && <TooltipContainer className={styles["timestamp-tooltip"]} text={`${props.message.author.username}'s current time`}>
                        <TimerIcon width={16} height={16} />
                    </TooltipContainer>}
                    <BasicTimer className={styles["timestamp-timer"]} timezone={userTimezone} />
                </>)

                firstRes.props.children = children

                return firstRes
            }
        })

        // Thanks discord.
        const Modules: any = WebpackModules.findAll(m => ~["ChannelMessage", "InboxMessage"].indexOf(m?.type?.displayName));

        for (const Module of Modules) {
            Patcher.after(Module, "type", (_, __, ret) => {
                const tree = Utilities.findInReactTree(ret, m => m?.childrenHeader);
                if (!tree) return;
                tree.childrenHeader.type.type = OriginalMessageTimestamp.default;
            });
        }
    }

    handleContextMenuPatch(){
        Patcher.after(WebpackModules.find(m => m.default?.displayName === 'GuildChannelUserContextMenu'), "default", (_this, [props], res) => {
            console.log(res)
            let menugroup = res.props?.children?.props?.children?.[4]
            if (!menugroup) return
            menugroup.props.children.unshift(<MenuItem
                id="fuses-addUser"
                label="Add timezone"
                action={() => { this.openSettingsModal(props.user.id)}}
                disabled={checkIfUserExists(props.user.id)}
            />)
        })

        Patcher.after(WebpackModules.find(m => m.default?.displayName === 'DMUserContextMenu'), "default", (_this, [props], res) => {
            let userActions = res.props?.children?.props?.children?.[5]
            if (!userActions) return
            userActions.props.children.unshift(<MenuItem
                id="fuses-addUser"
                label="Add timezone"
                action={() => { this.openSettingsModal(props.user.id) }}
                disabled={checkIfUserExists(props.user.id)}
            />)
        })
    }

    openSettingsModal(userID){
        openModal((h) => <ModalRoot size={ModalSize.LARGE} {...h}>
            <ModalHeader separator={false}><Text size={Text.Sizes.SIZE_14} className={"h4-AQvcAz title-3sZWYQ defaultColor-1_ajX0 defaultMarginh4-2vWMG5"}>Add a new user</Text></ModalHeader>
            <ModalContent className={"bd-addon-modal-settings"}>
                <div className={styles["user-add-wrapper"]}>
                    <UserList presets={{ userID }} />
                </div>
            </ModalContent>
        </ModalRoot>)
    }

    getSettingsPanel() {
        return <SettingsPanel />;
    }

    onStop() {
        Patcher.unpatchAll()
        stylesheet.remove()
    }
}