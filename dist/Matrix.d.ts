export default class Matrix {
    rows: number;
    cols: number;
    static map(matrix: Matrix, callback: MatrixMapFunction): Matrix;
    static fromJSON(json: string): Matrix;
    static fromArray(array: number[]): Matrix;
    static multiply(a: Matrix, b: Matrix): Matrix;
    static subtract(a: Matrix, b: Matrix): Matrix;
    static transpose(matrix: Matrix): Matrix;
    data: number[][];
    constructor(rows: number, cols: number);
    copy(): Matrix;
    toArray(): number[];
    randomize(): this;
    map(callback: MatrixMapFunction): this;
    add(matrixOrNumber: Matrix | number): this;
    multiply(matrixOrNumber: Matrix | number): this;
    toJSON(): string;
}
export declare type MatrixMapFunction = (value: number, row: number, col: number) => number;
export declare class MatrixError extends Error {
    constructor(message: string);
}
