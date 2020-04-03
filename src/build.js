import { getBuilder, getTypeOfValue } from './helper'

const TYPE_ONE = 'one'
const TYPE_MANY = 'many'
const TYPE_JOIN = 'join'
const TYPE_COUNT = 'count'

class Build {
    _schema = null
    _model = null
    _join = null
    _json = false
    _isRelations = false

    constructor(model, json = false) {
      this._schema = model.getSchema()
      this._model = model
      this._json = json
    }

    _relations = async(item) => {
      for (let relationData of this._schema.relations) {
        const {name, type, model, foreign, local, join} = relationData
        const data = new Build(model)
        data._isRelations = true

        let getType = type

        if (type === TYPE_JOIN) {
          data._join = {
            builder: getBuilder(join.model.getSchema(), rows => rows),
            local: join.local,
            foreign: join.foreign,
            type: join.type,
          }

          getType = join.type
        }

        if (getType === TYPE_ONE) {
          item[name] = await data.findOne(foreign, item[local])
        } else {
          item[name] = await data.findAll(foreign, item[local])
        }
      }
    }

    _initDb = (fields, values, type = TYPE_MANY, order = null, limit = null) => {
      const db = this.builder()

      if (this._join) {
        db.select()
        this._join.builder.select(['*'])
        db.innerJoin(this._join.builder, this._join.local, this._join.foreign)
      } else if (type === TYPE_COUNT) {
        db.count('*')
      } else {
        db.select(['*'])
      }

      let index = 0
      for (let field of fields) {
        if (values[index] === null) {
          db.whereIsNull(field)
        } else {
          db.where(field, '=', values[index])
        }
        index++
      }

      if (type === TYPE_COUNT) {
        return db
      }

      if (type === TYPE_ONE) {
        db.limit(1)
      }

      if (order !== null && getTypeOfValue(order) === 'string') {
        const partsOfOrder = order.split(' ')
        if (partsOfOrder.length === 1) {
          db.order(order)
        } else if (partsOfOrder.length === 2) {
          db.order(partsOfOrder[0], partsOfOrder[1])
        }
      } else if (order !== null && getTypeOfValue(order) === 'array') {
        for (let orderData of order) {
          const partsOfOrder = orderData.split(' ')
          if (partsOfOrder.length === 1) {
            db.order(partsOfOrder[0])
          } else if (partsOfOrder.length === 2) {
            db.order(partsOfOrder[0], partsOfOrder[1])
          }
        }
      }

      if (limit !== null && getTypeOfValue(limit) === 'number') {
        db.limit(limit)
      } else if (limit !== null && getTypeOfValue(limit) === 'array' && limit.length === 2) {
        db.limit(limit[0], limit[1])
      }

      return db
    }

    _rowsHandler = async(rows) => {
      const Model = this._model

      let returnData = []

      for (let item of rows) {
        await this._relations(item)
        if (this._isRelations === true) {
          returnData.push(item)
        } else {
          let modelData = new Model()
          await modelData.setJSON(item)
          await modelData._prepareFunctionFields()
          if (this._json === true) {
            returnData.push(await modelData.toJSON())
          } else {
            returnData.push(modelData)
          }
        }
      }

      return returnData
    }

    _execute = async(fields, values, type = TYPE_MANY, order = null, limit = null) => {
      const db = this._initDb(fields, values, type, order, limit)

      if (type === TYPE_COUNT) {
        return db.result()
      }

      const rows = await db.rows()

      if (type === TYPE_ONE) {
        return rows[0]
      } else {
        return rows
      }
    }

    builder = () => getBuilder(this._schema, this._rowsHandler)

    find = async(...values) => {
      return this._execute(this._schema.primaryKeys, values, TYPE_ONE)
    }

    findOne = async(field, value) => {
      if (getTypeOfValue(field) === 'array') {
        return this._execute(field, value, TYPE_ONE)
      }

      return this._execute([field], [value], TYPE_ONE)
    }

    findAll = async(field, value, order = null, limit = null) => {
      if (getTypeOfValue(field) === 'array') {
        return this._execute(field, value, TYPE_MANY, order, limit)
      }

      return this._execute([field], [value], TYPE_MANY, order, limit)
    }

    count = async(field, value) => {
      if (getTypeOfValue(field) === 'array') {
        return this._execute(field, value, TYPE_COUNT)
      }

      return this._execute([field], [value], TYPE_COUNT)
    }
}

module.exports = Build
