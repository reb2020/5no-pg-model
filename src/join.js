import { join as ModelJoin } from './helper'

class Join extends Array {
  constructor(model, join) {
    super()
    Object.setPrototypeOf(this, Object.create(Join.prototype))
    Object.defineProperty(this, 'model', {
      get: () => {
        return model
      },
    })
    Object.defineProperty(this, 'join', {
      get: () => {
        return join
      },
    })
  }

  async add(data = {}) {
    this.push(await ModelJoin(this.model, this.join, data))
  }

  fetch(field, value) {
    return this.filter(item => item[field] === value)
  }

  fetchOne(field, value) {
    return this.fetch(field, value).pop()
  }
}

module.exports = Join
