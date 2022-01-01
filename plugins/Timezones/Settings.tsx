/// <reference path="../../types/main.d.ts" />

import React, { useState, useReducer } from 'react';
import reactStringReplace from './utils/reactStringReplace';

import { DiscordModules, WebpackModules } from "@zlibrary"
import { useStateFromStores } from "@discord/flux";
import { Button, Flex, RadioGroupType, Text, TextInput, TooltipContainer } from "@discord/components"
import { Launch, Replay, HelpOutline, Timer as TimerIcon } from "@discord/icons"
import createUpdateWrapper from "common/hooks/createUpdateWrapper";
import Category from "common/components/category";
import { FormItem, FormSection, FormText, FormTitle } from '@discord/forms';
import { joinClassNames } from '@discord/utils';
import { Messages, SelectedChannels } from '@discord/stores';
import { ModalSize } from '@discord/modal';
import { Dispatcher } from '@discord/modules';
import { Users } from '@discord/stores';

import styles from "./style.scss"
import settings from './settingsManager';
import Timer from './components/Timer';
import { getList, getTimezone, isListNotValid, setList, UserListType } from './utils/userList';
import createQuestion from './utils/createQuestion';
import UserList from './components/UserList';
import { ImportFileException } from './utils/exceptions';
import constants from './utils/constants';
import ErrorText from './components/ErrorText';
import DataIcon from './components/custom icons/DataIcon';
import List from './components/UserList/List';
import { TTCache } from './utils/cache';
import useAbortOnRestart from './hooks/useAbortOnRestart';
import { getOffset } from './utils/timezones';
import BasicTimer from './components/BasicTimer';
import TimezoneValueGetter from './components/TimezoneValueGetter';


const SwitchItem = createUpdateWrapper(WebpackModules.getByDisplayName("SwitchItem"))
const { default: Avatar } = WebpackModules.getByProps("AnimatedAvatar")
const { AvatarDefaults } = DiscordModules
const TextArea = WebpackModules.getByDisplayName("TextArea")
const RadioGroup: RadioGroupType = WebpackModules.getByDisplayName("RadioGroup")

