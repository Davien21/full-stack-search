import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import { SearchBox } from "@/components/SearchBox";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";

// Mock axios
vi.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // prevent our tests from timing out due to retries
    },
  },
});

function renderSearchBox() {
  return render(
    <QueryClientProvider client={queryClient}>
      <Router>
        <SearchBox />
      </Router>
    </QueryClientProvider>
  );
}

describe("SearchBox Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should only render the search input and no initial data", () => {
    renderSearchBox();

    expect(
      screen.getByRole("textbox", { name: /Search for accommodation/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", {
        name: /hotels/i,
      })
    ).toBeNull();
    expect(
      screen.queryByRole("heading", {
        name: /countries/i,
      })
    ).toBeNull();
    expect(
      screen.queryByRole("heading", {
        name: /cities/i,
      })
    ).toBeNull();

    expect(
      screen.queryByRole("status", {
        name: /loader/i,
      })
    ).toBeNull();

    expect(
      screen.queryByRole("button", {
        name: /Clear search input/i,
      })
    ).toBeNull();
  });

  it("should update input field and debounce the API call", async () => {
    const query = "uni";
    renderSearchBox();

    const input: HTMLInputElement = screen.getByRole("textbox", {
      name: /Search for accommodation/i,
    });

    await userEvent.type(input, query);
    expect(input).toHaveValue(query);

    // Ensure that the API call is made after debounce delay
    expect(mockedAxios.get).not.toHaveBeenCalled();

    await waitFor(
      () => {
        expect(mockedAxios.get).toHaveBeenCalled();
      },
      { timeout: 1000 }
    );
  });

  it("should display specific error message returned", async () => {
    const query = "bad input or something";
    const message = "Oops something went to shit!";
    const axiosStyleError = { response: { data: { message } } };

    mockedAxios.get.mockRejectedValueOnce(axiosStyleError);

    renderSearchBox();

    const input = screen.getByRole("textbox", {
      name: /Search for accommodation/i,
    });

    // Simulate typing to trigger data fetching
    await userEvent.type(input, query);

    // Check that the error message is displayed
    await screen.findByText(`Error: ${message}`);
  });

  it("should display generic message if error is unformatted", async () => {
    const query = "bad input or something";

    const message = "Something went wrong";
    const unstructuredError = new Error("Another failed thing!");

    mockedAxios.get.mockRejectedValueOnce(unstructuredError);

    renderSearchBox();

    const input = screen.getByRole("textbox", {
      name: /Search for accommodation/i,
    });

    // Simulate typing to trigger data fetching
    await userEvent.type(input, query);

    // Check that the error message is displayed
    await screen.findByText(`Error: ${message}`);
  });

  it("should show loader when fetching and hide when done", async () => {
    const user = userEvent.setup();

    renderSearchBox();

    const input = screen.getByRole("textbox", {
      name: /Search for accommodation/i,
    });

    // check that loader is initially hidden
    expect(screen.queryByRole("status", { name: /loader/i })).toBeNull();

    // mock the API call
    mockedAxios.get.mockResolvedValueOnce({
      data: { hotels: [], countries: [], cities: [] },
    });

    // Simulate typing to trigger data fetching
    await user.type(input, "uni");

    // Check that the loader appears
    await screen.findByRole("status", { name: /loader/i });

    // Since data is already fetched, loader should disappear after at least 500ms due to delayed load hook
    await waitFor(
      () => {
        expect(screen.queryByRole("status", { name: /loader/i })).toBeNull();
      },
      { timeout: 1000 }
    );
  });

  it("should reset input value when the clear button is clicked", async () => {
    const query = "chidi";
    mockedAxios.get.mockResolvedValueOnce({
      data: { hotels: [], countries: [], cities: [] },
    });

    renderSearchBox();

    const input = screen.getByRole("textbox", {
      name: /Search for accommodation/i,
    });

    // Simulate typing to trigger data fetching
    await userEvent.type(input, query);

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    const clearButton = await screen.findByRole("button", {
      name: /Clear search input/i,
    });

    // Click the clear button
    await userEvent.click(clearButton);

    // Check that the input field is cleared
    expect(input).toHaveValue("");
  });
});
