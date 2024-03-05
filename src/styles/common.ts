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
`

export const BgBox = styled.div`
    position: relative;
    padding-top: 7.5rem;
    padding-bottom: 7.5rem;
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(0deg, rgba(0, 178, 255, 0.23) 0%, rgba(12, 14, 17, 0.23) 100%);
    overflow: auto;
`

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
`

export const CardBox = styled.div`
    border-radius: 1rem;
    background: rgba(0, 0, 0, 0.40);
    backdrop-filter: blur(15.800000190734863px);
`

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
            padding: 1.5rem 0 0.75rem;
        }
        tr:last-child td {
            padding: 0.75rem 0 1.5rem;
        }
        td {
            padding: 0.75rem 0;
        }
    }
`