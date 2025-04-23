/*
this file contains various tools for working with IR signals, such as those that come from TV remotes
raw IR data is stored as a series of 1s and 0s, with 1 being high (IR LED on) and 0 being low (IR LED off)
*/
const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ#$";
const byte_length = 6;
/**
 * @param {string} binary 
 */
function encode(binary) {
    if (binary.match(/[^01]/)) {
        throw new Error("Input must be a binary string (only 0s and 1s allowed), found: " + binary[binary.indexOf(/[^01]/)]);
    }
    return binary
        .padStart(Math.ceil(binary.length / byte_length) * byte_length, "0") // pad to multiple of {byte_length} bits
        .match(new RegExp(`.{${byte_length}}`, "g")) // split into sections of {byte_length} bits
        .map(function (byte) {
            const result = chars[parseInt(byte, 2)].padStart(1, "0");
            return result;
        })
        .join("");
}
/**
 * @param {string} compact 
 */
function decode(compact) {
    if (compact.match(/[^0-9a-zA-Z#$]/)) {
        throw new Error("Input must be a valid string, found invalid character: " + compact[compact.indexOf(compact.match(/[^0-9a-zA-Z#$]/)[0])]);
    }
    const result = compact
        .padStart(Math.ceil(compact.length / 1) * 1, "0")
        .match(/./g)
        .map(function (comp) {
            const result = chars.indexOf(comp).toString(2).padStart(6, "0");
            return result;
        })
        .join("");
    return result.substring(result.indexOf("1")); // remove leading zeros
}

/**
 * generate random sequence of 0s and 1s
 */
function randomBinary(length) {
    let binary = "";
    for (let i = 0; i < length; i++) {
        binary += Math.random() < 0.5 ? "0" : "1"; // randomly append 0 or 1
    }
    return binary;
}

// testing
const a = "11010101100011101011010101110110000001111111100000001001110011110001101100101011100100000011111101010011101010011000101001111110";
const b = encode(a);
const c = decode(b);
console.log(a);
console.log(b);
console.log(c);
console.log(a == c); // should be true