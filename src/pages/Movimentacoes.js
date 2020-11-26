import React, { useState, useCallback } from 'react';
import Rest from '../utils/Rest';

const baseUrl = 'https://my-money-vms.firebaseio.com/';

const Movimentacoes = ({ match }) => {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState(0);
  const { useGet, usePost, useRemove, usePatch } = Rest(baseUrl);
  const mes = match.params.data;
  const dataMov = useGet(`movimentacoes/${mes}/`);
  const dataMeses = useGet(`meses/${mes}/`);
  const { post } = usePost(`movimentacoes/${mes}/`);
  const { remove } = useRemove(`movimentacoes/${mes}/`);
  const [atualizado, setAtualizado] = useState(true);
  const { patch } = usePatch(`meses/${mes}`);

  const onChangeDescricao = useCallback(evt => {
    setDescricao(evt.target.value);
  }, [])

  const onChangeValor = useCallback(evt => {
    setValor(evt.target.value);
  }, [])

  const salvarMovimentacao = useCallback(async () => {
    if (!isNaN(valor)) { // && valor.search(/^[-]?\d+(\.)?\d+?$/) >= 0) {
      await post({
        descricao,
        valor: parseFloat(valor)
      })

      setDescricao("");
      setValor(0);

      setAtualizado(false);
      await dataMov.refetch();
      setTimeout(async () => {
        await dataMeses.refetch();
        setAtualizado(true);
      }, 5000)
      
    }
  },[dataMov, dataMeses, descricao, post, valor])

  const removerMovimentacao = useCallback(async(id) => {
    await remove(id);
    await dataMov.refetch();
    await dataMeses.refetch();
  },[remove, dataMov, dataMeses])

  const onAlteraPrevisaoEntrada = useCallback(async (evt) => {
    await patch({
      previsao_entrada: evt.target.value
    })
  },[patch]);

  const onAlteraPrevisaoSaida = useCallback(async (evt) => {
    await patch({
      previsao_saida: evt.target.value
    })
  },[patch]);

  if(dataMov.loading){
    return (
      <div className="container">
        <span>Carregando...</span>
      </div>
    )
  }

  return (
    <div className="container">
      <div>
        Previsão de entradas: <input type="numeric" onBlur={onAlteraPrevisaoEntrada} defaultValue={dataMeses.data.previsao_entrada}/> / Previsão de saídas: <input type="numeric" onBlur={onAlteraPrevisaoSaida} defaultValue={dataMeses.data.previsao_saida}/><br/>
        Entradas: {dataMeses.data.entradas} / Saídas: {dataMeses.data.saidas} / {atualizado ? <span className="badge badge-success text-wrap">Atualizado</span> : <span className="badge badge-warning text-wrap">Atualizando...</span>}
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {
            dataMov.data &&
            Object.keys(dataMov.data)
              .map(movimentacao => (
                <tr key={movimentacao}>
                  <td>{dataMov.data[movimentacao].descricao}</td>
                  <td>{dataMov.data[movimentacao].valor}</td>
                  <td><button className="btn btn-danger" onClick={() => removerMovimentacao(movimentacao)}>-</button></td>
                </tr>
              ))
          }
          <tr>
            <td><input type="text" placeholder="Descrição" value={descricao} onChange={onChangeDescricao}/></td>
            <td>
              <input type="number" placeholder="Valor" value={valor} onChange={onChangeValor} /> {' '}
              <button className="btn btn-success" onClick={salvarMovimentacao}>+</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Movimentacoes;