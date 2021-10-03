import React, { useState } from 'react';
import { ArrowLeft, At, OverflowMenuHorizontal, DoubleStarIcon, Robot } from "@discord/icons"
import { WebpackModules } from "@zlibrary";
import { useStateFromStores } from "@discord/flux";
import { Button, Flex, Text } from "@discord/components";
import createUpdateWrapper from "common/hooks/createUpdateWrapper";
import Category from "common/components/category";
import settings from './settingsManager';
import styles from "./style.scss";

const SwitchItem = createUpdateWrapper(WebpackModules.getByDisplayName("SwitchItem"))

export default React.memo(() => {
    const mentionsDisabled = useStateFromStores([settings], () => !settings.get("mentions", true))
    const compactMessagesDisabled = useStateFromStores([settings], () => !settings.get("compact-message", true))

    const [tab, setTab] = useState("main")

    //components
    const SelectCard = ({ tab, children, icon: Icon, colors }) => {
        const { primary, secondary } = colors
        return <div className={styles["settings-card"]}
            style={{ "--avatars-card-primary": primary, "--avatars-card-secondary": secondary }}
            onClick={() => setTab(tab)}
        >
            <Icon />
            <Text size={Text.Sizes.SIZE_16} color={Text.Colors.HEADER_PRIMARY}>{children}</Text>
        </div>
    }

    const SettingHeader = () => {
        return <div onClick={() => setTab("main")} style={{display: "flex", alignItems: "center"}}>
            <Button
                color={Button.Colors.TRANSPARENT}
                size={Button.Sizes.ICON}
            >
                <ArrowLeft />
            </Button>
            <Text style={{ marginLeft: "10px" }} size={Text.Sizes.SIZE_16} color={Text.Colors.STANDARD}>Return</Text>
        </div>
    }



    //tabs
    const MentionsTab = <>
        <SwitchItem
            value={settings.get("mentions", true)}
            onChange={value => settings.set("mentions", value)}
        >Add avatars to mentions</SwitchItem>

        <SwitchItem
            value={settings.get("mentions-no-at", false)}
            onChange={value => settings.set("mentions-no-at", value)}
            disabled={mentionsDisabled}
        >Remove the @ symbol</SwitchItem>
        <SettingHeader />
    </>

    const ExtrasTab = <>
        <SwitchItem
            value={settings.get("typing-users", true)}
            onChange={value => settings.set("typing-users", value)}
        >Typing users</SwitchItem>
        <SettingHeader/>
    </>

    const CompactModeTab = <>
        <SwitchItem
            value={settings.get("compact-message", false)}
            onChange={value => settings.set("compact-message", value)}
        >Add avatars to compact messages</SwitchItem>

        <SwitchItem
            value={settings.get("compact-message-reply", false)}
            onChange={value => settings.set("compact-message-reply", value)}
            disabled={compactMessagesDisabled}
        >Replies</SwitchItem>
        <SettingHeader />
    </>

    const SystemMessagesTab = <>
        <SwitchItem
            value={settings.get("system-messages-join", true)}
            onChange={value => settings.set("system-messages-join", value)}
        >Join messages</SwitchItem>

        <SwitchItem
            value={settings.get("system-messages-boost", true)}
            onChange={value => settings.set("system-messages-boost", value)}
        >Boost messages</SwitchItem>

        <SwitchItem
            value={settings.get("system-messages-thread-created", true)}
            onChange={value => settings.set("system-messages-thread-created", value)}
        >Thread created</SwitchItem>

        <SwitchItem
            value={settings.get("system-messages-thread-member-removed", true)}
            onChange={value => settings.set("system-messages-thread-member-removed", value)}
        >Thread member removed</SwitchItem>
        <SettingHeader />
    </>



    return <>
        {tab === "main" ? <div className={styles["settings-grid"]}>
            <SelectCard tab="mentions" icon={At} colors={{ primary: "hsl(356, 100%, 36%)", secondary: "hsl(302, 100%, 62%)" }}>Mentions</SelectCard>
            <SelectCard tab="compactMode" icon={DoubleStarIcon} colors={{ primary: "hsl(238, 65%, 50%)", secondary: "hsl(300, 65%, 50%)" }}>Compact mode</SelectCard>
            <SelectCard tab="systemMessages" icon={Robot} colors={{ primary: "hsl(231, 100%, 62%)", secondary: "hsl(206, 100%, 62%)" }}>System Messages</SelectCard>
            <SelectCard tab="typingUsers" icon={OverflowMenuHorizontal} colors={{ primary: "hsl(195, 65%, 50%)", secondary: "hsl(157, 65%, 50%)" }}>Extras</SelectCard>
        </div> : <>
            <span style={{display: "block", marginBottom: "5px"}}></span>
            {tab === "mentions" && MentionsTab}
            {tab === "typingUsers" && ExtrasTab}
            {tab === "compactMode" && CompactModeTab}
            {tab === "systemMessages" && SystemMessagesTab}
        </>}
    </>
})