import React, { useState } from "react";

import { Trash, Gear, Pencil } from "@discord/icons"
import { cleanList, getList, getTimezone, UserListType } from '../../utils/userList';
import styles from "../../style.scss"
import { Users } from "@discord/stores";
import { DiscordModules, WebpackModules } from "@zlibrary";
import { Button, Popout, TooltipContainer } from "@discord/components";
import BasicTimer from "../BasicTimer";
import ListSettings from "../context menus/ListSettings";
import { useStateFromStores } from "@discord/flux";
import settings from "../../settingsManager";

const SearchBar = WebpackModules.getByDisplayName('SearchBar')
const { default: Avatar } = WebpackModules.getByProps("AnimatedAvatar")
const { AvatarDefaults } = DiscordModules

interface Props {
    onEdit?: (id) => void
    onDelete?: (id) => void
    enableSettings?: boolean
    disableControls?: boolean
    list?: UserListType
    [key: string]: any
}

export default React.memo(({ onEdit, onDelete, enableSettings = true, disableControls = settings.get("lockControls", false), list = cleanList(getList()), ...etc }: Props) => {
    const sortSettings = useStateFromStores([settings], () => settings.get("listSorting", "a-z"))
    const lockControls = useStateFromStores([settings], () => disableControls)

    const [search, setSearch] = useState("") //UserTimezone Textbox

    const formattedList = Object.entries(list).map(([userid]) => Users.getUser(userid))

    const filteredList: any[] = formattedList.filter(user => ~user?.username?.toLowerCase?.().indexOf?.(search))
    let sortedList: any[] = filteredList

    // console.log(sortedList)

    // if func is -1 so a is first
    // if func is 1 so b is first
    // if 0 so no changes
    switch(sortSettings) {
        case "a-z":
            sortedList = filteredList.sort((a, b) => {
                if (!a || !b) return 0;

                if (a.username > b.username) return 1
                if (a.username < b.username) return -1
            })
            break;
        case "z-a":
            sortedList = filteredList.sort((a, b) => {
                if (!a || !b) return 0;

                if (a.username > b.username) return -1
                if (a.username < b.username) return 1
            })
            break;
        case "by-newest":
            sortedList = filteredList.reverse()
            break;
        case "by-oldest":
            break;
        default:
            break;
    }

    return <div className={styles["user-list-wrapper"]} {...etc}>
        <div className={styles["header"]}>
            <SearchBar className={styles["header-search"]}
                placeholder="Search user"
                query={search}
                onQueryChange={val => {
                    setSearch(val)
                }}
                onClear={() => setSearch("")}
            />
            {enableSettings && <Popout renderPopout={props => <ListSettings {...props} onClose={props.closePopout} />} position={Popout.Positions.BOTTOM}>
                {props => <Button size={Button.Sizes.ICON} look={Button.Looks.BLANK} className={`${styles["settings"]} ${props["aria-expanded"] ? styles["active"] : ""}`} {...props}>
                    <Gear width={20} height={20} />
                </Button>}
            </Popout>}
        </div>

        <div className={styles["user-list"]}>
            {sortedList.map(user => {
                if (!user) return <></>

                const timezone = getTimezone(user.id)
                if (!timezone) return <></>

                return <div className={styles["user-list-item"]}>
                    <Avatar src={AvatarDefaults.getUserAvatarURL(user)} size={Avatar.Sizes.SIZE_32} className={styles["avatar"]} />
                    <div>
                        <div className={styles["name"]}>{user.username}</div>
                        <div className={styles["timezone"]}>UTC{timezone} <span className={styles["timestamp-dot"]}>•</span> <BasicTimer timezone={timezone} /></div>
                    </div>
                    {!lockControls && <div className={styles["actions-wrapper"]}>
                        <TooltipContainer text={`Edit ${user.username}`}>
                            <Pencil className={styles["edit-icon"]} onClick={() => onEdit(user.id)} />
                        </TooltipContainer>
                        <TooltipContainer text={`Remove ${user.username}`}>
                            <Trash className={styles["delete-icon"]} onClick={() => onDelete(user.id)} />
                        </TooltipContainer>
                    </div>}
                </div>
            })}
        </div>
    </div>
})