import { useState } from "react";
import { AiOutlineCopy } from "react-icons/ai";
import {
  Tooltip,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { copyText } from "@/utils";
interface IProps {
  text: string;
}
const CopyIcon = (props: IProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { text } = props;
  return (
    <Popover placement="top" isOpen={isOpen}>
      <PopoverTrigger>
        <Tooltip content={isCopied ? "Copied!" : "Copy"} isDismissable={false}>
          <span>
            <AiOutlineCopy
              className="cursor-pointer w-4 h-4 ml-2"
              onClick={() => {
                copyText(text);
                setIsCopied(true);
                setTimeout(() => {
                  setIsCopied(false);
                  setIsOpen(false);
                }, 5000);
              }}
            />
          </span>
        </Tooltip>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-small font-bold">Popover Content</div>
          <div className="text-tiny">This is the popover content</div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default CopyIcon;
