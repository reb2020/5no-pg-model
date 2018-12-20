import ModelSchema from './schema'
import Many from './many'
import {errors, getTypeOfValue, transaction} from './helper'

class Model {
    static schema = null

    _schema = null
    _data = {}
    _change = {}

    constructor(data = {}) {
      if (!this.constructor.schema) {
        throw new Error("Model doesn't have schema")
      }

      this._schema = this.constructor.getSchema()

      Object.keys(this._schema.columns).forEach((column) => {
        if (column !== this._schema.primaryKey && typeof this._schema.columns[column] !== 'undefined') {
          this._data[column] = this._schema.columns[column]
        }
        Object.defineProperty(this, column, {
          set: (v) => {
            if (column !== this._schema.primaryKey) {
              this._data[column] = this._change[column] = v
            }
          },
          get: () => {
            if (column === this._schema.primaryKey) {
              return this._schema.primaryKeyValue
            }
            return this._data[column] || null
          },
        })
      })

      for (let relationData of this._schema.relations) {
        const {name, type, model: RelationModel} = relationData
        Object.defineProperty(this, name, {
          get: () => {
            if (!this._data[name]) {
              if (type === 'one') {
                this._data[name] = new RelationModel()
              } else {
                this._data[name] = new Many(RelationModel)
              }
            }
            return this._data[name]
          },
        })
      }

      this.setData(data)
    }

    static getSchema() {
      return new ModelSchema(this.schema)
    }

    setData = (data) => {
      const filterData = this._schema.filter(data)
      Object.keys(filterData).forEach((key) => {
        if (key === this._schema.primaryKey) {
          this._schema.primaryKeyValue = filterData[key]
        } else if (Object.keys(this._schema.columns).includes(key)) {
          this._data[key] = filterData[key]
        }
      })

      for (let relationData of this._schema.relations) {
        const {name, model: RelationModel} = relationData
        const type = getTypeOfValue(data[name])

        if (type === 'array') {
          this._data[name] = new Many(RelationModel)
          for (let item of data[name]) {
            this._data[name].push(new RelationModel(item))
          }
        } else if (type === 'object') {
          this._data[name] = new RelationModel(data[name])
        }
      }
    }

    getData = () => {
      return this._schema.filter(this._schema.addUpdatableFields(this._data, this._change))
    }

    save = async(transactionMode = true) => {
      try {
        const db = this._schema.getBuilder()
        const data = await this._schema.validate(this.getData())

        const change = Object.keys(this._change)

        if (!this._schema.isUpdatable()) {
          db.insert(data)
        } else if (change.length) {
          let updateData = {}
          change.forEach((key) => {
            updateData[key] = data[key]
          })
          db.update(updateData)
        } else {
          return true
        }

        this._change = {}

        if (transactionMode) await transaction.begin()

        const result = await db.execute()
        this.setData(result.rows[0])
        await this._schema.saveCascade(this._data)

        if (transactionMode) await transaction.commit()

        return true
      } catch (e) {
        if (transactionMode) await transaction.rollback()
        return errors(e)
      }
    }

    delete = async(transactionMode = true) => {
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

    toJSON = () => {
      let dataJSON = {}

      if (this._schema.primaryKey) {
        dataJSON[this._schema.primaryKey] = this._schema.primaryKeyValue
      }

      dataJSON = Object.assign(dataJSON, this.getData())

      for (let relationData of this._schema.relations) {
        const {name} = relationData
        const data = this._data[name]
        const type = getTypeOfValue(data)

        if (type === 'many') {
          dataJSON[name] = []
          for (let item of data) {
            dataJSON[name].push(item.toJSON())
          }
        } else {
          dataJSON[name] = data.toJSON()
        }
      }

      return dataJSON
    }
}

module.exports = Model
