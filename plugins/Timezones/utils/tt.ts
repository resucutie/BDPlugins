import settings from "../settingsManager"
import constants from "./constants"

async function getUser(id) {
    const response: Response = await fetch(settings.get("tt-url", constants.TimeTogether.DEFAULT_URL) + `api/user/${id}`, {
        method: 'GET'
    }).catch((error) => {
       console.error("things went bad", error)
       throw error
    })

    if (response.status === 404) return
    if (response.status === 200) return await response.json()
}

const doesUserExists = async (id) => Boolean(await getUser(id))

export {
    getUser,
    doesUserExists
}