'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

var _build = require('./build');

var _build2 = _interopRequireDefault(_build);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Manager = function Manager() {
  (0, _classCallCheck3.default)(this, Manager);

  this.build = function (model) {
    var json = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    return new _build2.default(model, json);
  };
};

module.exports = {
  Manager: new Manager(),
  Model: _model2.default
};