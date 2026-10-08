import type { JSX } from 'react';

import { Flex, Pagination, Spin, type PaginationProps } from 'antd';
import { useMemo } from 'react';

import { useGetProductsQuery, type Product } from '@/app-store/api/products-api';
import { getPageSize, setPageSize, getCurrentPage, setCurrentPage } from '@/app-store/reducers/app-global';
import { addToCart } from '@/app-store/reducers/cart-slice';
import ProductCard from '@/components/product-card';
import { useAppDispatch, useAppSelector } from '@/hooks';

import styles from './productc-page.module.css';

const ProductsPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const pageSize = useAppSelector(getPageSize);
  const currentPage = useAppSelector(getCurrentPage);
  const { data, error, isLoading } = useGetProductsQuery({ limit: pageSize, skip: (currentPage - 1) * pageSize });

  // useEffect(() => {
  //   console.log('data: ', data);
  // }, [data]);

  const errorMessage = useMemo(() => {
    if (!error) return null;
    return error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : (JSON.stringify(error) ?? 'Неизвестная ошибка');
  }, [error]);

  const addToCartHandler = (product: Product): void => {
    // console.log('addToCart product: ', product);
    dispatch(addToCart(product));
  };

  const paginationHandler: PaginationProps['onChange'] = (current: number, pageSize: number): void => {
    // console.log('Current page:', current);
    // console.log('Page size:', pageSize);
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
      <ul className={styles.cardsContainer}>
        {data?.products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={addToCartHandler} />
        ))}
      </ul>
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
