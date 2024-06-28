import styled from "styled-components";
import { Button } from "@nextui-org/react";

export const SecondayButton = styled(Button)`
  border-radius: 24px;
  border: 1px solid rgba(51, 49, 49, 0);
  background: #10131c;
  filter: blur(0.125px);
  height: 52px;
  color: #fff;
  text-align: center;
  font-family: "Chakra Petch";
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 100% */
  letter-spacing: -0.5px;
`;
export const PrimaryButton = styled(Button)`
  border-radius: 64px;
  background: #1d4138;
  height: 52px;

  box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.15),
    0px 0px 12px 0px rgba(255, 255, 255, 0.75) inset;
  color: #fff;
  text-align: center;
  font-family: Satoshi;
  font-size: 16px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
`;
