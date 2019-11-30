'use strict';

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

var getBuilder = function getBuilder(schema, handler) {
  var db = _noPgBuilder2.default.build({
    table: schema.table,
    schema: schema.schema,
    rowsHandler: handler
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

module.exports = {
  errors: errors,
  getBuilder: getBuilder,
  getTypeName: getTypeName,
  getTypeOfValue: getTypeOfValue,
  modelSchemaFormater: modelSchemaFormater,
  modelSchemaRelationsFormater: modelSchemaRelationsFormater,
  transaction: transaction
};