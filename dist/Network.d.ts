import ActivationFunction from "./functions/ActivationFunction";
import Matrix from "./Matrix";
export interface NeuralNetworkConfig {
    hidden: number[];
    learningRate: number;
}
export declare type PartialNetworkConfig = Partial<NeuralNetworkConfig> & {
    hidden: NeuralNetworkConfig['hidden'];
};
export default class NeuralNetwork {
    static copy(old: NeuralNetwork): NeuralNetwork;
    static fromJson(data: string | any): NeuralNetwork;
    inputNodes: number;
    outputNodes: number;
    nodes: NeuralNetworkNode[];
    activationFunc: ActivationFunction;
    config: NeuralNetworkConfig;
    constructor(inputAmount: number, outputAmount: number, config: PartialNetworkConfig);
    predict(input_array: number[]): number[];
    mutate(chance?: number, rate?: number): void;
    copy(): NeuralNetwork;
    toJSON(): string;
}
export interface NeuralNetworkNode {
    weights: Matrix;
    biases: Matrix;
}
