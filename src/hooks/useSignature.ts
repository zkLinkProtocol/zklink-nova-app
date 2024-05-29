import { authLogin } from "@/api";
import { SIGN_MESSAGE } from "@/constants/sign";
import { RootState } from "@/store";
import {
  setApiToken,
  setSignature,
  setSignatureAddress,
} from "@/store/modules/airdrop";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";

export default () => {
  const { signMessage } = useSignMessage();
  const { address } = useAccount();
  const dispatch = useDispatch();

  const { signature } = useSelector((store: RootState) => store.airdrop);

  const { connectors, disconnect } = useDisconnect();

  const onDisconnect = async () => {
    if (disconnect || address) {
      for (const connector of connectors) {
        //maybe multi connectors. disconnct all.
        await disconnect({ connector });
      }
      await disconnect();
    }
  };

  const handleSign = async () => {
    console.log("handleSign =====______________________=====");
    if (!address || signature) return;
    await signMessage(
      {
        message: SIGN_MESSAGE,
      },
      {
        onSuccess(data, _variables, _context) {
          console.log(data);
          dispatch(setSignature(data));
          dispatch(setSignatureAddress(address));
        },
        onError(error, variables, context) {
          console.error(error, variables, context);
          onDisconnect();
        },
      }
    );
  };

  return {
    handleSign,
  };
};
