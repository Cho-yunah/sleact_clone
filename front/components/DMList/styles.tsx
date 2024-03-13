import styled from '@emotion/styled';

export const CollapseButton = styled.button<{ collapse: boolean }>`
  background: transparent;
  border: none;
  width: 26px;
  height: 26px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin-left: 10px;
  cursor: pointer;

  & i {
    opacity: .64;

  }

  ${({ collapse }) =>
    collapse &&
    `
    & i {
      transform: none;
        position: relative;
        transition: transform .1s, opacity .1s;
        transform: rotate(90deg);
        vertical-align: middle;
        opacity: .64;
        width: 26px;
        height: 17px;
        // font-size: 20px;
        // font-family: Slack v2;
        // font-weight: 400;
        display: inline-block;
        cursor: pointer;
        font-style: normal;
        flex-shrink: 0;
      }
    }
  `};
`;

export const IsOnlineIconBox = styled.div`
    width: 20px;
    height: 20px;
    text-align : center;
    display: flex;
    align-items: center
`