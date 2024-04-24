import { Tooltip } from "react-tooltip";

export function getPointsRewardsTooltips(points: number) {
  const pointsMap: {
    [key: number]: string;
  } = {
    1: "4 hours",
    5: "20 hours",
    10: "~2 days",
    50: "~9 days",
    100: "~17 days",
    200: "~33 days",
    500: "~83 days",
    1000: "~167 days",
  };
  return (
    <p>
      Equivalent to depositing{" "}
      <b className="font-[700] text-[#fff]">
        1 ETH into the Nova Network for {pointsMap[Number(points)]}
      </b>{" "}
      without any additional multiplier.
    </p>
  );
}

export default () => {
  return (
    <>
      {[1, 5, 10, 50, 100, 200, 500, 1000].map((key) => (
        <Tooltip
          key={key}
          id={`points-rewards-tips-${key}`}
          style={{
            fontSize: "14px",
            background: "#666",
            borderRadius: "0.5rem",
            width: "18rem",
          }}
          render={() => getPointsRewardsTooltips(key)}
        />
      ))}
    </>
  );
};
