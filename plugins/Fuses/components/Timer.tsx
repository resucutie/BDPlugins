/// <reference path="../../../types/main.d.ts" />

import React, {useState, useEffect} from 'react';

import { DropdownArrow } from "@discord/icons"
import RotateClock from './custom icons/RotateClock';
import { TooltipContainer } from "@discord/components";
import styles from "../style.scss"

import BasicTimer from './BasicTimer';
import { getOffset } from '../utils/timezones';

export default React.memo(({ timezone = getOffset(), showSeconds = false, className, children = (props) => props, ...etc }: TimerProps) => {
    return <div className={`${styles["timer-wrapper"]} ${className}`} {...etc}>
        <BasicTimer timezone={timezone} showSeconds={showSeconds} tooltip={false}>
            {(element, formattedText, date, shouldShowTimerIcon) => <>
                <div className={styles["img-wrapper"]}>
                    {!shouldShowTimerIcon ? <TooltipContainer text={formattedText.toString()}>
                        <RotateClock rotateAngle={Number(formattedText['12hour']) * 30} />
                    </TooltipContainer> : <DropdownArrow width={20} height={20} />}
                </div>
                <div className={styles["timer"]}>
                    {children(element, formattedText, date, shouldShowTimerIcon)}
                </div>
            </>}
        </BasicTimer>
        
    </div>
})