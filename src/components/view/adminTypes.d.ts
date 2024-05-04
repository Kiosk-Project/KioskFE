type OrderList = {
  id: number;
  orderListTime: string;
  orderListTotalPrice: number;
  orderListStatus: string;
  userId: number;
  orderItems: Order;
};

type Order = {
  orderId: number;
  product: Product;
  productAmount: number;
  totalPrice: number;
};
