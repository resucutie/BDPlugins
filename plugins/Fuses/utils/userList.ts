import { Users } from "@discord/stores";
import settings from "../settingsManager";
import constants from "./constants";
import { UserListException } from "./exceptions";
import { ensureTimezone, isNotTimezone } from "./timezones";

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

const removeUser = (id) => {
    let list = getList()
    delete list[id]
    setList(list)
}

const getTimezone = (id) => {
    let list = getList()
    return list?.[id]
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

const isExistingUser = id => Boolean(getTimezone(id))

export { addUser, removeUser, getTimezone, getList, setList, isExistingUser, cleanList, isListNotValid }