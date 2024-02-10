import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UpdateProduct = () => {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [fruit, setFruit] = useState([]);
  const {
    _id,
    name,
    price,
    picture,
    isActive,
    description,
    quantity,
    company,
  } = fruit;
  useEffect(() => {
    const getItem = async () => {
      const headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      };
      const url = `https://fruit-mart-server.onrender.com/api/v1/fruits/${id}`;
      const { data } = await axios.get(url, { headers: headers });
      console.log(data);
      setFruit(data.fruit);
    };
    getItem();
  }, [id]);

  const fileToBase64 = (file, cb) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      cb(null, reader.result);
    };
    reader.onerror = function (error) {
      cb(error, null);
    };
  };

  const onUploadFileChange = ({ target }) => {
    if (target.files < 1 || !target.validity.valid) {
      return;
    }
    fileToBase64(target.files[0], (err, result) => {
      if (result) {
        setFile(result);
        setFileName(target.files[0]);
      }
    });
  };
  const updateFruit = async (e) => {
    e.preventDefault();
    console.log("Submitting");
    let fruitName = e.target.fruitName.value;
    let price = e.target.price.value;
    let quantity = e.target.quantity.value; 
    let desc = e.target.desc.value;
    let company = e.target.company.value;
    const fruitObject = {
      name: fruitName,
      price: price,
      inStock: true,
      picture: file || picture,
      quantity: quantity,
      description: desc,
      company: company,
    };
    console.log("editing fruit object", fruitObject);
    const url = `https://fruit-mart-server.onrender.com/api/v1/fruits/update-fruit/${_id}`;
    const { data } = await axios.put(url, fruitObject);
    console.log(data);
  };
  return (
    <section className="max-w-4xl mt-4 p-6 mx-auto bg-white rounded-md shadow-md ">
      <h2 className="text-lg font-semibold text-gray-700 capitalize">
        Update Fruit {id}
      </h2>

      <form onSubmit={updateFruit}>
        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
          <div>
            <label className="text-gray-700 " htmlFor="fruitName">
              Fruit Name
            </label>
            <input
              required
              id="fruitName"
              name="fruitName"
              type="text"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md    focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 -300 focus:outline-none focus:ring"
              defaultValue={name}
            />
          </div>

          <div>
            <label className="text-gray-700 " htmlFor="price">
              Price
            </label>
            <input
              required
              type="number"
              name="price"
              id="price"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md    focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 -300 focus:outline-none focus:ring"
              defaultValue={price}
            />
          </div>

          <div>
            <label className="text-gray-700 " htmlFor="password">
              Quantity
            </label>
            <input
              required
              id="quantity"
              type="number"
              name="quantity"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md    focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 -300 focus:outline-none focus:ring"
              defaultValue={quantity}
            />
          </div>

          <div>
            <label className="text-gray-700 " htmlFor="passwordConfirmation">
              Picture
            </label>
            <input
              onChange={onUploadFileChange}
              type="file"
              id="picture"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md    focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 -300 focus:outline-none focus:ring"
            />
          </div>
        </div>
        <div className="w-full my-4">
          <label className="text-gray-700 " htmlFor="description">
            Description
          </label>

          <textarea
            name="desc"
            id="desc"
            className="block w-full h-40 px-4 py-2 text-gray-700 bg-white border rounded-md    focus:border-blue-400 -300 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 "
            placeholder="description"
            defaultValue={description}
          ></textarea>
        </div>

        <div>
          <label className="text-gray-700" htmlFor="fruitName">
            Company
          </label>
          <input
            required
            id="company"
            name="company"
            type="text"
            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md    focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 -300 focus:outline-none focus:ring"
            defaultValue={company}
          />
        </div>

        <div className="flex justify-end mt-6">
          <input
            type="submit"
            className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-orange-600 rounded-md hover:bg-orange-600 focus:outline-none focus:bg-orange-600"
            value="Add Fruit"
          />
        </div>
      </form>
    </section>
  );
};

export default UpdateProduct;
