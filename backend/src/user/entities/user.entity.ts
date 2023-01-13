import { Role } from "src/role/enums/role.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    readonly id: string
    
    @Column({nullable: false})
    readonly email: string

    @Column({nullable: false})
    readonly password: string

    roles: Role[]
}
