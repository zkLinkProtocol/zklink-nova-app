import styled from "styled-components";

export const GradientButton = styled.span`
  background: linear-gradient(to right, #48ebae, #3d51fc, #49e9b0);
  color: #fff;
  font-family: Satoshi;
  font-size: 1rem;
  font-style: normal;
  font-weight: 900;
  letter-spacing: 0.125rem;
  text-transform: uppercase;
  border-radius: 0.5rem;
  display: inline-block;
  user-select: none;
  cursor: pointer;
  &.disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`;

export const BgBox = styled.div`
  position: relative;
  padding-top: 5.5rem;
  padding-bottom: 2rem;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(
    0deg,
    rgba(0, 178, 255, 0.23) 0%,
    rgba(12, 14, 17, 0.23) 100%
  );
  overflow: auto;
`;

export const BgCoverImg = styled.div`
  position: absolute;
  top: 7.5rem;
  left: 50%;
  transform: translate(-50%, 0);
  width: 58.875rem;
  height: calc(100vh - 7.5rem);
  border-radius: 58.875rem;
  background: rgba(0, 194, 255, 0.32);
  filter: blur(500px);
  z-index: 0;
`;

export const CardBox = styled.div`
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15.800000190734863px);

  &.successed {
    background: #1d4138 !important;
  }
  &.bg {
    background-image: url('/img/bg-nova-points.png');
  }
`;

export const TableBox = styled.div`
  .table {
    padding: 0 1.5rem;
    border-radius: 1rem;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(15.800000190734863px);
  }
  .table-header {
    tr {
      border-bottom: 0.0625rem solid #546779;
    }
    th {
      padding: 1.5rem 0;
      background: none;
      color: #c6d3dd;
      font-family: Satoshi;
      font-size: 1rem;
      font-style: normal;
      font-weight: 900;
      line-height: 1.5rem; /* 150% */
    }
  }

  .table-tbody {
    tr:first-child td {
      padding: 1.5rem 0 1.5rem;
    }
    tr:last-child td {
      padding: 0.75rem 0 1.5rem;
    }
    td {
      padding: 0.75rem 0;
    }
  }
`;

export const FooterTvlText = styled.p`
  color: #fff;
  font-family: Satoshi;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const GradientText = styled.span`
  background: linear-gradient(90deg, #48ecae 0%, #3a50ed 52.9%, #49cdd7 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  font-family: Satoshi;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.5rem; /* 150% */
  letter-spacing: -0.03125rem;
  user-select: none;
`;

export const GradientBorder = styled.div`
  border: 1px solid transparent;
  border-radius: 8px;
  position: relative;
  background-color: rgba(0, 0, 0, 0.8);
  background-clip: padding-box; /*important*/
  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: -1;
    margin: -4px;
    border-radius: inherit; /*important*/
    background: linear-gradient(90deg, #48ecae 0%, #3a50ed 52.9%, #49cdd7 100%);
  }
`;


