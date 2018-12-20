'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

var _many = require('./many');

var _many2 = _interopRequireDefault(_many);

var _helper = require('./helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Model = function () {
  function Model() {
    var _this = this;

    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Model);

    _initialiseProps.call(this);

    if (!this.constructor.schema) {
      throw new Error("Model doesn't have schema");
    }

    this._schema = this.constructor.getSchema();

    Object.keys(this._schema.columns).forEach(function (column) {
      if (column !== _this._schema.primaryKey && typeof _this._schema.columns[column] !== 'undefined') {
        _this._data[column] = _this._schema.columns[column];
      }
      Object.defineProperty(_this, column, {
        set: function set(v) {
          if (column !== _this._schema.primaryKey) {
            _this._data[column] = _this._change[column] = v;
          }
        },
        get: function get() {
          if (column === _this._schema.primaryKey) {
            return _this._schema.primaryKeyValue;
          }
          return _this._data[column] || null;
        }
      });
    });

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function _loop() {
        var relationData = _step.value;
        var name = relationData.name,
            type = relationData.type,
            RelationModel = relationData.model;

        Object.defineProperty(_this, name, {
          get: function get() {
            if (!_this._data[name]) {
              if (type === 'one') {
                _this._data[name] = new RelationModel();
              } else {
                _this._data[name] = new _many2.default(RelationModel);
              }
            }
            return _this._data[name];
          }
        });
      };

      for (var _iterator = this._schema.relations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        _loop();
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

    this.setData(data);
  }

  (0, _createClass3.default)(Model, null, [{
    key: 'getSchema',
    value: function getSchema() {
      return new _schema2.default(this.schema);
    }
  }]);
  return Model;
}();

Model.schema = null;

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this._schema = null;
  this._data = {};
  this._change = {};

  this.setData = function (data) {
    var filterData = _this2._schema.filter(data);
    Object.keys(filterData).forEach(function (key) {
      if (key === _this2._schema.primaryKey) {
        _this2._schema.primaryKeyValue = filterData[key];
      } else if (Object.keys(_this2._schema.columns).includes(key)) {
        _this2._data[key] = filterData[key];
      }
    });

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = _this2._schema.relations[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var relationData = _step2.value;
        var _name = relationData.name,
            _RelationModel = relationData.model;

        var _type = (0, _helper.getTypeOfValue)(data[_name]);

        if (_type === 'array') {
          _this2._data[_name] = new _many2.default(_RelationModel);
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = data[_name][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var item = _step3.value;

              _this2._data[_name].push(new _RelationModel(item));
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
        } else if (_type === 'object') {
          _this2._data[_name] = new _RelationModel(data[_name]);
        }
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
  };

  this.getData = function () {
    return _this2._schema.filter(_this2._schema.addUpdatableFields(_this2._data, _this2._change));
  };

  this.save = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var transactionMode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var db, data, change, updateData, result;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              db = _this2._schema.getBuilder();
              _context.next = 4;
              return _this2._schema.validate(_this2.getData());

            case 4:
              data = _context.sent;
              change = Object.keys(_this2._change);

              if (_this2._schema.isUpdatable()) {
                _context.next = 10;
                break;
              }

              db.insert(data);
              _context.next = 17;
              break;

            case 10:
              if (!change.length) {
                _context.next = 16;
                break;
              }

              updateData = {};

              change.forEach(function (key) {
                updateData[key] = data[key];
              });
              db.update(updateData);
              _context.next = 17;
              break;

            case 16:
              return _context.abrupt('return', true);

            case 17:

              _this2._change = {};

              if (!transactionMode) {
                _context.next = 21;
                break;
              }

              _context.next = 21;
              return _helper.transaction.begin();

            case 21:
              _context.next = 23;
              return db.execute();

            case 23:
              result = _context.sent;

              _this2.setData(result.rows[0]);
              _context.next = 27;
              return _this2._schema.saveCascade(_this2._data);

            case 27:
              if (!transactionMode) {
                _context.next = 30;
                break;
              }

              _context.next = 30;
              return _helper.transaction.commit();

            case 30:
              return _context.abrupt('return', true);

            case 33:
              _context.prev = 33;
              _context.t0 = _context['catch'](0);

              if (!transactionMode) {
                _context.next = 38;
                break;
              }

              _context.next = 38;
              return _helper.transaction.rollback();

            case 38:
              return _context.abrupt('return', (0, _helper.errors)(_context.t0));

            case 39:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this2, [[0, 33]]);
    }));

    return function () {
      return _ref.apply(this, arguments);
    };
  }();

  this.delete = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      var transactionMode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var db;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              db = _this2._schema.getBuilder();

              if (_this2._schema.isUpdatable()) {
                _context2.next = 4;
                break;
              }

              throw new Error("Doesn't have primaryKeyValue");

            case 4:
              if (!transactionMode) {
                _context2.next = 7;
                break;
              }

              _context2.next = 7;
              return _helper.transaction.begin();

            case 7:
              _context2.next = 9;
              return _this2._schema.deleteCascade(_this2._data);

            case 9:
              _context2.next = 11;
              return db.delete().execute();

            case 11:
              if (!transactionMode) {
                _context2.next = 14;
                break;
              }

              _context2.next = 14;
              return _helper.transaction.commit();

            case 14:
              return _context2.abrupt('return', true);

            case 17:
              _context2.prev = 17;
              _context2.t0 = _context2['catch'](0);

              if (!transactionMode) {
                _context2.next = 22;
                break;
              }

              _context2.next = 22;
              return _helper.transaction.rollback();

            case 22:
              return _context2.abrupt('return', (0, _helper.errors)(_context2.t0));

            case 23:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this2, [[0, 17]]);
    }));

    return function () {
      return _ref2.apply(this, arguments);
    };
  }();

  this.toJSON = function () {
    var dataJSON = {};

    if (_this2._schema.primaryKey) {
      dataJSON[_this2._schema.primaryKey] = _this2._schema.primaryKeyValue;
    }

    dataJSON = Object.assign(dataJSON, _this2.getData());

    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = _this2._schema.relations[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var relationData = _step4.value;
        var _name2 = relationData.name;

        var data = _this2._data[_name2];
        var _type2 = (0, _helper.getTypeOfValue)(data);

        if (_type2 === 'many') {
          dataJSON[_name2] = [];
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = data[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var item = _step5.value;

              dataJSON[_name2].push(item.toJSON());
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }
        } else {
          dataJSON[_name2] = data.toJSON();
        }
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }

    return dataJSON;
  };
};

module.exports = Model;