"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
require("./App.scss");
var layouts_1 = __importDefault(require("./layouts"));
function App() {
    return (<layouts_1.default />);
}
exports.default = App;
