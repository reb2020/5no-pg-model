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
    Object.defineProperty(this, 'joinData', {
      get: () => {
        return join
      },
    })
  }

  async join(data = {}) {
    this.push(await ModelJoin(this.model, this.joinData, data))
  }

  fetch(field, value) {
    return this.filter(item => item[field] === value)
  }

  fetchOne(field, value) {
    return this.fetch(field, value).pop()
  }
}

module.exports = Join
