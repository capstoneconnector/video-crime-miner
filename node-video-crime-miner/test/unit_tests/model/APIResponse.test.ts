import { standardizeResponse } from "../../../src/model/APIResponse";

describe("APIResponse", () => {
  const payload = {
    data: {},
    success: true,
    errors: '',
    message: "",
  };
  let apiResponse:any;

  beforeEach(() => {
    apiResponse = standardizeResponse(payload);
  });

  it("should have a default empty object data property", () => {
    expect(apiResponse.getData()).toEqual({});
  });

  it("should have a success property with a default value of false", () => {
    expect(apiResponse.getSuccess()).toBe(true);
  });

  it("should have an empty array errors property by default", () => {
    expect(apiResponse.getErrors()).toEqual('');
  });

  it("should have an empty string message property by default", () => {
    expect(apiResponse.getMessage()).toBe("");
  });

  it("should have a timestamp property", () => {
    expect(apiResponse.getTimeStamp()).toBeDefined();
  });

  it("should be able to set the data property", () => {
    apiResponse.setData({ foo: "bar" });
    expect(apiResponse.getData()).toEqual({ foo: "bar" });
  });

  it("should be able to set the success property", () => {
    apiResponse.setSuccess(false);
    expect(apiResponse.getSuccess()).toBe(false);
  });

  it("should be able to set the errors property", () => {
    apiResponse.setErrors([{ message: "error message" }]);
    expect(apiResponse.getErrors()).toEqual([{ message: "error message" }]);
  });

  it("should be able to set the message property", () => {
    apiResponse.setMessage("Hello, world!");
    expect(apiResponse.getMessage()).toBe("Hello, world!");
  });

  it("should be able to convert to JSON", () => {
    const json = apiResponse.convertToJson();
    expect(json).toEqual({
      data: {},
      success: true,
      errors: '',
      message: "",
      timestamp: apiResponse.getTimeStamp(),
    });
  });
});