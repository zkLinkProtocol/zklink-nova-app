import { GradientButton } from "@/styles/common";
import styled from "styled-components";

const Container = styled.div`
  border: 1px solid transparent;
  border-radius: 24px;
  position: relative;
  background-color: #09161C;
  background-clip: padding-box; /*important*/
  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: -1;
    margin: -1px;
    border-radius: inherit; /*important*/
    background: linear-gradient(90deg, #48ecae 0%, #3E52FC 52.9%, #49cdd7 100%);
  }
`;

export default function MysteryBoxIII() {
  return (
    <>
      <Container className="mb-[32px] px-[24px] py-[16px] flex justify-between items-center">
        <img
          src="/img/img-mystery-box-v2.png"
          alt=""
          width={56}
          height={56}
          className="rounded-[12px]"
        />
        <div className="text-[18px] font-[700] leading-[26px]">
          <p>Mystery Box III</p>
          <p className="mt-[4px]">x1</p>
        </div>
        <div>
          <GradientButton className="px-[56px] py-[15px]">Open</GradientButton>
        </div>
      </Container>
    </>
  );
}
