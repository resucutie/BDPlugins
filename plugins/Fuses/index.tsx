/// <reference path="../../types/main.d.ts" />

import React from "react"
import BasePlugin from "@zlibrary/plugin";
import { WebpackModules } from "@zlibrary";
import { Text, Button } from "@discord/components"
import { ModalRoot, ModalSize, ModalHeader, ModalContent, openModal, ModalFooter } from "@discord/modal"

const {PRETTY_KEYS} = WebpackModules.find(m => m.default?.displayName === "KeyboardShortcut")
export default class Fuses extends BasePlugin {
    onStart() {
        openModal(props => <ModalRoot {...props} size={ModalSize.SMALL}>            
            <ModalHeader separator={false}>
                <h2 className="wrapper-1sSZUt fontDisplay-1dagSA base-1x0h_U size20-17Iy80">Plugin renamed</h2>
            </ModalHeader>
            <ModalContent>
                <Text>
                    The plugin "Fuses" was renamed to "Timezones" and so your version wont recive updates. Please download the renamed plugin to get updates.<br /><br />
                    If you don't know how, hit the "Open download link" button, press <div className="keybindShortcut-1BD6Z1" style={{ display: "inline-flex", margin: 0 }}><span>{PRETTY_KEYS.mod()}</span><span style={{ margin: 0 }}>s</span></div> on your keyboard and select your BetterDiscord folder<br /><br />
                </Text>
            </ModalContent>
            <ModalFooter>
                <Button onClick={() => {window.open("https://raw.githubusercontent.com/abUwUser/BDPlugins/compiled/Timezones/Timezones.plugin.js"); props.onClose()}}>
                    Open download link
                </Button>
            </ModalFooter>
        </ModalRoot>)
    }
}