/// <reference path="../../../types/main.d.ts" />

import React, {useState, useEffect} from 'react';

import { DropdownArrow } from "@discord/icons"
import RotateClock from './custom icons/RotateClock';
import { TooltipContainer } from "@discord/components";
import { useStateFromStores } from '@discord/flux';
import styles from "../style.scss"

import settings from "../settingsManager";
import { getTimeFromTimezone, formatDate, getOffset } from '../utils/timezones';
import constants from '../utils/constants';

export default React.memo(({ timezone = getOffset(), showSeconds = false, className, ...etc }: TimerProps) => {
    let shouldShow = useStateFromStores([settings], () => settings.get("_callTimeCalculator"))
    
    const [dateTime, setDateTime] = useState(getTimeFromTimezone(timezone))
    useEffect(() => {
        const id = setInterval(() => setDateTime(getTimeFromTimezone(timezone)), 1000)
        return () => {
            clearInterval(id)
        }
    }, [])


    const formattedText = formatDate(dateTime, timezone)

    return <div className={`${styles["timer-wrapper"]} ${className}`} {...etc}>
        <div className={styles["img-wrapper"]}>
            {!shouldShow ? <TooltipContainer text={formattedText.toString()} className={styles["timer-icon"]}>
                <RotateClock rotateAngle={Number(formattedText['12hour']) * 30} />
            </TooltipContainer> : <DropdownArrow width={20} height={20} />}
        </div>
        <div className={styles["timer"]}>
            {formattedText.hours}:
            {formattedText.minutes}
            {settings.get("seconds", false) || showSeconds ? `:${formattedText.seconds}` : ""}
            {settings.get("ampm", constants.TimePreferrence["12HFOMRAT"]()) ? " " + formattedText.suffix : ""}
        </div>
    </div>
})