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
    await newRelationModel.setData(data)
    this.push(newRelationModel)
    return newRelationModel
  }

  fetch(field, value) {
    return this.filter(item => item[field] === value)
  }

  fetchOne(field, value) {
    return this.fetch(field, value).pop()
  }
}

module.exports = Many
