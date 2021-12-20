import timezonesList from "./db/timezoneList.json";
import { ensureTimezone, getTimeFromTimezone } from "./timezones";
import constants from "./constants";
import { TimezoneException } from "./exceptions";
import { Timestamp as moment } from "@discord/classes";

const normalizeCity = (city) => city.replace(" ", "_").normalize("NFD").replace(/\p{Diacritic}/gu, "")

function searchForInfoFromCity(city: string, exact = false, onlyFirstResult = false) {
    const normalizedCity = normalizeCity(city)
    const results = timezonesList.filter(t => {
        let search = t.cities.filter(c => exact ? c === normalizedCity : ~c.toLowerCase().indexOf(normalizedCity.toLowerCase()))
        return _.isEmpty(search) ? false : search[0]
    })
    return onlyFirstResult ? results?.[0] : results
}

function searchCityNames(city: string, exact = false, onlyFirstResult = false) {
    const normalizedCity = normalizeCity(city)
    const searched: any = searchForInfoFromCity(normalizedCity, exact, onlyFirstResult)
    if (!searched) return
    
    if (_.isArray(searched)) return searched.flatMap(t => t.cities.filter(c => ~c.toLowerCase().indexOf(normalizedCity.toLowerCase())))
    else return searched
}

function getTimezoneFromCity(city: string) {
    const foundCity: any = searchForInfoFromCity(city)
    if (!foundCity || foundCity?.length <= 0 || foundCity?.length >= 2) throw new TimezoneException("Invalid City", constants.ExceptionCodes.Timezones.INVALID_CITY)
    return foundCity?.[0]?.offset
}

function getDateFromCity(city: string, sendAsMoment = false) {
    const timezone = getTimezoneFromCity(city)
    if (!timezone) return
    const date = getTimeFromTimezone(ensureTimezone(timezone))
    return sendAsMoment ? moment(date) : date
}

const doesCityExist = (city: string) => Boolean(searchForInfoFromCity(city, true))

export { normalizeCity, searchForInfoFromCity, searchCityNames, getTimezoneFromCity, getDateFromCity, doesCityExist }