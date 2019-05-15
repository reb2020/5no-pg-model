'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var RelationModel, newRelationModel;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                RelationModel = this.model;
                newRelationModel = new RelationModel();
                _context.next = 4;
                return newRelationModel.setData(data);

              case 4:
                this.push(newRelationModel);
                return _context.abrupt('return', newRelationModel);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function add() {
        return _ref.apply(this, arguments);
      }

      return add;
    }()
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