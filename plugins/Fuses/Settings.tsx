/// <reference path="../../types/main.d.ts" />

import React, { useState, useReducer } from 'react';

import { WebpackModules } from "@zlibrary"
import { useStateFromStores } from "@discord/flux";
import { Button, Flex } from "@discord/components"
import createUpdateWrapper from "common/hooks/createUpdateWrapper";
import Category from "common/components/category";

import styles from "./style.scss"
import settings from './settingsManager';
import Timer from './components/Timer';
import { getList, setList } from './utils/userList';
import createQuestion from './utils/createQuestion';

import UserList from './components/UserList';
import { ImportFileException } from './utils/exceptions';
import constants from './utils/constants';
import ErrorText from './components/ErrorText';
import DataIcon from './components/custom icons/DataIcon';


const SwitchItem = createUpdateWrapper(WebpackModules.getByDisplayName("SwitchItem"))

export default React.memo(() => {
    const shouldEnableIconsOption = useStateFromStores([settings], () => {
        const timestamp = settings.get("timestamps", false)
        const timestampsMessages = settings.get("timestampsMessages", false)
        return !((timestamp && !timestampsMessages) || (!timestamp && timestampsMessages)) //xor
    })
    const [, forceUpdate] = useReducer(n => n + 1, 0);
    const [fileError, setFileError] = useState<string|boolean>()
    settings.set("_callTimeCalculator", false)

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
            <SwitchItem
                value={settings.get("ampm", constants.TimePreferrence["12HFOMRAT"]())}
                onChange={value => settings.set("ampm", value)}
            >Use the 12 o' clock format (AM/PM)</SwitchItem>
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
                disabled={shouldEnableIconsOption}
                note="This will be enabled by default if both settings above are enabled"
            >Show icons</SwitchItem>
        </Category>

        <Category look={Category.Looks.COMPACT} label="Import/Export user list">
            <Flex className={styles["import-flex"]}>
                <div className={styles["import-wrapper"]}>
                    <Button onClick={() => {
                        DiscordNative.fileManager.openFiles("*.json").then(output => {
                            if (!output?.[0]?.data) return

                            const [{ data }]: [{ data: ArrayBuffer }] = output

                            const buffer: Uint8Array = new Uint8Array(data)
                            const str: string = new TextDecoder().decode(buffer)
                            try {
                                let json: JSON
                                try {
                                    json = JSON.parse(str)
                                } catch (err) {
                                    throw new ImportFileException("Tried to read a non-JSON file", constants.ExceptionCodes.ImportFile.INVALID_FILE)
                                }
                                createQuestion("Override current list", "Are you sure that you wanna do that? This will override the current user list.", [{ text: "Ok", color: Button.Colors.RED }, { text: "Cancel", color: Button.Colors.TRANSPARENT, look: Button.Looks.LINK }]).then(buttonClicked => {
                                    if (buttonClicked === "Ok") setList(json)
                                    setFileError(false)
                                    forceUpdate()
                                })
                            } catch (err) {
                                if (err.code === constants.ExceptionCodes.ImportFile.INVALID_FILE) setFileError("This isn't a valid user file. Please insert a valid one")
                                else {
                                    setFileError("Unkown error. Please open the Devtools")
                                    console.error(err)
                                }
                            }
                        })
                    }} style={{ marginBottom: "12px" }}>Load user list</Button>
                    <Button onClick={() => {
                        DiscordNative.fileManager.saveWithDialog(JSON.stringify(getList()), "users.json")
                        setFileError(false)
                    }}>Save user list</Button>

                    {fileError && <ErrorText>{fileError}</ErrorText>}
                </div>
                <DataIcon height={138} className={styles["file-info-icon"]}/>
            </Flex>
        </Category>
    </>
})