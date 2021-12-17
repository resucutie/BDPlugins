import React, { useState } from "react";

import { Trash, Gear, Pencil } from "@discord/icons"
import { getList } from '../../utils/userList';
import styles from "../../style.scss"
import { Users } from "@discord/stores";
import { DiscordModules, WebpackModules } from "@zlibrary";
import constants from "../../utils/constants";
import { Button, Popout, TooltipContainer } from "@discord/components";
import BasicTimer from "../BasicTimer";
import ListSettings from "../context menus/ListSettings";
import { useStateFromStores } from "@discord/flux";
import settings from "../../settingsManager";

const SearchBar = WebpackModules.getByDisplayName('SearchBar')
const { default: Avatar } = WebpackModules.getByProps("AnimatedAvatar")
const { AvatarDefaults } = DiscordModules

export default React.memo(({onEdit, onDelete }: any) => {
    const sortSettings = useStateFromStores([settings], () => settings.get("listSorting", "a-z"))
    const lockControls = useStateFromStores([settings], () => !settings.get("lockControls", false))

    const [search, setSearch] = useState("") //UserTimezone Textbox

    const filteredList: any[] = Object.entries(getList()).filter(([userid]) => ~Users.getUser(userid)?.username?.toLowerCase?.().indexOf?.(search))
    
    let sortedList: any[] = filteredList

    // if func is -1 so a is first
    // if func is 1 so b is first

    switch(sortSettings) {
        case "a-z":
            sortedList = filteredList.sort(([aId], [bId]) => {
                const a = Users.getUser(aId)
                const b = Users.getUser(bId)
                if (!a || !b) return 0;

                if (a.username > b.username) return 1
                if (a.username < b.username) return -1
            })
            break;
        case "z-a":
            sortedList = filteredList.sort(([aId], [bId]) => {
                const a = Users.getUser(aId)
                const b = Users.getUser(bId)
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

    return <div className={styles["user-list-wrapper"]}>
        <div className={styles["header"]}>
            <SearchBar className={styles["header-search"]}
                placeholder="Search user"
                query={search}
                onQueryChange={val => {
                    setSearch(val)
                }}
                onClear={() => setSearch("")}
            />
            <Popout renderPopout={props => <ListSettings {...props} onClose={props.closePopout} />} position={Popout.Positions.BOTTOM}>
                {props => <Button size={Button.Sizes.ICON} look={Button.Looks.BLANK} className={`${styles["settings"]} ${props["aria-expanded"] ? styles["active"] : ""}`} {...props}>
                    <Gear width={20} height={20} />
                </Button>}
            </Popout>
        </div>

        <div className={styles["user-list"]}>
            {sortedList.map(([id, timezone]) => {
                const user = Users.getUser(id)

                if (!user) return

                return <div className={styles["user-list-item"]}>
                    <Avatar src={AvatarDefaults.getUserAvatarURL(user)} size={Avatar.Sizes.SIZE_32} className={styles["avatar"]} />
                    <div>
                        <div className={styles["name"]}>{user.username}</div>
                        <div className={styles["timezone"]}>UTC{timezone} <span className={styles["timestamp-dot"]}>•</span> <BasicTimer timezone={timezone} /></div>
                    </div>
                    {lockControls && <div className={styles["actions-wrapper"]}>
                        <TooltipContainer text={`Edit ${user.username}`}>
                            <Pencil className={styles["edit-icon"]} onClick={() => onEdit(id)} />
                        </TooltipContainer>
                        <TooltipContainer text={`Remove ${user.username}`}>
                            <Trash className={styles["delete-icon"]} onClick={() => onDelete(id)} />
                        </TooltipContainer>
                    </div>}
                </div>
            })}
        </div>
    </div>
})