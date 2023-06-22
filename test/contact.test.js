import supertest from 'supertest'
import {
  createTestContact,
  createTestUser,
  getTestContact,
  removeAllTestContacts,
  removeTestUser,
} from './test-util'
import { web } from '../src/application/web'
import { logger } from '../src/application/logging'

describe('POST /api/contacts', () => {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeAllTestContacts()
    await removeTestUser()
  })

  it('should can create new contact', async () => {
    const result = await supertest(web)
      .post('/api/contacts')
      .set('Authorization', 'testToken')
      .send({
        first_name: 'first_test',
        last_name: 'last_test',
        email: 'test@email.com',
        phone: '089123123123',
      })

    expect(result.status).toBe(200)
    expect(result.body.data.id).toBeDefined()
    expect(result.body.data.first_name).toBe('first_test')
    expect(result.body.data.last_name).toBe('last_test')
    expect(result.body.data.email).toBe('test@email.com')
    expect(result.body.data.phone).toBe('089123123123')
  })

  it('should reject if request is invalid', async () => {
    const result = await supertest(web)
      .post('/api/contacts')
      .set('Authorization', 'testToken')
      .send({
        first_name: '',
        last_name: 'last_test',
        email: 'test',
        phone: '08912312312322222222222222222222',
      })

    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })
})

describe('GET /api/contacts', () => {
  beforeEach(async () => {
    await createTestUser()
    await createTestContact()
  })

  afterEach(async () => {
    await removeAllTestContacts()
    await removeTestUser()
  })

  it('should can get contact by id', async () => {
    const testContact = await getTestContact()

    const result = await supertest(web)
      .get('/api/contacts/' + testContact.id)
      .set('Authorization', 'testToken')

    expect(result.status).toBe(200)
    expect(result.body.data.id).toBe(testContact.id)
    expect(result.body.data.first_name).toBe(testContact.first_name)
    expect(result.body.data.last_name).toBe(testContact.last_name)
    expect(result.body.data.email).toBe(testContact.email)
    expect(result.body.data.phone).toBe(testContact.phone)
  })

  it('should reject if contact id is not found', async () => {
    const testContact = await getTestContact()

    const result = await supertest(web)
      .get('/api/contacts/' + (testContact.id + 1))
      .set('Authorization', 'testToken')

    expect(result.status).toBe(404)
    expect(result.body.errors).toBeDefined()
  })
})
