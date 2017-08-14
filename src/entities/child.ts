import { ParentEntity } from './parent';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { getConnection } from '../connection';

@Entity()
export class ChildEntity {
    @PrimaryGeneratedColumn()
    childId: number;

    @ManyToOne(() => ParentEntity, parentEntity => parentEntity.children)
    parent: ParentEntity;

    static get repository() {
        return getConnection().getRepository(ChildEntity);
    }
}