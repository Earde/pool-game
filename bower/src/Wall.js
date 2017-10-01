///<reference path="../typings/index.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Wall = (function (_super) {
    __extends(Wall, _super);
    function Wall(w, h, d, color) {
        var _this = _super.call(this, new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ color: color })) || this;
        _this.width = 0.5;
        _this.height = 0.5;
        _this.depth = 0.5;
        _this.width = w;
        _this.height = h;
        _this.depth = d;
        _this.position.x = 0;
        _this.position.y = 0;
        _this.position.z = 0;
        return _this;
    }
    Wall.prototype.getBox = function () {
        return new THREE.Box3(new THREE.Vector3(this.position.x - this.width / 2, this.position.y - this.height / 2, this.position.z - this.depth / 2), new THREE.Vector3(this.position.x + this.width / 2, this.position.y + this.height / 2, this.position.z + this.depth / 2));
    };
    Wall.prototype.intersectsWithBox = function (box) {
        var min = this.getBox().min;
        var max = this.getBox().max;
        if (box.max.x <= min.x || box.min.x >= max.x ||
            box.max.y <= min.y || box.min.y >= max.y ||
            box.max.z <= min.z || box.min.z >= max.z) {
            return false;
        }
        return true;
    };
    return Wall;
}(THREE.Mesh));
//# sourceMappingURL=Wall.js.map