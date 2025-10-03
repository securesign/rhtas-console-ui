/// <reference types="@vitest/browser/context" />

import { beforeAll, describe, expect, it, vi } from "vitest";


// Mock the ENV module before any imports
vi.mock("@app/env", () => ({
	default: {
		NEXT_PUBLIC_REKOR_DEFAULT_DOMAIN: "https://example.com",
	},
}));

import { fireEvent, render, screen } from "@testing-library/react";
import { RekorClientProvider, useRekorBaseUrl, useRekorClient } from "./context";

const TestConsumerComponent = () => {
	useRekorClient();
	const [baseUrl, setBaseUrl] = useRekorBaseUrl();

	return (
		<div>
			<button onClick={() => setBaseUrl("https://new.example.com")}>Change Base URL</button>
			<p>Base URL: {baseUrl}</p>
		</div>
	);
};

describe("RekorClientContext", () => {
	beforeAll(() => vi.clearAllMocks());

	it("provides a RekorClient instance and manages base URL", async () => {
		render(
			<RekorClientProvider>
				<TestConsumerComponent />
			</RekorClientProvider>
		);

		expect(screen.getByText(/Base URL: https:\/\/example.com/)).toBeInTheDocument();

		fireEvent.click(screen.getByText(/Change Base URL/));

		expect(screen.getByText(/Base URL: https:\/\/new.example.com/)).toBeInTheDocument();
	});
});
