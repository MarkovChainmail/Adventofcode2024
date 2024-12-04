import { readFileSync } from 'fs';

// Extract the numbers from a string
function extractNumbers(s: String) {
    return [...s.matchAll(/[0-9]+/g)].map(m => +m[0]);
}

function A() {
    const numbers = readFileSync('./input/day1.txt', 'utf-8').split("\n").map(extractNumbers);
    const transposed = numbers.reduce<number[][]>((a, b) => [[...a[0], b[0]], [...a[1], b[1]]], [[], []]);
    
    const sortedA = transposed[0].sort();
    const sortedB = transposed[1].sort();
    
    const zipped = sortedA.map((k, i) => [k, sortedB[i]]);
    console.log(zipped.map(tuple =>
        Math.abs(tuple[0] - tuple[1])
    ).reduce((a, b) => a + b));
}

function B() {
    const numbers = readFileSync('./input/day1.txt', 'utf-8').split("\n").map(extractNumbers);
    const transposed = numbers.reduce<number[][]>((a, b) => [[...a[0], b[0]], [...a[1], b[1]]], [[], []]);
    
    const similarities = transposed[0].map(s => s * transposed[1].filter(n => n == s).length)
    
    console.log(similarities.reduce((a, b) => a + b));
}

A()
B()