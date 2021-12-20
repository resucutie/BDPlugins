/// <reference path="../../types/main.d.ts" />

import React, { useState, useEffect } from "react"
import BasePlugin from "@zlibrary/plugin";
import { Patcher, WebpackModules, Utilities } from "@zlibrary";
import { Text, TooltipContainer, Popout, Button, Flex } from "@discord/components"
import { Timer as TimerIcon, ChatBubble, DropdownArrow } from "@discord/icons"
import { Menu, MenuItem, openContextMenu, closeContextMenu } from "@discord/contextmenu"
import { ModalRoot, ModalSize, ModalHeader, ModalContent, openModal } from "@discord/modal"
import stylesheet from "styles"
import styles from "./style.scss"

import settings from "./settingsManager";
import { getList, getTimezone, isExistingUser, removeUser } from "./utils/userList";
import { convertHMTzToHTz, ensureTimezone, getTimeFromTimezone, isHMtimezone, isNotTimezone } from "./utils/timezones";
import createQuestion from "./utils/createQuestion";
import SettingsPanel from "./Settings";
import Timer from "./components/Timer";
import BasicTimer from "./components/BasicTimer";
import UserList from "./components/UserList";
import TimeCalculator from "./components/TimeCalculator";
import TimestampActions from "./components/context menus/TimestampActions";
import RotateClock from "./components/custom icons/RotateClock";
import constants from "./utils/constants";

const onDeleteTimezone = id => {
    createQuestion(
        "Remove timezone",
        "Are you sure that you want to remove the timezone for this user? Note that this is an IRREVERSIBLE action.",
        [
            { text: "Proceed", color: Button.Colors.RED },
            { text: "Cancel", color: Button.Colors.TRANSPARENT, look: Button.Looks.LINK }
        ]
    //@ts-ignore
    ).then(({ button }) => {
        if (button === "Proceed") removeUser(id)
    })
}

export default class Fuses extends BasePlugin {
    onStart() {
        stylesheet.inject()
        this.handleUserBannerPatch()
        this.handleTimestampPatch()
        this.handleContextMenuPatch()
    }

