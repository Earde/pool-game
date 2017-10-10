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
var Room = /** @class */ (function (_super) {
    __extends(Room, _super);
    function Room(w, h, d, material) {
        var _this = _super.call(this, new THREE.BoxGeometry(w, h, d), material) || this;
        _this.width = w;
        _this.height = h;
        _this.depth = d;
        _this.position.x = 0;
        _this.position.y = 0;
        _this.position.z = 0;
        _this.castShadow = false;
        _this.receiveShadow = true;
        return _this;
    }
    return Room;
}(THREE.Mesh));
//# sourceMappingURL=Room.js.map