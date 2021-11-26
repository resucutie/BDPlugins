import moment from "moment-timezone"
import { TimezoneException, DateException } from "./exceptions"
import constants from "./constants"

function getOffset(date = moment(date)) {
    let timezoneOffset;
    if(moment.isMoment(date)) timezoneOffset = date.utcOffset()
    else timezoneOffset = moment(date).utcOffset()
    
    return (timezoneOffset <= 0 ? "" : "+") + timezoneOffset / 60
}

function getTimeFromTimezone(utcOffset, currentDate = new Date()) {
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

function formatDate(date, timezone) {
    let hours = date.getHours().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false })
    let minutes = date.getMinutes().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false })
    let seconds = date.getSeconds().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false })

    return {
        hours,
        minutes,
        seconds,
        toString: () => `${date.toDateString()} ${hours}:${minutes}:${seconds} (UTC${timezone})`
    }
}

export { getTimeFromTimezone, getOffset, getDateFromCity, formatDate }