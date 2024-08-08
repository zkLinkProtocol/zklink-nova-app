import styled from "styled-components";

const Container = styled.div`
  color: var(--Neutral-2, rgba(251, 251, 251, 0.6));
  font-family: Satoshi;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 130%; /* 20.8px */

  position: relative;
  border-radius: var(--border-radius);
  --border-width: 1px;
  --border-radius: 76px;
  --border-color: linear-gradient(
    rgba(255, 255, 255, 1) 10%,
    rgba(255, 255, 255, 0.01)
  );
  background: linear-gradient(
    rgba(255, 255, 255, 0.1) 10%,
    rgba(255, 255, 255, 0.001)
  );

  @media screen and (max-width: 768px) {
    width: 100%;
    padding: 28px 26px 20px;
    border-radius: var(--border-radius);
    --border-width: 1px;
    --border-radius: 24px 24px 0 0;
    --border-color: linear-gradient(
      rgba(255, 255, 255, 1) 10%,
      rgba(255, 255, 255, 0.01)
    );
    background: linear-gradient(
      rgba(255, 255, 255, 0.1) 10%,
      rgba(255, 255, 255, 0.001)
    );
  }

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: var(--border-width);
    border-radius: var(--border-radius);
    background: var(--border-color);
    --mask-bg: linear-gradient(#000, #000);
    --mask-clip: content-box, padding-box;
    -webkit-mask-image: var(--mask-bg), var(--mask-bg);
    -webkit-mask-clip: var(--mask-clip);
    -webkit-mask-composite: destination-out;
  }
`;

export default function SocialMedia() {
  return (
    <Container className="outer px-[26px] py-[12px] flex flex-col md:flex-row items-center gap-[18px]">
      <span>Be sure to follow us here</span>

      <div className="flex items-center gap-[18px]">
        <a href="https://blog.zk.link/" target="_blank">
          <img src="/img/icon-medium.svg" className="w-[32px] h-[32px]" />
        </a>
        <a href="https://discord.com/invite/zklink" target="_blank">
          <img src="/img/icon-dc.svg" className="w-[32px] h-[32px]" />
        </a>
        <a href="https://t.me/zkLinkorg">
          <img src="/img/icon-tg.svg" className="w-[32px] h-[32px]" />
        </a>
        <a href="https://twitter.com/zkLink_Official" target="_blank">
          <img src="/img/icon-twitter.svg" className="w-[24px] h-[24px]" />
        </a>
        <a href="https://github.com/zkLinkProtocol" target="_blank">
          <img src="/img/icon-github.svg" className="w-[32px] h-[32px]" />
        </a>
      </div>
    </Container>
  );
}
