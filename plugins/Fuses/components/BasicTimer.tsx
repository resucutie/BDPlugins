/// <reference path="../../../types/main.d.ts" />
import React, { useState, useEffect } from 'react';

import { TooltipContainer } from "@discord/components";

import settings from "../settingsManager";
import { getTimeFromTimezone, formatDate, getOffset } from '../utils/timezones';

export default React.memo(({ timezone = getOffset(), tooltip = true, showSeconds = false, staticTime, className }: BasicTimerProps) => {
    const [dateHook, setDateHook] = useState(getTimeFromTimezone(timezone))
    useEffect(() => {
        const id = setInterval(() => setDateHook(getTimeFromTimezone(timezone)), 1000)
        return () => {
            clearInterval(id)
        }
    }, [])

    const date = staticTime ? staticTime : dateHook

    const formattedText = formatDate(date, timezone)

    const element = <>{formattedText.hours}:{formattedText.minutes}{settings.get("seconds", false) || showSeconds ? `:${formattedText.seconds}` : ""}</>

    if (tooltip) return <TooltipContainer text={formattedText.toString()} delay={750} className={className}>{element}</TooltipContainer>
    return element
})