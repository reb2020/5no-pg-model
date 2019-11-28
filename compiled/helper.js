'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _noPgBuilder = require('5no-pg-builder');

var _noPgBuilder2 = _interopRequireDefault(_noPgBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var transaction = {
  begin: _noPgBuilder2.default.begin,
  commit: _noPgBuilder2.default.commit,
  rollback: _noPgBuilder2.default.rollback
};

var getBuilder = function getBuilder(schema) {
  var db = _noPgBuilder2.default.build({
    table: schema.table,
    schema: schema.schema
  }).returning();

  return db;
};

var getTypeName = function getTypeName(type) {
  var typeName = null;
  if (typeof type === 'string') {
    typeName = type.toLowerCase();
  } else {
    typeName = type.name.toString().toLowerCase();
  }

  return typeName;
};

var getTypeOfValue = function getTypeOfValue(value) {
  var typeOfValue = typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value);

  if (typeOfValue === 'object' && value !== null) {
    typeOfValue = value.constructor.name.toLowerCase();
  }

  return typeOfValue;
};

var modelSchemaFormater = function modelSchemaFormater(columns) {
  var returnFormat = {};
  var primaryKeyFields = [];
  var createdField = null;
  var updatedField = null;
  Object.keys(columns).forEach(function (field) {
    var _columns$field = columns[field],
        type = _columns$field.type,
        defaultValue = _columns$field.defaultValue,
        required = _columns$field.required,
        prefilled = _columns$field.prefilled,
        schema = _columns$field.schema,
        filters = _columns$field.filters,
        validators = _columns$field.validators,
        primaryKey = _columns$field.primaryKey,
        format = _columns$field.format,
        created = _columns$field.created,
        updated = _columns$field.updated;


    if (primaryKey) {
      primaryKeyFields.push(field);
    }

    if (getTypeName(type) === 'date' && created === true) {
      createdField = field;
    }

    if (getTypeName(type) === 'date' && updated === true) {
      updatedField = field;
    }

    returnFormat[field] = {
      type: type,
      defaultValue: defaultValue,
      schema: schema,
      format: format,
      prefilled: prefilled || false,
      required: required || false,
      filters: filters || [],
      validators: validators || []
    };
  });

  return { primaryKeyFields: primaryKeyFields, createdField: createdField, updatedField: updatedField, returnFormat: returnFormat };
};

var modelSchemaRelationsFormater = function modelSchemaRelationsFormater(relations) {
  var relationsData = [];
  Object.keys(relations).forEach(function (name) {
    var _relations$name = relations[name],
        model = _relations$name.model,
        foreign = _relations$name.foreign,
        local = _relations$name.local,
        type = _relations$name.type,
        cascade = _relations$name.cascade,
        join = _relations$name.join;

    relationsData.push({
      name: name,
      model: model,
      foreign: foreign,
      local: local,
      type: type,
      join: join || {},
      cascade: cascade || []
    });
  });

  return relationsData;
};

var errors = function errors(_errors) {
  var type = getTypeOfValue(_errors);
  if (type === 'object') {
    return _errors;
  }

  return { error: typeof _errors.message !== 'undefined' ? _errors.message : _errors };
};

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
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(data) {
    var setData;
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
            _context.next = 8;
            break;

          case 5:
            _context.next = 7;
            return data.toJSON();

          case 7:
            setData = _context.sent;

          case 8:
            return _context.abrupt('return', setData);

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function joinData(_x) {
    return _ref.apply(this, arguments);
  };
}();

var join = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(name, RelationModel, _join, data, parent) {
    var InitModelJoin, dataJoin, newDataJoin;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            InitModelJoin = initJoin(name, RelationModel, _join, parent);
            _context2.next = 3;
            return joinData(data);

          case 3:
            dataJoin = _context2.sent;
            newDataJoin = Object.assign({}, dataJoin);

            newDataJoin[_join.local] = dataJoin[_join.foreign];

            _context2.next = 8;
            return InitModelJoin._joinModel.setData(newDataJoin);

          case 8:
            _context2.next = 10;
            return InitModelJoin.setData(dataJoin);

          case 10:
            return _context2.abrupt('return', InitModelJoin);

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function join(_x2, _x3, _x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

module.exports = {
  errors: errors,
  getBuilder: getBuilder,
  getTypeName: getTypeName,
  getTypeOfValue: getTypeOfValue,
  modelSchemaFormater: modelSchemaFormater,
  modelSchemaRelationsFormater: modelSchemaRelationsFormater,
  transaction: transaction,
  initJoin: initJoin,
  join: join,
  joinData: joinData
};