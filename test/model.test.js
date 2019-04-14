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
}

describe('Model', () => {
  beforeEach(() => {
  })

  afterEach(() => {
  })

  describe('entry', () => {
    it('validator', async() => {
      const testNewUser = new Users()

      testNewUser.email = 'test@test'
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

      expect(error).to.eql([
        'email has incorrect email format',
      ])
    })

    it('create', async() => {
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

      const returnData = await testNewUser.save()

      usersId = testNewUser.id

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

      expect(error).to.eql([
        'duplicate key value violates unique constraint "users_email_index"',
      ])
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

    it('delete', async() => {
      let data = await Manager.build(Users).find(usersId)

      expect(await data.delete()).to.eql(true)
    })
  })
})
