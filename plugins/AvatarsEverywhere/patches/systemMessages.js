import React from "react"

import { Patcher, WebpackModules, Utilities, DiscordModules } from "@zlibrary";
import styles from "../style.scss";
import settings from "../settingsManager";

const { default: Avatar } = WebpackModules.getByProps("AnimatedAvatar")
const { AvatarDefaults } = DiscordModules

export default () => {
    // function to prevent copying and paste
    const setupEnv = (element, checkElement) => {
        if (!element) return true
        element.props.className += " " + styles["align-wrapper"]

        if (!checkElement) return
        return React.isValidElement(checkElement)
    }

    // user join
    Patcher.after(WebpackModules.find(m => m.default?.displayName === "UserJoin"), "default", (_this, [props], res) => {
        if (!settings.get("system-messages-join", true)) return

        let userName = Utilities.findInReactTree(res, e => e?.renderPopout)

        // monkepatch
        const ogFunc = userName?.children
        if (!ogFunc) return
        userName.children = (...args) => {
            let ret = ogFunc(...args);

            if (setupEnv(ret, ret.props?.children?.[0])) return ret

            const url = AvatarDefaults.getUserAvatarURL(props.message.author)
            ret.props.children.unshift(<Avatar src={url} className={styles["align-wrapper-icon"]} size={Avatar.Sizes.SIZE_16} />)

            return ret;
        }
    })

    // server boost
    Patcher.after(WebpackModules.find(m => m.default?.displayName === "UserPremiumGuildSubscription").default.prototype, "render", (_this, [props], res) => {
        if (!settings.get("system-messages-boost", true)) return

        let userName = Utilities.findInReactTree(res, e => e?.props?.renderPopout)

        const ogFunc = userName?.props?.children
        if (!ogFunc) return
        userName.props.children = (...args) => {
            let ret = ogFunc(...args);

            if (setupEnv(ret, ret.props?.children?.[0])) return ret

            const url = AvatarDefaults.getUserAvatarURL(_this.props.message.author)
            ret.props.children.unshift(<Avatar src={url} className={styles["align-wrapper-icon"]} size={Avatar.Sizes.SIZE_16} />)

            return ret;
        }
    })

    // thread created
    Patcher.after(WebpackModules.find(m => m.default?.displayName === "ThreadCreated"), "default", (_this, [props], res) => {
        if (!settings.get("system-messages-thread-created", true)) return

        const url = AvatarDefaults.getUserAvatarURL(props.message.author)
        res.props.children.unshift(<Avatar src={url} className={styles["align-wrapper-icon"]} size={Avatar.Sizes.SIZE_16} />)
    })

    //thread member removed
    Patcher.after(WebpackModules.find(m => m.default?.displayName === "ThreadMemberRemove"), "default", (_this, [props], res) => {
        if (!settings.get("system-messages-thread-member-removed", true)) return

        const personRemoveUser = props.message.author
        const removedUser = props.targetUser

        let personRemoveUserElement = Utilities.findInReactTree(res, e => e?.props?.renderPopout && e?.key === "0")
        let removedUserElement = Utilities.findInReactTree(res, e => e?.props?.renderPopout && e?.key === "2")

        const personRemoveUserElementOgFunc = personRemoveUserElement?.props?.children
        const removedUserElementOgFunc = removedUserElement?.props?.children
        if (!(personRemoveUserElementOgFunc && removedUserElementOgFunc)) return
        personRemoveUserElement.props.children = (...args) => {
            let ret = personRemoveUserElementOgFunc(...args);

            if (setupEnv(ret, ret.props?.children?.[0])) return ret

            const url = AvatarDefaults.getUserAvatarURL(personRemoveUser)
            ret.props.children.unshift(<Avatar src={url} className={styles["align-wrapper-icon"]} size={Avatar.Sizes.SIZE_16} />)

            return ret;
        }
        removedUserElement.props.children = (...args) => {
            let ret = removedUserElementOgFunc(...args);

            if (setupEnv(ret, ret.props?.children?.[0])) return ret

            const url = AvatarDefaults.getUserAvatarURL(removedUser)
            ret.props.children.unshift(<Avatar src={url} className={styles["align-wrapper-icon"]} size={Avatar.Sizes.SIZE_16} />)

            return ret;
        }
    })
}