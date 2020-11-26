import React, { useCallback, useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';

const minAno = 2019;
const maxAno = 2022;
const anos = [];
const meses = [];

for(let i = minAno; i <= maxAno; i++){
  anos.push(i);
}

for(let i = 1; i <= 12; i++){
  meses.push(i);
}

const AdicionarMes = () => {
  const anoRef = useRef();
  const mesRef = useRef();
  const [redir, setRedir] = useState('');

  const verMes = useCallback(() => {
    setRedir(`${anoRef.current.value}-${mesRef.current.value}`)
    
  }, [])

  if(redir !== ''){
    return <Redirect to={`/movimentacoes/${redir}`} />
  }

  return (
    <>
      <h2>Adicionar mês</h2>
      <select ref={anoRef}>
        { anos.map(ano => <option key={ano} value={ano}>{ano}</option>) }
      </select>

      <select ref={mesRef}>
      { meses.map(mes => <option key={mes.toString().padStart(2, "0")} value={mes.toString().padStart(2, "0")}>{mes.toString().padStart(2, "0")}</option>) }
      </select>

      <button onClick={verMes}>Adicionar mês</button>
    </>
  )
}

export default AdicionarMes;