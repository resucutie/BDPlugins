import React from 'react';
import { WebpackModules } from "@zlibrary";
import createUpdateWrapper from "common/hooks/createUpdateWrapper";
import settings from './settingsManager';

const SwitchItem = createUpdateWrapper(WebpackModules.getByDisplayName("SwitchItem"))

export default React.memo(() => {
    return <>
        <SwitchItem
            value={settings.get("white-back-button", false)}
            onChange={value => settings.set("white-back-button", value)}
        >Fix the back button by making it white</SwitchItem>
    </>
})