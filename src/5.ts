import { readFileSync } from 'fs';

// Extract the numbers from a string
function extractNumbers(s: String) {
    return [...s.matchAll(/[0-9]+/g)].map(m => +m[0]);
}

function A() {
    const data = readFileSync('./input/day5.txt', 'utf-8').split("\n\n")
    const rules = data[0].split("\n").map(extractNumbers)
    const updates = data[1].split("\n").map(extractNumbers)

    const total = updates.map(arr => {
        for (let i = 0; i < arr.length; i++) {
            for (let j = i; j < arr.length; j++) {
                if (rules.some(rule => rule[0] === arr[j] && rule[1] === arr[i])) {
                    return 0;
                }
            }
        }
        return arr[Math.floor(arr.length / 2)]
    }).reduce((a, b) => a + b)

    console.log(total)
}

function B() {
    const data = readFileSync('./input/day5.txt', 'utf-8').split("\n\n")
    const rules = data[0].split("\n").map(extractNumbers)
    const updates = data[1].split("\n").map(extractNumbers)

    const total = updates.map(arr => {
        let ordered = true;
        for (let i = 0; i < arr.length; i++) {
            for (let j = i; j < arr.length; j++) {
                if (rules.some(rule => rule[0] === arr[j] && rule[1] === arr[i])) {
                    ordered = false;
                }
            }
        }

        if (!ordered) {
            arr.sort((a, b) => {
                if (rules.some(rule => rule[0] === a && rule[1] === b)) {
                    return -1;
                } else if (rules.some(rule => rule[0] === b && rule[1] === a)) {
                    return 1;
                } else {
                    return 0;
                }
            })
            return arr[Math.floor(arr.length / 2)]
        }
        return 0

    }).reduce((a, b) => a + b)

    console.log(total)
}

A()
B()