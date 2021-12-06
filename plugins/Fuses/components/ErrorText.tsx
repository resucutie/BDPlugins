import React from "react";
import { useSpring, animated } from "react-spring";


export default React.memo(({children}: any) => {
    const anim = useSpring({
        from: { marginTop: "-10px" },
        to: { marginTop: "0" }
    })

    return <animated.div style={anim} className="colorError-3RX-d6 size12-3cLvbJ">{children}</animated.div>
})