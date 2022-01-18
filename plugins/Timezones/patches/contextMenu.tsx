import React from "react"

import { Patcher, Utilities, WebpackModules } from "@zlibrary"
import { MenuGroup, MenuItem, MenuSeparator } from "@discord/contextmenu"
import { Users } from "@discord/stores"

import TimestampActions from "../components/context menus/TimestampActions"
import useAsync from "../hooks/useAsync"
import settings from "../settingsManager"
import { getTimezone } from "../utils/userList"
import ThisPlugin from "../index"

export default function(){
    /**
     * Discord just made a lot of context menus lazyloaded. Sadly this is necessary
     * Code made by Strencher, and adapted to work with BD by me. Credit strencher by his work
     * @see {@link https://github.com/HolyMod/HolyMod/blob/master/src/renderer/autopatchers/contextmenu.tsx}
     */
    Patcher.before(WebpackModules.getByProps("openContextMenuLazy"), "openContextMenuLazy", (_this, args) => {
        args[1] = (ogFunc => args => ogFunc(args).then(render => props => {
            const firstRes = render(props)

            try {
                const ogFunc = firstRes?.type

                if (typeof ogFunc !== 'function') return firstRes
                
                Object.assign(firstRes.props, { _timezonesParsedOgFunc: ogFunc })

                firstRes.type = ContextMenuPatcher
                firstRes.key = "TimezonesPatchedContextMenu"
                firstRes.type.displayName = ogFunc.displayName
            } catch (err) {
                console.error("Could not patch the context menu", err)
            }

            return firstRes
        }))(args[1]);
    })
}

function ContextMenuPatcher({_timezonesParsedOgFunc, ...props}){
    //here would be the equivalent of the callback in a normal patch
    useForceUpdate(); // Allow force re-rendering the entire context menu.
    const res = _timezonesParsedOgFunc.call(this, props)

    switch (_timezonesParsedOgFunc?.displayName) {
        case "GuildChannelUserContextMenu": {
            patchGuildChannelUserContextMenu(this, props, res)
            break;
        }

        case "DMUserContextMenu": {
            patchDMUserContextMenu(this, props, res)
            break;
        }
    }

    return res;
}

function patchDMUserContextMenu(_this, props, res) {
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
}

function patchGuildChannelUserContextMenu(_this, props, res) {
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
}

const updateRefs = new Set();
function useForceUpdate() {
    const [, forceUpdate] = React.useReducer(e => !e, true);

    React.useEffect(() => {
        const listener = () => forceUpdate();
        updateRefs.add(listener);

        return () => void updateRefs.delete(listener);
    });
}