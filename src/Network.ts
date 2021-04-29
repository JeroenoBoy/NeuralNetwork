import ActivationFunction from "./functions/ActivationFunction";
import sigmoid from "./functions/sigmoid";
import Matrix from "./Matrix";


export interface NeuralNetworkConfig {

	/**
	 * Amount of layers of the hidden nodes, and the amount nodes within them. 
	 */
	hidden: number[]

	/**
	 * The rate at which the neurons change values.
	 * @default .1
	 */
	learningRate: number;
}


export type PartialNetworkConfig = Partial<NeuralNetworkConfig> & { hidden: NeuralNetworkConfig['hidden'] }


export default class NeuralNetwork {

	//
	//
	//	Static propperties
	//
	//

	/**
	 * Copy a network
	 */
	static copy(old: NeuralNetwork) {
		const newConfig = {...old.config};
		newConfig.hidden = [...old.config.hidden];

		const newNet = new NeuralNetwork(old.inputNodes, old.outputNodes, newConfig);

		//	Copying values

		newNet.activationFunc = old.activationFunc;

		//	Cloning nodes

		for(const i in old.nodes) {
			const oldNode = old.nodes[i];
			
			newNet.nodes[i].biases = oldNode.biases.copy();
			newNet.nodes[i].weights = oldNode.weights.copy();
		}
		
		return newNet;
	}

	/**
	 * Load an network
	 */
	static fromJson(data: string | any) {
		if(typeof data === "string")
			data = JSON.parse(data);
		
		const newNet = new NeuralNetwork(data.inputNodes, data.outputNodes, data.config);

		//	Cloning nodes

		if(!Array.isArray(data.nodes)) throw new Error("data.nodes is not an array!");

		for(let i = 0; i < data.nodes.length; i++) {
			const oldNode = data.nodes[i];

			newNet.nodes[i].biases = Matrix.fromJSON(oldNode);
			newNet.nodes[i].weights = Matrix.fromJSON(oldNode);
		}

		return newNet;
	}

	//
	//
	//	Class
	//
	//

	inputNodes: number;
	outputNodes: number;

	nodes: NeuralNetworkNode[]

	/**
	 * The functions to use when activating
	 */
	activationFunc: ActivationFunction;

	/**
	 * Holds the config
	 */
	config: NeuralNetworkConfig;

	/**
	 * Create a new baby brain
	 */
	constructor(inputAmount: number, outputAmount: number, config: PartialNetworkConfig) {

		//	@ts-ignore
		this.config = {};
		this.config.hidden = config.hidden;
		this.config.learningRate = config.learningRate ?? .1;
		
		this.inputNodes = inputAmount;
		this.inputNodes = outputAmount;

		this.activationFunc = sigmoid;

		//	Creating matrixes

		this.nodes = [];
		let prev = inputAmount;
		for(let i = 0; i < config.hidden.length + 1; i++) {
			let curr = config.hidden[i] ?? outputAmount;

			this.nodes.push({
				weights: new Matrix(curr, prev).randomize(),
				biases: new Matrix(curr, 1).randomize()
			});

			prev = curr;
		}
	}

	/**
	 * Predict the output of an array
	 */
	predict(input_array: number[]) {

		let inputs = Matrix.fromArray(input_array);

		for(const node of this.nodes) {

			//	Generating hidden inputs
			let hidden = Matrix.multiply(node.weights, inputs);
			hidden.add(node.biases);

			//	Activation functions
			hidden.map(this.activationFunc.func);

			//	For next round
			inputs = hidden;
		}		

		//	Returning as array
		return inputs.toArray();
	}

	/**
	 * Mutate the network 
	 * @param chance the chance for a value to be mutated, 1 = 100%
	 * @param rate the maximum amount a value can be changed
	 */
	mutate(chance: number = .1, rate: number = 1) {

		const mutate = (v: number) =>
			Math.random() < chance
			? v + 2*(Math.random() * rate) - 1
			: v;

		//	Mutating the nodes

		for(const node of this.nodes) {
			node.biases.map(mutate)
			node.weights.map(mutate)
		}
	}

	/**
	 * Copy this Neural Network
	 */
	copy() {
		return NeuralNetwork.copy(this);
	}

	/**
	 * Turns the network into an JSON string
	 */
	toJSON() {
		return JSON.stringify(this);
	}
}



export interface NeuralNetworkNode {
	weights: Matrix
	biases: Matrix
}