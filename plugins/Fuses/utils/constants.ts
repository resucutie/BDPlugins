export default {
    ExceptionCodes: {
        Timezones: {
            INVALID_CITY: "INVALID_CITY",
            NOT_HMTZ_FORMAT: "NOT_HMTZ_FORMAT",
            NOT_HTZ_FORMAT: "NOT_HTZ_FORMAT",
            INVALID_FORMAT: "INVALID_FORMAT",

            InvalidFormatReasons: {
                NO_SIGN: "NO_SIGN",
                NOT_A_NUMBER: "NOT_A_NUMBER",
                NOT_HTZ_FORMAT: "NOT_HTZ_FORMAT",
                OVERFLOW: "OVERFLOW",
                UNDEFINED: "UNDEFINED"
            }
        },
        Date: {
            INVALID_DATE: "INVALID_DATE"
        },
        ImportFile: {
            INVALID_FILE: "INVALID_FILE"
        },
        UserList: {
            INVALID_USER: "INVALID_USER",
            INVALID_LIST_TYPE: "INVALID_LIST_TYPE"
        }
    },
    Settings: {
        TimezonePages: {
            CITY_SELECTOR: "city",
            MANUAL: "manual"
        },
        TimerDisplay:{
            USER_BANNER: "userBanner",
            USER_HEADER: "userHeader"
        }
    },
    TimePreferrence: {
        "12HFOMRAT": (location = navigator.language) => Intl.DateTimeFormat(location, { hour: 'numeric' }).resolvedOptions()["hour12"]
    }
}