import React, { FC, useState } from "react";
import { Button, Box, Header, Icon, Page, Text } from "zmp-ui";
import { Payment } from "zmp-sdk";
import subscriptionDecor from "static/subscription-decor.svg";
import { ListRenderer } from "components/list-renderer";
import { useToBeImplemented } from "hooks";
import {getMacAndOrderData} from "../../ai/order.js"

const handleCreateOrder = async (setOrderId) => {
  try {
    // Order data
    const orderData = {
      amount: 50000,
      desc: "Thanh toán 50.000",
      extradata: JSON.stringify({
        storeName: "Cửa hàng A",
        storeId: "123",
        orderGroupId: "345",
        myTransactionId: "12345678",
        notes: "Đây là giá trị gửi thêm",
      }),
      method: JSON.stringify({
        id: "COD_SANBOX",
        isCustom: false,
      }),
      item: [
        { id: "1", amount: 20000 },
        { id: "2", amount: 30000 },
      ],
    };

    // Get MAC and updated order data from the server
    const { mac, orderData: updatedOrderData } = await getMacAndOrderData(orderData);
    console.log('Received MAC:', mac);

    // Add MAC to order data
    const finalOrderData = {
      ...updatedOrderData,
      mac,
    };
    console.log('Final Order Data:', finalOrderData);
    console.log('Input parameters for Payment.createOrder:', {
      desc: orderData.desc,
      item: orderData.item,
      amount: orderData.amount,
      mac: mac,
    });
    // Send the create order request with MAC
    Payment.createOrder({
      desc: orderData.desc,
      item: orderData.item,
      amount: orderData.amount,
      mac: mac,
      success: function(data) {
        // Order creation successful
        const orderId = data.orderId;
        console.log('Order ID:', orderId);
        setOrderId(orderId);
      },
      fail: function(err) {
        // Order creation failed
        console.error('Order creation failed:', err);
      },
    });
  } catch (error) {
    console.error('Error in handleCreateOrder:', error);
  }
};


const Subscription = function() {
  const onClick = useToBeImplemented();
  return (
    <Box className="m-4" onClick={onClick}>
      <Box
        className="bg-green text-white rounded-xl p-4 space-y-2"
        style={{
          backgroundImage: `url(${subscriptionDecor})`,
          backgroundPosition: "right 8px center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Text.Title className="font-bold">Đăng ký thành viên</Text.Title>
        <Text size="xxSmall">Tích điểm đổi thưởng, mở rộng tiện ích</Text>
      </Box>
    </Box>
  );
};

const Personal = function() {
  const onClick = useToBeImplemented();

  return (
    <Box className="m-4">
      <ListRenderer
        title="Cá nhân"
        onClick={onClick}
        items={[
          {
            left: <Icon icon="zi-user" />,
            right: (
              <Box flex>
                <Text.Header className="flex-1 items-center font-normal">
                  Thông tin tài khoản
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
          {
            left: <Icon icon="zi-clock-2" />,
            right: (
              <Box flex>
                <Text.Header className="flex-1 items-center font-normal">
                  Lịch sử đơn hàng
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
        ]}
        renderLeft={(item) => item.left}
        renderRight={(item) => item.right}
      />
    </Box>
  );
};

const Other = function() {
  const onClick = useToBeImplemented();

  return (
    <Box className="m-4">
      <ListRenderer
        title="Khác"
        onClick={onClick}
        items={[
          {
            left: <Icon icon="zi-star" />,
            right: (
              <Box flex>
                <Text.Header className="flex-1 items-center font-normal">
                  Đánh giá đơn hàng
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
          {
            left: <Icon icon="zi-call" />,
            right: (
              <Box flex>
                <Text.Header className="flex-1 items-center font-normal">
                  Liên hệ và góp ý
                </Text.Header>
                <Icon icon="zi-chevron-right" />
              </Box>
            ),
          },
        ]}
        renderLeft={(item) => item.left}
        renderRight={(item) => item.right}
      />
    </Box>
  );
};

const ProfilePage = function() {
  const [orderId, setOrderId] = useState("");

  return (
    <Page>
      <Header showBackIcon={false} title="&nbsp;" />
      <Subscription />
      <Personal />
      <Other />
      <Box className="m-4">
        <Button onClick={() => handleCreateOrder(setOrderId)} className="bg-blue-500 text-white">
          Tạo Đơn Hàng
        </Button>
        {orderId && <Box>Order ID: {orderId}</Box>}
      </Box>
    </Page>
  );
};

export default ProfilePage;