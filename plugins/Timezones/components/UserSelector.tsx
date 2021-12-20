/// <reference path="../../../types/main.d.ts" />

import React, { useState } from "react";

import { Users } from "@discord/stores"
import { ModalRoot, ModalSize, ModalHeader, ModalContent, ModalCloseButton } from "@discord/modal"
import { Button, Flex } from "@discord/components";
import { WebpackModules, DiscordModules } from "@zlibrary"
import { isExistingUser } from "../utils/userList";
import styles from "../style.scss"

import constants from "../utils/constants";

type UserSelectorProps = {
    include: {
        existingUsers?: boolean,
        bots?: boolean
    }
    transitionState: 2 | 3
    onConfirm: (id: string) => void
    onClose: Function
}

const { AvatarDefaults } = DiscordModules
const { default: Avatar } = WebpackModules.getByProps("AnimatedAvatar")
const { default: SearchBar } = WebpackModules.find(m => m.default?.displayName === 'SearchBar')

export default function ({ onConfirm, include = { existingUsers: true, bots: false }, onClose, transitionState }: UserSelectorProps) {
    const [search, setSearch] = useState("")
    const [selectedUser, setSelectedUser] = useState<any>(false)

    const userList: Array<[string, UserObject]> = Object.entries(Users.getUsers()).filter(([id]) => id !== Users.getCurrentUser().id)

    const searchedUserList = userList.filter(([, user]) => {
        const isInSearch = Boolean(~user.username.toLowerCase().indexOf(search.toLowerCase()))
        const isBot = include.bots ? false : user.bot
        const doesExist = include.existingUsers ? true : !isExistingUser(user.id)
        return isInSearch && !isBot && doesExist
    }).slice(0, 30)

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
                    {searchedUserList.map(([id, values]) => {
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
                        Select
                    </Flex>
                </Button>
            </ModalContent>
        </ModalRoot>
    </div>
}