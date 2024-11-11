import axios from "axios";
import { BASE_URL, FLW_SECRET_KEY, PLAN_ID } from "../core/config.js";
import Flutterwave from "flutterwave-node";
import { log } from "util";

const public_key: any = process.env.FLW_PUBLIC_KEY;
const secret_key: any = process.env.FLW_SECRET_KEY;
const flw = new Flutterwave(public_key, secret_key, false);

const intializePayment = async (
  email: string,
  phoneNumber: string,
  name: string,
  user_id: string
) => {
  try {
    let data = JSON.stringify({
      tx_ref: "MN_" + Math.floor(Math.random() * 1000000 + 1),
      amount: "100",
      currency: "NGN",
      redirect_url: "http://localhost:3000/verifypayments",
      meta: {
        user_id,
      },
      customer: {
        email,
        phoneNumber,
        name,
      },
      payment_plan: PLAN_ID,
      payment_options: "card, banktransfer",
      customizations: {
        title: "Market NG.",
        // logo: "http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png",
      },
    });
    let config = {
      method: "post",
      url: `${BASE_URL}/payments`,
      headers: {
        Authorization: `Bearer ${FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      data: data,
    };
    const response = await axios(config);
    const resData = response.data;
    return resData;
  } catch (err: any) {
    console.log(err);
    console.log(err.code);
    console.log(err.response.body);
  }
};

const flutterResponse = async (
  amount: number,
  tx_ref: string,
  transaction_id: string
) => {
  try {
    
  let config = {
    method: "get",
    url: `${BASE_URL}/transactions/${transaction_id}/verify`,
    headers: {
      Authorization: `Bearer ${FLW_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };
  const res = await axios(config);
  if (
    res.data.data.status == "successful" &&
    res.data.data.amount == amount &&
    res.data.data.currency === "NGN"
  ) {
    let user_id = res.data.data.meta.userId;
    let status_ = res.data.data.status;

    // //kindly save this correctly
    // const flutterDetails = new FlutterSchema({
    //   amount,
    //   status,
    //   tx_ref,
    //   transaction_id,
    //   user_id,
    // });
    // flutterDetails.save();

    return res.data.data;
  }
  // Inform the customer their payment was unsuccessful
  console.log("Payment Failed.");

  return {
    msg: "Payment Failed",
    status: res.data.data.status,
    tx_ref,
  };
  } catch (err: any) {
    return {
      msg: err.message,
      status: err.code,
    };
  }
    }

export { intializePayment, flutterResponse };
