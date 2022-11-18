import { mockClient } from "aws-sdk-client-mock"
import { SNSClient, CreateTopicCommand } from "@aws-sdk/client-sns"
import { createTopic } from "../../src/AWS Layer/snsClient"

var snsMock = mockClient(SNSClient)

describe("createTopic function", () => {

	test("Should return a response from aws after sending required params", async() => {
		
        snsMock.on(CreateTopicCommand).resolves({
            //insert example json stub here
            "TopicArn": "alkjsdhfjkh4jkhfjkldj3"
        })

        const res = await createTopic("AmazonRekognitionExample" + String(Date.now()), snsMock)
		expect(res).toBeTruthy()
	})
})