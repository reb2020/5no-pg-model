import { getTypeOfValue } from './helper'

class Many extends Array {
  constructor(model) {
    super()
    Object.setPrototypeOf(this, Object.create(Many.prototype))
    Object.defineProperty(this, 'model', {
      get: () => {
        return model
      },
    })
  }

  async add(data = {}) {
    const RelationModel = this.model
    let newRelationModel = new RelationModel()
    newRelationModel._parent = this
    await newRelationModel.setData(data)
    this.push(newRelationModel)
    return newRelationModel
  }

  fetch(fields, values) {
    let indexes = this.getItemsIndexes(fields, values)
    let returnData = []
    if (indexes.length) {
      for (let index of indexes) {
        returnData.push(this[index])
      }
    }

    return returnData
  }

  fetchOne(fields, values) {
    let indexes = this.getItemsIndexes(fields, values)
    if (indexes.length) {
      return this[indexes[0]]
    }
    return null
  }

  getItemsIndexes(fields, values) {
    const typeOfFields = getTypeOfValue(fields)
    if (typeOfFields !== 'array') {
      fields = [fields]
      values = [values]
    }
    let indexes = []
    this.forEach((item, itemIndex) => {
      let indexOfField = 0
      let isAvailable = true
      for (let field of fields) {
        if (item[field] !== values[indexOfField]) {
          isAvailable = false
        }
        indexOfField++
      }

      if (isAvailable) {
        indexes.push(itemIndex)
      }
    })

    return indexes
  }

  removeItemByIndex(index) {
    this.splice(index, 1)
  }

  removeItems(fields, values) {
    let indexes = this.getItemsIndexes(fields, values)
    if (indexes.length) {
      for (let index of indexes) {
        this.removeItemByIndex(index)
      }
    }
  }
}

module.exports = Many
