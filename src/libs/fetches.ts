import { TRADE_TYPES } from "../constants";
import { ALLOWED_RESOLUTIONS } from "../helpers/chartingDatafeed";
import { IHoldingFilter, ILimitOrder, ILimitOrderProtobuf, IOrderFilter } from "../interface";
import { appBackend, rpcBackend, tokenBackend } from "./api";

const handleError = (err: any) => {
  if (err.response && err.response.status) {
    // localStorage.removeItem('token');
  }
  console.log(err);
};

export const requestMessage = async (wallet: string) => {
  try {
    const { data } = await appBackend.post(`/auth/request-message`, {
      wallet: wallet,
    });
    if (data.success) {
      return data.data.data;
    } else {
      console.log(data.data.error);
    }
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const verify = async (sign: string, payload: any, referral: string) => {
  try {
    const { data } = await appBackend.post(`/auth/verify`, {
      sign: sign,
      payload: payload,
      referral: referral,
    });
    if (data.success) {
      return data.data.data;
    } else {
      console.log(data.data.error);
    }
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const swapToken = async (
  poolAddress: string,
  fromToken: string,
  toToken: string,
  amount: number,
  slippage: number,
  trxPriority: number
) => {
  try {
    const { data } = await appBackend.post(`/swap/token-swap`, {
      poolAddress,
      fromToken,
      toToken,
      amount,
      slippage,
      trxPriority,
    });
    if (data.success) {
      return data.data.data;
    } else {
      console.log(data.data.error);
    }
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const getUserInfo = async () => {
  try {
    const { data } = await appBackend.get(`/user/user-infos`);
    if (data.success) {
      return data.data.data;
    } else {
      console.log(data.data.error);
    }
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const getLeaderboard = async () => {
  try {
    const { data } = await appBackend.get(`/user/leaderboard`);
    if (data.success) {
      return data.data.data;
    } else {
      console.log(data.data.error);
    }
  } catch (error) {
    handleError(error);
  }
  return [];
};

export const updateHiddenToken = async (tokenAddress: string, hidden: boolean) => {
  try {
    const { data } = await appBackend.post(`/user/updateHiddenToken`, {
      tokenAddress,
      hidden
    });
    if (data.success) {
      return data.data.data;
    } else {
      console.log(data.data.error);
    }
  } catch (error) {
    handleError(error);
  }
  return false;
};

export const setSubscribeEmail = async (email: string) => {
  try {
    const { data } = await appBackend.post(`/user/setSubscribeEmail`, { email });
    if (data.success) {
      return data.data.data;
    } else {
      console.log(data.data.error);
    }
  } catch (error) {
    handleError(error);
  }
  return false;
};

export const getJackpot = async () => {
  try {
    const { data } = await appBackend.get(`/jackpot/weeklyjackpot`);
    if (data.success) {
      return data.data.data;
    } else {
      console.log(data.data.error);
    }
  } catch (error) {
    handleError(error);
  }
  return 0;
};

export const getMissions = async () => {
  try {
    const { data } = await appBackend.get(`/mission/getMissions`);
    if (data.success) {
      return data.data.data;
    } else {
      console.log(data.data.error);
    }
  } catch (error) {
    handleError(error);
  }
  return [];
};

export const updateMission = async (type: number, tier: number) => {
  try {
    const { data } = await appBackend.post(`/mission/updateMission`, {
      type,
      tier,
    });
    if (data.success) {
      return data.data.data;
    } else {
      console.log(data.data.error);
    }
  } catch (error) {
    handleError(error);
  }
  return false;
};

export const depositFunds = async (rawTransaction: string, amount: number) => {
  try {
    const { data } = await appBackend.post(`/swap/depositFunds`, {
      trx: rawTransaction,
      amount,
    });
    if (data.success) {
      return data.data.data;
    } else {
      console.log(data.data.error);
    }
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const withdrawFunds = async (amount: number) => {
  try {
    const { data } = await appBackend.post(`/swap/withdrawFunds`, { amount });
    if (data.success) {
      return data.data.data;
    } else {
      console.log(data.data.error);
    }
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const getTxData = async (
  filter: string[],
  skip: number = 0,
  limit: number = 20
) => {
  try {
    const { data } = await appBackend.post(`/user/txData`, {
      filter,
      skip,
      limit,
    });
    if (data.success) {
      return data.data.data;
    } else {
      console.log(data.data.error);
    }
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const getHoldingTokens = async (filters: IHoldingFilter) => {
  try {
    const { data } = await appBackend.post(`/user/holding`, { filters });
    if (data.success) {
      return data.data.data;
    } else {
      console.log(data.data.error);
    }
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const getLimitOrders = async (
  skip: number = 0,
  limit: number = 20,
  filters: IOrderFilter
) => {
  try {
    const { data } = await appBackend.post(`/limit-order/get`, {
      skip,
      limit,
      filters,
    });
    if (data.success) {
      return data.data.data;
    } else {
      console.log(data.data.error);
    }
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const addLimitOrder = async (
  poolAddress: string, tokenAddress: string, expire: number,
  trxPriority: number, slippage: number, created_price: number, order: ILimitOrderProtobuf
) => {
  try {
    const { data } = await appBackend.post(`/limit-order/add`, {
      poolAddress,
      tokenAddress,
      expire,
      trxPriority,
      slippage,
      created_price,
      order
    });
    if (data.success) {
      return data.data.data;
    } else {
      console.log(data.data.error);
    }
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const removeLimitOrder = async (order_id: string) => {
  try {
    const { data } = await appBackend.post(`/limit-order/remove`, { order_id });
    if (data.success) {
      return data.data.data;
    } else {
      console.log(data.data.error);
    }
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const updateLimitOrder = async (
  poolAddress: string, tokenAddress: string, expire: number,
  trxPriority: number, slippage: number, created_price: number, order: ILimitOrderProtobuf
) => {
  try {
    const { data } = await appBackend.post(`/limit-order/update`, { 
      poolAddress,
      tokenAddress,
      expire,
      trxPriority,
      slippage,
      created_price,
      order });
    if (data.success) {
      return data.data.data;
    } else {
      console.log(data.data.error);
    }
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const uploadFile = async (file: File, type: string = "avatar") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("type", type);
  try {
    const { data } = await appBackend.post(`/user/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (data.success) {
      return data.data.data;
    } else {
      console.log(data.data.error);
    }
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const fetchAMMInfo = async () => {
  try {
    const { data } = await tokenBackend.post(`/amms/fetch-amm-info`);
    if (data.success) {
      return data.data.data;
    } else {
      console.log(data.data.error);
    }
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const fetchRecentTokens = async (wallet: string) => {
  try {
    const { data } = await tokenBackend.post(`/search/fetch-recent-tokens`, {
      wallet: wallet,
    });
    if (data.success) {
      return data.data.data;
    } else {
      console.log(data.data.error);
    }
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const fetchSortedPools = async (
  sortField: string,
  sortBy: string,
  skip: number,
  limit: number
) => {
  try {
    const { data } = await tokenBackend.post(`/token/token-sort-overviews`, {
      sortField: sortField,
      sortType: sortBy,
      skip: skip,
      limit: limit,
    });
    if (data.success) {
      return data.data.data;
    } else {
      console.log(data.data.error);
    }
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const fetchPoolInfo = async (
  address: string,
  skip: number = 0,
  limit: number = 1
) => {
  try {
    const { data } = await tokenBackend.get(
      `/st/search?q=${address}&skip=${skip}&limit=${limit}`
    );
    if (data && data.data.length > 0) {
      return data.data[0];
    } else {
      console.log("fetchPoolInfo error");
    }
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const fetchPools = async (
  duration: string,
  skip: number = 0,
  limit: number = 1,
  sort: string,
  direction = "desc"
) => {
  try {
    const { data } = await tokenBackend.get(
      `/st/query?duration=${duration}&skip=${skip}&limit=${limit}&sort=${sort}&sort_dir=${direction}`
    );
    if (data && data.data.length > 0) {
      return data.data;
    } else {
      console.log("fetchPools error");
    }
  } catch (error) {
    handleError(error);
  }
  return [];
};

export const fetchPoolTrades = async (
  address: string,
  txType: TRADE_TYPES,
  limit: number,
  offset: number
) => {
  try {
    const { data } = await tokenBackend.get(
      `/tx/query?address=${address}&skip=${offset}&limit=${limit}`
    );
    if (data && data.data.length > 0) {
      return data.data;
    } else {
      console.log("fetchPoolTrades error");
    }
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const getOHLCVInfo = async (
  address: string,
  resolution: string | number,
  from: any,
  to: any
) => {
  try {
    const { data } = await tokenBackend.get(
      `/tx/chart?address=${address}&address_type=pair&type=${ALLOWED_RESOLUTIONS[resolution] || "1D"
      }&time_from=${from}&time_to=${to}&&interval=2`
    );
    console.log(data);
    if (data && data.data.length > 0) {
      return data.data;
    } else {
      console.log("getOHLCVInfo empty");
    }
  } catch (error) {
    handleError(error);
  }
  return [];
};
export const fetchTokenPrice = async (
  targetTokenAddress: string,
  quoteTokenAddress: string
) => {
  try {
    const { data } = await tokenBackend.get(
      `/token/price?baseMint=${targetTokenAddress}&quoteMint=${quoteTokenAddress}`
    );
    if (data) {
      return data.data;
    } else {
      console.log(data.data.error);
    }
  } catch (error) {
    handleError(error);
  }
  return 0;
};

export const fetchTrendingTokens = async (skip: number, limit: number) => {
  try {
    const { data } = await tokenBackend.post(`/token/trending-tokens`, {
      skip,
      limit,
    });
    if (data.success) {
      return data.data.data;
    } else {
      console.log(data.data.error);
    }
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const searchTokens = async (
  searchTerm: string,
  skip: number = 0,
  limit: number = 5,
) => {
  try {
    const { data } = await tokenBackend.get(
      `/st/search?q=${searchTerm}&skip=${skip}&limit=${limit}`
    );
    if (data && data.data.length > 0) {
      return data.data;
    } else {
      console.log("searchTokens error");
    }
  } catch (error) {
    handleError(error);
  }
  return null;
};

export const fetchTokenBalance = async (
  walletAddress: string,
  tokenAddress: string,
  tokenDecimals: number
) => {
  const { data } = await rpcBackend.post("", {
    jsonrpc: "2.0",
    id: walletAddress,
    method: "getTokenAccountsByOwner",
    params: [
      walletAddress,
      {
        mint: tokenAddress,
      },
      {
        encoding: "jsonParsed",
      },
    ],
  });
  if (Array.isArray(data?.result?.value) && data?.result?.value?.length > 0) {
    return (
      Number(
        data?.result?.value[0]?.account?.data?.parsed?.info?.tokenAmount?.amount
      ) /
      10 ** tokenDecimals
    );
  } else {
    return 0;
  }
};
