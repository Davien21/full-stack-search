import { getCodeSandboxHost } from "@codesandbox/utils";
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ISuccessResponse } from "interfaces";

const codeSandboxHost = getCodeSandboxHost(3001);
export const API_BASE_URL = codeSandboxHost
  ? `https://${codeSandboxHost}`
  : "http://localhost:3001";

export const CLIENT_BASE_URL = `http://localhost:3000`;

export const loadPageData = async <T>(
  id: string | undefined,
  route: string
) => {
  const response = await axios.get<ISuccessResponse<T>>(
    `${API_BASE_URL}/${route}/${id}`
  );
  return response.data.data;
};

export const queryClientForTests = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
