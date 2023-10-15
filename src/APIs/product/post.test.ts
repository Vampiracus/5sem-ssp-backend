import { expect } from 'chai';
import { beforeEach, describe, it } from 'mocha';
import postProduct from './post';

describe('propduct post api', () => {
    let counter = 0;

    beforeEach(() => {
        counter = 0;
        (globalThis.mysqlconn as any) = {
            query: () => {
                counter += 1;
            }, 
        };
    });

    it('should return string if an invalid object is passed', () => {
        expect(postProduct({})).not.eq(true);
        expect(postProduct({ name: 'name' })).not.eq(true);
        expect(postProduct({ cost: 123 })).not.eq(true);
        expect(postProduct({ name: 'name', cost: -123 })).not.eq(true);
        expect(postProduct({ name: 'name', cost: '123' })).not.eq(true);
        expect(postProduct({ name: 123, cost: 123 })).not.eq(true);
    });

    it('should try to insert the passed data to the database', () => {
        postProduct({ name: 'name', cost: 123 });

        expect(counter).eq(1);
    });
});
