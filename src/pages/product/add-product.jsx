import React, { useState } from "react";
import { AddProduct } from "../../service/product-upload";

// Helper utilities
const nowISO = () => new Date().toISOString();
const makeDecimal = (val) => ({ $numberDecimal: String(val === "" ? "0" : val) });
const makeDateObj = (iso) => ({ $date: iso });
const makeLong = (num) => ({ $numberLong: String(num || 0) });
const genId = (prefix = "") => `${prefix}${Math.random().toString(36).slice(2, 10)}`;

export default function ProductFormFull() {
  // Central dropdown state
  const [dropdownOptions] = useState({
    categories: ["Sleepwear", "Loungewear", "Nightwear", "Activewear"],
    subCategories: ["Nightshirts", "Pajamas", "Robes", "Shorts"],
    mainCategories: ["Men", "Women", "Kids"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy Blue", "Ivory White", "Black", "Pink", "Grey"],
    fabricTypes: ["100% Cotton", "Silk", "Linen", "Satin"],
    countries: ["IN", "US", "UK"],
    boolean: ["true", "false"],
  });

  // Main form data skeleton
  const [data, setData] = useState({
    _id: { $oid: genId("oid_") },
    ProductId: "",
    Name: "",
    Slug: "",
    Description: "",
    Price: makeDecimal("0"),
    CompareAtPrice: makeDecimal("0"),
    DiscountPercent: 0,
    Stock: 0,
    Variants: [],
    Images: [],
    VariantSkus: [],
    AverageRating: 0,
    ReviewCount: 0,
    Reviews: [],
    IsFeatured: false,
    SalesCount: 0,
    IsActive: true,
    IsDeleted: false,
    CreatedAt: makeDateObj(nowISO()),
    UpdatedAt: makeDateObj(nowISO()),
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
      Extra: [],
    },
    KeyFeatures: [],
    CareInstructions: [],
    Inventory: [],
    FreeDelivery: true,
    ReturnPolicy: "",
    ShippingInfo: {
      FreeShipping: true,
      EstimatedDelivery: "",
      ShippingPrice: makeDecimal("0"),
      CashOnDelivery: true,
    },
    MetaTitle: "",
    MetaDescription: "",
    Views: makeLong(0),
    UnitsSold: makeLong(0),
  });

  // local UI state for simple text inputs (for comma-separated arrays)
  const update = (path, value) => {
    setData((d) => {
      const nd = JSON.parse(JSON.stringify(d));
      let cur = nd;
      const parts = path.split(".");
      for (let i = 0; i < parts.length - 1; i++) {
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
      return nd;
    });
  };

  // ---------- Utilities for nested lists ----------
  const addVariant = (variant) => {
    // ensure Sku and _id
    const v = {
      _id: variant._id || genId("VAR"),
      Sku: variant.Sku || `${data.ProductId || "PID"}-${variant.Color?.slice(0,3) || "COL"}-${variant.Size || "S"}`,
      Color: variant.Color || "",
      Size: variant.Size || "",
      Quantity: Number(variant.Quantity || 0),
      PriceOverride: makeDecimal(variant.PriceOverride || "0"),
      Images: variant.Images || [],
      IsActive: variant.IsActive !== undefined ? variant.IsActive : true,
    };
    setData((d) => {
      const nd = { ...d, Variants: [...d.Variants, v], VariantSkus: [...d.VariantSkus, v.Sku], ProductVariationIds: [...d.ProductVariationIds, v._id] };
      return nd;
    });
  };

  const removeVariantAt = (idx) => {
    setData((d) => {
      const nd = JSON.parse(JSON.stringify(d));
      const removed = nd.Variants.splice(idx, 1)[0];
      nd.VariantSkus = nd.VariantSkus.filter((s) => s !== removed.Sku);
      nd.ProductVariationIds = nd.ProductVariationIds.filter((id) => id !== removed._id);
      return nd;
    });
  };

  const addProductImage = (imgObj) => {
    setData((d) => ({ ...d, Images: [...d.Images, imgObj] }));
  };

  const removeProductImageAt = (i) => {
    setData((d) => {
      const nd = { ...d, Images: d.Images.filter((_, idx) => idx !== i) };
      return nd;
    });
  };

  const addPriceListItem = (pl) => {
    const item = {
      _id: pl._id || genId("PRICE"),
      Size: pl.Size || "",
      PriceAmount: makeDecimal(pl.PriceAmount || "0"),
      Currency: pl.Currency || "INR",
      Quantity: Number(pl.Quantity || 0),
      Country: pl.Country || "IN",
    };
    setData((d) => ({ ...d, PriceList: [...d.PriceList, item] }));
  };

  const addCountryPrice = (cp) => {
    const item = {
      _id: cp._id || genId("CP"),
      Country: cp.Country || "IN",
      PriceAmount: makeDecimal(cp.PriceAmount || "0"),
      Currency: cp.Currency || "INR",
    };
    setData((d) => ({ ...d, CountryPrices: [...d.CountryPrices, item] }));
  };

  const addReview = (r) => {
    const item = {
      _id: r._id || genId("REV"),
      UserId: r.UserId || "USR_UNK",
      Rating: Number(r.Rating || 0),
      Comment: r.Comment || "",
      CreatedAt: makeDateObj(nowISO()),
      Approved: !!r.Approved,
    };
    setData((d) => ({ ...d, Reviews: [...d.Reviews, item], ReviewCount: d.Reviews.length + 1 }));
  };

  const addInventory = (inv) => {
    const item = {
      _id: inv._id || genId("INV"),
      VariantId: inv.VariantId || "",
      Sku: inv.Sku || "",
      Size: inv.Size || "",
      Color: inv.Color || "",
      Quantity: Number(inv.Quantity || 0),
      Reserved: Number(inv.Reserved || 0),
      WarehouseId: inv.WarehouseId || "",
      UpdatedAt: makeDateObj(nowISO()),
    };
    setData((d) => ({ ...d, Inventory: [...d.Inventory, item] }));
  };

  const addSpecExtra = (key, value) => {
    const item = { _id: genId("SPEC"), Key: key, Value: value };
    setData((d) => ({ ...d, Specifications: { ...d.Specifications, Extra: [...d.Specifications.Extra, item] } }));
  };

  const addKeyFeature = (f) => setData((d) => ({ ...d, KeyFeatures: [...d.KeyFeatures, f] }));
  const addCareInstruction = (c) => setData((d) => ({ ...d, CareInstructions: [...d.CareInstructions, c] }));
  const addVariantImageToVariant = (variantIndex, imageObj) => {
    setData((d) => {
      const nd = JSON.parse(JSON.stringify(d));
      nd.Variants[variantIndex].Images = nd.Variants[variantIndex].Images || [];
      nd.Variants[variantIndex].Images.push(imageObj);
      return nd;
    });
  };

  // image file -> dataURL helper
  const fileToDataUrl = (file) =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    // build final payload (ensure updated timestamps)
    const payload = JSON.parse(JSON.stringify(data));
    payload.UpdatedAt = makeDateObj(nowISO());
    // ensure Price fields already in correct format
    // Views and UnitsSold already as long
    console.log("Final payload:", payload);
    try{
      const response = AddProduct(payload);
      console.log(response);
    }
    catch{
      console.log("something went wrong")
    }
    // For demo: show in textarea below by setting state
    setGenerated(JSON.stringify(payload, null, 2));
    // If you'd call API, do fetch/axios here
  };

  // JSON display
  const [generated, setGenerated] = useState("");

  // ---------- Local form helpers for quick nested item creation ----------
  // We'll create small local forms for each nested add action
  const [variantLocal, setVariantLocal] = useState({
    Color: dropdownOptions.colors[0],
    Size: dropdownOptions.sizes[0],
    Quantity: 0,
    PriceOverride: "0",
    IsActive: true,
  });
  const [priceListLocal, setPriceListLocal] = useState({ Size: dropdownOptions.sizes[0], PriceAmount: "0", Currency: "INR", Quantity: 0, Country: "IN" });
  const [countryPriceLocal, setCountryPriceLocal] = useState({ Country: "IN", PriceAmount: "0", Currency: "INR" });
  const [reviewLocal, setReviewLocal] = useState({ UserId: "", Rating: 5, Comment: "", Approved: true });
  const [inventoryLocal, setInventoryLocal] = useState({ VariantId: "", Sku: "", Size: dropdownOptions.sizes[0], Color: dropdownOptions.colors[0], Quantity: 0, Reserved: 0, WarehouseId: "WH001" });
  const [specExtraLocal, setSpecExtraLocal] = useState({ Key: "", Value: "" });
  const [imageFileLocal, setImageFileLocal] = useState(null);

  // upload product-level image
  const handleProductImageUpload = async (file) => {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    const imgObj = {
      Url: dataUrl,
      ThumbnailUrl: dataUrl,
      Alt: `${data.ProductId || "product"} image`,
      UploadedByUserId: "admin",
      UploadedAt: makeDateObj(nowISO()),
    };
    addProductImage(imgObj);
  };

  // upload variant image and attach to variantLocalImages (we will add when adding variant)
  const handleVariantImageUpload = async (file, variantIndex = null) => {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    const imgObj = {
      Url: dataUrl,
      ThumbnailUrl: dataUrl,
      Alt: `variant-img`,
      UploadedByUserId: "admin",
      UploadedAt: makeDateObj(nowISO()),
    };
    if (variantIndex === null) {
      // attach to local variantLocal.images array
      setVariantLocal((v) => ({ ...v, Images: [...(v.Images || []), imgObj] }));
    } else {
      addVariantImageToVariant(variantIndex, imgObj);
    }
  };

  // small helper to update top-level simple fields
  const simpleTopChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") update(name, checked);
    else update(name, value);
  };

  // parse comma-separated lists for user convenience
  const setCommaArray = (path, raw) => {
    const arr = raw.split(",").map((s) => s.trim()).filter(Boolean);
    update(path, arr);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Product Form (Full nested structure)</h2>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">

        {/* Basic */}
        <div className="grid grid-cols-2 gap-3">
          <input name="ProductId" placeholder="ProductId" className="border p-2" onChange={(e) => update("ProductId", e.target.value)} />
          <input name="Name" placeholder="Name" className="border p-2" onChange={(e) => update("Name", e.target.value)} />
          <input name="Slug" placeholder="Slug" className="border p-2" onChange={(e) => update("Slug", e.target.value)} />
          <input name="Description" placeholder="Description" className="border p-2" onChange={(e) => update("Description", e.target.value)} />

          <input placeholder="Price" type="number" className="border p-2" onChange={(e) => update("Price", makeDecimal(e.target.value))} />
          <input placeholder="CompareAtPrice" type="number" className="border p-2" onChange={(e) => update("CompareAtPrice", makeDecimal(e.target.value))} />
          <input placeholder="DiscountPercent" type="number" className="border p-2" onChange={(e) => update("DiscountPercent", Number(e.target.value))} />
          <input placeholder="Stock" type="number" className="border p-2" onChange={(e) => update("Stock", Number(e.target.value))} />

          <select onChange={(e) => update("ProductMainCategory", e.target.value)} className="border p-2">
            <option value="">Main Category</option>
            {dropdownOptions.mainCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select onChange={(e) => update("ProductCategory", e.target.value)} className="border p-2">
            <option value="">Category</option>
            {dropdownOptions.categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select onChange={(e) => update("ProductSubCategory", e.target.value)} className="border p-2">
            <option value="">Subcategory</option>
            {dropdownOptions.subCategories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Comma arrays */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm">SizeOfProduct (comma)</label>
            <input placeholder="S, M, L" className="border p-2" onBlur={(e) => setCommaArray("SizeOfProduct", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">AvailableColors (comma)</label>
            <input placeholder="Navy Blue, Ivory White" className="border p-2" onBlur={(e) => setCommaArray("AvailableColors", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">FabricType (comma)</label>
            <input placeholder="100% Cotton" className="border p-2" onBlur={(e) => setCommaArray("FabricType", e.target.value)} />
          </div>
        </div>

        {/* Specifications */}
        <div>
          <h3 className="font-semibold">Specifications</h3>
          <div className="grid grid-cols-3 gap-3 mt-2">
            <input placeholder="Fabric" className="border p-2" onChange={(e) => update("Specifications.Fabric", e.target.value)} />
            <input placeholder="Length" className="border p-2" onChange={(e) => update("Specifications.Length", e.target.value)} />
            <input placeholder="Origin" className="border p-2" onChange={(e) => update("Specifications.Origin", e.target.value)} />
            <input placeholder="Fit" className="border p-2" onChange={(e) => update("Specifications.Fit", e.target.value)} />
            <input placeholder="Care" className="border p-2" onChange={(e) => update("Specifications.Care", e.target.value)} />
          </div>

          <div className="flex gap-2 mt-3">
            <input placeholder="Key" className="border p-2" value={specExtraLocal.Key} onChange={(e) => setSpecExtraLocal(s => ({ ...s, Key: e.target.value }))} />
            <input placeholder="Value" className="border p-2" value={specExtraLocal.Value} onChange={(e) => setSpecExtraLocal(s => ({ ...s, Value: e.target.value }))} />
            <button type="button" className="bg-blue-500 text-white px-3 rounded" onClick={() => { if (specExtraLocal.Key && specExtraLocal.Value) { addSpecExtra(specExtraLocal.Key, specExtraLocal.Value); setSpecExtraLocal({ Key: "", Value: "" }); } }}>Add Spec Extra</button>
          </div>

          <div className="mt-2">
            {data.Specifications.Extra.map((ex) => <div key={ex._id} className="text-sm">• {ex.Key}: {ex.Value}</div>)}
          </div>
        </div>

        {/* Images (product-level) */}
        <div>
          <h3 className="font-semibold">Product Images</h3>
          <div className="flex gap-2 items-center mt-2">
            <input type="file" accept="image/*" onChange={(e) => { setImageFileLocal(e.target.files?.[0] || null); }} />
            <button type="button" className="px-3 py-1 bg-green-600 text-white rounded" onClick={async () => { if (imageFileLocal) { await handleProductImageUpload(imageFileLocal); setImageFileLocal(null); } }}>Upload & Add</button>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {data.Images.map((img, i) => (
              <div key={i} className="border p-1">
                <img src={img.ThumbnailUrl} alt={img.Alt} className="h-24 w-full object-cover" />
                <div className="text-xs">{img.Alt}</div>
                <button type="button" className="text-red-600 text-xs" onClick={() => removeProductImageAt(i)}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        {/* Variants (with per-variant image support) */}
        <div>
          <h3 className="font-semibold">Variants</h3>

          <div className="grid grid-cols-5 gap-2 mt-3">
            <select value={variantLocal.Color} onChange={(e) => setVariantLocal(v => ({ ...v, Color: e.target.value }))} className="border p-2">
              {dropdownOptions.colors.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={variantLocal.Size} onChange={(e) => setVariantLocal(v => ({ ...v, Size: e.target.value }))} className="border p-2">
              {dropdownOptions.sizes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input type="number" value={variantLocal.Quantity} onChange={(e) => setVariantLocal(v => ({ ...v, Quantity: Number(e.target.value) }))} className="border p-2" placeholder="Quantity" />
            <input type="number" value={variantLocal.PriceOverride} onChange={(e) => setVariantLocal(v => ({ ...v, PriceOverride: e.target.value }))} className="border p-2" placeholder="PriceOverride" />
            <div className="flex gap-2">
              <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleVariantImageUpload(f, null); }} />
              <button type="button" className="bg-blue-600 text-white px-3 rounded" onClick={() => { addVariant(variantLocal); setVariantLocal({ Color: dropdownOptions.colors[0], Size: dropdownOptions.sizes[0], Quantity: 0, PriceOverride: "0", Images: [], IsActive: true }); }}>Add Variant</button>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {data.Variants.map((v, idx) => (
              <div key={v._id} className="border p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{v.Sku} — {v.Color} / {v.Size}</div>
                    <div className="text-sm">Qty: {v.Quantity} | PriceOverride: {v.PriceOverride?.$numberDecimal}</div>
                    <div className="text-sm">Active: {String(v.IsActive)}</div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="text-red-600" onClick={() => removeVariantAt(idx)}>Remove</button>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="flex gap-2 items-center">
                    <input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (f) await handleVariantImageUpload(f, idx); }} />
                    <div className="text-xs">Upload image for this variant</div>
                  </div>
                  <div className="mt-2 grid grid-cols-6 gap-2">
                    {(v.Images || []).map((img, i) => (
                      <div key={i} className="border p-1">
                        <img src={img.ThumbnailUrl} alt={img.Alt} className="h-20 w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PriceList & CountryPrices */}
        <div>
          <h3 className="font-semibold">PriceList</h3>
          <div className="flex gap-2 mt-2">
            <select value={priceListLocal.Size} onChange={(e) => setPriceListLocal(pl => ({ ...pl, Size: e.target.value }))} className="border p-2">
              {dropdownOptions.sizes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input placeholder="PriceAmount" type="number" value={priceListLocal.PriceAmount} onChange={(e) => setPriceListLocal(pl => ({ ...pl, PriceAmount: e.target.value }))} className="border p-2" />
            <input placeholder="Quantity" type="number" value={priceListLocal.Quantity} onChange={(e) => setPriceListLocal(pl => ({ ...pl, Quantity: Number(e.target.value) }))} className="border p-2" />
            <select value={priceListLocal.Country} onChange={(e) => setPriceListLocal(pl => ({ ...pl, Country: e.target.value }))} className="border p-2">
              {dropdownOptions.countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button type="button" className="bg-green-600 text-white px-3 rounded" onClick={() => { addPriceListItem(priceListLocal); setPriceListLocal({ Size: dropdownOptions.sizes[0], PriceAmount: "0", Currency: "INR", Quantity: 0, Country: "IN" }); }}>Add</button>
          </div>
          <div className="mt-2">
            {data.PriceList.map(pl => <div key={pl._id} className="text-sm">• {pl.Size} — {pl.PriceAmount.$numberDecimal} {pl.Currency} ({pl.Country})</div>)}
          </div>

          <h3 className="font-semibold mt-3">CountryPrices</h3>
          <div className="flex gap-2 mt-2">
            <select value={countryPriceLocal.Country} onChange={(e) => setCountryPriceLocal(cp => ({ ...cp, Country: e.target.value }))} className="border p-2">
              {dropdownOptions.countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input placeholder="PriceAmount" type="number" value={countryPriceLocal.PriceAmount} onChange={(e) => setCountryPriceLocal(cp => ({ ...cp, PriceAmount: e.target.value }))} className="border p-2" />
            <button type="button" className="bg-green-600 text-white px-3 rounded" onClick={() => { addCountryPrice(countryPriceLocal); setCountryPriceLocal({ Country: "IN", PriceAmount: "0", Currency: "INR" }); }}>Add</button>
          </div>
          <div className="mt-2">{data.CountryPrices.map(cp => <div key={cp._id} className="text-sm">• {cp.Country} — {cp.PriceAmount.$numberDecimal} {cp.Currency}</div>)}</div>
        </div>

        {/* Reviews */}
        <div>
          <h3 className="font-semibold">Reviews</h3>
          <div className="grid grid-cols-4 gap-2">
            <input placeholder="UserId" className="border p-2" value={reviewLocal.UserId} onChange={(e) => setReviewLocal(r => ({ ...r, UserId: e.target.value }))} />
            <input placeholder="Rating" type="number" className="border p-2" value={reviewLocal.Rating} onChange={(e) => setReviewLocal(r => ({ ...r, Rating: Number(e.target.value) }))} />
            <input placeholder="Comment" className="border p-2" value={reviewLocal.Comment} onChange={(e) => setReviewLocal(r => ({ ...r, Comment: e.target.value }))} />
            <button type="button" className="bg-green-600 text-white px-3 rounded" onClick={() => { addReview(reviewLocal); setReviewLocal({ UserId: "", Rating: 5, Comment: "", Approved: true }); }}>Add</button>
          </div>
          <div className="mt-2">{data.Reviews.map(rv => <div key={rv._id} className="text-sm">• {rv.UserId} ({rv.Rating}) — {rv.Comment}</div>)}</div>
        </div>

        {/* Inventory */}
        <div>
          <h3 className="font-semibold">Inventory</h3>
          <div className="grid grid-cols-4 gap-2">
            <input placeholder="VariantId" className="border p-2" value={inventoryLocal.VariantId} onChange={(e) => setInventoryLocal(i => ({ ...i, VariantId: e.target.value }))} />
            <input placeholder="Sku" className="border p-2" value={inventoryLocal.Sku} onChange={(e) => setInventoryLocal(i => ({ ...i, Sku: e.target.value }))} />
            <input placeholder="Quantity" type="number" className="border p-2" value={inventoryLocal.Quantity} onChange={(e) => setInventoryLocal(i => ({ ...i, Quantity: Number(e.target.value) }))} />
            <button type="button" className="bg-green-600 text-white px-3 rounded" onClick={() => { addInventory(inventoryLocal); setInventoryLocal({ VariantId: "", Sku: "", Size: dropdownOptions.sizes[0], Color: dropdownOptions.colors[0], Quantity: 0, Reserved: 0, WarehouseId: "WH001" }); }}>Add</button>
          </div>
          <div className="mt-2">{data.Inventory.map(inv => <div key={inv._id} className="text-sm">• {inv.Sku} — {inv.Quantity} (Warehouse: {inv.WarehouseId})</div>)}</div>
        </div>

        {/* KeyFeatures / CareInstructions */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <h3 className="font-semibold">Key Features</h3>
            <div className="flex gap-2 mt-2">
              <input placeholder="Feature" className="border p-2" id="kf" />
              <button type="button" className="bg-green-600 text-white px-3 rounded" onClick={() => { const el = document.getElementById("kf"); if (el.value) { addKeyFeature(el.value); el.value = ""; } }}>Add</button>
            </div>
            <div className="mt-2">{data.KeyFeatures.map((k, i) => <div key={i} className="text-sm">• {k}</div>)}</div>
          </div>
          <div>
            <h3 className="font-semibold">Care Instructions</h3>
            <div className="flex gap-2 mt-2">
              <input placeholder="Instruction" className="border p-2" id="ci" />
              <button type="button" className="bg-green-600 text-white px-3 rounded" onClick={() => { const el = document.getElementById("ci"); if (el.value) { addCareInstruction(el.value); el.value = ""; } }}>Add</button>
            </div>
            <div className="mt-2">{data.CareInstructions.map((c, i) => <div key={i} className="text-sm">• {c}</div>)}</div>
          </div>
        </div>

        {/* Shipping & SEO */}
        <div className="grid grid-cols-3 gap-3">
          <input placeholder="EstimatedDelivery" className="border p-2" onChange={(e) => update("ShippingInfo.EstimatedDelivery", e.target.value)} />
          <input placeholder="ShippingPrice" type="number" className="border p-2" onChange={(e) => update("ShippingInfo.ShippingPrice", makeDecimal(e.target.value))} />
          <select onChange={(e) => update("ShippingInfo.CashOnDelivery", e.target.value === "true")} className="border p-2">
            <option value="true">COD: Yes</option>
            <option value="false">COD: No</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input placeholder="MetaTitle" className="border p-2" onChange={(e) => update("MetaTitle", e.target.value)} />
          <input placeholder="MetaDescription" className="border p-2" onChange={(e) => update("MetaDescription", e.target.value)} />
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Generate JSON</button>
          <button type="button" className="bg-gray-200 px-4 py-2 rounded" onClick={() => { setGenerated(JSON.stringify(data, null, 2)); }}>Show Current JSON</button>
        </div>
      </form>

      {/* Generated JSON */}
      <div className="mt-6">
        <h3 className="font-semibold">Generated JSON</h3>
        <textarea readOnly value={generated} rows={18} className="w-full border p-3 mt-2 font-mono text-sm" />
      </div>
    </div>
  );
}
