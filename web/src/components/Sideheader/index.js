import Header from '../Header';
import Sidebar from '../Sidebar';

const Sideheader = ({ children }) => {
  return (
    <>
      <Header />
      <div className="container-fluid h-100">
        <div className="row h-100">
          <Sidebar />
          {children}
        </div>
      </div>
    </>
  );
};

export default Sideheader;
