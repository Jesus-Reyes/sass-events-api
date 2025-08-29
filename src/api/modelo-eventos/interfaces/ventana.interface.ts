export interface DiasSemana {
  L: boolean;  // Lunes
  M: boolean;  // Martes
  Mi: boolean; // Miércoles
  J: boolean;  // Jueves
  V: boolean;  // Viernes
  S: boolean;  // Sábado
  D: boolean;  // Domingo
}

export interface VentanaHoraria {
  horaInicio: string;     // Formato HH:mm
  horaFin: string;        // Formato HH:mm
  diasSemana: DiasSemana;
  diasInhabiles: boolean;
}

export interface VentanasOperacion {
  ventanaGeneral: VentanaHoraria[];
  ventanaCritica: VentanaHoraria[];
  ventanaNoCritica: VentanaHoraria[];
}
