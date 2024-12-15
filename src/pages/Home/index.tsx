import { useNavigate } from "react-router-dom";
import CheckBox from "../../components/common/CheckBox";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAccountInfo } from "../../providers/AppContext";
import ActionButton from "../../components/buttons/ActionButton";
import { useState } from "react";
import WalletModal from "../../components/modal/WalletModal";
import Background from "./Background";
import { SubTitle } from "./SubTitle";
import { PersonCard } from "./PersonCard";
import { StepCard } from "./StepCard";
import { NewsCard } from "./NewsCard";

export default function Home() {
  const { connected } = useWallet();
  const { isSign } = useAccountInfo();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  if (connected && isSign) {
    navigate("/discover");
  }

  const persons = [
    {
      name: "Anna Peto",
      avatar: "assets/images/person1.png",
      follows: 12.5,
      focus: ["defi", "token sniping", "market trends"],
    },
    {
      name: "Kien John",
      avatar: "assets/images/person2.png",
      follows: 12.5,
      focus: ["defi", "token sniping"],
    },
    {
      name: "Maxim J",
      avatar: "assets/images/person3.png",
      follows: 30.5,
      focus: ["defi", "token sniping", "market trends"],
    },
  ];

  const news = [
    {
      title: "News on token trends",
      content:
        "Updated posts on emerging trends, predictions, and new market strategies",
      image: "assets/images/dash_new1.png",
    },
    {
      title: "News on token trends",
      content:
        "Updated posts on emerging trends, predictions, and new market strategies",
      image: "assets/images/dash_new2.png",
    },
    {
      title: "News on token trends",
      content:
        "Updated posts on emerging trends, predictions, and new market strategies",
      image: "assets/images/dash_new3.png",
    },
  ];

  return (
    <div className="home__page w-full flex flex-col items-center">
      <div className="flex flex-col lg:gap-[175px] pt-16 z-10 bg-contain bg-end bg-no-repeat">
        <div className="relative h-[800px] flex flex-col justify-between py-8 lg:px-8">
          <img
            src="./assets/images/dash_pic1.png"
            className="absolute top-0 right-[-50px] w-[1200px] h-full"
          ></img>
          <div>
            <span className="gradient_text text-[70px] font-semibold">
              GLOBAL MEME INDEX
            </span>
            <p className="text-[50px] font-light max-w-[578px]">
              Your Gateway For Token Launched, Purchases, And Community Insights
            </p>
          </div>
          {connected && isSign ? (
            <></>
          ) : (
            <div className="flex flex-col gap-4">
              <span className="text-[25px] font-normal">
                Connect to start trading SOL now
              </span>
              <ActionButton
                className="w-[16rem] lg:w-[422px] bg-gradient-to-b from-[rgba(0,243,231,0.88)] to-[rgba(0,243,231,0.55)] top-[70vh]"
                onClick={() => setOpen(true)}
              >
                <div className="w-full flex justify-between items-center">
                  <span className="text-white text-[0.8rem] lg:text-[22px] flex-1">
                    Connect Your Wallet
                  </span>
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    className="scale-50 lg:scale-100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="15" cy="15" r="14.5" stroke="white" />
                    <path
                      d="M10.9756 10.9756H19.0244M19.0244 10.9756V19.0244M19.0244 10.9756L10.9756 19.0244"
                      stroke="white"
                    />
                  </svg>
                </div>
              </ActionButton>
              <CheckBox className="text-[1rem] lg:text-[1rem]">
                By connecting, I agree to the Terms & Privacy
              </CheckBox>
            </div>
          )}
          <div className="flex gap-4">
            <ActionButton
              className="w-[16rem] lg:w-[300px] text-[22px] text-white bg-[#19232B] top-[70vh] border-none"
              onClick={() => {}}
            >
              Create & Buy Tokens
            </ActionButton>
            <ActionButton
              className="w-[16rem] lg:w-[300px] text-[22px] text-white bg-[linear-gradient(136.62deg,_#01F9E6_13.75%,_#00EDE9_29.34%,_#00CEF2_47.47%,_#00A2FF_70.67%,_#0D99FF_86.26%)] top-[70vh] border-none"
              onClick={() => {}}
            >
              Explore Tokens
            </ActionButton>
            <ActionButton
              className="w-[16rem] lg:w-[300px] text-[22px] text-white bg-[#19232B] top-[70vh] border-none"
              onClick={() => {}}
            >
              View Market Trends
            </ActionButton>
          </div>
        </div>

        <div className="flex flex-col items-center gap-[100px]">
          <SubTitle title="about" content=""></SubTitle>
          <div className="flex items-center gap-[200px]">
            <div className="max-w-[550px] flex flex-col gap-[50px]">
              <p className="text-[45px] font-normal">
                Empowering users to make strategic moves in the decentralized
                market
              </p>
              <p className="text-[18px] font-normal">
                GMI, the Global Meme Index, is a comprehensive platform designed
                for token creation, discovery, purchases, and sniping across
                multiple networks. Our mission is to provide a seamless
                experience for users to create and purchase tokens, stay
                informed about new launches, and make strategic investment
                decisions.
              </p>
            </div>
            <img src="assets/images/dash_pic2.png" className="w-[650px]"></img>
          </div>
        </div>

        <div className="flex flex-col items-center gap-[100px]">
          <SubTitle
            title="LATEST TOKEN LAUNCHES"
            content="Stay updated on the newest tokens in the market across popular
              networks. Discover and purchase opportunities directly from GMI’s
              Latest Token Launches."
          ></SubTitle>
          <img src="assets/images/dash_pic3.png" className="w-[1400px]"></img>
        </div>

        <div className="flex flex-col items-center gap-[100px]">
          <SubTitle
            title="REAL-TIME TOKEN PRICES"
            content="Monitor real-time prices and trends for popular tokens. Use data
              to guide your purchase decisions or spot opportunities for
              sniping."
          ></SubTitle>
          <img src="assets/images/dash_pic4.png" className="w-[1400px]"></img>
        </div>

        <div className="flex flex-col items-center gap-[100px]">
          <SubTitle
            title="TOP X (TWITTER) ACCOUNTS TO FOLLOW"
            content="Follow key influencers and experts for insights on token
              purchases, upcoming launches, and sniping tips."
          ></SubTitle>
          <div className="flex gap-20">
            {persons.map((item) => (
              <PersonCard
                name={item.name}
                avatar={item.avatar}
                follows={item.follows}
                focus={item.focus}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-[100px]">
          <SubTitle
            title="Recommended Community Platforms"
            content="Join active communities for real-time updates on token launches,
              strategies for token purchases, and sniping opportunities."
          ></SubTitle>
          <img
            src="assets/images/dash_pic5.png"
            className="w-screen scale-105"
          ></img>
        </div>

        <SubTitle
          title="Create, Buy & Snipe Tokens"
          content="Whether you want to create your own token, purchase new launches, or
            snipe opportunities, GMI makes it simple and secure."
        ></SubTitle>

        <div className="flex flex-col lg:flex-row-reverse w-full justify-between lg:items-center px-[1rem] lg:px-[10%] mt-[20px] gap-2">
          <div className="relative flex flex-col">
            <span className="text-[2rem] lg:text-[5rem] max-w-[400px]">
              Quick Buy and Sell
            </span>
            <span className="text-[1rem] lg:text-[2rem] max-w-[400px]">
              Discover new tokens and filter by your preferences.
            </span>
          </div>

          <img
            src="assets/images/buysell.png"
            className="w-[100%] lg:w-[60%]"
          ></img>
        </div>

        <div className="flex flex-col gap-[100px]">
          <SubTitle
            title="How GMI Works"
            content="Explore how GMI simplifies the world of token creation, purchases, and sniping across multiple networks."
          />

          <div className="flex justify-center gap-[100px]">
            <StepCard
              title="Step 1: Discover Tokens"
              content="Find new launches across multiple networks."
            />
            <StepCard
              title="Step 2: Track Market Data"
              content="Stay updated on real-time token prices and performance metrics"
              className="translate-y-20"
            />
          </div>

          <div className="flex justify-center gap-[100px]">
            <StepCard
              title="Step 3: Create, Buy, or Snipe"
              content="Create your token, purchase new launches, or set up sniping alerts."
            />
            <StepCard
              title="Step 4: Join the Community"
              content="Connect with experts and influencers to gain insights and stay informed."
              className="translate-y-20"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-[100px] lg:mt-20">
          <SubTitle
            title="Latest News & Updates"
            content="Catch up on the latest crypto news and strategies for token purchases and sniping. GMI brings you trends, analysis, and stories that matter"
          />

          <div className="flex gap-20">
            {news.map((item) => (
              <NewsCard
                title={item.title}
                content={item.content}
                image={item.image}
              />
            ))}
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-end h-[800px]">
          <img
            src="assets/icons/half_circle.svg"
            className="absolute top-0"
          ></img>
          <div className="flex flex-col items-center gap-8 z-30">
            <div className="max-w-[1200px] text-center">
              <span className="text-[1.8rem] lg:text-[5.5rem]">
                START TRADING IN LESS{" "}
                <span className="text-[#00F3E7]">THAN 30 SECS</span>
              </span>
            </div>

            <span className="text-[1rem] lg:text-[1.5rem]">
              Connect to start trading SOL now
            </span>
            <ActionButton className="w-[16rem] lg:w-[422px] bg-gradient-to-b from-[rgba(0,243,231,0.88)] to-[rgba(0,243,231,0.55)]">
              <div
                className="w-full flex justify-between items-center"
                onClick={() => setOpen(true)}
              >
                <span className="text-white text-[0.8rem] lg:text-[22px] flex-1">
                  Connect Your Wallet
                </span>
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  className="scale-50 lg:scale-100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="15" cy="15" r="14.5" stroke="white" />
                  <path
                    d="M10.9756 10.9756H19.0244M19.0244 10.9756V19.0244M19.0244 10.9756L10.9756 19.0244"
                    stroke="white"
                  />
                </svg>
              </div>
            </ActionButton>
          </div>
        </div>
        <WalletModal open={open} setOpen={setOpen} />
      </div>
    </div>
  );
}
