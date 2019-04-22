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
  'created_at': sinon.match(dateRegex),
  'email': 'test@test.me',
  'id': sinon.match(uuidV4Regex),
  'public_key': 'test_123',
  'secret_key': 'test_333',
  'updated_at': sinon.match(dateRegex),
  'personalised': {
    test: 100,
  },
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
  'created_at': sinon.match(dateRegex),
  'email': 'test@test.me',
  'id': sinon.match(uuidV4Regex),
  'public_key': 'test_123',
  'secret_key': 'test_33309',
  'updated_at': sinon.match(dateRegex),
  'personalised': {
    test: 100,
  },
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

    it('validator', async() => {
      const testNewUser = new Users()

      testNewUser.email = 'test@test'
      testNewUser.public_key = 'test_123'
      testNewUser.secret_key = 'test_333'
      testNewUser.personalised = {
        test: 100,
      }
      testNewUser.Addresses.add({
        street_name: 'Test',
        postcode: '100500',
      })
      testNewUser.Addresses.add({
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
      testNewUser.personalised = {
        test: 100,
      }
      testNewUser.Addresses.add({
        street_name: 'Test',
        postcode: '100500',
      })
      testNewUser.Addresses.add({
        street_name: 'Test1',
        postcode: '100502',
      })
      testNewUser.Info.first_name = 'Aleks2'
      testNewUser.Info.last_name = 'Sokol2'

      testNewUser.Roles.add(adminRole)
      testNewUser.Roles.add(customerRole)

      const returnData = await testNewUser.save()

      usersId = testNewUser.id

      expect(returnData).to.eql(returnData)
    })

    it('create without relations', async() => {
      const testNewUser = new Users()

      testNewUser.email = 'test200@test.me'
      testNewUser.public_key = 'test_123'
      testNewUser.secret_key = 'test_333'
      testNewUser.personalised = {
        test: 100,
      }

      const returnData = await testNewUser.save()

      expect(returnData).to.eql(true)
    })

    it('create duplicate', async() => {
      const testNewUser = new Users()

      testNewUser.email = 'test@test.me'
      testNewUser.public_key = 'test_123'
      testNewUser.secret_key = 'test_333'
      testNewUser.Addresses.add({
        street_name: 'Test',
        postcode: '100500',
      })
      testNewUser.Addresses.add({
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

    it('get', async() => {
      const dataJson = await Manager.build(Users, true).find(usersId)
      let cb = sinon.spy()
      cb(dataJson)
      cb.should.have.been.calledWith(jsonTestData)
    })

    it('update', async() => {
      let data = await Manager.build(Users).find(usersId)

      let oneAddresses = data.Addresses.fetchOne('street_name', 'Test1')
      oneAddresses.postcode = '100508'

      data.Info.last_name = 'Sokol200'
      data.secret_key = 'test_33309'

      await data.save()

      let cb = sinon.spy()
      cb(data.toJSON())
      cb.should.have.been.calledWith(jsonTestUpdateData)
    })

    it('delete one item', async() => {
      let data = await Manager.build(Users).find(usersId)

      let dataDel = data.Roles.fetchOne('role', 'Admin')

      expect(await dataDel.delete()).to.eql(true)
    })

    it('delete', async() => {
      let data = await Manager.build(Users).find(usersId)

      expect(await data.delete()).to.eql(true)
    })
  })
})
