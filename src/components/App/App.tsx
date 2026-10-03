import type { JSX } from 'react';

import { DeleteOutlined, HomeFilled, ProductFilled, ShoppingCartOutlined, StarFilled } from '@ant-design/icons';
import { Button, Divider, Empty, Flex, FloatButton, Layout, Menu, Modal, theme, Typography } from 'antd';
import { useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

import { useGetCartQuery } from '@/app-store/api/cart-api';
import { getIsOpenCartModal, setIsOpenCartModal } from '@/app-store/reducers/app-global';
import { getCart, clearCart, removeFromCart, getCount } from '@/app-store/reducers/cart-slice';
import { useAppDispatch, useAppSelector } from '@/hooks';

const { Header, Content, Footer, Sider } = Layout;

const { Text } = Typography;

const App: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const isOpenCartModal = useAppSelector(getIsOpenCartModal);

  useGetCartQuery();
  const cart = useAppSelector(getCart);
  const cartCount = useAppSelector(getCount);

  const sidebarItems = useMemo(() => {
    return [
      {
        key: '/',
        icon: <HomeFilled />,
        label: 'Home',
      },
      {
        key: '/products',
        icon: <ProductFilled />,
        label: 'Products',
      },
      {
        key: '/favorites',
        icon: <StarFilled />,
        label: 'Favorites',
      },
      {
        key: '/contact',
        icon: <StarFilled />,
        label: 'Contact',
      },
    ];
  }, []);

  useEffect(() => {
    console.log('cart: ', cart);
    console.log('location: ', location);
  }, [cart, location]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const currentYear = new Date().getFullYear();

  const handleCartModal = (isOpen: boolean): void => {
    dispatch(setIsOpenCartModal(isOpen));
  };

  const handleClearCart = (): void => {
    dispatch(clearCart());
  };

  const handleRemoveFromCart = (productId: number): void => {
    dispatch(removeFromCart(productId));
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <Menu
          theme="dark"
          mode="inline"
          items={sidebarItems}
          onClick={({ key }) => {
            void navigate(String(key));
          }}
          selectedKeys={[location.pathname]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <Outlet />
          <FloatButton
            style={{ height: '70px', width: '70px' }}
            tooltip="Корзина"
            onClick={(): void => handleCartModal(true)}
            icon={<ShoppingCartOutlined style={{ fontSize: '40px' }} />}
            badge={{ count: cartCount, color: 'red' }}
          />
          <Modal
            title="Корзина"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isOpenCartModal}
            onOk={(): void => handleCartModal(false)}
            onCancel={(): void => handleCartModal(false)}
          >
            {cart && cart.products.length > 0 ? (
              <Flex vertical gap={16}>
                {/* Список товаров */}
                <Flex vertical gap={8}>
                  {cart.products.map((product) => (
                    <Flex
                      key={product.id}
                      justify="space-between"
                      align="center"
                      style={{
                        padding: '12px',
                        border: '1px solid #f0f0f0',
                        borderRadius: '8px',
                        background: '#fafafa',
                      }}
                    >
                      <Flex vertical style={{ flex: 1 }}>
                        <Text strong>{product.title}</Text>
                        <Flex vertical>
                          <Text type="secondary">
                            Цена без скидки: ${product.price} × {product.quantity} = ${product.total}
                          </Text>
                          <Text type="secondary">Скидка: {product.discountPercentage}%</Text>
                          <Text type="secondary">
                            Цена с учетом скидки: ${product.price} × {product.discountPercentage}% = $
                            {(product.total - (product.total * product.discountPercentage) / 100).toFixed(2)}
                          </Text>
                        </Flex>
                      </Flex>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={(): void => handleRemoveFromCart(product.id)}
                      />
                    </Flex>
                  ))}
                </Flex>

                {/* Итоговая сумма */}
                <Divider />
                <Flex vertical gap={8}>
                  <Flex justify="space-between" align="center">
                    <Text strong>Итого без скидки:</Text>
                    <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                      ${cart.total}
                    </Text>
                  </Flex>
                  <Flex justify="space-between" align="center">
                    <Text strong>Итого с учетом скидки:</Text>
                    <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                      ${cart.discountedTotal}
                    </Text>
                  </Flex>
                </Flex>

                {/* Кнопка очистки корзины */}
                <Button type="link" danger onClick={handleClearCart} style={{ padding: 0, marginTop: '8px' }}>
                  Очистить корзину
                </Button>
              </Flex>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Ваша корзина пуста"
                style={{ margin: '24px 0' }}
              />
            )}
          </Modal>
        </Content>
        <Footer style={{ textAlign: 'center' }}>©{currentYear} Created</Footer>
      </Layout>
    </Layout>
  );
};

export default App;
