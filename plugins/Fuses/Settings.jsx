import React, { useState, useReducer } from 'react';
import moment from 'moment-timezone';

import { WebpackModules, DiscordModules } from "@zlibrary"
import { Trash, ArrowLeft, EmojiTravelCategory, Search, Pencil } from "@discord/icons"
import { Button, TextInput, Flex, Text, TooltipContainer } from "@discord/components";
import { Users } from "@discord/stores";
import createUpdateWrapper from "common/hooks/createUpdateWrapper";
import Category from "common/components/category";

import styles from "./style.scss"
import settings from './settingsManager';
import { getList, addUser, removeUser, getTimezone } from './utils/userList';
import { getDateFromCity, getOffset } from './utils/timezones';
import { TimezoneException } from "./utils/exceptions";
import constants from "./utils/constants";


const { AvatarDefaults } = DiscordModules
const SwitchItem = createUpdateWrapper(WebpackModules.getByDisplayName("SwitchItem"))
const { default: Avatar } = WebpackModules.getByProps("AnimatedAvatar")

export default React.memo(() => {
    const [, forceUpdate] = useReducer(n => n + 1, 0);
    const currentOffset = getOffset(new Date())

    // Hooks
    //pages
    const [timezonePage, setTimezonePage] = useState("manual")
    //textboxes
    const [userId, setUserId] = useState("") //UserID Textbox
    const [userTimezone, setUserTimezone] = useState("") //UserTimezone Textbox
    const [userCity, setUserCity] = useState("") //UserTimezone Textbox
    const [userCityError, setUserCityError] = useState(false) //UserTimezone Textbox
    const [isEditing, setEditing] = useState(false) //
    //etc
    const [focus, setFocus] = useState("userID") //textbox focus (yes, this exists)


    // Handlers
    const handleAdd = (id, timezone) => {
        addUser(id, timezone)
        setUserId("")
        setUserTimezone("")
        setEditing(false)
        forceUpdate()
    }
    
    const handleRemove = (id) => {
        removeUser(id)
        forceUpdate()
    }
    
    const handleCityChange = (city) => {
        try {
            const cityDate = getDateFromCity(city, true)
            setUserTimezone(getOffset(cityDate))
            setUserCityError(false)
            setTimezonePage("manual")
        } catch (err) {
            if (err instanceof TimezoneException && err.code === constants.ExceptionCodes.Timezones.INVALID_CITY) setUserCityError(<>Invalid City! Please check <a href="https://gist.github.com/diogocapela/12c6617fc87607d11fd62d2a4f42b02a" target='_blank'>this list</a> to see all valid places!</>)
            else {
                setUserCityError("Unkown error! Check console for more information")
                console.error(err)
            }
        }
    }


    // Components
    const UserList = () => {
        return <div className={styles["user-list"]}>
            <Text size={Text.Sizes.SIZE_12} color={Text.Colors.HEADER_SECONDARY} className={`${styles["header"]} ${styles["section-look"]}`}>User List</Text>
            {Object.entries(getList()).map(([id, timezone]) => {
                const user = Users.getUser(id)
                
                return <div className={styles["user-list-item"]}>
                    <Avatar src={AvatarDefaults.getUserAvatarURL(user)} size={Avatar.Sizes.SIZE_32} className={styles["avatar"]}/>
                    <div>
                        <div className={styles["name"]}>{user.username}</div>
                        <div className={styles["timezone"]}>UTC{timezone}</div>
                    </div>
                    <div className={styles["actions-wrapper"]}>
                        <TooltipContainer text={`Edit ${user.username}`}>
                            <Pencil className={styles["edit-icon"]}
                                onClick={() => {
                                    setUserId(id)
                                    setUserTimezone(timezone)
                                    setEditing(true)
                                    setFocus("userTimezone")
                                    setTimezonePage("manual")
                                }}/>
                        </TooltipContainer>
                        <TooltipContainer text={`Remove ${user.username}`}>
                            <Trash className={styles["delete-icon"]} onClick={() => handleRemove(id)} />
                        </TooltipContainer>
                    </div>
                </div>
            })}
        </div>
    }

    const TimezonePicker = () => {
        return <Flex className={styles["user-add-timezone-panel"]}>
            {timezonePage === "manual" && <>
                <TextInput className={styles["timezone-search-textbox"]}
                    value={userTimezone}
                    placeholder={`Timezone (in UTC. e.g.: ${currentOffset})`}
                    onChange={text => setUserTimezone(text.replace(/[^\d.+-]/g, ''))}
                    onClick={() => setFocus("userTimezone")}
                    autoFocus={focus === "userTimezone"}
                ></TextInput>
                <TooltipContainer text={`Search by city`} className={styles["search-city-wrapper"]}>
                    <Button className={styles["search-city-btn"]}
                        look={Button.Looks.OUTLINED}
                        color={Button.Colors.WHITE}
                        size={Button.Sizes.ICON}
                        onClick={() => setTimezonePage("city")}>
                        <EmojiTravelCategory width={24} height={24} />
                    </Button>
                </TooltipContainer>
            </>}

            {timezonePage === "city" && <>
                <TextInput className={styles["city-search-textbox"]}
                    value={userCity}
                    placeholder={`Continent/City. e.g.: ${moment.tz.guess()}`}
                    onChange={text => setUserCity(text)}
                    onClick={() => setFocus("userCity")}
                    error={userCityError}
                    autoFocus={focus === "userCity"}
                ></TextInput>
                <div className={styles["city-actions-wrapper"]}>
                    <Button className={styles["find-city-btn"]}
                        color={Button.Colors.GREEN}
                        size={Button.Sizes.ICON}
                        onClick={() => handleCityChange(userCity)}>
                        <Search />
                    </Button>
                    <Button className={styles["return-btn"]}
                        look={Button.Looks.OUTLINED}
                        color={Button.Colors.WHITE}
                        size={Button.Sizes.ICON}
                        onClick={() => setTimezonePage("manual")}>
                        <ArrowLeft />
                    </Button>
                </div>
            </>}
        </Flex>
    }


    // Render
    return <>
        <Category look={Category.Looks.COMPACT} label="Users">
            <UserList />
            <Text size={Text.Sizes.SIZE_14} className={`${styles["section-look"]} h5-18_1nd`}>Add a new user</Text>
            <div>
                <TextInput
                    value={userId}
                    placeholder="User ID"
                    onChange={text => {
                        setUserId(text.replace(/^(?![0-9]).*/g, ''))
                        if (getTimezone(text)) setEditing(true)
                        else setEditing(false)
                    }}
                    onClick={() => setFocus("userId")}
                    autoFocus={focus === "userId"}
                ></TextInput>
                <TimezonePicker />
            </div>
            <Button onClick={() => handleAdd(userId, userTimezone)}>{isEditing ? "Edit" : "Add"} user</Button>
        </Category>

        <Category look={Category.Looks.COMPACT} label="Time counter">
            <SwitchItem
                value={settings.get("seconds", false)}
                onChange={value => settings.set("seconds", value)}
            >Show seconds</SwitchItem>
        </Category>
    </>
})