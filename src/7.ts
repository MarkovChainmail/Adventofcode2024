import { readFileSync } from 'fs';

// Extract the numbers from a string
function extractNumbers(s: String) {
    return [...s.matchAll(/[0-9]+/g)].map(m => +m[0]);
}

class EquationA {
    goal: number;
    components: number[];

    constructor(numbers: number[]) {
        this.goal = numbers[0];
        this.components = numbers.slice(1);
    }

    solve(): boolean {
        let values: number[] = [this.components[0]];

        for (const c of this.components.slice(1)) {
            let newValues = [];
            for (const v of values) {
                const plus = v + c;
                const mult = v * c;

                if (plus <= this.goal) {
                    newValues.push(plus);
                }
                if (mult <= this.goal) {
                    newValues.push(mult);
                }
            }
            if (newValues.length == 0) {
                return false;
            } else {
                values = newValues;
            }
        }

        return values.some((n) => n == this.goal);
    }
}

function A() {
    const data = readFileSync('./input/day7.txt', 'utf-8').split("\n")
    const output = data
        .map((line) => new EquationA(extractNumbers(line)))
        .map(eq => [eq.goal, eq.solve()])
        .filter(tuple => tuple[1])
        .map(tuple => tuple[0])
        .reduce((a,b) => +a + +b) // typecaset to number because typescript
    
    console.log(output)
}

class EquationB {
    goal: number;
    components: number[];

    constructor(numbers: number[]) {
        this.goal = numbers[0];
        this.components = numbers.slice(1);
    }

    solve(): boolean {
        let values: number[] = [this.components[0]];

        for (const c of this.components.slice(1)) {
            let newValues = [];
            for (const v of values) {
                const plus = v + c;
                const mult = v * c;
                const conc = +("" + v + c);

                if (plus <= this.goal) {
                    newValues.push(plus);
                }
                if (mult <= this.goal) {
                    newValues.push(mult);
                }
                if (conc <= this.goal) {
                    newValues.push(conc);
                }
            }
            if (newValues.length == 0) {
                return false;
            } else {
                values = newValues;
            }
        }

        return values.some((n) => n == this.goal);
    }
}

function B() {
    const data = readFileSync('./input/day7.txt', 'utf-8').split("\n")
    const output = data
        .map((line) => new EquationB(extractNumbers(line)))
        .map(eq => [eq.goal, eq.solve()])
        .filter(tuple => tuple[1])
        .map(tuple => tuple[0])
        .reduce((a,b) => +a + +b) // typecaset to number because typescript
    
    console.log(output)
}

A()
B()