export default React.memo(() => {
    settings.set("_callTimeCalculator", false)

    const [, forceUpdate] = useReducer(n => n + 1, 0);

    // general settings
    const textFormat: string = useStateFromStores([settings], () => settings.get("format", constants.Settings.General.Format.CURRENT_FORMAT))

    // userpopout
    const userpopout = useStateFromStores([settings], () => settings.get("userpopout", true))
    const userpopoutDisplay = useStateFromStores([settings], () => settings.get("userpopout-display", constants.Settings.TimerDisplay.USER_BANNER))
    
    //messages
    const shouldEnableIconsOption = useStateFromStores([settings], () => {
        const timestamp = settings.get("timestamps", false)
        const timestampsMessages = settings.get("timestampsMessages", true)
        return !((timestamp && !timestampsMessages) || (!timestamp && timestampsMessages)) //xor
    })

    // user list
    const userlistAlign = useStateFromStores([settings], () => settings.get("userlist-align", constants.Settings.TimerAlign.RIGHT))

    //TT
    const isTTEnabled = useStateFromStores([settings], () => settings.get("tt", true))
    const [TTUrl, setTTUrl] = useState<string>(settings.get("tt-url", constants.TimeTogether.DEFAULT_URL))
    
    //errors
    const [fileError, setFileError] = useState<(string | ReactElement)[] | boolean>()
    const [TTUrlError, setTTUrlError] = useState<string | ReactElement | boolean>()
    
    const TTUrlSignal = useAbortOnRestart()()

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

    /**
     * @see {@link https://github.com/Puv1s/ColorTooltips/blob/d3386bff75ec03e13067cc819bac639c31e4bc35/ColorTooltips.plugin.js#L443}
     */
    const forceUpdateMessages = () => {
        let channelId = SelectedChannels.getChannelId();
        if (!channelId) return;
        const messages = Messages.getMessages(channelId);
        if (!messages._array?.length) return;
        for (const message of messages._array) {
            Dispatcher.dispatch({
                type: "MESSAGE_UPDATE",
                message: message
            });
        }
    }

    return <>
        <div className={styles["preview-wrapper"]}>
            <Timer />
        </div>

        <CategorySpace look={Category.Looks.COMPACT} label="General Settings">
            {/* <SwitchItem
                value={settings.get("seconds", false)}
                onChange={value => settings.set("seconds", value)}
            >Show seconds on the timer</SwitchItem>
            <SwitchItem
                value={settings.get("ampm", constants.TimePreferrence["12HFOMRAT"]())}
                onChange={value => settings.set("ampm", value)}
            >Use the 12 o' clock format (AM/PM)</SwitchItem> */}
            <FormSection title="Format">
                <Flex>
                    <div style={{ flexGrow: 1 }} className={styles["highlight-wrapper"]}>
                        {textFormat.length <= 59 && !~textFormat.indexOf("\n") && <div className={styles["highlight"]}>{reactStringReplace(textFormat, /{(.*?)}/g, (match) => {
                            const timeMatches = [
                                "24hours", "12hours",
                                "minutes",
                                "seconds"
                            ]
                            const dateMatches = [
                                "date",
                                "weekday", "weekdayNameFull", "weekdayFullName",
                                "weekMonth", "weekYear",
                                "month", "monthName", "monthFullName",
                                "year"
                            ]
                            const otherMatches = [
                                "suffix",
                                "timezone"
                            ]
                            const owo = ["418"]
                            if (~timeMatches.indexOf(match)) return <span className={styles["highlight-time"]}>{`{${match}}`}</span>
                            if (~dateMatches.indexOf(match)) return <span className={styles["highlight-date"]}>{`{${match}}`}</span>
                            if (~otherMatches.indexOf(match)) return <span className={styles["highlight-other"]}>{`{${match}}`}</span>
                            if (~owo.indexOf(match)) return <span style={{color: "red"}}>{`{OwO}`}</span>
                            return `{${match}}`
                        })}</div>}
                        <TextInput
                            value={textFormat}
                            onChange={value => settings.set("format", value)}
                            placeholder={constants.Settings.General.Format.CURRENT_FORMAT}
                            className={textFormat.length <= 59 ? styles["highlight-textinput"]: ""}
                        />
                    </div>
                    <TooltipContainer text="Reset to the default value" className={styles["stupid-tooltip"]} delay={700}>
                        <Button
                            disabled={(TTUrl === constants.TimeTogether.DEFAULT_URL) || !isTTEnabled}
                            size={Button.Sizes.ICON}
                            color={Button.Colors.GREEN}
                            onClick={() => {
                                settings.set("tt-url", constants.TimeTogether.DEFAULT_URL)
                                setTTUrl(constants.TimeTogether.DEFAULT_URL)
                            }}
                            style={{ marginLeft: "4px", width: "40px", height: "40px" }}
                        >
                            <Replay width={28} height={28} />
                        </Button>
                    </TooltipContainer>
                </Flex>
                <FormText type="description">
                    <Category look={Category.Looks.COMPACT} className={styles["note-category"]} label="Values">
                        {Object.entries({
                            "Time": [
                                <><span className={styles["highlight-time"]}>{"{24hours}"}</span>: Shows the hours in 24-hour format</>,
                                <><span className={styles["highlight-time"]}>{"{12hours}"}</span>: Shows the hours in 12-hour format</>,
                                <><span className={styles["highlight-time"]}>{"{minutes}"}</span>: Shows the minutes</>,
                                <><span className={styles["highlight-time"]}>{"{seconds}"}</span>: Shows the seconds</>
                            ],
                            "Date": [
                                <><span className={styles["highlight-date"]}>{"{date}"}</span>: Shows the date</>,
                                <><span className={styles["highlight-date"]}>{"{weekday}"}</span>: Shows the date relative to the week</>,
                                <><span className={styles["highlight-date"]}>{"{weekdayName}"}</span>: Shows the name of the weekday</>,
                                <><span className={styles["highlight-date"]}>{"{weekdayFullName}"}</span>: Shows the weekday's full name</>,
                                <><span className={styles["highlight-date"]}>{"{weekMonth}"}</span>: Shows the number of the week relative to the month</>,
                                <><span className={styles["highlight-date"]}>{"{weekYear}"}</span>: Shows the number of the week relative to the year</>,
                                <><span className={styles["highlight-date"]}>{"{month}"}</span>: Shows the number of the month</>,
                                <><span className={styles["highlight-date"]}>{"{monthName}"}</span>: Shows the name of the month</>,
                                <><span className={styles["highlight-date"]}>{"{monthFullName}"}</span>: Shows the full name of the month</>,
                                <><span className={styles["highlight-date"]}>{"{year}"}</span>: Shows the year</>,
                            ],
                            "Other": [
                                <><span className={styles["highlight-other"]}>{"{suffix}"}</span>: Shows the suffix</>,
                                <><span className={styles["highlight-other"]}>{"{timezone}"}</span>: Shows the user's timezone</>
                            ]
                        }).map(([name, items]) => <>
                            {name} 
                            <div style={{ marginLeft: "4px", userSelect: "text"}}>
                                {items.map(item => <><span className={styles["dot"]}>•</span>{item}<br /></>)}
                            </div>
                        </>)}
                        {/* <span className={styles["dot"]}>•</span><span className={styles["highlight-time"]}>{"{24hours}"}</span>: Shows the hours in 24-hour format <br />
                        <span className={styles["dot"]}>•</span><span className={styles["highlight-time"]}>{"{12hours}"}</span>: Shows the hours in 12-hour format <br />
                        <span className={styles["dot"]}>•</span>{"{minutes}"}: Shows the minutes <br />
                        <span className={styles["dot"]}>•</span>{"{seconds}"}: Shows the seconds <br />
                        <span className={styles["dot"]}>•</span>{"{suffix}"}: Shows the suffix <br />
                        <span className={styles["dot"]}>•</span>{"{timezone}"}: Shows the user's timezone */}
                    </Category>
                </FormText>
            </FormSection>
            <Divider />
            
            <CategorySpace look={Category.Looks.COMPACT} label="User Popout">
                <SwitchItem
                    value={userpopout}
                    onChange={value => settings.set("userpopout", value)}
                >Enable</SwitchItem>
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
                        disabled={!textFormat}
                        value={userpopoutDisplay}
                        onChange={({ value }) => settings.set("userpopout-display", value)}
                    />
                </FormSection>
            </CategorySpace>
            
            <CategorySpace look={Category.Looks.COMPACT} label="Messages">
                <SwitchItem
                    value={settings.get("timestamps", false)}
                    onChange={value => {
                        settings.set("timestamps", value)
                        forceUpdateMessages()
                    }}
                >Display the user's current time in messages</SwitchItem>
                <SwitchItem
                    value={settings.get("timestampsMessages", true)}
                    onChange={value => {
                        settings.set("timestampsMessages", value)
                        forceUpdateMessages()
                    }}
                >Display the message's time according to the user's time</SwitchItem>
                <SwitchItem
                    value={settings.get("timestampsIcons", false)}
                    onChange={value => {
                        settings.set("timestampsIcons", value)
                        forceUpdateMessages()
                    }}
                    disabled={shouldEnableIconsOption}
                    note="This will be enabled by default if both settings above are enabled and disabled if both of them are as well"
                >Show icons in timestamps</SwitchItem>
                <SwitchItem
                    value={settings.get("header", true)}
                    onChange={value => settings.set("header", value)}
                >Display the user's current time in the header while in DMs</SwitchItem>
            </CategorySpace>
            
            <CategorySpace look={Category.Looks.COMPACT} label="User Lists">
                <SwitchItem
                    value={settings.get("userlist-dm", true)}
                    onChange={value => settings.set("userlist-dm", value)}
                >Display in the direct message's list</SwitchItem>
                <SwitchItem
                    value={settings.get("userlist-server", true)}
                    onChange={value => settings.set("userlist-server", value)}
                >Display in the server's user list</SwitchItem>
                <FormSection title="Timer Align">
                    <Flex justify={Flex.Justify.CENTER} style={{marginBottom: "16px"}}>
                        <ExampleUserList user={Users.getCurrentUser()} userTimezone={getOffset()} direction={userlistAlign} />
                    </Flex>
                    <RadioGroup
                        options={[
                            {
                                name: "Left",
                                value: constants.Settings.TimerAlign.LEFT
                            },
                            {
                                name: "Header",
                                value: constants.Settings.TimerAlign.RIGHT
                            }
                        ]}
                        value={userlistAlign}
                        onChange={({ value }) => settings.set("userlist-align", value)}
                    />
                </FormSection>
            </CategorySpace>
        </CategorySpace>

        <CategorySpace look={Category.Looks.COMPACT} label="Local User List">
            <UserList />
        </CategorySpace>

        <CategorySpace look={Category.Looks.COMPACT} label={
            <Flex align={Flex.Align.CENTER}>
                <span style={{marginRight: "4px"}}>
                    TimeTogether
                </span> 
                <TooltipContainer text="TimeTogether is an online database where you can get timezones from other users without having to add manually them.">
                    <HelpOutline />
                </TooltipContainer>
            </Flex>
        }>
            <SwitchItem
                value={isTTEnabled}
                onChange={value => settings.set("tt", value)}
            >Enable</SwitchItem>
            <ButtonForm
                label="Settings"
                note="The configuration of your account is made externally. Pretty cool, right?"
                buttonText="Open settings"
                buttonIcon={<Launch width={22} height={22} style={{marginRight: "4px"}}/>}
                onClick={() => window.open(settings.get("tt-url", constants.TimeTogether.DEFAULT_URL))}
                disabled={!isTTEnabled}
            />
            <div style={{marginBottom: "20px"}} />
            <CategorySpace look={Category.Looks.COMPACT} label="Advanced">
                <FormSection title="URL to access the database">
                    <Flex>
                        <div style={{ flexGrow: 1 }}>
                            <TextInput
                                value={TTUrl}
                                error={TTUrlError}
                                onChange={async value => {
                                    setTTUrl(value)

                                    let url = value.replace("//localhost", "//127.0.0.1")
                                    try {
                                        new URL(value)
                                    } catch (err) {
                                        url = "https://" + url
                                    }

                                    fetch(url, {
                                        method: "GET",
                                        signal: TTUrlSignal
                                    }).then((res) => {
                                        console.log("valid", res, url)
                                        settings.set("tt-url", url)
                                        setTTUrlError(null)
                                    }).catch(err => {
                                        console.error(url, err)
                                        setTTUrlError("Invalid URL")
                                    })
                                }}
                                disabled={!isTTEnabled}
                            />
                        </div>
                        <TooltipContainer text="Reset to the default value" className={styles["stupid-tooltip"]} delay={700}>
                            <Button
                                disabled={(TTUrl === constants.TimeTogether.DEFAULT_URL) || !isTTEnabled}
                                size={Button.Sizes.ICON}
                                color={Button.Colors.GREEN}
                                onClick={() => {
                                    settings.set("tt-url", constants.TimeTogether.DEFAULT_URL)
                                    setTTUrl(constants.TimeTogether.DEFAULT_URL)
                                }}
                                style={{ marginLeft: "4px", width: "40px", height: "40px" }}
                            >
                                <Replay width={28} height={28} />
                            </Button>
                        </TooltipContainer>
                    </Flex>
                </FormSection>
                <Divider />
                <ButtonForm
                    label="Clear cache"
                    buttonText="Clear"
                    onClick={() => TTCache.clear()}
                    disabled={!isTTEnabled}
                />
            </CategorySpace>
        </CategorySpace>

        <CategorySpace look={Category.Looks.COMPACT} label="Import/Export local user list">
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
        </CategorySpace>
    </>
})
interface ExampleUserListProps {
    user: UserObject
    userTimezone: Timezone
    direction: "LEFT" | "RIGHT"
}
const ExampleUserList = ({user, userTimezone, direction}: ExampleUserListProps) => {
    return <div className='channel-2QD9_O container-2Pjhx- clickable-1JJAn8'>
        <div className='layout-2DM8Md'>
            <div className='avatar-3uk_u9'>
                <Avatar src={AvatarDefaults.getUserAvatarURL(user)} size={Avatar.Sizes.SIZE_32}/>
            </div>
            <div className='content-3QAtGj'>
                <div className='nameAndDecorators-5FJ2dg'>
                    <div className="name-uJV0GL">{user.username}</div>
                </div>
                <div className='subText-1KtqkB'>
                    <div className='activity-525YDR subtext-1RtU34'>
                        {direction === constants.Settings.TimerAlign.LEFT && <>
                            <TimerIcon width={12} height={12} />
                            <span style={{ marginRight: "2px" }}>
                                <BasicTimer timezone={userTimezone} tooltip={false} />
                            </span>
                            <span className={styles["dot"]}>•</span>
                        </>}
                        <img src="/assets/df7ba0f4020ca70048a0226d1dfa73f6.svg" alt="👋" draggable={false} className='emoji emoji-2cWBLE activityEmoji-1AR8K6' />
                        <div className='activityText-OW8WYb'>Hello!</div>
                        {direction === constants.Settings.TimerAlign.RIGHT && <>
                            <span className={styles["dot"]}>•</span>
                            <TimerIcon width={12} height={12} />
                            <span style={{ marginLeft: "2px" }}>
                                <BasicTimer timezone={userTimezone} tooltip={false} />
                            </span>
                        </>}
                    </div>
                </div>
            </div>
        </div>
    </div>
}

