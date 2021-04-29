"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ActivationFunction_1 = __importDefault(require("./ActivationFunction"));
exports.default = new ActivationFunction_1.default(x => Math.tanh(x), y => 1 - (y * y));
