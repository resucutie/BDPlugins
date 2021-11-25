import { useState, useEffect } from "react"

import { getTimeFromTimezone } from "../utils/timezones"

const useTimezone = (timezone,  interval = "second" ) => {
    const [date, setDate] = useState(getTimeFromTimezone(timezone));

    useEffect(() => {
        let timeoutId

        const bump = () => {
            timeoutId = setTimeout(() => {
                setDate(new Date());
                bump();
            }, nextCallback(new Date(), interval));
        };

        bump();

        return () => clearTimeout(timeoutId);
    });

    return date;
};

export default useTimezone;

const nextCallback = (now, interval) => {
    if (typeof interval === "number") {
        return interval;
    } else if (interval === "second") {
        return 1000 - now.getMilliseconds();
    } else if (interval === "minute") {
        return 60 * 1000 - now.getMilliseconds() - now.getSeconds() * 1000;
    } else if (interval === "hour") {
        return (
            60 * 60 * 1000 -
            now.getMilliseconds() -
            now.getSeconds() * 1000 -
            now.getMinutes() * 60 * 1000
        );
    } else {
        return 1000 - now.getMilliseconds();
    }
};