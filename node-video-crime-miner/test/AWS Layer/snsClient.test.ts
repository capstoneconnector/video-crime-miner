import { mockClient } from 'aws-sdk-client-mock'
import { SNSClient, CreateTopicCommand, SubscribeCommand } from '@aws-sdk/client-sns'
import { createTopic, subscribeSQStoSNS } from '../../src/AWS Layer/snsClient'

const snsMock = mockClient(SNSClient)

describe('createTopic function', () => {
  test('Should return a response from aws after sending required params', async () => {
    snsMock.on(CreateTopicCommand).resolves({
      // insert example json stub here
      TopicArn: 'alkjsdhfjkh4jkhfjkldj3'
    })

    const res = await createTopic('AmazonRekognitionExample' + String(Date.now()), snsMock)
    expect(res).toBeTruthy()
  })
})

describe('subscribeSQStoSNS function', () => {
  test('Should return a response from aws after sending required params', async () => {
    snsMock.on(SubscribeCommand).resolves({
      // insert example json stub here
      SubscriptionArn: 'alkjsdhfjkh4jkhfjkldj3'
    })

    const res = await subscribeSQStoSNS('exampleARN', 'exampleQueueARN', 'sqs', snsMock)
    expect(res).toBeTruthy()
  })
})
