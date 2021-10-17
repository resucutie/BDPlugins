import { Patcher, WebpackModules, DiscordModules, DiscordSelectors, ReactComponents } from "@zlibrary";
import { Users as UserStore } from "@discord/stores";
import styles from "../../style.scss";
import settings from "../../settingsManager";

const { default: Avatar } = WebpackModules.getByProps("AnimatedAvatar")
const { AvatarDefaults, RelationshipStore } = DiscordModules

const filterTypingUsers = (typingUsers) => {
    if (!typingUsers) return [];

    return Object.keys(typingUsers).filter((e) => {
        return e != UserStore.getCurrentUser().id;
    }).filter((e) => {
        return !RelationshipStore.isBlocked(e);
    }).map((e) => {
        return UserStore.getUser(e);
    }).filter(function (e) {
        return e != null;
    });
}

/**
    * Most of the pieces of code are from BetterRoleColors. Thanks Zere!
    * @see {@link https://github.com/rauenzi/BetterDiscordAddons/blob/726f015e791852d6ef85a2c0236c90cec04aa87b/Plugins/BetterRoleColors/BetterRoleColors.plugin.js#L293-L324}
*/
export default async () => {
    const TypingUsers = await ReactComponents.getComponentByName("TypingUsers", DiscordSelectors.Typing.typing);
    if (!TypingUsers?.component?.prototype) return

    Patcher.after(TypingUsers.component.prototype, "render", (_this, [props], res) => {
        if (!settings.get("typing-users", true)) return

        const userList = filterTypingUsers(Object.assign({}, _this.props.typingUsers));
        console.log(userList)
        if (!userList) return

        for (let m = 0; m < userList.length; m++) {
            const user = UserStore.getUser(userList[m].id);
            if (!user) continue

            let tree = res?.props?.children?.[1]?.props?.children
            if (!tree) continue
            let userChildren = tree[m * 2]

            userChildren.props.children.unshift(<Avatar src={AvatarDefaults.getUserAvatarURL(user)} className={styles["align-wrapper-icon"]} size={Avatar.Sizes.SIZE_16} />)
            userChildren.props.className += " " + styles["align-wrapper"]
        }
    });

    TypingUsers.forceUpdateAll();
}