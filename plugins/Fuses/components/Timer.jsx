import React from 'react';

import { Timer } from "@discord/icons"
import { TooltipContainer } from "@discord/components";
import style from "../style.scss"

import settings from "../settingsManager";

export default React.memo(({date, timezone, className}) => {
    let hours = date.getHours().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false })
    let minutes = date.getMinutes().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false })
    let seconds = date.getSeconds().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false })

    return <div className={`${style["timer-wrapper"]} ${className}`}>
        <TooltipContainer text={`${date.toDateString()} ${hours}:${minutes}:${seconds} (UTC${timezone})`} className={style["timer-icon"]}>
            <Timer />
        </TooltipContainer>
        <div className={style["timer"]}>{hours}:{minutes}{settings.get("seconds", false) ? `:${seconds}` : ""}</div>
    </div>
})