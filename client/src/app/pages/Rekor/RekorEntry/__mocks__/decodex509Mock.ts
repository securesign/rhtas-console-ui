const decodex509Mock = vi.fn().mockReturnValue({
  publicKey: "-----BEGIN CERTIFICATE-----Mocked Certificate-----END CERTIFICATE-----",
  subject: "Mocked Subject",
});

export default decodex509Mock;
