const BASE_URL = 'http://localhost:3030/api';

async function testEndpoints() {
  console.log('\n🧪 Testing MSJ API Endpoints\n');
  console.log('='.repeat(60));

  try {
    // Test 1: Get all centers
    console.log('\n✅ Test 1: GET /api/centers');
    console.log('-'.repeat(60));
    const centersRes = await fetch(`${BASE_URL}/centers`);
    const centersData = await centersRes.json();
    console.log(`Found ${centersData.data.centers.length} centers:`);
    centersData.data.centers.forEach((center) => {
      console.log(`  • ${center.name}`);
      console.log(`    Wilaya: ${center.wilaya}`);
      console.log(`    Location: ${center.latitude}, ${center.longitude}`);
      console.log(`    Phone: ${center.phone}`);
      console.log();
    });

    // Test 2: Get centers with clubs
    console.log('\n✅ Test 2: GET /api/centers?include=clubs');
    console.log('-'.repeat(60));
    const centersWithClubsRes = await fetch(`${BASE_URL}/centers?include=clubs`);
    const centersWithClubsData = await centersWithClubsRes.json();
    console.log(`Centers with clubs populated:`);
    centersWithClubsData.data.centers.forEach((center) => {
      console.log(`  • ${center.name}: ${center.clubs?.length || 0} clubs`);
      center.clubs?.forEach((club) => {
        console.log(`    - ${club.name} (${club.category})`);
      });
      console.log();
    });

    // Test 3: Get centers with all data
    console.log('\n✅ Test 3: GET /api/centers?include=all');
    console.log('-'.repeat(60));
    const centersAllRes = await fetch(`${BASE_URL}/centers?include=all`);
    const centersAllData = await centersAllRes.json();
    console.log(`Centers with all related data:`);
    centersAllData.data.centers.forEach((center) => {
      console.log(`  • ${center.name}`);
      console.log(`    Clubs: ${center.clubs?.length || 0}`);
      console.log(`    Events: ${center.events?.length || 0}`);
      console.log(`    Workshops: ${center.workshops?.length || 0}`);
      console.log();
    });

    // Test 4: Get all clubs
    console.log('\n✅ Test 4: GET /api/clubs');
    console.log('-'.repeat(60));
    const clubsRes = await fetch(`${BASE_URL}/clubs`);
    const clubsData = await clubsRes.json();
    console.log(`Found ${clubsData.count} clubs:`);
    clubsData.data.clubs.forEach((club) => {
      console.log(`  • ${club.name} (${club.category})`);
      console.log(`    Center: ${club.centerId.name}`);
      console.log(`    Members: ${club.memberIds.length}`);
      console.log(`    Images: ${club.images.length}`);
      console.log();
    });

    // Test 5: Get all events
    console.log('\n✅ Test 5: GET /api/events');
    console.log('-'.repeat(60));
    const eventsRes = await fetch(`${BASE_URL}/events`);
    const eventsData = await eventsRes.json();
    console.log(`Found ${eventsData.data.events.length} events:`);
    eventsData.data.events.forEach((event) => {
      console.log(`  • ${event.title}`);
      console.log(`    Center: ${event.centerId.name}`);
      console.log(`    Date: ${new Date(event.date).toLocaleString()}`);
      console.log(`    Category: ${event.category}`);
      console.log(`    Seats: ${event.seats} (${event.bookedCount} booked)`);
      console.log();
    });

    // Test 6: Get a specific center with all data
    const centerId = centersData.data.centers[0]._id;
    console.log('\n✅ Test 6: GET /api/centers/:id?include=all');
    console.log('-'.repeat(60));
    const centerRes = await fetch(`${BASE_URL}/centers/${centerId}?include=all`);
    const centerData = await centerRes.json();
    const center = centerData.data.center;
    console.log(`Center Details: ${center.name}`);
    console.log(`  Clubs: ${center.clubs?.length || 0}`);
    center.clubs?.forEach((club) => {
      console.log(`    - ${club.name}`);
    });
    console.log(`  Events: ${center.events?.length || 0}`);
    center.events?.forEach((event) => {
      console.log(`    - ${event.title}`);
    });
    console.log(`  Workshops: ${center.workshops?.length || 0}`);
    center.workshops?.forEach((workshop) => {
      console.log(`    - ${workshop.title}`);
    });
    console.log();

    console.log('='.repeat(60));
    console.log('\n✅ All tests passed!\n');
  } catch (error) {
    console.error('❌ Error testing endpoints:', error.message);
    process.exit(1);
  }
}

testEndpoints();
