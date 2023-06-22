import { prismaClient } from '../src/application/database'
import bcrypt from 'bcrypt'

const removeTestUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      username: 'test',
    },
  })
}

const createTestUser = async () => {
  await prismaClient.user.create({
    data: {
      username: 'test',
      password: await bcrypt.hash('rahasia', 10),
      name: 'Nama Test',
      token: 'testToken',
    },
  })
}

const getTestUser = async () => {
  return prismaClient.user.findUnique({
    where: {
      username: 'test',
    },
  })
}

const removeAllTestContacts = async () => {
  await prismaClient.contact.deleteMany({
    where: {
      username: 'test',
    },
  })
}

const createTestContact = async () => {
  await prismaClient.contact.create({
    data: {
      username: 'test',
      first_name: 'first_test',
      last_name: 'last_test',
      email: 'test@email.com',
      phone: '089123123123',
    },
  })
}

const getTestContact = async () => {
  return prismaClient.contact.findFirst({
    where: {
      username: 'test',
    },
  })
}

export {
  removeTestUser,
  createTestUser,
  getTestUser,
  removeAllTestContacts,
  createTestContact,
  getTestContact,
}
