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
var React = __importStar(require("react"));
var index_module_scss_1 = __importDefault(require("./index.module.scss"));
var THREE_1 = __importDefault(require("@/THREE"));
var react_1 = require("react");
var atmosphere_1 = __importDefault(require("@/THREE/atmosphere"));
var GetFlatGeometry_1 = __importDefault(require("@/utils/GetFlatGeometry"));
var three_1 = require("three");
var VerticesDuplicateRemove_1 = __importDefault(require("@/utils/VerticesDuplicateRemove"));
var FBXLoader_1 = require("three/examples/jsm/loaders/FBXLoader");
var OverlayText_1 = __importDefault(require("./OverlayText"));
// ------- 4 个内容页与模型映射（不含 welcome）-------
var PAGES = [
    { key: 'about', label: 'ABOUT ME', model: 'ball' },
    { key: 'projects', label: 'PROJECTS', model: 'cone' },
    { key: 'experience', label: 'EXPERIENCE', model: 'cube' },
    { key: 'contact', label: 'CONTACT', model: 'wave' },
];
function IndexPage() {
    var _this = this;
    // ====== 触摸滑动切页（移动端） ======
    var touchStartYRef = React.useRef(null);
    var TOUCH_STEP = 60;
    var onTouchStart = function (e) {
        touchStartYRef.current = e.touches[0].clientY;
    };
    var onTouchEnd = function (e) {
        if (touchStartYRef.current == null)
            return;
        var dy = e.changedTouches[0].clientY - touchStartYRef.current;
        touchStartYRef.current = null;
        if (Math.abs(dy) < TOUCH_STEP || wheelLockRef.current)
            return;
        var dir = dy < 0 ? 1 : -1; // 上滑=下一页
        var cur = idxRef.current;
        if (cur === -1) {
            if (dir > 0) {
                setIndex(0);
                wheelLockRef.current = true;
                window.setTimeout(function () { wheelLockRef.current = false; }, MORPH_LOCK_MS);
            }
            return;
        }
        var next = Math.max(0, Math.min(3, cur + dir));
        if (next !== cur) {
            setIndex(next);
            wheelLockRef.current = true;
            window.setTimeout(function () { wheelLockRef.current = false; }, MORPH_LOCK_MS);
        }
    };
    var wrapper = (0, react_1.useRef)(null);
    // 粒子系统持久引用
    var mainRef = React.useRef(null);
    // 当前页索引的“唯一真源”
    var idxRef = React.useRef(-1);
    var _a = React.useState(-1), pageIndex = _a[0], setPageIndex = _a[1];
    // ====== 移动端判定 ======
    var _b = React.useState(function () {
        return typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false;
    }), isMobile = _b[0], setIsMobile = _b[1];
    // 滚轮节流
    var wheelAccumRef = React.useRef(0);
    var wheelLockRef = React.useRef(false);
    var WHEEL_STEP = 200;
    var MORPH_LOCK_MS = 1000;
    var _c = React.useState(false), uiShow = _c[0], setUiShow = _c[1];
    // --------- Atmosphere / Tween：只创建一次 ---------
    var TurnBasicNum = { firefly: 0.002 };
    var base = 0.002;
    var al = 2000;
    var _d = React.useMemo(function () {
        var A1 = new atmosphere_1.default({
            longestDistance: al,
            particleSum: 500,
            axis: 'x',
            baseSpeed: base,
            accel: { upTo: 0.02, upMs: 1250, downTo: base, downMs: 500 },
            renderUpdate: function (Point, speed) {
                if (speed === void 0) { speed = base; }
                Point.rotation.x -= speed;
            },
            callback: function (Point) { Point.position.z = -1 * al; },
        });
        var A2 = new atmosphere_1.default({
            longestDistance: al,
            particleSum: 500,
            axis: 'y',
            baseSpeed: base,
            accel: { upTo: 0.02, upMs: 1250, downTo: base, downMs: 500 },
            renderUpdate: function (Point, speed) {
                if (speed === void 0) { speed = base; }
                Point.rotation.y += speed;
                Point.position.y = -0.2 * al;
                Point.position.z = -1 * al;
            },
        });
        var A3 = new atmosphere_1.default({
            longestDistance: al,
            particleSum: 500,
            axis: 'z',
            baseSpeed: base / 2,
            accel: { upTo: 0.02, upMs: 1250, downTo: base / 2, downMs: 500 },
            renderUpdate: function (Point, speed) {
                if (speed === void 0) { speed = base / 2; }
                Point.rotation.z += speed;
                Point.position.z = -1.2 * al;
            },
        });
        return { Atomsphere1: A1, Atomsphere2: A2, Atomsphere3: A3 };
    }, []), Atomsphere1 = _d.Atomsphere1, Atomsphere2 = _d.Atomsphere2, Atomsphere3 = _d.Atomsphere3;
    // --------- 模型定义：只创建一次 ---------
    var scaleNum = 600;
    var Q = 0;
    var Models = React.useMemo(function () { return [
        {
            name: 'cube',
            path: new URL('../../THREE/models/examples/cube.fbx', import.meta.url).href,
            onLoadComplete: function (Geometry) {
                var s = 400;
                Geometry.scale(s, s, s);
                Geometry.translate(-700, 0, -100);
            },
            loader: {
                loaderInstance: new FBXLoader_1.FBXLoader(),
                load: function (group) {
                    var g = new three_1.BufferGeometry();
                    var arr = new Float32Array([]);
                    for (var _i = 0, _a = group.children; _i < _a.length; _i++) {
                        var i = _a[_i];
                        // @ts-expect-error
                        arr = new Float32Array(__spreadArray(__spreadArray([], arr, true), i.geometry.attributes.position.array, true));
                    }
                    g.setAttribute('position', new three_1.Float32BufferAttribute((0, VerticesDuplicateRemove_1.default)(arr), 3));
                    return g;
                }
            }
        },
        {
            name: 'ball',
            path: new URL('../../THREE/models/examples/ball.obj', import.meta.url).href,
            onLoadComplete: function (Geometry) {
                Geometry.scale(scaleNum, scaleNum, scaleNum);
                Geometry.translate(-700, 0, -100);
            },
            onEnterStart: function () { console.log('ball enter start'); },
            onEnterEnd: function () { console.log('ball enter end'); }
        },
        {
            name: 'wave',
            geometry: (0, GetFlatGeometry_1.default)(),
            onAnimationFrameUpdate: function (PerfromPoint, TweenList) {
                var p = PerfromPoint.geometry.getAttribute('position');
                TweenList.forEach(function (val, i) {
                    if (val.isPlaying === false) {
                        p.setY(i, Math.sin((i + 1 + Q) * 0.3) * 50 + Math.sin((i + Q) * 0.5) * 50 - 500);
                    }
                });
                Q += 0.08;
                return true;
            }
        },
        {
            name: 'cone',
            path: new URL('../../THREE/models/examples/cone.obj', import.meta.url).href,
            onLoadComplete: function (Geometry) {
                Geometry.scale(scaleNum, scaleNum, scaleNum);
                Geometry.translate(800, 100, -300);
            }
        }
    ]; }, []); // eslint-disable-line react-hooks/exhaustive-deps
    // 调试：window.changeModel
    // @ts-expect-error
    window.changeModel = function (name) {
        var _a;
        (_a = mainRef.current) === null || _a === void 0 ? void 0 : _a.ChangeModel(name);
    };
    // 统一设置页：更新 ref + state + 模型（先淡出，再切页，再淡入）
    var setIndex = React.useCallback(function (v, opts) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var cur = idxRef.current;
        if (v >= 0 && !(opts === null || opts === void 0 ? void 0 : opts.keepWelcome)) {
            (_b = (_a = mainRef.current) === null || _a === void 0 ? void 0 : _a.StopWelcomeSequence) === null || _b === void 0 ? void 0 : _b.call(_a);
            (_d = (_c = mainRef.current) === null || _c === void 0 ? void 0 : _c.HideWelcomeText) === null || _d === void 0 ? void 0 : _d.call(_c);
        }
        var curKey = cur >= 0 ? PAGES[cur].key : null;
        var fadeUnitsByPage = {
            about: 5,
            projects: 6,
            experience: 9,
            contact: 4,
        };
        var BASE_MS = 800;
        var STEP_MS = 120;
        var EXIT_MS = curKey ? BASE_MS + (fadeUnitsByPage[curKey] - 1) * STEP_MS + 50 : 0;
        if (cur >= 0 && v !== cur) {
            var target = PAGES[v].model;
            (_f = (_e = mainRef.current) === null || _e === void 0 ? void 0 : _e.ChangeModel) === null || _f === void 0 ? void 0 : _f.call(_e, target);
            setUiShow(false);
            window.setTimeout(function () {
                idxRef.current = v;
                setPageIndex(v);
                window.setTimeout(function () { return setUiShow(true); }, 20);
            }, Math.max(EXIT_MS, 900));
            return;
        }
        idxRef.current = v;
        setPageIndex(v);
        if (v >= 0) {
            var target = PAGES[v].model;
            (_h = (_g = mainRef.current) === null || _g === void 0 ? void 0 : _g.ChangeModel) === null || _h === void 0 ? void 0 : _h.call(_g, target);
            setUiShow(false);
            window.setTimeout(function () { return setUiShow(true); }, 20);
        }
    }, []);
    // 侧栏点击：仅 0..3
    var gotoPage = React.useCallback(function (v) {
        setIndex(v);
    }, [setIndex]);
    // 只在挂载时：创建粒子系统
    (0, react_1.useEffect)(function () {
        if (!mainRef.current && wrapper.current) {
            mainRef.current = new THREE_1.default({
                CanvasWrapper: wrapper.current,
                Models: Models,
                addons: [Atomsphere1, Atomsphere2, Atomsphere3],
                onModelsFinishedLoad: function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                (_a = mainRef.current) === null || _a === void 0 ? void 0 : _a.ListenMouseMove();
                                return [4 /*yield*/, ((_b = mainRef.current) === null || _b === void 0 ? void 0 : _b.PlayWelcomeSequence([
                                        "W E L C O M E",
                                        "Z A C  C H E N",
                                        "P O R T F O L I O",
                                        "C E @ U W",
                                    ], isMobile
                                        ? { count: 2000, pointSize: 1.2, occupy: 0.45, transitionMs: 900, dwellMs: 2400 }
                                        : { count: 10000, pointSize: 1.0, occupy: 0.30, transitionMs: 1000, dwellMs: 3000 }))];
                            case 1:
                                _c.sent();
                                return [2 /*return*/];
                        }
                    });
                }); }
            });
        }
        var goFromWelcomeTo0 = function () {
            var _a;
            if (wheelLockRef.current)
                return;
            wheelLockRef.current = true;
            (_a = mainRef.current) === null || _a === void 0 ? void 0 : _a.ExitWelcome({ duration: 800, up: 80, scale: 0.90 });
            setTimeout(function () {
                setIndex(0, { keepWelcome: true });
            }, 500);
            setTimeout(function () { wheelLockRef.current = false; }, MORPH_LOCK_MS);
        };
        var onWheel = function (e) {
            wheelAccumRef.current += e.deltaY;
            if (wheelLockRef.current)
                return;
            if (Math.abs(wheelAccumRef.current) < WHEEL_STEP)
                return;
            var dir = e.deltaY > 0 ? 1 : -1;
            wheelAccumRef.current = 0;
            var cur = idxRef.current;
            if (cur === -1) {
                if (dir > 0) {
                    goFromWelcomeTo0();
                }
                return;
            }
            var next = Math.max(0, Math.min(3, cur + dir));
            if (next !== cur) {
                setIndex(next);
                wheelLockRef.current = true;
                setTimeout(function () { wheelLockRef.current = false; }, MORPH_LOCK_MS);
            }
        };
        window.addEventListener('wheel', onWheel, { passive: true });
        return function () {
            var _a;
            window.removeEventListener('wheel', onWheel);
            (_a = mainRef.current) === null || _a === void 0 ? void 0 : _a.StopListenMouseMove();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    // 监听媒体查询和触摸事件（移动端）
    (0, react_1.useEffect)(function () {
        var _a;
        if (typeof window === 'undefined')
            return;
        var mq = window.matchMedia('(max-width: 768px)');
        var onChange = function () { return setIsMobile(mq.matches); };
        (_a = mq.addEventListener) === null || _a === void 0 ? void 0 : _a.call(mq, 'change', onChange);
        if (mq.matches) {
            window.addEventListener('touchstart', onTouchStart, { passive: true });
            window.addEventListener('touchend', onTouchEnd, { passive: true });
        }
        return function () {
            var _a;
            (_a = mq.removeEventListener) === null || _a === void 0 ? void 0 : _a.call(mq, 'change', onChange);
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, []);
    return (<div className={index_module_scss_1.default.index_page}>
      {/* 主 three 画布容器 */}
      <div className={index_module_scss_1.default.canvas_wrapper} ref={wrapper}/>

      {/* 欢迎页覆盖层（只出现一次，不可回退） */}
      {pageIndex === -1 && (<div className={index_module_scss_1.default.welcome_overlay}>
          <h1 className={index_module_scss_1.default.hero_title}></h1>
          <p className={index_module_scss_1.default.hero_hint}>Scroll to explore</p>
        </div>)}

      {/* 左侧侧栏 + 文字叠层：进入内容页后显示 */}
      {pageIndex >= 0 && (<>
          <OverlayText_1.default active={PAGES[pageIndex].key} show={uiShow}/>

          {/* 桌面侧栏 / 移动底部圆点 */}
          {!isMobile ? (<nav className={index_module_scss_1.default.sidebar} data-show>
              <ul>
                {PAGES.map(function (p, i) {
                    var active = i === pageIndex;
                    return (<li key={p.key} className={active ? index_module_scss_1.default.active : ''} onClick={function () { return gotoPage(i); }}>
                      <span className={index_module_scss_1.default.dot}/>
                      <span className={index_module_scss_1.default.label}>{p.label}</span>
                    </li>);
                })}
              </ul>
            </nav>) : (<nav className={index_module_scss_1.default.mobile_nav} data-show>
              <ul>
                {PAGES.map(function (p, i) {
                    var active = i === pageIndex;
                    return (<li key={p.key} className={active ? index_module_scss_1.default.active : ''} onClick={function () { return gotoPage(i); }} aria-label={p.label}>
                      <span className={index_module_scss_1.default.dot}/>
                    </li>);
                })}
              </ul>
            </nav>)}
        </>)}
    </div>);
}
exports.default = IndexPage;
