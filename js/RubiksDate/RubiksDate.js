import { AMOUNTS, CONVERSIONS, DAYS, MONTHS } from "./constants.js";
export let RubiksDate = (function () {
    const immutable = true;

    function unabbreviate(interval) {
        if (interval === undefined || interval === null) interval = "ms";
        interval = ((typeof interval == "string") ? interval : ("" + interval)).toLowerCase().trim();

        if (interval != "ms" && endsWith(interval, "s")) {
            interval = interval.substring(0, interval.length - 1);
        }

        for (let e in CONVERSIONS) {
            if (CONVERSIONS[e].includes(interval)) {
                console.log("e", e);
                interval = e;
                return e;
            }
        }
        return interval;
    }

    function endsWith(string, look) {
        let split = string.split("");
        split = split.slice(split.length - look.length, look.length).join("");
        return split === look;
    }

    class RubiksDate {
        /**
         * @type {Date}
         */
        _d;

        constructor(...date) {
            if (date.length == 0) date = [new Date()];
            this._d = new Date(...date);
        }

        clone() {
            return new RubiksDate(this._d);
        }

        /**
         * add an amount of time to the date
         * @param {Number} amount amount of time to add
         * @param {String} interval type of time to add
         */
        add(amount, interval) {
            interval = unabbreviate(interval);
            let clone = immutable ? this.clone() : this;
            let milliseconds = AMOUNTS[interval];
            if (milliseconds === undefined) {
                switch (interval) {
                    case "month":
                        clone._d.setMonth(clone._d.getMonth() + amount);
                        let yr = clone._d.getFullYear();
                        let mo = clone._d.getMonth() + 1 + amount;
                        while (mo > 12) {
                            mo -= 12;
                            yr++;
                        }
                        clone = new RubiksDate(`${yr}/${mo}/${clone._d.getDate()} ${clone._d.getHours()}:${clone._d.getMinutes()}:${clone._d.getSeconds()}.${clone._d.getMilliseconds()}`)
                        break;
                    case "year":
                        clone._d.setFullYear(clone._d.getFullYear() + amount);
                        break;
                }
            } else {
                clone._d.setTime(clone._d.getTime() + (milliseconds * amount));
            }
            return clone;
        }

        /**
         * subtracts an amount of time from the date
         * @param {Number} amount amount of time to subtract
         * @param {String} interval type of time to subtract
         */
        subtract(amount, interval) { return this.add(-amount, unabbreviate(interval)); }

        startOf(interval, end = false) {
            interval = unabbreviate(interval);
            console.log(interval);
            let clone = immutable ? this.clone() : this;
            switch (interval) {
                case "month":
                    clone._d.setDate(end ? 32 : 1); // skip to day in next month
                    clone._d.setDate(end ? 0 : 1); // go back to 1 day before first day of month
                case "day": clone._d.setHours(end ? 23 : 0);
                case "hour": clone._d.setMinutes(end ? 59 : 0);
                case "minute": clone._d.setSeconds(end ? 59 : 0);
                case "second": clone._d.setMilliseconds(end ? 999 : 0); break;
                case "week":
                    clone._d.setDate(clone._d.getDate() + (end ? (6 - clone._d.getDay()) : (-1 * clone._d.getDay())));
                    clone = clone[end ? "endOf" : "startOf"]("day");
                    break;
                case "year":
                    clone._d.setMonth(end ? 11 : 0);
                    clone = clone[end ? "endOf" : "startOf"]("month");
                    break;
            }
            return clone;
        }

        endOf(interval) { return this.startOf(interval, true); }

        set(interval, amount) {
            let clone = immutable ? this.clone() : this;
            interval = unabbreviate(interval);

            switch (interval) {
                case "time": clone._d.setTime(amount); break;
                case "millisecond": clone._d.setMilliseconds(amount); break;
                case "minute": clone._d.setMinutes(amount); break;
                case "second": clone._d.setSeconds(amount); break;
                case "hour": clone._d.setHours(amount); break;
                case "date": clone._d.setDate(amount); break;
                // case "day": clone._d.setDate(amount); break;
                case "month": clone._d.setMonth(amount); break;
                case "quarter":
                    clone = clone.add(3 * (amount - clone.quarter()), "month");
                    break;
                case "year": clone._d.setFullYear(amount); break;
            }
            return clone;
        }
        month(amount) {
            if (amount != undefined)
                return this._d.getMonth();
        }
        quarter(amount) {
            if (amount != undefined)
                return Math.ceil((this._d.getMonth() + 1) / 3);
            else return this.set("quarter", amount)
        }
    }
    ["time", "milliseconds", "seconds", "minutes", "hours", "date", "day"].forEach(e => {
        RubiksDate.prototype[e] = function (amount) {
            if (amount != undefined) return this._d["get" + (e == "year" ? "Full" : "") + e.split("").pop().toUpperCase() + e.substring(1)]();
            else return this.set(e, amount);
        }
    });
    window.RubiksDate = RubiksDate;
    return RubiksDate;
})();