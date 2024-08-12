jest.mock("@/config/logger"); // disable logging while testing

// mock morgan to bypass its functionality
const middlewareMock = () => (req: any, res: any, next: any) => {
  next();
};

jest.mock("morgan", () => jest.fn(middlewareMock));

afterEach(() => {
  jest.restoreAllMocks();
});
