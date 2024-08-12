/**
 * @vitest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { expect, it } from "vitest";
import { faker } from "@faker-js/faker";

import { useDebounce } from "@/hooks/useDebounce";

// Test component that uses the useDebounce hook
function TestComponent({ initialInput = "", delay = 500 }) {
  const [inputValue, setInputValue] = useState(initialInput);
  const debouncedValue = useDebounce(inputValue, delay);

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <output role="status">Debounced Value: {debouncedValue}</output>
    </div>
  );
}

// Test cases for the useDebounce hook

it("should update debounced value after the delay", async () => {
  const delay = 500;
  const user = userEvent.setup();

  render(<TestComponent initialInput="" delay={delay} />);

  // Generate a random string and simulate typing
  const randomString = faker.string.alpha(4);
  await user.type(screen.getByRole("textbox"), randomString);

  // Verify that the debounced value does not change immediately
  expect(screen.getByRole("status")).toHaveTextContent("Debounced Value:");

  // Wait for the debounced value to update and verify the final output
  await screen.findByText(`Debounced Value: ${randomString}`, {});
});
