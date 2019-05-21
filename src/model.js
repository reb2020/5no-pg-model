import ModelSchema from './schema'
import Many from './many'
import Join from './join'
import {errors, getTypeOfValue, transaction} from './helper'

class Model {
    static schema = null

    _schema = null
    _data = {}
    _change = {}
    _join = null

    constructor() {
      if (!this.constructor.schema) {
        throw new Error("Model doesn't have schema")
      }

      this._schema = this.constructor.getSchema()

      Object.keys(this._schema.columns).forEach((column) => {
        if (!this._schema.primaryKeys.includes(column) && typeof this._schema.columns[column] !== 'undefined') {
          this._data[column] = this._schema.columns[column]
        }
        Object.defineProperty(this, column, {
          set: (v) => {
            if (this._schema.primaryKeys.includes(column)) {
              this._schema.primaryKeysValue[column] = v
            } else {
              this._data[column] = this._change[column] = v
            }
          },
          get: () => {
            if (this._schema.primaryKeys.includes(column)) {
              return this._schema.primaryKeysValue[column]
            }
            return this._data[column] || null
          },
        })
      })

      for (let relationData of this._schema.relations) {
        const {name, type, model: RelationModel, join} = relationData
        Object.defineProperty(this, name, {
          get: () => {
            if (!this._data[name]) {
              if (type === 'one') {
                this._data[name] = new RelationModel()
              } else if (type === 'many') {
                this._data[name] = new Many(RelationModel)
              } else if (type === 'join') {
                this._data[name] = new Join(RelationModel, join)
              }
            }
            return this._data[name]
          },
        })
      }
    }

    static getSchema() {
      return new ModelSchema(this.schema)
    }

    setData = async(data) => {
      const filterData = await this._schema.filter(data)
      Object.keys(filterData).forEach((key) => {
        if (this._schema.primaryKeys.includes(key)) {
          this._schema.primaryKeysValue[key] = filterData[key]
        } else if (Object.keys(this._schema.columns).includes(key)) {
          this._data[key] = filterData[key]
        }
      })

      for (let relationData of this._schema.relations) {
        const {name, type, model: RelationModel, join, foreign, local} = relationData
        const typeOfValue = getTypeOfValue(data[name])

        if (typeof this._data[name] !== 'undefined' && type === 'one' && typeOfValue === 'object') {
          await this._data[name].setData(data[name])
        } else if (type === 'many' && typeOfValue === 'array') {
          this._data[name] = new Many(RelationModel)
          for (let item of data[name]) {
            await this._data[name].add(item)
          }
        } else if (type === 'join' && typeOfValue === 'array') {
          this._data[name] = new Join(RelationModel, join)
          for (let item of data[name]) {
            let joinData = Object.assign({}, item)
            joinData[foreign] = data[local]
            await this._data[name].add(joinData)
          }
        } else if (type === 'one' && typeOfValue === 'object') {
          this._data[name] = new RelationModel()
          await this._data[name].setData(data[name])
        }
      }
    }

    getData = async(allSave = false) => {
      return this._schema.filter(this._schema.addUpdatableFields(this._data, this._change, allSave))
    }

    saveByData = async(data) => {
      await this.setData(data)
      return this.save(true, true)
    }

    save = async(transactionMode = true, allSave = false) => {
      if (this._join) {
        return this._join.save(transactionMode)
      }
      try {
        const db = this._schema.getBuilder()
        const dataAfterFilter = await this.getData(allSave)
        const data = await this._schema.validate(dataAfterFilter)

        const change = Object.keys(this._change)

        if (!this._schema.isUpdatable()) {
          db.insert(data)
        } else if (change.length || allSave === true) {
          let updateData = {}
          change.forEach((key) => {
            updateData[key] = data[key]
          })
          db.update(allSave === true ? data : updateData)
        } else {
          return true
        }

        this._change = {}

        if (transactionMode) await transaction.begin()

        const result = await db.execute()
        await this.setData(result.rows[0])
        await this._schema.saveCascade(this._data, allSave)

        if (transactionMode) await transaction.commit()

        return true
      } catch (e) {
        if (transactionMode) await transaction.rollback()
        return errors(e)
      }
    }

    delete = async(transactionMode = true) => {
      if (this._join) {
        return this._join.delete(transactionMode)
      }
      try {
        const db = this._schema.getBuilder()
        if (!this._schema.isUpdatable()) {
          throw new Error("Doesn't have primaryKeyValue")
        }

        if (transactionMode) await transaction.begin()

        await this._schema.deleteCascade(this._data)
        await db.delete().execute()

        if (transactionMode) await transaction.commit()

        return true
      } catch (e) {
        if (transactionMode) await transaction.rollback()
        return errors(e)
      }
    }

    toJSON = async() => {
      let dataJSON = {}

      if (this._schema.primaryKeys.length) {
        for (let primaryKey of this._schema.primaryKeys) {
          dataJSON[primaryKey] = this._schema.primaryKeysValue[primaryKey]
        }
      }

      const dataAfterFilter = await this.getData()
      dataJSON = Object.assign(dataJSON, dataAfterFilter)

      for (let relationData of this._schema.relations) {
        const {name} = relationData
        const data = this._data[name]
        const type = getTypeOfValue(data)

        if (type === 'many' || type === 'join') {
          dataJSON[name] = []
          for (let item of data) {
            dataJSON[name].push(await item.toJSON())
          }
        } else if (typeof data !== 'undefined') {
          dataJSON[name] = await data.toJSON()
        }
      }

      return dataJSON
    }
}

module.exports = Model
