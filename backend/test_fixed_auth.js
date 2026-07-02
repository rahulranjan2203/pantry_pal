// Test script to verify authentication fixes
require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAuth() {
    console.log('Testing Authentication Fixes...\n');
    
    try {
        // Test registration
        console.log('1. Testing Registration...');
        const registerResponse = await axios.post(`${BASE_URL}/register`, {
            username: 'testuser',
            password: 'testpass123'
        });
        console.log(' Registration successful:', registerResponse.data.message);
        
        // Test login
        console.log('\n2. Testing Login...');
        const loginResponse = await axios.post(`${BASE_URL}/login`, {
            username: 'testuser',
            password: 'testpass123'
        });
        console.log(' Login successful:', loginResponse.data.message);
        
        const token = loginResponse.data.token;
        console.log('Token received:', token.substring(0, 20) + '...');
        
        // Test protected route - add item
        console.log('\n3. Testing Protected Route - Add Item...');
        const addItemResponse = await axios.post(`${BASE_URL}/items`, {
            name: 'Test Apple',
            category: 'Produce',
            expiryDate: '2024-12-31'
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ Item added successfully:', addItemResponse.data);
        
        // Test protected route - get items
        console.log('\n4. Testing Protected Route - Get Items...');
        const getItemsResponse = await axios.get(`${BASE_URL}/items`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ Items fetched successfully:', getItemsResponse.data);
        
        console.log('\n🎉 All authentication tests passed!');
        
    } catch (error) {
        if (error.response) {
            console.error('❌ Test failed:', error.response.data);
        } else {
            console.error('❌ Test failed:', error.message);
        }
    }
}

// Only run if server is running
testAuth();