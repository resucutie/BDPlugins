import React, { useState, useEffect } from 'react';

import { TooltipContainer } from "@discord/components";

import settings from "../settingsManager";
import { getTimeFromTimezone, formatDate, getOffset } from '../utils/timezones';

export default React.memo(({ timezone = getOffset(new Date()), tooltip = true, showSeconds = false, className }) => {
    const [dateTime, setDateTime] = useState(getTimeFromTimezone(timezone))
    useEffect(() => {
        const id = setInterval(() => setDateTime(getTimeFromTimezone(timezone), 1000))
        return () => {
            clearInterval(id)
        }
    }, [])

    const formattedText = formatDate(dateTime, timezone)

    const element = <>{formattedText.hours}:{formattedText.minutes}{settings.get("seconds", false) || showSeconds ? `:${formattedText.seconds}` : ""}</>

    if (tooltip) return <TooltipContainer text={formattedText.toString()} delay={750} className={className}>{element}</TooltipContainer>
    return element
})