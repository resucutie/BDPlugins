import { Patcher, WebpackModules, DiscordModules, Utilities, ReactComponents } from "@zlibrary";
import BasePlugin from "@zlibrary/plugin";
import { Users as UserStore, SettingsStore } from "@discord/stores";
import styles from "./style.scss";
import stylesheet from "styles"
import SettingsPanel from "./Settings"
import settings from "./settingsManager";

const { AvatarDefaults, RelationshipStore } = DiscordModules
const { default: Avatar } = WebpackModules.getByProps("AnimatedAvatar")

export default class AvatarsEverywhere extends BasePlugin {
    onStart() {
        stylesheet.inject()

        this.patchUserMention()
        this.patchTypingBar()
        this.patchCompactMessages()
        this.patchSystemMessages()
    }

    patchUserMention(){
        Patcher.after(WebpackModules.getModule(m => m?.default?.displayName === "UserMention"), "default", (_this, [props], wrapperRes) => {
            if (!settings.get("mentions", true)) return

            // monkyepatch
            const _oldFunc = wrapperRes.props.children
            wrapperRes.props.children = function() {
                let res = _oldFunc.apply(this, arguments)

                let text = res.props.children

                if (settings.get("mentions-no-at", false)){
                    //i need to find a way to make this better
                    text = Utilities.findInTree(text, e => e?.charAt?.(0) === "@").slice(1)
                }

                const user = UserStore.getUser(props.userId)

                res.props.children = [<Avatar src={AvatarDefaults.getUserAvatarURL(user)} className={styles["avatar-util-align-wrapper-icon"]} size={Avatar.Sizes.SIZE_16} />, text]
                
                res.props.className += " " + styles["avatar-util-align-wrapper"]
                
                //console.log(arguments, res)
                return res
            }
        })
    }

    /** 
     * Most of the pieces of code are from BetterRoleColors. Thanks Zere!
     * @see {@link https://github.com/rauenzi/BetterDiscordAddons/blob/726f015e791852d6ef85a2c0236c90cec04aa87b/Plugins/BetterRoleColors/BetterRoleColors.plugin.js#L293-L324}
    */
    async patchTypingBar(){
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

        const TypingUsers = await ReactComponents.getComponentByName("TypingUsers");
        if (!TypingUsers?.component?.prototype) return

        Patcher.after(TypingUsers.component.prototype, "render", (_this, [props], res) => {
            if (!settings.get("typing-users", true)) return

            const typingUsers = filterTypingUsers(Object.assign({}, _this.props.typingUsers));
            
            for (let m = 0; m < typingUsers.length; m++) {
                const user = UserStore.getUser(typingUsers[m].id);
                if (!user) continue;

                let userChildren = res.props.children[1].props.children[m * 2]

                userChildren.props.children.unshift(<Avatar src={AvatarDefaults.getUserAvatarURL(user)} className={styles["avatar-util-align-wrapper-icon"]} size={Avatar.Sizes.SIZE_16} />)
                userChildren.props.className += " " + styles["avatar-util-align-wrapper"]
            }
        });

        TypingUsers.forceUpdateAll();
    }

    patchCompactMessages(){
        Patcher.after(WebpackModules.find(e => e.default?.toString().indexOf("getGuildMemberAvatarURLSimple") > -1), "default", (_this, [props], res) => {
            // yes three ifs because my brain is dumb and i like readable code
            // also those tables are here to not confuse my brain

            // ~compact-message | ~SettingsStore.messageDisplayCompact | return
            // 0                | 0                                    | 0
            // 1                | 0                                    | 1
            // 0                | 1                                    | 1
            // 1                | 1                                    | 1
            if (!settings.get("compact-message", false) || !SettingsStore.messageDisplayCompact) return
            if (!props.compact) return
            // compact-message-reply | withMentionPrefix | return
            // 0                     | 0                 | 1
            // 1                     | 0                 | 1
            // 0                     | 1                 | 1
            // 1                     | 1                 | 0
            if (!(settings.get("compact-message-reply", false) && props.hasOwnProperty('withMentionPrefix'))) return

            let header = Utilities.findInReactTree(res, e => e?.renderPopout)
            console.log(header)
            
            // monkyepatch
            const ogFunc = header?.children
            if (!ogFunc) return
            header.children = (...args) => {
                let ret = ogFunc(...args);
                let children = ret.props?.children

                // Add wrapper style
                ret.props.className += " " + styles["avatar-util-align-wrapper"]

                // To prevent duplication
                if (React.isValidElement(children.props?.children?.[0])) return ret

                //Finally apply the avatar
                const url = AvatarDefaults.getUserAvatarURL(props.message.author)
                children.props.children.unshift(<Avatar src={url} className={styles["avatar-util-align-wrapper-icon"]} size={Avatar.Sizes.SIZE_16}/>)
                
                return ret;
            }

        })
    }

    patchSystemMessages(){
        // user join
        Patcher.after(WebpackModules.find(m => m.default?.displayName === "UserJoin"), "default", (_this, [props], res) => {
            if (!settings.get("system-messages-join", true)) return

            let userName = Utilities.findInReactTree(res, e => e?.renderPopout)

            // monkepatch
            const ogFunc = userName?.children
            if (!ogFunc) return
            userName.children = (...args) => {
                let ret = ogFunc(...args);

                ret.props.className += " " + styles["avatar-util-align-wrapper"]
                
                // To prevent duplication
                if (React.isValidElement(ret.props?.children?.[0])) return ret

                const url = AvatarDefaults.getUserAvatarURL(props.message.author)
                ret.props.children.unshift(<Avatar src={url} className={styles["avatar-util-align-wrapper-icon"]} size={Avatar.Sizes.SIZE_16} />)

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

                ret.props.className += " " + styles["avatar-util-align-wrapper"]

                // To prevent duplication
                if (React.isValidElement(ret.props?.children?.[0])) return ret

                const url = AvatarDefaults.getUserAvatarURL(_this.props.message.author)
                ret.props.children.unshift(<Avatar src={url} className={styles["avatar-util-align-wrapper-icon"]} size={Avatar.Sizes.SIZE_16} />)

                return ret;
            }
        })

        // thread created
        Patcher.after(WebpackModules.find(m => m.default?.displayName === "ThreadCreated"), "default", (_this, [props], res) => {
            if (!settings.get("system-messages-thread", true)) return

            const url = AvatarDefaults.getUserAvatarURL(props.message.author)
            res.props.children.unshift(<Avatar src={url} className={styles["avatar-util-align-wrapper-icon"]} size={Avatar.Sizes.SIZE_16} />)
        })
    }


    getSettingsPanel() {
        return <SettingsPanel />;
    }

    onStop() {
        Patcher.unpatchAll()
        stylesheet.remove()
    }
}