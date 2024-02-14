interface HTMLElement {
    add: (...arg0: HTMLElement[]) => this
}

// @ts-ignore
type Without<T, K> = {
    [L in Exclude<keyof T, K>]: T[L];
}

// @ts-ignore
type CreateElementOptions = {} & Element;

type SettingsConfig = {
    name?: String
}

type SectionConfig = {
    name?: String;
    id: String;
}

type OptionConfig = {
    name?: String;
    id: String;
    type: keyof OptionTypes;
}

type OptionTypes = {
    dropdown: HTMLSelectElement;
    slider: HTMLInputElement;
}


declare class Settings extends EventTarget {
    constructor(config: SettingsConfig);
    config: SettingsConfig;
    sections: Section[];
    render(): HTMLDivElement;
    getSection(id: string): Section;
    export(): String;
    dispatchEvent(event: Event): boolean;
    on(type: String, callback: Function): void;
    off(type: String, callback: Function): void;
    static loadJson(jsontext: String): Settings;
    replaceWith(settings: Settings): void;
}

declare class Section {
    constructor(config: SectionConfig);
    config: SectionConfig;
    settings_obj: Settings;
    options: Options[];
    render(): HTMLDivElement;
}

declare class Options {
    constructor(config: OptionConfig);
    config: OptionConfig;
    render(): OptionTypes[typeof this.config.type];
}

interface Window {
    /**
     * creates an element
     * @param tagName tag name of the element
     * @param options properties to set
     */
    createElement<Tag extends keyof HTMLElementTagNameMap>(tagName: Tag, options?: CreateElementOptions): HTMLElementTagNameMap[Tag];
    Settings(): Settings;
    Section: Section;
    Options(): Options;
}


interface HTMLElementTagNameMap {
    "warn": HTMLDivElement
    "error": HTMLDivElement
}