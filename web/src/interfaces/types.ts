export const calcularPrecoTotal = (itens: itemPedido[]): number => {
    return itens.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0);
}

export type statusPedido = 'PREPARANDO' | 'CONCLUIDO' | 'CANCELADO' | 'PENDENTE'

export interface itemPedido {
nome: string,
quantidade: number,
precoUnitario: number,
observacao?: string
}

export interface Pedido {
    id: number | string,
    mesa: string | number,
    itens: itemPedido[],
    precoTotal: number,
    status: statusPedido,
    horario: string
}