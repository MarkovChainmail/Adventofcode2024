import { readFileSync } from 'fs';

function extractFrequencies(s: String) {
    return [...s.matchAll(/[^.]/g)]
}

class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    plus(v: Vector) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    minus(v: Vector) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    inBounds(boundaries: Vector) {
        return this.x >= 0 && this.x < boundaries.x && this.y >= 0 && this.y < boundaries.y;
    }

    equals(v: Vector) {
        return v.x == this.x && v.y == this.y;
    }
}

class ObjectSet extends Set<Object>{
    add(elem: Object){
      return super.add(typeof elem === 'object' ? JSON.stringify(elem) : elem);
    }
    has(elem: Object){
      return super.has(typeof elem === 'object' ? JSON.stringify(elem) : elem);
    }
    copy(){
        return new ObjectSet(this);
    }
}

// locations: [x,y] coordinates of nodes
// boundaries: max X and Y of the map
function solveFrequency(locations: Vector[], boundaries: Vector) {
    if (locations.length <= 1) return [];
    let antinodes = [];
    
    for (let i = 0; i < locations.length-1; i++) {
        for (let j = i+1; j < locations.length; j++) {
            const [A, B] = [locations[i], locations[j]];
            const dist = B.minus(A);
            const [antinodeA, antinodeB] = [A.minus(dist), B.plus(dist)]

            if (antinodeA.inBounds(boundaries)) {
                antinodes.push(antinodeA);
            }
            if (antinodeB.inBounds(boundaries)) {
                antinodes.push(antinodeB);
            }
        }
    }

    return antinodes;
}

function A() {
    const data = readFileSync('./input/day8.txt', 'utf-8').split("\n")
    const dictionary = data.map(extractFrequencies)
        .flatMap((list, i) => list.map(match => [match[0], match.index, i]))
        .reduce((obj, tuple) => {
            if (obj[tuple[0] as string]) {
                obj[tuple[0] as string].push(new Vector(+tuple[1], +tuple[2]));
            } else {
                obj[tuple[0] as string] = [new Vector(+tuple[1], +tuple[2])]
            }

            return obj;
        }, {} as {[index: string]: Vector[]});
    
    const antinodes = Object.values(dictionary).flatMap(vectors => solveFrequency(vectors, new Vector(data[0].length, data.length)));
    console.log((new ObjectSet(antinodes)).size)
}

function solveResonantFrequency(locations: Vector[], boundaries: Vector) {
    if (locations.length <= 1) return [];
    let antinodes = [];
    
    for (let i = 0; i < locations.length-1; i++) {
        for (let j = i+1; j < locations.length; j++) {
            const [A, B] = [locations[i], locations[j]];
            const dist = B.minus(A);
            
            let [antinodeA, antinodeB] = [A, B]

            while (antinodeA.inBounds(boundaries)) {
                antinodes.push(antinodeA);
                antinodeA = antinodeA.minus(dist);
            }
            while (antinodeB.inBounds(boundaries)) {
                antinodes.push(antinodeB);
                antinodeB = antinodeB.plus(dist);
            }
        }
    }

    return antinodes;
}

function B() {
    const data = readFileSync('./input/day8.txt', 'utf-8').split("\n")
    const dictionary = data.map(extractFrequencies)
        .flatMap((list, i) => list.map(match => [match[0], match.index, i]))
        .reduce((obj, tuple) => {
            if (obj[tuple[0] as string]) {
                obj[tuple[0] as string].push(new Vector(+tuple[1], +tuple[2]));
            } else {
                obj[tuple[0] as string] = [new Vector(+tuple[1], +tuple[2])]
            }

            return obj;
        }, {} as {[index: string]: Vector[]});
    
    const antinodes = Object.values(dictionary).flatMap(vectors => solveResonantFrequency(vectors, new Vector(data[0].length, data.length)));
    console.log((new ObjectSet(antinodes)).size)
}

A()
B()