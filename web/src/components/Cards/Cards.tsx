import type { Pedido } from "../../interfaces/types";
import './Cards.css'

const statusClasses = {
    'PENDENTE': 'pendente',
    'PREPARANDO': 'preparando',
    'CONCLUIDO': 'concluido',
    'CANCELADO': 'cancelado'
};

const buttonText = {
    'PREPARANDO': 'Concluir',
    'PENDENTE': 'Preparar',
    'CONCLUIDO': '',
    'CANCELADO': ''
}

interface pedidoCard {
    pedido: Pedido,
    onStatusChange: (id: string | number, statusAtual: Pedido['status']) => void;
}

export default function Cards({pedido, onStatusChange}: pedidoCard){
    return(
    <div key={pedido.id} className={`kds-card card-${statusClasses[pedido.status]}`}>
        <div className="card-top">
            <span className="card-mesa">MESA {pedido.mesa}</span>
            <span className="card-time">{pedido.horario}</span>
        </div>
        <div className="card-body">
            {pedido.itens.map((item, idx) => (
            <p key={idx} className="card-item">
                <strong>{item.quantidade}x</strong> {item.nome}
            </p>
            ))}
        </div>
        {pedido.status !== 'CANCELADO' && pedido.status !== 'CONCLUIDO' ?
        <button 
            className={`card-btn btn-${statusClasses[pedido.status]}`}
            onClick={() => onStatusChange(pedido.id, pedido.status)}
        >
        {buttonText[pedido.status]}
        </button> : undefined}
        
    </div>
    )
}