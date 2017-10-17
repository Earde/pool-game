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
    function Wall(w, h, d, material) {
        var _this = _super.call(this, new THREE.BoxGeometry(w, h, d), material) || this;
        _this.width = w;
        _this.height = h;
        _this.depth = d;
        _this.castShadow = true;
        _this.receiveShadow = true;
        return _this;
    }
    Wall.prototype.getBox = function () {
        return new THREE.Box3(new THREE.Vector3(this.position.x - this.width / 2, this.position.y - this.height / 2, this.position.z - this.depth / 2), new THREE.Vector3(this.position.x + this.width / 2, this.position.y + this.height / 2, this.position.z + this.depth / 2));
    };
    return Wall;
}(THREE.Mesh));
//# sourceMappingURL=Wall.js.map