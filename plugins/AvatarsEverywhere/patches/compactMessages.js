import React from "react"

import { Patcher, WebpackModules, Utilities, DiscordModules } from "@zlibrary";
import { SettingsStore, SelectedGuilds } from "@discord/stores";
import styles from "../style.scss";
import settings from "../settingsManager";

const { default: Avatar } = WebpackModules.getByProps("AnimatedAvatar")
const { AvatarDefaults } = DiscordModules

export default () => {
    Patcher.after(WebpackModules.find(e => e.default?.toString().indexOf("getGuildMemberAvatarURLSimple") > -1), "default", (_this, [props], res) => {
        if (!(settings.get("compact-message", true) && SettingsStore.messageDisplayCompact)) return

        let header = Utilities.findInReactTree(res, e => e?.props?.renderPopout)

        // console.log(header)
        // monkyepatch
        const firstOgFunc = header?.type
        if (!firstOgFunc) return
        header.type = (...args) => {
            let firstRet = firstOgFunc(...args);

            // console.log("first ret", firstRet)

            const secondOgFunc = firstRet.props?.children?.[1]?.props?.children
            if (!secondOgFunc) return
            firstRet.props.children[1].props.children = (...args) => {
                let secondRet = secondOgFunc(...args);
                let children = secondRet.props?.children

                // Add wrapper style
                secondRet.props.className += " " + styles["align-wrapper"]

                // To prevent duplication
                if (React.isValidElement(children?.[0])) return firstRet
                
                //Finally apply the avatar
                const url = props.message.author.getAvatarURL(SelectedGuilds.getGuildId(), 16)
                if (!_.isArray(children)) secondRet.props.children = [ children ]
                secondRet.props.children.unshift(<Avatar src={url} className={styles["align-wrapper-icon"]} size={Avatar.Sizes.SIZE_16} />)

                return secondRet;
            }
            return firstRet;
        }
    })

    Patcher.after(WebpackModules.find(m => m.default?.displayName === "Username"), "default", (_this, [props], res) => {
        if (!(settings.get("compact-message-reply", true) && SettingsStore.messageDisplayCompact)) return

        const firstOgFunc = res.type
        if (!firstOgFunc) return
        res.type = (...args) => {
            let firstRet = firstOgFunc(...args);
            console.log("firstRet", firstRet)

            const secondOgFunc = firstRet.props?.children?.[1]?.props?.children
            if (!secondOgFunc) return
            firstRet.props.children[1].props.children = (...args) => {
                let secondRet = secondOgFunc(...args);
                let children = secondRet.props?.children

                // Add wrapper style
                secondRet.props.className += " " + styles["align-wrapper"]

                // To prevent duplication
                if (React.isValidElement(children?.[0])) return firstRet

                //Finally apply the avatar
                const url = props.message.author.getAvatarURL(SelectedGuilds.getGuildId(), 16)
                if (!_.isArray(children)) secondRet.props.children = [children]
                secondRet.props.children.unshift(<Avatar src={url} className={styles["align-wrapper-icon"]} size={Avatar.Sizes.SIZE_16} />)

                return secondRet;
            }
            return firstRet;
        }
    })
}