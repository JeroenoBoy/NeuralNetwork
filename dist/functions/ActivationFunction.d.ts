export default class ActivationFunction {
    func: (x: number) => number;
    dfunc: (x: number) => number;
    constructor(func: (x: number) => number, dfunc: (x: number) => number);
}
