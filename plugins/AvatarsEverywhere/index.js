import { Patcher } from "@zlibrary";
import BasePlugin from "@zlibrary/plugin";
import stylesheet from "styles"
import SettingsPanel from "./Settings"

import userMentions from "./patches/userMentions";
import typingBar from "./patches/extras/typingBar";
// import dmHeaderBar from "./patches/extras/dmHeaderBar";
import compactMessages from "./patches/compactMessages";
import systemMessages from "./patches/systemMessages";

export default class AvatarsEverywhere extends BasePlugin {
    onStart() {
        stylesheet.inject()

        userMentions()
        typingBar()
        compactMessages()
        systemMessages()
        // dmHeaderBar()
    }


    getSettingsPanel() {
        return <SettingsPanel />;
    }

    onStop() {
        Patcher.unpatchAll()
        stylesheet.remove()
    }
}