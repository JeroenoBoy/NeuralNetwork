"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatrixError = void 0;
class Matrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.data = Array(rows).fill('').map(() => Array(this.cols).fill(0));
    }
    static map(matrix, callback) {
        return new Matrix(matrix.rows, matrix.cols)
            .map((_, r, c) => callback(matrix.data[r][c], r, c));
    }
    static fromJSON(json) {
        const data = JSON.parse(json);
        const matrix = new Matrix(data.rows, data.cols);
        matrix.data = data;
        return matrix;
    }
    static fromArray(array) {
        return new Matrix(array.length, 1).map((_, r) => array[r]);
    }
    static multiply(a, b) {
        if (a.cols !== b.rows)
            throw new MatrixError("Columns of A must match the rows of B.");
        return new Matrix(a.rows, b.cols)
            .map((_, r, c) => {
            let sum = 0;
            for (let i = 0; i < a.cols; i++)
                sum += a.data[r][c] * b.data[i][c];
            return sum;
        });
    }
    static subtract(a, b) {
        if (a.rows !== a.rows || a.cols !== a.cols)
            throw new MatrixError("Columns and rows of A must match columns and rows of B.");
        return new Matrix(a.rows, a.cols)
            .map((_, r, c) => a.data[r][c] - b.data[r][c]);
    }
    static transpose(matrix) {
        return new Matrix(matrix.cols, matrix.rows)
            .map((_, r, c) => matrix.data[c][r]);
    }
    copy() {
        const clone = new Matrix(this.rows, this.cols);
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                clone.data[r][c] = this.data[r][c];
            }
        }
        return clone;
    }
    toArray() {
        const arr = [];
        for (let r = 0; r < this.rows; r++) {
            arr.push(...this.data[r]);
        }
        return arr;
    }
    randomize() {
        this.map(() => Math.random() * 2 - 1);
        return this;
    }
    map(callback) {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.data[r][c] = callback(this.data[r][c], r, c);
            }
        }
        return this;
    }
    add(matrixOrNumber) {
        if (matrixOrNumber instanceof Matrix) {
            if (this.rows !== matrixOrNumber.rows || this.cols !== matrixOrNumber.cols)
                throw new MatrixError("Columns and rows of A must match columns and rows of B.");
            return this.map((v, r, c) => v + matrixOrNumber.data[r][c]);
        }
        return this.map(v => v + matrixOrNumber);
    }
    multiply(matrixOrNumber) {
        if (matrixOrNumber instanceof Matrix) {
            if (this.rows !== matrixOrNumber.rows || this.cols !== matrixOrNumber.cols)
                throw new MatrixError("Columns and rows of A must match columns and rows of B.");
            return this.map((v, r, c) => v * matrixOrNumber.data[r][c]);
        }
        return this.map(v => v * matrixOrNumber);
    }
    toJSON() {
        return JSON.stringify(this);
    }
}
exports.default = Matrix;
class MatrixError extends Error {
    constructor(message) {
        super(message);
        this.name = 'MatrixError';
    }
}
exports.MatrixError = MatrixError;
