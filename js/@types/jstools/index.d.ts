// @ts-ignore
type Dayjs = import("dayjs").Dayjs; // use this format to prevent index.d.ts from breaking

// @ts-ignore
// interface HTMLElement{
//     add: (...arg0: HTMLElement[]) => this
// }

type Without<T, K> = {
    [L in Exclude<keyof T, K>]: T[L];
}

type SettingsConfig = {
    name?: String
}

type SectionConfig = {
    name?: String;
    id: String;
}

type OptionConfig = {
    name?: String;
    value: String;
    values: String[];
    id: String;
    type: keyof OptionTypes;
}

type OptionTypes = {
    "dropdown": HTMLSelectElement;
    "slider": HTMLInputElement;
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
    input: HTMLElement;
    section_obj: Section;
    config: OptionConfig;
    constructor(config: OptionConfig);
    get value(): String;
    set value(val: String);
    render(): HTMLLabelElement;
    createInput(): OptionTypes[keyof OptionTypes];
    dispatchEvent(event: Event): Boolean;
    on(type: string, callback: Function): void;
    off(type: string, callback: Function): void;
}

declare class Tab extends EventTarget {
    tab: HTMLTabElement;
    tabHead: HTMLDivElement;
    tabBody: HTMLDivElement;
    index: Number;
    constructor(title: String, active: Boolean);
    close(): void;
    on(type: String, callback: Function): void;
    off(type: String, callback: Function): void;
}

// type CreateElementOptions<T> = {} & T;

interface Window {
    Settings: Settings;
    Section: Section;
    Options: Options;
    Tab: Tab;
}

type HTMLTabElement = HTMLDivElement;
type HTMLWarnElement = HTMLDivElement;
type HTMLErrorElement = HTMLDivElement;


interface HTMLElementTagNameMap {
    "warn": HTMLWarnElement
    "error": HTMLErrorElement
    "tab": HTMLTabElement
}