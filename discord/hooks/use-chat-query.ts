import queryString from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";

type Props = {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
};

const useChatQuery = ({ apiUrl, paramKey, paramValue, queryKey }: Props) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParams = undefined }: any) => {
    const url = queryString.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParams,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    );

    const res = await fetch(url);

    return res.json();
  };
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};

export default useChatQuery;
