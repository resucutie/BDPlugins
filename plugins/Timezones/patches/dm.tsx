import React from "react";

import { Flex, HeaderType, Popout } from "@discord/components"
import { Channels } from "@discord/stores"
import { Patcher, WebpackModules } from "@zlibrary"
import { Timer } from "@discord/icons";
import settings from "../settingsManager"
import styles from "../style.scss"

import TimezoneValueGetter from "../components/TimezoneValueGetter";
import BasicTimer from "../components/BasicTimer";
import constants from "../utils/constants";
import TimeCalculator from "../components/TimeCalculator";
import { ModalContent, ModalHeader, ModalRoot, ModalSize } from "@discord/modal";

const Header: HeaderType = WebpackModules.find(m => m.Tags && m.displayName === "Header")

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

                const iconStyles = (emojiIcon) => ({
                    marginRight: emojiIcon ? "4px" : "2px",
                    height: "12px",
                    opacity: emojiIcon && !firstRes.props.selected ? ".6" : "1"
                })

                if (!res) {
                    return <div className={arguments[0].className}>
                        <TimezoneValueGetter userID={user.id}>
                            {state => <BasicTimer timezone={state.value?.timezone} tooltip={false}>
                                {(element, { emojiIcon }) => <>
                                    <span style={iconStyles(emojiIcon)}>
                                        {emojiIcon ? <img src={emojiIcon} width={12} height={12} /> : <Timer width={12} height={12} style={{ minWidth: "12px" }} />}
                                    </span>
                                    {element}
                                </>}
                            </BasicTimer>}
                        </TimezoneValueGetter>
                    </div>
                } else {
                    const align = settings.get("userlist-align", constants.Settings.TimerAlign.RIGHT)
                    const view = <TimezoneValueGetter userID={user.id}>
                        {state => <>
                            {align === constants.Settings.TimerAlign.RIGHT && <span className={styles["dot"]}>•</span>}
                            <BasicTimer timezone={state.value?.timezone} tooltip={false}>
                                {(element, { emojiIcon }) => <>
                                    <span style={iconStyles(emojiIcon)}>
                                        {emojiIcon ? <img src={emojiIcon} width={12} height={12} /> : <Timer width={12} height={12} style={{ minWidth: "12px" }} />}
                                    </span>
                                    {element}
                                </>}
                            </BasicTimer>
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

        const users: UserID[] = Channels.getChannel(props.channelId)?.recipients
        if (users?.length !== 1) return
        const [userId] = users

        res.props.children.splice(1, 0, <TimezoneValueGetter userID={userId}>
            {state => <>
                <Divider />
                <BasicTimer timezone={state.value?.timezone} className={styles["dm-header-timer"]} tooltip={false}>
                    {(element, { emojiIcon }) => <Popout position={Popout.Positions.BOTTOM} renderPopout={(props) => <div {...props}>
                        <ModalRoot size={ModalSize.SMALL} transitionState={1}>
                            <ModalHeader separator={false}>
                                <Header
                                    //@ts-ignore
                                    size={Header.Sizes.SIZE_20}
                                    tag="h2"
                                >Calculate time</Header>
                            </ModalHeader>
                            <ModalContent>
                                <TimeCalculator shouldAnimate={false} timezone={state.value?.timezone} />
                            </ModalContent>
                        </ModalRoot>
                    </div>}>
                        {props => <Flex align={Flex.Align.CENTER} {...props}>
                            {emojiIcon ? <img src={emojiIcon} width={16} height={16} style={{ marginRight: "2px" }} /> : <Timer />}
                            <span style={{ marginLeft: "4px" }} />
                            <span style={{
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                            }}>{element}</span>
                        </Flex>}
                    </Popout>}
                </BasicTimer>
            </>}
        </TimezoneValueGetter>)
    })
}