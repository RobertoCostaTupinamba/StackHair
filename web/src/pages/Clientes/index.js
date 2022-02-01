import { useEffect } from 'react';
import Sideheader from '../../components/Sideheader';

import { useDispatch, useSelector } from 'react-redux';
import { allClientes } from '../../store/modules/cliente/actions';
import moment from 'moment';
import Table from '../../components/Table';
import { Button } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import 'rsuite/dist/rsuite.min.js';
import 'rsuite/Button/styles/index.less';

const Clientes = () => {
  const dispatch = useDispatch();
  const { clientes } = useSelector((state) => state.clientes);

  useEffect(() => {
    dispatch(allClientes());
  }, [dispatch]);

  return (
    <Sideheader>
      <div className="col p-5 overflow-auto h-100">
        <div className="row">
          <div className="col-12">
            <div className="w-100 d-flex justify-content-between">
              <h2 className="mb-4 mt0">Clientes</h2>
              <div>
                <button className="btn btn-primary btn-lg">
                  <span className="mdi mdi-plus">Novo Cliente</span>
                </button>
              </div>
            </div>
            <Table
              data={clientes}
              config={[
                { label: 'Nome', key: 'nome', width: 200, fixed: true },
                { label: 'E-mail', key: 'email', width: 200 },
                { label: 'Telefone', key: 'telefone', width: 200 },
                {
                  label: 'Sexo',
                  key: 'sexo',
                  content: (cliente) => (cliente.sexo === 'M' ? 'Masculino' : 'Feminino'),
                  width: 200,
                },
                {
                  label: 'Data Cadastro',
                  key: 'dataCadastro',
                  content: (cliente) => moment(cliente.dataCadastro).format('DD/MM/YYYY'),
                  width: 200,
                },
              ]}
              onRowClick={(cliente) => {
                alert(cliente.nome);
              }}
              actions={() => (
                <Button color="blue" appearance="primary" size="xs">
                  Ver informações
                </Button>
              )}
            />
          </div>
        </div>
      </div>
    </Sideheader>
  );
};

export default Clientes;
