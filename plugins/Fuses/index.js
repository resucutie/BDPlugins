import React, { useState, useEffect } from "react"
import BasePlugin from "@zlibrary/plugin";
import { Patcher, WebpackModules, Utilities } from "@zlibrary";
import stylesheet from "styles"
import styles from "./style.scss"

import { getTimezone } from "./utils/userList";
import SettingsPanel from "./Settings";
import Timer from "./components/Timer";
import BasicTimer from "./components/BasicTimer";
import settings from "./settingsManager";

export default class Fuses extends BasePlugin {


    onStart() {
        stylesheet.inject()
        this.handleUserBannerPatch()
        this.handleTimestampPatch()
    }

    handleUserBannerPatch(){
        Patcher.after(WebpackModules.find(m => m.default?.displayName === 'UserBanner'), "default", (_this, [props], res) => {
            let userTimezone = getTimezone(props.user.id)
            if (!userTimezone) return

            res.props.children.push(<Timer timezone={userTimezone} className={styles["timer-positioning"]}/>)
        })
    }

    /**
     * Totally original code
     * @see {@link https://github.com/Strencher/BetterDiscordStuff/blob/337cb03bd0b1551138be09b2ed9faa0e466f897d/PronounDB/index.js#L39-L67}
     */
    handleTimestampPatch(){
        const OriginalMessageTimestamp = WebpackModules.getModule(m => m?.default?.toString().indexOf("showTimestampOnHover") > -1);

        Patcher.after(OriginalMessageTimestamp, "default", (_this, [props], res) => {
            if (!settings.get("timestamps", false)) return

            let userTimezone = getTimezone(props.message.author.id)
            if (!userTimezone) return

            let timestamp = Utilities.findInReactTree(res, e => e?.type?.displayName === "MessageTimestamp")
            
            const firstOgFunc = timestamp?.type
            if (!firstOgFunc) return
            timestamp.type = function(){
                let firstRes = firstOgFunc.apply(this, arguments)
                let children = firstRes?.props?.children
                if (!children) return firstRes

                if (!_.isArray(children)) children = [children]

                children.push(<span className={styles["timestamp-dot"]}>•</span>, <BasicTimer className={styles["timestamp-timer"]} timezone={userTimezone} />)

                firstRes.props.children = children

                return firstRes
            }
        })

        // Thanks discord.
        const Modules = WebpackModules.findAll(m => ~["ChannelMessage", "InboxMessage"].indexOf(m?.type?.displayName));

        for (const Module of Modules) {
            Patcher.after(Module, "type", (_, __, ret) => {
                const tree = Utilities.findInReactTree(ret, m => m?.childrenHeader);
                if (!tree) return;
                tree.childrenHeader.type.type = OriginalMessageTimestamp.default;
            });
        }
    }

    getSettingsPanel() {
        return <SettingsPanel />;
    }

    onStop() {
        Patcher.unpatchAll()
        stylesheet.remove()
    }
}