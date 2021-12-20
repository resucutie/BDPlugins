/// <reference path="../../../types/main.d.ts" />
import React, { useState, useEffect } from 'react';

import { TooltipContainer } from "@discord/components";
import { useStateFromStores } from '@discord/flux';

import settings from "../settingsManager";
import { getTimeFromTimezone, formatDate, getOffset } from '../utils/timezones';
import constants from '../utils/constants';

export default React.memo(({ timezone = getOffset(), tooltip = true, showSeconds = false, staticTime, className, children = (props) => props }: BasicTimerProps) => {
    const [dateHook, setDateHook] = useState(getTimeFromTimezone(timezone))
    useEffect(() => {
        const id = setInterval(() => setDateHook(getTimeFromTimezone(timezone)), 1000)
        return () => {
            clearInterval(id)
        }
    }, [])

    const shouldShowTimerIcon = useStateFromStores([settings], () => settings.get("_callTimeCalculator"))

    const date = staticTime ? staticTime : dateHook

    const formattedText = formatDate(date, timezone)

    const element = <>
        {formattedText.hours}:
        {formattedText.minutes}
        {settings.get("seconds", false) || showSeconds ? `:${formattedText.seconds}` : ""}
        {settings.get("ampm", constants.TimePreferrence["12HFOMRAT"]()) ? " " + formattedText.suffix : ""}
    </>

    if (tooltip) return <TooltipContainer text={formattedText.toString()} delay={750} className={className}>{children(element, formattedText, date)}</TooltipContainer>
    return children(element, formattedText, date, shouldShowTimerIcon)
})