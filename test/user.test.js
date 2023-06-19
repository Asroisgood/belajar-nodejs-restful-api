import supertest from 'supertest'
import { web } from '../src/application/web.js'
import { logger } from '../src/application/logging.js'
import { createTestUser, getTestUser, removeTestUser } from './test-util.js'
import bcrypt from 'bcrypt'

describe('POST /api/users', function () {
  afterEach(async () => {
    await removeTestUser()
  })

  it('should can register new user', async () => {
    const result = await supertest(web).post('/api/users').send({
      username: 'test',
      password: 'rahasia',
      name: 'Nama Test',
    })

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('test')
    expect(result.body.data.name).toBe('Nama Test')
    expect(result.body.data.password).toBeUndefined()
  })

  it('should reject if request is invalid', async () => {
    const result = await supertest(web).post('/api/users').send({
      username: '',
      password: '',
      name: '',
    })

    logger.info(result.body)

    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })
  it('should reject if username is already registered', async () => {
    let result = await supertest(web).post('/api/users').send({
      username: 'test',
      password: 'rahasia',
      name: 'Nama Test',
    })

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('test')
    expect(result.body.data.name).toBe('Nama Test')
    expect(result.body.data.password).toBeUndefined()

    result = await supertest(web).post('/api/users').send({
      username: 'test',
      password: 'rahasia',
      name: 'Nama Test',
    })

    logger.info(result.body)

    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })
})

describe('POST /api/users/login', () => {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeTestUser()
  })

  it('should can login', async () => {
    const result = await supertest(web).post('/api/users/login').send({
      username: 'test',
      password: 'rahasia',
    })

    logger.info(result.body)

    expect(result.status).toBe(200)
    expect(result.body.data.token).toBeDefined()
    expect(result.body.data.token).not.toBe('test')
  })

  it('should reject if username or password is invalid', async () => {
    const result = await supertest(web).post('/api/users/login').send({
      username: '',
      password: '',
    })

    logger.info(result.body)

    expect(result.status).toBe(400)
    expect(result.body.errors).toBeDefined()
  })

  it('should reject if password is wrong', async () => {
    const result = await supertest(web).post('/api/users/login').send({
      username: 'test',
      password: 'qweqweqw',
    })

    logger.info(result.body)

    expect(result.status).toBe(401)
    expect(result.body.errors).toBeDefined()
  })

  it('should reject if username is wrong', async () => {
    const result = await supertest(web).post('/api/users/login').send({
      username: 'qweqwe',
      password: 'rahasia',
    })

    logger.info(result.body)

    expect(result.status).toBe(401)
    expect(result.body.errors).toBeDefined()
  })
})

describe('GET /api/users/current', () => {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeTestUser()
  })

  it('should can get current user', async () => {
    const result = await supertest(web)
      .get('/api/users/current')
      .set('Authorization', 'testToken')

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('test')
    expect(result.body.data.name).toBe('Nama Test')
  })

  it('should reject if token is not correct!', async () => {
    const result = await supertest(web)
      .get('/api/users/current')
      .set('Authorization', 'token')

    expect(result.status).toBe(401)
    expect(result.body.errors).toBeDefined()
  })
})

describe('PATCH /api/users/current', () => {
  beforeEach(async () => {
    await createTestUser()
  })

  afterEach(async () => {
    await removeTestUser()
  })

  it('should can update user', async () => {
    const result = await supertest(web)
      .patch('/api/users/current')
      .set('Authorization', 'testToken')
      .send({
        name: 'Arief',
        password: 'rahasiaArief',
      })

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('test')
    expect(result.body.data.name).toBe('Arief')

    const user = await getTestUser()
    expect(await bcrypt.compare('rahasiaArief', user.password)).toBe(true)
  })

  it('should can update name', async () => {
    const result = await supertest(web)
      .patch('/api/users/current')
      .set('Authorization', 'testToken')
      .send({
        name: 'Arief',
      })

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('test')
    expect(result.body.data.name).toBe('Arief')
  })

  it('should can update password', async () => {
    const result = await supertest(web)
      .patch('/api/users/current')
      .set('Authorization', 'testToken')
      .send({
        password: 'rahasiaArief',
      })

    expect(result.status).toBe(200)
    expect(result.body.data.username).toBe('test')

    const user = await getTestUser()
    expect(await bcrypt.compare('rahasiaArief', user.password)).toBe(true)
  })

  it('should reject if request is invalid!', async () => {
    const result = await supertest(web)
      .patch('/api/users/current')
      .set('Authorization', 'tokenIsWrong')
      .send({
        name: 'Arief',
        password: 'rahasiaArief',
      })

    expect(result.status).toBe(401)
  })
})
