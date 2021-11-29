/// <reference path="../../../types/main.d.ts" />
import React, { useState, useReducer, ReactFragment } from 'react';

import moment from 'moment-timezone';

import { WebpackModules, DiscordModules } from "@zlibrary"
import { Trash, ArrowLeft, EmojiTravelCategory, Search, Pencil } from "@discord/icons"
import { Button, TextInput, Flex, Text, TooltipContainer } from "@discord/components";
import { Users } from "@discord/stores";
import { openModal, closeAllModals } from "@discord/modal"

import styles from "../style.scss"
import { getList, addUser, removeUser, getTimezone } from '../utils/userList';
import { getDateFromCity, getOffset } from '../utils/timezones';
import { TimezoneException } from "../utils/exceptions";
import constants from "../utils/constants";
import BasicTimer from './BasicTimer';
import UserSearch from './UserSearch';
import { UserAddProps } from '../../../types/plugins/Fuses';

const { AvatarDefaults } = DiscordModules
const { default: Avatar } = WebpackModules.getByProps("AnimatedAvatar")
const { default: SearchBar } = WebpackModules.find(m => m.default?.displayName === 'SearchBar')

export default function ({ presets = {}, closeOnAdd = false }: UserAddProps){
    const [, forceUpdate] = useReducer(n => n + 1, 0);
    const currentOffset = getOffset(new Date())

    // Hooks
    //pages
    const [timezonePage, setTimezonePage] = useState(constants.Settings.TimezonePages.MANUAL)

    //textboxes
    const [userId, setUserId] = useState<string>(presets.userID) //UserID Textbox
    const [userIdError, setUserIdError] = useState<string | boolean>(false) //UserTimezone Textbox

    const [timezone, setTimezone] = useState<string>(presets.timezone) //UserTimezone Textbox
    const [timezoneError, setTimezoneError] = useState<string | boolean>(false) //UserTimezone Textbox

    const [userCity, setUserCity] = useState<string>("") //UserTimezone Textbox
    const [userCityError, setUserCityError] = useState<string | boolean | ReactElement>(false) //UserTimezone Textbox

    const [search, setSearch] = useState("") //UserTimezone Textbox

    //etc
    const [focus, setFocus] = useState(constants.Settings.TextFocus.USER_ID) //textbox focus (yes, i need a text focus handler)
    const [isEditing, setEditing] = useState(false)

    // Handlers
    const handleAdd = (id, timezone) => {
        if (_.isEmpty(id)) {
            setUserIdError("Please put a value here")
            return
        }
        if (!Users.getUser(id)) {
            setUserIdError("Invalid ID")
            return
        }
        if (_.isEmpty(timezone)) {
            setTimezoneError("Please put a value here")
            return
        }

        //adds the user if everything was sucessful
        addUser(id, timezone)
        
        //clear texts
        setUserId("")
        setTimezone("")
        
        //remove the editing text
        setEditing(false)

        //resets error values
        setUserIdError(false)
        setTimezoneError(false)

        if (closeOnAdd) {
            closeAllModals()
            return
        }
        
        //forces update
        forceUpdate()
    }
    
    const handleRemove = (id) => {
        removeUser(id)
        forceUpdate()
    }
    
    const handleCityChange = (city) => {
        try {
            const cityDate = getDateFromCity(city, true)
            setTimezone(getOffset(cityDate))
            setUserCityError(false)
            setTimezonePage(constants.Settings.TimezonePages.MANUAL)
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
        let filteredList: Array<Array<any>> = Object.entries(getList()).filter(([userid]) => Users.getUser(userid).username.toLowerCase().indexOf(search) > -1)
        return <div className={styles["user-list-wrapper"]}>
            <SearchBar className={styles["header-search"]}
                placeholder="Search user"
                query={search}
                onQueryChange={val => {
                    setSearch(val)
                    //setFocus(constants.Settings.TextFocus.SEARCH_USER_LIST)
                }}
                onClear={() => setSearch("")}
                key={constants.Settings.TextFocus.SEARCH_USER_LIST}
                //autoFocus={focus === constants.Settings.TextFocus.SEARCH_USER_LIST}
            />

            <div className={styles["user-list"]}>
                {filteredList.map(([id, timezone]) => {
                    const user = Users.getUser(id)

                    return <div className={styles["user-list-item"]}>
                        <Avatar src={AvatarDefaults.getUserAvatarURL(user)} size={Avatar.Sizes.SIZE_32} className={styles["avatar"]} />
                        <div>
                            <div className={styles["name"]}>{user.username}</div>
                            <div className={styles["timezone"]}>UTC{timezone} <span className={styles["timestamp-dot"]}>•</span> <BasicTimer timezone={timezone} /></div>
                        </div>
                        <div className={styles["actions-wrapper"]}>
                            <TooltipContainer text={`Edit ${user.username}`}>
                                <Pencil className={styles["edit-icon"]}
                                    onClick={() => {
                                        setUserId(id)
                                        setTimezone(timezone)
                                        setEditing(true)
                                        //setFocus(constants.Settings.TextFocus.TIMEZONE)
                                        setTimezonePage(constants.Settings.TimezonePages.MANUAL)
                                    }} />
                            </TooltipContainer>
                            <TooltipContainer text={`Remove ${user.username}`}>
                                <Trash className={styles["delete-icon"]} onClick={() => handleRemove(id)} />
                            </TooltipContainer>
                        </div>
                    </div>
                })}
            </div>
        </div>
    }

    const TimezonePicker = () => {
        return <Flex className={styles["user-add-timezone-panel"]}>
            {timezonePage === constants.Settings.TimezonePages.MANUAL && <>
                <TextInput className={styles["timezone-search-textbox"]}
                    value={timezone}
                    placeholder={`Timezone (in UTC. e.g.: ${currentOffset})`}
                    onChange={text => setTimezone(text.replace(/[^\d.+-]/g, ''))}
                    //onClick={() => setFocus(constants.Settings.TextFocus.TIMEZONE)}
                    //autoFocus={focus === constants.Settings.TextFocus.TIMEZONE}
                    key={constants.Settings.TextFocus.TIMEZONE}
                    error={timezoneError}
                />
                <TooltipContainer text={`Search by city`} className={styles["search-city-wrapper"]}>
                    <Button className={styles["search-city-btn"]}
                        look={Button.Looks.OUTLINED}
                        color={Button.Colors.WHITE}
                        size={Button.Sizes.ICON}
                        onClick={() => setTimezonePage(constants.Settings.TimezonePages.CITY_SELECTOR)}>
                        <EmojiTravelCategory width={24} height={24} />
                    </Button>
                </TooltipContainer>
            </>}

            {timezonePage === constants.Settings.TimezonePages.CITY_SELECTOR && <>
                <TextInput className={styles["city-search-textbox"]}
                    value={userCity}
                    placeholder={`Continent/City. e.g.: ${moment.tz.guess()}`}
                    onChange={text => setUserCity(text)}
                    //onClick={() => setFocus(constants.Settings.TextFocus.CITY)}
                    error={userCityError}
                    //autoFocus={focus === constants.Settings.TextFocus.CITY}
                    key={constants.Settings.TextFocus.CITY}
                />
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
                        onClick={() => setTimezonePage(constants.Settings.TimezonePages.MANUAL)}>
                        <ArrowLeft />
                    </Button>
                </div>
            </>}
        </Flex>
    }

    return <>
        <UserList />
        <Button onClick={() => openModal((h) => <UserSearch onConfirm={(id) => console.log(id)} {...h}/>)}>
            test
        </Button>
        <Text size={Text.Sizes.SIZE_14} className={`${styles["section-look"]} h5-18_1nd`}>Add a new user</Text>
        <div>
            <TextInput
                value={userId}
                placeholder="User ID"
                onChange={text => {
                    setUserId(text.replace(/^(?![0-9]).*/g, ''))
                    if (getTimezone(text)) setEditing(true)
                    else setEditing(false)
                    if (closeOnAdd) closeOnAdd = false
                }}
                onClick={() => setFocus(constants.Settings.TextFocus.USER_ID)}
                autoFocus={focus === constants.Settings.TextFocus.USER_ID}
                error={userIdError}
            />
            <TimezonePicker />
        </div>
        {timezonePage === constants.Settings.TimezonePages.MANUAL && <Button onClick={() => handleAdd(userId, timezone)}>{isEditing ? "Edit" : "Add"} user</Button>}
    </>
}