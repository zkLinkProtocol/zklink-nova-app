import { useState } from "react";
import { useTranslation } from "react-i18next";
function TestI18n() {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const handleChangeLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "zh" : "en";
    setCurrentLanguage(newLanguage);
    changeLanguage(newLanguage);
  };
  return (
    <div className="App pt-[100px]">
      <h1>
        Our Translated Header:
        {t("hello_world")}
      </h1>
      <h3>Current Language: {currentLanguage}</h3>
      <button type="button" onClick={handleChangeLanguage}>
        Change Language
      </button>
    </div>
  );
}
export default TestI18n;
