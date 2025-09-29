"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GetFlatGeometry;
var THREE = __importStar(require("three"));
var gradient_png_1 = __importDefault(require("@/assets/images/gradient.png"));
function GetFlatGeometry() {
    var AMOUNTX = 50;
    var AMOUNTY = 50;
    var SEPARATION = 100;
    var numParticles = AMOUNTX * AMOUNTY;
    var vertices = new Float32Array(numParticles * 3);
    var scales = new Float32Array(numParticles);
    var i = 0;
    var TextureLoader = new THREE.TextureLoader();
    var material = new THREE.PointsMaterial({
        // 粒子大小
        size: 5,
        // false:粒子尺寸相同 ;true：取决于摄像头远近
        sizeAttenuation: true,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        map: TextureLoader.load(gradient_png_1.default)
    });
    for (var ix = 0; ix < AMOUNTX; ix++) {
        for (var iy = 0; iy < AMOUNTY; iy++) {
            vertices[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2); // x
            vertices[i + 1] = -300; // y
            vertices[i + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2); // z
            i += 3;
        }
    }
    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    var points = new THREE.Points(geometry, material);
    var wave = points.geometry;
    // console.log(wave);
    wave.attributes.position.needsUpdate = true;
    // wave.translate(0, -500, 0)
    // wave.rotateY(-30)
    return wave;
}
