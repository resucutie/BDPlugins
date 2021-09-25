import React from 'react';
import { ChatBubble, OverflowMenuHorizontal, DoubleStarIcon, Robot } from "@discord/icons"
import { WebpackModules } from "@zlibrary";
import { useStateFromStores } from "@discord/flux";
import createUpdateWrapper from "common/hooks/createUpdateWrapper";
import Category from "common/components/category";
import settings from './settingsManager';

const SwitchItem = createUpdateWrapper(WebpackModules.getByDisplayName("SwitchItem"))

export default React.memo(() => {
    const mentionsDisabled = useStateFromStores([settings], () => !settings.get("mentions", true))
    const compactMessagesDisabled = useStateFromStores([settings], () => !settings.get("compact-message", true))

    return <>
        <Category
            look={Category.Looks.COMPACT}
            label={<LabelWrapper component={ChatBubble} name="Mentions"/>}
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
            label={<LabelWrapper component={OverflowMenuHorizontal} name="Typing users" />}
        >
            <SwitchItem
                value={settings.get("typing-users", true)}
                onChange={value => settings.set("typing-users", value)}
            >Enable</SwitchItem>
        </Category>

        <Category
            look={Category.Looks.COMPACT}
            label={<LabelWrapper component={DoubleStarIcon} name="Compact mode" />}
        >
            <SwitchItem
                value={settings.get("compact-message", true)}
                onChange={value => settings.set("compact-message", value)}
            >User icon on messages</SwitchItem>

            <SwitchItem
                value={settings.get("compact-message-reply", true)}
                onChange={value => settings.set("compact-message-reply", value)}
                disabled={compactMessagesDisabled}
            >Replies</SwitchItem>
        </Category>

        <Category
            look={Category.Looks.COMPACT}
            label={<LabelWrapper component={Robot} name="System Messages" />}
        >
            <SwitchItem
                value={settings.get("system-messages-join", true)}
                onChange={value => settings.set("system-messages-join", value)}
            >Join messages</SwitchItem>

            <SwitchItem
                value={settings.get("system-messages-boost", true)}
                onChange={value => settings.set("system-messages-boost", value)}
            >Boost messages</SwitchItem>
            
            <SwitchItem
                value={settings.get("system-messages-thread", true)}
                onChange={value => settings.set("system-messages-thread", value)}
            >Thread messages</SwitchItem>
        </Category>
    </>
})

const LabelWrapper = ({component: Component, name}) => {
    return <span style={{ display: 'flex', alignItems: "center"}}>
        <Component style={{marginRight: "4px"}} /> {name}
    </span>
}