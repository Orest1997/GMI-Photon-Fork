import React, {
  useState,
  createContext,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  InfiniteData,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  getHoldingTokens,
  getJackpot,
  getLeaderboard,
  getLimitOrders,
  getMissions,
  getTxData,
  getUserInfo,
} from "../libs/fetches";
import {
  IHoldingFilter,
  IHoldingToken,
  IJackpot,
  ILeaderboard,
  ILimitOrder,
  IMission,
  IOrderFilter,
  ITxData,
  IUserInfo,
} from "../interface";
import { requestMessage, verify } from "../libs/fetches";
import { Header, Payload, SIWS } from "@web3auth/sign-in-with-solana";
import bs58 from "bs58";
import { setAuthToken } from "../libs/api";

interface AppContextType {
  loading: string | Boolean;
  setLoading: Function;
  isSign: Boolean;
  setIsSign: React.Dispatch<React.SetStateAction<boolean>>;
  disconnectWallet: () => void;
  useUserInfo: () => UseQueryResult<IUserInfo | null, Error>;
  useTxData: (filter: string[]) => UseQueryResult<ITxData[] | null, Error>;
  useHoldingTokens: (
    filters: IHoldingFilter
  ) => UseQueryResult<IHoldingToken[] | null, Error>;
  useInfiniteOrdersHistory: (
    limit: number,
    filters: IOrderFilter
  ) => UseInfiniteQueryResult<
    InfiniteData<
      { hasNext: boolean; nextCursor: number; items: ILimitOrder[] },
      unknown
    >,
    Error
  >;
  priority: number;
  slippage: number;
  setPriority: Function;
  setSlippage: Function;
  quickBuyAmount: string | undefined;
  setQuickBuyAmount: React.Dispatch<React.SetStateAction<string | undefined>>;

  chain: string;
  setChain: React.Dispatch<React.SetStateAction<string>>;

  useJackpot: () => UseQueryResult<IJackpot | null, Error>;
  useMissions: () => UseQueryResult<IMission[] | null, Error>;
  useLeaderboard: () => UseQueryResult<ILeaderboard[] | null, Error>;
}

const initialState: AppContextType = {
  loading: false,
  setLoading: () => {},
  isSign: false,
  setIsSign: () => {},
  disconnectWallet: () => {},
  useUserInfo: () => ({} as UseQueryResult<IUserInfo | null, Error>),
  useTxData: () => ({} as UseQueryResult<ITxData[] | null, Error>),
  useHoldingTokens: () => ({} as UseQueryResult<IHoldingToken[] | null, Error>),
  useInfiniteOrdersHistory: () =>
    ({} as UseInfiniteQueryResult<
      InfiniteData<
        { hasNext: boolean; nextCursor: number; items: ILimitOrder[] },
        unknown
      >,
      Error
    >),
  priority: 0,
  slippage: 0,
  setPriority: () => {},
  setSlippage: () => {},
  quickBuyAmount: undefined,
  setQuickBuyAmount: () => {},

  chain: "solana",
  setChain: () => {},

  useJackpot: () => ({} as UseQueryResult<IJackpot | null, Error>),
  useMissions: () => ({} as UseQueryResult<IMission[] | null, Error>),
  useLeaderboard: () => ({} as UseQueryResult<ILeaderboard[] | null, Error>),
};

const AppContext = createContext<AppContextType>(initialState);

