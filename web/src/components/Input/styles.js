import styled, { css } from "styled-components";

import Tooltip from "../Tooltip";

export const Container = styled.div`

    background: #232129;
    border-radius: 10px;
    padding: 16px;
    width: 100%;
    
    border: 2px solid #232129;
    color: #666360;

    display: flex;
    align-items: center;

     & + div {
            margin-top: 8px;
    }

    ${props => props.isErrored && css`
        border-color: #c53030;
    `}

    ${props => props.isFocused && css`
        color: #ff9000;
        border-color: #ff9000;
    `}

    ${props => props.isFilled && css`
        color: #ff9000;
    `}


    

    input {
        background:transparent;
        flex:1;
        border:0px solid black;
        color: #f4ede8;
        outline: 0;

        &::placeholder {
            color: #666360;
        }
    }


    input:-webkit-autofill,
    input:-webkit-autofill:hover, 
    input:-webkit-autofill:focus, 
    input:-webkit-autofill:active  {
        -webkit-box-shadow: 0 0 0 30px #232129 inset !important;
    }

    input:-webkit-autofill {
    -webkit-text-fill-color: #f4ede8 !important;
    }

    span {
        margin-right: 16px;
    }

`;

export const Error = styled(Tooltip)`
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    margin-left: 16px;

    span {
        margin-right: 0px ;
    }

    div{
      background: #c53030;
      opacity: 0;
      visibility: hidden;
      ${props => props.isMouseEnter && css`
            opacity: 1;
            transition: opacity 0.4s;
            visibility: visible;
        `}
      
      &::before{
          border-color: #c53030 transparent;
      }
    }
`;