/// <reference path="../../../types/main.d.ts" />

import { Users } from "@discord/stores"
import { ModalRoot, ModalSize, ModalHeader, ModalContent } from "@discord/modal"

interface Props {
    onConfirm: Function;
    onClose: Function;
    [key: string]: any
}

export default function ({ onConfirm, onClose, transitionState }: Props) {
    const userList: Array<any> = Object.entries(Users.getUsers()).filter(([id]) => id !== Users.getCurrentUser().id)

    const handleSelection = (id: string) => {
        onConfirm(id)
        onClose()
    }
    return <>
        <ModalRoot size={ModalSize.LARGE} {...{ transitionState }}>
            <ModalContent>
                {
                    userList.slice(0, 10).map(([id, values]) => {
                        return <div onClick={() => handleSelection(id)}>{id}</div>
                    })
                }
            </ModalContent>
        </ModalRoot>
    </>
}