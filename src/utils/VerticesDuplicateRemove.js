"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VerticesDuplicateRemove;
/**
 * 数组粒子去重方法
 * @param arr 待去重的数组
 * @returns {Float32Array}
 */
function VerticesDuplicateRemove(arr) {
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
}
