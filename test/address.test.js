import supertest from 'supertest'
import {
  createTestAddress,
  createTestContact,
  createTestUser,
  getTestAddress,
  getTestContact,
  removeAllTestAddresses,
  removeAllTestContacts,
  removeTestUser,
} from './test-util.js'
import { web } from '../src/application/web.js'
import { logger } from '../src/application/logging'

describe('POST /api/contacts/:contactId/addresses', () => {
  beforeEach(async () => {
    await createTestUser()
    await createTestContact()
  })

  afterEach(async () => {
    await removeAllTestAddresses()
    await removeAllTestContacts()
    await removeTestUser()
  })

  it('should can create new address', async () => {
    const testContact = await getTestContact()

    const result = await supertest(web)
      .post('/api/contacts/' + testContact.id + '/addresses')
      .set('Authorization', 'testToken')
      .send({
        street: 'jalan test',
        city: 'kota test',
        province: 'provinsi test',
        country: 'indonesia',
        postal_code: '23232',
      })

    expect(result.status).toBe(200)
    expect(result.body.data.id).toBeDefined()
    expect(result.body.data.street).toBe('jalan test')
    expect(result.body.data.city).toBe('kota test')
    expect(result.body.data.province).toBe('provinsi test')
    expect(result.body.data.country).toBe('indonesia')
    expect(result.body.data.postal_code).toBe('23232')
  })

  it('should reject if request is invalid!', async () => {
    const testContact = await getTestContact()

    const result = await supertest(web)
      .post('/api/contacts/' + testContact.id + '/addresses')
      .set('Authorization', 'testToken')
      .send({
        street: 'jalan test',
        city: 'kota test',
        province: 'provinsi test',
        country: '',
        postal_code: '',
      })

    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })

  it('should reject if contact is not exist', async () => {
    const testContact = await getTestContact()

    const result = await supertest(web)
      .post('/api/contacts/' + (testContact.id + 1) + '/addresses')
      .set('Authorization', 'testToken')
      .send({
        street: 'jalan test',
        city: 'kota test',
        province: 'provinsi test',
        country: 'indonesia',
        postal_code: '23232',
      })

    expect(result.status).toBe(404)
    expect(result.body.errors).toBeDefined()
  })
})

describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
  beforeEach(async () => {
    await createTestUser()
    await createTestContact()
    await createTestAddress()
  })

  afterEach(async () => {
    await removeAllTestAddresses()
    await removeAllTestContacts()
    await removeTestUser()
  })

  it('should can get address', async () => {
    const testContact = await getTestContact()
    const testAddress = await getTestAddress()

    const result = await supertest(web)
      .get('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
      .set('Authorization', 'testToken')

    expect(result.status).toBe(200)
    expect(result.body.data.id).toBeDefined()
    expect(result.body.data.street).toBe('jalan test')
    expect(result.body.data.city).toBe('kota test')
    expect(result.body.data.province).toBe('provinsi test')
    expect(result.body.data.country).toBe('indonesia')
    expect(result.body.data.postal_code).toBe('23232')
  })

  it('should reject if contact is not found', async () => {
    const testContact = await getTestContact()
    const testAddress = await getTestAddress()

    const result = await supertest(web)
      .get(
        '/api/contacts/' + (testContact.id + 1) + '/addresses/' + testAddress.id
      )
      .set('Authorization', 'testToken')

    expect(result.status).toBe(404)
    expect(result.body.errors).toBeDefined()
  })

  it('should reject if address is not found', async () => {
    const testContact = await getTestContact()
    const testAddress = await getTestAddress()

    const result = await supertest(web)
      .get(
        '/api/contacts/' + testContact.id + '/addresses/' + (testAddress.id + 1)
      )
      .set('Authorization', 'testToken')

    expect(result.status).toBe(404)
    expect(result.body.errors).toBeDefined()
  })
})
