import { useTranslation } from "react-i18next";
import { Tooltip } from "react-tooltip";

export function getPointsRewardsTooltips(points: number) {
  const { t } = useTranslation();
  const pointsMap: {
    [key: number]: string;
  } = {
    1: `4 ${t("dashboard.hours")}`,
    5: `20 ${t("dashboard.hours")}`,
    10: `~1 ${t("dashboard.day")}`,
    50: `~3 ${t("dashboard.days")}`,
    100: `~17 ${t("dashboard.days")}`,
    200: `~33 ${t("dashboard.days")}`,
    500: `~83 ${t("dashboard.days")}`,
    1000: `~167 ${t("dashboard.days")}`,
  };

  return (
    <p>
      {t("dashboard.invite_box_points_tooltip", {
        num: pointsMap[Number(points)],
      })}
      .
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
