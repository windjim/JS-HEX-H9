import axios from "../node_modules/axios/dist/esm/axios.js";
// 變數設定
const productList = document.querySelector(".productWrap");
const productSelect = document.querySelector(".productSelect");
const cartList = document.querySelector(".shoppingCartContent");
const deleteCartAllBtn = document.querySelector(".discardAllBtn");
const finalTotal = document.querySelector(".finalTotalPrice");
let productTotalData;
let cartTotalData;
let finalTotalPrice;
function init() {
  getProductList();
  getCartList();
}
init();
// 抓取產品
function getProductList() {
  axios.get(`${apiUrl}/${api_path}/products`).then(function (res) {
    productTotalData = res.data.products;
    renderProductList();
  });
}

// 渲染productList
function renderProductList() {
  let str = "";
  // ForEach寫法
  // productTotalData.forEach((item) => {
  //   str += `
  //   <li class="productCard">
  //     <h4 class="productType">新品</h4>
  //     <img
  //       src=${item.images}
  //     alt=""
  //     />
  //     <a href="#" class="addCardBtn">加入購物車</a>
  //     <h3>${item.title}</h3>
  //     <del class="originPrice">${item.origin_price}</del>
  //     <p class="nowPrice">${item.price}</p>
  //   </li>`;
  // });
  // map寫法
  productList.innerHTML = productTotalData
    .map((item) => productHtmlStructure(item))
    .join("");
}

// 產品HTML結構
function productHtmlStructure(item) {
  return `
  <li class="productCard">
    <h4 class="productType">新品</h4>
    <img
      src=${item.images}
      alt=""
    />
    <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
    <h3>${item.title}</h3>
    <del class="originPrice">NT$${item.origin_price}</del>
    <p class="nowPrice">NT$${item.price}</p>
  </li>
`;
}

// 表單選值監聽
productSelect.addEventListener("change", (e) => {
  const category = e.target.value;
  let str = "";
  if (category === "全部") {
    renderProductList();
    return;
  }
  productTotalData.forEach((item) => {
    if (item.category === category) {
      str += productHtmlStructure(item);
    }
  });
  productList.innerHTML = str;
});

// 抓取購物車資料
function getCartList() {
  axios
    .get(`${apiUrl}/${api_path}/carts`)
    .then((res) => {
      cartTotalData = res.data.carts;
      finalTotalPrice = res.data.finalTotal;
      renderCartList();
    })
    .catch((err) => {
      console.log(err);
    });
}

// 渲染購物車畫面
function renderCartList() {
  cartList.innerHTML = cartTotalData
    .map((item) => cartHtmlStructure(item))
    .join("");
  finalTotal.textContent = finalTotalPrice;
}

// 購物車HTML結構
function cartHtmlStructure(item) {
  let totalPrice = item.product.price * item.quantity;
  return `
  <tr>
    <td>
      <div class="cardItem-title">
        <img src="${item.product.images}" alt="" />
        <p>${item.product.title}</p>
      </div>
    </td>
    <td>NT$${item.product.price}</td>
    <td>${item.quantity}</td>
    <td>NT$${totalPrice}</td>
    <td class="discardBtn">
      <a href="#" class="material-icons" cart-id="${item.id}"> clear </a>
    </td>
  </tr>
  `;
}

// 新增購物車品項
function addCartNumber(productId, productNum) {
  axios
    .post(`${apiUrl}/${api_path}/carts`, {
      data: {
        productId: productId,
        quantity: productNum,
      },
    })
    .then((res) => {
      getCartList();
    })
    .catch((err) => {
      console.log(err);
    });
}

// 加入購物車監聽
productList.addEventListener("click", (e) => {
  e.preventDefault();
  const target = e.target.getAttribute("class");
  if (target !== "addCardBtn") {
    return;
  }
  let productId = e.target.getAttribute("data-id");
  let productNum = 1;
  cartTotalData.forEach((item) => {
    if (item.product.id === productId) {
      productNum = item.quantity += 1;
    }
  });
  addCartNumber(productId, productNum);
});

// 刪除購物車單品項
function deleteCartNumber(deleteCartId) {
  axios
    .delete(`${apiUrl}/${api_path}/carts/${deleteCartId}`)
    .then((res) => {
      getCartList();
    })
    .catch((err) => {
      console.log(err);
    });
}

// 刪除購物車單項監聽
cartList.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.getAttribute("class") !== "material-icons") {
    return;
  }
  let deleteCartId = e.target.getAttribute("cart-id");
  deleteCartNumber(deleteCartId);
});

// 刪除購物車全品項
function deleteAllCartNumber() {
  axios
    .delete(`${apiUrl}/${api_path}/carts`)
    .then((res) => {
      getCartList();
    })
    .catch((err) => {
      console.log(err);
    });
}
// 刪除購物車全部監聽
deleteCartAllBtn.addEventListener("click", (e) => {
  e.preventDefault();
  deleteAllCartNumber();
});
