import settings from "../settingsManager";

const addUser = (id, utcOffset) => {
    let list = settings.get("userList", {})

    list[id] = utcOffset.replace(",", ".")
    settings.set("userList", list)
}

const removeUser = (id) => {
    let list = settings.get("userList", {})

    delete list[id]
    settings.set("userList", list)
}

const getList = () => settings.get("userList", {})

const getTimezone = (id) => {
    let list = getList()

    return list?.[id]
}

export { addUser, removeUser, getList, getTimezone }