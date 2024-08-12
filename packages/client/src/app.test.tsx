/**
 * @vitest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./app";

describe("App", () => {
  it("should render the Search box", () => {
    render(<App />);

    const searchbox = screen.getByRole("textbox", {
      name: /Search for accommodation/i,
    });

    expect(searchbox).toBeInTheDocument();
  });
});
