import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Card from "../../components/common/Card";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import WithdrawTable from "../../components/tables/WithdrawTable";
import { useAccountInfo } from "../../providers/AppContext";
import { useState } from "react";
import DepositTable from "../../components/tables/DepositTable";

export default function TransferFund() {
  const { useTxData } = useAccountInfo();
  const { data: depositTxData, isFetching: fetchingDeposit } = useTxData([
    "deposit",
  ]);
  const { data: withdrawTxData, isFetching: fetchingWithdraw } = useTxData([
    "withdraw",
  ]);

  const [pageType, setPageType] = useState(0);

  return (
    <div className="flex flex-col gap-4 w-full mt-[20px] common-bg">
      <div className="flex flex-col gap-2">
        <span className="text-2xl font-bold">Transfer Funds</span>
        <span className="text-gray font-medium text-sm">
          Easily deposit or withdraw funds.
        </span>
      </div>

      <div className="flex flex-col py-4 gap-2 rounded-xl">
        <TabGroup className="w-full">
          <TabList className="flex items-center gap-4">
            {["Deposit", "Withdraw"].map((tabName, index) => (
              <Tab
                key={tabName}
                className={({ selected }) =>
                  `border-b-2 rounded-none text-md outline-none font-bold pt-0 ${
                    selected
                      ? "text-soft-white border-b-2  border-primary"
                      : "text-gray border-transparent"
                  }`
                }
                onClick={() => setPageType(index)}
              >
                {tabName}
              </Tab>
            ))}
          </TabList>

          <TabPanels className="mt-2">
            <TabPanel>
              <Deposit />
            </TabPanel>
            <TabPanel>
              <Withdraw />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>

      <div className="flex flex-col gap-5 min-h-56 rounded-xl">
        <span className="font-bold pt-4">History</span>
        {pageType === 0 ? (
          <>
            {depositTxData && depositTxData.length > 0 ? (
              <div className="w-full overflow-auto">
                <DepositTable
                  data={depositTxData}
                  isFetching={fetchingDeposit}
                />
              </div>
            ) : (
              <span className="text-gray text-sm px-4 md:px-6">
                There are currently no transactions yet.
              </span>
            )}
          </>
        ) : (
          <>
            {withdrawTxData && withdrawTxData.length > 0 ? (
              <div className="w-full overflow-auto">
                <WithdrawTable
                  data={withdrawTxData}
                  isFetching={fetchingWithdraw}
                />
              </div>
            ) : (
              <span className="text-gray text-sm px-4 md:px-6">
                There are currently no transactions yet.
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
