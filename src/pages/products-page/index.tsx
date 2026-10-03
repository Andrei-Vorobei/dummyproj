import type { JSX } from 'react';

import { Button, Card, Flex, Pagination, Spin, Typography, type PaginationProps } from 'antd';
import { useEffect, useMemo } from 'react';

import { useGetProductsQuery, type Product } from '@/app-store/api/products-api';
import { getPageSize, setPageSize, getCurrentPage, setCurrentPage } from '@/app-store/reducers/app-global';
import { addToCart } from '@/app-store/reducers/cart-slice';
import { useAppDispatch, useAppSelector } from '@/hooks';

import styles from './productc-page.module.css';

const { Meta } = Card;

const ProductsPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const pageSize = useAppSelector(getPageSize);
  const currentPage = useAppSelector(getCurrentPage);
  const { data, error, isLoading } = useGetProductsQuery({ limit: pageSize, skip: (currentPage - 1) * pageSize });

  useEffect(() => {
    console.log('data: ', data);
  }, [data]);

  const errorMessage = useMemo(() => {
    if (!error) return null;
    return error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : (JSON.stringify(error) ?? 'Неизвестная ошибка');
  }, [error]);

  const addToCartHandler = (product: Product): void => {
    console.log('addToCart product: ', product);
    dispatch(addToCart(product));
  };

  const paginationHandler: PaginationProps['onChange'] = (current: number, pageSize: number): void => {
    console.log('Current page:', current);
    console.log('Page size:', pageSize);
    dispatch(setPageSize(pageSize));
    dispatch(setCurrentPage(current));
  };

  return (
    <>
      <h1>Products</h1>
      <p>Welcome to the Products page!</p>
      {error != null && <p>Ошибка: {errorMessage}</p>}
      {isLoading && (
        <Flex justify="center" align="center" className={styles.spinner}>
          <Spin size="large" />
        </Flex>
      )}
      <div className={styles.cardsContainer}>
        {data?.products.map((product) => (
          <Card
            key={product.id}
            hoverable
            title={product.title}
            className={styles.productCard}
            cover={<img src={product.thumbnail} alt={product.title} />}
          >
            <Flex vertical justify="space-between" gap={8}>
              <Meta
                description={
                  product.description.length > 100
                    ? `${product.description.slice(0, 100)}...`
                    : product.description
                }
              />
              <Typography.Text strong>скидка: {product.discountPercentage}%</Typography.Text>
              <Typography.Text strong>${product.price}</Typography.Text>
              <Typography.Text strong>
                ${(product.price - (product.price * product.discountPercentage) / 100).toFixed(2)}
              </Typography.Text>
              <Typography.Text strong>рэйтинг: {product.rating}</Typography.Text>
              <Button type="primary" onClick={() => addToCartHandler(product)}>
                Add to Cart
              </Button>
            </Flex>
          </Card>
        ))}
      </div>
      <Pagination
        disabled={isLoading}
        pageSize={pageSize}
        current={currentPage}
        style={{ marginTop: '16px' }}
        align="center"
        showSizeChanger
        onChange={paginationHandler}
        defaultCurrent={1}
        total={data?.total ?? 0}
        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
      />
    </>
  );
};

export default ProductsPage;
