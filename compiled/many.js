'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Many = function (_Array) {
  (0, _inherits3.default)(Many, _Array);

  function Many(model) {
    (0, _classCallCheck3.default)(this, Many);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Many.__proto__ || Object.getPrototypeOf(Many)).call(this));

    Object.setPrototypeOf(_this, Object.create(Many.prototype));
    Object.defineProperty(_this, 'model', {
      get: function get() {
        return model;
      }
    });
    return _this;
  }

  (0, _createClass3.default)(Many, [{
    key: 'add',
    value: function add() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var RelationModel = this.model;
      var newRelationModel = new RelationModel(data);
      this.push(newRelationModel);
      return newRelationModel;
    }
  }, {
    key: 'fetch',
    value: function fetch(field, value) {
      return this.filter(function (item) {
        return item[field] === value;
      });
    }
  }, {
    key: 'fetchOne',
    value: function fetchOne(field, value) {
      return this.fetch(field, value).pop();
    }
  }]);
  return Many;
}(Array);

module.exports = Many;