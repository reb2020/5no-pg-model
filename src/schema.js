import moment from 'moment'
import Schema from '@5no/schema'

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
    this.functionFields = modelSchemaFormat.returnFunctionFormat
    this.sortFields = modelSchemaFormat.sortFields
    this.relations = modelSchemaRelationsFormater(relations)
  }

  getPrimaryKeysValues = () => {
    let values = []
    for (let valueKey of Object.keys(this.primaryKeysValue)) {
      values.push(this.primaryKeysValue[valueKey])
    }
    return values
  }

  setPrimaryKeysValues = (data) => {
    this.primaryKeysValue = data
  }

  isUpdatable = () => {
    if (Object.keys(this.primaryKeysValue).length && this.type !== 'join') {
      return true
    }
    return false
  }

  addUpdatableFields = (data, change, allSave = false) => {
    const nowDate = moment.utc()
    let returnData = {}

    if (this.createdField && !this.isUpdatable()) {
      returnData[this.createdField] = nowDate
    }

    if (this.updatedField && (Object.keys(change).length > 0 || allSave === true)) {
      returnData[this.updatedField] = nowDate
    }

    return Object.assign({}, data, returnData, (this.type === 'join' ? this.primaryKeysValue : {}))
  }

  getBuilder = () => {
    const db = getBuilder(this, rows => rows)

    if (this.isUpdatable()) {
      for (let primaryKey of this.primaryKeys) {
        db.where(primaryKey, '=', this.primaryKeysValue[primaryKey])
      }
    }

    if (this.type === 'join') {
      let doUpdate = []
      for (let field of Object.keys(this.columns)) {
        if (field !== this.createdField && !this.primaryKeys.includes(field)) {
          doUpdate.push(field)
        }
      }

      db.onConflict(this.primaryKeys)

      if (doUpdate.length) {
        db.doUpdate(doUpdate)
      } else {
        db.doNothing()
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
              if (item._joinModel[foreign] !== localValue) {
                item._joinModel[foreign] = localValue
                item._joinModel._schema.type = 'join'
              }
            } else {
              if (item[foreign] !== localValue) {
                item[foreign] = localValue
              }
            }
            let result = null
            if (method === 'save') {
              result = await item._save(false, allSave)
            } else if (method === 'delete') {
              result = await item.delete(false)
            }
            if (result !== true) {
              throw result
            }
          }
        } else {
          if (data[name]._joinModel && data[name]._joinModel[foreign] !== localValue) {
            data[name]._joinModel[foreign] = localValue
            data[name]._joinModel._schema.type = 'join'
          } else {
            if (data[name][foreign] !== localValue) {
              data[name][foreign] = localValue
            }
          }
          let result = null
          if (method === 'save') {
            result = await data[name]._save(false, allSave)
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

  cascadeFunctionExecute = async(data) => {
    for (let relationData of this.relations) {
      const {name} = relationData
      const type = getTypeOfValue(data[name])

      if (type === 'undefined') {
        continue
      }

      if (type === 'many' || type === 'join') {
        for (let item of data[name]) {
          if (type === 'join') {
            await item._joinModel._prepareFunctionFields()
          } else {
            await item._prepareFunctionFields()
          }
        }
      } else {
        await data[name]._prepareFunctionFields()
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
