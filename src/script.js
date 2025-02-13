const input = document.getElementById("in");
const output = document.getElementById("out");

const rButton = document.getElementById("rButton");

input.addEventListener("input", changed);
rButton.addEventListener("change", changed);

const type = document.getElementsByName("type");

function changed() {
    let text = input.value;
    let retText = "";

    let selectedTypeId;
    for (let i = 0; i < type.length; i++) {
        if (type.item(i).checked) {
            selectedTypeId = type.item(i).id;
        }
    }

    for (let i = 0; i < text.length; i++) {
        // upper
        if (0x0041 <= text.codePointAt(i) && text.codePointAt(i) <= 0x005A) {
            retText += convert(text[i], selectedTypeId, 0);
            continue;
        }

        // lower
        if (0x0061 <= text.codePointAt(i) && text.codePointAt(i) <= 0x007A) {
            retText += convert(text[i], selectedTypeId, 1);
            continue;
        }

        // num
        if (0x0030 <= text.codePointAt(i) && text.codePointAt(i) <= 0x0039) {
            retText += convert(text[i], selectedTypeId, 2);
            continue;
        }

        retText += text[i];
    }

    output.textContent = retText;
}

const TYPES = {
    // "id": [upper, lower, number, exception]
    "normal": [0x1D5A0, 0x1D5BA, 0x1D7E2, false],
    "typewriter": [0x1D670, 0x1D68A, 0x1D7F6, false],
    "bold1": [0x1D400, 0x1D41A, 0x1D7CE, false],
    "bold2": [0x1D5D4, 0x1D5EE, 0x1D7EC, false],
    "italic1": [0x1D434, 0x1D44E, null, false],
    "italic2": [0x1D608, 0x1D622, null, false],
    "boldItalic1": [0x1D468, 0x1D482, null, false],
    "boldItalic2": [0x1D63C, 0x1D656, null, false],
    "cursive": [0x1D49C, 0x1D4B6, null, false],
    "boldCursive": [0x1D4D0, 0x1D4EA, null, false],
    "gothic1": [0x1D504, 0x1D51E, null, false],
    "boldGothic": [0x1D56C, 0x1D586, null, false],
    "doubled": [0x1D538, 0x1D552, 0x1D7D8, false],
    "small": [0x1F1E6, 0x1F1E6, 0x2080, false],
    "bracket": [0x1F110, 0x249C, 0x2473, true], // num:0=null
    "circled1": [0x24B6, 0x24D0, 0x245F, true], // num:0=0x24EA⓪
    "circled2": [0x1F150, 0x1F150, 0x2789, true], // num:0=0x24FF⓿
    "square1": [0x1F130, 0x1F130, null, false],
    "square2": [0x1F170, 0x1F170, null, false]
}

function convert(chr, id, convertCode) {
    try {
        let codePoint = chr.codePointAt(0);
        switch (convertCode) {
            case 0:
                codePoint -= 0x41;
                break;
            case 1:
                codePoint -= 0x61;
                break;
            case 2:
                codePoint -= 0x30;
                break;
            default:
                throw new Error("illegal convertCode");
        }
        if (TYPES[id][3] === true) {
            if (id === "bracket" && convertCode === 2) {
                if (codePoint === 0) {
                    return 0;
                }
            }
            if (id === "circled1" && convertCode === 2) {
                if (codePoint === 0) {
                    return String.fromCodePoint(0x24EA);
                }
            }
            if (id === "circled2" && convertCode === 2) {
                if (codePoint === 0) {
                    return String.fromCodePoint(0x24FF);
                }
            }
        }

        if (TYPES[id][convertCode] === null) {
            return chr;
        }
        codePoint += TYPES[id][convertCode];
        return String.fromCodePoint(codePoint);
    } catch (error) {
        return chr;
    }
}

function clipboardCopy() {
    const text = document.getElementById("out");
    console.log(text.value);
    navigator.clipboard.writeText(text.value);
}