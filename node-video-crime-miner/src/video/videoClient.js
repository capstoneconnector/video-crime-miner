"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.runLabelDetectionAndGetResults = exports.getSQSMessageSuccess = exports.getLabelDetectionResults = exports.startLabelDetection = exports.createTopicandQueue = void 0;
// import required modules
var rekog = require("@aws-sdk/client-rekognition");
var awsSNS = require("@aws-sdk/client-sns");
var awsSQS = require("@aws-sdk/client-sqs");
var ck = require('ckey');
var stdout = require("process").stdout;
// Set the AWS Region.
var REGION = ck.AWS_REKOG_REGION; //e.g. "us-east-1"
// set aws credentials
var accessKeyId = ck.AWS_ACCESS_KEY;
var secretAccessKey = ck.AWS_SECRET_KEY;
// Create rekog, SQS, and SNS service objects
var sqsClient = new awsSQS.SQSClient({ accessKeyId: accessKeyId, secretAccessKey: secretAccessKey, region: REGION });
var snsClient = new awsSNS.SNSClient({ accessKeyId: accessKeyId, secretAccessKey: secretAccessKey, region: REGION });
var rekClient = new rekog.RekognitionClient({ accessKeyId: accessKeyId, secretAccessKey: secretAccessKey, region: REGION });
// Set bucket and video variables
var bucket = "video-crime-miner-video-test-bucket";
var videoName = "Test Security Footage.mp4";
var roleArn = String(ck.AWS_ROLEARN_NAME);
var startJobId = "";
// initialize configuirations for sns and sqs clients
var ts = Date.now();
var snsTopicName = "AmazonRekognitionExample" + ts;
var snsTopicParams = { Name: snsTopicName };
var sqsQueueName = "AmazonRekognitionQueue-" + ts;
var jsonReportContainer = {};
// Set the parameters for sqs queue
var sqsParams = {
    QueueName: sqsQueueName,
    Attributes: {
        DelaySeconds: "60",
        MessageRetentionPeriod: "86400"
    }
};
function createTopicandQueue() {
    return __awaiter(this, void 0, void 0, function () {
        var topicResponse, topicArn, sqsResponse, sqsQueueCommand, sqsQueueUrl, attribsResponse, attribs, queueArn, subscribed, policy, response, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, snsClient.send(new awsSNS.CreateTopicCommand(snsTopicParams))];
                case 1:
                    topicResponse = _a.sent();
                    topicArn = String(topicResponse.TopicArn);
                    return [4 /*yield*/, sqsClient.send(new awsSQS.CreateQueueCommand(sqsParams))];
                case 2:
                    sqsResponse = _a.sent();
                    return [4 /*yield*/, sqsClient.send(new awsSQS.GetQueueUrlCommand({ QueueName: sqsQueueName }))];
                case 3:
                    sqsQueueCommand = _a.sent();
                    sqsQueueUrl = sqsQueueCommand.QueueUrl;
                    return [4 /*yield*/, sqsClient.send(new awsSQS.GetQueueAttributesCommand({ QueueUrl: sqsQueueUrl, AttributeNames: ['QueueArn'] }))];
                case 4:
                    attribsResponse = _a.sent();
                    attribs = attribsResponse.Attributes;
                    queueArn = attribs.QueueArn;
                    return [4 /*yield*/, snsClient.send(new awsSNS.SubscribeCommand({ TopicArn: topicArn, Protocol: 'sqs', Endpoint: queueArn }))];
                case 5:
                    subscribed = _a.sent();
                    policy = {
                        Version: "2012-10-17",
                        Statement: [
                            {
                                Sid: "MyPolicy",
                                Effect: "Allow",
                                Principal: { AWS: "*" },
                                Action: "SQS:SendMessage",
                                Resource: queueArn,
                                Condition: {
                                    ArnEquals: {
                                        'aws:SourceArn': topicArn
                                    }
                                }
                            }
                        ]
                    };
                    return [4 /*yield*/, sqsClient.send(new awsSQS.SetQueueAttributesCommand({ QueueUrl: sqsQueueUrl, Attributes: { Policy: JSON.stringify(policy) } }))
                        //console.log(response)
                        //console.log(sqsQueueUrl, topicArn)
                    ];
                case 6:
                    response = _a.sent();
                    //console.log(response)
                    //console.log(sqsQueueUrl, topicArn)
                    return [2 /*return*/, String(sqsQueueUrl) + "$" + topicArn];
                case 7:
                    err_1 = _a.sent();
                    console.log("Error", err_1);
                    return [2 /*return*/, ""];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.createTopicandQueue = createTopicandQueue;
;
function startLabelDetection(roleArn, snsTopicArn, bucketWithVideo, nameOfVideoToAnalyze) {
    return __awaiter(this, void 0, void 0, function () {
        var labelDetectionResponse, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, rekClient.send(new rekog.StartLabelDetectionCommand({ Video: { S3Object: { Bucket: bucketWithVideo, Name: nameOfVideoToAnalyze } },
                            NotificationChannel: { RoleArn: roleArn, SNSTopicArn: snsTopicArn } }))];
                case 1:
                    labelDetectionResponse = _a.sent();
                    startJobId = labelDetectionResponse.JobId;
                    console.log("JobID: ".concat(startJobId));
                    return [2 /*return*/, startJobId];
                case 2:
                    err_2 = _a.sent();
                    console.log("Error", err_2);
                    return [2 /*return*/, ""];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.startLabelDetection = startLabelDetection;
;
function getLabelDetectionResults(startJobId) {
    return __awaiter(this, void 0, void 0, function () {
        var maxResults, paginationToken, finished, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Retrieving Label Detection results");
                    maxResults = 10;
                    paginationToken = '';
                    finished = false;
                    _a.label = 1;
                case 1:
                    if (!(finished == false)) return [3 /*break*/, 3];
                    return [4 /*yield*/, rekClient.send(new rekog.GetLabelDetectionCommand({ JobId: startJobId, MaxResults: maxResults,
                            NextToken: paginationToken, SortBy: 'TIMESTAMP' }))
                        // Log metadata
                    ];
                case 2:
                    response = _a.sent();
                    // Log metadata
                    console.log("Codec: ".concat(response.VideoMetadata.Codec));
                    console.log("Duration: ".concat(response.VideoMetadata.DurationMillis));
                    console.log("Format: ".concat(response.VideoMetadata.Format));
                    console.log("Frame Rate: ".concat(response.VideoMetadata.FrameRate));
                    // For every detected label, log label, confidence, bounding box, and timestamp
                    response.Labels.forEach(function (labelDetection) {
                        var label = labelDetection.Label;
                        console.log("Timestamp: ".concat(labelDetection.Timestamp, "\nLabel: ").concat(label.Name, "\nConfidence: ").concat(label.Confidence) + "\nInstances:");
                        label.Instances.forEach(function (instance) {
                            console.log("Confidence: " + String(instance.Confidence) + "Bounding Box:\nTop: " + String(instance.BoundingBox.Top) + "\nLeft: " + String(instance.BoundingBox.Left) + "\nWidth: " + String(instance.BoundingBox.Width) + "\nHeight: " + String(instance.BoundingBox.Height));
                        });
                        //console.log()
                        // Log parent if found
                        console.log("   Parents:");
                        label.Parents.forEach(function (parent) {
                            console.log("    ".concat(parent.Name));
                        });
                        //console.log()
                        // Searh for pagination token, if found, set variable to next token
                        if (String(response).includes("NextToken")) {
                            paginationToken = response.NextToken;
                        }
                        else {
                            jsonReportContainer = JSON.stringify(response.Labels);
                            finished = true;
                        }
                    });
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getLabelDetectionResults = getLabelDetectionResults;
// Checks for status of job completion
function getSQSMessageSuccess(sqsQueueUrl, startJobId) {
    return __awaiter(this, void 0, void 0, function () {
        var jobFound, succeeded, dotLine, sqsReceivedResponse, responseString, _i, _a, message, notification, rekMessage, messageJobId, sqsDeleteMessage, sqsDeleteMessage, err_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 13, , 14]);
                    jobFound = false;
                    succeeded = false;
                    dotLine = 0;
                    _b.label = 1;
                case 1:
                    if (!(jobFound == false)) return [3 /*break*/, 12];
                    return [4 /*yield*/, sqsClient.send(new awsSQS.ReceiveMessageCommand({ QueueUrl: sqsQueueUrl,
                            MessageAttributeNames: 'All',
                            MaxNumberOfMessages: 10
                        }))];
                case 2:
                    sqsReceivedResponse = _b.sent();
                    if (!sqsReceivedResponse) return [3 /*break*/, 4];
                    responseString = JSON.stringify(sqsReceivedResponse);
                    if (!!responseString.includes('Body')) return [3 /*break*/, 4];
                    if (dotLine < 40) {
                        console.log('.');
                        dotLine = dotLine + 1;
                    }
                    else {
                        console.log('');
                        dotLine = 0;
                    }
                    ;
                    stdout.write('', function () {
                        console.log('');
                    });
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 1];
                case 4:
                    _i = 0, _a = sqsReceivedResponse.Messages;
                    _b.label = 5;
                case 5:
                    if (!(_i < _a.length)) return [3 /*break*/, 11];
                    message = _a[_i];
                    console.log("Retrieved messages:");
                    notification = JSON.parse(message.Body);
                    rekMessage = JSON.parse(notification.Message);
                    messageJobId = rekMessage.JobId;
                    if (!String(rekMessage.JobId).includes(String(startJobId))) return [3 /*break*/, 8];
                    console.log('Matching job found:');
                    console.log(rekMessage.JobId);
                    jobFound = true;
                    console.log(rekMessage.Status);
                    if (!String(rekMessage.Status).includes(String("SUCCEEDED"))) return [3 /*break*/, 7];
                    succeeded = true;
                    console.log("Job processing succeeded.");
                    return [4 /*yield*/, sqsClient.send(new awsSQS.DeleteMessageCommand({ QueueUrl: sqsQueueUrl, ReceiptHandle: message.ReceiptHandle }))];
                case 6:
                    sqsDeleteMessage = _b.sent();
                    _b.label = 7;
                case 7: return [3 /*break*/, 10];
                case 8:
                    console.log("Provided Job ID did not match returned ID.");
                    return [4 /*yield*/, sqsClient.send(new awsSQS.DeleteMessageCommand({ QueueUrl: sqsQueueUrl, ReceiptHandle: message.ReceiptHandle }))];
                case 9:
                    sqsDeleteMessage = _b.sent();
                    _b.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 5];
                case 11: return [3 /*break*/, 1];
                case 12: return [2 /*return*/, succeeded];
                case 13:
                    err_3 = _b.sent();
                    console.log("Error", err_3);
                    return [2 /*return*/, []];
                case 14: return [2 /*return*/];
            }
        });
    });
}
exports.getSQSMessageSuccess = getSQSMessageSuccess;
// Start label detection job, sent status notification, check for success status
// Retrieve results if status is "SUCEEDED", delete notification queue and topic
function runLabelDetectionAndGetResults(bucketWithVideo, nameOfVideoToAnalyze) {
    if (bucketWithVideo === void 0) { bucketWithVideo = "video-crime-miner-video-test-bucket"; }
    if (nameOfVideoToAnalyze === void 0) { nameOfVideoToAnalyze = "Crowded People Walking Down Oxford Street London 4K UHD Stock Video Footage-ng8Wivt52K0.mp4"; }
    return __awaiter(this, void 0, void 0, function () {
        var sqsAndTopic, startLabelDetectionRes, _a, _b, getSQSMessageStatus, _c, _d, results, _e, deleteQueue, _f, _g, _h, _j, deleteTopic, _k, _l, _m, _o, newReport, err_4;
        var _p, _q;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    _r.trys.push([0, 13, , 14]);
                    sqsAndTopic = createTopicandQueue();
                    _a = startLabelDetection;
                    _b = [roleArn];
                    return [4 /*yield*/, sqsAndTopic];
                case 1:
                    startLabelDetectionRes = _a.apply(void 0, _b.concat([(_r.sent()).split('$')[1], bucketWithVideo, nameOfVideoToAnalyze]));
                    _c = getSQSMessageSuccess;
                    return [4 /*yield*/, sqsAndTopic];
                case 2:
                    _d = [(_r.sent()).split('$')[0]];
                    return [4 /*yield*/, startLabelDetectionRes];
                case 3: return [4 /*yield*/, _c.apply(void 0, _d.concat([_r.sent()]))];
                case 4:
                    getSQSMessageStatus = _r.sent();
                    console.log(getSQSMessageSuccess);
                    return [4 /*yield*/, getSQSMessageSuccess];
                case 5:
                    if (!_r.sent()) return [3 /*break*/, 8];
                    console.log("Retrieving results:");
                    _e = getLabelDetectionResults;
                    return [4 /*yield*/, startLabelDetectionRes];
                case 6: return [4 /*yield*/, _e.apply(void 0, [_r.sent()])];
                case 7:
                    results = _r.sent();
                    _r.label = 8;
                case 8:
                    _g = (_f = sqsClient).send;
                    _j = (_h = awsSQS.DeleteQueueCommand).bind;
                    _p = {};
                    return [4 /*yield*/, sqsAndTopic];
                case 9: return [4 /*yield*/, _g.apply(_f, [new (_j.apply(_h, [void 0, (_p.QueueUrl = (_r.sent()).split('$')[0], _p)]))()])];
                case 10:
                    deleteQueue = _r.sent();
                    _l = (_k = snsClient).send;
                    _o = (_m = awsSNS.DeleteTopicCommand).bind;
                    _q = {};
                    return [4 /*yield*/, sqsAndTopic];
                case 11: return [4 /*yield*/, _l.apply(_k, [new (_o.apply(_m, [void 0, (_q.TopicArn = (_r.sent()).split('$')[1], _q)]))()])];
                case 12:
                    deleteTopic = _r.sent();
                    console.log("Successfully deleted.");
                    newReport = jsonReportContainer;
                    console.log(newReport);
                    return [2 /*return*/, newReport];
                case 13:
                    err_4 = _r.sent();
                    console.log("Error", err_4);
                    return [2 /*return*/, []];
                case 14: return [2 /*return*/];
            }
        });
    });
}
exports.runLabelDetectionAndGetResults = runLabelDetectionAndGetResults;
;
