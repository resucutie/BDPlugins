import settings from "../settingsManager";
import { ensureTimezone } from "./timezones";

const getList = () => settings.get("userList", {})

const setList = (list: Object) => settings.set("userList", list)

const addUser = (id, timezone) => {
    let list = getList()

    timezone = ensureTimezone(timezone)

    list[id] = timezone
    setList(list)
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

const isExistingUser = id => Boolean(getTimezone(id))

export { addUser, removeUser, getTimezone, getList, setList, isExistingUser }