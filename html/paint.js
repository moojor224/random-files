function makePaint(width, height, scale = 1) {
    let colors = document.createElement("canvas");
    let overlay = document.createElement("canvas");
    const STYLE = `position:absolute;width:${width}px;height:${height}px;`;

    colors.style = STYLE;
    overlay.style = STYLE;
    colors.width = width * scale;
    colors.height = height * scale;
    overlay.width = width * scale;
    overlay.height = height * scale;

    let colorsCtx = colors.getContext("2d");
    let overlayCtx = overlay.getContext("2d");
    let painting = false;
    let lastX = 0;
    let lastY = 0;
    let penSize = 5;

    colorsCtx.lineWidth = penSize * scale;
    colorsCtx.lineCap = "round";
    overlayCtx.strokeStyle = "red";

    overlay.addEventListener("mousedown", (e) => {
        if (e.button == 0) {
            painting = true;
            lastX = e.offsetX * scale;
            lastY = e.offsetY * scale;
            colorsCtx.beginPath();
            colorsCtx.moveTo(lastX, lastY);
            colorsCtx.lineTo(lastX, lastY);
            colorsCtx.stroke();
        }
    });

    overlay.addEventListener("mousemove", (e) => {
        if (painting) {
            colorsCtx.beginPath();
            if (colorsCtx.strokeStyle == "rgba(0, 0, 0, 0)") {
                colorsCtx.strokeStyle = "black";
                colorsCtx.globalCompositeOperation = "destination-out";
                colorsCtx.moveTo(lastX, lastY);
                colorsCtx.lineTo(e.offsetX * scale, e.offsetY * scale);
                colorsCtx.stroke();
                colorsCtx.strokeStyle = "transparent";
            } else {
                colorsCtx.globalCompositeOperation = "source-over";
                colorsCtx.moveTo(lastX, lastY);
                colorsCtx.lineTo(e.offsetX * scale, e.offsetY * scale);
                colorsCtx.stroke();
            }
            lastX = e.offsetX * scale;
            lastY = e.offsetY * scale;
        }
        overlayCtx.beginPath();
        overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
        overlayCtx.ellipse(e.offsetX * scale, e.offsetY * scale, penSize / 2 * scale, penSize / 2 * scale, 0, 0, Math.PI * 2);
        overlayCtx.stroke();
    });

    overlay.addEventListener("mouseup", () => {
        painting = false;
    });

    overlay.addEventListener("mouseout", () => {
        painting = false;
        overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
    });

    overlay.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });
    let main = document.createElement("div");
    main.style = "display:inline-grid;grid-template-rows:auto auto";
    let canvases = document.createElement("div");
    canvases.style = `position:relative;height:${height}px;width:${width}px;border:1px solid red;`;
    canvases.append(colors, overlay);

    let toolbar = document.createElement("form");
    toolbar.onsubmit = (e) => e.preventDefault();
    toolbar.style = "grid-row:2/span 1;";
    let clear = document.createElement("button");
    clear.textContent = "Clear";
    clear.style = `background-color:white;height:30px;border:1px solid black;`;
    clear.onclick = () => {
        colorsCtx.clearRect(0, 0, colors.width, colors.height);
    };
    function makeColorButton(color) {
        let label = document.createElement("label");
        let radio = document.createElement("input");
        let button = document.createElement("button");

        label.style = "display:inline-grid;grid-template-rows:auto auto;gap:2px;";
        radio.style = "margin:0px;padding:0px;";
        radio.type = "radio";
        radio.name = "color";

        button.style = `background-color:${color};width:30px;height:30px;border:1px solid black;color:${color};user-select:none;`;
        button.textContent = ";";
        button.onclick = () => {
            radio.click();
        };
        radio.onclick = () => {
            colorsCtx.strokeStyle = color;
        }
        label.append(button, radio);
        return label;
    }
    toolbar.append(clear);
    toolbar.append(makeColorButton("red"));
    toolbar.append(makeColorButton("orange"));
    toolbar.append(makeColorButton("yellow"));
    toolbar.append(makeColorButton("green"));
    toolbar.append(makeColorButton("blue"));
    toolbar.append(makeColorButton("purple"));
    toolbar.append(makeColorButton("pink"));
    toolbar.append(makeColorButton("black"));
    toolbar.append(makeColorButton("transparent"));
    toolbar.querySelectorAll("button").forEach((button) => {
        if (button.style.backgroundColor == "black") {
            button.click();
        }
    });
    main.append(canvases);
    main.append(toolbar);
    document.body.append(main);
    return main;
}
document.body.append(makePaint(500, 500));