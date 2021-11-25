import moment from "moment-timezone"
import { TimezoneException, DateException } from "./exceptions"
import constants from "./constants"

function getOffset(date) {
    let timezoneOffset;
    if(moment.isMoment(date)) {
        timezoneOffset = date.utcOffset()
    } else {
        if (!_.isDate(date)) throw new DateException("Invalid Date", constants.ExceptionCodes.Date.INVALID_DATE)
        timezoneOffset = date.getTimezoneOffset()
    }
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

export { getTimeFromTimezone, getOffset, getDateFromCity }