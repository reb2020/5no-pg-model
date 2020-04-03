'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _build = require('./build');

var _build2 = _interopRequireDefault(_build);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initJoin = function initJoin(name, RelationModel, join, parent) {
  var JoinModel = join.model;

  var InitModelJoin = new JoinModel();
  InitModelJoin._joinName = name;
  InitModelJoin._joinSchema = join;
  InitModelJoin._joinModel = new RelationModel();
  InitModelJoin._parent = parent;

  return InitModelJoin;
};

var joinData = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(data, JoinModel) {
    var setData, getData;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            setData = {};

            if (!((typeof data === 'undefined' ? 'undefined' : (0, _typeof3.default)(data)) === 'object' && data.constructor.name.toLowerCase() === 'object')) {
              _context.next = 5;
              break;
            }

            setData = Object.assign({}, data);
            _context.next = 15;
            break;

          case 5:
            if (!(typeof data === 'string')) {
              _context.next = 12;
              break;
            }

            getData = new _build2.default(JoinModel, true);
            _context.next = 9;
            return getData.find(data);

          case 9:
            setData = _context.sent;
            _context.next = 15;
            break;

          case 12:
            _context.next = 14;
            return data.toJSON();

          case 14:
            setData = _context.sent;

          case 15:
            return _context.abrupt('return', setData);

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function joinData(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var modelJoin = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(name, RelationModel, join, data, parent) {
    var InitModelJoin, dataJoin, newDataJoin;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            InitModelJoin = initJoin(name, RelationModel, join, parent);
            _context2.next = 3;
            return joinData(data, join.model);

          case 3:
            dataJoin = _context2.sent;
            newDataJoin = Object.assign({}, dataJoin);

            newDataJoin[join.local] = dataJoin[join.foreign];

            _context2.next = 8;
            return InitModelJoin._joinModel.setJSON(newDataJoin);

          case 8:
            _context2.next = 10;
            return InitModelJoin.setJSON(dataJoin);

          case 10:
            return _context2.abrupt('return', InitModelJoin);

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function modelJoin(_x3, _x4, _x5, _x6, _x7) {
    return _ref2.apply(this, arguments);
  };
}();

module.exports = {
  initJoin: initJoin,
  modelJoin: modelJoin,
  joinData: joinData
};