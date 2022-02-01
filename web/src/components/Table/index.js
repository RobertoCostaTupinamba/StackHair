import { Table } from 'rsuite';
const { Column, HeaderCell, Cell } = Table;
import 'rsuite/Button/styles/index.less';

const TableComponent = ({ data, config, actions, onRowClick }) => {
  return (
    <Table height={400} data={data} onRowClick={(item) => onRowClick(item)}>
      {config.map((c) => (
        <Column flexGrow={!c.width ? 1 : 0} width={c.width} align="center" key={c.key} fixed={c.fixed}>
          <HeaderCell>{c.label}</HeaderCell>
          {!c.content ? <Cell dataKey={c.key} /> : <Cell>{(item) => c.content(item)}</Cell>}
        </Column>
      ))}
      <Column width={150} align="center" fixed="right">
        <HeaderCell>Ações</HeaderCell>
        <Cell>{(item) => actions(item)}</Cell>
      </Column>
    </Table>
  );
};

export default TableComponent;
