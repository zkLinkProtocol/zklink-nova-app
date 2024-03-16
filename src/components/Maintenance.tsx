import styled from "styled-components";
const maintenanceTips = import.meta.env.VITE_MAINTENANCE_TIPS;

const BgBox = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-image: url("/img/bg-maintenance.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;

  .bg-filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    border-radius: 1rem;
    background: rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(15.800000190734863px);
  }
`;

const TipsBox = styled.div`
  width: 64rem;
  height: 17.46875rem;
  background-image: url("/img/bg-maintenance-tips.png");
  z-index: 2;

  .title {
    color: #03d498;
    text-align: center;
    font-family: Satoshi;
    font-size: 40px;
    font-style: normal;
    font-weight: 700;
    line-height: 32px; /* 80% */
    letter-spacing: -0.5px;
  }
  .desc {
    color: #c6d3dd;
    text-align: center;
    font-family: Satoshi;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 32px; /* 133.333% */
    letter-spacing: -0.5px;
  }
`;

const FooterBox = styled.p`
  position: absolute;
  bottom: 0;
  padding: 1.5rem 0;
  width: 100%;
  text-align: center;
  color: #c6d3dd;
  text-align: center;
  font-family: Satoshi;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 2rem; /* 133.333% */
  letter-spacing: -0.03125rem;
  .link {
    color: #03d498;
    font-family: Satoshi;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 700;
    line-height: 2rem;
    letter-spacing: -0.03125rem;
  }
`;

export default function Maintenance() {
  return (
    <BgBox className="flex items-center justify-center">
      <div className="bg-filter"></div>
      <TipsBox className="flex flex-col items-center justify-center">
        <h4 className="title">We'll be back soon!</h4>
        <p className="desc mt-[1rem]">
          {maintenanceTips || "The website is currently under maintenance."}
        </p>
      </TipsBox>

      <FooterBox>
        Contact us in{" "}
        <a
          href="https://discord.com/invite/zklink"
          target="_blank"
          className="link"
        >
          Discord
        </a>
      </FooterBox>
    </BgBox>
  );
}
