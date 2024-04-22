import { getTwitterAccessToken } from "@/api";
import { RootState } from "@/store";
import { CardBox } from "@/styles/common";
import { getRandomNumber } from "@/utils";
import { Button } from "@nextui-org/react";
import qs from "qs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const env = import.meta.env.VITE_ENV;
const twitterClientId = import.meta.env.VITE_TWITTER_CLIENT_ID;
const twitterCallbackURL = import.meta.env.VITE_TWITTER_CALLBACK_URL;

export default () => {
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

  const bindTwitter = async (code: string) => {
    setTwitterLoading(true);

    //TODO: Send twitter auth code to backend
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
      bindTwitter(code);
      setSearchParams("");
    }
  }, [searchParams]);

  return !!invite?.twitterHandler ? (
    <CardBox className="px-[1.5rem] py-[1.5rem] flex justify-between items-center successed">
      <div className="flex items-center gap-2">
        <img src="/img/icon-twitter.svg" width={20} />
        <span className="text-[1rem] font-[700]">
          Congratulations! your account has been activated now!
        </span>
      </div>
      <img src="/img/icon-right.svg" width={20} />
    </CardBox>
  ) : (
    <CardBox className="px-[1.5rem] py-[1.5rem] flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img src="/img/icon-twitter.svg" width={20} />
        <span className="text-[1rem] font-[700]">
          Follow @zkLinkNova & @zkLink_Official to fully Activate your account
        </span>
      </div>
      <div className="flex items-center gap-[0.75rem]">
        <Button
          className="gradient-btn"
          onClick={handleConnectTwitter}
          isLoading={twitterLoading}
        >
          Follow
        </Button>
        <Button className="gradient-btn">Verify</Button>
      </div>
    </CardBox>
  );
};
