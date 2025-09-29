"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Typewriter;
var react_1 = __importDefault(require("react"));
function Typewriter(_a) {
    var words = _a.words, _b = _a.run, run = _b === void 0 ? true : _b, _c = _a.typeMs, typeMs = _c === void 0 ? 75 : _c, _d = _a.delMs, delMs = _d === void 0 ? 40 : _d, _e = _a.holdMs, holdMs = _e === void 0 ? 900 : _e, _f = _a.loop, loop = _f === void 0 ? true : _f;
    var _g = react_1.default.useState(0), w = _g[0], setW = _g[1]; // 当前词索引
    var _h = react_1.default.useState(0), len = _h[0], setLen = _h[1]; // 当前显示长度
    var _j = react_1.default.useState(false), del = _j[0], setDel = _j[1];
    react_1.default.useEffect(function () {
        if (!run || words.length === 0)
            return; // 暂停时不动
        var word = words[w];
        var t;
        if (!del && len < word.length) {
            t = window.setTimeout(function () { return setLen(len + 1); }, typeMs);
        }
        else if (!del && len === word.length) {
            t = window.setTimeout(function () { return setDel(true); }, holdMs);
        }
        else if (del && len > 0) {
            t = window.setTimeout(function () { return setLen(len - 1); }, delMs);
        }
        else {
            // len === 0 且 del === true，切换下一词
            var next = (w + 1) % words.length;
            if (!loop && next === 0)
                return;
            setW(next);
            setDel(false);
        }
        return function () { return window.clearTimeout(t); };
    }, [run, words, w, len, del, typeMs, delMs, holdMs, loop]);
    return (<span className="tw">
      <span className="tw-text">{words[w].slice(0, len)}</span>
      <span className="tw-caret"/>
    </span>);
}
