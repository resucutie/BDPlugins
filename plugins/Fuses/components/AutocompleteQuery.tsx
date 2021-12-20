import React, { useEffect, useState } from "react"
import useKeyPress from "../hooks/useKeyPress";
import styles from "../style.scss"

interface Props {
    list: any[]
    onSelect: (value) => void
}

export default React.memo(({list, onSelect}: Props) => {
    const downPress = useKeyPress("ArrowDown");
    const upPress = useKeyPress("ArrowUp");
    const enterPress = useKeyPress("Enter");
    const [cursor, setCursor] = useState<number>(0);
    const [hovered, setHovered] = useState();

    useEffect(() => {
        if (list.length && downPress) {
            setCursor(prevState =>
                prevState < list.length - 1 ? prevState + 1 : prevState
            );
        }
    }, [downPress]);
    useEffect(() => {
        if (list.length && upPress) {
            setCursor(prevState => (prevState > 0 ? prevState - 1 : prevState));
        }
    }, [upPress]);
    useEffect(() => {
        if (list.length && enterPress) {
            onSelect(list[cursor]);
        }
    }, [cursor, enterPress]);
    useEffect(() => {
        if (list.length && hovered) {
            setCursor(list.indexOf(hovered));
        }
    }, [hovered]);

    return <div className={styles["autocomplete"]}>
        <div className={styles["autocomplete-popout"]}>
            {list.map((item, index) => {
                return <CityItem
                    active={index === cursor}
                    item={item}
                    onSelect={onSelect}
                    setHovered={setHovered}
                />
            })}
        </div>
    </div>
})

const CityItem = ({ item, active, onSelect, setHovered }) => {
    return <div className={styles["row"]}
        onClick={() => onSelect(item)}
        onMouseEnter={() => setHovered(item)}
        onMouseLeave={() => setHovered()}
    >
        <div
            className={`${styles["item"]} ${active ? styles["selected"] : ""}`}
        >
            <span>{item}</span>
        </div>
    </div>
}