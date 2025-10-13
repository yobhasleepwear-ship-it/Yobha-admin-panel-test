import * as axiosService from "./axiosService"; 

export const uploadProductImage = async (productId, file, altText, uploadedByUserId) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("alt", altText || file.name);
    formData.append("uploadedByUserId", uploadedByUserId);

    const response = await axiosService.Post(`/Products/${productId}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("uploadProductImage error:", error);
    throw error;
  }
};

export const AddProduct = async (payload) => {
    try {
        const response = await axiosService.Post("/Products", payload); 
        return response.data;
    } catch (error) {
        console.error("AddProduct error:", error);
        throw error;
    }
};