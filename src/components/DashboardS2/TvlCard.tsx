import styled from "styled-components";

export interface TvlItem {
  title: string;
  name: string;
  currentTvl: string;
  targetTvl: string;
  nextMilestone: string;
  progress: string;
}

const Conatainer = styled.div`
  padding: 24px;
  /* max-width: 424px; */
  height: 200px;
  background: #011a24;
  flex-basis: calc(33.333% - 16px);
  cursor: pointer;

  &.active {
    background: #2e4542;
  }

  .title {
    color: #fff;
    text-align: center;
    font-family: "Chakra Petch";
    font-size: 32px;
    font-style: normal;
    font-weight: 700;
    line-height: 32px; /* 100% */
    letter-spacing: -0.5px;
  }
  .name {
    color: #999;
    text-align: center;
    font-family: "Chakra Petch";
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 100% */
    letter-spacing: -0.5px;
  }
  .label {
    color: #999;
    font-family: "Chakra Petch";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 12px; /* 100% */
    letter-spacing: -0.5px;
  }
  .value {
    color: #fff;
    font-family: "Chakra Petch";
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 100% */
    letter-spacing: -0.5px;
    .text-green {
      color: #0bc48f;
    }
  }
`;

const ProgressBar = styled.div`
  position: relative;
  width: 100%;
  height: 16px;
  border-radius: 16px;
  background: #043f38;
  overflow: hidden;

  .progress-inner {
    max-width: 100%;
    height: 16px;
    background: #0bc48f;
    color: #011a24;
    text-align: center;
    font-family: "Chakra Petch";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px; /* 100% */
    letter-spacing: -0.5px;
  }
`;

export default function TvlCard(props: {
  data: TvlItem;
  tabActive?: string;
  handleClick: (type: string | undefined) => void;
}) {
  const { title, name, currentTvl, targetTvl, nextMilestone, progress } =
    props.data;
  const { handleClick, tabActive } = props;

  return (
    <Conatainer
      onClick={() =>
        handleClick(tabActive && tabActive === name ? undefined : name)
      }
      className={tabActive && tabActive === name ? "active" : ""}
    >
      <div className="title">{title}</div>
      <div className="name mt-[12px]">{name}</div>

      <div className="mt-[24px] flex justify-between">
        <div>
          <div className="label mb-[4px]">Current TVL/Target TVL</div>
          <div className="value">
            {currentTvl}/{targetTvl}
          </div>
        </div>
        <div className="text-right">
          <div className="label mb-[4px]">Next Milestone</div>
          <div className="value text-green">{nextMilestone}</div>
        </div>
      </div>
      <ProgressBar className="mt-[8px]">
        <div
          className="progress-inner"
          style={{
            width: progress,
          }}
        >
          {progress === "100%" ? "Maximum" : ""}
        </div>
      </ProgressBar>
    </Conatainer>
  );
}

// export default function TvlList(props: {
//   tvlList: TvlItem[];
//   handleClick: (type: string) => void;
// }) {
//   const { tvlList } = props;

//   return (
//     <div className="mt-[40px] flex flex-wrap gap-[24px]">
//       {tvlList.map((tvlItem, index) => (
//         <TvlItem {...tvlItem} key={index}  />
//       ))}
//     </div>
//   );
// }
