// import axios from "axios";
function getProductList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/corgi/products`
    )
    .then(function (res) {
      console.log(res);
    });
}
getProductList();
