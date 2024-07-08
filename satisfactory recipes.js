import { createElement } from "./js/synced/jstools/index.js";

class Node {
    text = "";
    nodes = [];
    constructor(text) {
        this.text = text;
        return this;
    }
    addNode(...nodes) {
        this.nodes.push(...nodes.filter(e => e instanceof Node));
        return this;
    }
    render(top = true) {
        let a = createElement("li").add(createElement("code", { innerHTML: this.text }));
        if (this.nodes.length > 0) {
            a.add(createElement("ul").add(...this.nodes.map(e => e.render(false))));
        }
        if (top) {
            return createElement("ul", { classList: "tree" }).add(a);
        }
        return a;
    }
}
class Resource {
    constructor(data) {
        this.ingredients = data.ingredients || [];
        this.rate = data.rate || [];
        this.amount = data.amount || 1;
        this.name = data.name || "unknown name";
        this.tier = (() => {
            if (this.ingredients.length == 0) {
                return 1;
            }
            return ((arr) => {
                var max = 0;
                arr.forEach(e => {
                    if (e > max) { max = e; }
                });
                return max + 1;
            })(this.ingredients.map(e => (e[1].tier || 0)));
        })();
    }
}

function show(resource, amount, parent, totals) {
    let node = new Node(`${Math.round(amount * 1000) / 1000} ${resource.name}`);
    totals.set(resource, (totals.get(resource) || 0) + amount);
    resource.ingredients.forEach(ing => {
        show(ing[1], (ing[0] / resource.amount) * amount, node, totals);
    });
    parent.addNode(node);
    return parent;
}

function makeTree(resource, amount) {
    let totals = new Map();
    let craftingTree = show(resource, amount, new Node("crafting tree"), totals).nodes[0].render();
    console.log(Array.from(totals));
    let div = createElement("div", {
        classList: "crafting-tree"
    }).add(
        craftingTree,
        createElement("table").add(
            ...(a => {
                let arr = a;
                let maxTier = arr[0][0].tier;
                console.log("max tier", maxTier);
                for (let t = 1; t <= maxTier; t++) {
                    for (let r = 0; r < arr.length; r++) {
                        if (arr[r][0].tier == t) {
                            arr = [
                                ...arr.slice(0, r),
                                (ar => {
                                    let arr2 = ar;
                                    if (maxTier == t) {
                                        arr2.push("amount", "buildings needed");
                                    } else {
                                        arr2.push(...new Array(3 - arr2.length).fill(""));
                                    }
                                    return arr2;
                                })([`<h2>tier ${t} items</h2>`]),
                                ...arr.slice(r)
                            ];
                            break;
                        }
                    }
                }
                console.log("final arr", arr);
                return arr.map(r => {
                    if (r[0] instanceof Resource && r[0].rate.length > 0) {
                        let rate = Math.round(r[1] / r[0].rate[1] * 1000) / 1000;
                        return [...r, `${rate}x ${r[0].rate[0]}`];
                    }

                    return [...r, ...new Array(3 - r.length).fill("")];
                });
            })(Array.from(totals).sort(function (a, b) {
                return a[0].tier < b[0].tier ? 1 : a[0].tier > b[0].tier ? -1 : 0
            })).map(r => createElement("tr").add(...r.map(c => createElement("td", {
                innerHTML: c.name ? (c.name) : c
            }))))
        )
    );
    return div;
}

