const chai = require('chai')
var sinon = require('sinon')
var sinonChai = require('sinon-chai')
chai.should()
chai.use(sinonChai)

const { Manager, Model } = require('../index')

const expect = chai.expect

const uuidV4Regex = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i
const dateRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/i

let usersId = null
let usersNewId = null
let adminRole = null
let customerRole = null

class Roles extends Model {
  static schema = {
    table: {
      schema: 'public',
      name: 'roles',
    },
    columns: {
      id: {
        type: String,
        primaryKey: true,
        defaultValue: null,
      },
      role: {
        type: String,
        defaultValue: null,
      },
      created_at: {
        type: Date,
        created: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      updated_at: {
        type: Date,
        updated: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    relations: {},
  }
}

class UserRoles extends Model {
  static schema = {
    table: {
      schema: 'public',
      name: 'user_roles',
    },
    columns: {
      user_id: {
        type: String,
        defaultValue: null,
        primaryKey: true,
      },
      role_id: {
        type: String,
        defaultValue: null,
        primaryKey: true,
      },
    },
    relations: {},
  }
}

class UserRole extends Model {
  static schema = {
    table: {
      schema: 'public',
      name: 'user_role',
    },
    columns: {
      user_id: {
        type: String,
        defaultValue: null,
        primaryKey: true,
      },
      role_id: {
        type: String,
        defaultValue: null,
      },
    },
    relations: {},
  }
}

class UsersAddresses extends Model {
    static schema = {
      table: {
        schema: 'public',
        name: 'users_address',
      },
      columns: {
        id: {
          type: String,
          primaryKey: true,
          defaultValue: null,
        },
        user_id: {
          type: String,
          defaultValue: null,
          required: true,
        },
        street_name: {
          type: String,
          defaultValue: null,
        },
        postcode: {
          type: String,
          defaultValue: null,
        },
        created_at: {
          type: Date,
          created: true,
          format: 'YYYY-MM-DD HH:mm:ss',
        },
        updated_at: {
          type: Date,
          updated: true,
          format: 'YYYY-MM-DD HH:mm:ss',
        },
      },
      relations: {},
    }
}

class UsersInfo extends Model {
    static schema = {
      table: {
        schema: 'public',
        name: 'users_info',
      },
      columns: {
        id: {
          type: String,
          primaryKey: true,
          defaultValue: null,
        },
        user_id: {
          type: String,
          defaultValue: null,
          required: true,
        },
        first_name: {
          type: String,
          defaultValue: null,
        },
        last_name: {
          type: String,
          defaultValue: null,
        },
        created_at: {
          type: Date,
          created: true,
          format: 'YYYY-MM-DD HH:mm:ss',
        },
        updated_at: {
          type: Date,
          updated: true,
          format: 'YYYY-MM-DD HH:mm:ss',
        },
      },
      relations: {},
    }
}

class Users extends Model {
    static schema = {
      table: {
        schema: 'public',
        name: 'users',
      },
      columns: {
        id: {
          type: String,
          primaryKey: true,
          defaultValue: null,
        },
        email: {
          type: String,
          required: true,
          validators: [
            'email',
          ],
        },
        public_key: {
          type: String,
          required: true,
        },
        secret_key: {
          type: String,
          defaultValue: '',
          required: true,
        },
        personalised: {
          type: Object,
          prefilled: true,
          defaultValue: {
            test: 100,
          },
        },
        properties: {
          type: Array,
          defaultValue: [],
          schema: {
            name: {
              type: String,
              required: true,
              filters: [
                'lowerCase',
              ],
            },
            value: {
              type: String,
              required: true,
            },
          },
        },
        created_at: {
          type: Date,
          created: true,
          format: 'YYYY-MM-DD HH:mm:ss',
        },
        updated_at: {
          type: Date,
          updated: true,
          format: 'YYYY-MM-DD HH:mm:ss',
        },
      },
      relations: {
        Info: {
          model: UsersInfo,
          local: 'id',
          foreign: 'user_id',
          type: 'one',
          cascade: [
            'save',
            'delete',
          ],
        },
        Addresses: {
          model: UsersAddresses,
          local: 'id',
          foreign: 'user_id',
          type: 'many',
          cascade: [
            'save',
            'delete',
          ],
        },
        Roles: {
          model: UserRoles,
          join: {
            model: Roles,
            local: 'role_id',
            foreign: 'id',
            type: 'many',
          },
          local: 'id',
          foreign: 'user_id',
          type: 'join',
          cascade: [
            'save',
            'delete',
          ],
        },
        Role: {
          model: UserRole,
          join: {
            model: Roles,
            local: 'role_id',
            foreign: 'id',
            type: 'one',
          },
          local: 'id',
          foreign: 'user_id',
          type: 'join',
          cascade: [
            'save',
            'delete',
          ],
        },
      },
    }
}

const jsonTestData = {
  'Addresses': [
    {
      'created_at': sinon.match(dateRegex),
      'id': sinon.match(uuidV4Regex),
      'postcode': '100500',
      'street_name': 'Test',
      'updated_at': sinon.match(dateRegex),
      'user_id': sinon.match(uuidV4Regex),
    },
    {
      'created_at': sinon.match(dateRegex),
      'id': sinon.match(uuidV4Regex),
      'postcode': '100502',
      'street_name': 'Test1',
      'updated_at': sinon.match(dateRegex),
      'user_id': sinon.match(uuidV4Regex),
    },
  ],
  'Roles': [
    {
      'created_at': sinon.match(dateRegex),
      'id': sinon.match(uuidV4Regex),
      'role': 'Admin',
      'updated_at': sinon.match(dateRegex),
    },
    {
      'created_at': sinon.match(dateRegex),
      'id': sinon.match(uuidV4Regex),
      'role': 'Customer',
      'updated_at': sinon.match(dateRegex),
    },
  ],
  'Info': {
    'created_at': sinon.match(dateRegex),
    'first_name': 'Aleks2',
    'id': sinon.match(uuidV4Regex),
    'last_name': 'Sokol2',
    'updated_at': sinon.match(dateRegex),
    'user_id': sinon.match(uuidV4Regex),
  },
  'Role': {
    'created_at': sinon.match(dateRegex),
    'id': sinon.match(uuidV4Regex),
    'role': 'Admin',
    'updated_at': sinon.match(dateRegex),
  },
  'created_at': sinon.match(dateRegex),
  'email': 'test@test.me',
  'id': sinon.match(uuidV4Regex),
  'public_key': 'test_123',
  'secret_key': 'test_333',
  'updated_at': sinon.match(dateRegex),
  'personalised': {
    test: 100,
  },
  'properties': [
    {
      name: 'test',
      value: 'OK',
    },
  ],
}

const jsonUserRolesTestData = {
  'user_id': sinon.match(uuidV4Regex),
  'role_id': sinon.match(uuidV4Regex),
}

const jsonUpdateTestData = {
  'Addresses': [
    {
      'created_at': sinon.match(dateRegex),
      'id': sinon.match(uuidV4Regex),
      'postcode': '100501',
      'street_name': 'Test',
      'updated_at': sinon.match(dateRegex),
      'user_id': sinon.match(uuidV4Regex),
    },
    {
      'created_at': sinon.match(dateRegex),
      'id': sinon.match(uuidV4Regex),
      'postcode': '100502',
      'street_name': 'Test1',
      'updated_at': sinon.match(dateRegex),
      'user_id': sinon.match(uuidV4Regex),
    },
  ],
  'Roles': [
    {
      'created_at': sinon.match(dateRegex),
      'id': sinon.match(uuidV4Regex),
      'role': 'Admin',
      'updated_at': sinon.match(dateRegex),
    },
    {
      'created_at': sinon.match(dateRegex),
      'id': sinon.match(uuidV4Regex),
      'role': 'Customer',
      'updated_at': sinon.match(dateRegex),
    },
  ],
  'Info': {
    'created_at': sinon.match(dateRegex),
    'first_name': 'Aleks21',
    'id': sinon.match(uuidV4Regex),
    'last_name': 'Sokol21',
    'updated_at': sinon.match(dateRegex),
    'user_id': sinon.match(uuidV4Regex),
  },
  'Role': {
    'created_at': sinon.match(dateRegex),
    'id': sinon.match(uuidV4Regex),
    'role': 'Admin',
    'updated_at': sinon.match(dateRegex),
  },
  'created_at': sinon.match(dateRegex),
  'email': 'test@test.me',
  'id': sinon.match(uuidV4Regex),
  'public_key': 'test_1231',
  'secret_key': 'test_3331',
  'updated_at': sinon.match(dateRegex),
  'personalised': {
    test: 100,
  },
  'properties': [
    {
      name: 'test',
      value: 'OK',
    },
    {
      name: 'test2',
      value: 'OK2',
    },
  ],
}

const jsonTestUpdateData = {
  'Addresses': [
    {
      'created_at': sinon.match(dateRegex),
      'id': sinon.match(uuidV4Regex),
      'postcode': '100500',
      'street_name': 'Test',
      'updated_at': sinon.match(dateRegex),
      'user_id': sinon.match(uuidV4Regex),
    },
    {
      'created_at': sinon.match(dateRegex),
      'id': sinon.match(uuidV4Regex),
      'postcode': '100508',
      'street_name': 'Test1',
      'updated_at': sinon.match(dateRegex),
      'user_id': sinon.match(uuidV4Regex),
    },
  ],
  'Roles': [
    {
      'created_at': sinon.match(dateRegex),
      'id': sinon.match(uuidV4Regex),
      'role': 'Admin',
      'updated_at': sinon.match(dateRegex),
    },
    {
      'created_at': sinon.match(dateRegex),
      'id': sinon.match(uuidV4Regex),
      'role': 'Customer',
      'updated_at': sinon.match(dateRegex),
    },
  ],
  'Info': {
    'created_at': sinon.match(dateRegex),
    'first_name': 'Aleks2',
    'id': sinon.match(uuidV4Regex),
    'last_name': 'Sokol200',
    'updated_at': sinon.match(dateRegex),
    'user_id': sinon.match(uuidV4Regex),
  },
  'Role': {
    'created_at': sinon.match(dateRegex),
    'id': sinon.match(uuidV4Regex),
    'role': 'Customer',
    'updated_at': sinon.match(dateRegex),
  },
  'created_at': sinon.match(dateRegex),
  'email': 'test@test.me',
  'id': sinon.match(uuidV4Regex),
  'public_key': 'test_123',
  'secret_key': 'test_33309',
  'updated_at': sinon.match(dateRegex),
  'personalised': {
    test: 100,
  },
  'properties': [
    {
      name: 'test',
      value: 'OK',
    },
    {
      name: 'test2',
      value: 'OK2',
    },
  ],
}

const jsonNullTestData = {
  'created_at': sinon.match(dateRegex),
  'id': sinon.match(uuidV4Regex),
  'role': null,
  'updated_at': sinon.match(dateRegex),
}

describe('Model', () => {
  beforeEach(() => {
  })

  afterEach(() => {
  })

  describe('entry', () => {
    it('add admin role', async() => {
      const role = new Roles()

      role.role = 'Admin'

      const roleData = await role.save()

      adminRole = role

      expect(roleData).to.eql(true)
    })

    it('add customer role', async() => {
      const role = new Roles()

      role.role = 'Customer'

      const roleData = await role.save()

      customerRole = role

      expect(roleData).to.eql(true)
    })

    it('add null role', async() => {
      const role = new Roles()

      role.role = null

      const roleData = await role.save()

      expect(roleData).to.eql(true)
    })

    it('validator', async() => {
      const testNewUser = new Users()

      testNewUser.email = 'test@test'
      testNewUser.public_key = 'test_123'
      testNewUser.secret_key = 'test_333'
      await testNewUser.Addresses.add({
        street_name: 'Test',
        postcode: '100500',
      })
      await testNewUser.Addresses.add({
        street_name: 'Test1',
        postcode: '100502',
      })
      testNewUser.Info.first_name = 'Aleks2'
      testNewUser.Info.last_name = 'Sokol2'

      const error = await testNewUser.save()

      expect(error).to.eql({
        email: ['email has incorrect email format'],
      })
    })

    it('create', async() => {
      const testNewUser = new Users()

      testNewUser.email = 'test@test.me'
      testNewUser.public_key = 'test_123'
      testNewUser.secret_key = 'test_333'
      testNewUser.properties = [
        {
          name: 'Test',
          value: 'OK',
        },
      ]
      await testNewUser.Addresses.add({
        street_name: 'Test',
        postcode: '100500',
      })
      await testNewUser.Addresses.add({
        street_name: 'Test1',
        postcode: '100502',
      })
      testNewUser.Info.first_name = 'Aleks2'
      testNewUser.Info.last_name = 'Sokol2'

      await testNewUser.Roles.join(adminRole)
      await testNewUser.Roles.join(customerRole)
      await testNewUser.Role.join(adminRole)

      const returnData = await testNewUser.save()

      usersId = testNewUser.id

      expect(returnData).to.eql(true)
    })

    it('create without relations', async() => {
      const testNewUser = new Users()

      testNewUser.email = 'test200@test.me'
      testNewUser.public_key = 'test_123'
      testNewUser.secret_key = 'test_333'

      const returnData = await testNewUser.save()

      expect(returnData).to.eql(true)
    })

    it('create by json', async() => {
      const testNewUser = new Users()

      const newData = {
        email: 'test2010@test.me',
        public_key: 'test_123',
        secret_key: 'test_333',
        Addresses: [{
          street_name: 'Test 100',
          postcode: '100501',
        }],
        Roles: [ await adminRole.toJSON() ],
      }

      const returnData = await testNewUser.saveByData(newData)

      usersNewId = testNewUser.id

      expect(returnData).to.eql(true)
    })

    it('just a save', async() => {
      const data = await Manager.build(Users).find(usersNewId)
      data.secret_key = '100'

      const returnData = await data.save()

      expect(returnData).to.eql(true)
    })

    it('add join', async() => {
      const data = await Manager.build(Users).find(usersNewId)

      await data.Addresses.add({
        street_name: 'Test1000',
        postcode: '100502',
      })

      await data.Roles.join(customerRole)
      await data.Role.join(adminRole)

      const returnData = await data.save()

      expect(returnData).to.eql(true)
      expect(data.Role.id).to.eql(adminRole.id)
    })

    it('delete join', async() => {
      const data = await Manager.build(Users).find(usersNewId)

      const returnData = await data.Role.delete()

      expect(returnData).to.eql(true)
      expect(data.Role.id).to.eql(null)

      let dataDel = data.Roles.fetchOne('role', 'Admin')

      const r = await dataDel.delete()

      expect(r).to.eql(true)
      expect(data.Roles.length).to.eql(1)

      expect(data.Addresses.length).to.eql(2)

      let dataAddresses = data.Addresses.fetchOne('street_name', 'Test1000')

      const rD = await dataAddresses.delete()

      expect(rD).to.eql(true)
      expect(data.Addresses.length).to.eql(1)
    })

    it('add join by id', async() => {
      const data = await Manager.build(Users).find(usersNewId)

      await data.Role.join(adminRole.id)
      await data.Roles.join(adminRole.id)

      const returnData = await data.save()

      expect(returnData).to.eql(true)
      expect(data.Role.id).to.eql(adminRole.id)
      expect(data.Roles.length).to.eql(2)
    })

    it('create duplicate', async() => {
      const testNewUser = new Users()

      testNewUser.email = 'test@test.me'
      testNewUser.public_key = 'test_123'
      testNewUser.secret_key = 'test_333'
      await testNewUser.Addresses.add({
        street_name: 'Test',
        postcode: '100500',
      })
      await testNewUser.Addresses.add({
        street_name: 'Test1',
        postcode: '100502',
      })
      testNewUser.Info.first_name = 'Aleks2'
      testNewUser.Info.last_name = 'Sokol2'

      const error = await testNewUser.save()

      expect(error).to.eql({
        error: 'duplicate key value violates unique constraint "users_email_index"',
      })
    })

    it('get data with the few primary keys', async() => {
      const dataJson = await Manager.build(UserRoles, true).find(usersId, adminRole.id)
      let cb = sinon.spy()
      cb(dataJson)
      cb.should.have.been.calledWith(jsonUserRolesTestData)
    })

    it('count', async() => {
      const dataJson = await Manager.build(Users).count('email', 'test2010@test.me')
      expect(dataJson).to.eql(1)
    })

    it('count not found', async() => {
      const dataJson = await Manager.build(Users).count('email', 'test2010@test.me1')
      expect(dataJson).to.eql(0)
    })

    it('get all', async() => {
      const dataJson = await Manager.build(Users, true).findAll('email', 'test@test.me', 'created_at DESC', 1)
      let cb = sinon.spy()
      cb(dataJson[0])
      cb.should.have.been.calledWith(jsonTestData)
    })

    it('get all by couple fields', async() => {
      const dataJson = await Manager.build(Users, true).findAll(['email', 'public_key'], ['test@test.me', 'test_123'], 'created_at DESC', 1)
      let cb = sinon.spy()
      cb(dataJson[0])
      cb.should.have.been.calledWith(jsonTestData)
    })

    it('get', async() => {
      const dataJson = await Manager.build(Users, true).find(usersId)
      let cb = sinon.spy()
      cb(dataJson)
      cb.should.have.been.calledWith(jsonTestData)
    })

    it('get null', async() => {
      const dataJson = await Manager.build(Roles, true).findOne('role', null)
      let cb = sinon.spy()
      cb(dataJson)
      cb.should.have.been.calledWith(jsonNullTestData)
    })

    it('update', async() => {
      let data = await Manager.build(Users).find(usersId)

      let oneAddresses = data.Addresses.fetchOne('street_name', 'Test1')
      oneAddresses.postcode = '100508'

      data.Info.last_name = 'Sokol200'
      data.secret_key = 'test_33309'
      data.properties = [
        {
          name: 'Test',
          value: 'OK',
        },
        {
          name: 'Test2',
          value: 'OK2',
        },
      ]

      await data.Role.join(customerRole)

      await data.save()
      const testData = await data.toJSON()

      let cb = sinon.spy()
      cb(testData)
      cb.should.have.been.calledWith(jsonTestUpdateData)
    })

    it('update setData', async() => {
      let data = await Manager.build(Users).find(usersId)

      const testDataJson = await data.toJSON()

      testDataJson.Addresses[1].postcode = '100502'

      await data.setData({
        secret_key: 'test_333',
        Info: {
          last_name: 'Sokol2',
        },
        Addresses: testDataJson.Addresses,
        properties: [
          {
            name: 'Test',
            value: 'OK',
          },
        ],
      })

      await data.save(true, true)
      const testData = await data.toJSON()

      let cb = sinon.spy()
      cb(testData)
      cb.should.have.been.calledWith(jsonTestData)
    })

    it('saveByData', async() => {
      const dataJson = await Manager.build(Users, true).find(usersId)
      let cb = sinon.spy()
      cb(dataJson)
      cb.should.have.been.calledWith(jsonTestData)

      dataJson.Addresses[0].postcode = '100501'
      dataJson.Info.first_name = 'Aleks21'
      dataJson.Info.last_name = 'Sokol21'
      dataJson.public_key = 'test_1231'
      dataJson.secret_key = 'test_3331'
      dataJson.properties = [
        {
          name: 'Test',
          value: 'OK',
        },
        {
          name: 'Test2',
          value: 'OK2',
        },
      ]

      const newUserData = new Users()
      await newUserData.saveByData(dataJson)

      const data = await newUserData.toJSON()

      cb(data)
      cb.should.have.been.calledWith(jsonUpdateTestData)
    })

    it('delete one item', async() => {
      let data = await Manager.build(Users).find(usersId)

      let dataDel = data.Roles.fetchOne('role', 'Admin')

      const r = await dataDel.delete()

      expect(r).to.eql(true)
      expect(data.Roles.length).to.eql(1)
    })

    it('delete related item', async() => {
      let data = await Manager.build(Users).find(usersId)
      expect(await data.Role.delete()).to.eql(true)

      expect(await data.save()).to.eql(true)

      expect(data.Role.id).to.eql(null)
    })

    it('delete', async() => {
      let data = await Manager.build(Users).find(usersId)

      expect(await data.delete()).to.eql(true)
    })

    it('builder', async() => {
      const builder = await Manager.build(Users).builder()

      builder.select().where('id', '=', usersNewId)

      const data = await builder.rows()

      expect(data[0].id).to.eql(usersNewId)
      expect(data[0].Role.id).to.eql(adminRole.id)
    })
  })
})
