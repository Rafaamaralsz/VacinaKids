export interface IChild {
  id: string;
  nome: string;
  dataNascimento: string;
}

export class Child implements IChild {
  id: string;
  nome: string;
  dataNascimento: string;

  constructor(data: IChild) {
    this.id = data.id;
    this.nome = data.nome;
    this.dataNascimento = data.dataNascimento;
  }

  get idade(): number {
    const nascimento = new Date(this.dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();

    if (
      mesAtual < mesNascimento ||
      (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())
    ) {
      idade--;
    }

    return idade;
  }

  get idadeLabel(): string {
    const anos = this.idade;
    return anos === 1 ? '1 ano' : `${anos} anos`;
  }

  toFirestore(): IChild {
    return {
      id: this.id,
      nome: this.nome,
      dataNascimento: this.dataNascimento,
    };
  }

  static fromFirestore(data: IChild): Child {
    return new Child(data);
  }
}
