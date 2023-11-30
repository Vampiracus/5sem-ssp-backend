export const userURL = '/user';
export const shipmentURL = '/shipment';
export const productURL = '/product';
export const orderURL = '/order';
export const managerURL = '/manager';
export const clientURL = '/client';
export const order_itemURL = '/order_item';
export const ordersNoContractURL = '/order/no_contract';

export const loginClientURL = '/login/client';
export const loginManagerURL = '/login/manager';
export const logoutURL = '/logout';

export const userDeletesOrderURL = '/order/:id';
export const userDeletesOrderItemURL = '/order_item/:id';
export const userSendsOrderURL = '/order/create/:id';
export const getMyOrdersURL = '/order/my';
export const getOrderItemsURL = '/order/items/:orderid';
export const getOrderShippedURL = '/order/shipped/:orderid';
export const managerSendsOrderBackURL = '/order/wait_for_changes/:id';
export const managerSetsOrderContractURL = '/order/has_contract/:id';
export const managerSetsOrderContractIsSignedURL = '/order/is_signed/:id';
export const managerSetsOrderIsReadyURL = '/order/ready/:id';
export const managerSetsOrderIsFinishedURL = '/order/finished/:id';
export const managerSetOrderManagerURL = '/order/set_manager/:id';
export const managerUnsetOrderManagerURL = '/order/unset_manager/:id';
