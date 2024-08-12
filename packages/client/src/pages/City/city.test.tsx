/**
 * @vitest-environment jsdom
 */
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CityPage from "@/pages/City";
import { QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import NotFoundPage from "@/pages/404";
import { queryClientForTests } from "@/utils/helpers";

// Mock axios
vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

function renderAppStartingFromCityPage() {
  return render(
    <QueryClientProvider client={queryClientForTests}>
      <MemoryRouter initialEntries={["/cities/1"]}>
        <Routes>
          <Route path="/cities/:id" element={<CityPage />} />
          <Route path="/404" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("City Page", () => {
  it("should display city name after successful data fetch", async () => {
    const cityData = { _id: "1", name: "Test City" };
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: cityData },
    });

    renderAppStartingFromCityPage();

    // should start loading and then eventually render the city name
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await screen.findByRole("heading", { name: /Test City/i });
  });

  it("should redirect to the 404 page when a 404 error occurs", async () => {
    // Mock the 404 error response
    mockedAxios.get.mockRejectedValueOnce({ response: { status: 404 } });

    renderAppStartingFromCityPage();

    // Check that we are redirected to the 404 page
    await waitFor(() => {
      expect(screen.getByText(/This page does not exist/i)).toBeInTheDocument();
    });
  });
});
