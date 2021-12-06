/// <reference path="../../../types/main.d.ts" />

import moment from "moment-timezone"
import { TimezoneException, DateException } from "./exceptions"
import constants from "./constants"

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

function getDateFromCity(city, sendAsMoment = false) {
    if (!moment.tz.zone(city)) throw new TimezoneException("Invalid City", constants.ExceptionCodes.Timezones.INVALID_CITY)
    let timezone = moment.tz(city)
    return sendAsMoment ? timezone : timezone.toDate()
}

function formatDate(date, timezone?) {
    if (!_.isDate(date)) throw new DateException("Invalid date was insert in formatDate(). Please insert a Date", constants.ExceptionCodes.Date.INVALID_DATE)

    let hours = date.getHours().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false })
    let minutes = date.getMinutes().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false })
    let seconds = date.getSeconds().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false })

    return {
        hours,
        minutes,
        seconds,
        toString: () => `${date.toDateString()} ${hours}:${minutes}:${seconds}${timezone ? ` (UTC${timezone})` : ""}`
    }
}

function ensureTimezone(timezone) {
    timezone = String(timezone)

    if (timezone.charAt(0) !== "+" && timezone.charAt(0) !== "-") timezone = "+" + timezone
    timezone = timezone.replace(",", ".")

    let checkEnsured = isNotTimezone(timezone, { checkCharacters: false })

    if (checkEnsured) throw new TimezoneException("Unable to ensure", checkEnsured)

    return timezone
}

function isNotTimezone(timezone, { filterUndefined, checkNumber, checkCharacters, checkOverflow }: any = {filterUndefined: true, checkNumber: true, checkCharacters: true, checkOverflow: true}) {
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
        const hasSign: boolean = firstChar === "+" || firstChar === "-"
        if (!hasSign) return constants.ExceptionCodes.Timezones.InvalidFormatReasons.NO_SIGN
    }

    // overflow checking
    if (Math.abs(Number(timezone)) < 24 && checkOverflow) return constants.ExceptionCodes.Timezones.InvalidFormatReasons.OVERFLOW

    return false
}

export { getTimeFromTimezone, getOffset, getDateFromCity, formatDate, isNotTimezone, ensureTimezone }