'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Join = function (_Array) {
  (0, _inherits3.default)(Join, _Array);

  function Join(model, join) {
    (0, _classCallCheck3.default)(this, Join);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Join.__proto__ || Object.getPrototypeOf(Join)).call(this));

    Object.setPrototypeOf(_this, Object.create(Join.prototype));
    Object.defineProperty(_this, 'model', {
      get: function get() {
        return model;
      }
    });
    Object.defineProperty(_this, 'join', {
      get: function get() {
        return join;
      }
    });
    return _this;
  }

  (0, _createClass3.default)(Join, [{
    key: 'add',
    value: function add() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var RelationModel = this.join.model;
      var ModelJoin = this.model;

      var dataJoin = Object.assign({}, data);
      dataJoin[this.join.local] = data[this.join.foreign];

      var InitModelJoin = new ModelJoin(dataJoin);

      if ((typeof data === 'undefined' ? 'undefined' : (0, _typeof3.default)(data)) === 'object' && data.constructor.name.toLowerCase() === 'object') {
        var InitRelationModel = new RelationModel(data);
        InitRelationModel._join = InitModelJoin;
        this.push(InitRelationModel);
      } else {
        data._join = InitModelJoin;
        this.push(data);
      }
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
  return Join;
}(Array);

module.exports = Join;