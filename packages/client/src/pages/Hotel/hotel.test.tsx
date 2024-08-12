/**
 * @vitest-environment jsdom
 */
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HotelPage from "@/pages/Hotel";
import { QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import NotFoundPage from "@/pages/404";
import { queryClientForTests } from "@/utils/helpers";

// Mock axios
vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

function renderAppStartingFromHotelPage() {
  return render(
    <QueryClientProvider client={queryClientForTests}>
      <MemoryRouter initialEntries={["/hotels/1"]}>
        <Routes>
          <Route path="/hotels/:id" element={<HotelPage />} />
          <Route path="/404" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("Hotel Page", () => {
  it("should display hotel name after successful data fetch", async () => {
    const hotelData = { _id: "1", hotel_name: "Test Hotel" };
    mockedAxios.get.mockResolvedValueOnce({
      data: { data: hotelData },
    });

    renderAppStartingFromHotelPage();

    // should start loading and then eventually render the hotel name
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    await screen.findByRole("heading", { name: /Test Hotel/i });
  });

  it("should redirect to the 404 page when a 404 error occurs", async () => {
    // Mock the 404 error response
    mockedAxios.get.mockRejectedValueOnce({ response: { status: 404 } });

    renderAppStartingFromHotelPage();

    // Check that we are redirected to the 404 page
    await waitFor(() => {
      expect(screen.getByText(/This page does not exist/i)).toBeInTheDocument();
    });
  });
});
