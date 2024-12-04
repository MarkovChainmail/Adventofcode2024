import { readFileSync } from "fs";

// Extract the numbers from a string
function extractMuls(s: String) {
    return [...s.matchAll(/mul\([0-9]+,[0-9]+\)/g)];
}

function extractNumbers(s: String) {
    return [...s.matchAll(/[0-9]+/g)].map(m => +m[0]);
}

function A() {
    const muls = extractMuls(readFileSync('./input/day3.txt', 'utf-8')).map(s => extractNumbers(s[0])).map(t => t[0] * t[1]).reduce((a, b) => a + b);
    console.log(muls);
}

function AOneliner() {
    import('fs').then((fs) => console.log([...fs.readFileSync('./input/day3.txt', 'utf-8').matchAll(/mul\([0-9]+,[0-9]+\)/g)].map(s => [...s[0].matchAll(/[0-9]+/g)].map(m => +m[0])).map(t => t[0] * t[1]).reduce((a, b) => a + b)));
}

function extractdosanddonts(s: String) {
    return [...s.matchAll(/don't|do/g)]
}

function do_or_dont(dosanddonts: RegExpExecArray[], index: number) {
    const filtered = dosanddonts.filter(e => e.index < index)
    if (filtered.length == 0) {
        return true
    } else {
        if (filtered[filtered.length-1][0] === "do") {
            return true
        } else {
            return false
        }
    }
}

function B() {
    const file = readFileSync('./input/day3.txt', 'utf-8')
    const dosanddonts = extractdosanddonts(file)
    const muls = extractMuls(file).filter(m => do_or_dont(dosanddonts, m.index))
    const sum = muls.map(s => extractNumbers(s[0])).map(t => t[0] * t[1]).reduce((a, b) => a + b);
    console.log(sum)
}

A()
B()