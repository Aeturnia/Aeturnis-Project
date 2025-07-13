#!/usr/bin/env tsx

/**
 * Security Headers Validation Script
 * 
 * This script starts the server and tests that all security headers are properly configured.
 * Run with: npm run dev or tsx scripts/test-security-headers.ts
 */

import http from 'http';

const PORT = process.env['PORT'] || 3000;
const HOST = 'localhost';

// Expected security headers
const expectedHeaders = {
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'x-xss-protection': '1; mode=block',
  'referrer-policy': 'no-referrer',
  'x-permitted-cross-domain-policies': 'none',
};

async function testSecurityHeaders() {
  console.log('🔒 Testing Security Headers Implementation');
  console.log(`📡 Testing server at http://${HOST}:${PORT}`);
  
  return new Promise<void>((resolve, reject) => {
    const req = http.request({
      hostname: HOST,
      port: PORT,
      path: '/health',
      method: 'GET',
    }, (res) => {
      console.log(`\n📊 Response Status: ${res.statusCode}`);
      console.log('🛡️  Security Headers:');
      
      let allHeadersPresent = true;
      
      Object.entries(expectedHeaders).forEach(([header, expectedValue]) => {
        const actualValue = res.headers[header];
        const isPresent = actualValue === expectedValue;
        
        if (isPresent) {
          console.log(`✅ ${header}: ${actualValue}`);
        } else {
          console.log(`❌ ${header}: Expected "${expectedValue}", got "${actualValue}"`);
          allHeadersPresent = false;
        }
      });
      
      // Check for additional security headers
      console.log('\n🔍 Additional Security Headers:');
      const additionalHeaders = [
        'content-security-policy',
        'content-security-policy-report-only',
        'strict-transport-security',
        'x-download-options',
        'x-dns-prefetch-control',
      ];
      
      additionalHeaders.forEach(header => {
        const value = res.headers[header];
        if (value) {
          console.log(`✅ ${header}: ${value}`);
        }
      });
      
      // Check for headers that should NOT be present
      console.log('\n🚫 Headers that should NOT be present:');
      const bannedHeaders = ['x-powered-by', 'server'];
      
      bannedHeaders.forEach(header => {
        const value = res.headers[header];
        if (value) {
          console.log(`❌ ${header}: ${value} (should not be present)`);
          allHeadersPresent = false;
        } else {
          console.log(`✅ ${header}: Not present (good)`);
        }
      });
      
      console.log('\n🎯 CORS Configuration:');
      if (res.headers['access-control-allow-origin']) {
        console.log(`✅ access-control-allow-origin: ${res.headers['access-control-allow-origin']}`);
      }
      
      if (allHeadersPresent) {
        console.log('\n🎉 All required security headers are properly configured!');
        resolve();
      } else {
        console.log('\n⚠️  Some security headers are missing or misconfigured.');
        reject(new Error('Security headers validation failed'));
      }
    });
    
    req.on('error', (err) => {
      console.error('❌ Failed to connect to server:', err.message);
      console.log('💡 Make sure the server is running with: npm run dev');
      reject(err);
    });
    
    req.setTimeout(5000, () => {
      console.error('❌ Request timeout - server may not be running');
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

// Test CORS preflight
async function testCORSPreflight() {
  console.log('\n🌐 Testing CORS Preflight Request');
  
  return new Promise<void>((resolve, reject) => {
    const req = http.request({
      hostname: HOST,
      port: PORT,
      path: '/api/v1',
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3001',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type,Authorization',
      },
    }, (res) => {
      console.log(`📊 CORS Preflight Status: ${res.statusCode}`);
      
      const corsHeaders = {
        'access-control-allow-origin': 'http://localhost:3001',
        'access-control-allow-credentials': 'true',
      };
      
      let corsValid = true;
      
      Object.entries(corsHeaders).forEach(([header, expectedValue]) => {
        const actualValue = res.headers[header];
        if (actualValue === expectedValue) {
          console.log(`✅ ${header}: ${actualValue}`);
        } else {
          console.log(`❌ ${header}: Expected "${expectedValue}", got "${actualValue}"`);
          corsValid = false;
        }
      });
      
      if (corsValid) {
        console.log('🎉 CORS configuration is working correctly!');
        resolve();
      } else {
        console.log('⚠️  CORS configuration needs attention.');
        reject(new Error('CORS validation failed'));
      }
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => reject(new Error('CORS request timeout')));
    req.end();
  });
}

// Main execution
async function main() {
  try {
    await testSecurityHeaders();
    await testCORSPreflight();
    console.log('\n🔒 Security configuration validation completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Security validation failed:', error);
    process.exit(1);
  }
}

// Only run if this file is executed directly (ESM version)
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { testSecurityHeaders, testCORSPreflight };