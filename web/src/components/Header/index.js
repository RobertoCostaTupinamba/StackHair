import { useSelector } from 'react-redux';

const Header = () => {
  let { nome, email, foto } = useSelector((state) => state.user);

  return (
    <header className="container-fluid d-flex justify-content-end">
      <div className="d-flex align-items-center">
        <div>
          <span className="d-block m-0 p-0 text-white">{(nome && nome) || ''}</span>
          <small className="m-0 p-0">{(email && email) || ''}</small>
        </div>
        {foto !== null ? (
          <img alt="Logo da barbearia" src={`${foto}`} />
        ) : (
          <img
            alt="Logo da barbearia"
            src="https://firebasestorage.googleapis.com/v0/b/stackhair.appspot.com/o/default.jpg?alt=media&token=05b7c349-038e-4dca-a1d9-88ae90ea749a"
          />
        )}

        <span className="mdi mdi-chevron-down text-white" />
      </div>
    </header>
  );
};

export default Header;