export const useAccountInfo = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAccountInfo must be used within a AccountInfoProvider");
  }
  return context;
};

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { publicKey, connected, signMessage, disconnect } = useWallet();
  const [loading, setLoading] = useState<string | Boolean>(false);
  const [isSign, setIsSign] = useState(false);

  const [priority, setPriority] = useState<number>(0.001);
  const [slippage, setSlippage] = useState<number>(20);

  const [chain, setChain] = useState<string>("solana");

  const [quickBuyAmount, setQuickBuyAmount] = useState<string | undefined>(
    "1.0"
  );

  const disconnectWallet = async () => {
    disconnect();
    localStorage.removeItem("token");
  };

  const useUserInfo = () => {
    return useQuery<IUserInfo | null>({
      queryKey: ["USERINFO", publicKey, isSign],
      queryFn: () =>
        publicKey && isSign ? getUserInfo() : Promise.resolve(null),
    });
  };

  const useTxData = (filter: string[]) => {
    //'deposit' | 'withdraw' | 'swap'
    return useQuery<ITxData[] | null>({
      queryKey: ["TxData", publicKey, isSign],
      queryFn: () =>
        publicKey && isSign ? getTxData(filter) : Promise.resolve([]),
    });
  };

  const useHoldingTokens = (filters: IHoldingFilter) => {
    //'deposit' | 'withdraw' | 'swap'
    return useQuery<IHoldingToken[] | null>({
      queryKey: ["HoldingTokens", publicKey, isSign],
      queryFn: () =>
        publicKey && isSign ? getHoldingTokens(filters) : Promise.resolve([]),
    });
  };

  const useJackpot = () => {
    return useQuery<IJackpot | null>({
      queryKey: ["Jackpot", publicKey, isSign],
      queryFn: () => (publicKey && isSign ? getJackpot() : Promise.resolve([])),
    });
  };

  const useMissions = () => {
    return useQuery<IMission[] | null>({
      queryKey: ["Missions", publicKey, isSign],
      queryFn: () =>
        publicKey && isSign ? getMissions() : Promise.resolve([]),
    });
  };

  const useLeaderboard = () => {
    return useQuery<ILeaderboard[] | null>({
      queryKey: ["Leaderboard", publicKey, isSign],
      queryFn: () =>
        publicKey && isSign ? getLeaderboard() : Promise.resolve([]),
      refetchInterval: 60 * 1000,
    });
  };

  const fetchOrders = async (
    limit: number,
    filters: IOrderFilter,
    offset: number
  ): Promise<{
    hasNext: boolean;
    nextCursor: number;
    items: ILimitOrder[];
  }> => {
    const data = await getLimitOrders(offset, limit, filters);
    let orders: any = {};
    if (data) {
      orders.items = data;
      if (data.length > 0) {
        orders.hasNext = true;
        orders.nextCursor = offset + 1;
      }
    } else {
      orders.items = [];
      orders.hasNext = false;
      orders.nextCursor = offset;
    }
    return orders;
  };

  const useInfiniteOrdersHistory = (limit = 20, filters: IOrderFilter) => {
    return useInfiniteQuery<{
      hasNext: boolean;
      nextCursor: number;
      items: ILimitOrder[];
    }>({
      queryKey: ["LimitOrder", publicKey, isSign],
      queryFn: async ({ pageParam }) =>
        await fetchOrders(limit, filters, pageParam as number),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? false,
      refetchOnWindowFocus: false,
    });
  };

  useEffect(() => {
    const getJWTToken = async () => {
      if (publicKey) {
        const domain = window.location.host;
        const origin = window.location.origin;
        const referral = localStorage.getItem("GMI_REFERRAL");
        const data = await requestMessage(publicKey.toString());
        const payload = new Payload();
        payload.domain = domain;
        payload.address = publicKey.toString();
        payload.uri = origin;
        if (data) {
          payload.statement = data.statement;
          payload.version = data.version;

          const header = new Header();
          header.t = "sip99";
          let message = new SIWS({ header, payload });
          const messageText = message.prepareMessage();
          const messageEncoded = new TextEncoder().encode(messageText);
          signMessage!(messageEncoded)
            .then(async (resp) => {
              const sign = bs58.encode(resp);
              const data = await verify(
                sign,
                message.payload,
                referral ? referral : ""
              );
              if (data) {
                const now = new Date().getTime().toString();
                setAuthToken(data);
                localStorage.setItem("token", data);
                localStorage.setItem("auth-time", now);
                localStorage.removeItem("referral");
                setIsSign(true);
              }
            })
            .catch((error) => {
              disconnectWallet();
            });
        }
      }
    };
    let token = localStorage.getItem("token");
    const startTime = localStorage.getItem("auth-time");
    if (startTime) {
      const dur = new Date().getTime() - Number(startTime);
      if (dur > 24 * 60 * 60 * 1000) {
        token = null;
      }
    } else {
      token = null;
    }

    setIsSign(!!token);
    if (publicKey && !token) {
      getJWTToken();
    } else if (!connected) {
      setIsSign(false);
    }
  }, [connected]);

  useEffect(() => {
    const _enabled = localStorage.getItem("PRIM_QUICK_ENABLED");
    if (_enabled === "true") {
      const _amount = localStorage.getItem("PRIM_QUICK_AMOUNT");
      setQuickBuyAmount(_amount ?? "1.0");
    } else {
      setQuickBuyAmount(undefined);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        loading: loading,
        setLoading: setLoading,
        isSign,
        setIsSign,
        disconnectWallet,
        useUserInfo,
        useTxData,
        useHoldingTokens,
        useInfiniteOrdersHistory,
        priority,
        setPriority,
        slippage,
        setSlippage,
        quickBuyAmount,
        setQuickBuyAmount,

        chain,
        setChain,

        useJackpot,
        useMissions,
        useLeaderboard,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
