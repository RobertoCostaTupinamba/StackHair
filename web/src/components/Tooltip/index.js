import { Container } from "./styles";

const Tooltip = ({ title, className, children }) => {
  return (
    <Container className={className}>
      <div className="error">{title}</div>
      {children}
    </Container>
  );
}

export default Tooltip;