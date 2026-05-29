import { useState, useEffect, useRef } from 'react'
import { MoreVertical } from 'lucide-react'
import './MenuCard.css'

interface MenuCardProps {
    onCancel?: () => void;
}

export default function MenuCard ({ onCancel }: MenuCardProps) {
const [isOpen, setIsOpen] = useState<boolean>(false);
    
    const menuRef = useRef<HTMLDivElement>(null);

    const handleButtonMenu = () => {
        setIsOpen(!isOpen);
    }

    useEffect(() => {
        const verificarCliqueFora = (event: MouseEvent) => {
            if (isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', verificarCliqueFora);
        return () => {
            document.removeEventListener('mousedown', verificarCliqueFora);
        };
    }, [isOpen]);

    return (
        <div className="menu-card" ref={menuRef}>
            <button className="menu-openbtn" onClick={handleButtonMenu}>
                <MoreVertical size={20} color="#fff" />
            </button>
            {isOpen ? 
            <div className='menu-btns'>
                <button onClick={() => {
                    setIsOpen(false);
                    if (onCancel) onCancel();
                }}>
                    Cancelar
                </button>
            </div>
            :
            undefined}
        </div>
    )
}