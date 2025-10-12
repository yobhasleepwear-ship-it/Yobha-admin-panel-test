import React, { useState } from "react";

// ProductForm.jsx
// Single-file React component (Tailwind CSS) that builds the product payload and console.logs it.
// Usage: drop into a React app (create-react-app / Vite). Tailwind must be available in the project.

export default function ProductForm() {
  const [product, setProduct] = useState({
    ProductId: "PID10001",
    Name: "Luxe Cotton Nightshirt",
    Slug: "luxe-cotton-nightshirt",
    Description: "Lightweight, breathable cotton nightshirt with mother-of-pearl buttons.",
    Price: 1499.0,
    CompareAtPrice: 1999.0,
    DiscountPercent: 25,
    ProductMainCategory: "Sleepwear",
    ProductCategory: "Women",
    ProductSubCategory: "Nightshirts",

    SizeOfProduct: ["S", "M", "L", "XL"],
    AvailableColors: ["Navy", "Rose", "Blush"],
    FabricType: ["Cotton"],

    PriceList: [
      { Size: "S", PriceAmount: 1499.0, Currency: "INR", Quantity: 10, Country: "IN" },
      { Size: "M", PriceAmount: 1499.0, Currency: "INR", Quantity: 15, Country: "IN" },
    ],

    CountryPrices: [
      { Country: "IN", PriceAmount: 1499.0, Currency: "INR" },
      { Country: "US", PriceAmount: 24.99, Currency: "USD" },
    ],

    Specifications: {
      Fabric: "100% Cotton",
      Length: "Hip length",
      Origin: "Made in India",
      Fit: "Relaxed",
      Care: "Machine wash cold",
      Extra: [
        { Key: "Weight", Value: "220g" },
        { Key: "ModelSize", Value: "M" },
      ],
    },

    KeyFeatures: ["Breathable cotton", "Mother-of-pearl buttons"],
    CareInstructions: ["Machine wash cold", "Do not bleach"],

    Inventory: [
      { Sku: "PID10001-NAV-S", Size: "S", Color: "Navy", Quantity: 10 },
      { Sku: "PID10001-NAV-M", Size: "M", Color: "Navy", Quantity: 15 },
      { Sku: "PID10001-ROSE-S", Size: "S", Color: "Rose", Quantity: 8 },
    ],

    Variants: [
      { Sku: "PID10001-NAV-S", Color: "Navy", Size: "S", Quantity: 10 },
      { Sku: "PID10001-NAV-M", Color: "Navy", Size: "M", Quantity: 15 },
    ],

    Images: [
      { Url: "https://cdn.example.com/products/PID10001/main.jpg", ThumbnailUrl: "https://cdn.example.com/products/PID10001/thumb.jpg", Alt: "Front view" },
    ],

    FreeDelivery: true,
    ReturnPolicy: "7 Days",

    ShippingInfo: { FreeShipping: true, EstimatedDelivery: "2-4 Days", CashOnDelivery: true },
  });

  const [payloadPreview, setPayloadPreview] = useState(null);

  // Generic helper to update top-level simple fields
  const updateField = (key, value) => {
    setProduct((p) => ({ ...p, [key]: value }));
  };

  // Helpers for array fields (simple strings)
  const addToArray = (key, value = "") => {
    setProduct((p) => ({ ...p, [key]: [...(p[key] || []), value] }));
  };
  const updateArrayItem = (key, idx, value) => {
    setProduct((p) => ({ ...p, [key]: p[key].map((it, i) => (i === idx ? value : it)) }));
  };
  const removeArrayItem = (key, idx) => {
    setProduct((p) => ({ ...p, [key]: p[key].filter((_, i) => i !== idx) }));
  };

  // Helpers for complex nested lists (PriceList, CountryPrices, Inventory, Variants, Images, Specifications.Extra)
  const updateNestedList = (listKey, idx, field, value) => {
    setProduct((p) => ({
      ...p,
      [listKey]: p[listKey].map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    }));
  };
  const addNestedItem = (listKey, template) => {
    setProduct((p) => ({ ...p, [listKey]: [...(p[listKey] || []), template] }));
  };
  const removeNestedItem = (listKey, idx) => {
    setProduct((p) => ({ ...p, [listKey]: p[listKey].filter((_, i) => i !== idx) }));
  };

  const updateSpecField = (field, value) => {
    setProduct((p) => ({ ...p, Specifications: { ...p.Specifications, [field]: value } }));
  };
  const updateSpecExtra = (idx, field, value) => {
    setProduct((p) => ({
      ...p,
      Specifications: {
        ...p.Specifications,
        Extra: p.Specifications.Extra.map((it, i) => (i === idx ? { ...it, [field]: value } : it)),
      },
    }));
  };
  const addSpecExtra = () => {
    setProduct((p) => ({ ...p, Specifications: { ...p.Specifications, Extra: [...p.Specifications.Extra, { Key: "", Value: "" }] } }));
  };
  const removeSpecExtra = (idx) => {
    setProduct((p) => ({ ...p, Specifications: { ...p.Specifications, Extra: p.Specifications.Extra.filter((_, i) => i !== idx) } }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Build payload (here product already mirrors the desired shape). If you need any transforms do them here.
    const payload = { ...product };

    console.log("Product payload:", payload);
    console.log(JSON.stringify(payload, null, 2));
    setPayloadPreview(JSON.stringify(payload, null, 2));
    // If you want to post to API, do fetch/axios here.
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Create / Edit Product</h2>

      <form onSubmit={onSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow">
        {/* Basic info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm">ProductId</label>
            <input value={product.ProductId} onChange={(e) => updateField("ProductId", e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </div>
          <div>
            <label className="text-sm">Name</label>
            <input value={product.Name} onChange={(e) => updateField("Name", e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </div>
          <div>
            <label className="text-sm">Slug</label>
            <input value={product.Slug} onChange={(e) => updateField("Slug", e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </div>
        </div>

        <div>
          <label className="text-sm">Description</label>
          <textarea value={product.Description} onChange={(e) => updateField("Description", e.target.value)} className="mt-1 block w-full border rounded p-2" rows={3} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm">Price</label>
            <input type="number" value={product.Price} onChange={(e) => updateField("Price", parseFloat(e.target.value || 0))} className="mt-1 block w-full border rounded p-2" />
          </div>
          <div>
            <label className="text-sm">CompareAtPrice</label>
            <input type="number" value={product.CompareAtPrice} onChange={(e) => updateField("CompareAtPrice", parseFloat(e.target.value || 0))} className="mt-1 block w-full border rounded p-2" />
          </div>
          <div>
            <label className="text-sm">DiscountPercent</label>
            <input type="number" value={product.DiscountPercent} onChange={(e) => updateField("DiscountPercent", parseInt(e.target.value || 0))} className="mt-1 block w-full border rounded p-2" />
          </div>
          <div>
            <label className="text-sm">ReturnPolicy</label>
            <input value={product.ReturnPolicy} onChange={(e) => updateField("ReturnPolicy", e.target.value)} className="mt-1 block w-full border rounded p-2" />
          </div>
        </div>

        {/* Arrays: Sizes & Colors & FabricType */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm">Sizes</label>
            <div className="mt-1 space-y-1">
              {product.SizeOfProduct.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input value={s} onChange={(e) => updateArrayItem("SizeOfProduct", i, e.target.value)} className="flex-1 border rounded p-2" />
                  <button type="button" onClick={() => removeArrayItem("SizeOfProduct", i)} className="px-3 rounded bg-red-100">x</button>
                </div>
              ))}
              <button type="button" onClick={() => addToArray("SizeOfProduct", "")} className="mt-2 px-3 py-1 rounded bg-gray-100">+ Add Size</button>
            </div>
          </div>

          <div>
            <label className="text-sm">Colors</label>
            <div className="mt-1 space-y-1">
              {product.AvailableColors.map((c, i) => (
                <div key={i} className="flex gap-2">
                  <input value={c} onChange={(e) => updateArrayItem("AvailableColors", i, e.target.value)} className="flex-1 border rounded p-2" />
                  <button type="button" onClick={() => removeArrayItem("AvailableColors", i)} className="px-3 rounded bg-red-100">x</button>
                </div>
              ))}
              <button type="button" onClick={() => addToArray("AvailableColors", "")} className="mt-2 px-3 py-1 rounded bg-gray-100">+ Add Color</button>
            </div>
          </div>

          <div>
            <label className="text-sm">Fabric Type</label>
            <div className="mt-1 space-y-1">
              {product.FabricType.map((c, i) => (
                <div key={i} className="flex gap-2">
                  <input value={c} onChange={(e) => updateArrayItem("FabricType", i, e.target.value)} className="flex-1 border rounded p-2" />
                  <button type="button" onClick={() => removeArrayItem("FabricType", i)} className="px-3 rounded bg-red-100">x</button>
                </div>
              ))}
              <button type="button" onClick={() => addToArray("FabricType", "")} className="mt-2 px-3 py-1 rounded bg-gray-100">+ Add Fabric</button>
            </div>
          </div>
        </div>

        {/* PriceList editor */}
        <div>
          <h3 className="font-medium">Price List</h3>
          <div className="space-y-3 mt-2">
            {product.PriceList.map((pl, idx) => (
              <div key={idx} className="grid grid-cols-2 md:grid-cols-5 gap-2 items-end">
                <input value={pl.Size} onChange={(e) => updateNestedList("PriceList", idx, "Size", e.target.value)} className="border rounded p-2" placeholder="Size" />
                <input type="number" value={pl.PriceAmount} onChange={(e) => updateNestedList("PriceList", idx, "PriceAmount", parseFloat(e.target.value || 0))} className="border rounded p-2" placeholder="Price" />
                <input value={pl.Currency} onChange={(e) => updateNestedList("PriceList", idx, "Currency", e.target.value)} className="border rounded p-2" placeholder="Currency" />
                <input type="number" value={pl.Quantity} onChange={(e) => updateNestedList("PriceList", idx, "Quantity", parseInt(e.target.value || 0))} className="border rounded p-2" placeholder="Quantity" />
                <div className="flex gap-2">
                  <input value={pl.Country} onChange={(e) => updateNestedList("PriceList", idx, "Country", e.target.value)} className="border rounded p-2" placeholder="Country" />
                  <button type="button" onClick={() => removeNestedItem("PriceList", idx)} className="px-3 py-1 rounded bg-red-100">Remove</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => addNestedItem("PriceList", { Size: "", PriceAmount: 0, Currency: "INR", Quantity: 0, Country: "IN" })} className="mt-2 px-3 py-1 rounded bg-gray-100">+ Add Price</button>
          </div>
        </div>

        {/* CountryPrices editor */}
        <div>
          <h3 className="font-medium">Country Prices</h3>
          <div className="space-y-3 mt-2">
            {product.CountryPrices.map((cp, idx) => (
              <div key={idx} className="flex gap-2 items-end">
                <input value={cp.Country} onChange={(e) => updateNestedList("CountryPrices", idx, "Country", e.target.value)} className="border rounded p-2" placeholder="Country" />
                <input type="number" value={cp.PriceAmount} onChange={(e) => updateNestedList("CountryPrices", idx, "PriceAmount", parseFloat(e.target.value || 0))} className="border rounded p-2" placeholder="Amount" />
                <input value={cp.Currency} onChange={(e) => updateNestedList("CountryPrices", idx, "Currency", e.target.value)} className="border rounded p-2" placeholder="Currency" />
                <button type="button" onClick={() => removeNestedItem("CountryPrices", idx)} className="px-3 py-1 rounded bg-red-100">Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => addNestedItem("CountryPrices", { Country: "", PriceAmount: 0, Currency: "INR" })} className="mt-2 px-3 py-1 rounded bg-gray-100">+ Add Country Price</button>
          </div>
        </div>

        {/* Specifications */}
        <div>
          <h3 className="font-medium">Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <input value={product.Specifications.Fabric} onChange={(e) => updateSpecField("Fabric", e.target.value)} className="border rounded p-2" placeholder="Fabric" />
            <input value={product.Specifications.Length} onChange={(e) => updateSpecField("Length", e.target.value)} className="border rounded p-2" placeholder="Length" />
            <input value={product.Specifications.Origin} onChange={(e) => updateSpecField("Origin", e.target.value)} className="border rounded p-2" placeholder="Origin" />
            <input value={product.Specifications.Fit} onChange={(e) => updateSpecField("Fit", e.target.value)} className="border rounded p-2" placeholder="Fit" />
            <input value={product.Specifications.Care} onChange={(e) => updateSpecField("Care", e.target.value)} className="border rounded p-2" placeholder="Care" />
          </div>

          <div className="mt-3">
            <label className="font-medium">Extra</label>
            <div className="space-y-2 mt-2">
              {product.Specifications.Extra.map((ex, i) => (
                <div key={i} className="flex gap-2">
                  <input value={ex.Key} onChange={(e) => updateSpecExtra(i, "Key", e.target.value)} className="border rounded p-2" placeholder="Key" />
                  <input value={ex.Value} onChange={(e) => updateSpecExtra(i, "Value", e.target.value)} className="border rounded p-2" placeholder="Value" />
                  <button type="button" onClick={() => removeSpecExtra(i)} className="px-3 py-1 rounded bg-red-100">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addSpecExtra} className="mt-2 px-3 py-1 rounded bg-gray-100">+ Add Extra</button>
            </div>
          </div>
        </div>

        {/* KeyFeatures & CareInstructions */}
        <div>
          <h3 className="font-medium">Key Features</h3>
          <div className="mt-2 space-y-1">
            {product.KeyFeatures.map((kf, i) => (
              <div key={i} className="flex gap-2">
                <input value={kf} onChange={(e) => updateArrayItem("KeyFeatures", i, e.target.value)} className="flex-1 border rounded p-2" />
                <button type="button" onClick={() => removeArrayItem("KeyFeatures", i)} className="px-3 rounded bg-red-100">x</button>
              </div>
            ))}
            <button type="button" onClick={() => addToArray("KeyFeatures", "")} className="mt-2 px-3 py-1 rounded bg-gray-100">+ Add Feature</button>
          </div>

          <h3 className="font-medium mt-4">Care Instructions</h3>
          <div className="mt-2 space-y-1">
            {product.CareInstructions.map((ci, i) => (
              <div key={i} className="flex gap-2">
                <input value={ci} onChange={(e) => updateArrayItem("CareInstructions", i, e.target.value)} className="flex-1 border rounded p-2" />
                <button type="button" onClick={() => removeArrayItem("CareInstructions", i)} className="px-3 rounded bg-red-100">x</button>
              </div>
            ))}
            <button type="button" onClick={() => addToArray("CareInstructions", "")} className="mt-2 px-3 py-1 rounded bg-gray-100">+ Add Care</button>
          </div>
        </div>

        {/* Inventory editor */}
        <div>
          <h3 className="font-medium">Inventory</h3>
          <div className="space-y-3 mt-2">
            {product.Inventory.map((inv, idx) => (
              <div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-2 items-end">
                <input value={inv.Sku} onChange={(e) => updateNestedList("Inventory", idx, "Sku", e.target.value)} className="border rounded p-2" placeholder="Sku" />
                <input value={inv.Size} onChange={(e) => updateNestedList("Inventory", idx, "Size", e.target.value)} className="border rounded p-2" placeholder="Size" />
                <input value={inv.Color} onChange={(e) => updateNestedList("Inventory", idx, "Color", e.target.value)} className="border rounded p-2" placeholder="Color" />
                <div className="flex gap-2">
                  <input type="number" value={inv.Quantity} onChange={(e) => updateNestedList("Inventory", idx, "Quantity", parseInt(e.target.value || 0))} className="border rounded p-2" placeholder="Qty" />
                  <button type="button" onClick={() => removeNestedItem("Inventory", idx)} className="px-3 py-1 rounded bg-red-100">Remove</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => addNestedItem("Inventory", { Sku: "", Size: "", Color: "", Quantity: 0 })} className="mt-2 px-3 py-1 rounded bg-gray-100">+ Add Inventory</button>
          </div>
        </div>

        {/* Variants */}
        <div>
          <h3 className="font-medium">Variants</h3>
          <div className="space-y-3 mt-2">
            {product.Variants.map((v, idx) => (
              <div key={idx} className="flex gap-2 items-end">
                <input value={v.Sku} onChange={(e) => updateNestedList("Variants", idx, "Sku", e.target.value)} className="border rounded p-2" placeholder="Sku" />
                <input value={v.Color} onChange={(e) => updateNestedList("Variants", idx, "Color", e.target.value)} className="border rounded p-2" placeholder="Color" />
                <input value={v.Size} onChange={(e) => updateNestedList("Variants", idx, "Size", e.target.value)} className="border rounded p-2" placeholder="Size" />
                <input type="number" value={v.Quantity} onChange={(e) => updateNestedList("Variants", idx, "Quantity", parseInt(e.target.value || 0))} className="border rounded p-2" placeholder="Qty" />
                <button type="button" onClick={() => removeNestedItem("Variants", idx)} className="px-3 py-1 rounded bg-red-100">Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => addNestedItem("Variants", { Sku: "", Color: "", Size: "", Quantity: 0 })} className="mt-2 px-3 py-1 rounded bg-gray-100">+ Add Variant</button>
          </div>
        </div>

        {/* Images */}
        <div>
          <h3 className="font-medium">Images</h3>
          <div className="space-y-2 mt-2">
            {product.Images.map((img, idx) => (
              <div key={idx} className="flex gap-2 items-end">
                <input value={img.Url} onChange={(e) => updateNestedList("Images", idx, "Url", e.target.value)} className="border rounded p-2" placeholder="Url" />
                <input value={img.ThumbnailUrl} onChange={(e) => updateNestedList("Images", idx, "ThumbnailUrl", e.target.value)} className="border rounded p-2" placeholder="ThumbnailUrl" />
                <input value={img.Alt} onChange={(e) => updateNestedList("Images", idx, "Alt", e.target.value)} className="border rounded p-2" placeholder="Alt" />
                <button type="button" onClick={() => removeNestedItem("Images", idx)} className="px-3 py-1 rounded bg-red-100">Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => addNestedItem("Images", { Url: "", ThumbnailUrl: "", Alt: "" })} className="mt-2 px-3 py-1 rounded bg-gray-100">+ Add Image</button>
          </div>
        </div>

        {/* Flags & Shipping */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={product.FreeDelivery} onChange={(e) => updateField("FreeDelivery", e.target.checked)} /> FreeDelivery
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={product.ShippingInfo.FreeShipping} onChange={(e) => setProduct((p) => ({ ...p, ShippingInfo: { ...p.ShippingInfo, FreeShipping: e.target.checked } }))} /> FreeShipping
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={product.ShippingInfo.CashOnDelivery} onChange={(e) => setProduct((p) => ({ ...p, ShippingInfo: { ...p.ShippingInfo, CashOnDelivery: e.target.checked } }))} /> CashOnDelivery
          </label>
        </div>

        <div className="flex justify-between items-center">
          <button type="submit" className="px-4 py-2 rounded bg-orange-500 text-white">Save & Console.log</button>
          <button type="button" onClick={() => { setPayloadPreview(JSON.stringify(product, null, 2)); }} className="px-4 py-2 rounded bg-gray-100">Preview Payload</button>
        </div>
      </form>

      {payloadPreview && (
        <div className="mt-6 bg-gray-800 text-white rounded p-4 font-mono text-sm whitespace-pre-wrap">
          {payloadPreview}
        </div>
      )}
    </div>
  );
}
