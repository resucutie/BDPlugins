import { Patcher, WebpackModules, Utilities } from "@zlibrary";
import BasePlugin from "@zlibrary/plugin";
import styles from "./style.scss";
import stylesheet from "styles"
import settings from "./settingsManager";
import SettingsPanel from "./Settings"

export default class DarkCreateGuildModal extends BasePlugin {
    onStart() {
        stylesheet.inject()

        Patcher.after(WebpackModules.getByProps("CreateGuildSlideTypes"), "default", (_this, args, res) => {
            res.props.className = `theme-dark`
        })

        //yes i know the idea of patching ModalFooter looks HORRIBLE but im too lazy to mess with monkeypatching
        Patcher.after(WebpackModules.getByProps("ModalFooter"), "ModalFooter", (_this, args, res) => {
            if (!settings.get("white-back-button", false)) return
            
            let backButton = Utilities.findInReactTree(res, e => (e?.props?.look?.indexOf?.("lookBlank") > -1) && (e?.props?.size?.indexOf?.("sizeMin") > -1))
            if (!backButton) return
            backButton.props.className += ` ${styles["backButtonPatch"]}`
        })
    }

    getSettingsPanel() {
        return <SettingsPanel />;
    }

    onStop() {
        Patcher.unpatchAll()
        stylesheet.remove()
    }
}