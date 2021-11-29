/// <reference path="../../../types/main.d.ts" />

import React, { useState } from "react";

import { Users } from "@discord/stores"
import { ModalRoot, ModalSize, ModalHeader, ModalContent, ModalCloseButton } from "@discord/modal"
import { WebpackModules, DiscordModules } from "@zlibrary"
import styles from "../style.scss"

import constants from "../utils/constants";

interface Props {
    onConfirm: Function;
    onClose: Function;
    [key: string]: any
}

const { AvatarDefaults } = DiscordModules
const { default: Avatar } = WebpackModules.getByProps("AnimatedAvatar")
const { default: SearchBar } = WebpackModules.find(m => m.default?.displayName === 'SearchBar')

export default function ({ onConfirm, onClose, transitionState }: Props) {
    const [search, setSearch] = useState("")

    const userList: Array<any> = Object.entries(Users.getUsers()).filter(([id]) => id !== Users.getCurrentUser().id)

    const handleSelection = (id: string) => {
        onConfirm(id)
        onClose()
    }

    return <div className={styles["user-find"]}>
        <ModalRoot size={ModalSize.MEDIUM} {...{ transitionState }}>
            <ModalHeader separator={false} >
                <SearchBar className={styles["search"]}
                    placeholder="Search users"
                    query={search}
                    onQueryChange={val => {
                        setSearch(val)
                    }}
                    onClear={() => setSearch("")}
                />
                <ModalCloseButton onClick={() => onClose()} />
            </ModalHeader>
            <ModalContent>
                <div className={styles["list-wrapper"]}>
                    {userList.filter(([, user]) => user.username.toLowerCase().indexOf(search) > -1).slice(0, 30).map(([id, values]) => {
                        return <div className={styles["list-user"]} onClick={() => handleSelection(id)}>
                            <Avatar className={styles["user-pfp"]} src={AvatarDefaults.getUserAvatarURL(values)} size={Avatar.Sizes.SIZE_24} />
                            <span>{values.username}</span>
                        </div>
                    })}
                </div>
            </ModalContent>
        </ModalRoot>
    </div>
}