import React, {useState, useEffect} from 'react';

import { Timer } from "@discord/icons"
import { TooltipContainer } from "@discord/components";
import style from "../style.scss"

import settings from "../settingsManager";
import { getTimeFromTimezone } from '../utils/timezones';

export default React.memo(({timezone, className}) => {
    const [dateTime, setDateTime] = useState(getTimeFromTimezone(timezone))
    useEffect(() => {
        const id = setInterval(() => setDateTime(getTimeFromTimezone(timezone), 1000))
        return () => {
            clearInterval(id)
        }
    }, [])


    let hours = dateTime.getHours().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false })
    let minutes = dateTime.getMinutes().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false })
    let seconds = dateTime.getSeconds().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false })

    return <div className={`${style["timer-wrapper"]} ${className}`}>
        <TooltipContainer text={`${dateTime.toDateString()} ${hours}:${minutes}:${seconds} (UTC${timezone})`} className={style["timer-icon"]}>
            <Timer />
        </TooltipContainer>
        <div className={style["timer"]}>{hours}:{minutes}{settings.get("seconds", false) ? `:${seconds}` : ""}</div>
    </div>
})