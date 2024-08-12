/**
 * @vitest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/pages/Home";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientForTests } from "@/utils/helpers";

function renderPage() {
  return render(
    <QueryClientProvider client={queryClientForTests}>
      <HomePage />
    </QueryClientProvider>
  );
}

describe("Home Page", () => {
  it("should render the Search box", () => {
    renderPage();

    const searchbox = screen.getByRole("textbox", {
      name: /Search for accommodation/i,
    });

    expect(searchbox).toBeInTheDocument();
  });
});
