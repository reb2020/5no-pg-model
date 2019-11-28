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

                newRelationModel._parent = this;
                _context.next = 5;
                return newRelationModel.setData(data);

              case 5:
                this.push(newRelationModel);
                return _context.abrupt('return', newRelationModel);

              case 7:
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
    value: function fetch(fields, values) {
      var indexes = this.getItemsIndexes(fields, values);
      var returnData = [];
      if (indexes.length) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = indexes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var index = _step.value;

            returnData.push(this[index]);
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
      }

      return returnData;
    }
  }, {
    key: 'fetchOne',
    value: function fetchOne(fields, values) {
      var indexes = this.getItemsIndexes(fields, values);
      if (indexes.length) {
        return this[indexes[0]];
      }
      return null;
    }
  }, {
    key: 'getItemsIndexes',
    value: function getItemsIndexes(fields, values) {
      var typeOfFields = (0, _helper.getTypeOfValue)(fields);
      if (typeOfFields !== 'array') {
        fields = [fields];
        values = [values];
      }
      var indexes = [];
      this.forEach(function (item, itemIndex) {
        var indexOfField = 0;
        var isAvailable = true;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = fields[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var field = _step2.value;

            if (item[field] !== values[indexOfField]) {
              isAvailable = false;
            }
            indexOfField++;
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

        if (isAvailable) {
          indexes.push(itemIndex);
        }
      });

      return indexes;
    }
  }, {
    key: 'removeItemByIndex',
    value: function removeItemByIndex(index) {
      this.splice(index, 1);
    }
  }, {
    key: 'removeItems',
    value: function removeItems(fields, values) {
      var indexes = this.getItemsIndexes(fields, values);
      if (indexes.length) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = indexes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var index = _step3.value;

            this.removeItemByIndex(index);
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
      }
    }
  }]);
  return Many;
}(Array);

module.exports = Many;