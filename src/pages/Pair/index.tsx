import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import { useQueryClient } from "@tanstack/react-query";

import DataSecurity from "./DataSecurity";
import PoolInfo from "./PoolInfo";
import PoolStatus from "./PoolStatus";
import SwapToken from "./SwapToken";
import { useTokenData } from "../../providers/TokenData";
import { useWebsocket } from "../../providers/WebsocketProvider";
import { ALLOWED_RESOLUTIONS } from "../../helpers/chartingDatafeed";
import { TVChart } from "../../components/common/TVChart";
import TradeList from "../../components/tokendetail/trading/TradeList";
import { buySellColor, copyToClipboard } from "../../libs/utils";
import { IChartingLibraryWidget } from "../../../dist/tradingview/charting_library/charting_library";
import { useAccountInfo } from "../../providers/AppContext";
import { removeLimitOrder, updateLimitOrder } from "../../libs/fetches";
import { ILimitOrder, IPoolOverview } from "../../interface";
import { SCORE_TIME, SORT_TYPE } from "../../components/tables/PairTable";
import FormattedNumber from "../../components/common/FormattedNumber";
import GetSvg from "../../components/common/GetSvg";
import { cn } from "../../helpers/utils";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import OrderTable from "../../components/tables/OrderTable";
import { IOrderLineAdapter } from "../../../public/tradingview/charting_library/charting_library";
import ModifyModal from "../../components/modal/ModifyModal";

