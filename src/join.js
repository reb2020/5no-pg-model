import { join as ModelJoin, getTypeOfValue } from './helper'

class Join extends Array {
  constructor(name, model, join) {
    super()
    Object.setPrototypeOf(this, Object.create(Join.prototype))
    Object.defineProperty(this, 'name', {
      get: () => {
        return name
      },
    })
    Object.defineProperty(this, 'model', {
      get: () => {
        return model
      },
    })
    Object.defineProperty(this, 'joinData', {
      get: () => {
        return join
      },
    })
  }

  async join(data = {}) {
    this.push(await ModelJoin(this.name, this.model, this.joinData, data, this))
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

module.exports = Join
