
/**
 * Locks the body scroll to prevent background scrolling when a modal is open.
 */
export function lockScroll() {
    document.body.style.overflow = "hidden";
}

/**
 * Unlocks the body scroll.
 */
export function unlockScroll() {
    document.body.style.overflow = "";
}
