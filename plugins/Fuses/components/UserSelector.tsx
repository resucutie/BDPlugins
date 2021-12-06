/// <reference path="../../../types/main.d.ts" />

import React, { useState } from "react";

import { Users } from "@discord/stores"
import { ModalRoot, ModalSize, ModalHeader, ModalContent, ModalCloseButton } from "@discord/modal"
import { Button, Flex } from "@discord/components";
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
    const [selectedUser, setSelectedUser] = useState<any>(false)

    const userList: Array<any> = Object.entries(Users.getUsers()).filter(([id]) => id !== Users.getCurrentUser().id)

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
                    {userList.filter(([, user]) => ~user.username.toLowerCase().indexOf(search.toLowerCase())).slice(0, 30).map(([id, values]) => {
                        return <div className={`${styles["list-user"]} ${selectedUser === values ? styles["list-user-selected"] : ""}`} onClick={() => { setSelectedUser(selectedUser === values ? false : values) }}>
                            <Avatar className={styles["user-pfp"]} src={AvatarDefaults.getUserAvatarURL(values)} size={Avatar.Sizes.SIZE_24} />
                            <span>{values.username}</span>
                        </div>
                    })}
                </div>

                <Button onClick={() => {
                            onConfirm(selectedUser.id)
                            onClose()
                        }}
                        style={{marginLeft: "auto", marginBottom:"16px"}}
                        disabled={!selectedUser}>
                    <Flex>
                        {selectedUser && <Avatar className={styles["user-pfp"]} src={AvatarDefaults.getUserAvatarURL(selectedUser)} size={Avatar.Sizes.SIZE_16} />}
                        Select user
                    </Flex>
                </Button>
            </ModalContent>
        </ModalRoot>
    </div>
}