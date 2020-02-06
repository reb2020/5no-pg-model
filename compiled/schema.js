'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _schema = require('@5no/schema');

var _schema2 = _interopRequireDefault(_schema);

var _helper = require('./helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ModelSchema = function ModelSchema(data) {
  (0, _classCallCheck3.default)(this, ModelSchema);

  _initialiseProps.call(this);

  var table = data.table,
      columns = data.columns,
      relations = data.relations;


  var modelSchemaFormat = (0, _helper.modelSchemaFormater)(columns);

  var schema = new _schema2.default(modelSchemaFormat.returnFormat);

  this.table = table.name;
  this.schema = table.schema || 'public';
  this.type = null;
  this.createdField = modelSchemaFormat.createdField;
  this.updatedField = modelSchemaFormat.updatedField;
  this.primaryKeys = modelSchemaFormat.primaryKeyFields;
  this.primaryKeysValue = {};
  this.columns = schema.fields;
  this.filter = schema.filter;
  this.validate = schema.validate;
  this.relations = (0, _helper.modelSchemaRelationsFormater)(relations);
};

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.getPrimaryKeysValues = function () {
    var values = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.keys(_this.primaryKeysValue)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var valueKey = _step.value;

        values.push(_this.primaryKeysValue[valueKey]);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return values;
  };

  this.setPrimaryKeysValues = function (data) {
    _this.primaryKeysValue = data;
  };

  this.isUpdatable = function () {
    if (Object.keys(_this.primaryKeysValue).length && _this.type !== 'join') {
      return true;
    }
    return false;
  };

  this.addUpdatableFields = function (data, change) {
    var allSave = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var nowDate = _moment2.default.utc();
    var returnData = {};

    if (_this.createdField && !_this.isUpdatable()) {
      returnData[_this.createdField] = nowDate;
    }

    if (_this.updatedField && (Object.keys(change).length > 0 || allSave === true)) {
      returnData[_this.updatedField] = nowDate;
    }

    return Object.assign({}, data, returnData, _this.type === 'join' ? _this.primaryKeysValue : {});
  };

  this.getBuilder = function () {
    var db = (0, _helper.getBuilder)(_this, function (rows) {
      return rows;
    });

    if (_this.isUpdatable()) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _this.primaryKeys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var primaryKey = _step2.value;

          db.where(primaryKey, '=', _this.primaryKeysValue[primaryKey]);
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
    }

    if (_this.type === 'join') {
      var doUpdate = [];
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = Object.keys(_this.columns)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var field = _step3.value;

          if (field !== _this.createdField && !_this.primaryKeys.includes(field)) {
            doUpdate.push(field);
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      db.onConflict(_this.primaryKeys);

      if (doUpdate.length) {
        db.doUpdate(doUpdate);
      } else {
        db.doNothing();
      }
    }

    return db;
  };

  this.cascadeExecute = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(method, data) {
      var allSave = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, relationData, name, local, foreign, cascade, type, localValue, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, item, result, _result;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _iteratorNormalCompletion4 = true;
              _didIteratorError4 = false;
              _iteratorError4 = undefined;
              _context.prev = 3;
              _iterator4 = _this.relations[Symbol.iterator]();

            case 5:
              if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                _context.next = 72;
                break;
              }

              relationData = _step4.value;
              name = relationData.name, local = relationData.local, foreign = relationData.foreign, cascade = relationData.cascade;

              if (!cascade.includes(method)) {
                _context.next = 69;
                break;
              }

              type = (0, _helper.getTypeOfValue)(data[name]);

              if (!(type === 'undefined')) {
                _context.next = 12;
                break;
              }

              return _context.abrupt('continue', 69);

            case 12:
              localValue = data[local];


              if (_this.primaryKeys.includes(local)) {
                localValue = _this.primaryKeysValue[local];
              }

              if (!(type === 'many' || type === 'join')) {
                _context.next = 55;
                break;
              }

              _iteratorNormalCompletion5 = true;
              _didIteratorError5 = false;
              _iteratorError5 = undefined;
              _context.prev = 18;
              _iterator5 = data[name][Symbol.iterator]();

            case 20:
              if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                _context.next = 39;
                break;
              }

              item = _step5.value;

              if (type === 'join') {
                if (item._joinModel[foreign] !== localValue) {
                  item._joinModel[foreign] = localValue;
                  item._joinModel._schema.type = 'join';
                }
              } else {
                if (item[foreign] !== localValue) {
                  item[foreign] = localValue;
                }
              }
              result = null;

              if (!(method === 'save')) {
                _context.next = 30;
                break;
              }

              _context.next = 27;
              return item.save(false, allSave);

            case 27:
              result = _context.sent;
              _context.next = 34;
              break;

            case 30:
              if (!(method === 'delete')) {
                _context.next = 34;
                break;
              }

              _context.next = 33;
              return item.delete(false);

            case 33:
              result = _context.sent;

            case 34:
              if (!(result !== true)) {
                _context.next = 36;
                break;
              }

              throw result;

            case 36:
              _iteratorNormalCompletion5 = true;
              _context.next = 20;
              break;

            case 39:
              _context.next = 45;
              break;

            case 41:
              _context.prev = 41;
              _context.t0 = _context['catch'](18);
              _didIteratorError5 = true;
              _iteratorError5 = _context.t0;

            case 45:
              _context.prev = 45;
              _context.prev = 46;

              if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
              }

            case 48:
              _context.prev = 48;

              if (!_didIteratorError5) {
                _context.next = 51;
                break;
              }

              throw _iteratorError5;

            case 51:
              return _context.finish(48);

            case 52:
              return _context.finish(45);

            case 53:
              _context.next = 69;
              break;

            case 55:
              if (data[name]._joinModel && data[name]._joinModel[foreign] !== localValue) {
                data[name]._joinModel[foreign] = localValue;
                data[name]._joinModel._schema.type = 'join';
              } else {
                if (data[name][foreign] !== localValue) {
                  data[name][foreign] = localValue;
                }
              }
              _result = null;

              if (!(method === 'save')) {
                _context.next = 63;
                break;
              }

              _context.next = 60;
              return data[name].save(false, allSave);

            case 60:
              _result = _context.sent;
              _context.next = 67;
              break;

            case 63:
              if (!(method === 'delete')) {
                _context.next = 67;
                break;
              }

              _context.next = 66;
              return data[name].delete(false);

            case 66:
              _result = _context.sent;

            case 67:
              if (!(_result !== true)) {
                _context.next = 69;
                break;
              }

              throw _result;

            case 69:
              _iteratorNormalCompletion4 = true;
              _context.next = 5;
              break;

            case 72:
              _context.next = 78;
              break;

            case 74:
              _context.prev = 74;
              _context.t1 = _context['catch'](3);
              _didIteratorError4 = true;
              _iteratorError4 = _context.t1;

            case 78:
              _context.prev = 78;
              _context.prev = 79;

              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }

            case 81:
              _context.prev = 81;

              if (!_didIteratorError4) {
                _context.next = 84;
                break;
              }

              throw _iteratorError4;

            case 84:
              return _context.finish(81);

            case 85:
              return _context.finish(78);

            case 86:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this, [[3, 74, 78, 86], [18, 41, 45, 53], [46,, 48, 52], [79,, 81, 85]]);
    }));

    return function (_x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();

  this.saveCascade = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(data) {
      var allSave = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _this.cascadeExecute('save', data, allSave);

            case 2:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this);
    }));

    return function (_x5) {
      return _ref2.apply(this, arguments);
    };
  }();

  this.deleteCascade = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(data) {
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _this.cascadeExecute('delete', data);

            case 2:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this);
    }));

    return function (_x7) {
      return _ref3.apply(this, arguments);
    };
  }();
};

module.exports = ModelSchema;