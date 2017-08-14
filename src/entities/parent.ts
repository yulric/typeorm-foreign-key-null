import { ChildEntity } from './child';
import { Entity, OneToMany, PrimaryGeneratedColumn, Column } from 'typeorm';
import { getConnection } from '../connection';

@Entity()
export class ParentEntity {
    @PrimaryGeneratedColumn()
    parentId: number;

    @Column('string')
    stringField: string;

    @OneToMany(() => ChildEntity, childEntity => childEntity.parent)
    children: Array<ChildEntity>;

    static get repository() {
        return getConnection().getRepository(ParentEntity);
    }
}