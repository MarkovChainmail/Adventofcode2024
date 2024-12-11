import { readFileSync } from "fs"

function blink(stone: string) {
    if (+stone == 0) {
        return ["1"]
    } else if (stone.length % 2 == 0) {
        return [(+stone.substring(0, stone.length/2)).toString(), (+stone.substring(stone.length/2, stone.length)).toString()]
    } else {
        return [(+stone * 2024).toString()]
    }
}

function A() {
    let data = readFileSync('./input/day11.txt', 'utf-8').split(" ")

    for (let el of Array(25)) {
        data = data.flatMap(blink)
    }
    console.log(data.length)
}

function B() {
    let data: {[index: string]: number} = {}
    readFileSync('./input/day11.txt', 'utf-8').split(" ").map(number => data[number] = 1)

    for (let el of Array(75).keys()) {
        let newdata: {[index: string]: number} = {}
        
        for (let key in data) {
            for (let res of blink(key)) {
                if (res in newdata) {
                    newdata[res] = newdata[res] + data[key]
                } else {
                    newdata[res] = data[key]
                }
            }
        }
        data = newdata;
    }
    console.log(Object.values(data).reduce((a,b) => a+b))
}

A()
B()