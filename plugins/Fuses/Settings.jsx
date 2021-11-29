import React, { useState, useReducer } from 'react';
import moment from 'moment-timezone';

import { WebpackModules, DiscordModules } from "@zlibrary"
import { useStateFromStores } from "@discord/flux";
import createUpdateWrapper from "common/hooks/createUpdateWrapper";
import Category from "common/components/category";

import styles from "./style.scss"
import settings from './settingsManager';
import Timer from './components/Timer';

import UserList from './components/UserAdd';


const SwitchItem = createUpdateWrapper(WebpackModules.getByDisplayName("SwitchItem"))

export default React.memo(() => {
    const isBothTimestampsSettingsEnabled = useStateFromStores([settings], () => settings.get("timestamps", false) && settings.get("timestampsMessages", false))

    return <>
        <div className={styles["preview-wrapper"]}>
            <Timer />
        </div>

        <Category look={Category.Looks.COMPACT} label="User list">
            <UserList />
        </Category>

        <Category look={Category.Looks.COMPACT} label="General Settings">
            <SwitchItem
                value={settings.get("seconds", false)}
                onChange={value => settings.set("seconds", value)}
            >Show seconds on the timer</SwitchItem>
        </Category>

        <Category look={Category.Looks.COMPACT} label="Timer in messages">
            <SwitchItem
                value={settings.get("timestamps", false)}
                onChange={value => settings.set("timestamps", value)}
            >Display the user's current time in messages</SwitchItem>
            <SwitchItem
                value={settings.get("timestampsMessages", false)}
                onChange={value => settings.set("timestampsMessages", value)}
            >Display the message's time according to the user's time</SwitchItem>
            <SwitchItem
                value={settings.get("timestampsIcons", false)}
                onChange={value => settings.set("timestampsIcons", value)}
                disabled={isBothTimestampsSettingsEnabled}
                note="This will be enabled by default if both settings above are enabled"
            >Show icons</SwitchItem>
        </Category>
    </>
})