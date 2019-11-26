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
  let primaryKeyFields = []
  let createdField = null
  let updatedField = null
  Object.keys(columns).forEach((field) => {
    const { type, defaultValue, required, prefilled, schema, filters, validators, primaryKey, format, created, updated } = columns[field]

    if (primaryKey) {
      primaryKeyFields.push(field)
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
      schema: schema,
      format: format,
      prefilled: prefilled || false,
      required: required || false,
      filters: filters || [],
      validators: validators || [],
    }
  })

  return {primaryKeyFields: primaryKeyFields, createdField: createdField, updatedField: updatedField, returnFormat: returnFormat}
}

const modelSchemaRelationsFormater = (relations) => {
  let relationsData = []
  Object.keys(relations).forEach((name) => {
    const {model, foreign, local, type, cascade, join} = relations[name]
    relationsData.push({
      name: name,
      model: model,
      foreign: foreign,
      local: local,
      type: type,
      join: join || {},
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

const initJoin = (RelationModel, join) => {
  const JoinModel = join.model

  const InitModelJoin = new JoinModel()
  InitModelJoin._joinSchema = join
  InitModelJoin._joinModel = new RelationModel()

  return InitModelJoin
}

const joinData = (data) => {
  let setData = {}

  if (typeof data === 'object' && data.constructor.name.toLowerCase() === 'object') {
    setData = Object.assign({}, data)
  } else {
    setData = data.toJSON()
  }

  return setData
}

const join = async(RelationModel, join, data) => {
  const InitModelJoin = initJoin(RelationModel, join)

  let dataJoin = Object.assign({}, data)
  dataJoin[join.local] = data[join.foreign]

  await InitModelJoin._joinModel.setData(dataJoin)

  await InitModelJoin.setData(joinData(data))

  return InitModelJoin
}

module.exports = {
  errors,
  getBuilder,
  getTypeName,
  getTypeOfValue,
  modelSchemaFormater,
  modelSchemaRelationsFormater,
  transaction,
  initJoin,
  join,
  joinData,
}
