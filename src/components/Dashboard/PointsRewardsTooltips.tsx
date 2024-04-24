import { Tooltip } from "react-tooltip";

export default () => {
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
    <>
      {Object.keys(pointsMap).map((key) => (
        <Tooltip
          key={key}
          id={`points-rewards-tips-${key}`}
          style={{
            fontSize: "14px",
            background: "#666",
            borderRadius: "0.5rem",
            width: "18rem",
          }}
          content={`Equivalent to depositing 1 ETH into the Nova Network for ${
            pointsMap[Number(key)]
          } without any additional multiplier.`}
        />
      ))}
    </>
  );
};
