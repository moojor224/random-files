interface HTMLElement {
    add: (...arg0: HTMLElement[]) => this
}

// @ts-ignore
type Without<T, K> = {
    [L in Exclude<keyof T, K>]: T[L];
}

// @ts-ignore
type CreateElementOptions = {} & Element;

interface Window {
    /**
     * creates an element
     * @param tagName tag name of the element
     * @param options properties to set
     */
    createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: CreateElementOptions): HTMLElementTagNameMap[K];
}

interface HTMLElementTagNameMap {
    "warn": HTMLDivElement
    "error": HTMLDivElement
}