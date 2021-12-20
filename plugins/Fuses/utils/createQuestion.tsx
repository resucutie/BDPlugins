/// <reference path="../../../types/main.d.ts" />

import { Button, Text } from "@discord/components"
import { openModal, ModalRoot, ModalSize, ModalHeader, ModalContent, ModalFooter, ModalSizeProps } from "@discord/modal"

type ButtonArray = { text?: string | ReactElement, color?: string, look?: string }[]
interface Settings {
    size?: string
    autoClose?: boolean
}

export default (
    title: string | ReactElement,
    description: string | ReactElement,
    buttons: ButtonArray = [{ text: "Okay", color: Button.Colors.BRAND, look: Button.Looks.FILLED }],
    options: Settings = {size: ModalSize.SMALL, autoClose: true}
) => new Promise((result, reject) => {
    openModal(h => <ModalRoot {...h} size={options.size}>
        <ModalHeader separator={false}>
            <Text size={Text.Sizes.SIZE_14} className="h4-AQvcAz title-3sZWYQ defaultColor-1_ajX0 defaultMarginh4-2vWMG5">
                {title}
            </Text>
        </ModalHeader>
        <ModalContent>
            <Text size={Text.Sizes.SIZE_16}>{description}</Text>
        </ModalContent>
        <ModalFooter>
            {buttons.map(params => <Button color={params.color} look={params.look} onClick={() => { result({button: params.text, close: h.onClose}); if (options.autoClose) h.onClose() }}>
                {params.text}
            </Button>)}
        </ModalFooter>
    </ModalRoot>)
})