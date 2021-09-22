import React from 'react';
import { WebpackModules } from "@zlibrary";
import { useStateFromStores } from "@discord/flux";
import createUpdateWrapper from "common/hooks/createUpdateWrapper";
import Category from "common/components/category";
import settings from './settingsManager';

const SwitchItem = createUpdateWrapper(WebpackModules.getByDisplayName("SwitchItem"))

export default React.memo(() => {
    const mentionsDisabled = useStateFromStores([settings], () => !settings.get("mentions", true))

    return <>
        <Category
            look={Category.Looks.COMPACT}
            label="Mentions"
        >
            <SwitchItem
                value={settings.get("mentions", true)}
                onChange={value => settings.set("mentions", value)}
            >Enable</SwitchItem>
            <SwitchItem
                value={settings.get("mentions-no-at", false)}
                onChange={value => settings.set("mentions-no-at", value)}
                disabled={mentionsDisabled}
            >Remove the @ symbol</SwitchItem>
        </Category>

        <Category
            look={Category.Looks.COMPACT}
            label="Typing users"
        >
            <SwitchItem
                value={settings.get("typing-users", true)}
                onChange={value => settings.set("typing-users", value)}
            >Enable</SwitchItem>
        </Category>

        <Category
            look={Category.Looks.COMPACT}
            label="Compact mode"
        >
            <SwitchItem
                value={settings.get("compact-message", true)}
                onChange={value => settings.set("compact-message", value)}
            >Add user icon on messages</SwitchItem>
        </Category>
    </>
})