export type VaccineStatus = 'Aplicada' | 'Pendente' | 'Atrasada';

export interface IVaccine {
  id: string;
  childId: string;
  nome: string;
  dataPrevista: string;
  dataAplicada?: string | null;
  status?: VaccineStatus;
}

export class Vaccine implements IVaccine {
  id: string;
  childId: string;
  nome: string;
  dataPrevista: string;
  dataAplicada?: string | null;

  constructor(data: IVaccine) {
    this.id = data.id;
    this.childId = data.childId;
    this.nome = data.nome;
    this.dataPrevista = data.dataPrevista;
    this.dataAplicada = data.dataAplicada ?? null;
  }

  get status(): VaccineStatus {
    if (this.dataAplicada) {
      return 'Aplicada';
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const prevista = new Date(this.dataPrevista);
    prevista.setHours(0, 0, 0, 0);

    if (prevista < hoje) {
      return 'Atrasada';
    }

    return 'Pendente';
  }

  get statusColor(): string {
    switch (this.status) {
      case 'Aplicada':
        return 'success';
      case 'Pendente':
        return 'warning';
      case 'Atrasada':
        return 'danger';
    }
  }

  toFirestore(): IVaccine {
    return {
      id: this.id,
      childId: this.childId,
      nome: this.nome,
      dataPrevista: this.dataPrevista,
      dataAplicada: this.dataAplicada ?? null,
    };
  }

  static fromFirestore(data: IVaccine): Vaccine {
    return new Vaccine(data);
  }
}
