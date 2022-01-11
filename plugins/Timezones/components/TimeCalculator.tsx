import React, { useState, useRef, useEffect, useReducer } from "react";
import { useSpring, useTransition, animated as a } from "react-spring"

import { WebpackModules } from "@zlibrary";
import { useStateFromStores } from "@discord/flux";
import { Button, Flex, HeaderType, TextInput } from "@discord/components";

import useResizeObserver from '../hooks/useResizeObserver';
import { getTimeFromTimezone, formatDate } from "../utils/timezones";
import settings from "../settingsManager";
import styles from "../style.scss"
import { Text } from "@discord/components";

const Header: HeaderType = WebpackModules.find(m => m.Tags && m.displayName === "Header")

interface Props {
    timezone: string
    attachPropsToAnim?: Object
    shouldAnimate?: boolean
    [key: string]: any
}

export default React.memo(({ timezone, attachPropsToAnim, shouldAnimate = true, ...etc }: Props) => {
    const {ref, height} = useResizeObserver();

    let shouldShow = useStateFromStores([settings], () => settings.get("_callTimeCalculator"))

    const [hours, setHours] = useState<any>(0)
    const [minutes, setMinutes] = useState<any>(0)

    const [calculated, calculate] = useState(getCurrentTime(timezone, hours, minutes))
    useEffect(() => {
        const id = setInterval(() => calculate(getCurrentTime(timezone, hours, minutes)), 1000)
        return () => {
            clearInterval(id)
        }
    })

    const openAnim = useSpring({
        height: shouldShow ? height + 16 : 0,
        opacity: shouldShow ? 1 : 0,
        pointerEvents: shouldShow ? "visible" : "none",
    });

    const calculateTextAnim = useSpring({
        opacity: calculated ? 1 : 0
    });

    let render = <div className={styles["calc-time-wrapper"]} {...etc}>
        <Flex align={Flex.Align.CENTER} className={styles["input-wrapper"]}>
            <TextInput className={styles["input"]} value={hours} onChange={(value) => {
                setHours(value.replace(/[^\d.+-:]/g, ''))
            }} /> <span>hour{hours === 1 ? "" : "s"} and</span>
            <TextInput className={styles["input"]} value={minutes} onChange={(value) => setMinutes(Number(value))} /> <span>minute{minutes === 1 ? "" : "s"}</span>
        </Flex>
        {calculated && <a.div style={calculateTextAnim}><b>Result:</b> {formatDate(calculated).toString()}</a.div>}
    </div>

    return shouldAnimate ? <a.div style={openAnim} {...attachPropsToAnim}>
        <div ref={ref}>
            <div className="divider-1wtgZ3" />
            {/*@ts-ignore */}
            <Header size={Header.Sizes.SIZE_12} muted={true} uppercase={true} className="bodyTitle-2Az3VQ">Calculate time</Header>
            {render}
        </div>
    </a.div> : render
})

function getCurrentTime(timezone: Timezone, hrs: number, mins: number){
    if (hrs === 0 || Number.isNaN(hrs) || Number.isNaN(mins)) return
    
    const correctedHours = hrs + (mins / 60)
    let date = getTimeFromTimezone(timezone, new Date())
    date.setTime(date.getTime() + (Number(correctedHours) * 60 * 60 * 1000))

    return date
}