let ironOre = new Resource({ name: "Iron Ore" });
let copperOre = new Resource({ name: "Copper Ore" });
let cateriumOre = new Resource({ name: "Caterium Ore" });
let limestone = new Resource({ name: "Limestone" });
let coal = new Resource({ name: "Coal" });
let ironIngot = new Resource({
    name: "Iron Ingot",
    ingredients: [[1, ironOre]],
    amount: 1,
    rate: ["smelter", 30],
});
let copperIngot = new Resource({
    name: "Copper Ingot",
    ingredients: [[1, copperOre]],
    amount: 1,
    rate: ["", 1],
});
let cateriumIngot = new Resource({
    name: "Caterium Ingot",
    ingredients: [[3, cateriumOre]],
    amount: 1,
});
let concrete = new Resource({
    name: "Concrete",
    ingredients: [[3, limestone]],
    amount: 1,
});
let ironRod = new Resource({
    name: "Iron Rod",
    ingredients: [[1, ironIngot]],
    amount: 1,
    rate: ["constructor", 15],
});
let screw = new Resource({
    name: "Screw",
    ingredients: [[1, ironRod]],
    amount: 4,
    rate: ["constructor", 40],
});
let rotor = new Resource({
    name: "Rotor",
    ingredients: [[5, ironRod], [25, screw]],
    amount: 1,
    rate: ["assembler", 4],
});
let ironPlate = new Resource({
    name: "Iron Plates",
    ingredients: [[3, ironIngot]],
    amount: 2,
    rate: ["constructor", 20],
});
let reinforcedIronPlate = new Resource({
    name: "Reinforced Iron Plates",
    ingredients: [[6, ironPlate], [12, screw]],
    amount: 1,
    rate: ["assembler", 5],
});
let modularFrame = new Resource({
    name: "Modular Frames",
    ingredients: [[12, ironRod], [3, reinforcedIronPlate]],
    amount: 2,
    rate: ["assembler", 2],
});
let steelIngot = new Resource({
    name: "Steel Ingot",
    ingredients: [[1, ironOre], [1, coal]],
    amount: 1,
    rate: ["foundry", 45],
});
let steelBeam = new Resource({
    name: "Steel Beam",
    ingredients: [[4, steelIngot]],
    amount: 1,
    rate: ["constructor", 15]
});
let versatileFramework = new Resource({
    name: "Versatile Framework",
    ingredients: [[12, steelBeam], [1, modularFrame]],
    amount: 2,
    rate: ["assembler", 5],
});
let smartPlating = new Resource({
    name: "Smart Plating",
    ingredients: [[1, reinforcedIronPlate], [1, rotor]],
    amount: 1,
});
let rebarGun = new Resource({
    name: "Rebar Gun",
    ingredients: [[6, reinforcedIronPlate], [16, ironRod], [100, screw]],
    amount: 1,
});
let steelPipe = new Resource({
    name: "Steel Pipe",
    ingredients: [[3, steelIngot]],
    amount: 2,
    rate: ["constructor", 20],
});
let encasedIndustrialBeam = new Resource({
    name: "Encased Industrial Beam",
    ingredients: [[4, steelBeam], [5, concrete]],
    amount: 1,
});
let heavyModularFrame = new Resource({
    name: "Heavy Modular Frame",
    ingredients: [[5, modularFrame], [15, steelPipe], [5, encasedIndustrialBeam], [100, screw]],
    amount: 1,
    rate: ["manufacturer", 2],
});
let wire = new Resource({
    name: "Wire",
    ingredients: [[1, copperIngot]],
    amount: 2,
    rate: ["constructor", 30],
});
let stator = new Resource({
    name: "Stator",
    ingredients: [[3, steelPipe], [8, wire]],
    amount: 1,
    rate: ["assembler", 5],
});
let motor = new Resource({
    name: "Motor",
    ingredients: [[2, stator], [2, rotor]],
    amount: 1,
    rate: ["assembler", 5],
});
let cable = new Resource({
    name: "Cable",
    ingredients: [[1, wire]],
    amount: 1,
    rate: ["constructor", 30]
});
let automatedWiring = new Resource({
    name: "Automated Wiring",
    ingredients: [[1, stator], [20, cable]],
    amount: 1,
    rate: ["assembler", 2.5]
});
document.body.append(makeTree(heavyModularFrame, 1));
document.body.append(makeTree(versatileFramework, 1));