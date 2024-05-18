import React from "react";
import { useDispatch } from "react-redux";
import {
  addToCart,
  decreaseQty,
  deleteFromCartStore,
} from "../../redux/actions/cartAction";

const CartRow = ({ fruit, index }) => {
  const dispatch = useDispatch();
  const { _id, name, quantity, picture, price } = fruit;
  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <div className="mask mask-squircle w-7 h-12">
              <img src={picture} alt={_id} />
            </div>
          </div>
          <div>
            <div className="font-bold">{name}</div>
          </div>
        </div>
      </td>
      <td>
        <button
          onClick={() => {
            dispatch(decreaseQty(fruit));
          }}
          className="btn btn-xs btn-success text-sm"
        >
          -
        </button>
        <span className="border py-1 px-3 mx-2">{quantity}</span>
        <button
          onClick={() => {
            dispatch(addToCart(fruit));
          }}
          className="btn btn-xs btn-success text-sm"
        >
          +
        </button>
      </td>
      <td>{(price * quantity).toFixed(2)}</td>
      <th>
        <button
          onClick={() => dispatch(deleteFromCartStore(_id))}
          className="btn btn-error btn-sm"
        >
          X
        </button>
      </th>
    </tr>
  );
};

export default CartRow;
