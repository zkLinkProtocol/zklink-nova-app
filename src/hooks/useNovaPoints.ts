import {
  checkOkx,
  getAccountPoint,
  getBridgePoints,
  getLayerbankNovaPoints,
  getLinkswapNovaPoints,
  getNovaProjectPoints,
  getPointsDetail,
} from "@/api";
import { RootState } from "@/store";
import Decimal from "decimal.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useAccount } from "wagmi";

export const OKX_POINTS = 5;

export default () => {
  const { address } = useAccount();
  const { invite } = useSelector((store: RootState) => store.airdrop);

  const [novaPoints, setNovaPoints] = useState(0);
  const [referPoints, setReferPoints] = useState(0);
  const [layerbankNovaPoints, setLayerbankNovaPoints] = useState(0);
  const [linkswapNovaPoints, setLinkswapNovaPoints] = useState(0);

  const [novaSwapNovaPoints, setNovaSwapNovaPoints] = useState(0);
  const [eddyFinanceNovaPoints, setEddyFinanceNovaPoints] = useState(0);

  const [pointsDetail, setPointsDetail] = useState({
    refPoints: 0,
    boostPoints: 0,
    okxCampaignPoints: 0,
  });

  const getPointsDetailFunc = async () => {
    if (!address) return;
    const { result } = await getPointsDetail();
    // console.log("getPointsDetail", res);
    if (result) {
      setPointsDetail({
        refPoints: Number(result?.refPoints) || 0,
        boostPoints: Number(result?.boostPoints) || 0,
        okxCampaignPoints: Number(result?.okxCampaignPoints) || 0,
      });
    }

    setReferPoints(Number(result?.refPoints) || 0);
  };

  const getAccountPointFunc = useCallback(async () => {
    if (!address) {
      setNovaPoints(0);
      return;
    }
    const { result } = await getAccountPoint(address);
    setNovaPoints(Number(result?.novaPoint) || 0);
  }, [address]);

  const getLayerbankNovaPointsFunc = async () => {
    if (!address) {
      setLayerbankNovaPoints(0);
      return;
    }
    const { data } = await getNovaProjectPoints(address, "layerbank");
    const points = data.reduce((prev, item) => prev + Number(item.points), 0);
    setLayerbankNovaPoints(points);
  };

  const getLinkswapNovaPointsFunc = async () => {
    if (!address) {
      setLinkswapNovaPoints(0);
      return;
    }
    const { data } = await getLinkswapNovaPoints(address);
    if (data?.pairs && Array.isArray(data.pairs) && data.pairs.length > 0) {
      const points = data.pairs.reduce(
        (prev, item) => prev + Number(item.novaPoint),
        0
      );
      setLinkswapNovaPoints(points);
    }
  };

  const otherNovaPoints = useMemo(() => {
    const points =
      (Number(invite?.points) || 0) +
      pointsDetail.okxCampaignPoints +
      pointsDetail.boostPoints;

    return address ? points : 0;
  }, [invite?.points, pointsDetail]);

  const kolPoints = useMemo(() => {
    const points =
      novaPoints !== 0 && invite?.kolGroup
        ? Decimal.mul(novaPoints, 0.05).toNumber()
        : 0;
    return address ? points : 0;
  }, [novaPoints, invite?.kolGroup]);

  const getAllNovaPoints = () => {
    getAccountPointFunc();
    getLayerbankNovaPointsFunc();
    getLinkswapNovaPointsFunc();
    getAquaNovaPointsFunc();
    getIzumiNovaPointsFunc();
    getSymbiosisNovaPointsFunc();
    getOrbiterNovaPointsFunc();
    getMesonNovaPointsFunc();
    // getOwltoNovaPointsFunc();
    getSymbiosisBridgePointsFunc();
    getOrbiterBridgePointsFunc();
    getMesonisBridgePointsFunc();
    getOwltoBridgePointsFunc();
    getInterportNovaPointsFunc();
    getAllsparkNovaPointsFunc();
    getLogxNovaPointsFunc();
    getNovaSwapNovaPointsFunc();
    getEddyFinanceNovaPointsFunc();
    getPointsDetailFunc();
    getRubicNovaPointsFunc();
    getZkdxNovaPointsFunc();
    getWagmiNovaPointsFunc();
    getShoebillNovaPointsFunc();
  };

  const [rubicNovaPoints, setRubicNovaPoints] = useState(0);
  const getRubicNovaPointsFunc = async () => {
    if (!address) return;
    const { data } = await getNovaProjectPoints(address, "rubic");

    const points = data.reduce((prev, item) => prev + Number(item.points), 0);
    setRubicNovaPoints(points);
  };

  const [aquaNovaPoints, setAquaNovaPoints] = useState(0);
  const getAquaNovaPointsFunc = async () => {
    if (!address) return;
    const { data } = await getNovaProjectPoints(address, "aqua");

    const points = data.reduce((prev, item) => prev + Number(item.points), 0);
    setAquaNovaPoints(points);
  };

  const [izumiNovaPoints, setIzumiNovaPoints] = useState(0);
  const getIzumiNovaPointsFunc = async () => {
    if (!address) return;
    const { data } = await getNovaProjectPoints(address, "izumi");

    const points = data.reduce((prev, item) => prev + Number(item.points), 0);
    setIzumiNovaPoints(points);
  };

  const [symbiosisNovaPoints, setSymbiosisNovaPoints] = useState(0);
  const getSymbiosisNovaPointsFunc = async () => {
    if (!address) return;
    const { data } = await getNovaProjectPoints(address, "symbiosis");

    const points = data.reduce((prev, item) => prev + Number(item.points), 0);
    setSymbiosisNovaPoints(points);
  };

  const [orbiterNovaPoints, setOrbiterNovaPoints] = useState(0);
  const getOrbiterNovaPointsFunc = async () => {
    if (!address) return;
    const { data } = await getNovaProjectPoints(address, "orbiter");

    const points = data.reduce((prev, item) => prev + Number(item.points), 0);
    setOrbiterNovaPoints(points);
  };

  const [interportNovaPoints, setInterportNovaPoints] = useState(0);
  const getInterportNovaPointsFunc = async () => {
    if (!address) return;
    const { data } = await getNovaProjectPoints(address, "interport");

    const points = data.reduce((prev, item) => prev + Number(item.points), 0);
    setInterportNovaPoints(points);
  };

  const [mesonNovaPoints, setMesonNovaPoints] = useState(0);
  const getMesonNovaPointsFunc = async () => {
    if (!address) return;
    const { data } = await getNovaProjectPoints(address, "meson");

    const points = data.reduce((prev, item) => prev + Number(item.points), 0);
    setMesonNovaPoints(points);
  };

  const [owltoNovaPoints, setOwltoNovaPoints] = useState(0);
  const getOwltoNovaPointsFunc = async () => {
    if (!address) return;
    const { data } = await getNovaProjectPoints(address, "owlet");

    const points = data.reduce((prev, item) => prev + Number(item.points), 0);
    setOwltoNovaPoints(points);
  };

  const [allsparkNovaPoints, setAllsparkNovaPoints] = useState(0);
  const getAllsparkNovaPointsFunc = async () => {
    if (!address) return;
    const { data } = await getNovaProjectPoints(address, "allspark");

    const points = data.reduce((prev, item) => prev + Number(item.points), 0);
    setAllsparkNovaPoints(points);
  };
  const [logxNovaPoints, setLogxNovaPoints] = useState(0);
  const getLogxNovaPointsFunc = async () => {
    if (!address) return;
    const { data } = await getNovaProjectPoints(address, "logx");

    const points = data.reduce((prev, item) => prev + Number(item.points), 0);
    setLogxNovaPoints(points);
  };

  const getNovaSwapNovaPointsFunc = async () => {
    if (!address) return;
    const { data } = await getNovaProjectPoints(address, "novaswap");

    const points = data.reduce((prev, item) => prev + Number(item.points), 0);
    setNovaSwapNovaPoints(points);
  };

  const getEddyFinanceNovaPointsFunc = async () => {
    if (!address) return;
    const { data } = await getNovaProjectPoints(address, "eddy");

    const points = data.reduce((prev, item) => prev + Number(item.points), 0);
    setEddyFinanceNovaPoints(points);
  };

  const [zkdxNovaPoints, setZkdxNovaPoints] = useState(0);
  const getZkdxNovaPointsFunc = async () => {
    if (!address) return;
    const { data } = await getNovaProjectPoints(address, "zkdx");

    const points = data.reduce((prev, item) => prev + Number(item.points), 0);
    setZkdxNovaPoints(points);
  };

  const [wagmiNovaPoints, setWagmiNovaPoints] = useState(0);
  const getWagmiNovaPointsFunc = async () => {
    if (!address) return;
    const { data } = await getNovaProjectPoints(address, "zkdx");

    const points = data.reduce((prev, item) => prev + Number(item.points), 0);
    setWagmiNovaPoints(points);
  };

  const [shoebillNovaPoints, setShoebillNovaPoints] = useState(0);
  const getShoebillNovaPointsFunc = async () => {
    if (!address) return;
    const { data } = await getNovaProjectPoints(address, "zkdx");

    const points = data.reduce((prev, item) => prev + Number(item.points), 0);
    setShoebillNovaPoints(points);
  };

  const dAppNovaPoints: number = useMemo(() => {
    return (
      layerbankNovaPoints +
      // linkswapNovaPoints +
      aquaNovaPoints +
      izumiNovaPoints +
      symbiosisNovaPoints +
      mesonNovaPoints +
      // owltoNovaPoints +
      orbiterNovaPoints +
      interportNovaPoints +
      allsparkNovaPoints +
      logxNovaPoints +
      novaSwapNovaPoints +
      eddyFinanceNovaPoints +
      zkdxNovaPoints +
      wagmiNovaPoints +
      shoebillNovaPoints
    );
  }, [
    layerbankNovaPoints,
    // linkswapNovaPoints,
    aquaNovaPoints,
    izumiNovaPoints,
    symbiosisNovaPoints,
    mesonNovaPoints,
    orbiterNovaPoints,
    interportNovaPoints,
    allsparkNovaPoints,
    logxNovaPoints,
    novaSwapNovaPoints,
    eddyFinanceNovaPoints,
    zkdxNovaPoints,
    wagmiNovaPoints,
    shoebillNovaPoints,
  ]);

  useEffect(() => {
    getAllNovaPoints();
  }, [address]);

  const totalNovaPoints = useMemo(() => {
    const points =
      novaPoints + referPoints + otherNovaPoints + kolPoints + dAppNovaPoints;

    return points;
  }, [novaPoints, referPoints, otherNovaPoints, kolPoints, dAppNovaPoints]);

  const [symbiosisBridgeNovaPoints, setSymbiosisBridgeNovaPoints] = useState(0);
  const getSymbiosisBridgePointsFunc = async () => {
    if (!address) return;
    const { data } = await getBridgePoints("symbiosisy");

    setSymbiosisBridgeNovaPoints(Number(data) || 0);
  };

  const [orbiterBridgeNovaPoints, setOrbiterBridgeNovaPoints] = useState(0);
  const getOrbiterBridgePointsFunc = async () => {
    if (!address) return;
    const { data } = await getBridgePoints("orbiter");

    setOrbiterBridgeNovaPoints(Number(data) || 0);
  };

  const [mesonBridgeNovaPoints, setMesonBridgeNovaPoints] = useState(0);
  const getMesonisBridgePointsFunc = async () => {
    if (!address) return;
    const { data } = await getBridgePoints("meson");

    setMesonBridgeNovaPoints(Number(data) || 0);
  };

  const [owltoBridgeNovaPoints, setOwltoBridgeNovaPoints] = useState(0);
  const getOwltoBridgePointsFunc = async () => {
    if (!address) return;
    const { data } = await getBridgePoints("owlto");

    setOwltoBridgeNovaPoints(Number(data) || 0);
  };

  return {
    novaPoints,
    referPoints,
    layerbankNovaPoints,
    linkswapNovaPoints,
    otherNovaPoints,
    kolPoints,
    totalNovaPoints,
    izumiNovaPoints,
    aquaNovaPoints,
    symbiosisNovaPoints,
    orbiterNovaPoints,
    mesonNovaPoints,
    owltoNovaPoints,
    dAppNovaPoints,
    symbiosisBridgeNovaPoints,
    mesonBridgeNovaPoints,
    owltoBridgeNovaPoints,
    orbiterBridgeNovaPoints,
    interportNovaPoints,
    allsparkNovaPoints,
    logxNovaPoints,
    pointsDetail,
    getAllNovaPoints,
    novaSwapNovaPoints,
    eddyFinanceNovaPoints,
    rubicNovaPoints,
    zkdxNovaPoints,
    wagmiNovaPoints,
    shoebillNovaPoints,
  };
};
