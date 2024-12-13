import { readFileSync } from "fs"
import { lusolve, MathNumericType, round, subtract, abs, number, dot, sum, bignumber, map, matrix } from "mathjs"

function extractNumbers(s: String) {
    return [...s.matchAll(/[0-9]+/g)].map(m => +m[0]);
}

// The naive solution
function runButtons(variables: number[]) {
    const Abutton = [variables[0], variables[1]]
    const Bbutton = [variables[2], variables[3]]
    const prize = [variables[4], variables[5]]
    let minTokens = Number.MAX_VALUE;
    for (let a = 0; a < 100; a++) {
        let tokens = a*3;
        let pos = [a*Abutton[0],a*Abutton[1]]
        let b = 0;
        while (pos[0] <= prize[0] && pos[1] <= prize[1] && b <= 100 && tokens < minTokens) {
            if (pos[0] == prize[0] && pos[1] == prize[1] && tokens < minTokens) {
                minTokens = tokens
            }
            pos = [pos[0]+Bbutton[0], pos[1]+Bbutton[1]]
            tokens++;
            b++;
        }
    }
    return minTokens
}

function A() {
    let data = readFileSync('./input/day13.txt', 'utf-8').split("\n\n")

    console.log(data.map(extractNumbers).map(runButtons).filter(n => n < Number.MAX_VALUE).reduce((a,b) => a+b))
}

// The linear algebra solution
function solve(variables: number[]) {
    const buttons = matrix([[bignumber(variables[0]), bignumber(variables[2])], [bignumber(variables[1]), bignumber(variables[3])]])
    const target = matrix([bignumber(variables[4]).add(bignumber(10000000000000)), bignumber(variables[5]).add(bignumber(10000000000000))])

    return lusolve(buttons, target)
}

function conditionalParseInt(n: number) {
    const parsed = round(n)
    const delta = number(0.00001)
    if(abs(subtract(parsed, n)) < delta || abs(subtract(n, parsed)) < delta) {
        return parsed
    } else {
        return bignumber(0);
    }
}

function B() {
    let data = readFileSync('./input/day13.txt', 'utf-8').split("\n\n")
    console.log(sum(data.map(extractNumbers).map(solve).map(res => dot(res, [3, 1])).map(conditionalParseInt))) //.map(res => map(res, conditionalParseInt)).map(res => res.get([0, 0])))
    //.map(solution => solution.map(conditionalParseInt)).map(res => dot(res, [3, 1])
}

A()
B()