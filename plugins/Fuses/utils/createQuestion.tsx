/// <reference path="../../../types/main.d.ts" />

import { Button, Text } from "@discord/components"
import { openModal, ModalRoot, ModalSize, ModalHeader, ModalContent, ModalFooter } from "@discord/modal"

export default (title: string | ReactComponent, description: string | ReactComponent, buttons: Array<{ text?: string | ReactComponent, color?: string, look?: string }> = [{ text: "Okay", color: Button.Colors.BRAND, look: Button.Looks.FILLED }]) => new Promise((result, reject) => {
    openModal(h => <ModalRoot {...h} size={ModalSize.SMALL}>
        <ModalHeader separator={false}>
            <Text size={Text.Sizes.SIZE_14} className="h4-AQvcAz title-3sZWYQ defaultColor-1_ajX0 defaultMarginh4-2vWMG5">
                {title}
            </Text>
        </ModalHeader>
        <ModalContent>
            <Text size={Text.Sizes.SIZE_16}>{description}</Text>
        </ModalContent>
        <ModalFooter>
            {buttons.map(params => <Button color={params.color} look={params.look} onClick={() => { result(params.text); h.onClose() }}>
                {params.text}
            </Button>)}
        </ModalFooter>
    </ModalRoot>)
})