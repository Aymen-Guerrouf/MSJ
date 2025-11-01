#!/bin/bash

echo "==================================="
echo "Testing MSJ API Endpoints"
echo "==================================="
echo ""

# Test 1: Get all centers
echo "1. GET /api/centers - Get all centers"
echo "-----------------------------------"
response=$(curl -s -m 5 http://localhost:3030/api/centers)
echo "$response" | head -c 500
echo ""
echo ""

# Test 2: Get all centers with clubs included
echo "2. GET /api/centers?include=clubs - Get centers with clubs"
echo "-----------------------------------"
response=$(curl -s -m 5 "http://localhost:3030/api/centers?include=clubs")
echo "$response" | head -c 500
echo ""
echo ""

# Test 3: Get all centers with everything
echo "3. GET /api/centers?include=all - Get centers with all related data"
echo "-----------------------------------"
response=$(curl -s -m 5 "http://localhost:3030/api/centers?include=all")
echo "$response" | head -c 500
echo ""
echo ""

# Test 4: Get all clubs
echo "4. GET /api/clubs - Get all clubs"
echo "-----------------------------------"
response=$(curl -s -m 5 http://localhost:3030/api/clubs)
echo "$response" | head -c 500
echo ""
echo ""

# Test 5: Get all events
echo "5. GET /api/events - Get all events"
echo "-----------------------------------"
response=$(curl -s -m 5 http://localhost:3030/api/events)
echo "$response" | head -c 500
echo ""
echo ""

echo "==================================="
echo "Test completed!"
echo "==================================="
