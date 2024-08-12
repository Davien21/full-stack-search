/**
 * @vitest-environment jsdom
 */
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CountryPage from "@/pages/Country";
import { QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import NotFoundPage from "@/pages/404";
import { queryClientForTests } from "@/utils/helpers";

// Mock axios
vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

function renderAppStartingFromCountryPage() {
  return render(
    <QueryClientProvider client={queryClientForTests}>
      <MemoryRouter initialEntries={["/countries/1"]}>
        <Routes>
          <Route path="/countries/:id" element={<CountryPage />} />
          <Route path="/404" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("Country Page", () => {
  it("should display country name after successful data fetch", async () => {
    const countryData = { _id: "1", country: "Test Country" };
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: countryData },
    });

    renderAppStartingFromCountryPage();

    // should start loading and then eventually render the country name
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await screen.findByRole("heading", { name: /Test Country/i });
  });

  it("should redirect to the 404 page when a 404 error occurs", async () => {
    // Mock the 404 error response
    mockedAxios.get.mockRejectedValueOnce({ response: { status: 404 } });

    renderAppStartingFromCountryPage();

    // Check that we are redirected to the 404 page
    await waitFor(() => {
      expect(screen.getByText(/This page does not exist/i)).toBeInTheDocument();
    });
  });
});
