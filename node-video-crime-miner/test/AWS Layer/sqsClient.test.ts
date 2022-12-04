import { mockClient } from "aws-sdk-client-mock"
import { SQSClient, CreateQueueCommand, GetQueueUrlCommand, GetQueueAttributesCommand, SetQueueAttributesCommand } from "@aws-sdk/client-sqs"
import { createQueue, getQueueUrl, getQueueAttributes, setQueueAttributes } from "../../src/AWS Layer/sqsClient"

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

describe("getQueueAttributes function", () => {

	test("Should return a response from aws after sending required params", async() => {
		
        sqsMock.on(GetQueueAttributesCommand).resolves({
            //insert example json stub here
            "Attributes": undefined
        })

        const res = await getQueueAttributes("exampleQueueUrl", sqsMock)
		expect(res).toBeTruthy()
	})
})

describe("setQueueAttributes function", () => {

	test("Should return a response from aws after sending required params", async() => {
		
        sqsMock.on(SetQueueAttributesCommand).resolves({
            //insert example json stub here
            $metadata: undefined
        })

        const res = await setQueueAttributes("exampleQueueUrl", {}, sqsMock)
		expect(res).toBeTruthy()
	})
})