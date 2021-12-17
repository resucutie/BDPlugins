/// <reference path="../../../types/main.d.ts" />

import { WebpackModules } from "@zlibrary";
import { TimezoneException, DateException } from "./exceptions"
import constants from "./constants"
import settings from "../settingsManager";

const moment = WebpackModules.getByProps("utc", "duration")

function getOffset(date = moment()) {
    let timezoneOffset: number;
    if(moment.isMoment(date)) timezoneOffset = date.utcOffset()
    else if (_.isDate(date)) timezoneOffset = moment(date).utcOffset()
    else throw new DateException("Invalid date was insert in getOffset(). Please insert a Moment or a Date", constants.ExceptionCodes.Date.INVALID_DATE)
    
    return (timezoneOffset <= 0 ? "" : "+") + timezoneOffset / 60
}

function getTimeFromTimezone(utcOffset, currentDate = new Date()) {
    if (!_.isDate(currentDate)) throw new DateException("Invalid date was insert in getTimeFromTimezone(). Please insert a Date", constants.ExceptionCodes.Date.INVALID_DATE)

    //get the time
    let localTime = currentDate.getTime();
    let localOffset = currentDate.getTimezoneOffset() * 60000;

    let utc = new Date(localTime + localOffset);

    utc.setTime(utc.getTime() + (Number(utcOffset) * 60 * 60 * 1000))

    return utc
}

function formatDate(date: Date, timezone?, isAMPMFormat = settings.get("ampm", constants.TimePreferrence["12HFOMRAT"]())) {
    if (!_.isDate(date)) throw new DateException("Invalid date was insert in formatDate(). Please insert a Date", constants.ExceptionCodes.Date.INVALID_DATE)

    const fullHour = date.getHours().toLocaleString(navigator.language, { minimumIntegerDigits: 2, useGrouping: false })
    const AMPMHour = ((Number(fullHour) + 11) % 12 + 1).toLocaleString(navigator.language, { minimumIntegerDigits: 2, useGrouping: false })
    const suffix = Number(fullHour) >= 12 ? "PM" : "AM";
    const minutes = date.getMinutes().toLocaleString(navigator.language, { minimumIntegerDigits: 2, useGrouping: false })
    const seconds = date.getSeconds().toLocaleString(navigator.language, { minimumIntegerDigits: 2, useGrouping: false })

    type whyTypescript = { includeSecs?: boolean }
    type whyTypescriptPartTwo = { includeTimezone?: boolean }

    const timeString = ({ includeSecs }: whyTypescript = { includeSecs: true }) => `${isAMPMFormat ? AMPMHour : fullHour}:${minutes}${includeSecs ? ":" + seconds : ""}${isAMPMFormat ? " " + suffix : ""}`
    const toString = ({ includeTimezone }: whyTypescriptPartTwo = { includeTimezone: Boolean(timezone) }) => `${date.toDateString()} ${timeString()} ${includeTimezone ? `(UTC${timezone})` : ""}`

    return {
        hours: isAMPMFormat ? AMPMHour : fullHour,
        "12hour": AMPMHour,
        "24hour": fullHour,
        minutes,
        seconds,
        suffix,
        timeString,
        dateString: () => date.toDateString(),
        toString
    }
}

function ensureTimezone(timezone) {
    timezone = String(timezone)
    
    timezone.replace(/[^\d.+-]/g, '')

    if (timezone.charAt(0) !== "+" && timezone.charAt(0) !== "-" && timezone !== 0) timezone = "+" + timezone
    timezone = timezone.replace(",", ".")

    let checkEnsured = isNotTimezone(timezone, { checkCharacters: false })

    if (checkEnsured) throw new TimezoneException("Unable to ensure", checkEnsured)

    return timezone
}

function isNotTimezone(timezone, opts: object = {filterUndefined: true, checkNumber: true, checkCharacters: true, checkOverflow: true}) {
    const { filterUndefined, checkNumber, checkCharacters, checkOverflow }: any = opts
    
    // undefined checking
    if (timezone == null && filterUndefined) return constants.ExceptionCodes.Timezones.InvalidFormatReasons.UNDEFINED

    if (checkNumber) {
        // number checking
        try {
            new Number(timezone)
        } catch (e) {
            return constants.ExceptionCodes.Timezones.InvalidFormatReasons.NOT_A_NUMBER
        }
    }

    if (checkCharacters) {
        // character checking
        const firstChar = timezone.charAt(0)
        const hasSign: boolean = firstChar === "+" || firstChar === "-" || timezone === 0
        if (!hasSign) return constants.ExceptionCodes.Timezones.InvalidFormatReasons.NO_SIGN
    }

    // overflow checking
    if (Math.abs(Number(timezone)) < 24 && checkOverflow) return constants.ExceptionCodes.Timezones.InvalidFormatReasons.OVERFLOW

    return false
}

export { getTimeFromTimezone, getOffset, formatDate, isNotTimezone, ensureTimezone }