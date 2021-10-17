// import { Patcher, WebpackModules, DiscordModules, DiscordSelectors, Utilities, ReactComponents } from "@zlibrary";
// import { Users as UserStore } from "@discord/stores";
// import styles from "../../style.scss";
// import settings from "../../settingsManager";

// const { default: Avatar } = WebpackModules.getByProps("AnimatedAvatar")
// const { AvatarDefaults, RelationshipStore } = DiscordModules


// /**
//     * Most of the pieces of code are from BetterRoleColors. Thanks Zere!
//     * @see {@link https://github.com/rauenzi/BetterDiscordAddons/blob/726f015e791852d6ef85a2c0236c90cec04aa87b/Plugins/BetterRoleColors/BetterRoleColors.plugin.js#L293-L324}
// */
// export default async () => {
//     Patcher.after(WebpackModules.find(m => m?.default?.displayName === "HeaderBar"), "default", (_this, [props], res) => {
//         console.log(_this, props, res)
//         let nameBar = Utilities.findInReactTree(props, m => m?.props?.className?.indexOf?.("cursorPointer") > -1)
//         console.log(nameBar)

//         if (_.isArray(nameBar.props.children)) {
//             nameBar.props.children = [nameBar.props.children]
//         }
//         nameBar.props.children.push(<Avatar src={AvatarDefaults.getUserAvatarURL(user)} className={styles["align-wrapper-icon"]} size={Avatar.Sizes.SIZE_16} />)
//     });
// }