import React from "react"

import { Patcher, WebpackModules, Utilities, DiscordModules } from "@zlibrary";
import { SettingsStore } from "@discord/stores";
import styles from "../style.scss";
import settings from "../settingsManager";

const { default: Avatar } = WebpackModules.getByProps("AnimatedAvatar")
const { AvatarDefaults } = DiscordModules

export default () => {
    Patcher.after(WebpackModules.find(e => e.default?.toString().indexOf("getGuildMemberAvatarURLSimple") > -1), "default", (_this, [props], res) => {
        // yes two ifs because its too hard to code lmao
        if (!(settings.get("compact-message", true) && SettingsStore.messageDisplayCompact)) return
        if (!settings.get("compact-message-reply", true) && props.hasOwnProperty('withMentionPrefix')) return

        let header = Utilities.findInReactTree(res, e => e?.renderPopout)

        // monkyepatch
        const ogFunc = header?.children
        if (!ogFunc) return
        header.children = (...args) => {
            let ret = ogFunc(...args);
            let children = ret.props?.children

            // Add wrapper style
            ret.props.className += " " + styles["align-wrapper"]

            // To prevent duplication
            if (React.isValidElement(children.props?.children?.[0])) return ret

            //Finally apply the avatar
            const url = AvatarDefaults.getUserAvatarURL(props.message.author)
            children.props.children.unshift(<Avatar src={url} className={styles["align-wrapper-icon"]} size={Avatar.Sizes.SIZE_16} />)

            return ret;
        }

    })
}