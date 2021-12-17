import React, { useEffect, useState } from "react"

import { Menu, MenuGroup, MenuItem, MenuCheckboxItem, MenuRadioItem } from "@discord/contextmenu"
import { useStateFromStores } from "@discord/flux"

import settings from "../../settingsManager"

interface Props {
    onClose?: () => void
    [key: string]: any
}

export default React.memo(({ onClose, ...etc }: Props) => {
    const listSorting = useStateFromStores([settings], () => settings.get("listSorting", "a-z"))
    const lockControls = useStateFromStores([settings], () => settings.get("lockControls", false))

    return <Menu {...etc} navId="fuses-list-settings" onClose={onClose}>
        <MenuGroup label="Sorting">
            <MenuRadioItem label="A-Z" id="a-z" checked={listSorting === "a-z"} action={() => settings.set("listSorting", "a-z")} />
            <MenuRadioItem label="Z-A" id="z-a" checked={listSorting === "z-a"} action={() => settings.set("listSorting", "z-a")} />
            <MenuRadioItem label="By newest" id="by-newest" checked={listSorting === "by-newest"} action={() => settings.set("listSorting", "by-newest")} />
            <MenuRadioItem label="By oldest" id="by-oldest" checked={listSorting === "by-oldest"} action={() => settings.set("listSorting", "by-oldest")} />
        </MenuGroup>
        <MenuGroup>
            <MenuCheckboxItem
                id="lock-controls"
                label="Lock controls"
                subtext="Locks the action controls in the list in case of accidental deletions or changes"
                checked={lockControls}
                action={() => settings.set("lockControls", !lockControls)}
            />
        </MenuGroup>
    </Menu>
})