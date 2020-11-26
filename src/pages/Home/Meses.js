import React from 'react';
import Rest from '../../utils/Rest';
import { Link } from 'react-router-dom';

const baseUrl = 'https://my-money-vms.firebaseio.com/';

const Meses = () => {
  const { useGet } = Rest(baseUrl);
  const data = useGet('meses');

  if(data.loading) {
    return <span>Carregando...</span>
  }
  if(Object.keys(data).length > 0){
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Mês</th>
            <th>Previsão entrada</th>
            <th>Entradas</th>
            <th>Previsão saída</th>
            <th>Saídas</th>
          </tr>
        </thead>
        <tbody>
          {
            Object.keys(data.data)
              .map(mes => {
                return (
                  <tr key={mes}>
                    <td><Link to={`/movimentacoes/${mes}`}>{mes}</Link></td>
                    <td>{data.data[mes].previsao_entrada || 0}</td>
                    <td>{data.data[mes].entradas || 0}</td>
                    <td>{data.data[mes].previsao_saida || 0}</td>
                    <td>{data.data[mes].saidas || 0}</td>
                  </tr>
                )
              })
          }
        </tbody>
      </table>
    )
  }
  return null;
}

export default Meses;