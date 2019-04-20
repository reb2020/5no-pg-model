import Builder from '5no-pg-builder'

const transaction = {
  begin: Builder.begin,
  commit: Builder.commit,
  rollback: Builder.rollback,
}

const getBuilder = (schema) => {
  const db = Builder.build(
    {
      table: schema.table,
      schema: schema.schema,
    }
  ).returning()

  return db
}

const getTypeName = (type) => {
  let typeName = null
  if (typeof type === 'string') {
    typeName = type.toLowerCase()
  } else {
    typeName = type.name.toString().toLowerCase()
  }

  return typeName
}

const getTypeOfValue = (value) => {
  let typeOfValue = typeof value

  if (typeOfValue === 'object' && value !== null) {
    typeOfValue = value.constructor.name.toLowerCase()
  }

  return typeOfValue
}

const modelSchemaFormater = (columns) => {
  let returnFormat = {}
  let primaryKeyField = null
  let createdField = null
  let updatedField = null
  Object.keys(columns).forEach((field) => {
    const { type, defaultValue, required, filters, validators, primaryKey, format, created, updated } = columns[field]

    if (primaryKey) {
      primaryKeyField = field
    }

    if (getTypeName(type) === 'date' && created === true) {
      createdField = field
    }

    if (getTypeName(type) === 'date' && updated === true) {
      updatedField = field
    }

    returnFormat[field] = {
      type: type,
      defaultValue: defaultValue,
      format: format,
      required: required || false,
      filters: filters || [],
      validators: validators || [],
    }
  })

  return {primaryKeyField: primaryKeyField, createdField: createdField, updatedField: updatedField, returnFormat: returnFormat}
}

const modelSchemaRelationsFormater = (relations) => {
  let relationsData = []
  Object.keys(relations).forEach((name) => {
    const {model, foreign, local, type, cascade} = relations[name]
    relationsData.push({
      name: name,
      model: model,
      foreign: foreign,
      local: local,
      type: type,
      cascade: cascade || [],
    })
  })

  return relationsData
}

const errors = (errors) => {
  const type = getTypeOfValue(errors)
  if (type === 'object') {
    return errors
  }

  return { error: typeof errors.message !== 'undefined' ? errors.message : errors }
}

module.exports = {
  errors,
  getBuilder,
  getTypeName,
  getTypeOfValue,
  modelSchemaFormater,
  modelSchemaRelationsFormater,
  transaction,
}
