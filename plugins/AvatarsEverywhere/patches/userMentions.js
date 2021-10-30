import { Patcher, WebpackModules, Utilities, DiscordModules } from "@zlibrary";
import { Users as UserStore, SelectedGuilds } from "@discord/stores";
import styles from "../style.scss";
import settings from "../settingsManager";

const { default: Avatar } = WebpackModules.getByProps("AnimatedAvatar")

export default () => {
    Patcher.after(WebpackModules.getModule(m => m?.default?.displayName === "UserMention"), "default", (_this, [props], wrapperRes) => {
        if (!settings.get("mentions", true)) return

        // monkyepatch
        const _oldFunc = wrapperRes.props.children
        wrapperRes.props.children = function () {
            let res = _oldFunc.apply(this, arguments)

            let text = res.props.children

            if (settings.get("mentions-no-at", false)) {
                //i need to find a way to make this better
                text = Utilities.findInTree(text, e => e?.charAt?.(0) === "@").slice(1)
            }

            const user = UserStore.getUser(props.userId)
            res.props.children = [<Avatar src={user.getAvatarURL(SelectedGuilds.getGuildId(), 16)} className={styles["align-wrapper-icon"]} size={Avatar.Sizes.SIZE_16} />, text]

            res.props.className += " " + styles["align-wrapper"]

            return res
        }
    })
}