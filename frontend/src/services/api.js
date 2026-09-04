// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const ITEMS_URL = `${API_BASE_URL}/items`;
const AUTH_URL = `${API_BASE_URL}`;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };
};

// Authentication functions
export const loginUser = async (username, email, password) => {
  try {
    const response = await fetch(`${AUTH_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }
    
    return data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const registerUser = async (username, email, password) => {
  try {
    const response = await fetch(`${AUTH_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }
    
    return data;
  } catch (error) {
    console.error("Registration Error:", error);
    throw error;
  }
};

// Item management functions
export const fetchItems = async () => {
  try {
    const response = await fetch(ITEMS_URL, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Failed to fetch");
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};

export const addItem = async (itemData) => {
  try {
    const response = await fetch(ITEMS_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(itemData),
    });
    if (!response.ok) throw new Error("Failed to add item");
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const updateItem = async (id, itemData) => {
  try {
    const response = await fetch(`${ITEMS_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(itemData),
    });
    if (!response.ok) throw new Error("Failed to update item");
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const deleteItem = async (id) => {
  try {
    const response = await fetch(`${ITEMS_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete item");
    return id;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};