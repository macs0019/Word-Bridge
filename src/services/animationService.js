export function startShakeAnimation(divRef) {
    divRef.current.classList.add("shake-animation");
    divRef.current?.addEventListener("animationend", () => {
        stopShakeAnimation(divRef);
        startPulseAnimation(divRef);
    });
}

export function startPulseAnimation(divRef) {
    if (divRef.current) {
        divRef.current.classList.add("pulse-animation");
    }
};

export function stopPulseAnimation(divRef) {
    if (divRef.current) {
        divRef.current.classList.remove("pulse-animation");
    }
};

export function stopShakeAnimation(divRef) {
    if (divRef.current) {
        divRef.current.removeEventListener("animationend", stopShakeAnimation);
        divRef.current.classList.remove("shake-animation");
    }
};