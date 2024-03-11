import { formatNumberWithUnit, showAccount } from "@/utils";
import styled from "styled-components";

const ListItem = styled.div`
  border-top: 0.0625rem solid #292a2a;
`;

type ReferralItem = {
  address: string;
  tvl: string | number;
};
interface IReferralListProps {
  data: ReferralItem[];
  ethUsdPrice: number;
}

export default function ReferralList(props: IReferralListProps) {
  // const referralData = [
  //     {
  //         address: '0x3125523...41323',
  //         value: 10,
  //     },
  //     {
  //         address: '0x3125523...41323',
  //         value: 10,
  //     },
  //     {
  //         address: '0x3125523...41323',
  //         value: 10,
  //     },
  //     {
  //         address: '0x3125523...41323',
  //         value: 10,
  //     },
  //     {
  //         address: '0x3125523...41323',
  //         value: 10,
  //     },
  //     {
  //         address: '0x3125523...41323',
  //         value: 10,
  //     },
  // ]

  const { data, ethUsdPrice } = props;

  const getEthValue = (tvl: number) => {
    if (isNaN(+tvl)) return 0
    const ethValue = +tvl !== 0 && +tvl !== 0 ? tvl / ethUsdPrice : 0
    return formatNumberWithUnit(ethValue)
  }

  return (
    <>
      <div className="px-[1.5rem] py-[0.5rem] flex justify-between text-[#7E7E7E] text-[1rem] leading-[1.5rem]">
        <span>Name</span>
        <span>Staking Value</span>
      </div>

      {data.map((item, index) => (
        <ListItem
          className="px-[1.5rem] py-[1.5rem] flex justify-between text-[0.875rem] font-[700]"
          key={index}
        >
          <span>{showAccount(item.address)}</span>
          <span>{getEthValue(+item.tvl)} ETH</span>
        </ListItem>
      ))}
    </>
  );
}
