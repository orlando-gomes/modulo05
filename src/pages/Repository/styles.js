import styled, { css } from 'styled-components';

export const Loading = styled.div`
  color: #fff;
  font-size: 30px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const Owner = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;

  a {
    color: #7159c1;
    font-size: 16px;
    text-decoration: none;
  }

  img {
    width: 120px;
    border-radius: 50%;
    margin-top: 20px;
  }

  h1 {
    font-size: 24px;
    margin-top: 10px;
  }

  p {
    margin-top: 5px;
    font-size: 14px;
    color: #555;
    line-height: 1.4;
    max-width: 400px;
  }
`;

export const States = styled.div`
  border: 2px solid #eee;
  margin-top: 10px;
  padding: 0 20%;
  display: flex;
  justify-content: space-between;
`;

/* As 3 primeiras linhas é um hack para colocar uma borda no meio da
       distância entre dois elementos */
export const IssueList = styled.ul`
  padding-top: 30px;
  margin-top: 30px;
  border-top: 2px solid #eee;
  list-style: none;

  li {
    display: flex;
    /*
    flex-direction: row;
    align-items: center;
    */
    padding: 15px 10px;
    border: 2px solid #eee;
    border-radius: 4px;

    /*Usando novamente o hack de estilizar somente a partir do segundo li */
    & + li {
      margin-top: 10px;
    }
  }

  img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid #eee;
    margin-left: 10px;
  }

  div {
    /*flex: 1; é para a div não passar dos limites da página */
    flex: 1;
    margin-left: 15px;

    strong {
      font-size: 16px;

      a {
        text-decoration: none;
        color: #333;

        &:hover {
          color: #7159c1;
        }
      }

      span {
        background: #ffdddd;
        color: #333;
        border-radius: 2px;
        font-size: 12px;
        font-weight: 600;
        height: 20px;
        padding: 3px 4px;
        margin-left: 10px;
      }
    }

    p {
      margin-top: 5px;
      font-size: 12px;
      color: #999;
    }
  }
`;

export const StateButton = styled.button`
  border-style: none;
  ${(props) =>
    props.active
      ? css`
          padding: 0 2px;
          cursor: not-allowed;
          font-weight: bold;
        `
      : css`
          padding: 0 2px;
          opacity: 0.6;
        `}

  :hover {
    font-weight: bold;
    opacity: 1;
  }
`;

export const LinkList = styled.div`
  border: 2px solid #eee;
  margin-top: 10px;
  padding: 0 20%;
  display: flex;
  justify-content: space-between;

  button {
    color: #7159c1;
    border: none !important;
    background-color: white !important;
  }
`;
