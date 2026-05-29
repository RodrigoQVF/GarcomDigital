import { useDraggable } from '@dnd-kit/core';
import type { Pedido } from "../../interfaces/types";
import MenuCard from '../../components/MenuCard/MenuCard';
import './Cards.css'

const statusClasses = {
    'PENDENTE': 'pendente',
    'PREPARANDO': 'preparando',
    'CONCLUIDO': 'concluido',
    'CANCELADO': 'cancelado'
};

interface pedidoCard {
    pedido: Pedido,
    onStatusChange: (id: string | number, statusAtual: Pedido['status'] | 'CANCELAR') => void;
    isOverlay?: boolean;
}

export default function Cards({pedido, onStatusChange, isOverlay = false}: pedidoCard){
    const isImutavel = pedido.status === 'CANCELADO' || pedido.status === 'CONCLUIDO';

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: pedido.id,
        disabled: isOverlay || isImutavel,
    });

    const style = isOverlay ? {
        cursor: 'grabbing',
        opacity: 0.9,
    } : isDragging ? {
        opacity: 0.3,
        cursor: 'grabbing',
    } : {
        cursor: isImutavel ? 'default' : 'grab'
    };

    return(
    <div 
        ref={isOverlay ? undefined : setNodeRef}
        key={pedido.id} 
        className={`kds-card card-${statusClasses[pedido.status]} ${isOverlay ? 'dragging-overlay' : ''}`}
        style={style}
        {...(isOverlay ? {} : listeners)}
        {...(isOverlay ? {} : attributes)}
    >
        <div className="card-top"> 
            <span>#{pedido.id}</span>
            {!isImutavel && <span><MenuCard onCancel={() => onStatusChange(pedido.id, "CANCELAR")} /></span>}
        </div>
        <div className="card-top">
            <span className="card-mesa">MESA {pedido.mesa}</span>
            <span className="card-time">{pedido.horario}</span>
        </div>
        <div className="card-body">
            {pedido.itens.map((item, idx) => (
            <p key={idx} className="card-item" {...((isDragging || isOverlay) ? {style: {userSelect: 'none'}} : {})}>
                <strong>{item.quantidade}x</strong> {item.nome}
            </p>
            ))}
        </div>
        {!isImutavel && (
            <div className={`div-btn-${pedido.status}`}>
                <div className='div-btn'>
                    <button onClick={() => onStatusChange(pedido.id, "PENDENTE")}>Preparar</button>
                    <button onClick={() => onStatusChange(pedido.id, "PREPARANDO")}>Concluido</button>
                </div>
            </div>
        )}
    </div>
    )
}