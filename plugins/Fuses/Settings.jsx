import React, { useState, useReducer } from 'react';
import moment from 'moment-timezone';

import { WebpackModules, DiscordModules } from "@zlibrary"
// import { Trash, ArrowLeft, EmojiTravelCategory, Search, Pencil } from "@discord/icons"
import { Text } from "@discord/components";
// import { Users } from "@discord/stores";
// import { closeAllModals } from "@discord/modal"
import createUpdateWrapper from "common/hooks/createUpdateWrapper";
import Category from "common/components/category";

import styles from "./style.scss"
import settings from './settingsManager';
// import { getList, addUser, removeUser, getTimezone } from './utils/userList';
// import { getDateFromCity, getOffset } from './utils/timezones';
// import { TimezoneException } from "./utils/exceptions";
// import constants from "./utils/constants";
import Timer from './components/Timer';
// import BasicTimer from './components/BasicTimer';

import UserList from './components/UserAdd';


const SwitchItem = createUpdateWrapper(WebpackModules.getByDisplayName("SwitchItem"))

export default React.memo(() => {
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
        </Category>
    </>
})