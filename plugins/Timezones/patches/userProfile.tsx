import React from "react"

import { Patcher, WebpackModules } from "@zlibrary"
import { closeContextMenu, Menu, openContextMenu } from "@discord/contextmenu"
import { Users } from "@discord/stores"
import { DropdownArrow } from "@discord/icons"
import styles from "../style.scss"
import settings from "../settingsManager"
import { Flex, TooltipContainer, Text, HeaderType } from "@discord/components"

import TimestampActions from "../components/context menus/TimestampActions"
import TimezoneValueGetter from "../components/TimezoneValueGetter"
import constants from "../utils/constants"
import ThisPlugin from "../index"
import RotateClock from "../components/custom icons/RotateClock"
import TimeCalculator from "../components/TimeCalculator"
import BasicTimer from "../components/BasicTimer"
import Timer from "../components/Timer"

const Header: HeaderType = WebpackModules.find(m => m.Tags && m.displayName === "Header")

export default function(){
    Patcher.after(WebpackModules.find(m => m.default?.displayName === 'UserBanner'), "default", (_this, [props], res) => {
        if (!settings.get("userpopout", true) ||
            settings.get("userpopout-display", constants.Settings.TimerDisplay.USER_BANNER) !== constants.Settings.TimerDisplay.USER_BANNER
        ) return

        if (Users.getCurrentUser().id === props.user.id) return

        res.props.children.push(<TimezoneValueGetter userID={props.user.id}>
            {(state) => {
                return <Timer
                    onClick={() => settings.set("_callTimeCalculator", !settings.get("_callTimeCalculator", false))}
                    timezone={state.value?.timezone}
                    className={styles["timer-positioning"]}
                    onContextMenu={e => openContextMenu(e, () => <Menu navId="timezones-timer-context-menu" onClose={closeContextMenu}>
                        {TimestampActions({
                            id: props.user.id,
                            timezone: state.value?.timezone,
                            onEditTimezone: async id => await ThisPlugin.prototype.openSettingsModal(id, Boolean(!state.value?.offlineTz && state.value?.timezone)),
                            onDeleteTimezone: ThisPlugin.prototype.onDeleteTimezone,
                            isOnline: !state.value?.offlineTz
                        })}
                    </Menu>)}
                >
                    {element => settings.get("_callTimeCalculator", false)
                        ? element
                        : <TooltipContainer text={`Click here to see ${"yes"}'s time after some hours`} delay={750}>{element}</TooltipContainer>
                    }
                </Timer>
            }}
        </TimezoneValueGetter>)
    })

    Patcher.after(WebpackModules.getByProps('UserPopoutInfo'), "UserPopoutProfileText", (_this, [props], res) => {
        if (Users.getCurrentUser().id === props.user.id) return

        let indexToInsert = res.props.children.findIndex(e => e?.type?.displayName === "UserPopoutCustomStatus")
        // fallback
        if (!indexToInsert) indexToInsert = 0

        if (settings.get("_callTimeCalculator", false)) settings.set("_callTimeCalculator", false)
        res.props.children.splice(indexToInsert + 1, 0,
            (
                settings.get("userpopout", true) &&
                (settings.get("userpopout-display", constants.Settings.TimerDisplay.USER_BANNER) === constants.Settings.TimerDisplay.USER_HEADER)
            ) && <TimezoneValueGetter userID={props.user.id}>
                    {  //@ts-ignore
                        (state) => <Header size={Header.Sizes.SIZE_12} muted={true} uppercase={true} className="bodyTitle-2Az3VQ">
                        <Flex align={Flex.Align.CENTER}
                            className={styles["header-prev"]}
                            onContextMenu={e => openContextMenu(e, () => <Menu navId="timezones-timer-context-menu" onClose={closeContextMenu}>
                                {TimestampActions({
                                    id: props.user.id,
                                    timezone: state.value?.timezone,
                                    onEditTimezone: async id => await ThisPlugin.prototype.openSettingsModal(id, Boolean(!state.value?.offlineTz && state.value?.timezone)),
                                    onDeleteTimezone: ThisPlugin.prototype.onDeleteTimezone,
                                    isOnline: !state.value?.offlineTz
                                })}
                            </Menu>)}
                        >
                            <BasicTimer timezone={state.value?.timezone} tooltip={false}>
                                {(element, { formattedText, isTimerCalculatorOpen, emojiIcon }) => {
                                    const spanElement = <span onClick={() => settings.set("_callTimeCalculator", !settings.get("_callTimeCalculator", false))}>
                                        {element} (UTC{state.value?.timezone})
                                    </span>
                                    return <>
                                        {!isTimerCalculatorOpen
                                            ? <TooltipContainer text={formattedText.toString()} className={styles["timer-icon"]}>
                                                {emojiIcon ? <img src={emojiIcon} width={12} height={12} style={{ margin: "3px 1px" }} /> : <RotateClock rotateAngle={Number(formattedText['12hour']) * 30} />}
                                            </TooltipContainer>
                                            : <DropdownArrow className={styles["close-icon"]} width={18} height={18} />
                                        }
                                        {isTimerCalculatorOpen ? spanElement : <TooltipContainer className={styles["header-timer"]} text={`Click here to see ${props.user.username}'s time after some hours`} delay={750}>
                                            {spanElement}
                                        </TooltipContainer>}
                                    </>
                                }}
                            </BasicTimer>
                        </Flex>
                    </Header>}
            </TimezoneValueGetter>,
            <TimezoneValueGetter userID={props.user.id}>
                {(state) => !state.loading && Boolean(state.value?.timezone) && <TimeCalculator timezone={state.value?.timezone} />}
            </TimezoneValueGetter>
        )
    })
}