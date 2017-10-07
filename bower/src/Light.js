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
var Light = (function (_super) {
    __extends(Light, _super);
    function Light(x, y, z, color) {
        var _this = _super.call(this, color, 0.25, 0, 2) || this;
        _this.position.x = x;
        _this.position.y = y;
        _this.position.z = z;
        _this.shadow.mapSize = new THREE.Vector2(2048, 2048);
        _this.castShadow = true;
        _this.receiveShadow = false;
        _this.shadow.bias = -0.0001;
        return _this;
    }
    return Light;
}(THREE.PointLight));
//# sourceMappingURL=Light.js.map