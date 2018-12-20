import Schema from '5no-schema'

import {modelSchemaFormater, modelSchemaRelationsFormater, getBuilder, getTypeOfValue} from './helper'

class ModelSchema {
  constructor(data) {
    const { table, columns, relations } = data

    const modelSchemaFormat = modelSchemaFormater(columns)

    const schema = new Schema(modelSchemaFormat.returnFormat)

    this.table = table.name
    this.schema = table.schema || 'public'
    this.createdField = modelSchemaFormat.createdField
    this.updatedField = modelSchemaFormat.updatedField
    this.primaryKey = modelSchemaFormat.primaryKeyField
    this.primaryKeyValue = null
    this.columns = schema.fields
    this.filter = schema.filter
    this.validate = schema.validate
    this.relations = modelSchemaRelationsFormater(relations)
  }

  isUpdatable = () => {
    if (this.primaryKeyValue) {
      return true
    }
    return false
  }

  addUpdatableFields = (data, change) => {
    const nowDate = new Date()
    let returnData = {}

    if (this.createdField && !this.isUpdatable()) {
      returnData[this.createdField] = nowDate
    }

    if (this.updatedField && Object.keys(change).length > 0) {
      returnData[this.updatedField] = nowDate
    }

    return Object.assign({}, data, returnData)
  }

  getBuilder = () => {
    const db = getBuilder(this)

    if (this.isUpdatable()) {
      db.where(this.primaryKey, '=', this.primaryKeyValue)
    }

    return db
  }

  cascadeExecute = async(method, data) => {
    for (let relationData of this.relations) {
      const {name, local, foreign, cascade} = relationData

      if (cascade.includes(method)) {
        const type = getTypeOfValue(data[name])

        let localValue = data[local]

        if (local === this.primaryKey) {
          localValue = this.primaryKeyValue
        }

        if (type === 'many') {
          for (let item of data[name]) {
            if (item[foreign] !== localValue) {
              item[foreign] = localValue
            }
            let result = null
            if (method === 'save') {
              result = await item.save(false)
            } else if (method === 'delete') {
              result = await item.delete(false)
            }
            if (result !== true) {
              throw result
            }
          }
        } else {
          if (data[name][foreign] !== localValue) {
            data[name][foreign] = localValue
          }
          let result = null
          if (method === 'save') {
            result = await data[name].save(false)
          } else if (method === 'delete') {
            result = await data[name].delete(false)
          }
          if (result !== true) {
            throw result
          }
        }
      }
    }
  }

  saveCascade = async(data) => {
    await this.cascadeExecute('save', data)
  }

  deleteCascade = async(data) => {
    await this.cascadeExecute('delete', data)
  }
}

module.exports = ModelSchema
