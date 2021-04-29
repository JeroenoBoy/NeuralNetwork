export default class ActivationFunction {
	constructor(
		public func: (x: number) => number,
		public dfunc: (x: number) => number
	) {}
}