import React from "react";
import styles from "../../style.scss"

export default React.memo(({rotateAngle}: any) => {

    return <div style={{ position: "relative" }} className={styles["rotate-wrapper"]}>
        <svg className={styles["rotate-clock"]} width="110" height="129" viewBox="0 0 110 129" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M73.2 0H36.6V12.2H73.2V0ZM97.783 38.979L106.445 30.317C103.822 27.206 100.955 24.278 97.844 21.716L89.182 30.378C79.727 22.814 67.832 18.3 54.9 18.3C24.583 18.3 7.62939e-06 42.883 7.62939e-06 73.2C7.62939e-06 103.517 24.522 128.1 54.9 128.1C85.278 128.1 109.8 103.517 109.8 73.2C109.8 60.268 105.286 48.373 97.783 38.979ZM54.9 115.9C31.293 115.9 12.2 96.807 12.2 73.2C12.2 49.593 31.293 30.5 54.9 30.5C78.507 30.5 97.6 49.593 97.6 73.2C97.6 96.807 78.507 115.9 54.9 115.9Z" fill="black" />
        </svg>
        <div className={styles["rotate-pointer"]} style={{ transform: `rotate(${rotateAngle}deg)` }}/>
    </div>

})