import styled, { keyframes, css } from 'styled-components';
/**
 * - keyframes serve para fazer animações
 * - css serve quando eu quero adicionar um conjunto de regras
 *      de css a um elemento, baseado em condições
 */

export const Form = styled.form`
  margin-top: 30px;
  display: flex;
  flex-direction: row;

  input {
    flex: 1; /*Para ocupar todo o espaço da div */
    border: 1px solid #eee;
    padding: 10px 15px;
    border-radius: 4px;
    font-size: 16px;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

/* O .attrs é para passar ATRIBUTOS diretamente pelo CSS */
export const SubmitButton = styled.button.attrs((props) => ({
  type: 'submit',
  disabled: props.loading,
}))`
  background: #7159c1;
  border: 0;
  padding: 0 15px;
  margin-left: 10px;
  border-radius: 4px;

  display: flex;
  justify-content: center;
  align-items: center;
  /*Os 3 últimos para centralizar o conteúdo do botão */

  /*O & se refere ao SubmitButton */
  /*&:focus significa: quando ele estive sofrendo focus */
  /*&[disabled] significa: quando ele estiver desabilitado */
  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }
  /*
  // Aqui, faríamos uma animação independente de estado
  svg {
    animation: ${rotate} 2s linear infinite;
  }
   */

  /*
    O operador ternátio substitui um 'if-else'
    O Operador && substitui um if, pois se a primeira condição
       é falsa, o segunda não executa.
   */
  ${(props) =>
    props.loading &&
    css`
      svg {
        animation: ${rotate} 2s linear infinite;
      }
    `}
`;

export const List = styled.ul`
  list-style: none;
  margin-top: 30px;

  li {
    padding: 15px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    /*Como a proxima está dentro do li, o & quer dizer o li.
      O + li quer dizer a partir do segundo li, mas não no primeiro*/
    & + li {
      border-top: 2px solid #eee;
    }

    a {
      color: #7159c1;
      text-decoration: none;
    }
  }
`;
