import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
    isProduction: process.env.PRODUCTION == "false" ? false : true,
    serverKey: process.env.MIDTRANS_SERVER_KEY || "",
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "",
});

interface ProductCheckout {
    id: string;
    product_name: string;
    price: number;
    quantity: number;
}

export async function paymentProduct(product: ProductCheckout) {
    // const params = {
    //     transaction_details: {
    //         order_id: id,
    //         gross_amount: price * quantity,
    //     },
    //     item_details: [
    //         {
    //             id: id,
    //             price: price,
    //             quantity: quantity,
    //             name: productName,
    //         },
    //     ],
    // };
    // const token = await snap.createTransactionToken(params);
    // return token;
}
