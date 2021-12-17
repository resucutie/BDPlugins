import React from "react";

import { openModal } from "@discord/modal"
import { WebpackModules, DiscordModules } from "@zlibrary";
import UserSearch from './UserSelector';
import ErrorText from './ErrorText';
import styles from "../style.scss"

interface Props { 
    user: UserObject
    onSelect: (id) => void
    error?: boolean | string | ReactElement
    filterUsers?: { existingUsers?: boolean, bots?: boolean }
    bigPreview?: boolean
    disableControls?: boolean
}

const { AvatarDefaults } = DiscordModules
const { default: Avatar } = WebpackModules.getByProps("AnimatedAvatar")

export default React.memo(({ user, onSelect, error, filterUsers, bigPreview = false, disableControls = false }: Props) => {
    const UserSelector = ({ text }: { text: string }) => {
        return <a onClick={() => openModal((h) => <UserSearch onConfirm={onSelect} include={filterUsers} {...h} />)}>{text}</a>
    }

    const Controls = () => <>
        <span>{user.username} {bigPreview ? "" : "."}</span>
        <div className={styles["opts"]}>
            <UserSelector text="Change" />
            {!bigPreview && <>
                <span className={styles["dot"]}>or</span>
                <a onClick={onSelect}>Remove</a>
            </>}
        </div>
    </>

    const SmallPreview = () => {
        if (user) return <div className={styles["user-picker"]}>
            <Avatar src={AvatarDefaults.getUserAvatarURL(user)} size={Avatar.Sizes.SIZE_16} className={styles["avatar"]} />
            <Controls />
        </div>
        else return <UserSelector text={"Select a user"} />
    }

    const BigPreview = () => {
        if (user) return <div className={styles["user-picker-big-preview"]}>
            <Avatar src={AvatarDefaults.getUserAvatarURL(user)} size={Avatar.Sizes.SIZE_120} className={styles["avatar"]} />
            <Controls />
        </div>
        else return <ErrorText>User ID not set. Please contact the dev of this plugin</ErrorText>
    }

    return <div className={styles["user-selector"]}>
        {!bigPreview ? <SmallPreview /> : <BigPreview />}
        {error && <ErrorText>{error}</ErrorText>}
    </div>
})