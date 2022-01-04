import { Users } from "@discord/stores";
import settings from "../settingsManager";
import constants from "./constants";
import { UserListException } from "./exceptions";
import { ensureTimezone, isNotTimezone } from "./timezones";
import { getUser as ttGetUser } from "./tt";
import { TTCache } from "./cache";

export type UserListType = {
    [key: UserID]: Timezone
}

const getList = () => settings.get("userList", {})

const setList = (list: UserListType) => settings.set("userList", list)

const addUser = (id, timezone, shouldCleanList = false) => {
    let list = getList()

    timezone = ensureTimezone(timezone)

    if (!Users.getUser(id)) throw new UserListException("Invalid User", constants.ExceptionCodes.UserList.INVALID_USER)

    list[id] = timezone
    setList(list)

    if (shouldCleanList) cleanList()
}

const editUser = addUser

const removeUser = (id) => {
    let list = getList()
    delete list[id]
    setList(list)
}

const getTimezone = async (id, opts: { includeTT?: boolean } = { includeTT: false }) => {
    if (!id) return
    
    const list = getList()
    const tz = list?.[id]
    if (!tz && opts.includeTT) {
        if (TTCache.has(id)) {
            return TTCache.get(id)
        }

        try {
            const user: TTUser = await ttGetUser(id)
            
            if (user?.timezone) TTCache.set(id, user.timezone)

            return user?.timezone
        } catch (err) {
            console.error(err)
            TTCache.set(id, undefined)
            return undefined
        }
    }
    return tz
}

const cleanList = (list: UserListType = getList()) => {
    let finishedList = {}

    const filteredArray = Object.entries(list).filter(([userId]) => typeof userId === "string" && Boolean(userId) && Boolean(Users.getUser(userId)))
    
    filteredArray.map(([key, val]) => {
        finishedList[key] = val
    })
    
    return finishedList
}

const isListNotValid = (list: UserListType) => {
    if (!(_.isObject(list) && !_.isArray(list))) return [constants.ExceptionCodes.UserList.INVALID_LIST_TYPE]

    for (const id in list) {
        if (!Users.getUser(id)) return [constants.ExceptionCodes.UserList.INVALID_USER, id]

        const timezone: Timezone = list[id]
        const checkIfNotTimezone = isNotTimezone(timezone)

        if (checkIfNotTimezone) return [checkIfNotTimezone, id]
    }

    return false
}

const isExistingUser = async (id, includeTT = false) => Boolean(await getTimezone(id, { includeTT }))

export { addUser, editUser, removeUser, getTimezone, getList, setList, isExistingUser, cleanList, isListNotValid }