import Schema from '5no-schema'

import {modelSchemaFormater, modelSchemaRelationsFormater, getBuilder, getTypeOfValue} from './helper'

class ModelSchema {
  constructor(data) {
    const { table, columns, relations } = data

    const modelSchemaFormat = modelSchemaFormater(columns)

    const schema = new Schema(modelSchemaFormat.returnFormat)

    this.table = table.name
    this.schema = table.schema || 'public'
    this.type = null
    this.createdField = modelSchemaFormat.createdField
    this.updatedField = modelSchemaFormat.updatedField
    this.primaryKeys = modelSchemaFormat.primaryKeyFields
    this.primaryKeysValue = {}
    this.columns = schema.fields
    this.filter = schema.filter
    this.validate = schema.validate
    this.relations = modelSchemaRelationsFormater(relations)
  }

  isUpdatable = () => {
    if (Object.keys(this.primaryKeysValue).length && this.type !== 'new') {
      return true
    }
    return false
  }

  addUpdatableFields = (data, change, allSave = false) => {
    const nowDate = new Date()
    let returnData = {}

    if (this.createdField && !this.isUpdatable()) {
      returnData[this.createdField] = nowDate
    }

    if (this.updatedField && (Object.keys(change).length > 0 || allSave === true)) {
      returnData[this.updatedField] = nowDate
    }

    return Object.assign({}, data, returnData, (this.type === 'new' ? this.primaryKeysValue : {}))
  }

  getBuilder = () => {
    const db = getBuilder(this)

    if (this.isUpdatable()) {
      for (let primaryKey of this.primaryKeys) {
        db.where(primaryKey, '=', this.primaryKeysValue[primaryKey])
      }
    }

    return db
  }

  cascadeExecute = async(method, data, allSave = false) => {
    for (let relationData of this.relations) {
      const {name, local, foreign, cascade} = relationData

      if (cascade.includes(method)) {
        const type = getTypeOfValue(data[name])

        if (type === 'undefined') {
          continue
        }

        let localValue = data[local]

        if (this.primaryKeys.includes(local)) {
          localValue = this.primaryKeysValue[local]
        }

        if (type === 'many' || type === 'join') {
          for (let item of data[name]) {
            if (type === 'join') {
              if (item._join[foreign] !== localValue) {
                item._join[foreign] = localValue
                item._join._schema.type = 'new'
              }
            } else {
              if (item[foreign] !== localValue) {
                item[foreign] = localValue
              }
            }
            let result = null
            if (method === 'save') {
              result = await item.save(false, allSave)
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
            result = await data[name].save(false, allSave)
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

  saveCascade = async(data, allSave = false) => {
    await this.cascadeExecute('save', data, allSave)
  }

  deleteCascade = async(data) => {
    await this.cascadeExecute('delete', data)
  }
}

module.exports = ModelSchema
