import React from "react";

import { Flex } from "@discord/components"
import { Channels } from "@discord/stores"
import { Patcher, WebpackModules } from "@zlibrary"
import { Timer } from "@discord/icons";
import settings from "../settingsManager"
import styles from "../style.scss"

import TimezoneValueGetter from "../components/TimezoneValueGetter";
import BasicTimer from "../components/BasicTimer";
import constants from "../utils/constants";

export default function(){
    const HeaderBarContainer = WebpackModules.find(m => m.default?.displayName === "HeaderBarContainer")
    const { Divider } = HeaderBarContainer.default

    Patcher.after(WebpackModules.find(m => m.default?.displayName === "PrivateChannel").default.prototype, "render", ({ props }, _, topRes) => {
        if (!settings.get("userlist-dm", true)) return

        const user: UserObject = props.user
        if (!user) return

        const firstOgMonkeypatch: Function = topRes.props?.children
        if (!firstOgMonkeypatch) return
        topRes.props.children = function () {
            const firstRes = firstOgMonkeypatch.apply(this, arguments)
            const activityStatus = firstRes.props?.subText
            const secondOgMonkeyPatch: Function = activityStatus?.type
            if (!secondOgMonkeyPatch || secondOgMonkeyPatch as any as string === "div") return firstRes
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
                            <span style={{ marginRight: "2px", height: "12px" }}>
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
            return firstRes
        }
    })

    Patcher.after(HeaderBarContainer.default.prototype, "render", ({ props }, _, res) => {
        if (!settings.get("header", true)) return

        const users = Channels.getChannel(props.channelId).recipients
        if (users.length !== 1) return
        const [userId] = users

        res.props.children.splice(1, 0, <TimezoneValueGetter userID={userId}>
            {state => <>
                <Divider />
                <BasicTimer timezone={state.value?.timezone} className={styles["dm-header-timer"]}>
                    {(element) => <Flex align={Flex.Align.CENTER}>
                        <Timer />
                        <span style={{ marginLeft: "4px" }} />
                        <span style={{
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                        }}>{element}</span>
                    </Flex>}
                </BasicTimer>
            </>}
        </TimezoneValueGetter>)
    })
}