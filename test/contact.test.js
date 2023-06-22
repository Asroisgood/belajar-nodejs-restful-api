import supertest from 'supertest'
import {
  createManyTestContacts,
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

describe('GET /api/contacts/:contactId', () => {
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

describe('PUT /api/contacts/:contactId', () => {
  beforeEach(async () => {
    await createTestUser()
    await createTestContact()
  })

  afterEach(async () => {
    await removeAllTestContacts()
    await removeTestUser()
  })

  it('should can update existing contact', async () => {
    const testContact = await getTestContact()

    const result = await supertest(web)
      .put('/api/contacts/' + testContact.id)
      .set('Authorization', 'testToken')
      .send({
        first_name: 'Arief',
        last_name: "Asro'i",
        email: 'asro.isgood@gmail.com',
        phone: '0895422988808',
      })

    expect(result.status).toBe(200)
    expect(result.body.data.id).toBe(testContact.id)
    expect(result.body.data.first_name).toBe('Arief')
    expect(result.body.data.last_name).toBe("Asro'i")
    expect(result.body.data.email).toBe('asro.isgood@gmail.com')
    expect(result.body.data.phone).toBe('0895422988808')
  })

  it('should reject if request is invalid', async () => {
    const testContact = await getTestContact()

    const result = await supertest(web)
      .put('/api/contacts/' + testContact.id)
      .set('Authorization', 'testToken')
      .send({
        first_name: '',
        last_name: '',
        email: 'iniBukanEmail',
        phone: 'nomorSalah',
      })

    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })

  it('should reject if contact is not found', async () => {
    const testContact = await getTestContact()

    const result = await supertest(web)
      .put('/api/contacts/' + (testContact.id + 1))
      .set('Authorization', 'testToken')
      .send({
        first_name: 'Arief',
        last_name: "Asro'i",
        email: 'asro.isgood@gmail.com',
        phone: '0895422988808',
      })

    expect(result.status).toBe(404)
    expect(result.body.errors).toBeDefined()
  })
})

describe('DELETE /api/contacts/:contactId', () => {
  beforeEach(async () => {
    await createTestUser()
    await createTestContact()
  })

  afterEach(async () => {
    await removeAllTestContacts()
    await removeTestUser()
  })

  it('should can remove contact', async () => {
    let testContact = await getTestContact()
    const result = await supertest(web)
      .delete('/api/contacts/' + testContact.id)
      .set('Authorization', 'testToken')

    expect(result.status).toBe(200)
    expect(result.body.data).toBe('OK')

    testContact = await getTestContact()
    expect(testContact).toBeNull()
  })

  it('should reject if contact is not found', async () => {
    const testContact = await getTestContact()
    const result = await supertest(web)
      .delete('/api/contacts/' + (testContact.id + 1))
      .set('Authorization', 'testToken')

    expect(result.status).toBe(404)
    expect(result.body.errors).toBeDefined()
  })
})

describe('GET /api/contacts/', () => {
  beforeEach(async () => {
    await createTestUser()
    await createManyTestContacts()
  })

  afterEach(async () => {
    await removeAllTestContacts()
    await removeTestUser()
  })

  it('should can search without any queries', async () => {
    const result = await supertest(web)
      .get('/api/contacts/')
      .set('Authorization', 'testToken')

    expect(result.status).toBe(200)
    expect(result.body.data.length).toBe(10)
    expect(result.body.paging.page).toBe(1)
    expect(result.body.paging.total_page).toBe(2)
    expect(result.body.paging.total_item).toBe(15)
  })

  it('should can search to page 2', async () => {
    const result = await supertest(web)
      .get('/api/contacts/')
      .query({
        page: 2,
      })
      .set('Authorization', 'testToken')

    expect(result.status).toBe(200)
    expect(result.body.data.length).toBe(5)
    expect(result.body.paging.page).toBe(2)
    expect(result.body.paging.total_page).toBe(2)
    expect(result.body.paging.total_item).toBe(15)
  })

  it('should can search using name', async () => {
    const result = await supertest(web)
      .get('/api/contacts/')
      .query({
        name: 'test 1',
      })
      .set('Authorization', 'testToken')

    expect(result.status).toBe(200)
    expect(result.body.data.length).toBe(6)
    expect(result.body.paging.page).toBe(1)
    expect(result.body.paging.total_page).toBe(1)
    expect(result.body.paging.total_item).toBe(6)
  })

  it('should can search using email', async () => {
    const result = await supertest(web)
      .get('/api/contacts/')
      .query({
        email: 'test1',
      })
      .set('Authorization', 'testToken')

    expect(result.status).toBe(200)
    expect(result.body.data.length).toBe(6)
    expect(result.body.paging.page).toBe(1)
    expect(result.body.paging.total_page).toBe(1)
    expect(result.body.paging.total_item).toBe(6)
  })

  it('should can search using phone', async () => {
    const result = await supertest(web)
      .get('/api/contacts/')
      .query({
        phone: '0891231231201',
      })
      .set('Authorization', 'testToken')

    expect(result.status).toBe(200)
    expect(result.body.data.length).toBe(6)
    expect(result.body.paging.page).toBe(1)
    expect(result.body.paging.total_page).toBe(1)
    expect(result.body.paging.total_item).toBe(6)
  })
})
