import React, {useState} from "react";

import { Button, Flex, TextInput } from "@discord/components";
import { getTimeFromTimezone, formatDate } from "../utils/timezones";

export default React.memo(({timezone, ...etc}: {timezone: string; [key: string]: any}) => {
    const [hours, setHours] = useState<any>()
    const [minutes, setMinutes] = useState<any>()

    const newTime = getCurrentTime(timezone, hours, minutes)

    return <div {...etc} style={{zIndex: "400"}}>
        <TextInput placeholder="Hours" value={hours} onChange={(value) => console.log(Number(value))} autoFocus={true} />
        <TextInput placeholder="Minutes" value={minutes} onChange={(value) => console.log(Number(value))} />
        <Button onClick={() => console.log("yes")}>yes</Button>
        <span>{formatDate(newTime).toString()}</span>
    </div>
})

function getCurrentTime(timezone: Timezone, hrs: number, mins: number){
    const correctedHours = hrs + (mins / 60)
    let date = new Date()
    date.setTime(date.getTime() + (Number(correctedHours) * 60 * 60 * 1000))
    return getTimeFromTimezone(timezone, date)
}