    async handleUserBannerPatch(){
        Patcher.after(WebpackModules.find(m => m.default?.displayName === 'UserBanner'), "default", (_this, [props], res) => {
            if (
                !isExistingUser(props.user.id) ||
                settings.get("display", constants.Settings.TimerDisplay.USER_BANNER) !== constants.Settings.TimerDisplay.USER_BANNER
            ) return

            const userTimezone = getTimezone(props.user.id)

            res.props.children.push(<Timer
                onClick={() => settings.set("_callTimeCalculator", !settings.get("_callTimeCalculator", false))}
                timezone={userTimezone}
                className={styles["timer-positioning"]}
                onContextMenu={e => openContextMenu(e, () => <Menu navId="fuses-timer-context-menu" onClose={closeContextMenu}>
                    {TimestampActions({
                        id: props.user.id,
                        timezone: userTimezone,
                        onEditTimezone: this.openSettingsModal,
                        onDeleteTimezone
                    })}
                </Menu>)}
            >
                {element => settings.get("_callTimeCalculator", false) ? element : <TooltipContainer text={`Click here to see ${props.user.username}'s time after some hours`} delay={750}>
                    {element}
                </TooltipContainer>}
            </Timer>)
        })

        Patcher.after(WebpackModules.getByProps('UserPopoutInfo'), "UserPopoutProfileText", (_this, [props], res) => {
            if (!isExistingUser(props.user.id)) return

            const userTimezone = getTimezone(props.user.id)

            let indexToInsert = res.props.children.findIndex(e => e?.type?.displayName === "UserPopoutCustomStatus")
            // fallback
            if (!indexToInsert) indexToInsert = 0

            const headerTimer = <Flex align={Flex.Align.CENTER} 
                className={`bodyTitle-1ySSKn fontDisplay-1dagSA ${Text.Sizes.SIZE_12} ${Text.Colors.HEADER_SECONDARY} uppercase-3VWUQ9 ${styles["header-prev"]}`}
                onContextMenu={e => openContextMenu(e, () => <Menu navId="fuses-timer-context-menu" onClose={closeContextMenu}>
                    {TimestampActions({
                        id: props.user.id,
                        timezone: userTimezone,
                        onEditTimezone: this.openSettingsModal,
                        onDeleteTimezone
                    })}
                </Menu>)}
            >
                <BasicTimer timezone={userTimezone} tooltip={false}>
                    {(element, formattedText, _, shouldShowTimerIcon) => {
                        const spanElement = <span onClick={() => settings.set("_callTimeCalculator", !settings.get("_callTimeCalculator", false))}>
                            {element} (UTC{userTimezone})
                        </span>
                        return <>
                            <TooltipContainer text={formattedText.toString()} className={styles["timer-icon"]}>
                                {!shouldShowTimerIcon ? <RotateClock rotateAngle={Number(formattedText['12hour']) * 30} /> : <DropdownArrow className={styles["close-icon"]} width={18} height={18} />}
                            </TooltipContainer>
                            {shouldShowTimerIcon ? spanElement : <TooltipContainer className={styles["header-timer"]} text={`Click here to see ${props.user.username}'s time after some hours`} delay={750}>
                                {spanElement}
                            </TooltipContainer>}
                        </>
                    }}
                </BasicTimer>
            </Flex>

            if (settings.get("_callTimeCalculator", false)) settings.set("_callTimeCalculator", false)
            res.props.children.splice(indexToInsert + 1, 0,
                settings.get("display", constants.Settings.TimerDisplay.USER_BANNER) === constants.Settings.TimerDisplay.USER_HEADER ? headerTimer : null,
                <TimeCalculator timezone={userTimezone} />
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

            if (!isExistingUser(props.message.author.id)) return

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
                    <span className={styles["dot"]}>•</span>
                    {(isBothSettingsApplied || settings.get("timestampsIcons", false)) && <TooltipContainer className={styles["timestamp-tooltip"]} text={`Message's time in ${props.message.author.username}'s timezone`}>
                        <ChatBubble width={16} height={16} />
                    </TooltipContainer>}
                    <BasicTimer className={styles["timestamp-timer"]} staticTime={getTimeFromTimezone(userTimezone, props.message.timestamp.toDate())} />
                </>)

                if (settings.get("timestamps", false)) children.push(<>
                    <span className={styles["dot"]}>•</span>
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
            const user: UserObject = props.user

            if (user.bot) return
            
            let menugroup = res.props?.children?.props?.children?.[4]
            if (!menugroup) return

            const timezone = getTimezone(user.id)

            const addTimezoneMenuItem = <MenuItem
                id="fuses-add-user"
                label="Add timezone"
                action={() => { this.openSettingsModal(user.id) }}
            />

            //@ts-ignore
            const timezoneActionsMenuItem = <MenuItem
                id="fuses-get-user"
                label="Timezone actions"
            >
                {TimestampActions({
                    id: user.id,
                    timezone,
                    onEditTimezone: this.openSettingsModal,
                    onDeleteTimezone
                })}
            </MenuItem>

            const isUserAdded = isExistingUser(user.id)

            menugroup.props.children.unshift(!isUserAdded ? addTimezoneMenuItem : timezoneActionsMenuItem)
        })

        Patcher.after(WebpackModules.find(m => m.default?.displayName === 'DMUserContextMenu'), "default", (_this, [props], res) => {
            const user: UserObject = props.user

            if (user.bot) return

            let userActions = res.props?.children?.props?.children?.[5]
            if (!userActions) return

            const timezone = getTimezone(user.id)

            const addTimezoneMenuItem = <MenuItem
                id="fuses-add-user"
                label="Add timezone"
                action={() => { this.openSettingsModal(user.id) }}
            />

            //@ts-ignore
            const timezoneActionsMenuItem = <MenuItem
                id="fuses-get-user"
                label="Timezone actions"
            >
                {TimestampActions({
                    id: user.id,
                    timezone,
                    onEditTimezone: this.openSettingsModal,
                    onDeleteTimezone
                })}
            </MenuItem>

            const isUserAdded = isExistingUser(user.id)

            userActions.props.children.unshift(!isUserAdded ? addTimezoneMenuItem : timezoneActionsMenuItem)
        })
    }

    openSettingsModal(userID: UserID){
        openModal((h) => <ModalRoot size={ModalSize.MEDIUM} className={styles["add-user-modal"]} {...h}>
            <ModalHeader separator={false}><Text size={Text.Sizes.SIZE_14} className={"h4-AQvcAz title-3sZWYQ defaultColor-1_ajX0 defaultMarginh4-2vWMG5"}>Add a new user</Text></ModalHeader>
            <ModalContent className={"bd-addon-modal-settings"}>
                <div className={styles["user-add-wrapper"]}>
                    <UserList 
                        defaultVals={{ userID, timezone: getTimezone(userID) , userPicker: { existingUsers: isExistingUser(userID) } }} 
                        isModal={true}
                        {...h} 
                    />
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