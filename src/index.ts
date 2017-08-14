import 'source-map-support/register';
import 'reflect-metadata';

import { setupConnection, getConnection } from './connection';
import { ParentEntity } from './entities/parent';
import { ChildEntity } from './entities/child';

async function testBug() {
    await setupConnection();

    const childOne = new ChildEntity();
    const childTwo = new ChildEntity();

    const parent = new ParentEntity();
    parent.children = [
        childOne,
        childTwo
    ];
    parent.stringField = '1';
    
    childOne.parent = parent;
    childTwo.parent = parent;

    await getConnection().entityManager.transaction(async (transaction) => {
        await ParentEntity.repository.persist(parent);
        await ChildEntity.repository.persist([
            childOne,
            childTwo
        ]);
    });

    parent.stringField = '2';
    const childThree = new ChildEntity();
    childThree.parent = parent;
    parent.children = [childThree];

    await getConnection().entityManager.transaction(async (transaction) => {
        await ParentEntity.repository.persist(parent);
        await ChildEntity.repository.persist([
            childThree
        ]);
    });

    const children = await ChildEntity.repository.find({
        alias: 'child',
        leftJoinAndSelect: {
            'parent': 'child.parent'
        }
    });
    children.forEach((child) => {
        if (!child.parent) {
            throw new Error(`child's parent is null`)
        }
    });
}

testBug()
.then(() => {
    console.log('Done');
    process.exit(0);
})
.catch((err) => {
    console.error(err);
    process.exit(1);
})