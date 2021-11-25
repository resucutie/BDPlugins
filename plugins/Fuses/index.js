import React, { useState, useEffect } from "react"
import BasePlugin from "@zlibrary/plugin";
import { Patcher, WebpackModules } from "@zlibrary";
import stylesheet from "styles"
import style from "./style.scss"

import { getTimezone } from "./utils/userList";
import { getOffset, getTimeFromTimezone } from "./utils/timezones";
import SettingsPanel from "./Settings";
import TimerComponent from "./components/Timer";
import useTimezone from "./hooks/useTimezone";

export default class Fuses extends BasePlugin {
    onStart() {
        stylesheet.inject()
        this.handlePatch()
    }

    handlePatch(){
        Patcher.after(WebpackModules.find(m => m.default?.displayName === 'UserBanner'), "default", (_this, [props], res) => {
            let userTimezone = getTimezone(props.user.id)
            if (!userTimezone) return

            res.props.children.push(<TimerComponent timezone={userTimezone} className={style["timer-positioning"]}/>)
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