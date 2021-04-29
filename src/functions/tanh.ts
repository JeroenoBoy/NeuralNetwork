import ActivationFunction from "./ActivationFunction";

export default new ActivationFunction(
	x => Math.tanh(x),
	y => 1 - (y * y)
)