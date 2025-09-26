import {
  createContext,
  type FunctionComponent,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { RekorClient } from "rekor";

export interface RekorClientContext {
  client: RekorClient;
  baseUrl?: string;
  setBaseUrl: (_base: string | undefined) => void;
}

export const RekorClientContext = createContext<RekorClientContext | undefined>(undefined);

interface RekorClientProviderProps {
  initialDomain?: string;
}

export const RekorClientProvider: FunctionComponent<PropsWithChildren<RekorClientProviderProps>> = ({
  children,
  initialDomain,
}) => {
  const [baseUrl, setBaseUrl] = useState<string | undefined>(initialDomain);

  useEffect(() => {
    if (baseUrl === undefined) {
      if (process.env.NEXT_PUBLIC_REKOR_DEFAULT_DOMAIN) {
        setBaseUrl(process.env.NEXT_PUBLIC_REKOR_DEFAULT_DOMAIN);
      } else {
        setBaseUrl("https://rekor.sigstore.dev");
      }
    }
  }, [baseUrl]);

  const context: RekorClientContext = useMemo(() => {
    return {
      client: new RekorClient({ BASE: baseUrl }),
      baseUrl,
      setBaseUrl,
    };
  }, [baseUrl]);

  return <RekorClientContext.Provider value={context}>{children}</RekorClientContext.Provider>;
};

export function useRekorClient(): RekorClient {
  const ctx = useContext(RekorClientContext);

  if (!ctx) {
    throw new Error("Hook useRekorClient requires RekorClientContext.");
  }

  return ctx.client;
}

export function useRekorBaseUrl(): [RekorClientContext["baseUrl"], RekorClientContext["setBaseUrl"]] {
  const ctx = useContext(RekorClientContext);

  if (!ctx) {
    throw new Error("Hook useRekorBaseUrl requires RekorClientContext.");
  }

  return [ctx.baseUrl, ctx.setBaseUrl];
}
