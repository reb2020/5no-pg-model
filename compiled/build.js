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
var TYPE_JOIN = 'join';

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
  this._join = null;
  this._json = false;
  this._isRelations = false;

  this._relations = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(item) {
      var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, relationData, name, type, model, foreign, local, join, data;

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
                _context.next = 23;
                break;
              }

              relationData = _step.value;
              name = relationData.name, type = relationData.type, model = relationData.model, foreign = relationData.foreign, local = relationData.local, join = relationData.join;
              data = new Build(model);

              data._isRelations = true;

              if (type === TYPE_JOIN) {
                data._join = {
                  builder: (0, _helper.getBuilder)(join.model.getSchema()),
                  local: join.local,
                  foreign: join.foreign
                };
              }

              if (!(type === TYPE_ONE)) {
                _context.next = 17;
                break;
              }

              _context.next = 14;
              return data.findOne(foreign, item[local]);

            case 14:
              item[name] = _context.sent;
              _context.next = 20;
              break;

            case 17:
              _context.next = 19;
              return data.findAll(foreign, item[local]);

            case 19:
              item[name] = _context.sent;

            case 20:
              _iteratorNormalCompletion = true;
              _context.next = 5;
              break;

            case 23:
              _context.next = 29;
              break;

            case 25:
              _context.prev = 25;
              _context.t0 = _context['catch'](3);
              _didIteratorError = true;
              _iteratorError = _context.t0;

            case 29:
              _context.prev = 29;
              _context.prev = 30;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 32:
              _context.prev = 32;

              if (!_didIteratorError) {
                _context.next = 35;
                break;
              }

              throw _iteratorError;

            case 35:
              return _context.finish(32);

            case 36:
              return _context.finish(29);

            case 37:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this, [[3, 25, 29, 37], [30,, 32, 36]]);
    }));

    return function (_x2) {
      return _ref.apply(this, arguments);
    };
  }();

  this._initDb = function (fields, values) {
    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : TYPE_MANY;

    var db = (0, _helper.getBuilder)(_this._schema);

    if (_this._join) {
      db.select();
      _this._join.builder.select(['*']);
      db.innerJoin(_this._join.builder, _this._join.local, _this._join.foreign);
    } else {
      db.select(['*']);
    }

    var index = 0;
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = fields[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var field = _step2.value;

        if (values[index] === null) {
          db.whereIsNull(field);
        } else {
          db.where(field, '=', values[index]);
        }
        index++;
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    if (type === TYPE_ONE) {
      db.limit(1);
    }

    return db;
  };

  this._execute = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(fields, values) {
      var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : TYPE_MANY;

      var Model, db, result, returnData, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, item, modelData;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              Model = _this._model;
              db = _this._initDb(fields, values, type);
              _context2.next = 4;
              return db.execute();

            case 4:
              result = _context2.sent;
              returnData = [];
              _iteratorNormalCompletion3 = true;
              _didIteratorError3 = false;
              _iteratorError3 = undefined;
              _context2.prev = 9;
              _iterator3 = result.rows[Symbol.iterator]();

            case 11:
              if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                _context2.next = 34;
                break;
              }

              item = _step3.value;
              _context2.next = 15;
              return _this._relations(item);

            case 15:
              if (!(_this._isRelations === true)) {
                _context2.next = 19;
                break;
              }

              returnData.push(item);
              _context2.next = 31;
              break;

            case 19:
              modelData = new Model();
              _context2.next = 22;
              return modelData.setData(item);

            case 22:
              if (!(_this._json === true)) {
                _context2.next = 30;
                break;
              }

              _context2.t0 = returnData;
              _context2.next = 26;
              return modelData.toJSON();

            case 26:
              _context2.t1 = _context2.sent;

              _context2.t0.push.call(_context2.t0, _context2.t1);

              _context2.next = 31;
              break;

            case 30:
              returnData.push(modelData);

            case 31:
              _iteratorNormalCompletion3 = true;
              _context2.next = 11;
              break;

            case 34:
              _context2.next = 40;
              break;

            case 36:
              _context2.prev = 36;
              _context2.t2 = _context2['catch'](9);
              _didIteratorError3 = true;
              _iteratorError3 = _context2.t2;

            case 40:
              _context2.prev = 40;
              _context2.prev = 41;

              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }

            case 43:
              _context2.prev = 43;

              if (!_didIteratorError3) {
                _context2.next = 46;
                break;
              }

              throw _iteratorError3;

            case 46:
              return _context2.finish(43);

            case 47:
              return _context2.finish(40);

            case 48:
              if (!(type === TYPE_ONE)) {
                _context2.next = 52;
                break;
              }

              return _context2.abrupt('return', returnData[0]);

            case 52:
              return _context2.abrupt('return', returnData);

            case 53:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this, [[9, 36, 40, 48], [41,, 43, 47]]);
    }));

    return function (_x4, _x5) {
      return _ref2.apply(this, arguments);
    };
  }();

  this.find = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
      for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
        values[_key] = arguments[_key];
      }

      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              return _context3.abrupt('return', _this._execute(_this._schema.primaryKeys, values, TYPE_ONE));

            case 1:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this);
    }));

    return function () {
      return _ref3.apply(this, arguments);
    };
  }();

  this.findOne = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(field, value) {
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              return _context4.abrupt('return', _this._execute([field], [value], TYPE_ONE));

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
              return _context5.abrupt('return', _this._execute([field], [value], TYPE_MANY));

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