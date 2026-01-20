import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { NotFound } from "./NotFound";

test("NotFound Component heading", () => {
  render(<NotFound />);

  expect(screen.getByText("404: That page does not exist")).toBeInTheDocument();
});
