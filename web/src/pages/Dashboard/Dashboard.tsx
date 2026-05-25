import { useState } from 'react';
import { 
  DndContext, 
  useDroppable, 
  DragOverlay,
  PointerSensor, 
  TouchSensor, 
  useSensor, 
  useSensors, 
  type DragStartEvent,
  type DragEndEvent 
} from '@dnd-kit/core';
import './Dashboard.css';
import { type Pedido, calcularPrecoTotal, type statusPedido } from '../../interfaces/types'
import Cards from '../../components/Cards/Cards'

const itensPedido1 = [
    { nome: 'Burger Artesanal', quantidade: 2, precoUnitario: 1350 },
      { nome: 'Batata Rústica', quantidade: 1, precoUnitario: 1350 }
]

const itensPedido2 = [
      { nome: 'Pizza Calabresa', quantidade: 1, precoUnitario: 1000 },
      { nome: 'Suco de Laranja', quantidade: 2, precoUnitario: 1230 }
    ]

const itensPedido3 = [
      { nome: 'Chopp Pilsen', quantidade: 3, precoUnitario: 700, observacao: "gelado" }
    ]

const PEDIDOS_INICIAIS: Pedido[] = [
  {
    id: '101',
    mesa: 4,
    horario: '14:32',
    status: 'CANCELADO',
    itens: itensPedido1,
    precoTotal: calcularPrecoTotal(itensPedido1)
  },
  {
    id: '102',
    mesa: 2,
    horario: '14:25',
    status: 'PENDENTE',
    itens: itensPedido2,
    precoTotal: calcularPrecoTotal(itensPedido2)
  },
  {
    id: '103',
    mesa: 9,
    horario: '14:40',
    status: 'PENDENTE',
    itens: itensPedido3,
    precoTotal: calcularPrecoTotal(itensPedido3)
  }
];

interface DroppableColumnProps {
  status: statusPedido;
  className: string;
  children: React.ReactNode;
}

function DroppableColumn({ status, className, children }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <section 
      ref={setNodeRef} 
      className={`${className} ${isOver ? 'drag-over' : ''}`}
    >
      {children}
    </section>
  );
}

export default function Dashboard() {
  const [pedidos, setPedidos] = useState<Pedido[]>(PEDIDOS_INICIAIS);
  const [activeId, setActiveId] = useState<string | number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const alterarStatus = (id: string | number, statusAtual: statusPedido) => {
    if (statusAtual === 'PENDENTE') {
      setPedidos(pedidos.map(p => p.id === id ? { ...p, status: 'PREPARANDO' } : p));
    } 
    if (statusAtual === 'PREPARANDO') {
        setPedidos(pedidos.map(p => p.id === id ? { ...p, status: 'CONCLUIDO'} : p));
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;

    const id = active.id;
    const novoStatus = over.id as statusPedido;

    setPedidos(prevPedidos => 
      prevPedidos.map(p => p.id === id ? { ...p, status: novoStatus } : p)
    );
  };

  const pendentes = pedidos.filter(p => p.status === 'PENDENTE');
  const preparando = pedidos.filter(p => p.status === 'PREPARANDO');
  const concluidos = pedidos.filter(p => p.status === 'CONCLUIDO');
  const cancelados = pedidos.filter(p => p.status === 'CANCELADO')
  
  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
    >
      <div className="kds-page">
        <header className="kds-topbar">
          <div className="kds-logo">
            <h2>GarçomDigital</h2>
            <span className="badge-kds">Painel KDS</span>
          </div>
          <div className="kds-info">
            <span className="status-dot"></span>
            <span>Cozinha Conectada</span>
          </div>
        </header>

        <div className="kds-columns-container">
          <DroppableColumn 
            status="PENDENTE"
            className="kds-column column-pendente"
          >
            <div className="column-header">
              <h3>Novos Pedidos ({pendentes.length})</h3>
            </div>
            <div className="column-list">
              {pendentes.map(pedido => (
                <Cards
                  key={pedido.id}
                  pedido={pedido}
                  onStatusChange={alterarStatus}
                />
              ))}
            </div>
          </DroppableColumn>

          <DroppableColumn 
            status="PREPARANDO"
            className="kds-column column-preparando"
          >
            <div className="column-header">
              <h3>Em Preparo ({preparando.length})</h3>
            </div>
            <div className="column-list">
              {preparando.map(pedido => (
                <Cards
                  key={pedido.id}
                  pedido={pedido}
                  onStatusChange={alterarStatus}
                />
              ))}
            </div>
          </DroppableColumn>

          <DroppableColumn 
            status="CONCLUIDO"
            className="kds-column column-concluido"
          >
              <div className="column-header">
                  <h3>Pedidos Concluídos ({concluidos.length})</h3>
              </div>
              <div className="column-list">
              {concluidos.map(pedido => (
                <Cards
                  key={pedido.id}
                  pedido={pedido}
                  onStatusChange={alterarStatus}
                />
              ))}
              </div>
          </DroppableColumn>

          <DroppableColumn 
            status="CANCELADO"
            className="kds-column column-cancelado"
          >
              <div className="column-header">
                  <h3>Pedidos Cancelados ({cancelados.length})</h3>
              </div>
              <div className="column-list">
                  {cancelados.map(pedido => (
                <Cards
                  key={pedido.id}
                  pedido={pedido}
                  onStatusChange={alterarStatus}
                />
              ))}
              </div>
          </DroppableColumn>
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeId ? (
          <Cards 
            pedido={pedidos.find(p => p.id === activeId)!} 
            onStatusChange={alterarStatus}
            isOverlay={true}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}