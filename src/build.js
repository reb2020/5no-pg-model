import {getBuilder} from './helper'

const TYPE_ONE = 'one'
const TYPE_MANY = 'many'

class Build {
    _schema = null
    _model = null
    _json = false
    _isRelations = false

    constructor(model, json = false) {
      this._schema = model.getSchema()
      this._model = model
      this._json = json
    }

    _relations = async(item) => {
      for (let relationData of this._schema.relations) {
        const {name, model, foreign, local, type} = relationData
        const data = new Build(model)
        data._isRelations = true
        if (type === TYPE_ONE) {
          item[name] = await data.findOne(foreign, item[local])
        } else {
          item[name] = await data.findAll(foreign, item[local])
        }
      }
    }

    _execute = async(field, value, type = TYPE_MANY) => {
      const Model = this._model
      const db = getBuilder(this._schema)
      db.select(['*'])
      db.where(field, '=', value)

      if (type === TYPE_ONE) {
        db.limit(1)
      }

      const result = await db.execute()

      let returnData = []

      for (let item of result.rows) {
        await this._relations(item)
        if (this._isRelations === true) {
          returnData.push(item)
        } else {
          let modelData = new Model(item)
          if (this._json === true) {
            returnData.push(modelData.toJSON())
          } else {
            returnData.push(modelData)
          }
        }
      }

      if (type === TYPE_ONE) {
        return returnData[0]
      } else {
        return returnData
      }
    }

    find = async(value) => {
      return this._execute(this._schema.primaryKey, value, TYPE_ONE)
    }

    findOne = async(field, value) => {
      return this._execute(field, value, TYPE_ONE)
    }

    findAll = async(field, value) => {
      return this._execute(field, value, TYPE_MANY)
    }
}

module.exports = Build
