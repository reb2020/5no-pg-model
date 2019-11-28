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

var _join = require('./join');

var _join2 = _interopRequireDefault(_join);

var _helper = require('./helper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Model = function () {
  function Model() {
    var _this = this;

    (0, _classCallCheck3.default)(this, Model);
    this._parent = null;
    this._schema = null;
    this._data = {};
    this._change = {};
    this._joinName = null;
    this._joinSchema = null;
    this._joinModel = null;

    this.setData = function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(data) {
        var filterData, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, relationData, name, type, RelationModel, join, foreign, local, typeOfValue, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, item, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _item, joinItemData, _joinItemData;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this._schema.filter(data);

              case 2:
                filterData = _context.sent;

                Object.keys(filterData).forEach(function (key) {
                  if (_this._schema.primaryKeys.includes(key)) {
                    _this._schema.primaryKeysValue[key] = filterData[key];
                  } else if (Object.keys(_this._schema.columns).includes(key)) {
                    _this._data[key] = filterData[key];
                  }
                });

                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 7;
                _iterator = _this._schema.relations[Symbol.iterator]();

              case 9:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 95;
                  break;
                }

                relationData = _step.value;
                name = relationData.name, type = relationData.type, RelationModel = relationData.model, join = relationData.join, foreign = relationData.foreign, local = relationData.local;
                typeOfValue = (0, _helper.getTypeOfValue)(data[name]);

                if (!(typeof _this._data[name] !== 'undefined' && type === 'one' && typeOfValue === 'object')) {
                  _context.next = 18;
                  break;
                }

                _context.next = 16;
                return _this._data[name].setData(data[name]);

              case 16:
                _context.next = 92;
                break;

              case 18:
                if (!(type === 'many' && typeOfValue === 'array')) {
                  _context.next = 48;
                  break;
                }

                _this._data[name] = new _many2.default(RelationModel);
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context.prev = 23;
                _iterator2 = data[name][Symbol.iterator]();

              case 25:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context.next = 32;
                  break;
                }

                item = _step2.value;
                _context.next = 29;
                return _this._data[name].add(item);

              case 29:
                _iteratorNormalCompletion2 = true;
                _context.next = 25;
                break;

              case 32:
                _context.next = 38;
                break;

              case 34:
                _context.prev = 34;
                _context.t0 = _context['catch'](23);
                _didIteratorError2 = true;
                _iteratorError2 = _context.t0;

              case 38:
                _context.prev = 38;
                _context.prev = 39;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 41:
                _context.prev = 41;

                if (!_didIteratorError2) {
                  _context.next = 44;
                  break;
                }

                throw _iteratorError2;

              case 44:
                return _context.finish(41);

              case 45:
                return _context.finish(38);

              case 46:
                _context.next = 92;
                break;

              case 48:
                if (!(type === 'join' && typeOfValue === 'array')) {
                  _context.next = 80;
                  break;
                }

                _this._data[name] = new _join2.default(name, RelationModel, join);
                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _iteratorError3 = undefined;
                _context.prev = 53;
                _iterator3 = data[name][Symbol.iterator]();

              case 55:
                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                  _context.next = 64;
                  break;
                }

                _item = _step3.value;
                joinItemData = Object.assign({}, _item);

                joinItemData[foreign] = data[local];
                _context.next = 61;
                return _this._data[name].join(joinItemData);

              case 61:
                _iteratorNormalCompletion3 = true;
                _context.next = 55;
                break;

              case 64:
                _context.next = 70;
                break;

              case 66:
                _context.prev = 66;
                _context.t1 = _context['catch'](53);
                _didIteratorError3 = true;
                _iteratorError3 = _context.t1;

              case 70:
                _context.prev = 70;
                _context.prev = 71;

                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }

              case 73:
                _context.prev = 73;

                if (!_didIteratorError3) {
                  _context.next = 76;
                  break;
                }

                throw _iteratorError3;

              case 76:
                return _context.finish(73);

              case 77:
                return _context.finish(70);

              case 78:
                _context.next = 92;
                break;

              case 80:
                if (!(type === 'join' && typeOfValue === 'object')) {
                  _context.next = 88;
                  break;
                }

                _joinItemData = Object.assign({}, data[name]);

                _joinItemData[foreign] = data[local];

                _context.next = 85;
                return (0, _helper.join)(name, RelationModel, join, _joinItemData, null);

              case 85:
                _this._data[name] = _context.sent;
                _context.next = 92;
                break;

              case 88:
                if (!(type === 'one' && typeOfValue === 'object')) {
                  _context.next = 92;
                  break;
                }

                _this._data[name] = new RelationModel();
                _context.next = 92;
                return _this._data[name].setData(data[name]);

              case 92:
                _iteratorNormalCompletion = true;
                _context.next = 9;
                break;

              case 95:
                _context.next = 101;
                break;

              case 97:
                _context.prev = 97;
                _context.t2 = _context['catch'](7);
                _didIteratorError = true;
                _iteratorError = _context.t2;

              case 101:
                _context.prev = 101;
                _context.prev = 102;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 104:
                _context.prev = 104;

                if (!_didIteratorError) {
                  _context.next = 107;
                  break;
                }

                throw _iteratorError;

              case 107:
                return _context.finish(104);

              case 108:
                return _context.finish(101);

              case 109:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this, [[7, 97, 101, 109], [23, 34, 38, 46], [39,, 41, 45], [53, 66, 70, 78], [71,, 73, 77], [102,, 104, 108]]);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();

    this.getData = function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var allSave = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt('return', _this._schema.filter(_this._schema.addUpdatableFields(_this._data, _this._change, allSave)));

              case 1:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this);
      }));

      return function () {
        return _ref2.apply(this, arguments);
      };
    }();

    this.saveByData = function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(data) {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return _this.setData(data);

              case 2:
                return _context3.abrupt('return', _this.save(true, true));

              case 3:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, _this);
      }));

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }();

    this.join = function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var newData, dataJoin;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return (0, _helper.joinData)(data);

              case 2:
                newData = _context4.sent;
                dataJoin = Object.assign({}, newData);

                dataJoin[_this._joinSchema.local] = data[_this._joinSchema.foreign];

                _context4.next = 7;
                return _this._joinModel.setData(dataJoin);

              case 7:
                _context4.next = 9;
                return _this.setData(newData);

              case 9:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, _this);
      }));

      return function () {
        return _ref4.apply(this, arguments);
      };
    }();

    this.save = function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
        var transactionMode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var allSave = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var db, dataAfterFilter, data, change, isFeasible, updateData, result;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!_this._joinModel) {
                  _context5.next = 2;
                  break;
                }

                return _context5.abrupt('return', _this._joinModel.save(transactionMode));

              case 2:
                _context5.prev = 2;
                db = _this._schema.getBuilder();
                _context5.next = 6;
                return _this.getData(allSave);

              case 6:
                dataAfterFilter = _context5.sent;
                _context5.next = 9;
                return _this._schema.validate(dataAfterFilter);

              case 9:
                data = _context5.sent;
                change = Object.keys(_this._change);
                isFeasible = false;


                if (!_this._schema.isUpdatable()) {
                  isFeasible = true;
                  db.insert(data);
                } else if (change.length || allSave === true) {
                  isFeasible = true;
                  updateData = {};

                  change.forEach(function (key) {
                    updateData[key] = data[key];
                  });
                  db.update(allSave === true ? data : updateData);
                }

                _this._change = {};

                if (!transactionMode) {
                  _context5.next = 17;
                  break;
                }

                _context5.next = 17;
                return _helper.transaction.begin();

              case 17:
                if (!isFeasible) {
                  _context5.next = 23;
                  break;
                }

                _context5.next = 20;
                return db.execute();

              case 20:
                result = _context5.sent;
                _context5.next = 23;
                return _this.setData(result.rows[0]);

              case 23:
                _context5.next = 25;
                return _this._schema.saveCascade(_this._data, allSave);

              case 25:
                if (!transactionMode) {
                  _context5.next = 28;
                  break;
                }

                _context5.next = 28;
                return _helper.transaction.commit();

              case 28:
                return _context5.abrupt('return', true);

              case 31:
                _context5.prev = 31;
                _context5.t0 = _context5['catch'](2);

                if (!transactionMode) {
                  _context5.next = 36;
                  break;
                }

                _context5.next = 36;
                return _helper.transaction.rollback();

              case 36:
                return _context5.abrupt('return', (0, _helper.errors)(_context5.t0));

              case 37:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, _this, [[2, 31]]);
      }));

      return function () {
        return _ref5.apply(this, arguments);
      };
    }();

    this.delete = function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
        var transactionMode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var type, joinModelPrimaryKeysValue, deleteJoinModel, db;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (_this._parent) {
                  type = (0, _helper.getTypeOfValue)(_this._parent);


                  if (type === 'many' || type === 'join') {
                    _this._parent.removeItems(_this._schema.primaryKeys, _this._schema.getPrimaryKeysValues());
                  }
                }

                if (!_this._joinModel) {
                  _context6.next = 9;
                  break;
                }

                _this.refreshData();
                joinModelPrimaryKeysValue = _this._joinModel._schema.primaryKeysValue;
                _context6.next = 6;
                return _this._joinModel.delete(transactionMode);

              case 6:
                deleteJoinModel = _context6.sent;

                _this._joinModel._schema.primaryKeysValue = joinModelPrimaryKeysValue;
                return _context6.abrupt('return', deleteJoinModel);

              case 9:
                _context6.prev = 9;
                db = _this._schema.getBuilder();

                if (_this._schema.isUpdatable()) {
                  _context6.next = 13;
                  break;
                }

                throw new Error("Doesn't have primaryKeyValue");

              case 13:
                if (!transactionMode) {
                  _context6.next = 16;
                  break;
                }

                _context6.next = 16;
                return _helper.transaction.begin();

              case 16:
                _context6.next = 18;
                return _this._schema.deleteCascade(_this._data);

              case 18:
                _context6.next = 20;
                return db.delete().execute();

              case 20:
                if (!transactionMode) {
                  _context6.next = 23;
                  break;
                }

                _context6.next = 23;
                return _helper.transaction.commit();

              case 23:

                _this.refreshData();

                return _context6.abrupt('return', true);

              case 27:
                _context6.prev = 27;
                _context6.t0 = _context6['catch'](9);

                if (!transactionMode) {
                  _context6.next = 32;
                  break;
                }

                _context6.next = 32;
                return _helper.transaction.rollback();

              case 32:
                return _context6.abrupt('return', (0, _helper.errors)(_context6.t0));

              case 33:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, _this, [[9, 27]]);
      }));

      return function () {
        return _ref6.apply(this, arguments);
      };
    }();

    this.refreshData = function () {
      Object.keys(_this._schema.columns).forEach(function (column) {
        if (!_this._schema.primaryKeys.includes(column)) {
          _this._data[column] = _this._schema.columns[column];
        }
      });

      _this._schema.setPrimaryKeysValues({});

      _this._change = {};
    };

    this.toJSON = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
      var dataJSON, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, primaryKey, dataAfterFilter, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, relationData, name, data, type, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, item;

      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              dataJSON = {};

              if (!_this._schema.primaryKeys.length) {
                _context7.next = 21;
                break;
              }

              _iteratorNormalCompletion4 = true;
              _didIteratorError4 = false;
              _iteratorError4 = undefined;
              _context7.prev = 5;

              for (_iterator4 = _this._schema.primaryKeys[Symbol.iterator](); !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                primaryKey = _step4.value;

                dataJSON[primaryKey] = _this._schema.primaryKeysValue[primaryKey];
              }
              _context7.next = 13;
              break;

            case 9:
              _context7.prev = 9;
              _context7.t0 = _context7['catch'](5);
              _didIteratorError4 = true;
              _iteratorError4 = _context7.t0;

            case 13:
              _context7.prev = 13;
              _context7.prev = 14;

              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }

            case 16:
              _context7.prev = 16;

              if (!_didIteratorError4) {
                _context7.next = 19;
                break;
              }

              throw _iteratorError4;

            case 19:
              return _context7.finish(16);

            case 20:
              return _context7.finish(13);

            case 21:
              _context7.next = 23;
              return _this.getData();

            case 23:
              dataAfterFilter = _context7.sent;

              dataJSON = Object.assign(dataJSON, dataAfterFilter);

              _iteratorNormalCompletion5 = true;
              _didIteratorError5 = false;
              _iteratorError5 = undefined;
              _context7.prev = 28;
              _iterator5 = _this._schema.relations[Symbol.iterator]();

            case 30:
              if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                _context7.next = 75;
                break;
              }

              relationData = _step5.value;
              name = relationData.name;
              data = _this._data[name];
              type = (0, _helper.getTypeOfValue)(data);

              if (!(type === 'many' || type === 'join')) {
                _context7.next = 68;
                break;
              }

              dataJSON[name] = [];
              _iteratorNormalCompletion6 = true;
              _didIteratorError6 = false;
              _iteratorError6 = undefined;
              _context7.prev = 40;
              _iterator6 = data[Symbol.iterator]();

            case 42:
              if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                _context7.next = 52;
                break;
              }

              item = _step6.value;
              _context7.t1 = dataJSON[name];
              _context7.next = 47;
              return item.toJSON();

            case 47:
              _context7.t2 = _context7.sent;

              _context7.t1.push.call(_context7.t1, _context7.t2);

            case 49:
              _iteratorNormalCompletion6 = true;
              _context7.next = 42;
              break;

            case 52:
              _context7.next = 58;
              break;

            case 54:
              _context7.prev = 54;
              _context7.t3 = _context7['catch'](40);
              _didIteratorError6 = true;
              _iteratorError6 = _context7.t3;

            case 58:
              _context7.prev = 58;
              _context7.prev = 59;

              if (!_iteratorNormalCompletion6 && _iterator6.return) {
                _iterator6.return();
              }

            case 61:
              _context7.prev = 61;

              if (!_didIteratorError6) {
                _context7.next = 64;
                break;
              }

              throw _iteratorError6;

            case 64:
              return _context7.finish(61);

            case 65:
              return _context7.finish(58);

            case 66:
              _context7.next = 72;
              break;

            case 68:
              if (!(typeof data !== 'undefined')) {
                _context7.next = 72;
                break;
              }

              _context7.next = 71;
              return data.toJSON();

            case 71:
              dataJSON[name] = _context7.sent;

            case 72:
              _iteratorNormalCompletion5 = true;
              _context7.next = 30;
              break;

            case 75:
              _context7.next = 81;
              break;

            case 77:
              _context7.prev = 77;
              _context7.t4 = _context7['catch'](28);
              _didIteratorError5 = true;
              _iteratorError5 = _context7.t4;

            case 81:
              _context7.prev = 81;
              _context7.prev = 82;

              if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
              }

            case 84:
              _context7.prev = 84;

              if (!_didIteratorError5) {
                _context7.next = 87;
                break;
              }

              throw _iteratorError5;

            case 87:
              return _context7.finish(84);

            case 88:
              return _context7.finish(81);

            case 89:
              return _context7.abrupt('return', dataJSON);

            case 90:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, _this, [[5, 9, 13, 21], [14,, 16, 20], [28, 77, 81, 89], [40, 54, 58, 66], [59,, 61, 65], [82,, 84, 88]]);
    }));

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
            return _this._schema.primaryKeysValue[column] || _this._schema.columns[column];
          }
          return _this._data[column];
        }
      });
    });

    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
      var _loop = function _loop() {
        var relationData = _step7.value;
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
              } else if (type === 'join' && join.type === 'one') {
                _this._data[name] = (0, _helper.initJoin)(name, RelationModel, join, null);
              } else if (type === 'join' && join.type === 'many') {
                _this._data[name] = new _join2.default(name, RelationModel, join);
              }
            }
            return _this._data[name];
          }
        });
      };

      for (var _iterator7 = this._schema.relations[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
        _loop();
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


module.exports = Model;