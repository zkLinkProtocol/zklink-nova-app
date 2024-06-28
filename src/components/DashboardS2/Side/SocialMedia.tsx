export default ({ isCollapsed = false }) => {
  return (
    <div
      className={`flex justify-center items-center gap-[24px] ${
        isCollapsed ? "flex-col" : ""
      }`}
    >
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
  );
};
