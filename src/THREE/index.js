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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var THREE = __importStar(require("three"));
var OBJLoader_js_1 = require("three/examples/jsm/loaders/OBJLoader.js");
var OrbitControls_1 = require("three/examples/jsm/controls/OrbitControls");
var EffectComposer_1 = require("three/examples/jsm/postprocessing/EffectComposer");
var RenderPass_1 = require("three/examples/jsm/postprocessing/RenderPass");
var BloomPass_1 = require("three/examples/jsm/postprocessing/BloomPass");
var FilmPass_1 = require("three/examples/jsm/postprocessing/FilmPass");
var ShaderPass_1 = require("three/examples/jsm/postprocessing/ShaderPass");
var FocusShader_1 = require("three/examples/jsm/shaders/FocusShader");
var tween_js_1 = __importDefault(require("@tweenjs/tween.js"));
var stats_module_js_1 = __importDefault(require("three/examples/jsm/libs/stats.module.js"));
var lodash_1 = require("lodash");
var gradient_png_1 = __importDefault(require("@/assets/images/gradient.png"));
var VerticesDuplicateRemove_js_1 = __importDefault(require("@/utils/VerticesDuplicateRemove.js"));
var BuiltinShaderAttributeName_1 = __importDefault(require("@/constant/THREE/BuiltinShaderAttributeName"));
var FontLoader_js_1 = require("three/examples/jsm/loaders/FontLoader.js");
var TextGeometry_js_1 = require("three/examples/jsm/geometries/TextGeometry.js");
var MeshSurfaceSampler_js_1 = require("three/examples/jsm/math/MeshSurfaceSampler.js");
var BufferGeometryUtils_js_1 = require("three/examples/jsm/utils/BufferGeometryUtils.js");
function getRangeRandom(e, t) {
    return Math.random() * (t - e) + e;
}
var ParticleSystem = /** @class */ (function () {
    // 新编写的物体添加核心
    function ParticleSystem(options) {
        var _this = this;
        this.WelcomeBaseWidth = 1;
        this._welcomeTransitioning = false;
        this._welcomeLastT = 0;
        this._welcomeStartMs = 0;
        // 序列播放状态
        this._welcomeTargets = []; // 目标点阵列表
        this._welcomeCount = 12000; // 统一点数
        this._welcomeIdx = 0; // 当前目标索引
        this._welcomeTransMs = 900; // 变形时间
        this._welcomeDwellMs = 2000; // 停留时间
        this._welcomeLerp = { t: 0 }; // 0→1 tween 标量
        this._welcomePlaying = false; // 播放标记
        // 窗口大小变动时调用
        this.handleWindowResize = function () {
            var _a, _b;
            // 更新渲染器的高度和宽度以及相机的纵横比
            _this.HEIGHT = window.innerHeight;
            _this.WIDTH = window.innerWidth;
            (_a = _this.renderer) === null || _a === void 0 ? void 0 : _a.setSize(_this.WIDTH, _this.HEIGHT);
            (_b = _this.composer) === null || _b === void 0 ? void 0 : _b.reset();
            if (_this.camera != null) {
                _this.camera.aspect = _this.WIDTH / _this.HEIGHT;
                _this.camera.updateProjectionMatrix();
            }
            if (_this.WelcomePoints) {
                _this.fitObjectToViewWidth(_this.WelcomePoints, _this.WelcomeBaseWidth, 0.3);
            }
        };
        // 监听鼠标移动旋转场景
        this.rotateScene = (0, lodash_1.throttle)(function (e) {
            _this.mouseV = 3e-4 * (e.clientX - _this.WIDTH / 2);
            _this.mouseK = 1e-4 * (e.clientY - _this.HEIGHT / 2);
        }, 100);
        var AnimateDuration = options.AnimateDuration, onModelsFinishedLoad = options.onModelsFinishedLoad, LoadingManager = options.LoadingManager;
        this.CanvasWrapper = options.CanvasWrapper;
        this.addons = options.addons != null ? options.addons : [];
        this.Models = new Map();
        for (var _i = 0, _a = options.Models; _i < _a.length; _i++) {
            var i = _a[_i];
            this.Models.set(i.name, i);
        }
        this.AnimateDuration = typeof AnimateDuration === 'number' ? AnimateDuration : 1500;
        this.onModelsFinishedLoad = onModelsFinishedLoad;
        this.manager = LoadingManager;
        this.defaultLoader = new OBJLoader_js_1.OBJLoader(this.manager);
        /** 粒子Map */
        this.ParticleAnimeMap = [];
        /* 宽高 */
        this.HEIGHT = window.innerHeight;
        this.WIDTH = window.innerWidth;
        /** 模型列表  */
        this.modelList = new Map();
        /** 已加载的模型数量统计 */
        this._LOAD_COUNT_ = 0;
        /** 模型指针 */
        this.ModelPointer = 0;
        /** 载入模型中粒子的最大数量 */
        this.maxParticlesCount = 0;
        // 创建场景
        this.createScene();
        // 性能监控插件
        // this.initStats()
        // 载入模型
        this._addModels();
        // 效果器
        this.createEffect();
        // 轨道控制插件（鼠标拖拽视角、缩放等）
        this.orbitControls = new OrbitControls_1.OrbitControls(this.camera, this.renderer.domElement);
        this.mouseK = 0;
        this.mouseV = 0;
        this.orbitControls.enabled = false;
        this.orbitControls.enableRotate = false;
        this.orbitControls.enableZoom = false;
        this.orbitControls.enablePan = false;
        // 循环更新渲染场景
        this.update(0);
    }
    ParticleSystem.prototype.createScene = function () {
        var _this = this;
        // 创建场景
        this.scene = new THREE.Scene();
        // 在场景中添加雾的效果，参数分别代表‘雾的颜色’、‘开始雾化的视线距离’、刚好雾化至看不见的视线距离’
        this.scene.fog = new THREE.FogExp2(328972, 5e-4);
        // 创建相机
        var fieldOfView = 100;
        var aspectRatio = this.WIDTH / this.HEIGHT;
        var nearPlane = 1;
        var farPlane = 5e4;
        this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        // 设置相机的位置
        this.camera.position.set(0, 0, 1e3);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        // 坐标轴辅助器
        // const axesHelper = new THREE.AxesHelper(500)
        // this.scene.add(axesHelper)
        // addons 添加
        if (this.addons != null) {
            this.addons.forEach(function (val) {
                var _a;
                (_a = _this.scene) === null || _a === void 0 ? void 0 : _a.add(val.Geometry);
            });
        }
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({
            // 在 css 中设置背景色透明显示渐变色
            alpha: true
            // 开启抗锯齿
            // antialias: true,
        });
        // 自动清理，解决 bloomPass 效果器冲突
        this.renderer.autoClear = false;
        // 渲染背景颜色同雾化的颜色
        this.renderer.setClearColor(this.scene.fog.color);
        // 定义渲染器的尺寸；在这里它会填满整个屏幕
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        // 打开渲染器的阴影地图
        this.renderer.shadowMap.enabled = true;
        // this.renderer.shadowMapSoft = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // 在 HTML 创建的容器中添加渲染器的 DOM 元素
        this.CanvasWrapper.appendChild(this.renderer.domElement);
        // 单独的 ghost 场景（专门渲染“复制的一层”，避免被 Bloom 处理）
        this.ghostScene = new THREE.Scene();
        // 可选：为了匹配整体雾感，复用同样的雾（也可以不加雾）
        this.ghostScene.fog = this.scene.fog;
        // 监听屏幕，缩放屏幕更新相机和渲染器的尺寸
        window.addEventListener('resize', this.handleWindowResize, false);
    };
    // 性能监控
    ParticleSystem.prototype.initStats = function () {
        this.stats = (0, stats_module_js_1.default)();
        if (this.stats != null) {
            // 将性能监控屏区显示在左上角
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.bottom = '0px';
            this.stats.domElement.style.top = '0px';
            this.stats.domElement.style.zIndex = '100';
            this.CanvasWrapper.appendChild(this.stats.domElement);
        }
    };
    // 效果器
    ParticleSystem.prototype.createEffect = function () {
        this.composer = new EffectComposer_1.EffectComposer(this.renderer);
        var renderPass = new RenderPass_1.RenderPass(this.scene, this.camera);
        var bloomPass = new BloomPass_1.BloomPass(0.75);
        var filmPass = new FilmPass_1.FilmPass(0.5, 0.5, 1500, 0);
        var shaderPass = new ShaderPass_1.ShaderPass(FocusShader_1.FocusShader);
        shaderPass.uniforms.screenWidth.value = window.innerWidth;
        shaderPass.uniforms.screenHeight.value = window.innerHeight;
        shaderPass.uniforms.sampleDistance.value = 0.4;
        shaderPass.renderToScreen = true;
        this.composer.addPass(renderPass);
        this.composer.addPass(bloomPass);
        // ★ 在 Bloom 之后插入 ghost 场景渲染，这样 ghost 不会被 Bloom 影响
        this.ghostPass = new RenderPass_1.RenderPass(this.ghostScene, this.camera);
        this.ghostPass.clear = false; // 叠加绘制，不清屏
        this.composer.addPass(this.ghostPass);
        this.composer.addPass(filmPass);
        this.composer.addPass(shaderPass);
    };
    // 添加模型
    ParticleSystem.prototype._addModels = function () {
        var _this = this;
        var TextureLoader = new THREE.TextureLoader();
        TextureLoader.crossOrigin = '';
        this.PointMaterial = new THREE.PointsMaterial({
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
        // 读取预置列表
        this.Models.forEach(function (i) {
            var finalGeometry;
            var finalVertices = new Float32Array([]);
            var finishLoad = function () {
                var _a;
                // 材质选择
                _this.modelList.set(i.name, finalGeometry);
                // 回调
                (_a = i.onLoadComplete) === null || _a === void 0 ? void 0 : _a.call(_this, finalGeometry);
                _this._LOAD_COUNT_++;
                // 所有模型加载完后触发播放事件
                if (_this._LOAD_COUNT_ === _this.Models.size)
                    _this._finishLoadModal();
            };
            if (typeof i.path === 'string') {
                if (i.loader != null) {
                    var _a = i.loader, loaderInstance = _a.loaderInstance, load_1 = _a.load;
                    loaderInstance.load(i.path, function (args) {
                        finalGeometry = load_1(args);
                        finishLoad();
                    });
                }
                else {
                    _this.defaultLoader.load(i.path, function (group) {
                        for (var _i = 0, _a = group.children; _i < _a.length; _i++) {
                            var j = _a[_i];
                            // @ts-expect-error 不知道是什么原因导致 ts 判断出错
                            var arr = j.geometry.attributes.position.array;
                            finalVertices = new Float32Array(__spreadArray(__spreadArray([], finalVertices, true), arr, true));
                        }
                        if (!(i.NeedRemoveDuplicateParticle === false))
                            finalVertices = (0, VerticesDuplicateRemove_js_1.default)(finalVertices);
                        finalGeometry = new THREE.BufferGeometry();
                        // 粒子去重
                        finalGeometry.setAttribute('position', new THREE.BufferAttribute(finalVertices, 3));
                        i.geometry = finalGeometry;
                        finishLoad();
                    });
                }
            }
            else if (i.geometry instanceof THREE.BufferGeometry) {
                finalGeometry = i.geometry;
                finishLoad();
            }
        });
    };
    // 完成模型加载
    ParticleSystem.prototype._finishLoadModal = function () {
        var _a, _b;
        // 获得最大的粒子数量
        var maxParticlesCount = 0;
        this.modelList.forEach(function (val) {
            maxParticlesCount = Math.max(maxParticlesCount, val.attributes.position.count);
        });
        this.maxParticlesCount = maxParticlesCount;
        // 基于最大点构建一个动画载体
        var vertices = [];
        var randMaxLength = 1500;
        this.MainParticleGroup = new tween_js_1.default.Group();
        for (var i = 0; i < maxParticlesCount; i++) {
            var x = getRangeRandom(-1 * randMaxLength, randMaxLength);
            var y = getRangeRandom(-1 * randMaxLength, randMaxLength);
            var z = getRangeRandom(-1 * randMaxLength, randMaxLength);
            vertices.push(x, y, z);
            var p = {
                x: x,
                y: y,
                z: z,
                isPlaying: true
            };
            p.tweenctx = new tween_js_1.default.Tween(p, this.MainParticleGroup)
                .easing(tween_js_1.default.Easing.Exponential.In)
                // 处理内部私有变量
                .onComplete(function (o) {
                // @ts-expect-error
                o.tweenctx._valuesStart.x = o.x;
                // @ts-expect-error
                o.tweenctx._valuesStart.y = o.y;
                // @ts-expect-error
                o.tweenctx._valuesStart.z = o.z;
                o.isPlaying = false;
            })
                .onStart(function (o) {
                // @ts-expect-error
                o.tweenctx._valuesStart.x = o.x;
                // @ts-expect-error
                o.tweenctx._valuesStart.y = o.y;
                // @ts-expect-error
                o.tweenctx._valuesStart.z = o.z;
                o.isPlaying = true;
            });
            this.ParticleAnimeMap[i] = p;
        }
        var AnimateEffectGeometry = new THREE.BufferGeometry();
        AnimateEffectGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3, false));
        this.AnimateEffectParticle = new THREE.Points(AnimateEffectGeometry, this.PointMaterial);
        (_a = this.scene) === null || _a === void 0 ? void 0 : _a.add(this.AnimateEffectParticle);
        // 开始监听鼠标移动事件
        // 钩子
        (_b = this.onModelsFinishedLoad) === null || _b === void 0 ? void 0 : _b.call(this, this.AnimateEffectParticle, this.scene);
    };
    // 使物体宽度适应屏幕
    ParticleSystem.prototype.fitObjectToViewWidth = function (obj, baseWidth, occupy) {
        if (occupy === void 0) { occupy = 0.3; }
        if (!this.camera || !obj)
            return;
        var dist = Math.abs((this.camera.position.z) - (obj.position.z || 0));
        var frustumH = 2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov * 0.5)) * dist;
        var frustumW = frustumH * this.camera.aspect;
        var targetW = frustumW * occupy;
        var s = targetW / baseWidth;
        obj.scale.setScalar(s);
    };
    /**
     * 修改模型
     * @param {string} name 模型名字
     * @param {number?} time 动画时间长度，默认 `1500ms`
     */
    ParticleSystem.prototype.ChangeModel = function (name, time) {
        var _this = this;
        var _a, _b;
        if (time === void 0) { time = this.AnimateDuration; }
        var item = this.modelList.get(name);
        if (item == null) {
            console.warn('未找到指定名字的模型，改变操作已终止！传入的名字：' + name.toString());
            return;
        }
        var itemHook = this.Models.get(name);
        if (this.CurrentUseModelName !== undefined)
            this.LastUseModelName = this.CurrentUseModelName;
        this.CurrentUseModelName = name;
        // ★ 先生成“换出”的 ghost（让旧形态淡出）
        this._spawnGhostAndFadeOut(Math.max(600, time * 0.6));
        /** 模型切换开始钩子 */
        (_a = itemHook.onEnterStart) === null || _a === void 0 ? void 0 : _a.call(this, this.AnimateEffectParticle);
        var targetModel = item.getAttribute('position');
        var sourceModel = this.AnimateEffectParticle.geometry.getAttribute('position');
        var TimerId = setTimeout(function () {
            var _a;
            (_a = itemHook.onEnterEnd) === null || _a === void 0 ? void 0 : _a.call(_this, _this.AnimateEffectParticle);
        }, time * 2);
        // ★ 预取目标位置为 Float32Array，方便读
        var tgtArr = targetModel.array;
        // ★ 计算距离范围（用于延迟映射）
        var maxDist = 1e-6;
        for (var i = 0; i < this.maxParticlesCount; i++) {
            var cur = i % targetModel.count;
            var dx = sourceModel.getX(i) - tgtArr[cur * 3];
            var dy = sourceModel.getY(i) - tgtArr[cur * 3 + 1];
            var dz = sourceModel.getZ(i) - tgtArr[cur * 3 + 2];
            var d = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (d > maxDist)
                maxDist = d;
        }
        var _loop_1 = function (i) {
            var p = this_1.ParticleAnimeMap[i];
            p.isPlaying = true;
            var cur = i % targetModel.count;
            // 同步起点（防“跳变”）
            p.x = sourceModel.getX(i);
            p.y = sourceModel.getY(i);
            p.z = sourceModel.getZ(i);
            // ★ 距离驱动延迟：越远延迟越长，再加一点随机噪声
            var dx = p.x - tgtArr[cur * 3];
            var dy = p.y - tgtArr[cur * 3 + 1];
            var dz = p.z - tgtArr[cur * 3 + 2];
            var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            var dist01 = maxDist > 0 ? (dist / maxDist) : 0;
            var delay = (time * 0.5) * dist01 + (time * 0.2) * Math.random();
            p.tweenctx.stop()
                .to({ x: tgtArr[cur * 3], y: tgtArr[cur * 3 + 1], z: tgtArr[cur * 3 + 2] }, time)
                // ★ 柔和缓动：InOut 带来更自然的起/止
                .easing(tween_js_1.default.Easing.Exponential.InOut)
                .delay(delay)
                .onUpdate(function (o) {
                sourceModel.setXYZ(i, o.x, o.y, o.z);
                sourceModel.needsUpdate = true;
            })
                .onStop(function () {
                clearTimeout(TimerId);
            })
                .onComplete(function (o) {
                // 保持你原有的“值回写 & 标记”逻辑
                // @ts-expect-error
                o.tweenctx._valuesStart.x = o.x;
                // @ts-expect-error
                o.tweenctx._valuesStart.y = o.y;
                // @ts-expect-error
                o.tweenctx._valuesStart.z = o.z;
                p.isPlaying = false;
            })
                .start();
        };
        var this_1 = this;
        // 停止当前所有动画并重新设定
        for (var i = 0; i < this.maxParticlesCount; i++) {
            _loop_1(i);
        }
        // 触发 addons 钩子
        // this.addons?.forEach((val) => {
        //   val.ChangeModel?.call(this)
        // })
        (_b = this.addons) === null || _b === void 0 ? void 0 : _b.forEach(function (val) {
            // 兼容两种命名
            if (typeof val.onChangeModel === 'function')
                val.onChangeModel.call(_this);
            else if (typeof val.ChangeModel === 'function')
                val.ChangeModel.call(_this);
        });
    };
    /** 显示欢迎词
     * @param {string} text 欢迎词内容，默认 'WELCOME'
     */
    ParticleSystem.prototype.ShowWelcomeText = function () {
        return __awaiter(this, arguments, void 0, function (text) {
            var font, textGeo, tempMesh, sampler, COUNT, positions, colors, v, c, i, geo, box, mat;
            var _a;
            if (text === void 0) { text = 'WELCOME'; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.WelcomePoints)
                            return [2 /*return*/];
                        return [4 /*yield*/, new Promise(function (resolve, reject) {
                                new FontLoader_js_1.FontLoader().load('/fonts/helvetiker.json', resolve, undefined, reject);
                            })];
                    case 1:
                        font = _b.sent();
                        textGeo = new TextGeometry_js_1.TextGeometry(text, {
                            font: font,
                            size: 160,
                            height: 30,
                            curveSegments: 8,
                            bevelEnabled: true,
                            bevelThickness: 4,
                            bevelSize: 2,
                            bevelSegments: 2,
                        });
                        textGeo.center();
                        tempMesh = new THREE.Mesh(textGeo, new THREE.MeshBasicMaterial());
                        sampler = new MeshSurfaceSampler_js_1.MeshSurfaceSampler(tempMesh).build();
                        COUNT = 12000;
                        positions = new Float32Array(COUNT * 3);
                        colors = new Float32Array(COUNT * 3);
                        v = new THREE.Vector3();
                        c = new THREE.Color();
                        for (i = 0; i < COUNT; i++) {
                            sampler.sample(v);
                            v.z += (Math.random() - 0.5) * 12;
                            positions[i * 3 + 0] = v.x;
                            positions[i * 3 + 1] = v.y;
                            positions[i * 3 + 2] = v.z;
                            c.setHSL(0.62 + Math.random() * 0.03, 0.45, 0.7 + Math.random() * 0.1);
                            colors[i * 3 + 0] = c.r;
                            colors[i * 3 + 1] = c.g;
                            colors[i * 3 + 2] = c.b;
                        }
                        geo = new THREE.BufferGeometry();
                        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this._welcomeTargets[0]), 3));
                        geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
                        box = new THREE.Box3().setFromBufferAttribute(geo.getAttribute('position'));
                        this.WelcomeBaseWidth = box.max.x - box.min.x;
                        mat = new THREE.PointsMaterial({
                            size: 1.0,
                            vertexColors: true,
                            transparent: true,
                            opacity: 0.95,
                            depthWrite: false,
                            blending: THREE.AdditiveBlending,
                        });
                        this.WelcomePoints = new THREE.Points(geo, mat);
                        this.WelcomePoints.position.set(0, 0, 0); // 主场景原点
                        (_a = this.scene) === null || _a === void 0 ? void 0 : _a.add(this.WelcomePoints);
                        // 初次自适配：让字占视口 ~72% 宽
                        this.fitObjectToViewWidth(this.WelcomePoints, this.WelcomeBaseWidth, 0.3);
                        return [2 /*return*/];
                }
            });
        });
    };
    ParticleSystem.prototype.HideWelcomeText = function () {
        if (!this.WelcomePoints || !this.scene)
            return;
        this.scene.remove(this.WelcomePoints);
        this.WelcomePoints.geometry.dispose();
        this.WelcomePoints.material.dispose();
        this.WelcomePoints = undefined;
    };
    /** 平滑淡出欢迎文字（上移 + 渐隐 + 轻微缩小 + 余影），结束后移除 */
    ParticleSystem.prototype.ExitWelcome = function (opts) {
        return __awaiter(this, void 0, void 0, function () {
            var dur, up, sMul, pts, mat, start, end;
            var _this = this;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!this.WelcomePoints)
                            return [2 /*return*/];
                        dur = (_a = opts === null || opts === void 0 ? void 0 : opts.duration) !== null && _a !== void 0 ? _a : 800;
                        up = (_b = opts === null || opts === void 0 ? void 0 : opts.up) !== null && _b !== void 0 ? _b : 80;
                        sMul = (_c = opts === null || opts === void 0 ? void 0 : opts.scale) !== null && _c !== void 0 ? _c : 0.90;
                        // 停掉文字序列，防止过程中切帧
                        this.StopWelcomeSequence();
                        // 生成“余影”更丝滑
                        this._spawnWelcomeGhostAndFadeOut(Math.max(500, dur * 0.7));
                        pts = this.WelcomePoints;
                        mat = pts.material;
                        start = {
                            y: pts.position.y,
                            o: mat.opacity,
                            s: pts.scale.x,
                        };
                        end = { y: start.y + up, o: 0.0, s: start.s * sMul };
                        // 用已有的 Tween 组，不卡帧
                        return [4 /*yield*/, new Promise(function (resolve) {
                                var state = { t: 0 };
                                new tween_js_1.default.Tween(state, _this.MainParticleGroup)
                                    .to({ t: 1 }, dur)
                                    .easing(tween_js_1.default.Easing.Quadratic.InOut)
                                    .onUpdate(function () {
                                    var k = state.t;
                                    // 线性插值（位置/缩放），透明度也随之下降
                                    pts.position.y = start.y + (end.y - start.y) * k;
                                    var ss = start.s + (end.s - start.s) * k;
                                    pts.scale.setScalar(ss);
                                    mat.opacity = start.o + (end.o - start.o) * k;
                                    mat.needsUpdate = true;
                                })
                                    .onComplete(function () {
                                    // 完成后彻底移除与释放
                                    _this.HideWelcomeText();
                                    resolve();
                                })
                                    .start();
                            })];
                    case 1:
                        // 用已有的 Tween 组，不卡帧
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ParticleSystem.prototype._buildTextTarget = function (text, count, opts) {
        return __awaiter(this, void 0, void 0, function () {
            var font, size, height, lineHeight, lines, geos, merged, tempMesh, sampler, positions, v, i, box;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            new FontLoader_js_1.FontLoader().load('/fonts/helvetiker.json', resolve, undefined, reject);
                        })];
                    case 1:
                        font = _d.sent();
                        size = (_a = opts === null || opts === void 0 ? void 0 : opts.size) !== null && _a !== void 0 ? _a : 160;
                        height = (_b = opts === null || opts === void 0 ? void 0 : opts.height) !== null && _b !== void 0 ? _b : 30;
                        lineHeight = (_c = opts === null || opts === void 0 ? void 0 : opts.lineHeight) !== null && _c !== void 0 ? _c : (size * 1.2);
                        lines = text.split('\n');
                        geos = [];
                        lines.forEach(function (line, idx) {
                            var g = new TextGeometry_js_1.TextGeometry(line, {
                                font: font,
                                size: size,
                                height: height,
                                curveSegments: 8,
                                bevelEnabled: true, bevelThickness: 4, bevelSize: 2, bevelSegments: 2,
                            });
                            g.center();
                            g.translate(0, -(idx * lineHeight), 0); // 向下堆叠
                            geos.push(g);
                        });
                        merged = (0, BufferGeometryUtils_js_1.mergeGeometries)(geos, false);
                        tempMesh = new THREE.Mesh(merged, new THREE.MeshBasicMaterial());
                        sampler = new MeshSurfaceSampler_js_1.MeshSurfaceSampler(tempMesh).build();
                        positions = new Float32Array(count * 3);
                        v = new THREE.Vector3();
                        for (i = 0; i < count; i++) {
                            sampler.sample(v);
                            v.z += (Math.random() - 0.5) * 12;
                            positions[i * 3 + 0] = v.x;
                            positions[i * 3 + 1] = v.y;
                            positions[i * 3 + 2] = v.z;
                        }
                        // 原始宽度：用于初次自适配（只需从第一次 target 拿）
                        if (!this.WelcomePoints) {
                            box = new THREE.Box3().setFromBufferAttribute(new THREE.BufferAttribute(positions, 3));
                            this.WelcomeBaseWidth = box.max.x - box.min.x;
                        }
                        geos.forEach(function (g) { return g.dispose(); });
                        merged.dispose();
                        return [2 /*return*/, positions];
                }
            });
        });
    };
    ParticleSystem.prototype.PlayWelcomeSequence = function (texts, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, texts_1, t, arr, geo, mat, pos, tgt, n, i, tL;
            var _this = this;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (this._welcomePlaying)
                            return [2 /*return*/];
                        this._welcomePlaying = true;
                        this._welcomeCount = (_a = options === null || options === void 0 ? void 0 : options.count) !== null && _a !== void 0 ? _a : this._welcomeCount;
                        this._welcomeTransMs = (_b = options === null || options === void 0 ? void 0 : options.transitionMs) !== null && _b !== void 0 ? _b : this._welcomeTransMs;
                        this._welcomeDwellMs = (_c = options === null || options === void 0 ? void 0 : options.dwellMs) !== null && _c !== void 0 ? _c : this._welcomeDwellMs;
                        // 预构建所有目标
                        this._welcomeTargets = [];
                        _i = 0, texts_1 = texts;
                        _g.label = 1;
                    case 1:
                        if (!(_i < texts_1.length)) return [3 /*break*/, 4];
                        t = texts_1[_i];
                        return [4 /*yield*/, this._buildTextTarget(t, this._welcomeCount)];
                    case 2:
                        arr = _g.sent();
                        this._welcomeTargets.push(arr);
                        _g.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (this._welcomeTargets.length === 0)
                            return [2 /*return*/];
                        // 创建/复用 Points
                        if (!this.WelcomePoints) {
                            geo = new THREE.BufferGeometry();
                            geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this._welcomeTargets[0]), 3) // ✅ 确保是 Float32Array
                            );
                            mat = new THREE.PointsMaterial({
                                size: (_d = options === null || options === void 0 ? void 0 : options.pointSize) !== null && _d !== void 0 ? _d : 1,
                                transparent: true,
                                opacity: 0.95,
                                depthWrite: false,
                                blending: THREE.AdditiveBlending,
                            });
                            this.WelcomePoints = new THREE.Points(geo, mat);
                            (_e = this.scene) === null || _e === void 0 ? void 0 : _e.add(this.WelcomePoints);
                            this.fitObjectToViewWidth(this.WelcomePoints, this.WelcomeBaseWidth, (_f = options === null || options === void 0 ? void 0 : options.occupy) !== null && _f !== void 0 ? _f : 0.30);
                        }
                        else {
                            pos = this.WelcomePoints.geometry.getAttribute('position');
                            tgt = this._welcomeTargets[0];
                            n = Math.min(pos.array.length, tgt.length);
                            for (i = 0; i < n; i++)
                                pos.array[i] = tgt[i];
                            pos.needsUpdate = true;
                        }
                        if (this._welcomeTransitioning) {
                            tL = this._welcomeLerp.t;
                            // 连续两帧 >= 0.999，避免抖动/重复触发
                            if (tL >= 0.999 && this._welcomeLastT >= 0.999) {
                                this._welcomeTransitioning = false;
                                this._armDwellThenGoNext();
                                console.log('[Welcome] transition fallback complete, arm dwell');
                            }
                            this._welcomeLastT = tL;
                        }
                        // 初始化为第 0 段，然后安排 “停留→切下一段”
                        this._welcomeIdx = 0;
                        this._welcomeFrom = undefined;
                        this._welcomeTo = undefined;
                        this._welcomeLerp.t = 1;
                        // 先停留 dwell，再开始第一个切换（到 index=1）
                        this._armDwellThenGoNext();
                        // 调试：挂到 window 便于手动切下一段/查看状态
                        // @ts-expect-error
                        window.welcomeDebug = {
                            next: function () { return _this._startTransitionTo((_this._welcomeIdx + 1) % _this._welcomeTargets.length); },
                            stop: function () { return _this.StopWelcomeSequence(); },
                            play: function () { return _this._armDwellThenGoNext(); },
                            status: function () { return ({
                                idx: _this._welcomeIdx,
                                playing: _this._welcomePlaying,
                                dwellMs: _this._welcomeDwellMs,
                                transMs: _this._welcomeTransMs,
                                targets: _this._welcomeTargets.length,
                            }); },
                        };
                        console.log('[Welcome] sequence started', window.welcomeDebug.status());
                        return [2 /*return*/];
                }
            });
        });
    };
    ParticleSystem.prototype._armDwellThenGoNext = function () {
        var _this = this;
        if (!this._welcomePlaying)
            return;
        if (this._welcomeTargets.length <= 1)
            return;
        if (this._welcomeTimer)
            window.clearTimeout(this._welcomeTimer);
        console.log('[Welcome] dwell for', this._welcomeDwellMs, 'ms at idx', this._welcomeIdx);
        this._welcomeTimer = window.setTimeout(function () {
            var next = (_this._welcomeIdx + 1) % _this._welcomeTargets.length;
            _this._startTransitionTo(next);
        }, this._welcomeDwellMs);
    };
    ParticleSystem.prototype._startTransitionTo = function (nextIndex) {
        if (!this.WelcomePoints || !this._welcomePlaying)
            return;
        // ★ 先生成换出的 ghost
        this._spawnWelcomeGhostAndFadeOut(Math.max(500, this._welcomeTransMs * 0.6));
        var posAttr = this.WelcomePoints.geometry.getAttribute('position');
        // 起始=当前 positions 的拷贝；目标=下一个 target
        this._welcomeFrom = new Float32Array(posAttr.array); // 一定要拷贝
        this._welcomeTo = this._welcomeTargets[nextIndex];
        this._welcomeIdx = nextIndex;
        // ★ 计算“距离驱动延迟”
        var a = this._welcomeFrom, b = this._welcomeTo;
        var n = Math.min(a.length, b.length);
        var maxDist = 1e-6;
        if (!this._welcomePerDelays || this._welcomePerDelays.length !== n / 3) {
            this._welcomePerDelays = new Float32Array(n / 3);
        }
        for (var i = 0; i < n; i += 3) {
            var dx = a[i] - b[i];
            var dy = a[i + 1] - b[i + 1];
            var dz = a[i + 2] - b[i + 2];
            var d = Math.hypot(dx, dy, dz);
            if (d > maxDist)
                maxDist = d;
        }
        this._welcomeMaxDist = maxDist;
        // 将总过渡时长拆出“延迟配额”和“实际位移配额”
        // 例：最多 50% 用于延迟（越远延迟越久），其余用于真正插值
        var delayQuota = this._welcomeTransMs * 0.5;
        for (var vi = 0, pi = 0; vi < n; vi += 3, ++pi) {
            var dx = a[vi] - b[vi];
            var dy = a[vi + 1] - b[vi + 1];
            var dz = a[vi + 2] - b[vi + 2];
            var d = Math.hypot(dx, dy, dz);
            var dist01 = maxDist > 0 ? d / maxDist : 0;
            var jitter = Math.random() * 0.2; // 20% 抖动噪声
            this._welcomePerDelays[pi] = delayQuota * (0.8 * dist01 + jitter * (1.0 - dist01));
        }
        // 手写时间轴
        this._welcomeStartMs = performance.now();
        this._welcomeTransitioning = true;
        console.log('[Welcome] transition to idx', nextIndex);
    };
    // 创建一个“余影”并做淡出动画；动画完自动从场景移除与释放
    ParticleSystem.prototype._spawnGhostAndFadeOut = function (duration) {
        var _this = this;
        var _a, _b;
        if (duration === void 0) { duration = 900; }
        if (!this.AnimateEffectParticle || !this.scene || !this.PointMaterial)
            return;
        // 1) 克隆几何体快照（避免主几何随后被更新）
        var snap = new THREE.BufferGeometry();
        var srcPos = this.AnimateEffectParticle.geometry.getAttribute('position');
        snap.setAttribute('position', new THREE.BufferAttribute(new Float32Array(srcPos.array), 3));
        // 2) 克隆材质：初始稍亮些、稍大些，立刻看得出“在换出”
        var ghostMat = this.PointMaterial.clone();
        ghostMat.blending = THREE.NormalBlending;
        ghostMat.premultipliedAlpha = true;
        ghostMat.depthWrite = false;
        ghostMat.toneMapped = false;
        ghostMat.opacity = Math.min(this.PointMaterial.opacity, 0.22);
        ghostMat.size = this.PointMaterial.size;
        // 如果你的点贴图本身很亮，再整体压一下颜色
        if (ghostMat.color)
            ghostMat.color.multiplyScalar(0.55);
        // 3) 生成 ghost Points
        var ghost = new THREE.Points(snap, ghostMat);
        // 与主粒子一致的位置/旋转/缩放（通常都是 0，但稳妥起见）
        ghost.position.copy(this.AnimateEffectParticle.position);
        ghost.rotation.copy(this.AnimateEffectParticle.rotation);
        ghost.scale.copy(this.AnimateEffectParticle.scale);
        (_b = ((_a = this.ghostScene) !== null && _a !== void 0 ? _a : this.scene)) === null || _b === void 0 ? void 0 : _b.add(ghost);
        // 4) 两条补间：透明度到 0、尺寸稍微变大，营造拖尾消散
        var g1 = { o: ghostMat.opacity, s: ghostMat.size };
        new tween_js_1.default.Tween(g1, this.MainParticleGroup)
            .to({ o: 0.0, s: ghostMat.size * 1.25 }, duration)
            .easing(tween_js_1.default.Easing.Quadratic.Out)
            .onUpdate(function () {
            ghostMat.opacity = g1.o;
            ghostMat.size = g1.s;
            ghostMat.needsUpdate = true;
        })
            .onComplete(function () {
            var _a;
            // 回收
            (_a = _this.scene) === null || _a === void 0 ? void 0 : _a.remove(ghost);
            ghost.geometry.dispose();
            ghostMat.dispose();
        })
            .start();
    };
    // 为欢迎词 Points 生成一个淡出余影（ghost）
    ParticleSystem.prototype._spawnWelcomeGhostAndFadeOut = function (duration) {
        var _this = this;
        var _a, _b;
        if (duration === void 0) { duration = 700; }
        if (!this.WelcomePoints || !this.scene)
            return;
        var srcPos = this.WelcomePoints.geometry.getAttribute('position');
        // 1) 快照几何
        var snap = new THREE.BufferGeometry();
        snap.setAttribute('position', new THREE.BufferAttribute(new Float32Array(srcPos.array), 3));
        // 2) 克隆材质（稍亮/稍大，容易看出“换出”）
        var baseMat = this.WelcomePoints.material;
        var ghostMat = baseMat.clone();
        ghostMat.blending = THREE.NormalBlending;
        ghostMat.premultipliedAlpha = true;
        ghostMat.depthWrite = false;
        ghostMat.toneMapped = false;
        ghostMat.opacity = Math.min(baseMat.opacity, 0.22);
        ghostMat.size = baseMat.size;
        if (ghostMat.color)
            ghostMat.color.multiplyScalar(0.55);
        // 3) ghost Points
        var ghost = new THREE.Points(snap, ghostMat);
        ghost.position.copy(this.WelcomePoints.position);
        ghost.rotation.copy(this.WelcomePoints.rotation);
        ghost.scale.copy(this.WelcomePoints.scale);
        (_b = ((_a = this.ghostScene) !== null && _a !== void 0 ? _a : this.scene)) === null || _b === void 0 ? void 0 : _b.add(ghost);
        // 4) 透明度到 0 + 尺寸轻微变大后回收
        var state = { o: ghostMat.opacity, s: ghostMat.size };
        new tween_js_1.default.Tween(state, this.MainParticleGroup)
            .to({ o: 0.0, s: ghostMat.size * 1.2 }, duration)
            .easing(tween_js_1.default.Easing.Quadratic.Out)
            .onUpdate(function () {
            ghostMat.opacity = state.o;
            ghostMat.size = state.s;
            ghostMat.needsUpdate = true;
        })
            .onComplete(function () {
            var _a, _b;
            (_b = ((_a = _this.ghostScene) !== null && _a !== void 0 ? _a : _this.scene)) === null || _b === void 0 ? void 0 : _b.remove(ghost);
            ghost.geometry.dispose();
            ghostMat.dispose();
        })
            .start();
    };
    ParticleSystem.prototype._easeInOutExpo = function (x) {
        if (x <= 0)
            return 0;
        if (x >= 1)
            return 1;
        return x < 0.5
            ? Math.pow(2, 20 * x - 10) / 2
            : (2 - Math.pow(2, -20 * x + 10)) / 2;
    };
    ParticleSystem.prototype.StopWelcomeSequence = function () {
        this._welcomePlaying = false;
        if (this._welcomeTimer)
            window.clearTimeout(this._welcomeTimer);
    };
    /**
     * 开始监听鼠标移动的钩子
     *
     * 一般在入场动画结束后调用
     */
    ParticleSystem.prototype.ListenMouseMove = function () {
        if (this.hadListenMouseMove !== true) {
            window.addEventListener('mousemove', this.rotateScene);
            this.hadListenMouseMove = true;
        }
    };
    /**
     * 取消监听鼠标移动的钩子
     */
    ParticleSystem.prototype.StopListenMouseMove = function () {
        if (this.hadListenMouseMove === true) {
            window.removeEventListener('mousemove', this.rotateScene);
            this.hadListenMouseMove = false;
        }
    };
    /**
     * 场景归中到水平位置
     *
     * @param immediately 立即归中
     */
    ParticleSystem.prototype.AlignCameraCenter = function (immediately) {
        if (immediately === void 0) { immediately = false; }
        if (immediately && this.scene != null) {
            this.scene.rotation.x = 0;
            this.scene.rotation.y = 0;
            this.mouseV = 0;
            this.mouseK = 0;
            return;
        }
        var e = new MouseEvent('click', {
            clientX: this.WIDTH / 2,
            clientY: this.HEIGHT / 2
        });
        this.rotateScene(e);
    };
    /**
   * 数组粒子去重方法
   * @param arr 待去重的数组
   * @returns {Float32Array}
   */
    ParticleSystem.prototype.VerticesDuplicateRemove = function (arr) {
        var set = new Set();
        var t = [];
        for (var i = 0; i < arr.length; i++) {
            t.push(arr[i]);
            if (i % 3 === 2) {
                set.add(t.join(','));
                t = [];
            }
        }
        var res = [];
        set.forEach(function (val) {
            res.push.apply(res, val.split(',').map(function (val) { return Number(val); }));
        });
        return new Float32Array(res);
    };
    // 更新场景旋转
    ParticleSystem.prototype._updateRotation = function () {
        if (this.scene != null) {
            this.scene.rotation.y += (this.mouseV - this.scene.rotation.y) / 50;
            this.scene.rotation.x += (this.mouseK - this.scene.rotation.x) / 50;
        }
    };
    // 循环更新渲染
    ParticleSystem.prototype.update = function (t) {
        var _this = this;
        var _a, _b, _c, _d, _e;
        // 动画插件
        tween_js_1.default.update(t);
        // 更新自己的动画组
        (_a = this.MainParticleGroup) === null || _a === void 0 ? void 0 : _a.update(t);
        // 外置的渲染函数
        (_b = this.onRendering) === null || _b === void 0 ? void 0 : _b.call(this, t);
        // 性能监测插件
        (_c = this.stats) === null || _c === void 0 ? void 0 : _c.update();
        // 场景旋转检测
        this._updateRotation();
        // 模型 update 钩子更新
        this.Models.forEach(function (val) {
            var _a, _b;
            if (val.name === _this.CurrentUseModelName && val.onAnimationFrameUpdate != null) {
                if (val.onAnimationFrameUpdate(_this.AnimateEffectParticle, _this.ParticleAnimeMap, val.geometry) === true) {
                    for (var _i = 0, BuiltinShaderAttributeName_2 = BuiltinShaderAttributeName_1.default; _i < BuiltinShaderAttributeName_2.length; _i++) {
                        var i = BuiltinShaderAttributeName_2[_i];
                        var p = (_b = (_a = _this.AnimateEffectParticle) === null || _a === void 0 ? void 0 : _a.geometry) === null || _b === void 0 ? void 0 : _b.getAttribute(i);
                        if (p != null) {
                            p.needsUpdate = true;
                        }
                    }
                }
            }
        });
        // —— 欢迎字：手写时间轴推进（逐点延迟 + 柔和缓动） —— //
        if (this.WelcomePoints && this._welcomePlaying && this._welcomeFrom && this._welcomeTo) {
            var now = performance.now();
            var dt = now - this._welcomeStartMs;
            var pos = this.WelcomePoints.geometry.getAttribute('position');
            var a = this._welcomeFrom, b = this._welcomeTo;
            var n = Math.min(pos.array.length, a.length, b.length);
            // 过渡有效区间总长：扣掉“最大延迟”
            var maxDelay = this._welcomePerDelays
                ? this._welcomePerDelays.reduce(function (m, v) { return v > m ? v : m; }, 0)
                : 0;
            var moveWindow = Math.max(1, this._welcomeTransMs - maxDelay);
            // 逐点计算“生效 t_i”，再做 Expo.InOut 缓动
            if (this._welcomePerDelays) {
                for (var vi = 0, pi = 0; vi < n; vi += 3, ++pi) {
                    var dly = this._welcomePerDelays[pi];
                    var raw = (dt - dly) / moveWindow;
                    var ti = Math.min(1, Math.max(0, raw));
                    var e = this._easeInOutExpo(ti);
                    pos.array[vi] = a[vi] + (b[vi] - a[vi]) * e;
                    pos.array[vi + 1] = a[vi + 1] + (b[vi + 1] - a[vi + 1]) * e;
                    pos.array[vi + 2] = a[vi + 2] + (b[vi + 2] - a[vi + 2]) * e;
                }
            }
            else {
                // 兼容：没有延迟数据就用全局缓动
                var tL = Math.min(1, dt / this._welcomeTransMs);
                var e = this._easeInOutExpo(tL);
                for (var i = 0; i < n; i++) {
                    pos.array[i] = a[i] + (b[i] - a[i]) * e;
                }
            }
            pos.needsUpdate = true;
            // 判定完成（全局判定：时间超过总时长即可）
            if (this._welcomeTransitioning && dt >= this._welcomeTransMs) {
                this._welcomeTransitioning = false;
                this._armDwellThenGoNext();
                console.log('[Welcome] transition finished, arm dwell for', this._welcomeDwellMs, 'ms at idx', this._welcomeIdx);
            }
        }
        // addons 执行更新
        (_d = this.addons) === null || _d === void 0 ? void 0 : _d.forEach(function (val) {
            val.update();
        });
        // 渲染器执行渲染
        // this.renderer.render(this.scene, this.camera);
        // 效果器执行渲染，如果不需要效果器请使用上方的渲染模式
        (_e = this.composer) === null || _e === void 0 ? void 0 : _e.render();
        // 循环调用
        requestAnimationFrame(function (t) {
            _this.update(t);
        });
    };
    return ParticleSystem;
}());
exports.default = ParticleSystem;
