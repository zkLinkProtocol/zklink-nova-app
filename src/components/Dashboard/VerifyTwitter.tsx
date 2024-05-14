import { bindTwitter, getTwitterAccessToken } from "@/api";
import { RootState } from "@/store";
import { CardBox } from "@/styles/common";
import { getRandomNumber } from "@/utils";
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
    try {
      const { access_token } = await getTwitterAccessToken(params);
      console.log(access_token);

      if (access_token && access_token !== "") {
        fetch("/twitter/2/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        })
          .then(async (result: any) => {
            let { data } = await result.json();
            console.log("twitter data", data);

            const res = await bindTwitter(address, access_token);
            console.log("bindTwitter", res);
            if (Number(res?.status) !== 0) {
              toastTwitterError(res.message);
              return;
            }

            eventBus.emit("getInvite");
            eventBus.emit("updateUserTvl");
          })
          .catch(() => {
            toastTwitterError();
          });
      } else {
        toastTwitterError();
      }
    } catch (error: any) {
      console.error(error);
      toastTwitterError();
    } finally {
      setSearchParams("");
      setTwitterLoading(false);
    }
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

  return binded ? (
    <CardBox className="px-[1.5rem] py-[1.5rem] flex justify-between items-center successed">
      <div className="flex items-center gap-2">
        <img src="/img/icon-twitter.svg" width={20} />
        <span className="text-[1rem] font-[700]">
          Congratulations! your account has been activated now!
        </span>
      </div>
      <img src="/img/icon-right.svg" width={20} className="ml-1" />
    </CardBox>
  ) : (
    <CardBox className="px-[1.5rem] py-[1.5rem] flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img src="/img/icon-twitter.svg" width={20} />
        <span className="text-[1rem] font-[700]">
          Follow <a href="https://twitter.com/zkLinkNova">@zkLinkNova</a> &{" "}
          <a href="https://twitter.com/zkLink_Official">@zkLink_Official</a> to
          fully Activate your account
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
        <Button
          className="gradient-btn"
          onClick={() => {
            eventBus.emit("getInvite");
            eventBus.emit("updateUserTvl");
          }}
        >
          Verify
        </Button>
      </div>
    </CardBox>
  );
};
