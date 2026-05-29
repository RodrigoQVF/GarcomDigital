import './ModalConfirmacao.css';

interface ModalConfirmacaoProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ModalConfirmacao({ isOpen, onConfirm, onCancel }: ModalConfirmacaoProps){
    if (!isOpen) return null;

    return(
        <div className="kds-modal-overlay" onClick={onCancel}>
            <div className="kds-modal" onClick={(e) => e.stopPropagation()}>
                <div>
                    <h1>Quer mesmo confirmar essa ação?</h1>
                </div>
                <div className="modal-actions">
                    <button className="btn-confirm" onClick={onConfirm}>Sim</button>
                    <button className="btn-cancel" onClick={onCancel}>Não</button>
                </div>
            </div>
        </div>
    );
}