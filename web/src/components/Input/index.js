import {Container} from './styles'

const Input = ({icon, ...rest}) => {
    console.log(icon);
    return (
        <Container>
            {icon && <span className={icon} style={{}}></span> }
            <input className={icon} {...rest} />
        </Container>
    )
}

export default Input;