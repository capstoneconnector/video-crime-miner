import { mockClient } from "aws-sdk-client-mock"
import { SQSClient, CreateQueueCommand, GetQueueUrlCommand } from "@aws-sdk/client-sqs"
import { createQueue, getQueueUrl } from "../../src/AWS Layer/sqsClient"

var sqsMock = mockClient(SQSClient)

describe("createQueue function", () => {

	test("Should return a response from aws after sending required params", async() => {
		
        sqsMock.on(CreateQueueCommand).resolves({
            //insert example json stub here
            "QueueUrl": "example.QueueUrl.com"
        })

        const res = await createQueue(sqsMock)
		expect(res).toBeTruthy()
	})
})

describe("getQueueUrl function", () => {

	test("Should return a response from aws after sending required params", async() => {
		
        sqsMock.on(GetQueueUrlCommand).resolves({
            //insert example json stub here
            "QueueUrl": "example.QueueUrl.com"
        })

        const res = await getQueueUrl("exampleQueueName", sqsMock)
		expect(res).toBeTruthy()
	})
})