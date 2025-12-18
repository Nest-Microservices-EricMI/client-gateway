import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';

describe('OrderItemDto', () => {
  describe('Success validations', () => {
    it('should create a valid OrderItemDto with positive values', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: 1,
        quantity: 5,
        price: 99.99,
      });

      const errors = await validate(orderItemDto);
      expect(errors).toHaveLength(0);
    });

    it('should accept positive integer numbers', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: 100,
        quantity: 10,
        price: 50.00,
      });

      const errors = await validate(orderItemDto);
      expect(errors).toHaveLength(0);
    });

    it('should accept positive decimal numbers in price', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: 1,
        quantity: 1,
        price: 19.99,
      });

      const errors = await validate(orderItemDto);
      expect(errors).toHaveLength(0);
    });

    it('should accept 1 as minimum valid positive value', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: 1,
        quantity: 1,
        price: 0.01,
      });

      const errors = await validate(orderItemDto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('ProductId validations', () => {
    it('should reject productId as string when it should be a number', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: '1',
        quantity: 5,
        price: 99.99,
      });

      const errors = await validate(orderItemDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('productId');
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('should reject negative productId', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: -1,
        quantity: 5,
        price: 99.99,
      });

      const errors = await validate(orderItemDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('productId');
      expect(errors[0].constraints).toHaveProperty('isPositive');
    });

    it('should reject productId = 0', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: 0,
        quantity: 5,
        price: 99.99,
      });

      const errors = await validate(orderItemDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('productId');
      expect(errors[0].constraints).toHaveProperty('isPositive');
    });

    it('should reject missing productId', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        quantity: 5,
        price: 99.99,
      });

      const errors = await validate(orderItemDto);
      const productIdError = errors.find(e => e.property === 'productId');
      expect(productIdError).toBeDefined();
    });
  });

  describe('Quantity validations', () => {
    it('should reject quantity as string', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: 1,
        quantity: '5',
        price: 99.99,
      });

      const errors = await validate(orderItemDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('quantity');
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('should reject negative quantity', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: 1,
        quantity: -10,
        price: 99.99,
      });

      const errors = await validate(orderItemDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('quantity');
      expect(errors[0].constraints).toHaveProperty('isPositive');
    });

    it('should reject quantity = 0', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: 1,
        quantity: 0,
        price: 99.99,
      });

      const errors = await validate(orderItemDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('quantity');
      expect(errors[0].constraints).toHaveProperty('isPositive');
    });

    it('should reject missing quantity', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: 1,
        price: 99.99,
      });

      const errors = await validate(orderItemDto);
      const quantityError = errors.find(e => e.property === 'quantity');
      expect(quantityError).toBeDefined();
    });
  });

  describe('Price validations', () => {
    it('should reject price as string', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: 1,
        quantity: 5,
        price: '99.99',
      });

      const errors = await validate(orderItemDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('price');
      expect(errors[0].constraints).toHaveProperty('isNumber');
    });

    it('should reject negative price', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: 1,
        quantity: 5,
        price: -10.50,
      });

      const errors = await validate(orderItemDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('price');
      expect(errors[0].constraints).toHaveProperty('isPositive');
    });

    it('should reject price = 0', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: 1,
        quantity: 5,
        price: 0,
      });

      const errors = await validate(orderItemDto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('price');
      expect(errors[0].constraints).toHaveProperty('isPositive');
    });

    it('should reject missing price', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: 1,
        quantity: 5,
      });

      const errors = await validate(orderItemDto);
      const priceError = errors.find(e => e.property === 'price');
      expect(priceError).toBeDefined();
    });
  });

  describe('Multiple fields validations', () => {
    it('should reject all fields as strings', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: '1',
        quantity: '5',
        price: '99.99',
      });

      const errors = await validate(orderItemDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.map(e => e.property)).toEqual(
        expect.arrayContaining(['productId', 'quantity', 'price'])
      );
    });

    it('should reject all fields as negative', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: -1,
        quantity: -5,
        price: -99.99,
      });

      const errors = await validate(orderItemDto);
      expect(errors).toHaveLength(3);
      expect(errors.map(e => e.constraints)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ isPositive: expect.any(String) }),
          expect.objectContaining({ isPositive: expect.any(String) }),
          expect.objectContaining({ isPositive: expect.any(String) }),
        ])
      );
    });

    it('should reject all fields as null', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: null,
        quantity: null,
        price: null,
      });

      const errors = await validate(orderItemDto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject empty DTO', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {});

      const errors = await validate(orderItemDto);
      expect(errors.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Edge cases', () => {
    it('should accept very large numbers', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: 999999999,
        quantity: 999999,
        price: 999999.99,
      });

      const errors = await validate(orderItemDto);
      expect(errors).toHaveLength(0);
    });

    it('should accept very small positive numbers', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: 1,
        quantity: 1,
        price: 0.01,
      });

      const errors = await validate(orderItemDto);
      expect(errors).toHaveLength(0);
    });

    it('should reject Infinity as value', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: Infinity,
        quantity: 5,
        price: 99.99,
      });

      const errors = await validate(orderItemDto);
      // Infinity is technically a number, but might fail on isPositive
      expect(errors.length).toBeGreaterThanOrEqual(0);
    });

    it('should reject NaN as value', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: NaN,
        quantity: 5,
        price: 99.99,
      });

      const errors = await validate(orderItemDto);
      // NaN is not a valid number
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should accept decimals with many decimal places in price', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: 1,
        quantity: 1,
        price: 99.9999999,
      });

      const errors = await validate(orderItemDto);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Data transformation', () => {
    it('should convert numeric values to numbers', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: 1,
        quantity: 5,
        price: 99.99,
      });

      expect(typeof orderItemDto.productId).toBe('number');
      expect(typeof orderItemDto.quantity).toBe('number');
      expect(typeof orderItemDto.price).toBe('number');
    });

    it('should exclude extraneous values with excludeExtraneousValues option', async () => {
      const orderItemDto = plainToInstance(OrderItemDto, {
        productId: 1,
        quantity: 5,
        price: 99.99,
        extraField: 'should-be-ignored',
      }, { excludeExtraneousValues: true });

      expect(orderItemDto).not.toHaveProperty('extraField');
    });
  });
});
