import React, { useState, useEffect } from 'react';

import { TooltipContainer } from "@discord/components";
import { useStateFromStores } from '@discord/flux';
import { Timestamp as moment } from '@discord/classes';

import settings from "../settingsManager";
import { getTimeFromTimezone, formatDate, getOffset } from '../utils/timezones';
import constants from '../utils/constants';
import { DiscordModules } from '@zlibrary';

const sunny = DiscordModules.EmojiStore.getByName("sunny")
const moon = DiscordModules.EmojiStore.getByName("crescent_moon")

export default React.memo(({ timezone = getOffset(), tooltip = true, showSeconds = false, staticTime, className, children = (props) => props}: BasicTimerProps) => {
    const [dateHook, setDateHook] = useState(getTimeFromTimezone(timezone))
    useEffect(() => {
        const id = setInterval(() => setDateHook(getTimeFromTimezone(timezone)), 1000)
        return () => {
            clearInterval(id)
        }
    }, [])

    const isTimerCalculatorOpen: boolean = useStateFromStores([settings], () => settings.get("_callTimeCalculator"))

    const date: Date = staticTime ? staticTime : dateHook

    const formattedText = formatDate(date, timezone)
    
    const emojiIcon: string = settings.get("emoji-icons", false)
        ? (
            Number(formattedText["24hour"]) >= 18 || Number(formattedText["24hour"]) < 6
                ? moon.url
                : sunny.url
        )
        : null

    const timeText = settings.get("format", constants.Settings.General.Format.CURRENT_FORMAT)
        //time
        .replace("{24hours}", formattedText["24hour"])
        .replace("{12hours}", formattedText["12hour"])
        .replace("{minutes}", formattedText.minutes)
        .replace("{seconds}", formattedText.seconds)
        //date
        .replace("{date}", String(date.getDate()))
        .replace("{weekday}", String(date.getDay() + 1))
        .replace("{weekdayName}", date.toLocaleDateString(navigator.language, { weekday: 'short' }))
        .replace("{weekdayFullName}", date.toLocaleDateString(navigator.language, { weekday: 'long' }))
        .replace("{weekMonth}", String(getWeekOfMonth(date)))
        .replace("{weekYear}", moment(date).format("w"))
        .replace("{month}", String(date.getMonth() + 1))
        .replace("{monthName}", date.toLocaleDateString(navigator.language, { month: 'short' }))
        .replace("{monthFullName}", date.toLocaleDateString(navigator.language, { month: 'long' }))
        .replace("{year}", String(date.getFullYear()))
        //other
        .replace("{suffix}", formattedText.suffix)
        .replace("{timezone}", timezone)
        .replace("{418}", "I'm a Teapot")

    if (tooltip) return <TooltipContainer text={formattedText.toString()} delay={750} className={className}>{children(timeText, { formattedText, date, isTimerCalculatorOpen, emojiIcon})}</TooltipContainer>
    return children(timeText, { formattedText, date, isTimerCalculatorOpen, emojiIcon})
})

/**
 * @see {@link https://stackoverflow.com/a/36036273/10307617}
 */
const getWeekOfMonth = (date = new Date()) => {
    var firstWeekday = new Date(date.getFullYear(), date.getMonth(), 1).getDay() - 1;
    if (firstWeekday < 0) firstWeekday = 6;
    var offsetDate = date.getDate() + firstWeekday - 1;
    return Math.floor(offsetDate / 7) as number
}