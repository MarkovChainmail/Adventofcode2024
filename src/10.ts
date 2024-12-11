import { readFileSync } from "fs";

function isValid(coordinate: number[], data: string[], target: number) {
    return coordinate[0] < data[0].length && 
        coordinate[0] >= 0 && 
        coordinate[1] < data.length && 
        coordinate[1] >= 0 &&
        +data[coordinate[1]][coordinate[0]] == target
}

class ArraySet extends Set<number[]>{
    equals(a: number[], b: number[]) {
        return a[0] == b[0] && a[1] == b[1]
    }

    add(coordinate: number[]){
      if (![...this].some(elem => this.equals(elem, coordinate))) {
        return super.add(coordinate);
      } else {
        return this
      }     
    }

    has(coordinate: number[]){
        return [...this].some(elem => this.equals(elem, coordinate))
    }
}

function findscore(start: number[], data: string[]) {
    let height = 1
    let previous = new ArraySet()
    previous.add(start)
    while (height <= 9) {
        let newprevious = new ArraySet()
        for (let coordinate of previous) {
            const adjacent = [
                [coordinate[0]-1, coordinate[1]],
                [coordinate[0]+1, coordinate[1]],
                [coordinate[0], coordinate[1]-1],
                [coordinate[0], coordinate[1]+1]
            ]
            for (let c of adjacent.filter(c => isValid(c, data, height))) {
                newprevious.add(c)
            }
        }
        previous = newprevious;
        height++;
    }
    return previous;
}

function A() {
    const data = readFileSync('./input/day10.txt', 'utf-8').split("\n")
    const trailheads = data.flatMap((s, i) => [...s.matchAll(/0/g)].map((match) => [match.index, i])).filter(coordinate => coordinate.length > 0)
    const score = trailheads.map(trailhead => findscore(trailhead, data).size).reduce((a,b) => a+b)
    console.log(score)
}

class TrailSet extends Set<number[][]>{
    equals(a: number[][], b: number[][]) {
        return a.length == b.length && a.every((v, i) => v[0] == b[i][0] && v[1] == b[i][1])
    }

    add(trail: number[][]){
      if (![...this].some(elem => this.equals(elem, trail))) {
        return super.add(trail);
      } else {
        return this
      }     
    }

    has(trail: number[][]){
        return [...this].some(elem => this.equals(elem, trail))
    }
}

function trails(start: number[], data: string[]) {
    let height = 1
    let previous = new TrailSet()
    previous.add([start])

    while (height <= 9) {
        let newprevious = new TrailSet()
        for (let trail of previous) {
            const last = trail[trail.length-1]
            const adjacent = [
                [last[0]-1, last[1]],
                [last[0]+1, last[1]],
                [last[0], last[1]-1],
                [last[0], last[1]+1]
            ]
            for (let c of adjacent.filter(c => isValid(c, data, height))) {
                const newtrail = [...trail, c]
                newprevious.add(newtrail)
            }
        }
        previous = newprevious;
        height++;
    }
    return previous;
}

function B() {
    const data = readFileSync('./input/day10.txt', 'utf-8').split("\n")
    const trailheads = data.flatMap((s, i) => [...s.matchAll(/0/g)].map((match) => [match.index, i])).filter(coordinate => coordinate.length > 0)
    const score = trailheads.map(trailhead => trails(trailhead, data).size).reduce((a,b) => a+b)
    console.log(score)
}

A()
B()