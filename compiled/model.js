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

var _joinHelper = require('./joinHelper');

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

    this.set = function (name, value) {
      return value;
    };

    this.get = function (name, value) {
      return value;
    };

    this.setJSON = function () {
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
                return _this._data[name].setJSON(data[name]);

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
                return (0, _joinHelper.modelJoin)(name, RelationModel, join, _joinItemData, null);

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
                return _this._data[name].setJSON(data[name]);

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

    this._prepareFunctionFields = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      var _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, functionFieldKey;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _iteratorNormalCompletion4 = true;
              _didIteratorError4 = false;
              _iteratorError4 = undefined;
              _context2.prev = 3;
              _iterator4 = Object.keys(_this._schema.functionFields)[Symbol.iterator]();

            case 5:
              if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                _context2.next = 13;
                break;
              }

              functionFieldKey = _step4.value;
              _context2.next = 9;
              return (0, _helper.resolveFn)(_this._schema.functionFields[functionFieldKey], _this);

            case 9:
              _this._data[functionFieldKey] = _context2.sent;

            case 10:
              _iteratorNormalCompletion4 = true;
              _context2.next = 5;
              break;

            case 13:
              _context2.next = 19;
              break;

            case 15:
              _context2.prev = 15;
              _context2.t0 = _context2['catch'](3);
              _didIteratorError4 = true;
              _iteratorError4 = _context2.t0;

            case 19:
              _context2.prev = 19;
              _context2.prev = 20;

              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }

            case 22:
              _context2.prev = 22;

              if (!_didIteratorError4) {
                _context2.next = 25;
                break;
              }

              throw _iteratorError4;

            case 25:
              return _context2.finish(22);

            case 26:
              return _context2.finish(19);

            case 27:
              _context2.next = 29;
              return _this._schema.cascadeFunctionExecute(_this._data);

            case 29:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this, [[3, 15, 19, 27], [20,, 22, 26]]);
    }));

    this._prepareData = function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(_ref4) {
        var _ref4$allSave = _ref4.allSave,
            allSave = _ref4$allSave === undefined ? false : _ref4$allSave,
            _ref4$json = _ref4.json,
            json = _ref4$json === undefined ? false : _ref4$json;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt('return', new Promise(function (resolve, reject) {
                  _this._schema.filter(_this._schema.addUpdatableFields(_this._data, _this._change, allSave)).then(function (data) {
                    if (json === true) {
                      var _iteratorNormalCompletion5 = true;
                      var _didIteratorError5 = false;
                      var _iteratorError5 = undefined;

                      try {
                        for (var _iterator5 = Object.keys(_this._schema.functionFields)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                          var functionFieldKey = _step5.value;

                          data[functionFieldKey] = _this._data[functionFieldKey];
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

                      if (_this._schema.primaryKeys.length) {
                        var _iteratorNormalCompletion6 = true;
                        var _didIteratorError6 = false;
                        var _iteratorError6 = undefined;

                        try {
                          for (var _iterator6 = _this._schema.primaryKeys[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                            var primaryKey = _step6.value;

                            data[primaryKey] = _this._schema.primaryKeysValue[primaryKey];
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
                      }

                      data = Object.keys(data).sort(function (a, b) {
                        var indexA = _this._schema.sortFields.indexOf(a);
                        var indexB = _this._schema.sortFields.indexOf(b);

                        if (indexA > indexB) {
                          return 1;
                        } else if (indexA > indexB) {
                          return -1;
                        }

                        return 0;
                      }).reduce(function (acc, key) {
                        acc[key] = data[key];
                        return acc;
                      }, {});
                    }

                    resolve(data);
                  }).catch(reject);
                }));

              case 1:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, _this);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }();

    this.saveByJSON = function () {
      var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(data) {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return _this.setJSON(data);

              case 2:
                return _context4.abrupt('return', _this.save(true, true));

              case 3:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, _this);
      }));

      return function (_x3) {
        return _ref5.apply(this, arguments);
      };
    }();

    this.join = function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(data) {
        var newData, dataJoin;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return (0, _joinHelper.joinData)(data, _this._joinSchema.model);

              case 2:
                newData = _context5.sent;
                dataJoin = Object.assign({}, newData);

                dataJoin[_this._joinSchema.local] = newData[_this._joinSchema.foreign];

                _context5.next = 7;
                return _this._joinModel.setJSON(dataJoin);

              case 7:
                _context5.next = 9;
                return _this.setJSON(newData);

              case 9:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, _this);
      }));

      return function (_x4) {
        return _ref6.apply(this, arguments);
      };
    }();

    this._save = function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
        var transactionMode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var allSave = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var db, dataAfterFilter, data, change, isFeasible, updateData, rows;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!_this._joinModel) {
                  _context6.next = 2;
                  break;
                }

                return _context6.abrupt('return', _this._joinModel._save(transactionMode));

              case 2:
                _context6.prev = 2;
                db = _this._schema.getBuilder();
                _context6.next = 6;
                return _this._prepareData({ allSave: allSave });

              case 6:
                dataAfterFilter = _context6.sent;
                _context6.next = 9;
                return _this._schema.validate(dataAfterFilter);

              case 9:
                data = _context6.sent;
                change = Object.keys(allSave === true ? data : _this._change);
                isFeasible = false;


                if (!_this._schema.isUpdatable()) {
                  isFeasible = true;
                  db.insert(data);
                } else if (change.length) {
                  isFeasible = true;
                  updateData = {};


                  if (_this._schema.updatedField) {
                    updateData[_this._schema.updatedField] = data[_this._schema.updatedField];
                  }

                  change.forEach(function (key) {
                    if (_this._schema.createdField !== key) {
                      updateData[key] = data[key];
                    }
                  });
                  db.update(updateData);
                }

                _this._change = {};

                if (!transactionMode) {
                  _context6.next = 17;
                  break;
                }

                _context6.next = 17;
                return _helper.transaction.begin();

              case 17:
                if (!isFeasible) {
                  _context6.next = 23;
                  break;
                }

                _context6.next = 20;
                return db.rows();

              case 20:
                rows = _context6.sent;
                _context6.next = 23;
                return _this.setJSON(rows[0]);

              case 23:
                _context6.next = 25;
                return _this._schema.saveCascade(_this._data, allSave);

              case 25:
                if (!transactionMode) {
                  _context6.next = 28;
                  break;
                }

                _context6.next = 28;
                return _helper.transaction.commit();

              case 28:
                return _context6.abrupt('return', true);

              case 31:
                _context6.prev = 31;
                _context6.t0 = _context6['catch'](2);

                if (!transactionMode) {
                  _context6.next = 36;
                  break;
                }

                _context6.next = 36;
                return _helper.transaction.rollback();

              case 36:
                return _context6.abrupt('return', (0, _helper.errors)(_context6.t0));

              case 37:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, _this, [[2, 31]]);
      }));

      return function () {
        return _ref7.apply(this, arguments);
      };
    }();

    this.save = function () {
      var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
        var transactionMode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var allSave = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var result;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return _this._save(transactionMode, allSave);

              case 2:
                result = _context7.sent;
                _context7.next = 5;
                return _this._prepareFunctionFields();

              case 5:
                return _context7.abrupt('return', result);

              case 6:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, _this);
      }));

      return function () {
        return _ref8.apply(this, arguments);
      };
    }();

    this.delete = function () {
      var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
        var transactionMode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        var type, joinModelPrimaryKeysValue, deleteJoinModel, db;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (_this._parent) {
                  type = (0, _helper.getTypeOfValue)(_this._parent);


                  if (type === 'many' || type === 'join') {
                    _this._parent.removeItems(_this._schema.primaryKeys, _this._schema.getPrimaryKeysValues());
                  }
                }

                if (!_this._joinModel) {
                  _context8.next = 9;
                  break;
                }

                _this.refreshData();
                joinModelPrimaryKeysValue = _this._joinModel._schema.primaryKeysValue;
                _context8.next = 6;
                return _this._joinModel.delete(transactionMode);

              case 6:
                deleteJoinModel = _context8.sent;

                _this._joinModel._schema.primaryKeysValue = joinModelPrimaryKeysValue;
                return _context8.abrupt('return', deleteJoinModel);

              case 9:
                _context8.prev = 9;
                db = _this._schema.getBuilder();

                if (_this._schema.isUpdatable()) {
                  _context8.next = 13;
                  break;
                }

                throw new Error("Doesn't have primaryKeyValue");

              case 13:
                if (!transactionMode) {
                  _context8.next = 16;
                  break;
                }

                _context8.next = 16;
                return _helper.transaction.begin();

              case 16:
                _context8.next = 18;
                return _this._schema.deleteCascade(_this._data);

              case 18:
                _context8.next = 20;
                return db.delete().execute();

              case 20:
                if (!transactionMode) {
                  _context8.next = 23;
                  break;
                }

                _context8.next = 23;
                return _helper.transaction.commit();

              case 23:

                _this.refreshData();

                return _context8.abrupt('return', true);

              case 27:
                _context8.prev = 27;
                _context8.t0 = _context8['catch'](9);

                if (!transactionMode) {
                  _context8.next = 32;
                  break;
                }

                _context8.next = 32;
                return _helper.transaction.rollback();

              case 32:
                return _context8.abrupt('return', (0, _helper.errors)(_context8.t0));

              case 33:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, _this, [[9, 27]]);
      }));

      return function () {
        return _ref9.apply(this, arguments);
      };
    }();

    this.refreshData = function () {
      Object.keys(_this._schema.columns).forEach(function (column) {
        if (!_this._schema.primaryKeys.includes(column)) {
          _this._data[column] = _this._schema.columns[column];
        }
      });

      Object.keys(_this._schema.functionFields).forEach(function (column) {
        _this._data[column] = null;
      });

      _this._schema.setPrimaryKeysValues({});

      _this._change = {};
    };

    this.toJSON = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
      var dataJSON, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, relationData, name, data, type, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, item;

      return _regenerator2.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return _this._prepareData({ json: true });

            case 2:
              dataJSON = _context9.sent;
              _iteratorNormalCompletion7 = true;
              _didIteratorError7 = false;
              _iteratorError7 = undefined;
              _context9.prev = 6;
              _iterator7 = _this._schema.relations[Symbol.iterator]();

            case 8:
              if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
                _context9.next = 53;
                break;
              }

              relationData = _step7.value;
              name = relationData.name;
              data = _this._data[name];
              type = (0, _helper.getTypeOfValue)(data);

              if (!(type === 'many' || type === 'join')) {
                _context9.next = 46;
                break;
              }

              dataJSON[name] = [];
              _iteratorNormalCompletion8 = true;
              _didIteratorError8 = false;
              _iteratorError8 = undefined;
              _context9.prev = 18;
              _iterator8 = data[Symbol.iterator]();

            case 20:
              if (_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done) {
                _context9.next = 30;
                break;
              }

              item = _step8.value;
              _context9.t0 = dataJSON[name];
              _context9.next = 25;
              return item.toJSON();

            case 25:
              _context9.t1 = _context9.sent;

              _context9.t0.push.call(_context9.t0, _context9.t1);

            case 27:
              _iteratorNormalCompletion8 = true;
              _context9.next = 20;
              break;

            case 30:
              _context9.next = 36;
              break;

            case 32:
              _context9.prev = 32;
              _context9.t2 = _context9['catch'](18);
              _didIteratorError8 = true;
              _iteratorError8 = _context9.t2;

            case 36:
              _context9.prev = 36;
              _context9.prev = 37;

              if (!_iteratorNormalCompletion8 && _iterator8.return) {
                _iterator8.return();
              }

            case 39:
              _context9.prev = 39;

              if (!_didIteratorError8) {
                _context9.next = 42;
                break;
              }

              throw _iteratorError8;

            case 42:
              return _context9.finish(39);

            case 43:
              return _context9.finish(36);

            case 44:
              _context9.next = 50;
              break;

            case 46:
              if (!(typeof data !== 'undefined')) {
                _context9.next = 50;
                break;
              }

              _context9.next = 49;
              return data.toJSON();

            case 49:
              dataJSON[name] = _context9.sent;

            case 50:
              _iteratorNormalCompletion7 = true;
              _context9.next = 8;
              break;

            case 53:
              _context9.next = 59;
              break;

            case 55:
              _context9.prev = 55;
              _context9.t3 = _context9['catch'](6);
              _didIteratorError7 = true;
              _iteratorError7 = _context9.t3;

            case 59:
              _context9.prev = 59;
              _context9.prev = 60;

              if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
              }

            case 62:
              _context9.prev = 62;

              if (!_didIteratorError7) {
                _context9.next = 65;
                break;
              }

              throw _iteratorError7;

            case 65:
              return _context9.finish(62);

            case 66:
              return _context9.finish(59);

            case 67:
              return _context9.abrupt('return', dataJSON);

            case 68:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, _this, [[6, 55, 59, 67], [18, 32, 36, 44], [37,, 39, 43], [60,, 62, 66]]);
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
            _this._schema.primaryKeysValue[column] = _this.set(column, v);
          } else {
            _this._data[column] = _this._change[column] = _this.set(column, v);
          }
        },
        get: function get() {
          if (_this._schema.primaryKeys.includes(column)) {
            return _this.get(column, _this._schema.primaryKeysValue[column] || _this._schema.columns[column]);
          }
          return _this.get(column, _this._data[column]);
        }
      });
    });

    Object.keys(this._schema.functionFields).forEach(function (column) {
      Object.defineProperty(_this, column, {
        get: function get() {
          return _this.get(column, _this._data[column]);
        }
      });
    });

    var _iteratorNormalCompletion9 = true;
    var _didIteratorError9 = false;
    var _iteratorError9 = undefined;

    try {
      var _loop = function _loop() {
        var relationData = _step9.value;
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
                _this._data[name] = (0, _joinHelper.initJoin)(name, RelationModel, join, null);
              } else if (type === 'join' && join.type === 'many') {
                _this._data[name] = new _join2.default(name, RelationModel, join);
              }
            }
            return _this._data[name];
          }
        });
      };

      for (var _iterator9 = this._schema.relations[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
        _loop();
      }
    } catch (err) {
      _didIteratorError9 = true;
      _iteratorError9 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion9 && _iterator9.return) {
          _iterator9.return();
        }
      } finally {
        if (_didIteratorError9) {
          throw _iteratorError9;
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