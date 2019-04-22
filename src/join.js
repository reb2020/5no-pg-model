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

  add(data = {}) {
    const RelationModel = this.join.model
    const ModelJoin = this.model

    let dataJoin = Object.assign({}, data)
    dataJoin[this.join.local] = data[this.join.foreign]

    const InitModelJoin = new ModelJoin(dataJoin)

    if (typeof data === 'object' && data.constructor.name.toLowerCase() === 'object') {
      const InitRelationModel = new RelationModel(data)
      InitRelationModel._join = InitModelJoin
      this.push(InitRelationModel)
    } else {
      data._join = InitModelJoin
      this.push(data)
    }
  }

  fetch(field, value) {
    return this.filter(item => item[field] === value)
  }

  fetchOne(field, value) {
    return this.fetch(field, value).pop()
  }
}

module.exports = Join
