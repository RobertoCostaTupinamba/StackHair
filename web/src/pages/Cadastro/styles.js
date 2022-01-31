import styled from 'styled-components';
import { shade } from 'polished';

import cadastroBackgroud from '../../assets/paginaCadastro.png';

export const Container = styled.div`
  height: 100vh;
  background-color: #21232f;
  color: #fff;
  -webkit-font-smoothing: antialiased;

  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  place-content: center;
  width: 100%;
  max-width: 700px;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;
    font-family: 'Roboto Slab', serif;
    h1 {
      margin-bottom: 24px;
      font-weight: 500;
      font-family: 'Roboto Slab', serif;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }
  }

  > a {
    color: #f4ede8;
    display: block;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;

    display: flex;
    align-items: center;

    span {
      margin-right: 16px;
    }

    &:hover {
      color: ${shade(0.2, '#f4ede8')};
    }
  }
`;

export const Background = styled.div`
  flex: 1;
  background: url(${cadastroBackgroud}) no-repeat center;
  background-size: cover;
`;

// body {
//     background-color: #312E38;
//     color: #fff;
//     -webkit-font-smoothing: antialiased;
// }

// body, input, button {
//     font-family: 'Roboto Slab', serif;
//     font-size: 16;
// }

// h1, h2, h3, h4, h5 {
//     font-weight: 500;
// }

// button {
//     cursor: pointer;
// }