export default function Pair() {
  const { poolAddress } = useParams();
  const { usePoolDetail, usePoolList } = useTokenData();
  const queryClient = useQueryClient();
  const { ws_pool } = useWebsocket();
  const { useInfiniteOrdersHistory, slippage, priority } = useAccountInfo();
  const [lineAdapterMap, setLineAdapterMap] = useState(
    new Map<string, IOrderLineAdapter>()
  );
  const lineAdapterMapRef = useRef(lineAdapterMap);
  const [lineCount, setLineCount] = useState(1);

  const [selectedOrder, setSelectedOrder] = useState<ILimitOrder | undefined>(
    undefined
  );
  const [openModify, setOpenModify] = useState(false);

  useEffect(() => {
    lineAdapterMapRef.current = lineAdapterMap;
  }, [lineAdapterMap]);

  const { data: orders, refetch: orderRefretch } = useInfiniteOrdersHistory(
    20,
    {
      active: true,
      success: false,
      failed: true,
      buyDip: true,
      stopLoss: true,
      takeProfit: true,
      poolAddress: poolAddress,
    }
  );

  const [data, setData] = useState<ILimitOrder[]>([]);

  const { data: poolInfo, refetch } = usePoolDetail(
    poolAddress ?? "FRhB8L7Y9Qq41qZXYLtC2nw8An1RJfLLxRF2x9RwLLMo"
  );

  const { data: TRENDING_PAIRS } = usePoolList(
    SCORE_TIME["5"],
    0,
    20,
    SORT_TYPE[0],
    "desc",
    5
  );

  const [price, setPrice] = useState<number | undefined>();
  const priceRef = useRef(price);

  useEffect(() => {
    priceRef.current = price;
  }, [price]);

  useEffect(() => {
    if (poolInfo) {
      setPrice(poolInfo?.price);
    }
  }, [poolInfo]);

  const [widget, setWidget] = useState<IChartingLibraryWidget | undefined>();

  useEffect(() => {
    setData((history) => {
      // Extract new items from the latest page
      const newItems = orders?.pages[orders.pages.length - 1]?.items || [];
      // Create a Map to ensure uniqueness by txHash
      // const dataMap = new Map(history.map(item => [item.order_id, item]));
      const dataMap = new Map();

      // Add new items to the Map, automatically handling duplicates
      newItems.forEach((item) => dataMap.set(item._id, item));

      // Convert Map back to array and sort by blockUnixTime in descending order
      const updatedData = Array.from(dataMap.values()).sort(
        (a, b) => b.timeStamp - a.timeStamp
      );

      return updatedData;
    });
  }, [orders]);

  useEffect(() => {
    if (!ws_pool || !poolAddress) return;

    refetch();
    ws_pool.sendMessage("subscribe", {
      type: "PRICE_REALTIME",
      data: {
        type: ALLOWED_RESOLUTIONS["1"],
        address: poolAddress,
        address_type: "pair",
      },
    });

    const listenerId = ws_pool?.registerListener(
      "PRICE_REALTIME_DATA",
      (data) => {
        if (data.type === "PRICE_REALTIME_DATA") {
          if (data.data.address === poolAddress) {
            queryClient.setQueryData(
              ["TOKEN_PRICE", poolAddress],
              data.data.price
            );
            setPrice(data.data.price);
          }
        }
      }
    );

    return () => {
      ws_pool?.removeListener(listenerId);
      ws_pool.sendMessage("unsubscribe", {
        type: "PRICE_REALTIME",
        data: {
          type: ALLOWED_RESOLUTIONS["1"],
          address: poolAddress,
          address_type: "pair",
        },
      });
    };
  }, [ws_pool, queryClient, poolAddress]);

  const handleCopyTokenAddress = (
    event: React.MouseEvent<SVGElement | HTMLDivElement>
  ) => {
    if (poolInfo) {
      copyToClipboard(poolInfo.baseMint, () => {
        toast.success("Successfuly copied");
      });
    }
    event.preventDefault();
    event.stopPropagation();
  };

  const handleCopyPoolAddress = (event: React.MouseEvent<HTMLDivElement>) => {
    if (poolInfo) {
      copyToClipboard(poolInfo.poolAddress, () => {
        toast.success("Successfuly copied");
      });
    }
    event.preventDefault();
    event.stopPropagation();
  };

  const refresh_addTPLine = (order: ILimitOrder) => {
    orderRefretch();
    addTPLine(order);
  };
  const refresh_addSLLine = (order: ILimitOrder) => {
    orderRefretch();
    addSLLine(order);
  };
  const refresh_addBuyDipLine = (order: ILimitOrder) => {
    orderRefretch();
    addBuyDipLine(order);
  };

  const addTPLine = (order: ILimitOrder, index?: number) => {
    console.log("addTPLine start", order);
    if (!order._id || !widget || !widget.chart()) return;
    if (lineAdapterMap.get(order._id)) {
      lineAdapterMap.get(order._id)?.remove();
    }
    console.log("addTPLine", order);
    const lineAdapter = widget
      ?.chart()
      ?.createOrderLine()
      .onMove(() => {
        const newPrice = lineAdapter.getPrice();
        updateLimitOrder(
          order.poolAddress,
          order.tokenAddress,
          order.expire,
          order.trxPriority,
          order.slippage,
          order.created_price,
          {
            sellDipTP: {
              id: order._id,
              target_value: newPrice,
              trigger_type: 0,
              amount: order.amount,
              amount_type: order.amount_type,
            },
          }
        )
          .then((data) => {
            orderRefretch();
            toast.success("Order updated successfully!");
          })
          .catch((error) => {
            console.log(error);
            toast.error("Order update failed!");
            lineAdapter.setPrice(order.target_price || 0);
          });
      })
      .onModify("onModify called", (text: string) => {
        console.log(text);
      })
      .onCancel("onCancel called", (text: string) => {
        console.log(text);
        if (order._id) {
          removeLimitOrder(order._id)
            .then((data) => {
              console.log(data);
              toast.success("Order canceled successfully!");
              lineAdapter.remove();
              orderRefretch();
            })
            .catch((error) => {
              console.log(error);
              toast.error("Order cancel failed!");
            });
        }
      })
      .setText("Take Profit")
      .setQuantity(`${order.amount}${order.amount_type === 0 ? "" : "%"}`)
      .setPrice(order.target_price || 0)
      .setExtendLeft(false)
      .setLineStyle(1)
      .setLineLength(50)
      .setLineColor("#31F79B")
      .setBodyTextColor("#31F79B")
      .setBodyBorderColor("#31F79B")
      .setBodyBackgroundColor("#111214")
      .setQuantityTextColor("#31F79B")
      .setQuantityBorderColor("#31F79B")
      .setQuantityBackgroundColor("#111214")
      .setCancelButtonBorderColor("#31F79B")
      .setCancelButtonIconColor("#31F79B")
      .setCancelButtonBackgroundColor("#111214");

    setLineAdapterMap((lineMap) =>
      lineMap.set(order._id as string, lineAdapter)
    );
  };

  const addSLLine = (order: ILimitOrder, index?: number) => {
    console.log("addSLLine start", order);
    if (!order._id || !widget || !widget.chart()) return;
    if (lineAdapterMap.get(order._id)) {
      lineAdapterMap.get(order._id)?.remove();
    }
    console.log("addSLLine", order);
    const lineAdapter = widget
      ?.chart()
      ?.createOrderLine()
      .onMove(() => {
        const newPrice = lineAdapter.getPrice();
        updateLimitOrder(
          order.poolAddress,
          order.tokenAddress,
          order.expire,
          order.trxPriority,
          order.slippage,
          order.created_price,
          {
            sellDipSL: {
              id: order._id,
              target_value: newPrice,
              trigger_type: 0,
              amount: order.amount,
              amount_type: order.amount_type,
            },
          }
        )
          .then((data) => {
            console.log(data);
            orderRefretch();
            toast.success("Order updated successfully!");
          })
          .catch((error) => {
            console.log(error);
            toast.error("Order update failed!");
            lineAdapter.setPrice(order.target_price || 0);
          });
      })
      .onModify("onModify called", (text: string) => {
        console.log(text);
      })
      .onCancel("onCancel called", (text: string) => {
        console.log(text);
        if (order._id) {
          removeLimitOrder(order._id)
            .then((data) => {
              console.log(data);
              toast.success("Order canceled successfully!");
              lineAdapter.remove();
              orderRefretch();
            })
            .catch((error) => {
              console.log(error);
              toast.error("Order cancel failed!");
            });
        }
      })
      .setText("Stop Loss")
      .setQuantity(`${order.amount}${order.amount_type === 0 ? "" : "%"}`)
      .setPrice(order.target_price || 0)
      .setExtendLeft(false)
      .setLineStyle(1)
      .setLineLength(50)
      .setLineColor("#F6475D")
      .setBodyTextColor("#F6475D")
      .setBodyBorderColor("#F6475D")
      .setBodyBackgroundColor("#111214")
      .setQuantityTextColor("#F6475D")
      .setQuantityBorderColor("#F6475D")
      .setQuantityBackgroundColor("#111214")
      .setCancelButtonBorderColor("#F6475D")
      .setCancelButtonIconColor("#F6475D")
      .setCancelButtonBackgroundColor("#111214");

    setLineAdapterMap((lineMap) =>
      lineMap.set(order._id as string, lineAdapter)
    );
  };

  const addBuyDipLine = (order: ILimitOrder, index?: number) => {
    console.log("addBuyDipLine start", order);
    if (!order._id || !widget || !widget.chart()) return;
    if (lineAdapterMap.get(order._id)) {
      lineAdapterMap.get(order._id)?.remove();
    }
    console.log("addBuyDipLine", order);
    const lineAdapter = widget
      ?.chart()
      ?.createOrderLine()
      .onMove(() => {
        const newPrice = lineAdapter.getPrice();
        console.log("!!!", priceRef.current, newPrice);
        if (!priceRef.current || newPrice > priceRef.current) {
          toast.error("Order update failed!");
          lineAdapter.setPrice(order.target_price || 0);
          return;
        }

        updateLimitOrder(
          order.poolAddress,
          order.tokenAddress,
          order.expire,
          order.trxPriority,
          order.slippage,
          order.created_price,
          {
            buyDip: {
              id: order._id,
              target_value: newPrice,
              trigger_type: 0,
              amount: order.amount,
            },
          }
        )
          .then((data) => {
            console.log(data);
            toast.success("Order updated successfully!");
            orderRefretch();
          })
          .catch((error) => {
            console.log(error);
            toast.error("Order update failed!");
            lineAdapter.setPrice(order.target_price || 0);
          });
      })
      .onModify("onModify called", (text: string) => {
        console.log(text, order);
        setSelectedOrder(order);
        setOpenModify(true);
      })
      .onCancel("onCancel called", (text: string) => {
        if (order._id) {
          removeLimitOrder(order._id)
            .then((data) => {
              console.log(data);
              toast.success("Order canceled successfully!");
              order?.sellOrders?.map((sell_order) => {
                if (sell_order._id) {
                  console.log(
                    "123123",
                    lineAdapterMapRef.current.get(sell_order._id)
                  );
                  lineAdapterMapRef.current.get(sell_order._id)?.remove();
                }
              });
              lineAdapter.remove();
              orderRefretch();
            })
            .catch((error) => {
              console.log(error);
              toast.error("Order cancel failed!");
            });
        }
      })
      .setText(`Buy Dip`)
      .setQuantity(`${order.amount}`)
      .setPrice(order.target_price || 0)
      .setExtendLeft(false)
      .setLineStyle(1)
      .setLineLength(50)
      .setLineColor("#31F79B")
      .setBodyTextColor("#31F79B")
      .setBodyBorderColor("#31F79B")
      .setBodyBackgroundColor("#111214")
      .setQuantityTextColor("#31F79B")
      .setQuantityBorderColor("#31F79B")
      .setQuantityBackgroundColor("#111214")
      .setCancelButtonBorderColor("#31F79B")
      .setCancelButtonIconColor("#31F79B")
      .setCancelButtonBackgroundColor("#111214");

    setLineAdapterMap((lineMap) =>
      lineMap.set(order._id as string, lineAdapter)
    );
  };

  useEffect(() => {
    if (!orders || !widget) return;
    widget.onChartReady(() => {
      setTimeout(() => {
        orders.pages[0]?.items.map((item, index) => {
          if (item.poolAddress === poolAddress) {
            if (item.type === 0) {
              addTPLine(item, lineCount);
            } else if (item.type === 1) {
              addSLLine(item, lineCount);
            } else if (!item.type) {
              addBuyDipLine(item, lineCount);
              item.sellOrders?.map((sell_order) => {
                if (sell_order.type === 0) {
                  addTPLine(sell_order, lineCount);
                } else if (sell_order.type === 1) {
                  addSLLine(sell_order, lineCount);
                }
              });
            }
          }
        });
      }, 3000);
    });
  }, [orders, widget]);

  return (
    <div className="flex flex-col -mx-5 md:-mx-12 border-collapse">
      <div className="marquee-container flex h-6 border w-full border-light-gray gap-5 overflow-x-hidden relative">
        <div className="marquee-bar flex gap-3 text-sm whitespace-nowrap animate-marquee hover:animation-paused px-3">
          {TRENDING_PAIRS &&
            TRENDING_PAIRS.length > 0 &&
            TRENDING_PAIRS.map((trend: IPoolOverview) => (
              <div className="flex gap-2 items-center" key={trend.poolAddress}>
                <span>{trend.baseSymbol}</span>
                <div className="flex gap-1">
                  <GetSvg
                    name={
                      trend.priceChange5mPercent > 0 ? "arrow-up" : "arrow-down"
                    }
                    className="w-4"
                  />
                  <FormattedNumber
                    className={cn(buySellColor(trend.priceChange5mPercent))}
                    value={trend.priceChange5mPercent}
                    options={{ precision: 3 }}
                    isPercent={true}
                  />
                </div>
                <FormattedNumber
                  value={trend.price}
                  options={{ precision: 4 }}
                  isCurrency={true}
                />
                <span className="text-gray leading-3">|</span>
              </div>
            ))}
        </div>

        <div className="marquee-bar flex gap-3 text-sm whitespace-nowrap animate-marquee2 absolute top-0 px-3">
          {TRENDING_PAIRS &&
            TRENDING_PAIRS.length > 0 &&
            TRENDING_PAIRS.map((trend: IPoolOverview) => (
              <div className="flex gap-2 items-center" key={trend.poolAddress}>
                <span>{trend.baseSymbol}</span>
                <div className="flex gap-1">
                  <GetSvg
                    name={
                      trend.priceChange5mPercent > 0 ? "arrow-up" : "arrow-down"
                    }
                    className="w-4"
                  />
                  <FormattedNumber
                    className={cn(buySellColor(trend.priceChange5mPercent))}
                    value={trend.priceChange5mPercent}
                    options={{ precision: 3 }}
                    isPercent={true}
                  />
                </div>
                <FormattedNumber
                  value={trend.price}
                  options={{ precision: 4 }}
                  isCurrency={true}
                />
                <span className="text-gray leading-3">|</span>
              </div>
            ))}
        </div>
      </div>
      <div className="grid md:grid-cols-[360px_1fr] border-collapse">
        <div className="flex flex-col common-bg !p-0 !rounded-none ">
          <PoolInfo
            poolInfo={
              poolInfo
                ? {
                    ...poolInfo,
                    price: price || poolInfo.price,
                  }
                : undefined
            }
            onCopy={handleCopyTokenAddress}
          />
          <div className="flex flex-col">
            <PoolStatus poolInfo={poolInfo} />
          </div>
          <div className="flex flex-col">
            <SwapToken
              poolInfo={
                poolInfo
                  ? {
                      ...poolInfo,
                      price: price || poolInfo.price,
                    }
                  : undefined
              }
              addTPLine={refresh_addTPLine}
              addSLLine={refresh_addSLLine}
              addBuyDipLine={refresh_addBuyDipLine}
            />
          </div>
        </div>
        <div className="flex flex-col px-4">
          <div className="flex flex-col w-full border-b border-light-gray">
            <div className="flex gap-5 items-center px-4 py-2 border-b border-light-gray">
              <div className="flex gap-2 items-center">
                {poolInfo?.baseImage && (
                  <img
                    className="size-6 rounded-full"
                    src={poolInfo?.baseImage}
                    alt="logo"
                  />
                )}
                <span className="text-xl font-bold">{poolInfo?.baseName}</span>
              </div>
              <div className="flex gap-2 text-sm font-sm text-gray items-end">
                <div
                  className="flex gap-1 items-center hover:text-soft-white cursor-pointer"
                  onClick={handleCopyTokenAddress}
                >
                  <span>Token</span>
                  <ClipboardDocumentIcon className="size-4" />
                </div>
                <span className="text-gray">|</span>
                <div
                  className="flex gap-1 items-center hover:text-soft-white cursor-pointer"
                  onClick={handleCopyPoolAddress}
                >
                  <span>Pair</span>
                  <ClipboardDocumentIcon className="size-4" />
                </div>
              </div>
            </div>
            {poolInfo?.poolAddress ? (
              <TVChart widget={widget} setWidget={setWidget} data={poolInfo} />
            ) : (
              <Skeleton className="min-h-[500px] w-full" />
            )}
          </div>
          <div className="w-full flex min-h-[300px] flex-grow border-b md:border-none border-light-gray overflow-auto">
            <TabGroup className="flex flex-col w-full min-h-[300px]">
              <TabList className="flex w-full items-center gap-1">
                {["Orders", "Transactions"].map((tabName) => (
                  <Tab
                    key={tabName}
                    className={({ selected }) =>
                      `border-b-2 outline-transparent rounded-none text-sm px-4 font-semibold ${
                        selected
                          ? "text-soft-white border-b-2  border-primary"
                          : "text-gray border-light-gray"
                      }`
                    }
                  >
                    {tabName}
                  </Tab>
                ))}
              </TabList>
              <TabPanels className="flex w-full h-full">
                <TabPanel className="flex w-full h-full">
                  <OrderTable
                    data={data}
                    refetch={orderRefretch}
                    setOpenModify={setOpenModify}
                    setSelectedOrder={setSelectedOrder}
                    lineAdapterMap={lineAdapterMap}
                  />
                </TabPanel>
                <TabPanel className="flex w-full h-full">
                  {poolInfo?.poolAddress ? (
                    <TradeList
                      poolInfo={poolInfo}
                      poolAddress={poolInfo.poolAddress}
                    />
                  ) : (
                    <Skeleton className="min-h-[300px] w-full" />
                  )}
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        </div>
      </div>

      {openModify && (
        <ModifyModal
          open={openModify}
          setOpen={setOpenModify}
          selectedOrder={selectedOrder}
          poolInfo={poolInfo}
          orderRefretch={orderRefretch}
        />
      )}
    </div>
  );
}
