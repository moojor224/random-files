// @ts-ignore
type Dayjs = import("dayjs").Dayjs; // use this format to prevent index.d.ts from breaking

// @ts-ignore
// interface HTMLElement{
//     add: (...arg0: HTMLElement[]) => this
// }

type Without<T, K> = {
    [L in Exclude<keyof T, K>]: T[L];
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

declare class Section {
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
