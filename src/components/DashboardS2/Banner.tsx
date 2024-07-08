import styled from "styled-components";

const Banner1 = styled.div`
  padding: 15px 0;
  text-align: center;
  background: #47e3b2;
  color: #0f242e;
  text-align: center;
  font-family: "Chakra Petch";
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 100% */
  letter-spacing: -0.5px;
`;

const Banner2 = styled.div`
  padding: 20px 77px;
  background: #13388e;
  color: #fff;
  text-align: left;
  font-family: Heebo;
  font-size: 48px;
  font-style: normal;
  font-weight: 900;
  line-height: 56px; /* 116.667% */
  letter-spacing: -0.5px;
`;

export default () => {
  return (
    <>
      <Banner1 className="banner-1">
        Novadrop Round One, Genesis Wallet Checker is live, Check Now!
      </Banner1>
      <Banner2 className="banner-2">
        <p>zkLink Nova</p>
        <p className="mt-[16px]">
          The Pioneering and Largest L3 with Aggregated liquidity
        </p>
      </Banner2>
    </>
  );
};
