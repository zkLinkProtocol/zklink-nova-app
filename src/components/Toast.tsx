import { Toaster } from "react-hot-toast";

export default function Toast() {
  return (
    <Toaster
      position="top-right"
      containerClassName="my-toast"
      toastOptions={{
        error: {
          icon: (
            <img
              src="/img/icon-error.svg"
              className="w-[1.12513rem] h-[1.12513rem]"
            />
          ),
          style: {
            maxWidth: "100%",
            whiteSpace: "nowrap",
            padding: "1rem 2.5rem",
            color: "#E5351D",
            fontFamily: "Satoshi",
            fontSize: "1rem",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "1.5rem",
            borderRadius: "0.5rem",
            background: "#41231D",
            gap: "0.75rem",
          },
        },
        success: {
          icon: (
            <img
              src="/img/icon-done.svg"
              className="w-[1.12513rem] h-[1.12513rem]"
            />
          ),
          style: {
            maxWidth: "100%",
            whiteSpace: "nowrap",
            padding: "1rem 1.5rem",
            color: "#03D498",
            fontFamily: "Satoshi",
            fontSize: "1rem",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "1.5rem",
            borderRadius: "0.5rem",
            background: "#1D4138",
            gap: "0.75rem",
          },
        },
      }}
      containerStyle={{
        top: "8rem",
        right: "3rem",
      }}
    />
  );
}
