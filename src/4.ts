import { readFileSync } from "fs";

function get(i: number, j: number, lines: string[]) {
    if (i >= lines.length || i < 0) {
        return undefined;
    } else if (j > lines[i].length || j < 0) {
        return undefined;
    } else {
        return lines[i][j]
    }
}

function A() {
    const file = readFileSync('./input/day4.txt', 'utf-8')
    const lines = file.split('\n')

    let XMAS = 0
    
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines[i].length; j++) {
            if (lines[i][j] == "X") {

                const directions = [
                    [get(i+1,j,lines), get(i+2,j,lines), get(i+3,j,lines)], //forwards (horizontal)
                    [get(i-1,j,lines), get(i-2,j,lines), get(i-3,j,lines)], // backwards (horizontal)
                    [get(i,j+1,lines), get(i,j+2,lines), get(i,j+3,lines)], // forwards (vertical)
                    [get(i,j-1,lines), get(i,j-2,lines), get(i,j-3,lines)], // backwards (vertical)
                    [get(i+1,j+1,lines), get(i+2,j+2,lines), get(i+3,j+3,lines)], // forwards, forwards, diagonal
                    [get(i+1,j-1,lines), get(i+2,j-2,lines), get(i+3,j-3,lines)], // forwards, backwards, diagonal
                    [get(i-1,j+1,lines), get(i-2,j+2,lines), get(i-3,j+3,lines)], // backwards, forwards, diagonal
                    [get(i-1,j-1,lines), get(i-2,j-2,lines), get(i-3,j-3,lines)] // backwards, backwards, diagonal
                ]

                const count = directions.filter(suffix => suffix[0] === 'M' && suffix[1] === 'A' && suffix[2] == 'S')
                XMAS += count.length
            }
        }
    }

    console.log(XMAS)
}

function isMas(mas: (string | undefined)[]) {
    return (mas[0] === 'M' && mas[1] === 'A' && mas[2] == 'S') || (mas[0] === 'S' && mas[1] === 'A' && mas[2] === 'M')
}

function B() {
    const file = readFileSync('./input/day4.txt', 'utf-8')
    const lines = file.split('\n')

    let XMAS = 0
    
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines[i].length; j++) {
            if (lines[i][j] == "M" || lines[i][j] == "S") {

                const directions = [
                    [[get(i,j,lines), get(i+1,j+1,lines), get(i+2,j+2,lines)], [get(i+2,j,lines), get(i+1,j+1,lines), get(i,j+2,lines)]]
                ]

                const count = directions.filter(diagonal => isMas(diagonal[0]) && isMas(diagonal[1]))
                XMAS += count.length
            }
        }
    }

    console.log(XMAS)
}

A()
B()