import React, { useState, useReducer, useEffect } from 'react';
import { useTransition, animated as a } from "react-spring";

import { WebpackModules, Toasts } from "@zlibrary"
import { ArrowLeft, EmojiTravelCategory, Search } from "@discord/icons"
import { Button, TextInput, Flex, TooltipContainer } from "@discord/components";
import { Users } from "@discord/stores";

import styles from "../../style.scss"
import { addUser, removeUser } from '../../utils/userList';
import { ensureTimezone, getOffset } from '../../utils/timezones';
import { getDateFromCity, searchCityNames } from '../../utils/city';
import { TimezoneException } from "../../utils/exceptions";
import constants from "../../utils/constants";
import UserPicker from '../UserPicker';
import List from './List';
import timezoneAbbreviations from "../../utils/db/timezoneAbbreviations.json"
import CitySearchQuery from '../AutocompleteQuery';

const { SingleSelect } = WebpackModules.getByProps("SingleSelect")
const presets = Object.entries(timezoneAbbreviations).map(([name, tz]) => ({ label: name, value: tz }))

export default function ({ defaultVals, isModal = false, ...etc }: UserAddProps){
    const [, forceUpdate] = useReducer(n => n + 1, 0);
    const currentOffset = getOffset()

    // Hooks
    //pages
    const [timezonePage, setTimezonePage] = useState(constants.Settings.TimezonePages.MANUAL)

    //textboxes
    const [userId, setUserId] = useState<string>(defaultVals?.userID) //UserID Textbox
    const [userIdError, setUserIdError] = useState<string|boolean|ReactElement>(false) //UserTimezone Textbox

    const [timezone, setTimezone] = useState<string>(defaultVals?.timezone) //UserTimezone Textbox
    const [timezoneError, setTimezoneError] = useState<string|boolean|ReactElement>(false) //UserTimezone Textbox

    const [userCity, setUserCity] = useState<string>("") //UserTimezone Textbox
    const [userCityError, setUserCityError] = useState<string|boolean|ReactElement>(false) //UserTimezone Textbox

    //animations
    const [init, setInit] = useState<boolean>(false)

    useEffect(() => {
        setInit(true)
    })

    const addUserButtonAnim = useTransition(timezonePage === constants.Settings.TimezonePages.MANUAL, {
        from: { marginTop: init ? "-38px" : "0px", opacity: init ? 0 : 1 },
        enter: { marginTop: "0px", opacity: 1 },
        leave: { marginTop: "-38px", opacity: 0 }
    })

    const selectPresetAnim = useTransition(timezonePage === constants.Settings.TimezonePages.MANUAL, {
        from: { width: init ? "0px" : "150px", opacity: init ? 0 : 1, marginLeft: init ? "0px" : "8px" },
        enter: { width: "150px", opacity: 1, marginLeft: "8px" },
        leave: { width: "0px", opacity: 0, marginLeft: "0px" }
    })

    const searchCityButtonAnim = useTransition(timezonePage === constants.Settings.TimezonePages.CITY_SELECTOR, {
        from: { marginRight: "-40px", opacity: 0 },
        enter: { marginRight: "0px", opacity: 1 },
        leave: { marginRight: "-40px", opacity: 0 }
    })

    //search

    const [searched, setSearched] = useState<string[]>()

    useEffect(() => {
        setSearched(searchCityNames(userCity))
    }, [userCity])

    //etc
    const [isEditing, setEditing] = useState(false)

    // Handlers
    const handleAdd = (id: UserID, timezone: Timezone) => {
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
        addUser(id, ensureTimezone(timezone))

        if (isModal) {
            Toasts.success("Timezone sucessfully added")
            etc.onClose()
            return
        }
        
        //clear texts
        setUserId("")
        setTimezone("")
        
        //remove the editing text
        setEditing(false)

        //resets error values
        setUserIdError(false)
        setTimezoneError(false)
        
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

    //better to not ask why the reck putting inside a prop makes it to work
    const TimezonePicker = <>
        <Flex className={styles["user-add-timezone-panel"]} style={{ zIndex: 2 }}>
            {timezonePage === constants.Settings.TimezonePages.MANUAL && <>
                <TextInput className={styles["timezone-search-textbox"]}
                    value={timezone}
                    placeholder={`Timezone (in UTC. e.g.: ${currentOffset})`}
                    onChange={text => setTimezone(text.replace(/[^\d.+-:]/g, ''))}
                    error={timezoneError}
                />
            </>}

            {timezonePage === constants.Settings.TimezonePages.CITY_SELECTOR && <>
                <TextInput className={styles["city-search-textbox"]}
                    value={userCity}
                    placeholder={`City that user lives (Inserting country names will not work)`}
                    onChange={text => setUserCity(text)}
                    error={userCityError}
                />
            </>}

            {selectPresetAnim((style, item) => item && <a.div style={style}>
                <SingleSelect
                    options={presets}
                    placeholder="Select a preset"
                    value={presets.find(val => ensureTimezone(val.value) === ensureTimezone(timezone))?.value}
                    onChange={value => setTimezone(value)}
                    className={styles["preset-selector"]}
                />
            </a.div>)}

            <div className={styles["actions-wrapper"]}>
                {searchCityButtonAnim((style, item) => item && <a.div style={style} className={styles["find-city-btn-anim"]}><Button className={styles["find-city-btn"]}
                    color={Button.Colors.GREEN}
                    size={Button.Sizes.ICON}
                    style={{ width: "40px", height: "40px" }}
                    onClick={() => handleCityChange(userCity)}>
                    <Search />
                </Button></a.div>)}
                {timezonePage === constants.Settings.TimezonePages.MANUAL ? <TooltipContainer text={`Search a timezone by a city`} className={styles["search-city-wrapper"]}>
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
    </>

    return <>
        {!isModal && <List
            onEdit={id => {
                setUserId(id)
                setTimezone(timezone)
                setEditing(true)
                setTimezonePage(constants.Settings.TimezonePages.MANUAL)
            }}
            onDelete={handleRemove}
        />}
        <UserPicker user={Users.getUser(userId)} onSelect={id => {
            setUserId(id)
            setEditing(false)
        }} error={userIdError} filterUsers={defaultVals?.userPicker} bigPreview={isModal} />
        {(timezonePage === constants.Settings.TimezonePages.CITY_SELECTOR && !_.isEmpty(searched) && !_.isEmpty(userCity) && userCity !== searched?.[0]) && <CitySearchQuery list={searched} onSelect={value => setUserCity(value)} />}
        {TimezonePicker}
        {addUserButtonAnim((style, item) => item && <a.div style={style}>
                <Button
                    onClick={() => handleAdd(userId, timezone)}
                    disabled={!(userId && !_.isEmpty(timezone))}
                >
                    {isEditing ? "Edit" : "Add"} user
                </Button>
            </a.div>)}
    </>
}