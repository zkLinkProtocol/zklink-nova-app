import {
  checkOkx,
  getAccountPoint,
  getBridgePoints,
  getLayerbankNovaPoints,
  getLinkswapNovaPoints,
  getNovaProjectPoints,
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
  const [okxPoints, setOkxPoints] = useState(0);
  const [layerbankNovaPoints, setLayerbankNovaPoints] = useState(0);
  const [linkswapNovaPoints, setLinkswapNovaPoints] = useState(0);

  const [novaSwapNovaPoints, setNovaSwapNovaPoints] = useState(0);
  const [eddyFinanceNovaPoints, setEddyFinanceNovaPoints] = useState(0);

  const getAccountPointFunc = useCallback(async () => {
    if (!address) {
      setNovaPoints(0);
      setReferPoints(0);
      return;
    }
    const { result } = await getAccountPoint(address);
    setNovaPoints(Number(result?.novaPoint) || 0);

    const apiReferPoints = Number(result?.referPoint) || 0;
    setReferPoints(
      !!invite?.triplePoints ? apiReferPoints * 3 : apiReferPoints
    );

    if (result?.novaPoint !== 0) {
      const okx = await checkOkx(address);
      setOkxPoints(okx ? OKX_POINTS : 0);
    }
  }, [address, invite?.triplePoints]);

  const getLayerbankNovaPointsFunc = async () => {
    if (!address) {
      setLayerbankNovaPoints(0);
      return;
    }
    const { data } = await getLayerbankNovaPoints(address);
    if (data && Array.isArray(data) && data.length > 0) {
      const points = data.reduce((prev, item) => prev + item.realPoints, 0);
      setLayerbankNovaPoints(points);
    }
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

  const trademarkPoints = useMemo(() => {
    const points = Number(invite?.points) || 0;
    return address ? points : 0;
  }, [invite?.points]);

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
    getNovaSwapNovaPointsFunc(), getEddyFinanceNovaPointsFunc();
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

  const dAppNovaPoints: number = useMemo(() => {
    return (
      layerbankNovaPoints +
      linkswapNovaPoints +
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
      eddyFinanceNovaPoints
    );
  }, [
    layerbankNovaPoints,
    linkswapNovaPoints,
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
  ]);

  useEffect(() => {
    getAllNovaPoints();
  }, [address]);

  const totalNovaPoints = useMemo(() => {
    const points =
      novaPoints +
      referPoints +
      trademarkPoints +
      okxPoints +
      kolPoints +
      dAppNovaPoints;

    return points;
  }, [
    novaPoints,
    referPoints,
    trademarkPoints,
    okxPoints,
    kolPoints,
    dAppNovaPoints,
  ]);

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
    trademarkPoints,
    okxPoints,
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
    getAllNovaPoints,
  };
};
