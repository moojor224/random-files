$fn = 40;

//slicer's nozzle diameter/extrusion width
nozzle_diameter = 0.6;
//slicer's layer height
layer_height = 0.2;

//number of rows
num_rows = 2;
//number of columns
num_cols = 2;

//the inner front/back length of each compartment
row_height = 25;
//the inner left/right width of each compartment
column_width = 25;
//the inner vertical depth of the container
depth = 15;
//number of layers the base has
base_layers = 4;
//gap between walls. this should be as small as possible without your slicer ignoring the gap
gap = 0.1;

//whether to alternate gaps to increase strength.<br>WARNING: this significantly increases render time, but shouldn't have any affect on the print time
alternate_gaps = true;

//whether to add scoops
enable_scoops = true;
front_scoops = true;
back_scoops = true;

//length of the scoop from the wall to the tip of the scoop. this should be <= row_height / 2. value will be reduced if it is too large
scoop_length = 6; // should be <= row_height / 2

// don't edit anything below this line

// helper validation functions
function limit(val, min, max) = (val >= min && val <= max) ? true : false;
function isPositive(val) = (val > 0) ? true : false;
function isInteger(val) = (val == floor(val)) ? true : false;
function isPositiveInteger(val) = (val > 0 && isInteger(val)) ? true : false;
function isBoolean(val) = (val == true || val == false) ? true : false;
function assertMsg(msg, val) = str("invalid value for ", msg, ": ", str(val), ".");

// validate input data
assert(isPositive(nozzle_diameter), assertMsg("nozzle_diameter", nozzle_diameter));
assert(isPositive(layer_height), assertMsg("layer_height", layer_height));
assert(isPositiveInteger(num_rows), assertMsg("num_rows", num_rows));
assert(isPositiveInteger(num_cols), assertMsg("num_cols", num_cols));
assert(isPositive(row_height), assertMsg("row_height", row_height));
assert(isPositive(column_width), assertMsg("column_width", column_width));
assert(isPositive(depth), assertMsg("depth", depth));
assert(isPositiveInteger(base_layers), assertMsg("base_layers", base_layers));
assert(isPositive(gap), assertMsg("gap", gap));
assert(isBoolean(alternate_gaps), assertMsg("alternate_gaps", alternate_gaps));
assert(isBoolean(enable_scoops), assertMsg("enable_scoops", enable_scoops));
assert(isBoolean(front_scoops), assertMsg("front_scoops", front_scoops));
assert(isBoolean(back_scoops), assertMsg("back_scoops", back_scoops));
assert(limit(scoop_length, 0, row_height / 2), assertMsg("scoop_length", scoop_length));


wall = nozzle_diameter * 2;

// shorthand variables
w = column_width;
h = row_height;
c = round(num_cols);
r = round(num_rows);
d = depth;
b = round(base_layers) * layer_height;
l = layer_height;
g = gap;
sl = min(scoop_length, row_height / 2); // scoop length

total_width = w * c + wall * (c + 1); // overall width of the container
total_height = h * r + wall * (r + 1); // overall height of the container


difference() {
    // make base cube
    cube([total_width, total_height, d + b]);
    for (x = [0 : c - 1]) {
        for (y = [0 : r - 1]) {
            translate([wall + x * (w + wall), wall + y * (h + wall), b]) {
                difference() {
                    // base hole for each compartment
                    cube([w, h, d]);
                    if (enable_scoops) {
                        if (front_scoops) {
                            translate([0, sl, d]) {
                                // scoop
                                difference() {
                                    translate([0, -sl, -d]) {
                                        cube([w, sl, d]);
                                    }
                                    rotate([0,90]) {
                                        scale([d, sl, 1]) {
                                            cylinder(r=1, h=w);
                                        }
                                    }
                                }
                            }
                        }
                        if (back_scoops) {
                            translate([0, h - sl, d]) {
                                // scoop
                                difference() {
                                    translate([0, 0, -d]) {
                                        cube([w, sl, d]);
                                    }
                                    rotate([0,90]) {
                                        scale([d, sl, 1]) {
                                            cylinder(r=1, h=w);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if(alternate_gaps) {
            // alternate caps left/right on every other layer
            for (z = [0 : ceil(depth / layer_height)]) {
                if (z % 2 == 0) {
                    translate([wall + x * (w + wall), 0, b + z * layer_height]) {
                        cube([g, total_height - wall - sl, layer_height]);
                    }
                } else {
                    translate([(x + 1) * (w + wall) - g, 0, b + z * layer_height]) {
                        cube([g, total_height - wall - sl, layer_height]);
                    }
                }
            }
        } else {
            // make one big gap
            translate([wall + x * (w + wall), 0, b]) {
                cube([g, total_height - wall - sl, d]);
            }
        }
    }
}
