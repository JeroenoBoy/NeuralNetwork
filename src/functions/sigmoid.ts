import ActivationFunction from "./ActivationFunction";

export default new ActivationFunction(
	x => 1 / (1 + Math.exp(-x)),
	y => y * (1 - y)
);