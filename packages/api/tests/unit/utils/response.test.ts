import { successResponse, errorResponse } from "@/utils/response";

describe("Response Utility Functions", () => {
  // it("should return Unexpected response format if input is not a string and has no message prop", () => {
  //   const input = { invalid: "response" };
  //   const result = errorResponse(input);

  //   expect(result).toEqual({
  //     message: "Unexpected response format",
  //     success: false,
  //     data: input,
  //   });
  // });

  it("should return a formatted response with a string message", () => {
    const message = "Operation successful";
    const result = successResponse(message);

    expect(result).toEqual({
      message,
      success: true,
      data: null,
    });
  });

  it("should return a formatted response if response is an object containing a message prop", () => {
    const input = { message: "Operation completed" };
    const data = { id: 1 };
    const result = successResponse(input, data);

    expect(result).toEqual({
      message: "Operation completed",
      success: true,
      data,
    });
  });
});
