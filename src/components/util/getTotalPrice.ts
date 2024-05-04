export const getTotalPrice = (myCart: Order[]) => {
  const prices: number[] = myCart.map((item) => item.product.productPrice);

  const totalPrice = prices.length
    ? prices?.reduce((acc, curr) => {
        return acc + curr;
      })
    : 0;

  return totalPrice;
};
