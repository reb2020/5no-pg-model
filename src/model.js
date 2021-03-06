import ModelSchema from './schema'
import Many from './many'
import Join from './join'
import { errors, getTypeOfValue, transaction, resolveFn } from './helper'
import { modelJoin, initJoin, joinData } from './joinHelper'

class Model {
    static schema = null

    _parent = null
    _schema = null
    _data = {}
    _change = {}
    _joinName = null
    _joinSchema = null
    _joinModel = null

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
              this._schema.primaryKeysValue[column] = this.set(column, v)
            } else {
              this._data[column] = this._change[column] = this.set(column, v)
            }
          },
          get: () => {
            if (this._schema.primaryKeys.includes(column)) {
              return this.get(column, this._schema.primaryKeysValue[column] || this._schema.columns[column])
            }
            return this.get(column, this._data[column])
          },
        })
      })

      Object.keys(this._schema.functionFields).forEach((column) => {
        Object.defineProperty(this, column, {
          get: () => this.get(column, this._data[column]),
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
              } else if (type === 'join' && join.type === 'one') {
                this._data[name] = initJoin(name, RelationModel, join, null)
              } else if (type === 'join' && join.type === 'many') {
                this._data[name] = new Join(name, RelationModel, join)
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

    set = (name, value) => value

    get = (name, value) => value

    setJSON = async(data) => {
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
          await this._data[name].setJSON(data[name])
        } else if (type === 'many' && typeOfValue === 'array') {
          this._data[name] = new Many(RelationModel)
          for (let item of data[name]) {
            await this._data[name].add(item)
          }
        } else if (type === 'join' && typeOfValue === 'array') {
          this._data[name] = new Join(name, RelationModel, join)
          for (let item of data[name]) {
            let joinItemData = Object.assign({}, item)
            joinItemData[foreign] = data[local]
            await this._data[name].join(joinItemData)
          }
        } else if (type === 'join' && typeOfValue === 'object') {
          let joinItemData = Object.assign({}, data[name])
          joinItemData[foreign] = data[local]

          this._data[name] = await modelJoin(name, RelationModel, join, joinItemData, null)
        } else if (type === 'one' && typeOfValue === 'object') {
          this._data[name] = new RelationModel()
          await this._data[name].setJSON(data[name])
        }
      }
    }

    _prepareFunctionFields = async() => {
      for (let functionFieldKey of Object.keys(this._schema.functionFields)) {
        this._data[functionFieldKey] = await resolveFn(this._schema.functionFields[functionFieldKey], this)
      }

      await this._schema.cascadeFunctionExecute(this._data)
    }

    _prepareData = async({ allSave = false, json = false }) => {
      return new Promise((resolve, reject) => {
        this._schema.filter(this._schema.addUpdatableFields(this._data, this._change, allSave)).then(data => {
          if (json === true) {
            for (let functionFieldKey of Object.keys(this._schema.functionFields)) {
              data[functionFieldKey] = this._data[functionFieldKey]
            }

            if (this._schema.primaryKeys.length) {
              for (let primaryKey of this._schema.primaryKeys) {
                data[primaryKey] = this._schema.primaryKeysValue[primaryKey]
              }
            }

            data = Object.keys(data).sort((a, b) => {
              const indexA = this._schema.sortFields.indexOf(a)
              const indexB = this._schema.sortFields.indexOf(b)

              if (indexA > indexB) {
                return 1
              } else if (indexA > indexB) {
                return -1
              }

              return 0
            }).reduce((acc, key) => {
              acc[key] = data[key]
              return acc
            }, {})
          }

          resolve(data)
        }).catch(reject)
      })
    }

    saveByJSON = async(data) => {
      await this.setJSON(data)
      return this.save(true, true)
    }

    join = async(data) => {
      const newData = await joinData(data, this._joinSchema.model)
      let dataJoin = Object.assign({}, newData)
      dataJoin[this._joinSchema.local] = newData[this._joinSchema.foreign]

      await this._joinModel.setJSON(dataJoin)
      await this.setJSON(newData)
    }

    _save = async(transactionMode = true, allSave = false) => {
      if (this._joinModel) {
        return this._joinModel._save(transactionMode)
      }
      try {
        const db = this._schema.getBuilder()
        const dataAfterFilter = await this._prepareData({ allSave })
        const data = await this._schema.validate(dataAfterFilter)

        const change = Object.keys(allSave === true ? data : this._change)

        let isFeasible = false

        if (!this._schema.isUpdatable()) {
          isFeasible = true
          db.insert(data)
        } else if (change.length) {
          isFeasible = true
          let updateData = {}

          if (this._schema.updatedField) {
            updateData[this._schema.updatedField] = data[this._schema.updatedField]
          }

          change.forEach((key) => {
            if (this._schema.createdField !== key) {
              updateData[key] = data[key]
            }
          })
          db.update(updateData)
        }

        this._change = {}

        if (transactionMode) await transaction.begin()

        if (isFeasible) {
          const rows = await db.rows()
          await this.setJSON(rows[0])
        }

        await this._schema.saveCascade(this._data, allSave)

        if (transactionMode) await transaction.commit()

        return true
      } catch (e) {
        if (transactionMode) await transaction.rollback()
        return errors(e)
      }
    }

    save = async(transactionMode = true, allSave = false) => {
      const result = await this._save(transactionMode, allSave)

      await this._prepareFunctionFields()

      return result
    }

    delete = async(transactionMode = true) => {
      if (this._parent) {
        const type = getTypeOfValue(this._parent)

        if (type === 'many' || type === 'join') {
          this._parent.removeItems(this._schema.primaryKeys, this._schema.getPrimaryKeysValues())
        }
      }
      if (this._joinModel) {
        this.refreshData()
        const joinModelPrimaryKeysValue = this._joinModel._schema.primaryKeysValue
        const deleteJoinModel = await this._joinModel.delete(transactionMode)
        this._joinModel._schema.primaryKeysValue = joinModelPrimaryKeysValue
        return deleteJoinModel
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

        this.refreshData()

        return true
      } catch (e) {
        if (transactionMode) await transaction.rollback()
        return errors(e)
      }
    }

    refreshData = () => {
      Object.keys(this._schema.columns).forEach((column) => {
        if (!this._schema.primaryKeys.includes(column)) {
          this._data[column] = this._schema.columns[column]
        }
      })

      Object.keys(this._schema.functionFields).forEach((column) => {
        this._data[column] = null
      })

      this._schema.setPrimaryKeysValues({})

      this._change = {}
    }

    toJSON = async() => {
      let dataJSON = await this._prepareData({ json: true })

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
