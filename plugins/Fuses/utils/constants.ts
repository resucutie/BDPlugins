export default {
    ExceptionCodes: {
        Timezones: {
            INVALID_CITY: "INVALID_CITY",
            INVALID_FORMAT: "INVALID_FORMAT",

            InvalidFormatReasons: {
                NO_SIGN: "NO_SIGN",
                NOT_A_NUMBER: "NOT_A_NUMBER",
                OVERFLOW: "OVERFLOW",
                UNDEFINED: "UNDEFINED"
            }
        },
        Date: {
            INVALID_DATE: "INVALID_DATE"
        },
        ImportFile: {
            INVALID_FILE: "INVALID_FILE"
        }
    },
    Settings: {
        TimezonePages: {
            CITY_SELECTOR: "city",
            MANUAL: "manual"
        },
        TextFocus: {
            USER_ID: "userID",
            TIMEZONE: "userTimezone",
            CITY: "userCity",
            SEARCH_USER_LIST: "searchUserList"
        }
    },
    TimePreferrence: {
        "12HFOMRAT": (location = navigator.language) => Intl.DateTimeFormat(location, { hour: 'numeric' }).resolvedOptions()["hour12"]
    }
}