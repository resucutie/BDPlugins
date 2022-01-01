import React, { useEffect, useState } from "react"

import { MenuGroup, MenuItem } from "@discord/contextmenu"
import { copy } from "@discord/native"
import { getTimeFromTimezone, formatDate } from "../../utils/timezones"

interface Props {
    id: UserID
    timezone?: Timezone
    onEditTimezone?: (id) => void
    onDeleteTimezone?: (id) => void
    isOnline?: boolean
    isExclusivelyOnline?: boolean
}

export default ({ id, timezone, onEditTimezone, onDeleteTimezone, isOnline = false}: Props) => {
    let date = getTimeFromTimezone(timezone)

    const timeFormatted = formatDate(date)

    return <>
        {!isOnline ? <MenuGroup label="Offline actions">
            <MenuItem id="timezones-edit-timestamp"
                label="Edit timezone"
                action={() => onEditTimezone(id)}
            />
            <MenuItem id="timezones-remove-timestamp"
                label="Remove timezone"
                color="colorDanger"
                action={() => onDeleteTimezone(id)}
            />    
        </MenuGroup>
        : <MenuGroup label="Online actions">
            <MenuItem id="timezones-add-timezone-from-db"
                label="Add timezone from TimeTogether"
                color="colorBrand"
                action={() => onEditTimezone(id)}
            />
        </MenuGroup>}
        <MenuGroup>
            <MenuItem id="timezones-copy-timezone"
                label="Copy timezone"
                action={() => copy(timezone)}
            />
            <MenuItem id="timezones-copy-time"
                label="Copy time information"
                action={() => copy(formatDate(date).toString())}
            >
                <MenuItem id="timezones-copy-time-full"
                    label="Full date"
                    action={() => copy(timeFormatted.toString())}
                />
                <MenuItem id="timezones-copy-time-hms"
                    label="Time"
                    action={() => copy(timeFormatted.timeString({ includeSecs: false }))}
                />
                <MenuItem id="timezones-copy-time-date"
                    label="Date"
                    action={() => copy(timeFormatted.dateString())}
                />
            </MenuItem>
        </MenuGroup>
    </>
}