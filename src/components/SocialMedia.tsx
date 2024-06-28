import { BlurBox } from "@/styles/common";

export default function SocialMedia() {
  return (
    <BlurBox className="px-[26px] py-[12px] flex items-center gap-[1.25rem]">
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
    </BlurBox>
  );
}
