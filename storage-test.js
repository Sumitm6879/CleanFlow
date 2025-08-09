// Storage Test Utility
// Copy and paste this into your browser console to test storage

async function testStorageComplete() {
  console.log('🔧 Complete Storage Test Starting...');
  
  try {
    // Check if we have access to the supabase client
    if (typeof window.supabase === 'undefined') {
      console.error('❌ Supabase client not available');
      return;
    }

    const supabase = window.supabase;

    // 1. Check authentication
    console.log('1️⃣ Checking authentication...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('❌ Auth error:', authError);
      return;
    }
    console.log('✅ User authenticated:', user?.email);

    // 2. List buckets
    console.log('2️⃣ Checking storage buckets...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
      console.error('❌ Bucket list error:', bucketError);
      return;
    }
    console.log('✅ Available buckets:', buckets?.map(b => b.name));

    // 3. Test upload to avatars bucket
    console.log('3️⃣ Testing avatar upload...');
    const testFile = new File(['test content'], 'test-avatar.txt', { type: 'text/plain' });
    const testPath = `test-${Date.now()}.txt`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(testPath, testFile, { upsert: true });

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      console.log('Error details:', {
        message: uploadError.message,
        statusCode: uploadError.statusCode,
        error: uploadError.error
      });
    } else {
      console.log('✅ Upload successful:', uploadData);
      
      // Clean up test file
      await supabase.storage.from('avatars').remove([testPath]);
      console.log('✅ Cleanup successful');
    }

    // 4. Test image upload simulation
    console.log('4️⃣ Testing image upload simulation...');
    
    // Create a small image-like blob
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0, 0, 100, 100);
    
    canvas.toBlob(async (blob) => {
      if (blob) {
        const imageFile = new File([blob], 'test-image.png', { type: 'image/png' });
        const imagePath = `test-image-${Date.now()}.png`;
        
        const { data: imageUpload, error: imageError } = await supabase.storage
          .from('avatars')
          .upload(imagePath, imageFile, { upsert: true });
          
        if (imageError) {
          console.error('❌ Image upload error:', imageError);
        } else {
          console.log('✅ Image upload successful:', imageUpload);
          
          // Get public URL
          const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(imagePath);
          console.log('✅ Public URL:', urlData.publicUrl);
          
          // Clean up
          await supabase.storage.from('avatars').remove([imagePath]);
          console.log('✅ Image cleanup successful');
        }
      }
    }, 'image/png');

    console.log('✅ Storage test completed successfully!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Quick functions for individual tests
window.testStorage = testStorageComplete;
window.quickStorageTest = async () => {
  try {
    const result = await window.debugStorage();
    return result;
  } catch (error) {
    console.error('Quick test failed:', error);
    return false;
  }
};

console.log('🔧 Storage test utilities loaded!');
console.log('Run: testStorage() or quickStorageTest()');
