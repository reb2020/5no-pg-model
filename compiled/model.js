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

var _join2 = require('./join');

var _join3 = _interopRequireDefault(_join2);

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
      if (!_this._schema.primaryKeys.includes(column) && typeof _this._schema.columns[column] !== 'undefined') {
        _this._data[column] = _this._schema.columns[column];
      }
      Object.defineProperty(_this, column, {
        set: function set(v) {
          if (_this._schema.primaryKeys.includes(column)) {
            _this._schema.primaryKeysValue[column] = v;
          } else {
            _this._data[column] = _this._change[column] = v;
          }
        },
        get: function get() {
          if (_this._schema.primaryKeys.includes(column)) {
            return _this._schema.primaryKeysValue[column];
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
            RelationModel = relationData.model,
            join = relationData.join;

        Object.defineProperty(_this, name, {
          get: function get() {
            if (!_this._data[name]) {
              if (type === 'one') {
                _this._data[name] = new RelationModel();
              } else if (type === 'many') {
                _this._data[name] = new _many2.default(RelationModel);
              } else if (type === 'join') {
                _this._data[name] = new _join3.default(RelationModel, join);
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
  this._join = null;

  this.setData = function (data) {
    var filterData = _this2._schema.filter(data);
    Object.keys(filterData).forEach(function (key) {
      if (_this2._schema.primaryKeys.includes(key)) {
        _this2._schema.primaryKeysValue[key] = filterData[key];
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
            _type = relationData.type,
            _RelationModel = relationData.model,
            _join = relationData.join,
            foreign = relationData.foreign,
            local = relationData.local;

        var typeOfValue = (0, _helper.getTypeOfValue)(data[_name]);

        if (_type === 'many' && typeOfValue === 'array') {
          _this2._data[_name] = new _many2.default(_RelationModel);
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = data[_name][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var item = _step3.value;

              _this2._data[_name].add(item);
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
        } else if (_type === 'join' && typeOfValue === 'array') {
          _this2._data[_name] = new _join3.default(_RelationModel, _join);
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = data[_name][Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var _item = _step4.value;

              var joinData = Object.assign({}, _item);
              joinData[foreign] = data[local];
              _this2._data[_name].add(joinData);
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
        } else if (_type === 'one' && typeOfValue === 'object') {
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
              if (!_this2._join) {
                _context.next = 2;
                break;
              }

              return _context.abrupt('return', _this2._join.save(transactionMode));

            case 2:
              _context.prev = 2;
              db = _this2._schema.getBuilder();
              _context.next = 6;
              return _this2._schema.validate(_this2.getData());

            case 6:
              data = _context.sent;
              change = Object.keys(_this2._change);

              if (_this2._schema.isUpdatable()) {
                _context.next = 12;
                break;
              }

              db.insert(data);
              _context.next = 19;
              break;

            case 12:
              if (!change.length) {
                _context.next = 18;
                break;
              }

              updateData = {};

              change.forEach(function (key) {
                updateData[key] = data[key];
              });
              db.update(updateData);
              _context.next = 19;
              break;

            case 18:
              return _context.abrupt('return', true);

            case 19:

              _this2._change = {};

              if (!transactionMode) {
                _context.next = 23;
                break;
              }

              _context.next = 23;
              return _helper.transaction.begin();

            case 23:
              _context.next = 25;
              return db.execute();

            case 25:
              result = _context.sent;

              _this2.setData(result.rows[0]);
              _context.next = 29;
              return _this2._schema.saveCascade(_this2._data);

            case 29:
              if (!transactionMode) {
                _context.next = 32;
                break;
              }

              _context.next = 32;
              return _helper.transaction.commit();

            case 32:
              return _context.abrupt('return', true);

            case 35:
              _context.prev = 35;
              _context.t0 = _context['catch'](2);

              if (!transactionMode) {
                _context.next = 40;
                break;
              }

              _context.next = 40;
              return _helper.transaction.rollback();

            case 40:
              return _context.abrupt('return', (0, _helper.errors)(_context.t0));

            case 41:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this2, [[2, 35]]);
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
              if (!_this2._join) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt('return', _this2._join.delete(transactionMode));

            case 2:
              _context2.prev = 2;
              db = _this2._schema.getBuilder();

              if (_this2._schema.isUpdatable()) {
                _context2.next = 6;
                break;
              }

              throw new Error("Doesn't have primaryKeyValue");

            case 6:
              if (!transactionMode) {
                _context2.next = 9;
                break;
              }

              _context2.next = 9;
              return _helper.transaction.begin();

            case 9:
              _context2.next = 11;
              return _this2._schema.deleteCascade(_this2._data);

            case 11:
              _context2.next = 13;
              return db.delete().execute();

            case 13:
              if (!transactionMode) {
                _context2.next = 16;
                break;
              }

              _context2.next = 16;
              return _helper.transaction.commit();

            case 16:
              return _context2.abrupt('return', true);

            case 19:
              _context2.prev = 19;
              _context2.t0 = _context2['catch'](2);

              if (!transactionMode) {
                _context2.next = 24;
                break;
              }

              _context2.next = 24;
              return _helper.transaction.rollback();

            case 24:
              return _context2.abrupt('return', (0, _helper.errors)(_context2.t0));

            case 25:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this2, [[2, 19]]);
    }));

    return function () {
      return _ref2.apply(this, arguments);
    };
  }();

  this.toJSON = function () {
    var dataJSON = {};

    if (_this2._schema.primaryKeys.length) {
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = _this2._schema.primaryKeys[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var primaryKey = _step5.value;

          dataJSON[primaryKey] = _this2._schema.primaryKeysValue[primaryKey];
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
    }

    dataJSON = Object.assign(dataJSON, _this2.getData());

    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = _this2._schema.relations[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var relationData = _step6.value;
        var _name2 = relationData.name;

        var data = _this2._data[_name2];
        var _type2 = (0, _helper.getTypeOfValue)(data);

        if (_type2 === 'many' || _type2 === 'join') {
          dataJSON[_name2] = [];
          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = data[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              var item = _step7.value;

              dataJSON[_name2].push(item.toJSON());
            }
          } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
              }
            } finally {
              if (_didIteratorError7) {
                throw _iteratorError7;
              }
            }
          }
        } else {
          dataJSON[_name2] = data.toJSON();
        }
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6.return) {
          _iterator6.return();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }

    return dataJSON;
  };
};

module.exports = Model;