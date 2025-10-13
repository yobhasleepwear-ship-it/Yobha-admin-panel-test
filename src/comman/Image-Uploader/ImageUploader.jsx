import React, { useState } from "react";
import { uploadProductImage } from "../../service/product-upload";

const ImageUploader = ({ productId, onUploadComplete }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleUpload = async () => {
    if (!productId) {
      alert("Product ID missing!");
      return;
    }

    setUploading(true);
    try {
      const results = [];
      for (let file of selectedFiles) {
        const response = await uploadProductImage(productId, file, file.name, "admin-123");
        results.push(response);
      }
      setUploadedImages([...uploadedImages, ...results]);
      setSelectedFiles([]);

      if (onUploadComplete) onUploadComplete(results);
      alert("Images uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md bg-gray-50">
      <h3 className="font-semibold mb-2 text-gray-700">Upload Product Images</h3>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="border p-2 rounded-md w-full"
      />

      <button
        onClick={handleUpload}
        disabled={uploading || selectedFiles.length === 0}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {uploading ? "Uploading..." : "Upload Images"}
      </button>

      {uploadedImages.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {uploadedImages.map((img, index) => (
            <img
              key={index}
              src={img.url || img.Url}
              alt={img.alt || img.Alt}
              className="w-full h-24 object-cover rounded-md border"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
