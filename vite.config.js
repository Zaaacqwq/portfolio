"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// vite.config.ts
var vite_1 = require("vite");
var plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
var vite_plugin_glsl_1 = __importDefault(require("vite-plugin-glsl"));
var node_path_1 = __importDefault(require("node:path"));
var node_url_1 = require("node:url");
// ESM 环境下自己定义 __dirname
var __filename = (0, node_url_1.fileURLToPath)(import.meta.url);
var __dirname = node_path_1.default.dirname(__filename);
exports.default = (0, vite_1.defineConfig)({
    plugins: [
        (0, plugin_react_1.default)(),
        (0, vite_plugin_glsl_1.default)({
            include: ['**/*.glsl', '**/*.vert', '**/*.frag', '**/*.wgsl'],
        }),
    ],
    resolve: {
        alias: {
            '@': node_path_1.default.resolve(__dirname, 'src'),
        },
    },
});
