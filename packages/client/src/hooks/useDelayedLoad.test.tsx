/**
 * @vitest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import { useState } from "react";
import { expect, it } from "vitest";
import { useDelayedLoad } from "@/hooks/useDelayedLoad";
import userEvent from "@testing-library/user-event";

// Test component that uses the useDelayedLoad hook
function TestComponent({ initialValue = false, minWaitTime = 300 }) {
  const [value, setValue] = useState(initialValue);
  const shouldShowLoader = useDelayedLoad(value, minWaitTime);

  return (
    <div>
      <button onClick={() => setValue(!value)}>Toggle Value</button>
      <output role="status">
        Loader: {shouldShowLoader ? "Visible" : "Hidden"}
      </output>
    </div>
  );
}

it("should not update immediately, only after min wait time", async () => {
  const user = userEvent.setup();

  const minWaitTime = 300;

  render(<TestComponent initialValue={true} minWaitTime={minWaitTime} />);

  // Ensure the loader is initially visible
  expect(screen.getByRole("status")).toHaveTextContent("Loader: Visible");

  // Click the button to toggle the value to false
  user.click(screen.getByRole("button"));

  // Verify that the loader does not change immediately
  expect(screen.getByRole("status")).toHaveTextContent("Loader: Visible");

  // Wait for the loader to become hidden after minWaitTime
  await screen.findByText("Loader: Hidden");
});
