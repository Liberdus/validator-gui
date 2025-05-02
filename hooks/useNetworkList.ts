import useSWR from "swr";
import { fetcher } from "./fetcher";
import { useContext, useState } from "react";
import { useGlobals } from "../utils/globals";
import { FetcherContext } from "../components/FetcherContextProvider";
import { showErrorMessage } from "./useToastStore";

export type UseNetworkListResponse = {
  networks: string[];
  changeNetwork: (network: string, fn: () => Promise<void>) => Promise<void>;
  isLoading: boolean;
};

export const useNetworkList = (): UseNetworkListResponse => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { apiBase } = useGlobals();
  const fetcherWithContext = useContext(FetcherContext);
  const { data } = useSWR<{ networks: string[] }>(
    `${apiBase}/api/networks`,
    fetcherWithContext
  );
  const changeNetwork = async (
    network: string,
    fn: () => Promise<void>
  ): Promise<void> => {
    setIsLoading(true);
    try {
      await fetcher(
        `${apiBase}/api/set_network`,
        { method: "POST", body: JSON.stringify({ network }) },
        showErrorMessage
      );
      await fn();
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  return {
    networks: data?.networks || [],
    changeNetwork,
    isLoading,
  };
};
