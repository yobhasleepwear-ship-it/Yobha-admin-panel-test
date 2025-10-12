import React, { useState } from "react";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    ProductId: "",
    Name: "",
    Slug: "",
    Description: "",
    Price: "",
    CompareAtPrice: "",
    DiscountPercent: "",
    Stock: "",
    Variants: [],
    Images: [],
    VariantSkus: [],
    AverageRating: "",
    ReviewCount: "",
    Reviews: [],
    IsFeatured: false,
    SalesCount: "",
    IsActive: true,
    IsDeleted: false,
    ProductMainCategory: "",
    ProductCategory: "",
    ProductSubCategory: "",
    SizeOfProduct: [],
    AvailableColors: [],
    FabricType: [],
    PriceList: [],
    ProductVariationIds: [],
    CountryPrices: [],
    Specifications: {
      Fabric: "",
      Length: "",
      Origin: "",
      Fit: "",
      Care: "",
      Extra: []
    },
    KeyFeatures: [],
    CareInstructions: [],
    Inventory: [],
    FreeDelivery: false,
    ReturnPolicy: "",
    ShippingInfo: {
      FreeShipping: false,
      EstimatedDelivery: "",
      ShippingPrice: "",
      CashOnDelivery: false
    },
    MetaTitle: "",
    MetaDescription: "",
    Views: "",
    UnitsSold: ""
  });

  const [dropdowns] = useState({
    mainCategories: ["Sleepwear", "Activewear", "Casualwear"],
    productCategories: ["Women", "Men", "Kids"],
    subCategories: ["Nightshirts", "Pyjamas", "Shorts"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy Blue", "Ivory White", "Blush"],
    fabrics: ["100% Cotton", "Silk", "Linen"],
    countries: ["IN", "US", "UK"],
    currencies: ["INR", "USD", "EUR"]
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleNestedChange = (section, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value }
    }));
  };

  const addArrayItem = (key, value) => {
    if (!value) return;
    setFormData((prev) => ({
      ...prev,
      [key]: [...prev[key], value]
    }));
  };

  const addObjectToArray = (key, obj) => {
    if (!obj || Object.values(obj).some((v) => v === "")) return;
    setFormData((prev) => ({
      ...prev,
      [key]: [...prev[key], obj]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert numeric fields to numbers / decimals
    const payload = {
      ...formData,
      Price: { $numberDecimal: formData.Price },
      CompareAtPrice: { $numberDecimal: formData.CompareAtPrice },
      Views: { $numberLong: formData.Views || "0" },
      UnitsSold: { $numberLong: formData.UnitsSold || "0" },
      ShippingInfo: {
        ...formData.ShippingInfo,
        ShippingPrice: { $numberDecimal: formData.ShippingInfo.ShippingPrice || "0" }
      },
      Variants: formData.Variants.map((v) => ({
        ...v,
        PriceOverride: { $numberDecimal: v.PriceOverride || "0" },
        Images: v.Images.map((img) => ({
          ...img,
          UploadedAt: { $date: img.UploadedAt || new Date().toISOString() }
        }))
      })),
      Images: formData.Images.map((img) => ({
        ...img,
        UploadedAt: { $date: img.UploadedAt || new Date().toISOString() }
      })),
      Reviews: formData.Reviews.map((r) => ({
        ...r,
        CreatedAt: { $date: r.CreatedAt || new Date().toISOString() }
      })),
      Specifications: {
        ...formData.Specifications,
        Extra: formData.Specifications.Extra.map((ex) => ({ ...ex }))
      },
      PriceList: formData.PriceList.map((p) => ({
        ...p,
        PriceAmount: { $numberDecimal: p.PriceAmount }
      })),
      CountryPrices: formData.CountryPrices.map((c) => ({
        ...c,
        PriceAmount: { $numberDecimal: c.PriceAmount }
      })),
      Inventory: formData.Inventory.map((i) => ({
        ...i,
        UpdatedAt: { $date: i.UpdatedAt || new Date().toISOString() }
      }))
    };

    console.log("Generated Payload:", payload);
    alert("Payload generated! Check console.");
    // Here you can do: axios.post('/api/product', payload)
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Full Product Form</h2>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        
        {/* Basic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="ProductId" name="ProductId" value={formData.ProductId} onChange={handleChange} className="border p-2 rounded" />
          <input placeholder="Name" name="Name" value={formData.Name} onChange={handleChange} className="border p-2 rounded" />
          <input placeholder="Slug" name="Slug" value={formData.Slug} onChange={handleChange} className="border p-2 rounded" />
          <textarea placeholder="Description" name="Description" value={formData.Description} onChange={handleChange} className="border p-2 rounded col-span-2" />

          <input placeholder="Price" name="Price" value={formData.Price} type="number" onChange={handleChange} className="border p-2 rounded" />
          <input placeholder="CompareAtPrice" name="CompareAtPrice" value={formData.CompareAtPrice} type="number" onChange={handleChange} className="border p-2 rounded" />
          <input placeholder="DiscountPercent" name="DiscountPercent" value={formData.DiscountPercent} type="number" onChange={handleChange} className="border p-2 rounded" />
          <input placeholder="Stock" name="Stock" value={formData.Stock} type="number" onChange={handleChange} className="border p-2 rounded" />

          <select name="ProductMainCategory" value={formData.ProductMainCategory} onChange={handleChange} className="border p-2 rounded">
            <option value="">Select Main Category</option>
            {dropdowns.mainCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select name="ProductCategory" value={formData.ProductCategory} onChange={handleChange} className="border p-2 rounded">
            <option value="">Select Category</option>
            {dropdowns.productCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select name="ProductSubCategory" value={formData.ProductSubCategory} onChange={handleChange} className="border p-2 rounded">
            <option value="">Select Sub Category</option>
            {dropdowns.subCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Arrays */}
        <div>
          <h3 className="font-semibold mb-2">Sizes</h3>
          <select onChange={(e) => addArrayItem("SizeOfProduct", e.target.value)} className="border p-2 rounded">
            <option value="">Select Size</option>
            {dropdowns.sizes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex flex-wrap gap-2 mt-2">{formData.SizeOfProduct.map((s,i)=> <span key={i} className="bg-gray-200 px-2 py-1 rounded">{s}</span>)}</div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Colors</h3>
          <select onChange={(e) => addArrayItem("AvailableColors", e.target.value)} className="border p-2 rounded">
            <option value="">Select Color</option>
            {dropdowns.colors.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex flex-wrap gap-2 mt-2">{formData.AvailableColors.map((c,i)=> <span key={i} className="bg-gray-200 px-2 py-1 rounded">{c}</span>)}</div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Fabric Types</h3>
          <select onChange={(e)=>addArrayItem("FabricType", e.target.value)} className="border p-2 rounded">
            <option value="">Select Fabric</option>
            {dropdowns.fabrics.map((f)=> <option key={f} value={f}>{f}</option>)}
          </select>
          <div className="flex flex-wrap gap-2 mt-2">{formData.FabricType.map((f,i)=> <span key={i} className="bg-gray-200 px-2 py-1 rounded">{f}</span>)}</div>
        </div>

        {/* Specifications */}
        <div>
          <h3 className="font-semibold mt-4">Specifications</h3>
          {Object.keys(formData.Specifications).filter(k => k!=="Extra").map((key)=>
            <input key={key} placeholder={key} value={formData.Specifications[key]} onChange={(e)=>handleNestedChange("Specifications", key, e.target.value)} className="border p-2 rounded w-full mb-2" />
          )}
        </div>

        {/* Key Features */}
        <div>
          <h3 className="font-semibold mb-2">Key Features</h3>
          <input type="text" placeholder="Add feature and press Enter" onKeyDown={(e)=>{if(e.key==='Enter'){e.preventDefault(); addArrayItem("KeyFeatures", e.target.value); e.target.value='';}}} className="border p-2 rounded w-full"/>
          <div className="flex flex-wrap gap-2 mt-2">{formData.KeyFeatures.map((f,i)=> <span key={i} className="bg-gray-200 px-2 py-1 rounded">{f}</span>)}</div>
        </div>

        {/* Care Instructions */}
        <div>
          <h3 className="font-semibold mb-2">Care Instructions</h3>
          <input type="text" placeholder="Add instruction and press Enter" onKeyDown={(e)=>{if(e.key==='Enter'){e.preventDefault(); addArrayItem("CareInstructions", e.target.value); e.target.value='';}}} className="border p-2 rounded w-full"/>
          <div className="flex flex-wrap gap-2 mt-2">{formData.CareInstructions.map((f,i)=> <span key={i} className="bg-gray-200 px-2 py-1 rounded">{f}</span>)}</div>
        </div>

        {/* Free Delivery & Return Policy */}
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={formData.FreeDelivery} onChange={handleChange} name="FreeDelivery"/>
          <label>Free Delivery</label>
        </div>
        <input placeholder="Return Policy" name="ReturnPolicy" value={formData.ReturnPolicy} onChange={handleChange} className="border p-2 rounded w-full"/>

        {/* Shipping Info */}
        <div>
          <h3 className="font-semibold mt-4">Shipping Info</h3>
          <label className="flex items-center gap-2"><input type="checkbox" checked={formData.ShippingInfo.FreeShipping} onChange={(e)=>handleNestedChange("ShippingInfo","FreeShipping",e.target.checked)}/> Free Shipping</label>
          <input placeholder="Estimated Delivery" value={formData.ShippingInfo.EstimatedDelivery} onChange={(e)=>handleNestedChange("ShippingInfo","EstimatedDelivery",e.target.value)} className="border p-2 rounded"/>
          <input placeholder="Shipping Price" value={formData.ShippingInfo.ShippingPrice} onChange={(e)=>handleNestedChange("ShippingInfo","ShippingPrice",e.target.value)} className="border p-2 rounded"/>
          <label className="flex items-center gap-2"><input type="checkbox" checked={formData.ShippingInfo.CashOnDelivery} onChange={(e)=>handleNestedChange("ShippingInfo","CashOnDelivery",e.target.checked)}/> Cash on Delivery</label>
        </div>

        {/* Meta */}
        <input placeholder="MetaTitle" name="MetaTitle" value={formData.MetaTitle} onChange={handleChange} className="border p-2 rounded w-full"/>
        <input placeholder="MetaDescription" name="MetaDescription" value={formData.MetaDescription} onChange={handleChange} className="border p-2 rounded w-full"/>

        {/* Views & Units Sold */}
        <input placeholder="Views" name="Views" value={formData.Views} onChange={handleChange} type="number" className="border p-2 rounded w-full"/>
        <input placeholder="UnitsSold" name="UnitsSold" value={formData.UnitsSold} onChange={handleChange} type="number" className="border p-2 rounded w-full"/>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Generate Payload</button>
      </form>
    </div>
  );
};

export default ProductForm;
