import { useReCaptchaStore } from "@/hooks/useReCaptchaStore";
import { useEffect, useState } from "react";

interface GoogleRecaptchaProps {
  onSuccess?: () => void;
}

export default function GoogleRecaptcha({ onSuccess }: GoogleRecaptchaProps) {
  const [grecaptchaId, setGrecaptchaId] = useState<any>(null);
  const [isRecaptchaLoad, setIsRecaptchaLoad] = useState(true);

  const { setReCaptchaTs, setReCaptchaValue } = useReCaptchaStore();

  const onChange = (value: string) => {
    console.log("Captcha value:", value);
    const ts = Date.now();
    setReCaptchaValue(value);
    setReCaptchaTs(ts);
    onSuccess?.();
  };

  useEffect(() => {
    setTimeout(() => {
      const grecaptcha = (window as any)?.grecaptcha?.render("robot", {
        sitekey: "6LcfgBYqAAAAAMWveYEvnQQFNg33AU71GBj60Rwl",
        theme: "light",
        size: "normal",
        callback: onChange,
      });
      // console.log('grecaptcha', grecaptcha)
      setGrecaptchaId(grecaptcha);
      if (!grecaptcha && grecaptcha !== 0) {
        setIsRecaptchaLoad(false);
      } else {
        setIsRecaptchaLoad(true);
      }
    }, 1000);
  }, []);
  return (
    <div className="min-w-[304px] min-h-[78px] bg-[#fff] flex justify-center items-center">
      <div id="robot"></div>
      {!isRecaptchaLoad && (
        <div className="text-[#000] text-[16px]">
          Due to your internet cannot access Google reCAPTCHA service, we can't
          verify if you're human or bot. Please check your internet setting.
        </div>
      )}
    </div>
  );
}
