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
  var primaryKeyField = null;
  var createdField = null;
  var updatedField = null;
  Object.keys(columns).forEach(function (field) {
    var _columns$field = columns[field],
        type = _columns$field.type,
        defaultValue = _columns$field.defaultValue,
        required = _columns$field.required,
        filters = _columns$field.filters,
        validators = _columns$field.validators,
        primaryKey = _columns$field.primaryKey,
        format = _columns$field.format,
        created = _columns$field.created,
        updated = _columns$field.updated;


    if (primaryKey) {
      primaryKeyField = field;
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
      format: format,
      required: required || false,
      filters: filters || [],
      validators: validators || []
    };
  });

  return { primaryKeyField: primaryKeyField, createdField: createdField, updatedField: updatedField, returnFormat: returnFormat };
};

var modelSchemaRelationsFormater = function modelSchemaRelationsFormater(relations) {
  var relationsData = [];
  Object.keys(relations).forEach(function (name) {
    var _relations$name = relations[name],
        model = _relations$name.model,
        foreign = _relations$name.foreign,
        local = _relations$name.local,
        type = _relations$name.type,
        cascade = _relations$name.cascade;

    relationsData.push({
      name: name,
      model: model,
      foreign: foreign,
      local: local,
      type: type,
      cascade: cascade || []
    });
  });

  return relationsData;
};

var errors = function errors(_errors) {
  var type = getTypeOfValue(_errors);
  if (type === 'error') {
    _errors = [_errors];
  }

  var returnErrors = [];
  if (type === 'object') {
    Object.keys(_errors).forEach(function (name) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _errors[name][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var error = _step.value;

          returnErrors.push(error.message);
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
    });
  } else {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = _errors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var error = _step2.value;

        returnErrors.push(typeof error.message !== 'undefined' ? error.message : error);
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

  return returnErrors;
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