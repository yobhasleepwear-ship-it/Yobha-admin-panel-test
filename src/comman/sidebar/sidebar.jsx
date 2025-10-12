import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Sidebar = () => {
  const [openTab, setOpenTab] = useState(null);

  const toggleTab = (tab) => {
    setOpenTab(openTab === tab ? null : tab);
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 text-black flex flex-col">
      <h1 className="text-xl font-bold p-4 border-b border-gray-200">Dashboard</h1>

      {/* Product Accordion */}
      <div className="flex flex-col">
        <button
          onClick={() => toggleTab("product")}
          className="flex justify-between items-center p-4 hover:bg-gray-100 w-full text-left"
        >
          Product
          {openTab === "product" ? <ChevronUp /> : <ChevronDown />}
        </button>
        {openTab === "product" && (
          <div className="flex flex-col pl-6 bg-gray-50">
            <a
              href="/add-product"
              className="p-2 hover:bg-gray-200 rounded"
            >
              Add Product
            </a>
            <a
              href="/edit-product"
              className="p-2 hover:bg-gray-200 rounded"
            >
              Edit Product
            </a>
          </div>
        )}
      </div>

      {/* Orders Accordion */}
      <div className="flex flex-col">
        <button
          onClick={() => toggleTab("orders")}
          className="flex justify-between items-center p-4 hover:bg-gray-100 w-full text-left"
        >
          Orders
          {openTab === "orders" ? <ChevronUp /> : <ChevronDown />}
        </button>
        {openTab === "orders" && (
          <div className="flex flex-col pl-6 bg-gray-50">
            <a
              href="/view-orders"
              className="p-2 hover:bg-gray-200 rounded"
            >
              View Orders
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