interface ButtonWrapperProps {
    label: string | ReactElement
    note?: string | ReactElement
    color?: string
    disabled?: boolean
    onClick?: () => void
    buttonClassName?: string | ReactElement
    buttonText: string | ReactElement
    buttonIcon?: ReactElement
    className?: string
    [key: string]: any
}
const ButtonForm = ({ label, note, color = Button.Colors.BRAND, disabled = false, onClick, buttonClassName, buttonText, buttonIcon, className, ...etc }: ButtonWrapperProps) => {
    const { description } = WebpackModules.getByProps('formText', 'description');
    const { labelRow, title } = WebpackModules.getByProps('labelRow');
    return <FormItem className={styles["form"] + " " + className} {...etc}>
        <Flex align={Flex.Align.CENTER}>
            <div className={styles["form-name"]}>
                <div className={labelRow} onClick={onClick}>
                    <label className={title}>
                        {label}
                    </label>
                </div>
                <FormText className={description}>
                    {note}
                </FormText>
            </div>
            <Button
                color={color}
                disabled={disabled}
                onClick={onClick}
                className={buttonClassName}
            >
                <Flex align={Flex.Align.CENTER}>
                    {buttonText}
                    {buttonIcon && <>
                        <div style={{width: "8px"}}/>
                        {buttonIcon}
                    </>}
                </Flex>
            </Button>
        </Flex>
    </FormItem>
}

const Divider = ({ className, style, ...props }: { className?: string, style?: Object, [key: string]: any }) => {
    return <div className={joinClassNames("divider-3573oO dividerDefault-3rvLe-", className)} style={{ marginBottom: "20px", ...style}} {...props} />
}

const CategorySpace = ({ top = true, bottom = true, children, look, label, ...props}) => <Category look={look} label={label} {...props}>
    {top && <div style={{ marginTop: "20px" }} />}
    {children}
    {bottom && <div style={{ marginBottom: "20px" }} />}
</Category>