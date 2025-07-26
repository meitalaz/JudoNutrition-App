#!/usr/bin/env python3
"""
Test script for the forgot_password API route
Tests the /api/forgot_password endpoint using FlaskClient
"""

import sys
import json
from app import app

def test_forgot_password_api():
    """Test the forgot_password API endpoint"""
    print("🧪 Testing /api/forgot_password endpoint...")
    print("=" * 50)
    
    with app.test_client() as client:
        # Test 1: Valid email
        print("\n📧 Test 1: Valid email")
        print("-" * 30)
        
        test_email = "test@example.com"
        response = client.post('/api/forgot_password', 
                             json={'email': test_email},
                             content_type='application/json')
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.get_json(), indent=2, ensure_ascii=False)}")
        
        # Test 2: Invalid email format
        print("\n📧 Test 2: Invalid email format")
        print("-" * 30)
        
        response = client.post('/api/forgot_password', 
                             json={'email': 'invalid-email'},
                             content_type='application/json')
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.get_json(), indent=2, ensure_ascii=False)}")
        
        # Test 3: Missing email
        print("\n📧 Test 3: Missing email")
        print("-" * 30)
        
        response = client.post('/api/forgot_password', 
                             json={},
                             content_type='application/json')
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.get_json(), indent=2, ensure_ascii=False)}")
        
        # Test 4: Non-existent email
        print("\n📧 Test 4: Non-existent email")
        print("-" * 30)
        
        response = client.post('/api/forgot_password', 
                             json={'email': 'nonexistent@example.com'},
                             content_type='application/json')
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.get_json(), indent=2, ensure_ascii=False)}")
        
        # Test 5: Empty email
        print("\n📧 Test 5: Empty email")
        print("-" * 30)
        
        response = client.post('/api/forgot_password', 
                             json={'email': ''},
                             content_type='application/json')
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.get_json(), indent=2, ensure_ascii=False)}")

def test_reset_password_api():
    """Test the reset_password API endpoint"""
    print("\n\n🔐 Testing /api/reset_password endpoint...")
    print("=" * 50)
    
    with app.test_client() as client:
        # First, get a reset token by calling forgot_password
        print("\n📧 Getting reset token...")
        response = client.post('/api/forgot_password', 
                             json={'email': 'test@example.com'},
                             content_type='application/json')
        
        if response.status_code == 200:
            data = response.get_json()
            reset_token = data.get('reset_token')
            
            if reset_token:
                print(f"✅ Got reset token: {reset_token}")
                
                # Test reset password with valid token
                print("\n🔐 Test: Reset password with valid token")
                print("-" * 40)
                
                response = client.post('/api/reset_password', 
                                     json={'reset_token': reset_token, 'new_password': 'newpassword123'},
                                     content_type='application/json')
                
                print(f"Status Code: {response.status_code}")
                print(f"Response: {json.dumps(response.get_json(), indent=2, ensure_ascii=False)}")
                
                # Test reset password with invalid token
                print("\n🔐 Test: Reset password with invalid token")
                print("-" * 40)
                
                response = client.post('/api/reset_password', 
                                     json={'reset_token': 'invalid-token', 'new_password': 'newpassword123'},
                                     content_type='application/json')
                
                print(f"Status Code: {response.status_code}")
                print(f"Response: {json.dumps(response.get_json(), indent=2, ensure_ascii=False)}")
            else:
                print("❌ No reset token received")
        else:
            print("❌ Failed to get reset token")

if __name__ == "__main__":
    try:
        print("🚀 Starting API tests...")
        print("Database initialization should happen automatically...")
        
        test_forgot_password_api()
        test_reset_password_api()
        
        print("\n✅ All tests completed!")
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1) 