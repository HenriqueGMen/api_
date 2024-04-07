import { it, afterAll, beforeAll, describe, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        tittle: 'Transaction test',
        amount: 500,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    let cookies: string[] = []

    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        tittle: 'Transaction test',
        amount: 500,
        type: 'credit',
      })

    const cookie = createTransactionResponse.get('Set-Cookie')

    if (cookie) {
      cookies = cookies.concat(cookie)
    }

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        tittle: 'Transaction test',
        amount: 500,
      }),
    ])
  })
})
