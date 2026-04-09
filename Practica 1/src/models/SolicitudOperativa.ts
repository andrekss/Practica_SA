import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

// Formateo Principal de la clase SolicitudOperativa con sus campos y validaciones
export enum EstadoSolicitud {
  REGISTRADA = 'registrada',
  EN_PROCESO = 'en_proceso',
  FINALIZADA = 'finalizada',
}

export class SolicitudOperativa extends Model {
  public id!: number;
  public titulo!: string;
  public area_solicitante!: string;
  public prioridad!: number;
  public costo_estimado!: number;
  public estado!: EstadoSolicitud;
}

SolicitudOperativa.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    area_solicitante: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prioridad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    costo_estimado: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM(...Object.values(EstadoSolicitud)),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'SolicitudOperativa',
    tableName: 'solicitudes_operativas',
    timestamps: false,
  }
);
