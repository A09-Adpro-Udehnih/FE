// Test JSON parsing with error handling

async function testFetch(url, emptyResponse = false, invalidJson = false) {
  console.log(`Testing ${url}:`);
  
  try {
    let response;
    
    // Simulate fetch behavior
    if (emptyResponse) {
      console.log("- Simulating empty response");
      response = { 
        text: async () => "", 
        ok: true 
      };
    } else if (invalidJson) {
      console.log("- Simulating invalid JSON");
      response = { 
        text: async () => "Not JSON data", 
        ok: true 
      };
    } else {
      console.log("- Simulating valid JSON");
      response = { 
        text: async () => JSON.stringify({
          success: true,
          code: 200,
          message: "Success",
          error: null,
          data: {
            status: "ACCEPTED",
            tutorApplicationId: "123"
          }
        }),
        ok: true
      };
    }
    
    if (!response.ok) {
      throw new Error("Response not OK");
    }
    
    // Get response text
    const text = await response.text();
    
    // Handle empty response
    if (!text || text.trim() === '') {
      console.log("  Result: Empty response handled correctly");
      return;
    }
    
    // Parse JSON with error handling
    try {
      const data = JSON.parse(text);
      console.log(`  Result: Successfully parsed JSON: ${JSON.stringify(data, null, 2)}`);
    } catch (jsonError) {
      console.log(`  Result: JSON parsing error handled: ${jsonError.message}`);
    }
    
  } catch (error) {
    console.log(`  Result: Error handled: ${error.message}`);
  }
  
  console.log('-------------------');
}

// Run tests
(async () => {
  console.log("TESTING JSON HANDLING IN FETCH REQUESTS\n");
  
  await testFetch("/api/normal");
  await testFetch("/api/empty", true);
  await testFetch("/api/invalid", false, true);
  
  console.log("\nAll tests completed");
})();
