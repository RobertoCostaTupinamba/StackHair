const Header = () => {
    return (
        <header className="container-fluid d-flex justify-content-end">
            <div className="d-flex align-items-center">
                <div>
                    <span className="d-block m-0 p-0 text-white">Barbearia X</span>
                    <small className="m-0 p-0">Plano gold</small>
                </div>
                <img alt="Logo da barbearia" src="https://img.freepik.com/vetores-gratis/logotipo-do-polo-de-barbeiro_1415-673.jpg?size=338&ext=jpg" />
                <span className="mdi mdi-chevron-down text-white"></span>
            </div>
        </header>
    )
}

export default Header;