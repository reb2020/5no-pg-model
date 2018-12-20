'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _helper = require('./helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TYPE_ONE = 'one';
var TYPE_MANY = 'many';

var Build = function Build(model) {
  var json = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  (0, _classCallCheck3.default)(this, Build);

  _initialiseProps.call(this);

  this._schema = model.getSchema();
  this._model = model;
  this._json = json;
};

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this._schema = null;
  this._model = null;
  this._json = false;
  this._isRelations = false;

  this._relations = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(item) {
      var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, relationData, name, model, foreign, local, type, data;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context.prev = 3;
              _iterator = _this._schema.relations[Symbol.iterator]();

            case 5:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context.next = 22;
                break;
              }

              relationData = _step.value;
              name = relationData.name, model = relationData.model, foreign = relationData.foreign, local = relationData.local, type = relationData.type;
              data = new Build(model);

              data._isRelations = true;

              if (!(type === TYPE_ONE)) {
                _context.next = 16;
                break;
              }

              _context.next = 13;
              return data.findOne(foreign, item[local]);

            case 13:
              item[name] = _context.sent;
              _context.next = 19;
              break;

            case 16:
              _context.next = 18;
              return data.findAll(foreign, item[local]);

            case 18:
              item[name] = _context.sent;

            case 19:
              _iteratorNormalCompletion = true;
              _context.next = 5;
              break;

            case 22:
              _context.next = 28;
              break;

            case 24:
              _context.prev = 24;
              _context.t0 = _context['catch'](3);
              _didIteratorError = true;
              _iteratorError = _context.t0;

            case 28:
              _context.prev = 28;
              _context.prev = 29;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 31:
              _context.prev = 31;

              if (!_didIteratorError) {
                _context.next = 34;
                break;
              }

              throw _iteratorError;

            case 34:
              return _context.finish(31);

            case 35:
              return _context.finish(28);

            case 36:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this, [[3, 24, 28, 36], [29,, 31, 35]]);
    }));

    return function (_x2) {
      return _ref.apply(this, arguments);
    };
  }();

  this._execute = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(field, value) {
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : TYPE_MANY;

      var Model, db, result, returnData, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, item, modelData;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              Model = _this._model;
              db = (0, _helper.getBuilder)(_this._schema);

              db.select(['*']);
              db.where(field, '=', value);

              if (type === TYPE_ONE) {
                db.limit(1);
              }

              _context2.next = 7;
              return db.execute();

            case 7:
              result = _context2.sent;
              returnData = [];
              _iteratorNormalCompletion2 = true;
              _didIteratorError2 = false;
              _iteratorError2 = undefined;
              _context2.prev = 12;
              _iterator2 = result.rows[Symbol.iterator]();

            case 14:
              if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                _context2.next = 22;
                break;
              }

              item = _step2.value;
              _context2.next = 18;
              return _this._relations(item);

            case 18:
              if (_this._isRelations === true) {
                returnData.push(item);
              } else {
                modelData = new Model(item);

                if (_this._json === true) {
                  returnData.push(modelData.toJSON());
                } else {
                  returnData.push(modelData);
                }
              }

            case 19:
              _iteratorNormalCompletion2 = true;
              _context2.next = 14;
              break;

            case 22:
              _context2.next = 28;
              break;

            case 24:
              _context2.prev = 24;
              _context2.t0 = _context2['catch'](12);
              _didIteratorError2 = true;
              _iteratorError2 = _context2.t0;

            case 28:
              _context2.prev = 28;
              _context2.prev = 29;

              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }

            case 31:
              _context2.prev = 31;

              if (!_didIteratorError2) {
                _context2.next = 34;
                break;
              }

              throw _iteratorError2;

            case 34:
              return _context2.finish(31);

            case 35:
              return _context2.finish(28);

            case 36:
              if (!(type === TYPE_ONE)) {
                _context2.next = 40;
                break;
              }

              return _context2.abrupt('return', returnData[0]);

            case 40:
              return _context2.abrupt('return', returnData);

            case 41:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this, [[12, 24, 28, 36], [29,, 31, 35]]);
    }));

    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }();

  this.find = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(value) {
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              return _context3.abrupt('return', _this._execute(_this._schema.primaryKey, value, TYPE_ONE));

            case 1:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this);
    }));

    return function (_x6) {
      return _ref3.apply(this, arguments);
    };
  }();

  this.findOne = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(field, value) {
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              return _context4.abrupt('return', _this._execute(field, value, TYPE_ONE));

            case 1:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, _this);
    }));

    return function (_x7, _x8) {
      return _ref4.apply(this, arguments);
    };
  }();

  this.findAll = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(field, value) {
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              return _context5.abrupt('return', _this._execute(field, value, TYPE_MANY));

            case 1:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, _this);
    }));

    return function (_x9, _x10) {
      return _ref5.apply(this, arguments);
    };
  }();
};

module.exports = Build;