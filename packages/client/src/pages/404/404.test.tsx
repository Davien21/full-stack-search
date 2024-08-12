/**
 * @vitest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NotFoundPage from "@/pages/404";
import { QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { queryClientForTests } from "@/utils/helpers";

function renderPage() {
  return render(
    <QueryClientProvider client={queryClientForTests}>
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("Not Found Page", () => {
  it("should render the NotFoundPage", () => {
    renderPage();

    const heading = screen.getByRole("heading", {
      name: /This page does not exist/i,
    });
    // expect the NotFoundPage to be in the document
    expect(heading).toBeInTheDocument();
  });
});
