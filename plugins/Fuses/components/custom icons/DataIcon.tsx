import React from "react"

const colorList = ["#57F287", "#FEE75C", "#EB459E", "#ED4245"]

export default React.memo((props?: any) => {
    const getRandom = setRandomInterval(0, 4);
    return <svg viewBox="0 0 620 827" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M412.671 190.172L412.674 190.178C416.424 197.48 422.52 203.576 429.822 207.326L429.828 207.329C434.352 209.644 439.346 210.677 445.408 211.176C451.362 211.667 458.765 211.667 468.219 211.667H468.444H610.541C611.646 214.4 612.527 217.249 613.243 220.23C614.968 227.445 615 235.19 615 252.306V771.555C615 781.283 614.996 788.276 614.543 793.771C614.095 799.205 613.234 802.736 611.76 805.617C608.966 811.054 604.388 815.633 598.95 818.426C596.069 819.901 592.538 820.762 587.104 821.21C581.609 821.663 574.616 821.667 564.889 821.667H55.1111C45.3836 821.667 38.391 821.663 32.896 821.21C27.462 820.762 23.9309 819.901 21.0496 818.426C15.6105 815.632 11.0312 811.052 8.23747 805.612C6.76495 802.732 5.9042 799.201 5.45672 793.771C5.00395 788.276 5 781.283 5 771.555V55.1111C5 45.3836 5.00395 38.391 5.45672 32.896C5.90429 27.4642 6.76529 23.9337 8.23834 21.0531C11.0328 15.613 15.613 11.0328 21.0531 8.23834C23.9337 6.76529 27.4642 5.90429 32.896 5.45672C38.391 5.00395 45.3836 5 55.1111 5H367.694C384.809 5 392.554 5.03194 399.769 6.75692C402.75 7.47242 405.6 8.35406 408.333 9.45905V151.556V151.782C408.333 161.235 408.333 168.638 408.824 174.592C409.323 180.654 410.356 185.648 412.671 190.172Z" stroke="white" stroke-width="10" />
        <path d="M434.388 198.429C428.946 195.634 424.365 191.053 421.571 185.612C420.098 182.732 419.238 179.201 418.79 173.771C418.337 168.276 418.333 161.283 418.333 151.556V14.5509C424.681 18.4634 430.08 23.8179 442.003 35.7408L584.259 177.997C596.182 189.92 601.536 195.319 605.449 201.667H468.444C458.717 201.667 451.724 201.663 446.229 201.21C440.798 200.762 437.268 199.902 434.388 198.429Z" stroke="white" stroke-width="10" />
        <path d="M422 25L595 197" stroke="white" stroke-width="20" />
        <rect x="66" y="351" width="210" height="39" rx="20" fill={colorList[getRandom()]} />
        <rect x="157" y="414" width="174" height="23" rx="12" fill="#4F545C" />
        <rect x="157" y="520" width="208" height="23" rx="12" fill="#4F545C" />
        <rect x="157" y="485" width="404" height="23" rx="12" fill="#4F545C" />
        <rect x="157" y="450" width="95" height="23" rx="12" fill="#4F545C" />
        <rect x="66" y="78" width="269" height="39" rx="20" fill={colorList[getRandom()]} />
        <rect x="157" y="141" width="178" height="23" rx="12" fill="#4F545C" />
        <rect x="157" y="282" width="297" height="23" rx="12" fill="#4F545C" />
        <rect x="157" y="247" width="236" height="23" rx="12" fill="#4F545C" />
        <rect x="157" y="212" width="178" height="23" rx="12" fill="#4F545C" />
        <rect x="157" y="177" width="131" height="23" rx="12" fill="#4F545C" />
        <rect x="66" y="586" width="265" height="39" rx="20" fill={colorList[getRandom()]} />
        <rect x="157" y="650" width="285" height="23" rx="12" fill="#4F545C" />
        <rect x="157" y="721" width="168" height="23" rx="12" fill="#4F545C" />
        <rect x="157" y="686" width="201" height="23" rx="12" fill="#4F545C" />
    </svg>
})

function setRandomInterval(min, max) {
    let last;
    let last2;
    let last3;
    return function () {
        let random;
        do {
            random = Math.floor(Math.random() * (max - min)) + min;
        } while (random === last || random === last2 || random === last3);
        last3 = last2;
        last2 = last;
        last = random;
        return random;
    };
}