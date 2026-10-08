import type { JSX } from 'react';

import { HomeFilled, ProductFilled, ShoppingCartOutlined, StarFilled } from '@ant-design/icons';
import { Empty, FloatButton, Layout, Menu, Modal, theme } from 'antd';
import { useEffect, useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

import { useGetMeQuery, useRefreshQuery } from '@/app-store/api/auth';
import { useGetCartQuery } from '@/app-store/api/cart-api';
import { getIsOpenCartModal, setIsOpenCartModal } from '@/app-store/reducers/app-global';
import { getCart, clearCart, removeFromCart, changeQuantity, getCount } from '@/app-store/reducers/cart-slice';
import { getProfile } from '@/app-store/reducers/user-slice';
import Cart from '@/components/cart';
import { useAppDispatch, useAppSelector } from '@/hooks';

const { Header, Content, Footer, Sider } = Layout;

const App: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const isOpenCartModal = useAppSelector(getIsOpenCartModal);

  useRefreshQuery();
  const accessToken = useAppSelector((state) => state.user.accessToken);
  useGetMeQuery(undefined, { skip: !accessToken });
  useGetCartQuery();
  const cart = useAppSelector(getCart);
  const cartCount = useAppSelector(getCount);
  const profile = useAppSelector(getProfile);

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
        key: '/login',
        icon: <StarFilled />,
        label: 'login',
      },
      {
        key: '/register',
        icon: <StarFilled />,
        label: 'register',
      },
      {
        key: '/profile',
        icon: <StarFilled />,
        label: 'profile',
      },
    ];
  }, []);

  useEffect(() => {
    // console.log('cart: ', cart);
    console.log('location: ', location);
    console.log('profile: ', profile);
  }, [cart, location, profile]);

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

  const handleChangeQuantity = (productId: number, change: -1 | 1): void => {
    dispatch(changeQuantity({ productId, change }));
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
              <Cart
                cart={cart}
                onRemoveProduct={handleRemoveFromCart}
                onChangeQuantity={handleChangeQuantity}
                onClearCart={handleClearCart}
              />
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
