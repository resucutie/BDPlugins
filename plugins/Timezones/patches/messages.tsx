import React from "react";

import { Patcher, Utilities, WebpackModules } from "@zlibrary";
import { TooltipContainer } from "@discord/components";
import { ChatBubble } from "@discord/icons";
import { Users } from "@discord/stores";
import { Timer } from "@discord/icons";
import settings from "../settingsManager";
import styles from "../style.scss"

import { getTimeFromTimezone } from "../utils/timezones";
import TimezoneValueGetter from "../components/TimezoneValueGetter";
import BasicTimer from "../components/BasicTimer";
import constants from "../utils/constants";

export default function(){
    const OriginalMessageTimestamp = WebpackModules.getModule(m => m?.default?.toString().indexOf("showTimestampOnHover") > -1);

    /**
     * Totally original code
     * @see {@link https://github.com/Strencher/BetterDiscordStuff/blob/337cb03bd0b1551138be09b2ed9faa0e466f897d/PronounDB/index.js#L39-L67}
    */
    Patcher.after(OriginalMessageTimestamp, "default", (_this, [props], res) => {
        if (!(settings.get("timestamps", false) || settings.get("timestampsMessages", true))) return
        if (Users.getCurrentUser().id === props.message.author.id) return

        const isBothSettingsApplied = settings.get("timestamps", false) && settings.get("timestampsMessages", true)

        let timestamp = Utilities.findInReactTree(res, e => e?.type?.displayName === "MessageTimestamp")

        const firstOgFunc = timestamp?.type
        if (!firstOgFunc) return
        timestamp.type = function () {
            let firstRes = firstOgFunc.apply(this, arguments)
            let children = firstRes?.props?.children
            if (!children) return firstRes

            firstRes.props.className += ` ${styles["timestamp-timer-wrapper"]}`

            if (!_.isArray(children)) children = [children]


            if (settings.get("timestampsMessages", true)) children.push(<TimezoneValueGetter userID={props.message.author.id}>
                {state => !state.loading && Boolean(state.value?.timezone) && <>
                    <span className={styles["dot"]}>•</span>
                    {(isBothSettingsApplied || settings.get("timestampsIcons", false)) && <TooltipContainer className={styles["timestamp-tooltip"]} text={`Message's time in ${props.message.author.username}'s timezone`}>
                        <ChatBubble width={16} height={16} />
                    </TooltipContainer>}
                    <BasicTimer className={styles["timestamp-timer"]} staticTime={getTimeFromTimezone(state.value?.timezone, props.message.timestamp.toDate())} />
                </>}
            </TimezoneValueGetter>)

            if (settings.get("timestamps", false)) children.push(<TimezoneValueGetter userID={props.message.author.id}>
                {state => !state.loading && Boolean(state.value?.timezone) && <>
                    <span className={styles["dot"]}>•</span>
                    {(isBothSettingsApplied || settings.get("timestampsIcons", false)) && <TooltipContainer className={styles["timestamp-tooltip"]} text={`${props.message.author.username}'s current time`}>
                        <Timer width={16} height={16} />
                    </TooltipContainer>}
                    <BasicTimer className={styles["timestamp-timer"]} timezone={state.value?.timezone} />
                </>}
            </TimezoneValueGetter>)

            firstRes.props.children = children

            return firstRes
        }
    })
    const Modules = WebpackModules.findAll(m => ~["ChannelMessage", "InboxMessage"].indexOf(m?.type?.displayName)) as any[]
    for (const Module of Modules) {
        Patcher.after(Module, "type", (_, __, ret) => {
            const tree = Utilities.findInReactTree(ret, m => m?.childrenHeader);
            if (!tree) return;
            tree.childrenHeader.type.type = OriginalMessageTimestamp.default;
        });
    }

    Patcher.after(WebpackModules.find(m => m.default?.displayName === "MemberListItem").default.prototype, "render", ({props}, _, topRes) => {
        if (!settings.get("userlist-server", true)) return
        
        const user: UserObject = props.user

        const activityStatus = topRes.props?.subText
        const secondOgMonkeyPatch: Function = activityStatus?.type
        if (!secondOgMonkeyPatch || secondOgMonkeyPatch as any as string === "div") return
        activityStatus.type = function () {
            const res = secondOgMonkeyPatch.apply(this, arguments)

            if (!res) {
                return <div className={arguments[0].className}>
                    <TimezoneValueGetter userID={user.id}>
                        {state => <>
                            <span style={{ marginRight: "2px", height: "12px" }}>
                                <Timer width={12} height={12} />
                            </span>
                            <BasicTimer timezone={state.value?.timezone} tooltip={false} />
                        </>}
                    </TimezoneValueGetter>
                </div>
            } else {
                const align = settings.get("userlist-align", constants.Settings.TimerAlign.RIGHT)
                const view = <TimezoneValueGetter userID={user.id}>
                    {state => <>
                        {align === constants.Settings.TimerAlign.RIGHT && <span className={styles["dot"]}>•</span>}
                        <span style={{marginRight: "2px", height: "12px" }}>
                            <Timer width={12} height={12} style={{ minWidth: "12px" }} />
                        </span>
                        <BasicTimer timezone={state.value?.timezone} tooltip={false} />
                        {align === constants.Settings.TimerAlign.LEFT && <span className={styles["dot"]}>•</span>}
                    </>}
                </TimezoneValueGetter>
                if (align === constants.Settings.TimerAlign.RIGHT) res.props.children.push(view)
                else if (align === constants.Settings.TimerAlign.LEFT) res.props.children.unshift(view)
            }

            return res
        }
    })
}