import  db  from './index'
import { Model, DataTypes } from 'sequelize' 

export class Token extends Model{
    public id!: string;
    public token!: string;
    public user_id!:number;
    public status!:| 'active' | 'expired' | 'logout';
    public expired_at!:Date;

    public readonly created_at!: Date;
    public readonly updated_at!: Date;

}

Token.init(
    {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue:DataTypes.UUIDV4
        },
          token: {
            type:DataTypes.TEXT,
            allowNull:false
          },
          status: {
              type:DataTypes.STRING,
              defaultValue:'active'
          },
          expired_at: DataTypes.DATE,
        }, 
        {

            sequelize:db,
            tableName: 'tokens',
            underscored : true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
    }
);
