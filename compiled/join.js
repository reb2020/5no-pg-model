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

var _helper = require('./helper');

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
    Object.defineProperty(_this, 'joinData', {
      get: function get() {
        return join;
      }
    });
    return _this;
  }

  (0, _createClass3.default)(Join, [{
    key: 'join',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.t0 = this;
                _context.next = 3;
                return (0, _helper.join)(this.model, this.joinData, data);

              case 3:
                _context.t1 = _context.sent;

                _context.t0.push.call(_context.t0, _context.t1);

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function join() {
        return _ref.apply(this, arguments);
      }

      return join;
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
  return Join;
}(Array);

module.exports = Join;