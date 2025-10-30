import type { ImageMetadataResponse, Metadata } from "@app/client";

export const artifactsImageDataMock: ImageMetadataResponse = {
  image: "docker.io/library/nginx:latest",

  // container image metadata
  metadata: {
    created: "2025-10-07T21:06:46Z",

    // media type of the container image (e.g., OCI manifest type)
    mediaType: "application/vnd.oci.image.index.v1+json",

    // size of container image
    size: 10229,

    // key-value labels or annotations associated with image
    labels: {
      maintainer: "NGINX Docker Maintainers \u003cdocker-maint@nginx.com\u003e",
    },
  } as Metadata,
  // container image's digest
  digest: "sha256:7e034cabf67d95246a996a3b92ad1c49c20d81526c9d7ba982aead057a0606e8",
};
