'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _noSchema = require('5no-schema');

var _noSchema2 = _interopRequireDefault(_noSchema);

var _helper = require('./helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ModelSchema = function ModelSchema(data) {
  (0, _classCallCheck3.default)(this, ModelSchema);

  _initialiseProps.call(this);

  var table = data.table,
      columns = data.columns,
      relations = data.relations;


  var modelSchemaFormat = (0, _helper.modelSchemaFormater)(columns);

  var schema = new _noSchema2.default(modelSchemaFormat.returnFormat);

  this.table = table.name;
  this.schema = table.schema || 'public';
  this.createdField = modelSchemaFormat.createdField;
  this.updatedField = modelSchemaFormat.updatedField;
  this.primaryKey = modelSchemaFormat.primaryKeyField;
  this.primaryKeyValue = null;
  this.columns = schema.fields;
  this.filter = schema.filter;
  this.validate = schema.validate;
  this.relations = (0, _helper.modelSchemaRelationsFormater)(relations);
};

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.isUpdatable = function () {
    if (_this.primaryKeyValue) {
      return true;
    }
    return false;
  };

  this.addUpdatableFields = function (data, change) {
    var nowDate = new Date();
    var returnData = {};

    if (_this.createdField && !_this.isUpdatable()) {
      returnData[_this.createdField] = nowDate;
    }

    if (_this.updatedField && Object.keys(change).length > 0) {
      returnData[_this.updatedField] = nowDate;
    }

    return Object.assign({}, data, returnData);
  };

  this.getBuilder = function () {
    var db = (0, _helper.getBuilder)(_this);

    if (_this.isUpdatable()) {
      db.where(_this.primaryKey, '=', _this.primaryKeyValue);
    }

    return db;
  };

  this.cascadeExecute = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(method, data) {
      var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, relationData, name, local, foreign, cascade, type, localValue, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, item, result, _result;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context.prev = 3;
              _iterator = _this.relations[Symbol.iterator]();

            case 5:
              if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                _context.next = 70;
                break;
              }

              relationData = _step.value;
              name = relationData.name, local = relationData.local, foreign = relationData.foreign, cascade = relationData.cascade;

              if (!cascade.includes(method)) {
                _context.next = 67;
                break;
              }

              type = (0, _helper.getTypeOfValue)(data[name]);
              localValue = data[local];


              if (local === _this.primaryKey) {
                localValue = _this.primaryKeyValue;
              }

              if (!(type === 'many')) {
                _context.next = 53;
                break;
              }

              _iteratorNormalCompletion2 = true;
              _didIteratorError2 = false;
              _iteratorError2 = undefined;
              _context.prev = 16;
              _iterator2 = data[name][Symbol.iterator]();

            case 18:
              if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                _context.next = 37;
                break;
              }

              item = _step2.value;

              if (item[foreign] !== localValue) {
                item[foreign] = localValue;
              }
              result = null;

              if (!(method === 'save')) {
                _context.next = 28;
                break;
              }

              _context.next = 25;
              return item.save(false);

            case 25:
              result = _context.sent;
              _context.next = 32;
              break;

            case 28:
              if (!(method === 'delete')) {
                _context.next = 32;
                break;
              }

              _context.next = 31;
              return item.delete(false);

            case 31:
              result = _context.sent;

            case 32:
              if (!(result !== true)) {
                _context.next = 34;
                break;
              }

              throw result;

            case 34:
              _iteratorNormalCompletion2 = true;
              _context.next = 18;
              break;

            case 37:
              _context.next = 43;
              break;

            case 39:
              _context.prev = 39;
              _context.t0 = _context['catch'](16);
              _didIteratorError2 = true;
              _iteratorError2 = _context.t0;

            case 43:
              _context.prev = 43;
              _context.prev = 44;

              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }

            case 46:
              _context.prev = 46;

              if (!_didIteratorError2) {
                _context.next = 49;
                break;
              }

              throw _iteratorError2;

            case 49:
              return _context.finish(46);

            case 50:
              return _context.finish(43);

            case 51:
              _context.next = 67;
              break;

            case 53:
              if (data[name][foreign] !== localValue) {
                data[name][foreign] = localValue;
              }
              _result = null;

              if (!(method === 'save')) {
                _context.next = 61;
                break;
              }

              _context.next = 58;
              return data[name].save(false);

            case 58:
              _result = _context.sent;
              _context.next = 65;
              break;

            case 61:
              if (!(method === 'delete')) {
                _context.next = 65;
                break;
              }

              _context.next = 64;
              return data[name].delete(false);

            case 64:
              _result = _context.sent;

            case 65:
              if (!(_result !== true)) {
                _context.next = 67;
                break;
              }

              throw _result;

            case 67:
              _iteratorNormalCompletion = true;
              _context.next = 5;
              break;

            case 70:
              _context.next = 76;
              break;

            case 72:
              _context.prev = 72;
              _context.t1 = _context['catch'](3);
              _didIteratorError = true;
              _iteratorError = _context.t1;

            case 76:
              _context.prev = 76;
              _context.prev = 77;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 79:
              _context.prev = 79;

              if (!_didIteratorError) {
                _context.next = 82;
                break;
              }

              throw _iteratorError;

            case 82:
              return _context.finish(79);

            case 83:
              return _context.finish(76);

            case 84:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this, [[3, 72, 76, 84], [16, 39, 43, 51], [44,, 46, 50], [77,, 79, 83]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  this.saveCascade = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(data) {
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _this.cascadeExecute('save', data);

            case 2:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this);
    }));

    return function (_x3) {
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

    return function (_x4) {
      return _ref3.apply(this, arguments);
    };
  }();
};

module.exports = ModelSchema;