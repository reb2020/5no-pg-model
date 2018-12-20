import Model from './model'
import Build from './build'

class Manager {
  build = (model, json = false) => {
    return new Build(model, json)
  }
}

module.exports = {
  Manager: new Manager(),
  Model: Model,
}
