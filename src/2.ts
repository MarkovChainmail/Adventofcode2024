import { readFileSync } from "fs";

function extractNumbers(s: String) {
    return [...s.matchAll(/[0-9]+/g)].map(m => +m[0]);
}

function isSafe(l: number[]) {
    const distances = l.slice(1).map((k, i) => k - l[i]);
    if (distances.filter(n => Math.abs(n) > 3 || Math.abs(n) < 1).length > 0) {
        return false
    } else {
        // All positive OR all negative
        const over0 = distances.filter(n => n > 0).length
        return over0 == 0 || over0 == distances.length
    }
}

function A() {
    const numbers = readFileSync('./input/day2.txt', 'utf-8').split("\n").map(extractNumbers);
    const safe = numbers.filter(isSafe);
    console.log(safe.length);
}

function isSafeWithTolerance(l: number[]) {
    if (isSafe(l)) {
        return true
    } else {
        for (let i = 0; i < l.length; i++) {
            if (isSafe(l.toSpliced(i, 1))) {
                return true
            }
        }
        return false
    }
}

function B() {
    const numbers = readFileSync('./input/day2.txt', 'utf-8').split("\n").map(extractNumbers);
    const safe = numbers.filter(isSafeWithTolerance);
    console.log(safe.length);
}

A()
B()