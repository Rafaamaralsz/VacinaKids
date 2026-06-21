export interface ICampaign {
  id: string;
  titulo: string;
  descricao: string;
  publicoAlvo: string;
  dataInicio: string;
  dataFim: string;
  ativa: boolean;
}

export class Campaign implements ICampaign {
  id: string;
  titulo: string;
  descricao: string;
  publicoAlvo: string;
  dataInicio: string;
  dataFim: string;
  ativa: boolean;

  constructor(data: ICampaign) {
    this.id = data.id;
    this.titulo = data.titulo;
    this.descricao = data.descricao;
    this.publicoAlvo = data.publicoAlvo;
    this.dataInicio = data.dataInicio;
    this.dataFim = data.dataFim;
    this.ativa = data.ativa;
  }

  get isCurrentlyActive(): boolean {
    if (!this.ativa) {
      return false;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const inicio = new Date(this.dataInicio);
    const fim = new Date(this.dataFim);
    inicio.setHours(0, 0, 0, 0);
    fim.setHours(23, 59, 59, 999);

    return hoje >= inicio && hoje <= fim;
  }

  toFirestore(): ICampaign {
    return {
      id: this.id,
      titulo: this.titulo,
      descricao: this.descricao,
      publicoAlvo: this.publicoAlvo,
      dataInicio: this.dataInicio,
      dataFim: this.dataFim,
      ativa: this.ativa,
    };
  }

  static fromFirestore(data: ICampaign): Campaign {
    return new Campaign(data);
  }
}
