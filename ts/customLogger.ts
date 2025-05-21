type LoggerOptions = Partial<{
    type: "log" | "info" | "warn" | "error";
    baseStyle: string;
    prefix: Partial<{
        enabled: boolean;
        text: string;
        style: string;
    }>;
    brackets: Partial<{
        left: string;
        right: string;
        style: string;
        enabled: boolean;
    }>;
    shouldLog: () => boolean;
}>;
const defaultLoggerOptions: LoggerOptions = {
    type: "log",
    prefix: {
        enabled: false,
        text: "LOG",
        style: "background-color:#7c7c7c;color:white;border-radius:2px;padding:2px;"
    },
    baseStyle: "",
    brackets: {
        left: "[",
        right: "]",
        style: "color:#f0f;font-weight:bold;",
        enabled: false
    },
    shouldLog: () => true
}

function copyObject<T>(obj: T): T {
    const copy = {} as T;
    for (const key in obj) {
        if (typeof obj[key] == "object" && obj[key] !== null) {
            copy[key] = copyObject(obj[key]);
        } else {
            copy[key] = obj[key];
        }
    }
    return copy;
}

function deepExtend(source: any, target: any): typeof source & typeof target {
    for (const key in source) {
        if (target[key] instanceof Object && key in target) {
            target[key] = deepExtend(source[key], target[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}
function complete<A>(a: Partial<A>): A {
    return a as A;
}
const regex = /(?<embed>%[oOdisfc])|(?<raw>(?:[^%]|%[^oOdisfc]|%$)+)/g;
export function customLogger(options: LoggerOptions = defaultLoggerOptions) {
    options = deepExtend(options, copyObject(defaultLoggerOptions));
    const {
        prefix: {
            enabled: enablePrefix,
            text: prefixText,
            style: prefixStyle
        },
        type,
        baseStyle,
        brackets: {
            enabled: enableBrackets,
            left: leftBracket,
            right: rightBracket,
            style: bracketsStyle
        },
        shouldLog
    } = complete(options);
    // pre-parse as much as possible to reduce overhead
    const builder = {
        prefix: enablePrefix ? `%c${prefixText}%c ` : "",
        prefixStyle: enablePrefix ? [prefixStyle, baseStyle] : [],
        leftBracket: enableBrackets ? `%c${leftBracket}%c` : "",
        rightBracket: enableBrackets ? `%c${rightBracket}%c` : "",
        bracketStyle: enableBrackets ? [bracketsStyle, baseStyle] : []
    };
    function parse(args: any[]) {
        if (typeof args[0] !== "string") args.unshift(builder.prefix);
        else args[0] = builder.prefix + args[0];

        const first_arg: string = args.shift();
        const rest_args = builder.prefixStyle.concat([...args]);
        const matches = [...first_arg.matchAll(regex)];
        const first_arg_result: string[] = [];
        const rest_arg_result: any[] = [];

        matches.forEach((match) => {
            const { embed, raw } = match.groups!;
            if (embed) {
                const has_next_embded = rest_args.length > 0;
                const next_embed = rest_args.shift();
                if (embed === "%c") {
                    first_arg_result.push(embed);
                    if (has_next_embded) {
                        rest_arg_result.push(next_embed);
                    }
                } else {
                    first_arg_result.push(builder.leftBracket, embed, builder.rightBracket);
                    rest_arg_result.push(...builder.bracketStyle.concat([next_embed]).concat(builder.bracketStyle));
                }
            } else if (raw) {
                first_arg_result.push(raw);
            }
        });

        // if (first_arg_result.length > 0 && first_arg_result[0].length === 0) first_arg_result.shift();
        const header = first_arg_result.join("");
        const others = rest_arg_result.concat(rest_args);
        if (first_arg_result.length === 0) { return others; }
        return ["%c" + header].concat([baseStyle], others);
    }
    return function (...args: Parameters<typeof console.log>) {
        if (!shouldLog()) return;
        console[type](...parse(args));
    }
}