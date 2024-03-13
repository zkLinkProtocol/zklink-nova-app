import { Spinner } from "@nextui-org/react";
import styled from "styled-components";

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  /* backdrop-filter: blur(1px); */
  z-index: 99999;
`;

export default function Loading() {
  return (
    <LoadingContainer className="flex justify-center items-center">
      <Spinner size="lg" />
    </LoadingContainer>
  );
}
