import styled from "styled-components";
import { Button, Tooltip, Checkbox } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { formatNumberWithUnit } from "@/utils";
import SbtNft from "./PortfolioComponents/SbtNFT";
import LynksNft from "./PortfolioComponents/LynksNFT";
import TrademarkNFT from "./PortfolioComponents/TrademarkNFT";
const Title = styled.div`
  background: linear-gradient(180deg, #fff 0%, #bababa 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: right;
  font-family: Satoshi;
  font-size: 32px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
`;
const Container = styled.div`
  .view-more {
    display: flex;
    padding: 12px 18px;
    justify-content: space-between;
    align-items: flex-start;
    border-radius: 24px;
    border: 1px solid rgba(51, 49, 49, 0);
    background: #10131c;
    filter: blur(0.125px);
    cursor: pointer;
    color: #fbfbfb;
    text-align: right;
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 110%; /* 17.6px */
    text-transform: capitalize;
  }
  .points-divide {
    height: 1px;
    width: 142px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(251, 251, 251, 0.6) 51.5%,
      rgba(255, 255, 255, 0) 100%
    );
  }
  .divide {
    height: 1px;
    width: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(251, 251, 251, 0.6) 51.5%,
      rgba(255, 255, 255, 0) 100%
    );
  }
  .points-value {
    text-align: center;
    font-family: Satoshi;
    font-size: 56px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    background: linear-gradient(180deg, #fff 0%, #bababa 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 36px;
  }
  .btn-earn-more {
    display: flex;
    width: 200px;
    height: 47px;
    padding: 7.5px 40px;
    justify-content: center;
    align-items: center;
    border-radius: 64px;
    background: #1d4138;
    box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.15),
      0px 0px 12px 0px rgba(255, 255, 255, 0.75) inset;
  }
`;

const List = styled.div`
  width: 100%;
  .row {
    border-radius: 24px;
    border: 2px solid #635f5f;
    background: #151923;
  }
  .list-content-item {
    padding: 16px 28px;
    color: var(--Neutral-1, #fff);
    font-family: Satoshi;
    font-size: 14px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;

    .symbol {
      color: #fff;
      font-family: Satoshi;
      font-size: 16px;
      font-style: normal;
      font-weight: 900;
      line-height: normal;
      text-transform: capitalize;
    }
    .name {
      color: #03d498;
      font-family: Satoshi;
      font-size: 12px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }

    .text-gray {
      color: rgba(255, 255, 255, 0.6);
      font-family: Satoshi;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
    .action {
      color: rgba(251, 251, 251, 0.6);
      font-family: Satoshi;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      text-align: center;
    }
    .particpate {
      text-align: center;
      font-family: Satoshi;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      background: linear-gradient(
        90deg,
        #4ba790 0%,
        rgba(251, 251, 251, 0.6) 50.31%,
        #9747ff 100%
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .col-2 {
    flex: 2;
  }
  .col-3 {
    flex: 3;
  }
  .col-line {
    width: 1px;
    height: 44px;
    opacity: 0.3;
    opacity: 0.3;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(251, 251, 251, 0.6) 51.5%,
      rgba(255, 255, 255, 0) 100%
    );
  }
`;

const PointsPopoverContent = () => (
  <div className="w-full">
    <div className="flex items-center justify-between mb-5">
      <span>Earned by Holding</span>
      <span>1.26k </span>
    </div>
    <div className="flex items-center justify-between mb-5">
      <span>Earned by Holding</span>
      <span>1.26k </span>
    </div>
    <div className="flex items-center justify-between ">
      <span>Earned by Holding</span>
      <span>1.26k </span>
    </div>
  </div>
);

export default function Portfolio() {
  const [checked, setChecked] = useState(false);
  const [filterTableList, setFilterTableList] = useState<any[]>([]);

  useEffect(() => {
    setFilterTableList(
      new Array(5).fill({
        iconURL: "",
        name: "Renzo",
        twitter: "@Renzo.fi",
        ezPoints: 100,
        eigenlayerPoints: 2000.2,
      })
    );
  }, []);

  const handleViewMore = () => {};
  const handleEarnMore = () => {};
  return (
    <Container>
      <div className="flex items-center justify-between">
        <Title>Your Nova Points</Title>
        <div className="view-more" onClick={handleViewMore}>
          Check Referral Status
        </div>
      </div>
      <div className="flex items-center justify-between mt-5">
        {new Array(4).fill(undefined).map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center w-[275px] bg-[#1B1D20] pt-9 py-12"
          >
            <p className="text-white text-[16px]">Asset Points</p>
            <div className="points-divide my-8"></div>
            <Tooltip
              classNames={{
                content:
                  "w-[300px] rounded-lg bg-[#151923] text-white px-4 py-5",
              }}
              content={<PointsPopoverContent />}
            >
              <p className="points-value">24.2K</p>
            </Tooltip>
            <Button className="btn-earn-more" onClick={handleEarnMore}>
              <img src="/img/icon-wallet-white-2.svg" alt="" />
              <span>Earn More</span>
            </Button>
          </div>
        ))}
      </div>
      <div className="divide my-12"></div>
      <div className="flex items-center justify-between">
        <Title>Your Project Points</Title>
        <div className="view-more" onClick={handleViewMore}>
          <span className="mr-2 text-[#FbFbFb]/[0.6]">{`View Points < 0.1`}</span>
          <Checkbox
            defaultSelected
            radius="none"
            isSelected={checked}
            onValueChange={setChecked}
          ></Checkbox>
        </div>
      </div>
      <List>
        <div className="list-content">
          {filterTableList.map((item, index) => (
            <div className="row mb-[24px] flex items-center" key={index}>
              <div className="list-content-item flex col-2 items-center gap-[10px]">
                {item?.iconURL && (
                  <img
                    src={item?.iconURL}
                    alt=""
                    className="w-[55px] h-[56px] rounded-full block"
                  />
                )}
                <div>
                  <div className="symbol">
                    <span className="mr-1">{item?.symbol}</span>
                    <img src="img/icon-square-link.svg"></img>
                  </div>
                  {item?.twitter && (
                    <div className="name mt-[5px]">{item.twitter}</div>
                  )}
                </div>
              </div>
              <div className="col-line"></div>

              <div className="list-content-item flex col-3 flex-col   text-center">
                <span className="text-gray mb-4">ezPoints</span>
                <span>{formatNumberWithUnit(item?.ezPoints)}</span>
              </div>
              <div className="col-line"></div>

              <div className="list-content-item flex col-3 flex-col  text-center">
                <span className="text-gray mb-4">Renzo Eigenlayer Points</span>
                <span>{formatNumberWithUnit(item?.eigenlayerPoints)}</span>
              </div>
              <div className="col-line"></div>

              <div className="list-content-item  flex col-2 justify-center items-center gap-[10px]">
                <span className="particpate">Participate</span>
                <img src="img/icon-square-link-color.svg" alt="" />
              </div>
            </div>
          ))}
        </div>
      </List>
      <div className="divide my-12"></div>
      <div className="flex items-center justify-between">
        <Title>Your Nova NFT</Title>
        <div className="view-more" onClick={handleViewMore}>
          <span className="mr-2 text-[#FbFbFb]/[0.6]">View More Details</span>
        </div>
      </div>
      <div className="flex gap-6">
        <SbtNft />
        <LynksNft />
      </div>
      <TrademarkNFT />
    </Container>
  );
}
