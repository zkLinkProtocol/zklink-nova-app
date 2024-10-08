import { bindTwitter, getTwitterAccessToken, getUserTvl } from "@/api";
import { RootState } from "@/store";
import { CardBox } from "@/styles/common";
import { getRandomNumber, sleep } from "@/utils";
import { eventBus } from "@/utils/event-bus";
import { Button } from "@nextui-org/react";
import qs from "qs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";

const env = import.meta.env.VITE_ENV;
const twitterClientId = import.meta.env.VITE_TWITTER_CLIENT_ID;
const twitterCallbackURL = import.meta.env.VITE_TWITTER_CALLBACK_URL;

export default ({ binded }: { binded: boolean }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [twitterLoading, setTwitterLoading] = useState(false);
  const { invite } = useSelector((store: RootState) => store.airdrop);
  const getTwitterClientId = () => {
    let clientId = "";

    if (env === "production") {
      const clientIds = twitterClientId.split(",");
      const widgetClientIds = new Array(98).fill(clientIds[0]);
      const randomClientIds = clientIds.concat(widgetClientIds);
      const index = getRandomNumber(0, randomClientIds.length - 1);
      clientId = randomClientIds[index];
    } else {
      clientId = twitterClientId;
    }

    return clientId;
  };

  const handleConnectTwitter = () => {
    setTwitterLoading(true);
    const clientId = getTwitterClientId();
    const params = {
      response_type: "code",
      client_id: clientId,
      redirect_uri: twitterCallbackURL,
      // client_id: "RTUyVmlpTzFjTFhWWVB4b2tyb0k6MTpjaQ",
      // redirect_uri: "http://localhost:3000/aggregation-parade",
      scope:
        "tweet.read%20tweet.write%20like.write%20users.read%20follows.read%20follows.write",
      state: "state",
      code_challenge: "challenge",
      code_challenge_method: "plain",
    };
    const url = new URL(`https://twitter.com/i/oauth2/authorize`);
    url.search = qs.stringify(params, { encode: false });

    window.location.href = url.href;
  };

  const toastTwitterError = (text?: string) => {
    console.error("Could not connect to Twitter. Try again.");
    toast.error(text || "Could not connect to Twitter. Try again.", {
      duration: 3000,
    });
    setTwitterLoading(false);
  };

  const { address } = useAccount();

  const [isBind, setIsBind] = useState(false);

  const bindTwitterFunc = async (code: string) => {
    if (!address) return;
    console.log("twitter auth code", code);
    setTwitterLoading(true);

    const clientId = getTwitterClientId();
    const params = {
      code,
      grant_type: "authorization_code",
      // client_id: "RTUyVmlpTzFjTFhWWVB4b2tyb0k6MTpjaQ",
      // redirect_uri: "http://localhost:3000/aggregation-parade",
      client_id: clientId,
      redirect_uri: twitterCallbackURL,
      code_verifier: "challenge",
    };
    const { access_token } = await getTwitterAccessToken(params);
    console.log(access_token);

    await sleep(5000);

    if (access_token && access_token !== "") {
      try {
        const res = await bindTwitter(address, access_token);
        console.log("bind twitter res", res);
        if (Number(res?.status) === 0) {
          eventBus.emit("getInvite");
          setIsBind(true);
          setTwitterLoading(false);
        } else {
          setTwitterLoading(false);
          toastTwitterError(res.message);
        }
      } catch (error: any) {
        console.log("bind twitter error", error);
        setTwitterLoading(false);
        toastTwitterError(
          error?.message === "twitter has been tied"
            ? "Please try a different Twitter/X account"
            : error?.message
        );
      }
    } else {
      setTwitterLoading(false);
      toastTwitterError();
    }

    setSearchParams("");
  };

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      toastTwitterError();
      setSearchParams("");
      return;
    }

    if (code) {
      bindTwitterFunc(code);
      // setSearchParams("");
    }
  }, [searchParams]);

  const [isSucceed, setIsSucceed] = useState(false);

  const verifyTwitter = async () => {
    if (!address) return;
    setTwitterLoading(true);
    const res = await getUserTvl(address);
    console.log("getUserTvlFunc", res);
    setTwitterLoading(false);

    if (res.result?.binded) {
      setIsSucceed(true);
    } else {
      toast.error(
        <div>
          <p>Verification Failed</p>
          <p>
            Please follow{" "}
            <a
              href="https://twitter.com/zkLinkNova"
              target="_blank"
              className="link-underline"
            >
              @zkLinkNova
            </a>{" "}
            and{" "}
            <a
              href="https://twitter.com/zkLink_Official"
              target="_blank"
              className="link-underline"
            >
              @zkLink_Official
            </a>{" "}
            before verifying.
          </p>
        </div>,
        {
          duration: 3000,
        }
      );
    }
  };

  return (
    <>
      {isSucceed ? (
        <CardBox className="mb-[1.5rem] px-[1.5rem] py-[1.5rem] flex justify-between items-center successed">
          <div className="flex items-center gap-2">
            <img src="/img/icon-twitter.svg" width={20} />
            <span className="text-[1rem] font-[700]">
              Congratulations! your account has been activated now!
            </span>
          </div>
          <img src="/img/icon-right.svg" width={20} className="ml-1" />
        </CardBox>
      ) : (
        <CardBox className="mb-[1.5rem] px-[1.5rem] py-[1.5rem] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/img/icon-twitter.svg" width={20} />
            <span className="text-[1rem] font-[700]">
              Follow{" "}
              <a
                href="https://twitter.com/zkLinkNova"
                target="_blank"
                className="link-underline text-[#03D498]"
              >
                @zkLinkNova
              </a>{" "}
              &{" "}
              <a
                href="https://twitter.com/zkLink_Official"
                target="_blank"
                className="link-underline text-[#03D498]"
              >
                @zkLink_Official
              </a>{" "}
              to fully Activate your account
            </span>
          </div>
          <div className="flex items-center gap-[0.75rem]">
            {isBind || invite?.twitterHandler ? (
              <Button
                className="gradient-btn"
                isLoading={twitterLoading}
                onClick={verifyTwitter}
              >
                Verify Following
              </Button>
            ) : (
              <Button
                className="gradient-btn"
                onClick={handleConnectTwitter}
                isLoading={twitterLoading}
              >
                Connect Twitter/X
              </Button>
            )}
          </div>
        </CardBox>
      )}
    </>
  );
};
