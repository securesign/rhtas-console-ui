
<b>Pattern 1: Model data-fetching hooks around the semantic operation (read vs write) rather than the HTTP verb: use queries for idempotent “read/verify” calls even when they are POST endpoints, and avoid cache invalidations for read-only operations.
</b>

Example code before:
```
// POST used for "verify", but treated as a mutation and invalidates caches.
export const useVerifyArtifact = () =>
  useMutation({
    mutationFn: ({ uri }) => client.post("/verify", { uri }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["Artifacts"] }),
  });
```

Example code after:
```
// Treat verification as a read-like request with a query key derived from inputs.
export const ArtifactsKeys = {
  verify: (uri: string) => ["Artifacts", "verify", uri] as const,
};

export const useVerifyArtifact = (uri: string | null) =>
  useMockableQuery({
    queryKey: ArtifactsKeys.verify(uri ?? ""),
    enabled: !!uri?.trim(),
    queryFn: () => client.post("/verify", { uri }).then(r => r.data),
  });
```

<details><summary>Examples for relevant past discussions:</summary>

- https://github.com/securesign/rhtas-console-ui/pull/82#discussion_r2542873653
- https://github.com/securesign/rhtas-console-ui/pull/82#discussion_r2565755959
- https://github.com/securesign/rhtas-console-ui/pull/82#discussion_r2565757436
- https://github.com/securesign/rhtas-console-ui/pull/82#discussion_r2565822377
</details>


___

<b>Pattern 2: Keep mocks and UI view-models aligned to clear boundaries: mock files should represent concrete REST responses (SDK-generated types) and avoid mixing in derived UI-only state; if the backend response is missing fields, prefer updating OpenAPI or mapping into a separate view-model layer rather than blending types in mocks.
</b>

Example code before:
```
// Mock mixes endpoint shape with UI-derived fields/types.
import type { ArtifactVerificationViewModel } from "./view-model";

export const verifyMock: ArtifactVerificationViewModel = {
  ...serverLikeResponse,
  summary: { ...serverLikeResponse.summary, overallStatus: "computed" }, // derived UI logic
};
```

Example code after:
```
// Mock sticks to SDK type; UI logic derived in a mapper.
import type { VerifyArtifactResponse } from "@app/client";

export const verifyResponseMock: VerifyArtifactResponse = {
  signatures: [],
  attestations: [],
  summary: { signatureCount: 0, attestationCount: 0, rekorEntryCount: 0, identities: [] },
  artifact: { image: "example", metadata: { created: "", mediaType: "", size: 0 }, digest: "" },
};

export const toVerificationViewModel = (r: VerifyArtifactResponse) => ({
  ...r,
  summary: { ...r.summary, overallStatus: deriveOverallVerificationStatus(r) },
});
```

<details><summary>Examples for relevant past discussions:</summary>

- https://github.com/securesign/rhtas-console-ui/pull/82#discussion_r2565719580
- https://github.com/securesign/rhtas-console-ui/pull/82#discussion_r2565773601
- https://github.com/securesign/rhtas-console-ui/pull/106#discussion_r2626771211
</details>


___

<b>Pattern 3: Prefer removing obsolete or “commented-out” code and keeping the UI consistent with current API contracts: when a field/property no longer exists (e.g., after OpenAPI updates), delete the related rendering logic and update links/selectors to use the correct available identifiers.
</b>

Example code before:
```
// Field removed from API, but UI keeps commented-out block.
{/* {entry.uuid && <span>{entry.uuid}</span>} */}
<a href={`/rekor-search?uuid=${entry.uuid}`}>Open</a>
```

Example code after:
```
// Remove dead code and use the supported identifier.
<a href={`/rekor-search?logIndex=${entry.logIndex}`}>Open</a>
```

<details><summary>Examples for relevant past discussions:</summary>

- https://github.com/securesign/rhtas-console-ui/pull/106#discussion_r2626771211
- https://github.com/securesign/rhtas-console-ui/pull/82#discussion_r2565799359
</details>


___

<b>Pattern 4: Make automated tests and build/CI flows deterministic and maintainable: pin stable external versions in tests, correctly set GitHub Action outputs, and avoid always-on instrumentation or extra wait logic unless explicitly gated by an environment variable or a single authoritative health endpoint.
</b>

Example code before:
```
// Test uses floating tag; workflow "echoes" without setting outputs; instrumentation always enabled.
await page.fill("input", "docker.io/library/nginx:latest");

- name: Set outputs
  run: echo ${{ env.branch }}

plugins: [istanbul()] // always on
```

Example code after:
```
// Pin versions; write to GITHUB_OUTPUT; gate coverage/instrumentation.
await page.fill("input", "docker.io/library/nginx:1.29.4");

- name: Set outputs
  run: echo "branch=${{ env.branch }}" >> "$GITHUB_OUTPUT"

plugins: [process.env.COVERAGE ? istanbul({ requireEnv: true }) : null].filter(Boolean)
```

<details><summary>Examples for relevant past discussions:</summary>

- https://github.com/securesign/rhtas-console-ui/pull/126#discussion_r2675906260
- https://github.com/securesign/rhtas-console-ui/pull/85#discussion_r2564679417
- https://github.com/securesign/rhtas-console-ui/pull/95#discussion_r2627623841
- https://github.com/securesign/rhtas-console-ui/pull/129#discussion_r2682282969
</details>


___
