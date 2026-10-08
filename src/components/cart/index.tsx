import type { JSX } from 'react';

import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Typography } from 'antd';

import type { CartProduct, CartResponse } from '@/app-store/api/cart-api';

import styles from './cart.module.css';

type CartProps = {
  cart: CartResponse;
  onRemoveProduct: (productId: number) => void;
  onChangeQuantity: (productId: number, change: -1 | 1) => void;
  onClearCart: () => void;
};

const formatPrice = (amount: number): string =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'USD' }).format(amount);

const Cart = ({ cart, onRemoveProduct, onChangeQuantity, onClearCart }: CartProps): JSX.Element => {
  return (
    <div className={styles.cart}>
      <ul className={styles.products}>
        {cart.products.map((product: CartProduct) => (
          <li className={styles.product} key={product.id}>
            <img className={styles.thumbnail} src={product.thumbnail} alt="" />
            <div className={styles.productInfo}>
              <h3 className={styles.productTitle}>{product.title}</h3>
              <div className={styles.quantityControls}>
                <Button
                  aria-label={`Уменьшить количество товара ${product.title}`}
                  disabled={product.quantity <= 1}
                  icon={<MinusOutlined />}
                  onClick={() => onChangeQuantity(product.id, -1)}
                  size="small"
                />
                <span className={styles.quantity} aria-label={`Количество: ${product.quantity}`}>
                  {product.quantity}
                </span>
                <Button
                  aria-label={`Увеличить количество товара ${product.title}`}
                  icon={<PlusOutlined />}
                  onClick={() => onChangeQuantity(product.id, 1)}
                  size="small"
                />
                <span className={styles.unitPrice}>{formatPrice(product.price)} / шт.</span>
              </div>
              {product.discountPercentage > 0 ? (
                <p className={styles.discount}>Скидка {product.discountPercentage}%</p>
              ) : null}
            </div>
            <div className={styles.productTotal}>
              {product.discountPercentage > 0 ? (
                <span className={styles.originalPrice}>{formatPrice(product.total)}</span>
              ) : null}
              <strong>{formatPrice(product.discountedTotal)}</strong>
            </div>
            <Button
              aria-label={`Удалить ${product.title} из корзины`}
              danger
              icon={<DeleteOutlined />}
              onClick={() => onRemoveProduct(product.id)}
            />
          </li>
        ))}
      </ul>
      <Divider />
      <div className={styles.summary}>
        <div className={styles.summaryLine}>
          <Typography.Text type="secondary">Товаров</Typography.Text>
          <Typography.Text>{cart.totalQuantity}</Typography.Text>
        </div>
        <div className={styles.summaryLine}>
          <Typography.Text type="secondary">Сумма без скидки</Typography.Text>
          <Typography.Text delete={cart.total !== cart.discountedTotal}>{formatPrice(cart.total)}</Typography.Text>
        </div>
        <div className={styles.summaryLine}>
          <Typography.Text strong>Итого</Typography.Text>
          <Typography.Text className={styles.grandTotal} strong>
            {formatPrice(cart.discountedTotal)}
          </Typography.Text>
        </div>
        <Button className={styles.clearButton} danger onClick={onClearCart}>
          Очистить корзину
        </Button>
      </div>
    </div>
  );
};

export default Cart;
