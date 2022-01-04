import React from "react"

import { Patcher, WebpackModules } from "@zlibrary"
import { MenuGroup, MenuItem, MenuSeparator } from "@discord/contextmenu"
import { Users } from "@discord/stores"

import TimestampActions from "../components/context menus/TimestampActions"
import useAsync from "../hooks/useAsync"
import settings from "../settingsManager"
import { getTimezone } from "../utils/userList"
import ThisPlugin from "../index"

export default function(){
    Patcher.after(WebpackModules.find(m => m.default?.displayName === 'GuildChannelUserContextMenu'), "default", (_this, [props], res) => {
        const user: UserObject = props.user

        if (user.bot || Users.getCurrentUser().id === user.id) return

        let menuGroup = res.props?.children?.props?.children?.[4]
        if (!menuGroup) return

        const state = useAsync(async () => ({
            offlineTz: await getTimezone(user.id, { includeTT: false }),
            timezone: await getTimezone(user.id, { includeTT: settings.get("tt", true) })
        }))

        menuGroup.props.children.unshift(<MenuGroup label={state.loading ? <div style={{ opacity: .3 }}>Loading...</div> : null}>
            {!state.loading ? <>
                {!state.value?.timezone ? <MenuItem
                    id="timezones-add-user"
                    label="Add timezone locally"
                    action={async () => { await ThisPlugin.prototype.openSettingsModal(user.id) }}
                /> : <MenuItem
                    id="timezones-actions"
                    label="Timezone actions"
                >
                    {TimestampActions({
                        id: user.id,
                        timezone: state.value?.timezone,
                        onEditTimezone: async id => await ThisPlugin.prototype.openSettingsModal(id, Boolean(!state.value?.offlineTz && state.value?.timezone)),
                        onDeleteTimezone: async id => {
                            ThisPlugin.prototype.onDeleteTimezone(id)
                        },
                        isOnline: !state.value?.offlineTz
                    })}
                </MenuItem>}
            </> : <>
                <MenuItem
                    id="timezones-loading-add"
                    label="Add timezone locally"
                    disabled={true}
                />
                <MenuItem
                    id="timezones-loading-actions"
                    label="Timezone actions"
                    disabled={true}
                />
            </>}
        </MenuGroup>, <MenuSeparator />)
    })

    Patcher.after(WebpackModules.find(m => m.default?.displayName === 'DMUserContextMenu'), "default", (_this, [props], res) => {
        const user: UserObject = props.user

        if (user.bot || Users.getCurrentUser().id === user.id) return

        let userActions = res.props?.children?.props?.children?.[5]
        if (!userActions) return

        const state = useAsync(async () => ({
            offlineTz: await getTimezone(user.id, { includeTT: false }),
            timezone: await getTimezone(user.id, { includeTT: settings.get("tt", true) })
        }))

        userActions.props.children.unshift(<MenuGroup label={state.loading ? <div style={{ opacity: .3 }}>Loading...</div> : null}>
            {!state.loading ? <>
                {!state.value?.timezone ? <MenuItem
                    id="timezones-add-user"
                    label="Add timezone locally"
                    action={async () => { await ThisPlugin.prototype.openSettingsModal(user.id) }}
                /> : <MenuItem
                    id="timezones-actions"
                    label="Timezone actions"
                >
                    {TimestampActions({
                        id: user.id,
                        timezone: state.value?.timezone,
                        onEditTimezone: async id => await ThisPlugin.prototype.openSettingsModal(id, Boolean(!state.value?.offlineTz && state.value?.timezone)),
                        onDeleteTimezone: async id => {
                            ThisPlugin.prototype.onDeleteTimezone(id)
                        },
                        isOnline: !state.value?.offlineTz
                    })}
                </MenuItem>}
            </> : <>
                <MenuItem
                    id="timezones-loading-add"
                    label="Add timezone locally"
                    disabled={true}
                />
                <MenuItem
                    id="timezones-loading-actions"
                    label="Timezone actions"
                    disabled={true}
                />
            </>}
        </MenuGroup>, <MenuSeparator />)
    })
}