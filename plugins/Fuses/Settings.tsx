/// <reference path="../../types/main.d.ts" />

import React, { useState, useReducer } from 'react';

import { WebpackModules } from "@zlibrary"
import { useStateFromStores } from "@discord/flux";
import { Button, Flex, RadioGroupType, Text } from "@discord/components"
import createUpdateWrapper from "common/hooks/createUpdateWrapper";
import Category from "common/components/category";
import { FormSection, FormTitle } from '@discord/forms';

import styles from "./style.scss"
import settings from './settingsManager';
import Timer from './components/Timer';
import { getList, isListNotValid, setList, UserListType } from './utils/userList';
import createQuestion from './utils/createQuestion';
import UserList from './components/UserList';
import { ImportFileException } from './utils/exceptions';
import constants from './utils/constants';
import ErrorText from './components/ErrorText';
import DataIcon from './components/custom icons/DataIcon';
import List from './components/UserList/List';
import { ModalSize } from '@discord/modal';


const SwitchItem = createUpdateWrapper(WebpackModules.getByDisplayName("SwitchItem"))

const RadioGroup: RadioGroupType = WebpackModules.getByDisplayName("RadioGroup")

export default React.memo(() => {
    const shouldEnableIconsOption = useStateFromStores([settings], () => {
        const timestamp = settings.get("timestamps", false)
        const timestampsMessages = settings.get("timestampsMessages", false)
        return !((timestamp && !timestampsMessages) || (!timestamp && timestampsMessages)) //xor
    })
    const timerDisplay = useStateFromStores([settings], () => settings.get("display", constants.Settings.TimerDisplay.USER_BANNER))
    const [, forceUpdate] = useReducer(n => n + 1, 0);
    const [fileError, setFileError] = useState<(string | ReactElement)[] | boolean>()
    settings.set("_callTimeCalculator", false)

    const handleOverrideList = () => {
        DiscordNative.fileManager.openFiles("*.json").then(output => {
            if (!output?.[0]?.data) return

            const [{ data }]: [{ data: ArrayBuffer }] = output

            const buffer: Uint8Array = new Uint8Array(data)
            const str: string = new TextDecoder().decode(buffer)

            try {
                let json: UserListType

                try {
                    json = JSON.parse(str)
                } catch (err) {
                    throw new ImportFileException("Tried to read a non-JSON file", constants.ExceptionCodes.ImportFile.INVALID_FILE)
                }

                const checkIfNotValid = isListNotValid(json)

                console.log(checkIfNotValid)

                if (checkIfNotValid) throw new ImportFileException("You imported an invalid User List format. Are you sure that this is the correct .JSON file?", checkIfNotValid[0])

                createQuestion(
                    "Override current list",
                    <>
                        <Text>Are you sure that you wanna do that? This will override the current user list. But you can backup it. Here it is a look at what you're trying to import:</Text>
                        <List list={json} enableSettings={false} disableControls={true} style={{ marginTop: "16px" }} />
                    </>,
                    [
                        { text: "Save and Override", color: Button.Colors.BRAND },
                        { text: "Ignore and Override", color: Button.Colors.RED, look: Button.Looks.LINK },
                        { text: "Cancel", color: Button.Colors.TRANSPARENT, look: Button.Looks.LINK }
                    ],
                    {
                        size: ModalSize.MEDIUM,
                        autoClose: false
                        //@ts-ignore
                    }).then(({ button, close }) => {
                        if (button === "Save and Override") DiscordNative.fileManager.saveWithDialog(JSON.stringify(getList()), "users.json").then(() => setList(json))

                        if (button === "Just Override") setList(json)

                        close()
                        setFileError(false)
                        forceUpdate()
                    }
                    )
            } catch (err) {
                if (err.code === constants.ExceptionCodes.ImportFile.INVALID_FILE) setFileError(["This isn't a valid user list file. It should be a file that ends with .JSON", err.code])
                else {
                    setFileError(["Unkown error. Click here to open DevTools", err.code])
                    console.error(err)
                }
            }
        })
    }

    return <>
        <div className={styles["preview-wrapper"]}>
            <Timer />
        </div>

        <Category look={Category.Looks.COMPACT} label="User list">
            <UserList />
        </Category>

        <Category look={Category.Looks.COMPACT} label="General Settings">
            <FormSection title="Display timer on...">
                <RadioGroup
                    options={[
                        {
                            name: "Banner",
                            value: constants.Settings.TimerDisplay.USER_BANNER
                        },
                        {
                            name: "Header",
                            value: constants.Settings.TimerDisplay.USER_HEADER
                        }
                    ]}
                    value={timerDisplay}
                    onChange={({ value }) => settings.set("display", value)}
                />
            </FormSection>
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
                    <Button onClick={handleOverrideList} style={{ marginBottom: "12px" }}>Load user list</Button>
                    <Button onClick={() => {
                        DiscordNative.fileManager.saveWithDialog(JSON.stringify(getList()), "users.json")
                        setFileError(false)
                    }}>Save user list</Button>

                    {fileError && <ErrorText onClick={() => window.require("electron").ipcRenderer.send("bd-open-devtools")}>{fileError[0]}. Code error: {fileError[1]}</ErrorText>}
                </div>
                <DataIcon height={138} className={styles["file-info-icon"]}/>
            </Flex>
        </Category>
    </>
})