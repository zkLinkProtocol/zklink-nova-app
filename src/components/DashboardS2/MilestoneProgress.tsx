import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 14px;
  border-radius: 100px;
  background: linear-gradient(180deg, #131313 34.42%, #010b15 65.58%);
  box-shadow: 0px 0px 16px 0px rgba(255, 255, 255, 0.26) inset;
  overflow: hidden;

  .disabled {
    opacity: 0.5;
  }

  .inner {
    max-width: 100%;
    border-radius: 64px;
    background: linear-gradient(90deg, #026e4f 0%, #03d498 100%);
    height: 14px;
  }
`;

export default function MilestoneProgress({
  progress,
  isDisabled,
}: {
  progress?: string | number;
  isDisabled?: boolean;
}) {
  return (
    <Container className={isDisabled ? "disabled" : ""}>
      <div className="inner" style={{ width: progress || 0 }}></div>
    </Container>
  );
}
