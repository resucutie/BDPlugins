/// <reference path="../../types/main.d.ts" />

import React, { useState, useReducer } from 'react';
import moment from 'moment-timezone';

import { WebpackModules, DiscordModules } from "@zlibrary"
import { useStateFromStores } from "@discord/flux";
import { Button, Flex } from "@discord/components"
import createUpdateWrapper from "common/hooks/createUpdateWrapper";
import Category from "common/components/category";

import styles from "./style.scss"
import settings from './settingsManager';
import Timer from './components/Timer';
import { getList } from './utils/userList';
import createQuestion from './utils/createQuestion';

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

        <Category look={Category.Looks.COMPACT} label="Import/Export user list">
            <Flex >
                <Button onClick={() => {
                    DiscordNative.fileManager.openFiles("*.json").then(([{ data }]: [{ data: ArrayBuffer }]) => {
                        const buffer: Uint8Array = new Uint8Array(data)
                        const str: string = new TextDecoder().decode(buffer)
                        let json: JSON
                        try {
                            json = JSON.parse(str)
                            createQuestion("Override current list", "Are you sure that you wanna do that? This will override the current user list.", [{ text: "Ok", color: Button.Colors.RED }, { text: "Cancel", color: Button.Colors.TRANSPARENT, look: Button.Looks.LINK }]).then(buttonClicked => {
                                if (buttonClicked === "Ok") settings.set("userList", json)
                            })
                        } catch (err) {
                            console.error("duh this isn't a json file")
                        }
                    })
                }} style={{marginRight: "8px"}}>Load user list</Button>
                <Button onClick={() => {
                    DiscordNative.fileManager.saveWithDialog(JSON.stringify(getList()), "users.json")
                }}>Save user list</Button>
            </Flex>
        </Category>
    </>
})