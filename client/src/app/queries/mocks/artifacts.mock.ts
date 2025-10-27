import type { ImageMetadataResponse, Metadata } from "@app/client";

export const artifactsImageDataMock: ImageMetadataResponse = {
  image: "docker.io/library/nginx:latest",

  // container image metadata
  metadata: {
    // media type of the container image (e.g., OCI manifest type)
    mediaType: "application/vnd.oci.image.manifest.v1+json",

    // size of container image
    size: 1234,

    // key-value labels or annotations associated with image
    labels: {
      "org.opencontainers.image.version": "1.0.0",
    },
  } as Metadata,
  // container image's digest
  digest: "sha256:abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
};
