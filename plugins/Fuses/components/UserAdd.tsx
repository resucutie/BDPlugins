/// <reference path="../../../types/main.d.ts" />
import React, { useState, useReducer, ReactFragment, useEffect } from 'react';
import { useTransition, animated as a } from "react-spring";
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
import UserSearch from './UserSelector';
import ErrorText from './ErrorText';

const { AvatarDefaults } = DiscordModules
const { default: Avatar } = WebpackModules.getByProps("AnimatedAvatar")
const { default: SearchBar } = WebpackModules.find(m => m.default?.displayName === 'SearchBar')

export default function ({ presets = {}, closeOnAdd = false }: UserAddProps){
    const [, forceUpdate] = useReducer(n => n + 1, 0);
    const currentOffset = getOffset()

    // Hooks
    const [init, setInit] = useState<any>(false)

    useEffect(() => {
        setInit(true)
    })

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

    //animations
    const addUserButtonAnim = useTransition(timezonePage === constants.Settings.TimezonePages.MANUAL, {
        from: { marginTop: init ? "-38px" : "0px", opacity: init ? 0 : 1 },
        enter: { marginTop: "0px", opacity: 1 },
        leave: { marginTop: "-38px", opacity: 0 }
    })

    const searchCityButtonAnim = useTransition(timezonePage === constants.Settings.TimezonePages.CITY_SELECTOR, {
        from: { marginRight: "-40px", opacity: 0 },
        enter: { marginRight: "0px", opacity: 1 },
        leave: { marginRight: "-40px", opacity: 0 }
    })

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
            setUserIdError("I have no idea how you made that, but you've added an invalid ID")
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
            const cityDate:any = getDateFromCity(city, true)
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
        let filteredList: Array<any> = Object.entries(getList()).filter(([userid]) => Users.getUser(userid).username.toLowerCase().indexOf(search) > -1)
        return <div className={styles["user-list-wrapper"]}>
            <SearchBar className={styles["header-search"]}
                placeholder="Search user"
                query={search}
                onQueryChange={val => {
                    setSearch(val)
                    setFocus(constants.Settings.TextFocus.SEARCH_USER_LIST)
                }}
                onClear={() => setSearch("")}
                key={constants.Settings.TextFocus.SEARCH_USER_LIST}
                autoFocus={focus === constants.Settings.TextFocus.SEARCH_USER_LIST}
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
                                        setFocus(constants.Settings.TextFocus.TIMEZONE)
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
        return <Flex className={styles["user-add-timezone-panel"]} style={{zIndex: 2}}>
            {timezonePage === constants.Settings.TimezonePages.MANUAL && <>
                <TextInput className={styles["timezone-search-textbox"]}
                    value={timezone}
                    placeholder={`Timezone (in UTC. e.g.: ${currentOffset})`}
                    onChange={text => setTimezone(text.replace(/[^\d.+-]/g, ''))}
                    onClick={() => setFocus(constants.Settings.TextFocus.TIMEZONE)}
                    autoFocus={focus === constants.Settings.TextFocus.TIMEZONE}
                    key={constants.Settings.TextFocus.TIMEZONE}
                    error={timezoneError}
                />
            </>}

            {timezonePage === constants.Settings.TimezonePages.CITY_SELECTOR && <>
                <TextInput className={styles["city-search-textbox"]}
                    value={userCity}
                    placeholder={`Continent/City. e.g.: ${moment.tz.guess()}`}
                    onChange={text => setUserCity(text)}
                    onClick={() => setFocus(constants.Settings.TextFocus.CITY)}
                    error={userCityError}
                    autoFocus={focus === constants.Settings.TextFocus.CITY}
                    key={constants.Settings.TextFocus.CITY}
                />
            </>}

            <div className={styles["actions-wrapper"]}>
                {searchCityButtonAnim((styles, item) => item && <a.div style={styles} className={styles["find-city-btn-anim"]}><Button className={styles["find-city-btn"]}
                    color={Button.Colors.GREEN}
                    size={Button.Sizes.ICON}
                    style={{ width: "40px", height: "40px" }}
                    onClick={() => handleCityChange(userCity)}>
                    <Search />
                </Button></a.div>)}
                {timezonePage === constants.Settings.TimezonePages.MANUAL ? <TooltipContainer text={`Search by city`} className={styles["search-city-wrapper"]}>
                    <Button className={styles["search-city-btn"]}
                        look={Button.Looks.OUTLINED}
                        color={Button.Colors.WHITE}
                        size={Button.Sizes.ICON}
                        onClick={() => setTimezonePage(constants.Settings.TimezonePages.CITY_SELECTOR)}>
                        <EmojiTravelCategory width={24} height={24} />
                    </Button>
                </TooltipContainer> : <Button className={styles["return-btn"]}
                    look={Button.Looks.OUTLINED}
                    color={Button.Colors.WHITE}
                    size={Button.Sizes.ICON}
                    onClick={() => setTimezonePage(constants.Settings.TimezonePages.MANUAL)}>
                    <ArrowLeft />
                </Button>}
            </div>
        </Flex>
    }

    const UserPicker = ({user}: {user: UserObject}) => {
        const UserSelector = ({ text }: { text: string }) => {
            return <a onClick={() => openModal((h) => <UserSearch onConfirm={(id) => {
                setUserId(id)
                setEditing(false)
            }} {...h} />)}>{text}</a>
        }

        return <div className={styles["user-selector"]}>
            {userId ? <div className={styles["user-picker"]}>
                <span>Selected user:</span>
                <Avatar src={AvatarDefaults.getUserAvatarURL(user)} size={Avatar.Sizes.SIZE_16} className={styles["avatar"]} />
                <span>{user.username}.</span>
                <UserSelector text="Change user" />
            </div> : <UserSelector text={"Select a user"}/>}
            {userIdError && <ErrorText>{userIdError}</ErrorText>}
        </div>
    }

    return <>
        <UserList />
        <UserPicker user={Users.getUser(userId)} />
        <TimezonePicker />
        {addUserButtonAnim((styles, item) => item && <a.div style={styles}>
                <Button
                    onClick={() => handleAdd(userId, timezone)}
                    disabled={!(userId && !_.isEmpty(timezone))}
                >
                    {isEditing ? "Edit" : "Add"} user
                </Button>
            </a.div>)}
    </>
}