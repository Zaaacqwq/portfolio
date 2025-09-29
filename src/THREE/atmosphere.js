"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var THREE = __importStar(require("three"));
var gradient_png_1 = __importDefault(require("@/assets/images/gradient.png"));
var addons_1 = require("../declare/THREE/addons");
var loader = new THREE.TextureLoader();
loader.crossOrigin = '';
var n = new THREE.PointsMaterial({
    size: 7,
    map: loader.load(gradient_png_1.default),
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true
});
function getRangeRandom(e, t) {
    return Math.random() * (t - e) + e;
}
var AtmosphereParticle = /** @class */ (function (_super) {
    __extends(AtmosphereParticle, _super);
    function AtmosphereParticle(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        var _this = _super.call(this) || this;
        _this._phase = 'idle';
        _this._t = 0;
        _this._last = performance.now();
        _this.update = function () {
            if (!_this.Geometry)
                return;
            var now = performance.now();
            var dt = now - _this._last;
            _this._last = now;
            // 速度包络（up → down）
            if (_this._phase !== 'idle') {
                var dur = _this._phase === 'up' ? _this._upMs : _this._downMs;
                _this._t = Math.min(1, _this._t + dt / Math.max(1, dur));
                var e = _this._easeExpInOut(_this._t);
                if (_this._phase === 'up') {
                    // base → upTo
                    _this._speed = _this._baseSpeed + (_this._upTo - _this._baseSpeed) * e;
                    if (_this._t >= 1) {
                        _this._phase = 'down';
                        _this._t = 0;
                    }
                }
                else {
                    // upTo → downTo
                    _this._speed = _this._upTo + (_this._downTo - _this._upTo) * e;
                    if (_this._t >= 1) {
                        _this._phase = 'idle';
                        _this._baseSpeed = _this._downTo;
                    }
                }
            }
            // 实际旋转
            if (_this.renderUpdate) {
                // 支持外部自定义旋转：把速度传给你
                _this.renderUpdate(_this.Geometry, _this._speed);
            }
            else {
                // 内置一个简单旋转（如果你没传 renderUpdate）
                var r = _this.Geometry.rotation;
                if (_this.axis === 'x')
                    r.x -= _this._speed;
                else if (_this.axis === 'y')
                    r.y += _this._speed;
                else
                    r.z += _this._speed * 0.5;
            }
        };
        _this.ChangeModel = function () {
            var _a;
            // 先让 onChangeModel 有机会做额外事（可选）
            (_a = _this.onChangeModel) === null || _a === void 0 ? void 0 : _a.call(_this, _this.Geometry);
            // 再触发内置包络
            _this._phase = 'up';
            _this._t = 0;
        };
        var longestDistance = options.longestDistance, particleSum = options.particleSum, renderUpdate = options.renderUpdate, onChangeModel = options.onChangeModel;
        _this.longestDistance = longestDistance;
        _this.particleSum = particleSum;
        _this.renderUpdate = renderUpdate;
        _this.onChangeModel = onChangeModel;
        _this.axis = (_a = options.axis) !== null && _a !== void 0 ? _a : 'x';
        _this._baseSpeed = (_b = options.baseSpeed) !== null && _b !== void 0 ? _b : 0.002;
        _this._speed = _this._baseSpeed;
        _this._upTo = (_d = (_c = options.accel) === null || _c === void 0 ? void 0 : _c.upTo) !== null && _d !== void 0 ? _d : 0.04;
        _this._downTo = (_f = (_e = options.accel) === null || _e === void 0 ? void 0 : _e.downTo) !== null && _f !== void 0 ? _f : 0.002;
        _this._upMs = (_h = (_g = options.accel) === null || _g === void 0 ? void 0 : _g.upMs) !== null && _h !== void 0 ? _h : 1500;
        _this._downMs = (_k = (_j = options.accel) === null || _j === void 0 ? void 0 : _j.downMs) !== null && _k !== void 0 ? _k : 1500;
        var vertices = [];
        for (var i = 0; i < _this.particleSum; i++) {
            var x = getRangeRandom(-1 * longestDistance, longestDistance);
            var y = getRangeRandom(-1 * longestDistance, longestDistance);
            var z = getRangeRandom(-1 * longestDistance, longestDistance);
            vertices.push(x, y, z);
        }
        var geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        _this.Geometry = new THREE.Points(geometry, n);
        (_l = options.callback) === null || _l === void 0 ? void 0 : _l.call(_this, _this.Geometry);
        return _this;
    }
    AtmosphereParticle.prototype._easeExpInOut = function (x) {
        return 1 - Math.cos((x * Math.PI) / 2);
    };
    return AtmosphereParticle;
}(addons_1.addonsBasic));
exports.default = AtmosphereParticle;
