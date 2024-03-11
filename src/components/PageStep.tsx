import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

export type StepType = "PREV" | "NEXT";

interface IPageStepProps {
  isPrevDisabled?: boolean;
  isNextDisabled?: boolean;
  handlePageStep?: (type: StepType) => void;
}

export function PageStep(props: IPageStepProps) {
  const { isPrevDisabled, isNextDisabled, handlePageStep } = props;
  const handle = (type: StepType) => {
    if (!handlePageStep) return;
    handlePageStep(type);
  };

  return (
    <div className="flex justify-between items-center">
      <span
        className={`rounded-full text-[1.5rem] bg-[rgba(0,0,0,0.8)] w-[2.5rem] h-[2.5rem] flex justify-center items-center  ${
          isPrevDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={() => !isPrevDisabled && handle("PREV")}
      >
        <FaArrowLeft />
      </span>
      <span
        className={`rounded-full text-[1.5rem] bg-[rgba(0,0,0,0.8)] w-[2.5rem] h-[2.5rem] flex justify-center items-center  ${
          isNextDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={() => !isNextDisabled && handle("NEXT")}
      >
        <FaArrowRight />
      </span>
    </div>
  );
}
