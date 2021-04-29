



export default class Matrix {

	//
	//
	//	Static propperties
	//
	//

	/**
	 * Clones the Matrix and runs the callback
	 */
	static map(matrix: Matrix, callback: MatrixMapFunction) {
		return new Matrix(matrix.rows, matrix.cols)
			.map((_,r,c) => callback(matrix.data[r][c], r, c));
	}

	/**
	 * Creates new matrix from given JSON data
	 */
	static fromJSON(json: string) {
		const data = JSON.parse(json);
		const matrix = new Matrix(data.rows, data.cols);
		matrix.data = data;
		return matrix;
	}

	/**
	 * Turn an Array into a Matrix
	 */
	static fromArray(array: number[]) {
		return new Matrix(array.length, 1).map((_,r) => array[r]);
	}

	/**
	 * Multiply the given Matrixes with eachother
	 */
	static multiply(a: Matrix, b: Matrix) {
		if(a.cols !== b.rows) throw new MatrixError("Columns of A must match the rows of B.");

		return new Matrix(a.rows, b.cols)
			.map((_,r,c) => {
				let sum = 0;

				for(let i = 0; i < a.cols; i++)
					sum += a.data[r][c] * b.data[i][c];

				return sum;
			});
	}

	/**
	 * Subtracts 1 matris from another 
	 */
	static subtract(a: Matrix, b: Matrix) {
		if(a.rows !== a.rows || a.cols !== a.cols)
			throw new MatrixError("Columns and rows of A must match columns and rows of B.");

		return new Matrix(a.rows, a.cols)
			.map((_,r,c) => a.data[r][c] - b.data[r][c])
	}


	/**
	 * Flips the given Matrix over its diagonal
	 * @example
	 * [ 1 2 ]    [ 1 3 5 ]
	 * [ 3 4 ] => [ 2 4 5 ]
	 * [ 5 6 ]
	 */
	static transpose(matrix: Matrix) {
		return new Matrix(matrix.cols, matrix.rows)
			.map((_,r,c) => matrix.data[c][r])
	}
	
	//
	//
	//	Class
	//
	//

	data: number[][];

	/**
	 * A 2D map arranged in rows and columns
	 */
	constructor(public rows: number, public cols: number) {
		this.data = Array(rows).fill('').map(() => Array(this.cols).fill(0));
	}

	/**
	 * Clones this Matrix
	 */
	copy() {
		const clone = new Matrix(this.rows, this.cols)
		
		for(let r = 0; r < this.rows; r++) {
			for(let c = 0; c < this.cols; c++) {
				clone.data[r][c] = this.data[r][c];
			}
		}

		return clone;
	}

	/**
	 * Converts the Matrix to an 1D array
	 */
	toArray() {
		const arr = [];
		
		for(let r = 0; r < this.rows; r++) {
			arr.push(...this.data[r]);
		}

		return arr;
	}

	/**
	 * Randomize the inputs of the array to a value between -1 and 1
	 */
	randomize() {
		this.map(() => Math.random() *2 -1);
		return this;
	}


	/**
	 * Simulair to Array.map(), but in 2 dimensions
	 */
	map(callback: MatrixMapFunction) {
		for(let r = 0; r < this.rows; r++) {
			for(let c = 0; c < this.cols; c++) {
				this.data[r][c] = callback(this.data[r][c], r, c);
			}
		}
		return this;
	}


	/**
	 * Combines 2 Matrixes, or adds a single number to all values of this <atrix
	 */
	add(matrixOrNumber: Matrix | number) {

		if(matrixOrNumber instanceof Matrix) {
			if(this.rows !== matrixOrNumber.rows || this.cols !== matrixOrNumber.cols)
				throw new MatrixError("Columns and rows of A must match columns and rows of B."); 

			return this.map((v,r,c) => v+matrixOrNumber.data[r][c])
		}
		return this.map(v => v+matrixOrNumber);
	}


	/**
	 * Combines 2 Matrixes, or adds a single number to all values of this Matrix
	 */
	multiply(matrixOrNumber: Matrix | number) {

		if(matrixOrNumber instanceof Matrix) {
			if(this.rows !== matrixOrNumber.rows || this.cols !== matrixOrNumber.cols)
				throw new MatrixError("Columns and rows of A must match columns and rows of B."); 

			return this.map((v,r,c) => v*matrixOrNumber.data[r][c])
		}
		return this.map(v => v*matrixOrNumber);
	}


	/**
	 * Turns this Matrix to a JSON object
	 */
	toJSON() {
		return JSON.stringify(this);
	}
}


export type MatrixMapFunction = (value: number, row: number, col: number) => number

export class MatrixError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'MatrixError';
	}
}