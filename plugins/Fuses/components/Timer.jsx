import React, {useState, useEffect} from 'react';

import { Timer } from "@discord/icons"
import { TooltipContainer } from "@discord/components";
import styles from "../style.scss"

import settings from "../settingsManager";
import { getTimeFromTimezone, formatDate, getOffset } from '../utils/timezones';

export default React.memo(({ timezone = getOffset(new Date()), showSeconds=false, className}) => {
    const [dateTime, setDateTime] = useState(getTimeFromTimezone(timezone))
    useEffect(() => {
        const id = setInterval(() => setDateTime(getTimeFromTimezone(timezone), 1000))
        return () => {
            clearInterval(id)
        }
    }, [])


    const formattedText = formatDate(dateTime, timezone)

    return <div className={`${styles["timer-wrapper"]} ${className}`}>
        <TooltipContainer text={formattedText.toString()} className={styles["timer-icon"]}>
            <Timer />
        </TooltipContainer>
        <div className={styles["timer"]}>{formattedText.hours}:{formattedText.minutes}{settings.get("seconds", false) || showSeconds ? `:${formattedText.seconds}` : ""}</div>
    </div>
})