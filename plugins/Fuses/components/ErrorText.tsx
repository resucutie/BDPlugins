import React from "react";
import { useSpring, animated } from "react-spring";


export default React.memo(({children, ...etc}: any) => {
    const anim = useSpring({
        from: { marginTop: "-10px" },
        to: { marginTop: "0" }
    })

    return <animated.div style={anim} {...etc} className="colorError-3RX-d6 size12-3cLvbJ">{children}</animated.div>
})