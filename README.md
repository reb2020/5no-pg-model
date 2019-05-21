JS ORM for PostgreSQL

## Install

5no-pg-model requires Node version 8 or above.

```sh
npm install --save 5no-pg-model
```

## .env

```js
DATABASE_URL=postgres://test:123123@127.0.0.1:5432/testDB
DATABASE_SSL=false
DATABASE_QUERY_LOG=true
```

## Schema

```js
    {
      table: {
        schema: 'public', //database schema name
        name: 'users', //table name
      },
      columns: { // describe columns 
        [name]: { // column name
          type: String, // String, Number, Boolean, Date, Object, Array
          primaryKey: true, // only for primaryKey
          defaultValue: null, // default value
          required: true, // validate values
        },
        [name]: { // Auto filling column name
          type: Date,
          created: true, // Fill in create moment
          format: 'YYYY-MM-DD HH:mm:ss', // Format date
        },
        [name]: { // Auto filling column name
          type: Date,
          updated: true, // Fill in update moment
          format: 'YYYY-MM-DD HH:mm:ss', // Format date
        },
      },
      relations: {
        Info: { // name 
          model: UsersInfo, // model 
          join: {}, // join model
          local: 'id', // local column
          foreign: 'user_id', // external table field
          type: 'one', // one, many, join
          cascade: [ // cascade methods "save", "delete"
            'save',
            'delete',
          ],
        }
      }
    }
```

## Model Methods

```js
async save(transactionMode = true, allSave = false) // Save changes
async setData(data) // set changes by Json data
async saveByData(data) // Save changes by Json data
async delete() // Delete entries
async toJSON() // Return to JSON format
```


## Manager.build(model, json = false) 

```js
find(...values) // get one row by primary keys
findOne(field, value) // get one row by filter
findAll(field, value, order = null, limit = null) // get all rows by filter
count(field, value) // get count rows
```

## Model Relations Type "many" Methods

```js
await add(data = {}) // Model data
fetch(field, value) // get rows by filter
fetchOne(field, value) // get row by filter
```

## Examples

```js
const { Manager, Model } = require('5no-pg-model')


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
          type: 'join', // many to many
          cascade: [
            'save',
            'delete',
          ],
        },
      },
    }
}
```

CREATE NEW ENTRY

```js
const roleModel = new Roles()
roleModel.role = 'Admin'
await roleModel.save()

const testNewUser = new Users()

testNewUser.email = 'test@test.me'
testNewUser.public_key = 'test_123'
testNewUser.secret_key = 'test_333'
testNewUser.personalised = {
  test: 100
}
      
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

await testNewUser.Roles.add(roleModel)

const returnData = await testNewUser.save()

/* 
If all correct function return boolean "true" otherwise array errors
Error: [
        'duplicate key value violates unique constraint "users_email_index"',
      ]
*/

```


GET 

```js
const dataJson = await Manager.build(Users, true).find(usersId)
```

return

```js
{ 
  id: '7852468e-ac99-4f5e-9ee3-d506b0c4424e',
  secret_key: 'test_333',
  email: 'test@test.me',
  public_key: 'test_123',
  created_at: '2018-12-20 17:10:31',
  updated_at: '2018-12-20 17:10:31',
  personalised: {
    test: 100
  },
  Info: 
   { id: '0320dc4f-4ca7-4b65-bd42-52f286a0b9db',
     user_id: '7852468e-ac99-4f5e-9ee3-d506b0c4424e',
     first_name: 'Aleks2',
     last_name: 'Sokol2',
     created_at: '2018-12-20 17:10:31',
     updated_at: '2018-12-20 17:10:31' },
  Addresses: 
   [ 
     { id: 'be40ccb3-3a33-4b6e-9467-6907b0c4396b',
       user_id: '7852468e-ac99-4f5e-9ee3-d506b0c4424e',
       street_name: 'Test',
       postcode: '100500',
       created_at: '2018-12-20 17:10:31',
       updated_at: '2018-12-20 17:10:31' },
     { id: 'f5bae3e9-290b-451e-a0e2-1ec2d9eaf543',
       user_id: '7852468e-ac99-4f5e-9ee3-d506b0c4424e',
       street_name: 'Test1',
       postcode: '100502',
       created_at: '2018-12-20 17:10:31',
       updated_at: '2018-12-20 17:10:31' } 
    ], 
  Roles: [
    {
      created_at: '2018-12-20 17:10:31',
      id: 'be40ccb3-3a33-4b6e-9467-6907b0c4396b',
      role: 'Admin',
      updated_at: '2018-12-20 17:10:31'
    }
  ]
}
```

UPDATE

```js
let data = await Manager.build(Users).find(usersId)

let oneAddresses = data.Addresses.fetchOne('street_name', 'Test1')
oneAddresses.postcode = '100508'

data.Info.last_name = 'Sokol200'
data.secret_key = 'test_33309'

await data.save()

```


SAVE BY DATA

```js
const testNewUser = new Users()

const newData = {
        email: 'test2010@test.me',
        public_key: 'test_123',
        secret_key: 'test_333',
        personalised: {
          test: 100,
        },
        Addresses: [{
          street_name: 'Test 100',
          postcode: '100501',
        }]
}

const returnData = await testNewUser.saveByData(newData)

```


DELETE

```js
let data = await Manager.build(Users).find(usersId)
await data.delete()

/* 
If all correct function return boolean "true" otherwise array errors
*/
```

DELETE ONE ITEM FROM RELATE

```js
let data = await Manager.build(Users).find(usersId)
let dataDel = data.Roles.fetchOne('role', 'Admin')
await dataDel.delete()
```

## License

MIT Licensed, Copyright (c) 2018 Aleksandr Sokol