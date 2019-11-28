import BuilderManager from './build'

const initJoin = (name, RelationModel, join, parent) => {
  const JoinModel = join.model

  const InitModelJoin = new JoinModel()
  InitModelJoin._joinName = name
  InitModelJoin._joinSchema = join
  InitModelJoin._joinModel = new RelationModel()
  InitModelJoin._parent = parent

  return InitModelJoin
}

const joinData = async(data, JoinModel) => {
  let setData = {}

  if (typeof data === 'object' && data.constructor.name.toLowerCase() === 'object') {
    setData = Object.assign({}, data)
  } else if (typeof data === 'string') {
    const getData = new BuilderManager(JoinModel, true)
    setData = await getData.find(data)
  } else {
    setData = await data.toJSON()
  }

  return setData
}

const modelJoin = async(name, RelationModel, join, data, parent) => {
  const InitModelJoin = initJoin(name, RelationModel, join, parent)

  let dataJoin = await joinData(data, join.model)
  let newDataJoin = Object.assign({}, dataJoin)
  newDataJoin[join.local] = dataJoin[join.foreign]

  await InitModelJoin._joinModel.setData(newDataJoin)

  await InitModelJoin.setData(dataJoin)

  return InitModelJoin
}

module.exports = {
  initJoin,
  modelJoin,
  joinData,
}
