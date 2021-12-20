import React, { useEffect, useState } from "react"

import { MenuGroup, MenuItem } from "@discord/contextmenu"
import { copy } from "@discord/native"
import { getTimeFromTimezone, formatDate } from "../../utils/timezones"

interface Props {
    id: UserID
    timezone?: Timezone
    onEditTimezone?: (id) => void
    onDeleteTimezone?: (id) => void
}

export default ({ id, timezone, onEditTimezone, onDeleteTimezone}: Props) => {
    let date = getTimeFromTimezone(timezone)

    const timeFormatted = formatDate(date)

    return [
        <MenuGroup>
            <MenuItem id="fuses-edit-timestamp"
                label="Edit timezone"
                action={() => onEditTimezone(id)}
            />
            <MenuItem id="fuses-remove-timestamp"
                label="Remove timezone"
                color="colorDanger"
                action={() => onDeleteTimezone(id)}
            />
        </MenuGroup>,
        <MenuGroup>
            <MenuItem id="fuses-copy-timezone"
                label="Copy timezone"
                action={() => copy(timezone)}
            />
            <MenuItem id="fuses-copy-time"
                label="Copy time information"
                action={() => copy(formatDate(date).toString())}
            >
                <MenuItem id="fuses-copy-time-full"
                    label="Full date"
                    action={() => copy(timeFormatted.toString())}
                />
                <MenuItem id="fuses-copy-time-hms"
                    label="Time"
                    action={() => copy(timeFormatted.timeString({ includeSecs: false }))}
                />
                <MenuItem id="fuses-copy-time-date"
                    label="Date"
                    action={() => copy(timeFormatted.dateString())}
                />
            </MenuItem>
        </MenuGroup>
    ]
}