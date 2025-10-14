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

export const GetAllProducts = async () => {
    try {
        const response = await axiosService.Get("/Products");
        return response.data;
    } catch (error) {
        console.error("GetAllProducts error:", error);
        throw error;
    }
};

export const GetProductById = async (productId) => {
    try {
        const response = await axiosService.Get(`/Products/${productId}`);
        return response.data;
    } catch (error) {
        console.error("GetProductById error:", error);
        throw error;
    }
};

export const UpdateProduct = async (productId, payload) => {
    try {
        const response = await axiosService.Put(`/Products/${productId}`, payload);
        return response.data;
    } catch (error) {
        console.error("UpdateProduct error:", error);
        throw error;
    }
};

export const DeleteProduct = async (productId) => {
    try {
        const response = await axiosService.Delete(`/Products/${productId}`);
        return response.data;
    } catch (error) {
        console.error("DeleteProduct error:", error);
        throw error;
    }
};