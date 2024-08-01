import NovaNetworkTVL from "@/components/NovaNetworkTVL";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import ReactHtmlParser from "react-html-parser";

const Container = styled.div`
  position: relative;
  padding-top: 92px;
  min-height: 100vh;
  /* max-height: 3266px; */
  overflow: auto;
  background-image: url("/img/s2/bg-s2-about.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top center;
`;

const Title = styled.h1`
  color: #fff;
  text-align: center;
  font-family: Satoshi;
  font-size: 56px;
  font-style: normal;
  font-weight: 900;
  line-height: 70px; /* 125% */
  letter-spacing: -0.168px;
`;

const CardBox = styled.div`
  padding: 24px 30px;
  border-radius: 24px;
  border: 2px solid #635f5f;
  background: #151923;

  &.gradient-border {
    filter: blur(0.125px);
    border: 4px solid transparent;
    background-clip: padding-box, border-box;
    background-origin: padding-box, border-box;
    background-image: linear-gradient(to bottom, #282828, #000000),
      linear-gradient(
        175deg,
        #fb2450,
        #fbc82e,
        #6eee3f,
        #5889f3,
        #5095f1,
        #b10af4 80%
      );
  }

  .card-title {
    color: var(--White, #fff);
    font-family: Satoshi;
    font-size: 22px;
    font-style: normal;
    font-weight: 700;
    line-height: 46px; /* 209.091% */
    letter-spacing: -0.066px;
  }

  .paragraph {
    color: var(--Neutral-2, rgba(251, 251, 251, 0.6));
    font-family: Satoshi;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 26px;

    &.text-green,
    .text-green,
    .title {
      color: #03d498;
      font-weight: 900;
    }

    .before:before {
      content: "•";
      margin-right: 5px;
    }

    table {
      .tr {
        /* width: 80%; */
        display: flex;
        justify-content: space-around;
        height: 60px;
        background: rgba(0, 0, 0, 0.4);
      }
      .th {
        background: linear-gradient(
          90deg,
          #49eaae 0%,
          #3f54fb 50%,
          #4aced7 100%
        );
        border-radius: 10px 10px 0 0;
      }
      .td {
        /* min-width: 150px; */
        width: 50%;
        color: #fff;
        text-align: center;
        font-family: Satoshi;
        font-size: 18px;
        font-style: normal;
        font-weight: 900;
        line-height: 24px; /* 133.333% */
        letter-spacing: -0.5px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
`;

const Underline = styled.div`
  width: 100%;
  height: 0.8px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(251, 251, 251, 0.6) 51.5%,
    rgba(255, 255, 255, 0) 100%
  );
`;

const GreenCard = styled.div`
  height: 79px;
  border-radius: 14px;
  border: 0.6px solid rgba(255, 255, 255, 0.2);
  background: var(--Green, #03d498);
  backdrop-filter: blur(30px);
  color: #030d19;
  font-family: Satoshi;
  font-size: 26px;
  font-style: normal;
  font-weight: 700;
  line-height: 79px;
  letter-spacing: -0.078px;
  text-align: center;
`;

const CollapseCard = ({
  question,
  answer,
  isOpened,
  isGradientBorder,
}: {
  question: string | JSX.Element;
  answer: string | JSX.Element;
  isOpened?: boolean;
  isGradientBorder?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState<Boolean>(Boolean(isOpened) || false);
  const { t } = useTranslation();

  return (
    <CardBox
      className={`flex flex-col gap-[30px] ${
        isGradientBorder ? "gradient-border" : ""
      }`}
    >
      <div
        className="card-title flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        {isOpen ? (
          <img
            src="/img/s2/about-arrow-up.svg"
            alt=""
            className="w-[32px] h-[32px]"
          />
        ) : (
          <img
            src="/img/s2/about-arrow-down.svg"
            alt=""
            className="w-[32px] h-[32px]"
          />
        )}
      </div>
      {isOpen && (
        <>
          <Underline />
          {answer}
        </>
      )}
    </CardBox>
  );
};

export default function About() {
  const { t } = useTranslation();
  const rawHtmlString = t("about.intro_desc7", {
    campaign_portal: "campaign portal",
  }).replace(
    "campaign portal",
    `<a href="https://app.zklink.io/" class="text-green" target="_blank">${t(
      "about.campaign_portal"
    )}</a>`
  );

  const list = [
    {
      question: t("about.intro"),
      answer: (
        <>
          <div className="paragraph">{t("about.intro_desc1")}</div>

          <div className="paragraph">{t("about.intro_desc2")}</div>
          <div className="paragraph">
            <p className="title">{t("about.intro_desc3")}</p>
            <div>
              <ul>
                <li className="before">{t("about.intro_desc4")}</li>
                <li className="before">{t("about.intro_desc5")}</li>
              </ul>
            </div>
          </div>
          <div className="paragraph">{t("about.intro_desc6")}</div>
          <div className="paragraph">{ReactHtmlParser(rawHtmlString)}</div>

          <div>
            <img src="/img/about-1.png" alt="" className="block w-full" />
          </div>
        </>
      ),
      isOpened: true,
      isGradientBorder: true,
    },
    {
      question: t("about.q1"),
      answer: (
        <>
          <div className="paragraph">{t("about.a1")}</div>
        </>
      ),
    },
    {
      question: t("about.q2"),
      answer: (
        <>
          <div className="paragraph">{t("about.a2")}</div>
        </>
      ),
    },
    {
      question: t("about.q3"),
      answer: (
        <>
          <div className="paragraph">{t("about.a3")}</div>
        </>
      ),
    },
    {
      question: t("about.q4"),
      answer: (
        <>
          <div className="paragraph">{t("about.a4")}</div>
        </>
      ),
    },
    {
      question: t("about.q5"),
      answer: (
        <>
          <div className="paragraph">{t("about.a5")}</div>
        </>
      ),
    },
    {
      question: t("about.q6"),
      answer: (
        <>
          <div className="paragraph">{t("about.a6")}</div>
        </>
      ),
    },
    {
      question: t("about.q7"),
      answer: (
        <>
          <div className="paragraph">{t("about.a7")}</div>
        </>
      ),
    },
    {
      question: t("about.q8"),
      answer: (
        <>
          <div className="paragraph">{t("about.a8")}</div>
        </>
      ),
    },

    {
      question: t("about.q9"),
      answer: (
        <>
          <div className="paragraph">{t("about.a9")}</div>
        </>
      ),
    },
    {
      question: t("about.q10"),
      answer: (
        <>
          <div className="paragraph">{t("about.a10")}</div>
        </>
      ),
    },
    {
      question: t("about.q11"),
      answer: (
        <>
          <div className="paragraph">{t("about.a11")}</div>
        </>
      ),
    },
  ];

  return (
    <Container className="px-[104px]">
      <Title className="mt-[80px]">{t("about.about_zklink_nova_agg")}</Title>

      <div className="mt-[60px] mx-auto flex flex-col gap-[30px]">
        {list.map((item, index) => (
          <CollapseCard
            key={index}
            question={item.question}
            answer={item.answer}
            isOpened={item.isOpened}
            isGradientBorder={item.isGradientBorder}
          />
        ))}
      </div>

      <NovaNetworkTVL />
    </Container>
  );
}
