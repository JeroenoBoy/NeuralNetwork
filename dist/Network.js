"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sigmoid_1 = __importDefault(require("./functions/sigmoid"));
const Matrix_1 = __importDefault(require("./Matrix"));
class NeuralNetwork {
    constructor(inputAmount, outputAmount, config) {
        var _a, _b;
        this.config = {};
        this.config.hidden = config.hidden;
        this.config.learningRate = (_a = config.learningRate) !== null && _a !== void 0 ? _a : .1;
        this.inputNodes = inputAmount;
        this.inputNodes = outputAmount;
        this.activationFunc = sigmoid_1.default;
        this.nodes = [];
        let prev = inputAmount;
        for (let i = 0; i < config.hidden.length + 1; i++) {
            let curr = (_b = config.hidden[i]) !== null && _b !== void 0 ? _b : outputAmount;
            this.nodes.push({
                weights: new Matrix_1.default(curr, prev).randomize(),
                biases: new Matrix_1.default(curr, 1).randomize()
            });
            prev = curr;
        }
    }
    static copy(old) {
        const newConfig = Object.assign({}, old.config);
        newConfig.hidden = [...old.config.hidden];
        const newNet = new NeuralNetwork(old.inputNodes, old.outputNodes, newConfig);
        newNet.activationFunc = old.activationFunc;
        for (const i in old.nodes) {
            const oldNode = old.nodes[i];
            newNet.nodes[i].biases = oldNode.biases.copy();
            newNet.nodes[i].weights = oldNode.weights.copy();
        }
        return newNet;
    }
    static fromJson(data) {
        if (typeof data === "string")
            data = JSON.parse(data);
        const newNet = new NeuralNetwork(data.inputNodes, data.outputNodes, data.config);
        if (!Array.isArray(data.nodes))
            throw new Error("data.nodes is not an array!");
        for (let i = 0; i < data.nodes.length; i++) {
            const oldNode = data.nodes[i];
            newNet.nodes[i].biases = Matrix_1.default.fromJSON(oldNode);
            newNet.nodes[i].weights = Matrix_1.default.fromJSON(oldNode);
        }
        return newNet;
    }
    predict(input_array) {
        let inputs = Matrix_1.default.fromArray(input_array);
        for (const node of this.nodes) {
            let hidden = Matrix_1.default.multiply(node.weights, inputs);
            hidden.add(node.biases);
            hidden.map(this.activationFunc.func);
            inputs = hidden;
        }
        return inputs.toArray();
    }
    mutate(chance = .1, rate = 1) {
        const mutate = (v) => Math.random() < chance
            ? v + 2 * (Math.random() * rate) - 1
            : v;
        for (const node of this.nodes) {
            node.biases.map(mutate);
            node.weights.map(mutate);
        }
    }
    copy() {
        return NeuralNetwork.copy(this);
    }
    toJSON() {
        return JSON.stringify(this);
    }
}
exports.default = NeuralNetwork;
