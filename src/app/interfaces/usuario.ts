export interface Usuario {
  uid: string;
  email: string;
  displayName?: string;
  newUser?: boolean;
  edad?: number;
}

export interface Partido {
  uid: string;
  equipoL: string;
  equipoV: string;
  golesL: number;
  golesV: number;
  fecha: number;
  categoria: Categoria;
  estado: Estado;
}

export interface Equipo {
  uid: string;
  categoria?: Categoria;
  jugadores: Jugador[];
  partidos?: Partido[];
  Entrenador: Usuario;
}

export interface Jugador extends Usuario {
  posicion?: string;
  equipo?: Equipo[];
  partidos?: Partido[];
  categoria?: Categoria;
}

export enum Estado {
  suspendido = "suspendido",
  completado = "completado",
  pendiente = "pendiente",
  aplazado = "aplazado",
}

export enum Categoria {
  benjamin = "benjamin",
  alevin = "alevin",
  infantilF = "infantil Femenino",
  infantilM = "infantil Masculino",
  cadeteF = "cadete Femenino",
  cadeteM = "cadete Masculino",
  Juvenil = "juvenil",
  SeniorA = "senior A",
  SeniorB = "seniorB"
}
