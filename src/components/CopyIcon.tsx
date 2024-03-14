import { useState } from "react";
import { AiOutlineCopy, AiOutlineCheck } from "react-icons/ai";
import { Tooltip } from "@nextui-org/react";
import { copyText } from "@/utils";
interface IProps {
  text: string;
}
const CopyIcon = (props: IProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const { text } = props;
  return (
    <Tooltip content={isCopied ? "Copied!" : "Copy"} isDismissable={false}>
      <span
        className="cursor-pointer w-[24px] h-[24px] ml-2 text-[1.5rem]"
        onClick={() => {
          copyText(text);
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 3000);
        }}
      >
        {isCopied ? <AiOutlineCheck /> : <AiOutlineCopy />}
      </span>
    </Tooltip>
  );
};
export default CopyIcon;
